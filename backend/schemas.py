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
class NotesUploadResponse(BaseModel):
    message: str
    topics_extracted: list[str]

# Flashcards

# Explain It

# Session Results (sent after any study mode)

# Smart Session

# Crisis Mode