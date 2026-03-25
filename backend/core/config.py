import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

# Resolve project root (two levels up from this file: backend/core/config.py -> project root)
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "AnythingVisual.ai"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    DATABASE_URL: str = "sqlite:///./test.db"
    
    # LLM Provider: "groq" or "openai"
    LLM_PROVIDER: str = "groq"
    
    # OpenAI (used when LLM_PROVIDER=openai)
    OPENAI_API_KEY: Optional[str] = None
    
    # Groq (used when LLM_PROVIDER=groq)
    GROQ_API_KEY: Optional[str] = None
    
    STRIPE_API_KEY: Optional[str] = None
    
    # S3 / Storage
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    S3_BUCKET_NAME: Optional[str] = None
    
    model_config = SettingsConfigDict(
        env_file=[
            str(_PROJECT_ROOT / "ai_stack" / ".env"),
            str(_PROJECT_ROOT / ".env"),
        ],
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
