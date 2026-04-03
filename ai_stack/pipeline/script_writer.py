import json
import yaml
import logging
from typing import Optional, AsyncGenerator
from pathlib import Path
import openai
from ai_stack.schemas import (
    ScriptOutline, GeneratedScript, ScriptGenerationState, ScriptGenStage
)
from ai_stack.models import model_settings

logger = logging.getLogger("ai_stack.script_writer")

# Load prompts from YAML
_PROMPTS_DIR = Path(__file__).parent.parent / "prompts"

def _load_prompt(stage_key: str) -> str:
    yaml_path = _PROMPTS_DIR / "script_writer.yaml"
    with open(yaml_path, "r") as f:
        data = yaml.safe_load(f)
    prompt = data.get(stage_key)
    if not prompt:
        raise KeyError(f"Prompt key '{stage_key}' not found in script_writer.yaml")
    return prompt.strip()


class ScriptWriter:
    """
    Multi-stage screenplay generator.
    Takes a raw idea and produces a full, formatted movie script.
    
    Stages:
      1. Concept Development — idea → rich story concept with characters & beats
      2. Scene Outline — concept → detailed scene-by-scene outline
      3. Script Writing — outline → full screenplay in industry format
      4. Polish — draft → refined, polished final script
    """

    def __init__(self, client: openai.AsyncOpenAI):
        self.client = client
        self.model = model_settings.SCRIPT_WRITER_MODEL

    async def run_script_generation(
        self,
        project_id: str,
        raw_idea: str,
        script_format: str = "short",
        target_pages: Optional[int] = None,
    ) -> AsyncGenerator[ScriptGenerationState, None]:
        """
        Async generator that yields state after each stage for SSE streaming.
        """
        state = ScriptGenerationState(
            project_id=project_id,
            status="processing",
        )

        # Determine target page count from format
        if target_pages is None:
            format_pages = {
                "short": 15, "feature": 90, "pilot": 45, "webisode": 8,
            }
            target_pages = format_pages.get(script_format, 30)

        try:
            # STAGE 1: Concept Development
            state.stage_number = 1
            state.current_stage = ScriptGenStage.CONCEPT
            yield state

            outline = await self._develop_concept(raw_idea, script_format, target_pages, project_id)
            state.outline = outline
            logger.info(f"[{project_id}] Concept developed: {outline.title}")

            # STAGE 2: Scene Outline
            state.stage_number = 2
            state.current_stage = ScriptGenStage.OUTLINE
            yield state

            scene_outline = await self._create_outline(outline, script_format, target_pages, project_id)
            # scene_outline is a dict with scenes list and total_estimated_pages

            # STAGE 3: Script Writing
            state.stage_number = 3
            state.current_stage = ScriptGenStage.SCRIPT_WRITING
            yield state

            draft = await self._write_script(outline, scene_outline, script_format, target_pages, project_id)
            # draft is {"script_text": "...", "page_count": N}

            # STAGE 4: Polish
            state.stage_number = 4
            state.current_stage = ScriptGenStage.POLISH
            yield state

            polished = await self._polish_script(draft, outline, project_id)

            # Build final GeneratedScript
            state.generated_script = GeneratedScript(
                title=outline.title,
                logline=outline.logline,
                genre=outline.genre,
                format=script_format,
                target_pages=target_pages,
                outline=outline,
                full_script=polished.get("script_text", draft.get("script_text", "")),
                page_count=polished.get("page_count", draft.get("page_count", target_pages)),
            )
            state.status = "complete"

        except Exception as e:
            logger.exception(f"[{project_id}] Script generation failed: {e}")
            state.status = "failed"
            state.error_message = str(e)
        finally:
            yield state
            logger.info(f"[{project_id}] Script generation finished: {state.status}")

    async def _develop_concept(
        self, raw_idea: str, script_format: str, target_pages: int, trace_id: str
    ) -> ScriptOutline:
        """Stage 1: Raw idea → structured story concept."""
        system_prompt = _load_prompt("concept_development")
        user_prompt = (
            f"Idea: {raw_idea}\n\n"
            f"Format: {script_format} (target ~{target_pages} pages)\n"
            f"Develop this into a full story concept."
        )

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.8,
        )

        data = json.loads(response.choices[0].message.content)
        logger.info(f"[{trace_id}] Concept development complete: {data.get('title', 'Untitled')}")
        return ScriptOutline(**data)

    async def _create_outline(
        self, outline: ScriptOutline, script_format: str, target_pages: int, trace_id: str
    ) -> dict:
        """Stage 2: Story concept → scene-by-scene outline."""
        system_prompt = _load_prompt("outline")
        user_prompt = (
            f"Story Concept:\n{outline.json()}\n\n"
            f"Format: {script_format} (target ~{target_pages} pages)\n"
            f"Create a detailed scene-by-scene outline."
        )

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.6,
        )

        data = json.loads(response.choices[0].message.content)
        scene_count = len(data.get("scenes", []))
        logger.info(f"[{trace_id}] Outline created with {scene_count} scenes")
        return data

    async def _write_script(
        self, outline: ScriptOutline, scene_outline: dict, script_format: str, target_pages: int, trace_id: str
    ) -> dict:
        """Stage 3: Outline → full screenplay draft."""
        system_prompt = _load_prompt("script_writing")
        user_prompt = (
            f"Title: {outline.title}\n"
            f"Genre: {outline.genre}\n"
            f"Tone: {outline.tone}\n"
            f"Format: {script_format} (target ~{target_pages} pages)\n\n"
            f"Characters:\n{json.dumps(outline.character_descriptions, indent=2)}\n\n"
            f"Scene Outline:\n{json.dumps(scene_outline.get('scenes', []), indent=2)}\n\n"
            f"Write the COMPLETE screenplay following this outline."
        )

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
        )

        data = json.loads(response.choices[0].message.content)
        logger.info(f"[{trace_id}] Script draft written: ~{data.get('page_count', '?')} pages")
        return data

    async def _polish_script(self, draft: dict, outline: ScriptOutline, trace_id: str) -> dict:
        """Stage 4: Draft → polished final screenplay."""
        system_prompt = _load_prompt("polish")
        script_text = draft.get("script_text", "")

        # If script is too short, skip polish and return draft
        if len(script_text) < 500:
            logger.warning(f"[{trace_id}] Script too short for polish stage, returning draft as-is")
            return draft

        user_prompt = (
            f"Title: {outline.title}\n"
            f"Genre: {outline.genre}\n\n"
            f"SCREENPLAY TO POLISH:\n\n{script_text}"
        )

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0.4,
            )

            data = json.loads(response.choices[0].message.content)
            changes = data.get("changes_summary", "No summary")
            logger.info(f"[{trace_id}] Script polished. Changes: {changes}")
            return data
        except Exception as e:
            logger.warning(f"[{trace_id}] Polish stage failed ({e}), returning unpolished draft")
            return draft
