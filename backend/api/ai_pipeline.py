import asyncio
from fastapi import APIRouter, BackgroundTasks, Depends
from fastapi.responses import StreamingResponse
from ai_stack.orchestrator import PipelineOrchestrator
from backend.core.config import settings
import json

router = APIRouter()
orchestrator = PipelineOrchestrator(api_key=settings.OPENAI_API_KEY)

# Simple in-memory store for demo/MVP purposes
# In production, use Redis or a database to track job states
jobs_status = {}

@router.post("/projects/{project_id}/analyze")
async def analyze_script(project_id: str, payload: dict, background_tasks: BackgroundTasks):
    raw_input = payload.get("text")
    if not raw_input:
        return {"error": "No input text provided"}
    
    # Initialize job status
    jobs_status[project_id] = {"status": "starting", "progress": 0}
    
    # We return immediately and start the background task
    # However, for SSE, we need a way for the client to connect
    return {"message": "Analysis started", "project_id": project_id}

@router.get("/projects/{project_id}/stream")
async def stream_analysis(project_id: str):
    """
    Server-Sent Events (SSE) endpoint to stream pipeline progress.
    """
    async def event_generator():
        # Get the input text - in a real app, fetch from DB
        # For this demonstration, we'll assume the text is passed or stored
        raw_text = "Simulated input script text..." 
        
        async for state in orchestrator.run_pipeline(project_id, raw_text):
            # Format as SSE
            yield f"data: {state.json()}\n\n"
            await asyncio.sleep(0.1) # Small delay for stability

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.post("/scenes/{scene_id}/generate-keyframe")
async def generate_keyframe(scene_id: str):
    # This would call Stage 5 Part B
    # gen_tool = ImageGenerator(client)
    # url = await gen_tool.generate_keyframe(scene_obj)
    return {"message": "Generation started", "scene_id": scene_id}
