import json
import logging
from typing import List, Dict
import openai
from ai_stack.schemas import TriageResult

logger = logging.getLogger("ai_stack.story_hub")

class StoryGenerator:
    def __init__(self, client: openai.AsyncOpenAI):
        self.client = client

    async def generate_variants(self, idea_text: str, triage: TriageResult = None, trace_id: str = "default") -> List[Dict]:
        """
        Generates 3 distinct creative approaches from a single idea.
        """
        logger.info(f"[{trace_id}] Generating story variants...")
        
        system_prompt = """
        You are a Master Story Architect at AnythingVisual.ai.
        Your goal is to transform a raw idea into 3 distinct, high-potential creative directions.
        Each direction must have a unique 'Angle', 'Tone', and 'Narrative Hook'.
        
        Return your response as a JSON object with a 'variants' key containing exactly 3 objects.
        Each object must have:
        - title: A compelling title for this approach.
        - approach: A name for the creative angle (e.g., 'The Noir Twist', 'Epic Scale', 'Intimate Character Study').
        - synopsis: A 2-3 sentence summary of the story in this direction.
        - tone: 3 keywords describing the vibe.
        - unique_hook: What makes this version stand out visually or narratively.
        """
        
        user_prompt = f"Idea: {idea_text}\n"
        if triage:
            user_prompt += f"Context: Genre={triage.detected_genre}, Format={triage.input_format}\n"

        try:
            response = await self.client.chat.completions.create(
                model="llama-3.1-70b-versatile", # Or whichever model is mapped in config
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            data = json.loads(content)
            return data.get("variants", [])
            
        except Exception as e:
            logger.error(f"[{trace_id}] Story generation failed: {e}")
            # Return a fallback variant if AI fails
            return [{
                "title": "The Original Vision",
                "approach": "Direct Implementation",
                "synopsis": idea_text[:200] + "...",
                "tone": ["Standard"],
                "unique_hook": "The raw concept as provided."
            }]
