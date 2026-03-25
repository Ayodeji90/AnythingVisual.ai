import openai
import json
from typing import Dict, Any, List
from pydantic import BaseModel
from backend.core.config import settings
from ai_stack.models import model_settings

def _build_sync_client() -> openai.OpenAI:
    """Build the correct sync OpenAI client based on the LLM_PROVIDER setting."""
    provider = settings.LLM_PROVIDER.lower()
    
    if provider == "groq":
        return openai.OpenAI(
            api_key=settings.GROQ_API_KEY,
            base_url="https://api.groq.com/openai/v1"
        )
    else:
        return openai.OpenAI(
            api_key=settings.OPENAI_API_KEY
        )

class LLMEngine:
    def __init__(self):
        self.client = _build_sync_client()
        self.model = model_settings.STRUCTURING_MODEL
        
        # Prompt Templates Namespaced by Content Type
        self.templates = {
            "film": {
                "structure": "Analyze this script and return a structured JSON blueprint with logline, synopsis, and scene-by-scene breakdown. Content: {text}",
                "scene_detail": "For this scene, provide a production pack in JSON including props, wardrobe, and shot suggestions. Scene: {scene_text}"
            },
            "ad_campaign": {
                "structure": "Analyze this creative brief and return a structured JSON campaign blueprint with core message, segments, and shot suggestions. Content: {text}",
                "scene_detail": "For this campaign segment, provide production details in JSON including brand assets, wardrobe, and camera notes. Segment: {scene_text}"
            }
        }

    async def generate_blueprint_structure(self, content_type: str, text: str) -> Dict[str, Any]:
        template = (
            "Analyze this {content_type} and return a structured JSON blueprint. "
            "The JSON MUST have these exact keys with string values: 'logline' (one sentence), "
            "'synopsis' (one paragraph string), and 'scenes' (a list of objects, each with "
            "'slug', 'int_ext', 'day_night', 'location', 'description'). "
            "Content: {text}"
        )
        prompt = template.format(content_type=content_type, text=text)
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        data = json.loads(response.choices[0].message.content)
        
        # Robustness: Ensure logline and synopsis are strings
        if isinstance(data.get("synopsis"), (dict, list)):
            data["synopsis"] = json.dumps(data["synopsis"])
        if isinstance(data.get("logline"), (dict, list)):
            data["logline"] = json.dumps(data["logline"])
            
        return data

    async def generate_scene_pack(self, content_type: str, scene_text: str) -> Dict[str, Any]:
        template = (
            "For this scene, provide a production pack in JSON format. "
            "The JSON MUST have these string keys: 'props', 'wardrobe', 'shot_list', 'continuity_notes'. "
            "Scene: {scene_text}"
        )
        prompt = template.format(scene_text=scene_text)
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        data = json.loads(response.choices[0].message.content)
        
        # Robustness: Stringify all top-level values for database
        for key in ["props", "wardrobe", "shot_list", "continuity_notes"]:
            if key in data and not isinstance(data[key], str):
                data[key] = json.dumps(data[key])
                
        return data

llm_engine = LLMEngine()
