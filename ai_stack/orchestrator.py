import logging
import asyncio
from typing import List, AsyncGenerator, Optional
import openai
from ai_stack.schemas import PipelineState, TriageResult, StructuredScript, SceneObject
from ai_stack.pipeline.triage import InputTriager
from ai_stack.pipeline.structuring import ScriptStructurer
from ai_stack.pipeline.segmentation import SceneSegmenter
from ai_stack.pipeline.enrichment import VisualEnricher
from ai_stack.pipeline.generation import ImageGenerator

logger = logging.getLogger("ai_stack.orchestrator")

class PipelineOrchestrator:
    def __init__(self, client: openai.AsyncOpenAI):
        """
        Dependency Injection of AsyncOpenAI client.
        The client is shared across all tools.
        """
        self.client = client
        self.triage_tool = InputTriager(self.client)
        self.structure_tool = ScriptStructurer(self.client)
        self.segment_tool = SceneSegmenter(self.client)
        self.enrich_tool = VisualEnricher(self.client)
        self.gen_tool = ImageGenerator(self.client)
        self.pipeline_timeout = 120.0 # 2 minute timeout for the full pipeline

    async def run_pipeline(self, project_id: str, raw_input: str) -> AsyncGenerator[PipelineState, None]:
        state = PipelineState(project_id=project_id, status="processing")
        log_prefix = f"[{project_id}] "
        
        try:
            # Wrap the entire pipeline in a timeout
            async with asyncio.timeout(self.pipeline_timeout):
                
                # STAGE 1: TRIAGE
                state.current_stage = 1
                yield state
                try:
                    state.triage = await self.triage_tool.triage_input(raw_input, trace_id=project_id)
                except Exception as e:
                    logger.error(f"{log_prefix}Failed at Stage 1: {e}")
                    state.status = "failed"
                    state.failed_stage = 1
                    state.error_message = f"Triage failed: {str(e)}"
                    return # Stop pipeline on critical stage 1 failure

                # STAGE 2: STRUCTURING
                state.current_stage = 2
                yield state
                try:
                    # Pass full triage result for context forwarding
                    state.script = await self.structure_tool.structure_script(
                        raw_input, 
                        triage_result=state.triage,
                        trace_id=project_id
                    )
                except Exception as e:
                    logger.error(f"{log_prefix}Failed at Stage 2: {e}")
                    state.status = "failed"
                    state.failed_stage = 2
                    state.error_message = f"Structuring failed: {str(e)}"
                    return

                # STAGE 3: SEGMENTATION
                state.current_stage = 3
                yield state
                try:
                    state.scenes = await self.segment_tool.segment_script(
                        state.script.script_content,
                        trace_id=project_id
                    )
                    if not state.scenes:
                        raise ValueError("No scenes were extracted from the script.")
                except Exception as e:
                    logger.error(f"{log_prefix}Failed at Stage 3: {e}")
                    state.status = "failed"
                    state.failed_stage = 3
                    state.error_message = f"Segmentation failed: {str(e)}"
                    return

                # STAGE 4: ENRICHMENT (Parallelized)
                state.current_stage = 4
                yield state
                try:
                    state.scenes = await self.enrich_tool.enrich_all_scenes(
                        state.scenes,
                        trace_id=project_id
                    )
                except Exception as e:
                    # Enrichment failure might be partial/resilient
                    logger.warning(f"{log_prefix}Partial failure at Stage 4: {e}")
                    # We might choose to proceed with what we have
                
                state.status = "complete"

        except asyncio.TimeoutError:
            logger.error(f"{log_prefix}Pipeline timed out after {self.pipeline_timeout}s")
            state.status = "failed"
            state.error_message = "Pipeline timed out."
        except GeneratorExit:
            logger.warning(f"{log_prefix}Generator closed by caller. Cancelling pipeline.")
            # Tasks are implicitly cancelled when the task running this generator is cancelled
            raise
        except Exception as e:
            logger.exception(f"{log_prefix}Unexpected pipeline error: {e}")
            state.status = "failed"
            state.error_message = f"Unexpected error: {str(e)}"
        finally:
            # Ensure a terminal state is ALWAYS yielded
            yield state
            logger.info(f"{log_prefix}Pipeline finished with status: {state.status}")
