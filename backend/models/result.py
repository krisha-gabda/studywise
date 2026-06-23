from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from db.database import Base
from datetime import datetime, timezone
import uuid

class SessionResult(Base):
    __tablename__ = 'session_results'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    topic_id = Column(UUID(as_uuid=True), ForeignKey('topics.id'), nullable=False)
    mode = Column(String, nullable=False)       # flashcard / quiz / explain
    score = Column(Float, nullable=False)       # 0.0 to 1.0
    confidence = Column(String, nullable=True)  # got_it / shaky / lost
    attempt_count = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), default=lambda:datetime.now(timezone.utc))