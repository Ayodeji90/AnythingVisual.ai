from fastapi import APIRouter, Depends
from typing import List, Any
from sqlmodel import Session, select, func
from backend.database.session import get_session
from backend.database.models import User, Project, Script, Blueprint, Scene
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/stats")
def get_stats(session: Session = Depends(get_session)):
    # Basic counts
    total_users = session.exec(select(func.count(User.id))).one()
    total_projects = session.exec(select(func.count(Project.id))).one()
    total_scripts = session.exec(select(func.count(Script.id))).one()
    total_blueprints = session.exec(select(func.count(Blueprint.id))).one()
    total_scenes = session.exec(select(func.count(Scene.id))).one()
    
    # Recent users (last 30 days)
    recent_users = session.exec(
        select(User).order_by(User.created_at.desc()).limit(10)
    ).all()
    
    # Format user data for dashboard
    user_list = [
        {
            "name": u.full_name or u.email.split('@')[0],
            "initials": "".join([n[0] for n in (u.full_name or (u.email.split('@')[0])).split()[:2]]).upper(),
            "segment": u.role.capitalize() if u.role else "Individual",
            "plan": "Free",
            "registered": u.created_at.isoformat()
        } for u in recent_users
    ]
    
    # Mock data for charts (to be replaced with real aggregation if needed)
    # Registration dates for the last 30 days
    today = datetime.utcnow()
    labels = [(today - timedelta(days=i)).strftime("%d %b") for i in range(29, -1, -1)]
    
    # Mock API consumption and Revenue
    api_spend = 847 # Mock
    tokens_consumed = 1250000 # Mock
    
    return {
        "metrics": {
            "total_users": total_users,
            "total_scripts": total_scripts,
            "total_keyframes": total_scenes,
            "api_spend": api_spend
        },
        "recent_users": user_list,
        "charts": {
            "labels": labels,
            "registration_data": {
                "filmmakers": [8, 12, 15, 10, 18, 22, 14, 19, 25, 21, 16, 12, 10, 14, 18, 22, 28, 24, 20, 18, 15, 12, 10, 14, 16, 18, 20, 22, 24, 26],
                "creators": [5, 8, 10, 7, 12, 15, 10, 14, 18, 15, 12, 9, 8, 10, 12, 15, 20, 18, 15, 14, 12, 10, 8, 11, 13, 15, 17, 19, 21, 22],
                "agencies": [3, 4, 5, 3, 6, 8, 5, 7, 10, 8, 6, 5, 4, 6, 8, 10, 12, 10, 8, 7, 6, 5, 4, 6, 7, 9, 11, 13, 14, 15]
            },
            "segments": [41, 35, 24], # Filmmaker, Creator, Agency
            "scripts": [60, 80, 100, 90, 120, 150, 130, 110, 140, 160, 180, 170, 150, 140, 160, 180, 200, 190, 180, 170, 160, 150, 140, 160, 180, 200, 220, 210, 200, 190],
            "tokens": [120, 240, 360, 300, 480, 600, 500, 400, 550, 650, 750, 700, 600, 550, 650, 750, 850, 800, 750, 700, 650, 600, 550, 650, 750, 850, 950, 900, 850, 800] # in k
        }
    }
