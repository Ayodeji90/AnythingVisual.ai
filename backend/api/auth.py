from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from backend.database.session import get_session
from backend.database.models import User as DBUser
from backend.api import schemas
from backend.core import security
from backend.core.config import settings

router = APIRouter()

@router.post("/register", response_model=schemas.User)
def register(user_in: schemas.UserCreate, session: Session = Depends(get_session)):
    # Check if user already exists
    user = session.exec(select(DBUser).where(DBUser.email == user_in.email)).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    db_obj = DBUser(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        intent=user_in.intent
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

@router.post("/login/access-token", response_model=schemas.Token)
def login_access_token(
    session: Session = Depends(get_session), 
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    OAuth2 compatible token login, retrieve an access token for future requests
    """
    user = session.exec(select(DBUser).where(DBUser.email == form_data.username)).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
