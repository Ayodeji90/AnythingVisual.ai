from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: Optional[str] = None
    intent: Optional[str] = None

class User(UserBase):
    id: int
    role: Optional[str] = None
    intent: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Project Schemas
class ProjectBase(BaseModel):
    title: str
    content_type: str
    language: str = "en"
    target_runtime_minutes: Optional[int] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Blueprint Schemas
class BlueprintBase(BaseModel):
    status: str
    logline: Optional[str] = None
    synopsis: Optional[str] = None
    genre: Optional[str] = None
    script_content: Optional[str] = None
    detected_characters: Optional[str] = None

class Blueprint(BlueprintBase):
    id: int
    project_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Scene Schemas
class SceneBase(BaseModel):
    scene_number: int
    slug: str
    int_ext: str
    day_night: str
    location: str
    description: str
    locked: bool = False
    title: Optional[str] = None
    characters: Optional[str] = None
    objective: Optional[str] = None
    emotional_tone: Optional[str] = None
    visual_energy: Optional[str] = None
    script_text: Optional[str] = None
    shooting_style: Optional[str] = None
    shot_types: Optional[str] = None
    lighting: Optional[str] = None
    props: Optional[str] = None
    environment_elements: Optional[str] = None
    keyframe_url: Optional[str] = None
    keyframe_prompt: Optional[str] = None

class Scene(SceneBase):
    id: int
    blueprint_id: int

    class Config:
        from_attributes = True

class BlueprintWithScenes(Blueprint):
    scenes: List[Scene] = []

    class Config:
        from_attributes = True

# Production Pack Schemas
class ProductionPackBase(BaseModel):
    props: str
    wardrobe: str
    shot_list: str
    continuity_notes: str

class ProductionPack(ProductionPackBase):
    id: int
    scene_id: int

    class Config:
        from_attributes = True

# Generated Script Schemas
class GeneratedScriptBase(BaseModel):
    title: str
    logline: Optional[str] = None
    genre: Optional[str] = None
    format: str = "short"
    target_pages: int = 30
    page_count: int = 0
    outline_json: Optional[str] = None
    full_script: Optional[str] = None
    status: str = "pending"

class GeneratedScriptResponse(GeneratedScriptBase):
    id: int
    project_id: int
    created_at: datetime

    class Config:
        from_attributes = True
