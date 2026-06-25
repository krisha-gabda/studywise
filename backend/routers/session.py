from fastapi import APIRouter, Depends, HTTPException
from schemas import SessionResultCreate, SessionResultResponse
from models.user import User
from models.topic import Topic, TopicStatus
from models.result import SessionResult
from db.database import AsyncSession, get_db
from utils.auth import get_current_user
from services.priority_engine import recalculate_priority
from sqlalchemy import select
from datetime import datetime, timezone

router = APIRouter()

@router.post('/result')
async def session_result(session_results: SessionResultCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):

    result = await db.execute(select(Topic).where(Topic.id == session_results.topic_id, Topic.user_id == current_user.id))
    topic = result.scalar_one_or_none()

    if topic is None:
        raise HTTPException(status_code=404, detail='Not Found')
    
    new_session_result = SessionResult(
        user_id = current_user.id,
        topic_id = topic.id,
        mode = session_results.mode,
        score = session_results.score,
        confidence = session_results.confidence
    )

    db.add(new_session_result)
    await db.commit()

    new_priority_score = recalculate_priority(topic, new_session_result)

    topic.priority_score = new_priority_score
    topic.last_reviewed_at = datetime.now(timezone.utc)

    if topic.priority_score >= 0.5:
        topic.status = TopicStatus.needs_work
    else:
        topic.status = TopicStatus.mastered

    await db.commit()
    await db.refresh(topic)

    return SessionResultResponse(
        id=new_session_result.id,
        topic_id=new_session_result.topic_id,
        mode=new_session_result.mode,
        score=new_session_result.score,
        confidence=new_session_result.confidence,
        created_at=new_session_result.created_at
    )