from fastapi import APIRouter, Depends, HTTPException
from models.user import User
from models.topic import Topic
from db.database import get_db, AsyncSession
from utils.auth import get_current_user
from services.flashcard_generator import generate_flashcards
from services.quiz_generator import generate_quiz
from uuid import UUID
from sqlalchemy import select
from schemas import FlashcardsResponse, QuizResponse

router = APIRouter()

@router.post('/flashcards')
async def flashcards(topic_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    results = await db.execute(select(Topic).where(Topic.user_id == current_user.id, Topic.id == topic_id))
    topic = results.scalar_one_or_none()

    if topic is None:
        raise HTTPException(status_code=404, detail='Not found or Not owned')
    
    try:
        flashcards = generate_flashcards(user_id=current_user.id, topic_name=topic.name)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f'Flashcard generation failed, please try again: {e}')
    
    return FlashcardsResponse(
        topic_id = topic_id,
        topic_name = topic.name,
        flashcards = flashcards
    )


@router.post('/quiz')
async def quiz(topic_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    results = await db.execute(select(Topic).where(Topic.user_id == current_user.id, Topic.id == topic_id))
    topic = results.scalar_one_or_none()

    if topic is None:
        raise HTTPException(status_code=404, detail='Not found or not owned')
    
    quiz = generate_quiz(user_id=current_user.id, topic_name=topic.name)

    return QuizResponse(
        topic_id = topic_id,
        topic_name = topic.name,
        questions = quiz
    )