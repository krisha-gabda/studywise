from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import engine, Base
from config import get_settings
from routers.auth import router as auth_router

app = FastAPI(title='Studywise')

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event('startup')
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# TODO: Implement routers
# Import the router object at the top of the file
# Call the `app.include_router()`, passing in the router, a prefix starting with `/api/`, and a tags list with one descriptive string

# Auth routes -     /api/auth
# Notes upload -    /api/notes
# Roadmap -         /api/roadmap
# Study Modes -     /api/study
# Sessions -        /api/session

app.include_router(auth_router, prefix='/api/auth', tags=['auth'])
# app.include_router(notes_router, prefix='/api/notes', tags=['notes'])
# app.include_router(roadmap_router, prefix='/api/roadmap', tags=['roadmap'])
# app.include_router(study_router, prefix='/api/study', tags=['study'])
# app.include_router(session_router, prefix='/api/session', tags=['session'])

@app.get("/")
async def root():
    return { "status": "ok" }