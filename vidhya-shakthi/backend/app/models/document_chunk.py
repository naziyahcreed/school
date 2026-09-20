from sqlalchemy import Column, String, SmallInteger, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
from sqlalchemy.sql import func
import uuid

from app.core.database import Base

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject_id = Column(String(100))
    chapter_title = Column(String(255))
    page_number = Column(SmallInteger)
    source_file = Column(String(255))
    content = Column(Text, nullable=False)
    embedding = Column(Vector(1536))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
