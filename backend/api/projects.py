from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from backend.database.session import get_session
from backend.database import models
from backend.api import schemas
from backend.services.llm_engine import llm_engine

router = APIRouter()

@router.post("/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_session)):
    # Mock owner_id for now as we haven't wired authentications
    db_project = models.Project(**project.model_dump(), owner_id=1)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/projects", response_model=List[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_session)):
    projects = db.query(models.Project).offset(skip).limit(limit).all()
    return projects

@router.post("/projects/{project_id}/analyze", response_model=schemas.Blueprint)
async def analyze_script(project_id: int, text: str, db: Session = Depends(get_session)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
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
