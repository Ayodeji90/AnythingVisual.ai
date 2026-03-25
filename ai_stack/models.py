from pydantic import BaseModel
from typing import Optional
import os

class ModelConfig(BaseModel):
    """
    Model mappings per pipeline stage.
    Supports both Groq (Llama) and OpenAI (GPT) providers.
    Switch by setting LLM_PROVIDER env var to 'groq' or 'openai'.
    """
    
    # --- Groq (Free Llama models) ---
    GROQ_TRIAGE_MODEL: str = "llama-3.3-70b-versatile"
    GROQ_STRUCTURE_MODEL: str = "llama-3.3-70b-versatile"
    GROQ_SEGMENTATION_MODEL: str = "llama-3.3-70b-versatile"
    GROQ_ENRICHMENT_MODEL: str = "llama-3.3-70b-versatile"
    
    # --- OpenAI (Paid GPT models) ---
    OPENAI_TRIAGE_MODEL: str = "gpt-4o-mini"
    OPENAI_STRUCTURE_MODEL: str = "gpt-4o"
    OPENAI_SEGMENTATION_MODEL: str = "gpt-4o"
    OPENAI_ENRICHMENT_MODEL: str = "gpt-4o"
    
    # --- Image Generation (provider-independent) ---
    IMAGE_GEN_PROVIDER: str = "fal-ai/flux/dev"
    
    @property
    def provider(self) -> str:
        return os.getenv("LLM_PROVIDER", "groq").lower()
    
    @property
    def TRIAGE_MODEL(self) -> str:
        return self.GROQ_TRIAGE_MODEL if self.provider == "groq" else self.OPENAI_TRIAGE_MODEL
    
    @property
    def STRUCTURING_MODEL(self) -> str:
        return self.GROQ_STRUCTURE_MODEL if self.provider == "groq" else self.OPENAI_STRUCTURE_MODEL
    
    @property
    def SEGMENTATION_MODEL(self) -> str:
        return self.GROQ_SEGMENTATION_MODEL if self.provider == "groq" else self.OPENAI_SEGMENTATION_MODEL
    
    @property
    def ENRICHMENT_MODEL(self) -> str:
        return self.GROQ_ENRICHMENT_MODEL if self.provider == "groq" else self.OPENAI_ENRICHMENT_MODEL

# Use Pydantic's model_config instead of class Config for v2
model_settings = ModelConfig()
