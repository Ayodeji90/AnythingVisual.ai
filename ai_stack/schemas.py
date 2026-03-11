from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

# --- ENUMS ---

class ContentType(str, Enum):
    ROUGH_IDEA = "rough idea"
    BULLET_LIST = "bullet list"
    PARTIAL_SCRIPT = "partial script"
    FULL_SCREENPLAY = "full screenplay"

class PipelineStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETE = "complete"
    FAILED = "failed"

class EmotionalTone(str, Enum):
    TENSION = "Tension"
    DEFIANCE = "Defiance"
    URGENCY = "Urgency"
    HOPE = "Hope"
    MELANCHOLY = "Melancholy"
    MYSTERY = "Mystery"

class VisualEnergy(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    EXPLOSIVE = "Explosive"

class SceneSetting(str, Enum):
    INT = "INT."
    EXT = "EXT."

# --- SCHEMAS ---

class TriageResult(BaseModel):
    content_type: ContentType = Field(..., description="Classification of the input text")
    estimated_scenes: int = Field(..., ge=1, le=100, description="Estimated scene count (1-100)")
    genre: Optional[str] = None
    detected_characters: List[str] = Field(default_factory=list)
    language: str = "English"
    input_was_truncated: bool = False

class StructuredScript(BaseModel):
    title: str = Field(..., min_length=1)
    logline: str = Field(..., max_length=280)
    synopsis: str = Field(..., min_length=1)
    script_content: str = Field(..., min_length=10) # The cleaned, formatted script text

class SceneObject(BaseModel):
    scene_number: int = Field(..., ge=1)
    title: str = Field(..., min_length=1)
    location: str = Field(..., min_length=1)
    setting: SceneSetting = Field(..., description="INT. or EXT.")
    time_of_day: str
    characters: List[str] = Field(default_factory=list)
    objective: str
    emotional_tone: EmotionalTone # Enforced brand tones
    visual_energy: VisualEnergy # Enforced vocabulary
    script_text: str = Field(..., min_length=2)
    
    # Visual Intelligence fields (Stage 4)
    shooting_style: Optional[str] = None
    shot_types: List[str] = Field(default_factory=list)
    lighting: Optional[str] = None
    props: List[str] = Field(default_factory=list)
    environment_elements: List[str] = Field(default_factory=list)
    
    # Keyframe generation fields (Stage 5)
    keyframe_url: Optional[str] = None
    keyframe_prompt: Optional[str] = None

class PipelineState(BaseModel):
    project_id: str
    current_stage: int = 0
    triage: Optional[TriageResult] = None
    script: Optional[StructuredScript] = None
    scenes: List[SceneObject] = Field(default_factory=list)
    status: PipelineStatus = PipelineStatus.PENDING
    failed_stage: Optional[int] = None
    error_message: Optional[str] = None
    
    # Observability
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
