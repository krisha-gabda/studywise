from fastapi import APIRouter, Depends, HTTPException
from config import get_settings
from models.user import User
from models.project import Project
from models.topic import Topic
from utils.auth import get_current_user
from db.database import AsyncSession, get_db
from sqlalchemy import select, delete
from schemas import ProjectResponse, ProjectCreate
from uuid import UUID

settings = get_settings()
router = APIRouter()

@router.get('/projects')
async def projects(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    results = await db.execute(select(Project).where(Project.user_id == current_user.id))
    projects = results.scalars().all()
    responses = []

    for project in projects:
        responses.append(ProjectResponse(
            id = project.id,
            name = project.name,
            created_at = project.created_at
        ))

    return responses


@router.post('/projects')
async def create_project(new_project: ProjectCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    project = Project(
        user_id = current_user.id,
        name = new_project.name
    )

    db.add(project)
    await db.commit()
    await db.refresh(project)

    return ProjectResponse(
        id = project.id,
        name = project.name,
        created_at = project.created_at
    )


@router.delete('/projects/{project_id}')
async def delete_project(project_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.user_id == current_user.id, Project.id == project_id))
    project = result.scalar_one_or_none()

    if project is None:
        raise HTTPException(status_code=404, detail='Result not found')
    
    await db.execute(delete(Topic).where(Topic.user_id == current_user.id, Topic.project_id == project_id))
    await db.execute(delete(Project).where(Project.user_id == current_user.id, Project.id == project_id))
    await db.commit()
    return {
        'message': 'Project deleted successfully'
    }