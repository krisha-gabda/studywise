from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime
from enum import Enum

# Auth
class UserRegister(BaseModel):
    email: EmailStr
    password: str


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


class TopicUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[TopicStatusEnum] = None


class TopicResponse(BaseModel):
    id: UUID
    name: str
    priority_score: float
    status: TopicStatusEnum
    last_reviewed_at: Optional[Enum] = None
    created_at: datetime

    class config:
        from_attributes = True


# Notes Upload

# Flashcards

# Explain It

# Session Results (sent after any study mode)

# Smart Session

# Crisis Mode