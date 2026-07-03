from fastapi import APIRouter, Depends, HTTPException
from models.user import User
from models.topic import Topic
from utils.auth import get_current_user
from db.database import get_db, AsyncSession
from sqlalchemy import select, update, delete
from schemas import TopicResponse, TopicCreate, TopicUpdate
from uuid import UUID

router = APIRouter()

@router.get('/topics')
async def get_topics(project_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    results = await db.execute(select(Topic).where(Topic.user_id == current_user.id, Topic.project_id == project_id).order_by(Topic.priority_score.desc()))
    topics = results.scalars().all()
    responses = []

    for topic in topics:
        responses.append(TopicResponse(
            id=topic.id,
            project_id=topic.project_id,
            name=topic.name,
            priority_score=topic.priority_score,
            status=topic.status,
            last_reviewed_at=topic.last_reviewed_at,
            created_at=topic.created_at
        ))

    return responses


@router.post('/topics')
async def create_topic(new_topic: TopicCreate, project_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    topic = Topic(
        user_id = current_user.id,
        project_id = project_id,
        name = new_topic.name
    )

    db.add(topic)
    await db.commit()
    await db.refresh(topic)

    return TopicResponse(
        id=topic.id,
        project_id = topic.project_id,
        name=topic.name,
        priority_score=topic.priority_score,
        status=topic.status,
        last_reviewed_at=topic.last_reviewed_at,
        created_at=topic.created_at
    )


@router.put('/topics/{topic_id}')
async def update_topic(topic_id: UUID, project_id: UUID, update_data: TopicUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Topic).where(Topic.id == topic_id, Topic.project_id == project_id, Topic.user_id == current_user.id))
    topic = result.scalar_one_or_none()

    if topic is None:
        raise HTTPException(status_code=404, detail='Result not found')
    
    if update_data.name is not None:
        topic.name = update_data.name

    if update_data.status is not None:
        topic.status = update_data.status

    await db.commit()
    await db.refresh(topic)

    return TopicResponse(
        id=topic.id,
        project_id = topic.project_id,
        name=topic.name,
        priority_score=topic.priority_score,
        status=topic.status,
        last_reviewed_at=topic.last_reviewed_at,
        created_at=topic.created_at
    )


@router.delete('/topics/{topic_id}')
async def delete_topic(topic_id: UUID, project_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Topic).where(Topic.id == topic_id, Topic.project_id == project_id, Topic.user_id == current_user.id))
    topic = result.scalar_one_or_none()

    if topic is None:
        raise HTTPException(status_code=404, detail='Result not found')
    
    await db.execute(delete(Topic).where(Topic.id == topic_id, Topic.user_id == current_user.id))
    await db.commit()
    return {"message": "Topic deleted successfully"}