import logging
import openai
from ai_stack.schemas import SceneObject
from ai_stack.models import model_settings

logger = logging.getLogger("ai_stack.generation")

class ImageGenerator:
    def __init__(self, client: openai.AsyncOpenAI):
        self.client = client
        self.provider = model_settings.IMAGE_GEN_PROVIDER

    def assemble_prompt(self, scene: SceneObject) -> str:
        """
        Part A: Deterministic prompt assembly. 
        """
        location = f"{scene.setting} {scene.location}"
        time = scene.time_of_day
        style = scene.shooting_style or "cinematic"
        shots = ", ".join(scene.shot_types[:2]) if scene.shot_types else "wide shot"
        lighting = scene.lighting or "natural lighting"
        
        base_prompt = f"A professional cinematic still for a movie scene. Location: {location}, {time}. "
        visual_desc = f"Visual Style: {style}. Shot Types: {shots}. Lighting: {lighting}. "
        action_desc = f"Scene Context: {scene.objective}. "
        quality_suffix = "highly detailed, 8k, photorealistic, professional color grading, film grain."
        
        return f"{base_prompt} {visual_desc} {action_desc} {quality_suffix}"

    async def generate_keyframe(self, scene: SceneObject) -> str:
        """
        Part B: Image API call.
        """
        prompt = self.assemble_prompt(scene)
        logger.info(f"Generating keyframe for scene {scene.scene_number} with provider {self.provider}")
        
        # Simulating API call
        # In practice: response = await self.client.images.generate(...) or custom fetch
        
        logger.info(f"Keyframe generated for scene {scene.scene_number}")
        return f"https://generated-images.ai/keyframes/{scene.scene_number}_placeholder.png"
