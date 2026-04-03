import asyncio
import logging
from typing import Optional, List
from sqlmodel import Session, select
from pydantic import BaseModel, Field
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from fastapi.responses import StreamingResponse
from backend.database.session import get_session, engine
from backend.database import models
from backend.api import schemas
from ai_stack.orchestrator import PipelineOrchestrator
from ai_stack.schemas import PipelineState
from backend.core.config import settings
from backend.core.security import get_current_user, get_current_user_from_query
import openai
import json

logger = logging.getLogger("ai_stack.pipeline_api")

router = APIRouter()

def _build_llm_client() -> openai.AsyncOpenAI:
    """
    Build the correct AsyncOpenAI client based on the LLM_PROVIDER setting.
    Groq's API is OpenAI-compatible, so we just swap base_url and api_key.
    """
    provider = settings.LLM_PROVIDER.lower()
    
    if provider == "groq":
        if not settings.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY is required when LLM_PROVIDER=groq. Set it in ai_stack/.env")
        logger.info("Using Groq (Llama) as LLM provider")
        return openai.AsyncOpenAI(
            api_key=settings.GROQ_API_KEY,
            base_url="https://api.groq.com/openai/v1"
        )
    elif provider == "openai":
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is required when LLM_PROVIDER=openai")
        logger.info("Using OpenAI (GPT) as LLM provider")
        return openai.AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY
        )
    else:
        raise ValueError(f"Unknown LLM_PROVIDER: {provider}. Use 'groq' or 'openai'.")

# Build client and orchestrator
_client = _build_llm_client()
orchestrator = PipelineOrchestrator(_client)

def _persist_pipeline_results(session: Session, project_id: int, state: PipelineState) -> Optional[int]:
    """
    Save a completed PipelineState to the database as a Blueprint + Scenes.
    Returns the blueprint ID on success, None on failure.
    """
    try:
        # Create Blueprint
        blueprint = models.Blueprint(
            project_id=project_id,
            status="ready",
            logline=state.script.logline if state.script else None,
            synopsis=state.script.synopsis if state.script else None,
            genre=state.triage.genre if state.triage else None,
            script_content=state.script.script_content if state.script else None,
            detected_characters=json.dumps(
                state.triage.detected_characters if state.triage else []
            ),
        )
        session.add(blueprint)
        session.commit()
        session.refresh(blueprint)

        # Create Scenes
        for scene_obj in state.scenes:
            db_scene = models.Scene(
                blueprint_id=blueprint.id,
                scene_number=scene_obj.scene_number,
                slug=f"{scene_obj.setting.value} {scene_obj.location} - {scene_obj.time_of_day}",
                int_ext=scene_obj.setting.value,
                day_night=scene_obj.time_of_day,
                location=scene_obj.location,
                description=scene_obj.objective,
                title=scene_obj.title,
                characters=json.dumps(scene_obj.characters),
                objective=scene_obj.objective,
                emotional_tone=scene_obj.emotional_tone.value if scene_obj.emotional_tone else None,
                visual_energy=scene_obj.visual_energy.value if scene_obj.visual_energy else None,
                script_text=scene_obj.script_text,
                shooting_style=scene_obj.shooting_style,
                shot_types=json.dumps(scene_obj.shot_types) if scene_obj.shot_types else None,
                lighting=scene_obj.lighting,
                props=json.dumps(scene_obj.props) if scene_obj.props else None,
                environment_elements=json.dumps(scene_obj.environment_elements) if scene_obj.environment_elements else None,
                keyframe_url=scene_obj.keyframe_url,
                keyframe_prompt=scene_obj.keyframe_prompt,
            )
            session.add(db_scene)

        session.commit()
        logger.info(f"Persisted blueprint {blueprint.id} with {len(state.scenes)} scenes for project {project_id}")
        return blueprint.id
    except Exception as e:
        logger.error(f"Failed to persist pipeline results for project {project_id}: {e}")
        session.rollback()
        return None

class VariantGenerationRequest(BaseModel):
    text: str = Field(..., min_length=1)

class VariantSelectionRequest(BaseModel):
    story: str = Field(..., min_length=10)

class ScriptAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=10)

@router.get("/projects/{project_id}")
async def get_project_details(
    project_id: str,
    session: Session = Depends(get_session),
    user_id: int = Depends(get_current_user)
):
    from backend.database.models import Project
    project = session.get(Project, int(project_id))
    if not project or project.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/projects/{project_id}/generate-variants")
async def generate_variants(
    project_id: str,
    payload: VariantGenerationRequest,
    session: Session = Depends(get_session),
    user_id: int = Depends(get_current_user)
):
    from backend.database.models import Project
    project = session.get(Project, int(project_id))
    if not project or project.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found")
    
    raw_input = payload.text
    
    # Generate variants
    variants = await orchestrator.generate_story_variants(raw_input, trace_id=project_id)
    
    # Save to DB
    project.original_input = raw_input
    project.story_variants = json.dumps(variants)
    session.add(project)
    session.commit()
    
    return {"variants": variants}

@router.post("/projects/{project_id}/select-variant")
async def select_variant(
    project_id: str,
    payload: VariantSelectionRequest,
    session: Session = Depends(get_session),
    user_id: int = Depends(get_current_user)
):
    variant_text = payload.story
    
    from backend.database.models import Project
    project = session.get(Project, int(project_id))
    if not project or project.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found")
        
    project.selected_story = variant_text
    # We also sync this to original_input so Stage 1-3 can run from it
    project.original_input = variant_text 
    session.add(project)
    session.commit()
    return {"message": "Variant selected"}

@router.post("/projects/{project_id}/analyze")
async def analyze_script(
    project_id: str,
    payload: ScriptAnalysisRequest,
    session: Session = Depends(get_session),
    user_id: int = Depends(get_current_user)
):
    raw_input = payload.text
    
    from backend.database.models import Project
    project = session.get(Project, int(project_id))
    if not project or project.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found")
        
    project.original_input = raw_input
    session.add(project)
    session.commit()

    # In this MVP, we use the stream endpoint to actually run the pipeline
    return {"message": "Input saved. Connect to /stream to begin analysis.", "project_id": project_id}

@router.get("/projects/{project_id}/stream")
async def stream_analysis(
    project_id: str,
    target_stage: Optional[int] = None,
    token: Optional[str] = None,
    session: Session = Depends(get_session),
):
    """
    Server-Sent Events (SSE) endpoint to stream pipeline progress.
    Uses query param ?token=<jwt> because EventSource cannot set headers.
    """
    user_id = get_current_user_from_query(token)
    from backend.database.models import Project
    project = session.get(Project, int(project_id))
    if not project or project.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if not project.original_input:
        raise HTTPException(status_code=422, detail="No input content found for this project")

    # Capture the input content here to avoid needing the 'project' object inside the generator
    # but we still need a session inside to potentially update state if needed 
    # (though currently orchestrator handles its own state reporting)
    input_text = project.original_input

    async def event_generator():
        with Session(engine) as local_session:
            last_state = None
            try:
                async for state in orchestrator.run_pipeline(project_id, input_text, target_stage=target_stage):
                    last_state = state
                    yield f"data: {state.json()}\n\n"
                    await asyncio.sleep(0.1)
            except asyncio.CancelledError:
                logger.warning(f"Connection closed by client for project {project_id}")
                raise
            except Exception as e:
                logger.error(f"Error in stream for project {project_id}: {e}")
                yield f"data: {json.dumps({'status': 'failed', 'error': str(e)})}\n\n"
                return

            # Persist results to DB when pipeline completes successfully
            if last_state and last_state.status == "complete" and last_state.scenes:
                blueprint_id = _persist_pipeline_results(
                    local_session, int(project_id), last_state
                )
                # Send a final event with the blueprint_id so the frontend can fetch persisted data
                if blueprint_id:
                    final_msg = last_state.dict()
                    final_msg["blueprint_id"] = blueprint_id
                    yield f"data: {json.dumps(final_msg)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/projects/{project_id}/blueprint", response_model=schemas.BlueprintWithScenes)
async def get_project_blueprint(
    project_id: str,
    session: Session = Depends(get_session),
    user_id: int = Depends(get_current_user)
):
    """
    Get the latest persisted blueprint + scenes for a project.
    """
    from backend.database.models import Project
    project = session.get(Project, int(project_id))
    if not project or project.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found")

    # Get the latest blueprint for this project
    stmt = (
        select(models.Blueprint)
        .where(models.Blueprint.project_id == int(project_id))
        .order_by(models.Blueprint.created_at.desc())
    )
    blueprint = session.exec(stmt).first()
    if not blueprint:
        raise HTTPException(status_code=404, detail="No blueprint found for this project")

    # Eagerly load scenes
    scenes = session.exec(
        select(models.Scene)
        .where(models.Scene.blueprint_id == blueprint.id)
        .order_by(models.Scene.scene_number)
    ).all()

    # Build response
    bp_dict = {}
    for key in schemas.Blueprint.model_fields:
        bp_dict[key] = getattr(blueprint, key, None)
    bp_dict["scenes"] = scenes
    return bp_dict

@router.post("/scenes/{scene_id}/generate-keyframe")
async def generate_keyframe(scene_id: str):
    # This would call Stage 5 Part B
    # gen_tool = ImageGenerator(client)
    # url = await gen_tool.generate_keyframe(scene_obj)
    return {"message": "Generation started", "scene_id": scene_id}


# ===================== SCRIPT GENERATION (Idea → Full Script) =====================

class ScriptGenerationRequest(BaseModel):
    idea: str = Field(..., min_length=5, description="The raw movie/content idea")
    format: str = Field(default="short", description="feature | short | pilot | webisode")
    target_pages: Optional[int] = Field(default=None, description="Target page count")


def _persist_generated_script(
    session: Session, project_id: int, state
) -> Optional[int]:
    """Save a completed ScriptGenerationState to the database."""
    try:
        gs = state.generated_script
        if not gs:
            return None

        db_script = models.GeneratedScript(
            project_id=project_id,
            title=gs.title,
            logline=gs.logline,
            genre=gs.genre,
            format=gs.format,
            target_pages=gs.target_pages,
            page_count=gs.page_count,
            outline_json=gs.outline.json() if gs.outline else None,
            full_script=gs.full_script,
            status="ready",
        )
        session.add(db_script)
        session.commit()
        session.refresh(db_script)
        logger.info(f"Persisted generated script {db_script.id} for project {project_id}")
        return db_script.id
    except Exception as e:
        logger.error(f"Failed to persist generated script for project {project_id}: {e}")
        session.rollback()
        return None


@router.post("/projects/{project_id}/generate-script")
async def start_script_generation(
    project_id: str,
    payload: ScriptGenerationRequest,
    session: Session = Depends(get_session),
    user_id: int = Depends(get_current_user),
):
    """Save the idea and return instructions to connect to the SSE stream."""
    from backend.database.models import Project
    project = session.get(Project, int(project_id))
    if not project or project.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found")

    project.original_input = payload.idea
    session.add(project)
    session.commit()

    return {
        "message": "Idea saved. Connect to /stream-script to begin generation.",
        "project_id": project_id,
        "format": payload.format,
        "target_pages": payload.target_pages,
    }


@router.get("/projects/{project_id}/stream-script")
async def stream_script_generation(
    project_id: str,
    format: str = "short",
    target_pages: Optional[int] = None,
    token: Optional[str] = None,
    session: Session = Depends(get_session),
):
    """
    SSE endpoint to stream script generation progress.
    Uses query param ?token=<jwt> because EventSource cannot set headers.
    """
    user_id = get_current_user_from_query(token)
    from backend.database.models import Project
    project = session.get(Project, int(project_id))
    if not project or project.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found")

    if not project.original_input:
        raise HTTPException(status_code=422, detail="No input idea found for this project")

    idea_text = project.original_input

    async def event_generator():
        with Session(engine) as local_session:
            last_state = None
            try:
                async for state in orchestrator.run_script_generation(
                    project_id=project_id,
                    raw_idea=idea_text,
                    script_format=format,
                    target_pages=target_pages,
                ):
                    last_state = state
                    yield f"data: {state.json()}\n\n"
                    await asyncio.sleep(0.1)
            except asyncio.CancelledError:
                logger.warning(f"Script generation connection closed by client for project {project_id}")
                raise
            except Exception as e:
                logger.error(f"Error in script generation stream for project {project_id}: {e}")
                yield f"data: {json.dumps({'status': 'failed', 'error': str(e)})}\n\n"
                return

            # Persist results to DB when generation completes
            if last_state and last_state.status == "complete" and last_state.generated_script:
                script_id = _persist_generated_script(
                    local_session, int(project_id), last_state
                )
                if script_id:
                    final_msg = last_state.dict()
                    final_msg["generated_script_id"] = script_id
                    yield f"data: {json.dumps(final_msg, default=str)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get(
    "/projects/{project_id}/generated-script",
    response_model=schemas.GeneratedScriptResponse,
)
async def get_generated_script(
    project_id: str,
    session: Session = Depends(get_session),
    user_id: int = Depends(get_current_user),
):
    """Get the latest generated script for a project."""
    from backend.database.models import Project
    project = session.get(Project, int(project_id))
    if not project or project.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found")

    stmt = (
        select(models.GeneratedScript)
        .where(models.GeneratedScript.project_id == int(project_id))
        .order_by(models.GeneratedScript.created_at.desc())
    )
    gen_script = session.exec(stmt).first()
    if not gen_script:
        raise HTTPException(status_code=404, detail="No generated script found for this project")
    return gen_script
