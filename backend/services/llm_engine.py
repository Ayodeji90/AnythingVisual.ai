import openai
from typing import Dict, Any, List
from pydantic import BaseModel
from backend.core.config import settings

class LLMEngine:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.client = openai.OpenAI(api_key=self.api_key)
        
        # Prompt Templates Namespaced by Content Type
        self.templates = {
            "film": {
                "structure": "Analyze this script and return a structured blueprint with logline, synopsis, and scene-by-scene breakdown. Content: {text}",
                "scene_detail": "For this scene, provide a production pack including props, wardrobe, and shot suggestions. Scene: {scene_text}"
            },
            "ad_campaign": {
                "structure": "Analyze this creative brief and return a structured campaign blueprint with core message, segments, and shot suggestions. Content: {text}",
                "scene_detail": "For this campaign segment, provide production details including brand assets, wardrobe, and camera notes. Segment: {scene_text}"
            }
        }

    async def generate_blueprint_structure(self, content_type: str, text: str) -> Dict[str, Any]:
        template = self.templates.get(content_type, self.templates["film"])["structure"]
        prompt = template.format(text=text)
        
        # In a real implementation, we use instructor or similar for schema enforcement
        # For now, we simulate the structured response
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return response.choices[0].message.content

    async def generate_scene_pack(self, content_type: str, scene_text: str) -> Dict[str, Any]:
        template = self.templates.get(content_type, self.templates["film"])["scene_detail"]
        prompt = template.format(scene_text=scene_text)
        
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return response.choices[0].message.content

llm_engine = LLMEngine()
