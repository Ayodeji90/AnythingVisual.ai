import json
import logging
import asyncio
from typing import List, Optional
import openai
from ai_stack.schemas import SceneObject
from ai_stack.models import model_settings
from ai_stack.prompts.loader import prompt_loader

logger = logging.getLogger("ai_stack.enrichment")

class VisualEnricher:
    def __init__(self, client: openai.AsyncOpenAI):
        self.client = client
        self.model = model_settings.ENRICHMENT_MODEL

    def _get_system_prompt(self) -> str:
        return prompt_loader.get_prompt("enrichment")

    async def enrich_scene(self, scene: SceneObject, trace_id: Optional[str] = None) -> SceneObject:
        log_prefix = f"[{trace_id}] " if trace_id else ""
        logger.info(f"{log_prefix}Enriching scene {scene.scene_number}...")
        messages = [
            {"role": "system", "content": self._get_system_prompt()},
            {"role": "user", "content": f"Enrich this scene:\n\n{scene.json()}"}
        ]
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                response_format={"type": "json_object"}
            )
            
            data = json.loads(response.choices[0].message.content)
            
            scene.shooting_style = data.get("shooting_style")
            scene.shot_types = data.get("shot_types", [])
            scene.lighting = data.get("lighting")
            scene.props = data.get("props", [])
            scene.environment_elements = data.get("environment_elements", [])
            
            logger.info(f"{log_prefix}Scene {scene.scene_number} enriched.")
            return scene
        except Exception as e:
            logger.error(f"{log_prefix}Error enriching scene {scene.scene_number}: {e}")
            # Return original scene to avoid pipeline crash if one enrichment fails
            return scene

    async def enrich_all_scenes(self, scenes: List[SceneObject], trace_id: Optional[str] = None) -> List[SceneObject]:
        log_prefix = f"[{trace_id}] " if trace_id else ""
        logger.info(f"{log_prefix}Enriching {len(scenes)} scenes in parallel...")
        tasks = [self.enrich_scene(scene, trace_id=trace_id) for scene in scenes]
        return await asyncio.gather(*tasks)
