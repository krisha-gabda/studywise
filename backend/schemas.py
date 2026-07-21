from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from uuid import UUID
from datetime import datetime
from enum import Enum

# Auth
class UserRegister(BaseModel):
    email: EmailStr
    password: str

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if len(v) > 72:
            raise ValueError('Password cannot exceed 72 characters')
        
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: UUID
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: UserResponse


# Topics
class TopicStatusEnum(str, Enum):
    not_started = 'not_started'
    needs_work = 'needs_work'
    mastered = 'mastered'


class TopicCreate(BaseModel):
    name: str
    project_id: UUID


class TopicUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[TopicStatusEnum] = None


class TopicResponse(BaseModel):
    id: UUID
    name: str
    priority_score: float
    status: TopicStatusEnum
    project_id: UUID
    headline: str
    summary: str
    last_reviewed_at: Optional[datetime] = None
    created_at: datetime

    class config:
        from_attributes = True


class TopicInfo(BaseModel):
    name: str
    headline: str
    summary: str


# Notes Upload
class NotesUploadResponse(BaseModel):
    message: str
    topics_extracted: list[TopicInfo]

# Flashcards
class Flashcard(BaseModel):
    question: str
    answer: str


class FlashcardsResponse(BaseModel):
    topic_id: UUID
    topic_name: str
    flashcards: list[Flashcard]


# Quiz
class QuizQuestion(BaseModel):
    question: str
    options: list[str]          # 4 options
    correct_index: int          # index of correct option


class QuizResponse(BaseModel):
    topic_id: UUID
    topic_name: str
    questions: list[QuizQuestion]


class QuizSubmission(BaseModel):
    topic_id: UUID
    answers: list[int]          # User's selected answers


# Summary
class SummaryResponse(BaseModel):
    headline: str
    summary: str


# Session Results (sent after any study mode)
class SessionResultCreate(BaseModel):
    topic_id: UUID
    mode: str                   # flashcard / quiz
    score: float
    confidence: Optional[str] = None


class SessionResultResponse(BaseModel):
    id: UUID
    topic_id: UUID
    mode: str
    score: float
    confidence: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = None


# Projects
class ProjectCreate(BaseModel):
    name: str


class ProjectResponse(BaseModel):
    id: UUID
    name: str
    created_at: datetime

# Smart Session

# Crisis Mode