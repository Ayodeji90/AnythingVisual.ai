from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from backend.database.session import get_session
from backend.database import models
from backend.api import schemas
from backend.services.llm_engine import llm_engine
from backend.core.security import get_current_user

router = APIRouter()

@router.post("/projects", response_model=schemas.Project)
def create_project(
    project: schemas.ProjectCreate,
    db: Session = Depends(get_session),
    user_id: int = Depends(get_current_user)
):
    db_project = models.Project(**project.model_dump(), owner_id=user_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/projects", response_model=List[schemas.Project])
def read_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_session),
    user_id: int = Depends(get_current_user)
):
    projects = db.query(models.Project).filter(
        models.Project.owner_id == user_id
    ).offset(skip).limit(limit).all()
    return projects

@router.delete("/projects/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_session),
    user_id: int = Depends(get_current_user)
):
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.owner_id == user_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Cascade delete: scenes → blueprints, generated_scripts, scripts
    blueprints = db.query(models.Blueprint).filter(models.Blueprint.project_id == project_id).all()
    for bp in blueprints:
        db.query(models.Scene).filter(models.Scene.blueprint_id == bp.id).delete()
    db.query(models.Blueprint).filter(models.Blueprint.project_id == project_id).delete()
    db.query(models.GeneratedScript).filter(models.GeneratedScript.project_id == project_id).delete()
    db.query(models.Script).filter(models.Script.project_id == project_id).delete()

    db.delete(project)
    db.commit()
    return {"message": "Project deleted", "id": project_id}

@router.post("/projects/{project_id}/analyze", response_model=schemas.Blueprint)
async def analyze_script(
    project_id: int,
    text: str,
    db: Session = Depends(get_session),
    user_id: int = Depends(get_current_user)
):
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.owner_id == user_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # 1. Create Blueprint record
    db_blueprint = models.Blueprint(
        project_id=project_id,
        status="processing"
    )
    db.add(db_blueprint)
    db.commit()
    db.refresh(db_blueprint)

    try:
        # 2. Call LLM Engine for structure
        # (Assuming llm_engine returns a dict with logline, synopsis, and scenes)
        blueprint_data = await llm_engine.generate_blueprint_structure(project.content_type, text)
        
        # 3. Update Blueprint with results
        db_blueprint.logline = blueprint_data.get("logline", "No logline generated")
        db_blueprint.synopsis = blueprint_data.get("synopsis", "No synopsis generated")
        db_blueprint.status = "ready"
        
        # 4. Create Scenes
        for i, scene in enumerate(blueprint_data.get("scenes", [])):
            db_scene = models.Scene(
                blueprint_id=db_blueprint.id,
                scene_number=i + 1,
                slug=scene.get("slug", f"SCENE {i+1}"),
                int_ext=scene.get("int_ext", "INT"),
                day_night=scene.get("day_night", "DAY"),
                location=scene.get("location", "UNKNOWN"),
                description=scene.get("description", "")
            )
            db.add(db_scene)
        
        db.commit()
        db.refresh(db_blueprint)
        return db_blueprint

    except Exception as e:
        db_blueprint.status = "error"
        db.commit()
        raise HTTPException(status_code=500, detail=str(e))
