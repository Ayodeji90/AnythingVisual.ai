import json
import logging
from typing import Optional
import openai
from ai_stack.schemas import StructuredScript
from ai_stack.models import model_settings

logger = logging.getLogger("ai_stack.structuring")

class ScriptStructurer:
    def __init__(self, client: openai.AsyncOpenAI):
        self.client = client
        self.model = model_settings.STRUCTURE_MODEL

    def _get_system_prompt(self) -> str:
        return """
        You are an expert Screenwriter and Creative Producer.
        Your job is to take raw input and turn it into a properly formatted, coherent script.
        
        If it's a rough idea, expand it logically. 
        If it's bullet points, connect them into a narrative. 
        If it's a script with gaps, fill them.
        
        Return a JSON object with:
        - title: Project Title
        - logline: One-sentence hook
        - synopsis: Brief overview
        - script_content: The full, formatted script text (use proper screenwriting conventions)
        
        Use chain-of-thought internally: first reason about the narrative structure, then write.
        Return ONLY the JSON.
        """

    async def structure_script(self, raw_input: str, triage_result: TriageResult, trace_id: Optional[str] = None) -> StructuredScript:
        log_prefix = f"[{trace_id}] " if trace_id else ""
        logger.info(f"{log_prefix}Structuring script. Type: {triage_result.content_type}, Genre: {triage_result.genre}")
        
        # Build context string from triage results
        context = f"""
        CONTENT TYPE: {triage_result.content_type}
        GENRE: {triage_result.genre}
        DETECTED CHARACTERS: {', '.join(triage_result.detected_characters)}
        ESTIMATED SCENES: {triage_result.estimated_scenes}
        LANGUAGE: {triage_result.language}
        """
        
        messages = [
            {"role": "system", "content": self._get_system_prompt()},
            {"role": "user", "content": f"Context:\n{context}\n\nInput Content:\n{raw_input}"}
        ]
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                response_format={"type": "json_object"}
            )
            
            data = json.loads(response.choices[0].message.content)
            logger.info(f"{log_prefix}Script structuring completed successfully.")
            return StructuredScript(**data)
        except Exception as e:
            logger.error(f"{log_prefix}Error structuring script: {e}")
            raise
