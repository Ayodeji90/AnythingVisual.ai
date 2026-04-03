from sqlmodel import create_engine, Session, SQLModel
from backend.core.config import settings

# SQLite needs check_same_thread=False; PostgreSQL doesn't support it
_db_url = settings.DATABASE_URL
if _db_url.startswith("sqlite"):
    engine = create_engine(_db_url, echo=False, connect_args={"check_same_thread": False})
else:
    # PostgreSQL (Supabase) — use connection pooling settings
    engine = create_engine(
        _db_url,
        echo=False,
        pool_pre_ping=True,       # test connections before use
        pool_size=5,
        max_overflow=10,
    )

def init_db():
    # Import models so SQLModel registers them before create_all
    from backend.database.models import User, Project, Script, Blueprint, Scene, ProductionPack, CharacterBible, GeneratedScript  # noqa
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
