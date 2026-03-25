from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: Optional[str] = None
    role: Optional[str] = None  # filmmaker | creator | agency
    intent: Optional[str] = None # feature | short | youtube | ad | social
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    projects: List["Project"] = Relationship(back_populates="owner")

class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id")
    title: str
    content_type: str  # film | ad_campaign | short_content | other
    language: str = "en"
    target_runtime_minutes: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    owner: User = Relationship(back_populates="projects")
    scripts: List["Script"] = Relationship(back_populates="project")
    blueprints: List["Blueprint"] = Relationship(back_populates="project")

class Script(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id")
    filename: str
    content_s3_key: str
    version: int = 1
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    project: Project = Relationship(back_populates="scripts")

class Blueprint(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id")
    status: str = "pending"  # pending | processing | ready | error
    logline: Optional[str] = None
    synopsis: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    project: Project = Relationship(back_populates="blueprints")
    scenes: List["Scene"] = Relationship(back_populates="blueprint")

class Scene(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    blueprint_id: int = Field(foreign_key="blueprint.id")
    scene_number: int
    slug: str
    int_ext: str
    day_night: str
    location: str
    description: str
    locked: bool = False
    
    blueprint: Blueprint = Relationship(back_populates="scenes")
    production_pack: Optional["ProductionPack"] = Relationship(back_populates="scene")

class ProductionPack(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    scene_id: int = Field(foreign_key="scene.id")
    props: str
    wardrobe: str
    shot_list: str
    continuity_notes: str
    
    scene: Scene = Relationship(back_populates="production_pack")

class CharacterBible(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id")
    name: str
    bio: str
    speech_style: str
    casting_hint: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
