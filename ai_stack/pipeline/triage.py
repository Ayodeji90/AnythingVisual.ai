import json
import logging
import asyncio
import time
from typing import Optional, List
import openai
from pydantic import ValidationError
from ai_stack.schemas import TriageResult, ContentType
from ai_stack.models import model_settings
from ai_stack.prompts.loader import prompt_loader

# Configure logging
logger = logging.getLogger("ai_stack.triage")
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

class InputTriager:
    def __init__(self, client: openai.AsyncOpenAI):
        self.client = client
        self.model = model_settings.TRIAGE_MODEL
        self.max_retries = 3
        self.backoff_factor = 2.0

    def _get_system_prompt(self) -> str:
        allowed_types = ", ".join([t.value for t in ContentType])
        template = prompt_loader.get_prompt("triage")
        return template.format(allowed_types=allowed_types)

    def _validate_input(self, raw_text: str) -> str:
        if not raw_text or not raw_text.strip():
            raise ValueError("Input text cannot be empty.")
        
        sanitized = raw_text.strip()
        
        # Max length check (e.g., 50k characters for MVP safety)
        if len(sanitized) > 50000:
            logger.warning(f"Input text too long ({len(sanitized)} chars). Truncating.")
            sanitized = sanitized[:50000]
            
        return sanitized

    async def triage_input(self, raw_text: str, model_override: Optional[str] = None, trace_id: Optional[str] = None) -> TriageResult:
        model = model_override or self.model
        log_prefix = f"[{trace_id}] " if trace_id else ""
        
        try:
            text = self._validate_input(raw_text)
        except ValueError as e:
            logger.error(f"{log_prefix}Input validation failed: {e}")
            raise

        messages = [
            {"role": "system", "content": self._get_system_prompt()},
            {"role": "user", "content": f"Analyze this input (Length: {len(text)}):\n\n{text}"}
        ]

        last_error = None
        for attempt in range(self.max_retries):
            start_time = time.time()
            try:
                logger.info(f"{log_prefix}Attempting triage (Attempt {attempt+1}/{self.max_retries}) using {model}")
                
                response = await self.client.chat.completions.create(
                    model=model,
                    messages=messages,
                    response_format={"type": "json_object"},
                    timeout=30.0
                )
                
                latency = time.time() - start_time
                raw_output = response.choices[0].message.content
                
                logger.debug(f"{log_prefix}Raw AI Output: {raw_output}")
                
                data = json.loads(raw_output)
                result = TriageResult(**data)
                
                logger.info(f"{log_prefix}Triage successful. Type: {result.content_type}, Latency: {latency:.2f}s")
                return result

            except (openai.APIError, openai.APITimeoutError, openai.RateLimitError) as e:
                last_error = e
                wait_time = self.backoff_factor ** attempt
                logger.warning(f"{log_prefix}API Error on attempt {attempt+1}: {e}. Retrying in {wait_time}s...")
                await asyncio.sleep(wait_time)
                
            except (json.JSONDecodeError, ValidationError) as e:
                logger.error(f"{log_prefix}Output parsing/validation failed on attempt {attempt+1}: {e}. Raw: {raw_output}")
                # For parsing errors, we don't necessarily want to retry identical prompt 
                # unless we add a correction instruction. For now, we'll try once more.
                last_error = e
                if attempt < self.max_retries - 1:
                    continue
                else:
                    raise

            except Exception as e:
                logger.exception(f"{log_prefix}Unexpected error during triage: {e}")
                raise

        logger.error(f"{log_prefix}Triage failed after {self.max_retries} attempts. Last error: {last_error}")
        raise last_error
