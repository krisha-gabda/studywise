from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from db.database import Base
from datetime import datetime, timezone
import uuid
import enum

class TopicStatus(enum.Enum):
    not_started = 'not_started'
    needs_work = 'needs_work'
    mastered = 'mastered'


class Topic(Base):
    __tablename__ = 'topics'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    priority_score=Column(Float, default=0.0)
    status = Column(Enum(TopicStatus), default=TopicStatus.not_started)
    laast_reviewed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))