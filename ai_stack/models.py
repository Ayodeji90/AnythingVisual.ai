from pydantic import BaseModel
from backend.core.config import settings

class ModelConfig(BaseModel):
    # Stage 1: Fast & Cheap
    TRIAGE_MODEL: str = "gpt-4o-mini"
    
    # Stage 2 & 3: Creative & Structured
    STRUCTURE_MODEL: str = "gpt-4o"
    SEGMENTATION_MODEL: str = "gpt-4o"
    
    # Stage 4: Cinematic Insight
    ENRICHMENT_MODEL: str = "gpt-4o"
    
    # Stage 5: Image Generation (API based)
    IMAGE_GEN_PROVIDER: str = "fal-ai/flux/dev"

model_settings = ModelConfig()
