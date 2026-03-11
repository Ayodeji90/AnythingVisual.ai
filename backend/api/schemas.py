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

class User(UserBase):
    id: int
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

class Scene(SceneBase):
    id: int
    blueprint_id: int

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
