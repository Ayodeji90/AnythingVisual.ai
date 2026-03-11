from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify real origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to AnythingVisual.ai API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Future: Include routers
from backend.api.projects import router as projects_router
from backend.api.ai_pipeline import router as ai_router

app.include_router(projects_router, prefix=settings.API_V1_STR, tags=["projects"])
app.include_router(ai_router, prefix=settings.API_V1_STR, tags=["ai"])
