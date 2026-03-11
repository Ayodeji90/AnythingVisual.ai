import re
import logging
import xml.etree.ElementTree as ET
from typing import List
import openai
from ai_stack.schemas import SceneObject
from ai_stack.models import model_settings

logger = logging.getLogger("ai_stack.segmentation")

class SceneSegmenter:
    def __init__(self, client: openai.AsyncOpenAI):
        self.client = client
        self.model = model_settings.SEGMENTATION_MODEL

    def _get_system_prompt(self) -> str:
        return """
        You are an expert Script Supervisor and Scene Analyst. 
        Your job is to take a formatted script and break it into individual scenes.
        
        CRITICAL RULES:
        1. Every scene boundary must be detected by: location changes, time-of-day shifts, character entrances/exits, or tonal pivots.
        2. Wrap EVERY scene in a <scene> tag.
        3. Inside <scene>, use the following tags:
           <title>: Short descriptive title
           <location>: Specific setting (e.g., "Kitchen", "Spaceship Bridge")
           <setting>: INT. or EXT.
           <time_of_day>: DAY, NIGHT, DAWN, DUSK, etc.
           <characters>: Comma-separated list of characters present
           <objective>: What is the primary goal of this scene?
           <tone>: Emotional tone
           <energy>: Visual energy level (Low, Medium, High, Explosive)
           <content>: The raw script text for this scene
        
        Output ONLY the XML. Do not include any other text.
        """

    async def segment_script(self, script_text: str, trace_id: Optional[str] = None) -> List[SceneObject]:
        log_prefix = f"[{trace_id}] " if trace_id else ""
        logger.info(f"{log_prefix}Segmenting script into scenes...")
        messages = [
            {"role": "system", "content": self._get_system_prompt()},
            {"role": "user", "content": f"Break this script into scenes:\n\n{script_text}"}
        ]
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.2
            )
            
            raw_xml = response.choices[0].message.content
            scenes = self._parse_scenes_xml(raw_xml)
            logger.info(f"{log_prefix}Successfully segmented {len(scenes)} scenes.")
            return scenes
        except Exception as e:
            logger.error(f"{log_prefix}Error during scene segmentation: {e}")
            raise

    def _parse_scenes_xml(self, xml_content: str) -> List[SceneObject]:
        if not xml_content.strip().startswith("<root>"):
            xml_content = f"<root>\n{xml_content}\n</root>"
        
        xml_content = re.sub(r"```xml\n|```", "", xml_content)
        
        try:
            root = ET.fromstring(xml_content)
            scenes = []
            for idx, scene_node in enumerate(root.findall("scene"), 1):
                def get_text(tag: str, default: str = "") -> str:
                    node = scene_node.find(tag)
                    return node.text.strip() if node is not None and node.text else default

                scenes.append(SceneObject(
                    scene_number=idx,
                    title=get_text("title", f"Scene {idx}"),
                    location=get_text("location", "Unknown"),
                    setting=get_text("setting", "INT."),
                    time_of_day=get_text("time_of_day", "DAY"),
                    characters=[c.strip() for c in get_text("characters").split(",") if c.strip()],
                    objective=get_text("objective"),
                    emotional_tone=get_text("tone"),
                    visual_energy=get_text("energy", "Medium"),
                    script_text=get_text("content")
                ))
            return scenes
        except ET.ParseError as e:
            logger.error(f"XML Parse Error: {e}. Raw content: {xml_content[:500]}...")
            return []
