from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field

LessonStatus = Literal['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED']
LessonSlot = Literal[
    'top_of_unit',
    'before_concepts',
    'after_concepts',
    'append_unit',
    'inline_concept',
]
AuthorRole = Literal['TEACHER', 'ADMIN']


class LearnLessonCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    title_ta: Optional[str] = None
    grade: int = Field(10, ge=1, le=12)
    subject_id: str
    chapter_id: str
    slot: LessonSlot = 'append_unit'
    concept_id: Optional[str] = None
    sort_order: int = 0
    html_content: str = ''
    css_content: str = ''
    author_name: str = 'Teacher'
    author_role: AuthorRole = 'TEACHER'
    publish_now: bool = False


class LearnLessonUpdate(BaseModel):
    title: Optional[str] = None
    title_ta: Optional[str] = None
    slot: Optional[LessonSlot] = None
    concept_id: Optional[str] = None
    sort_order: Optional[int] = None
    html_content: Optional[str] = None
    css_content: Optional[str] = None


class LearnLessonOut(BaseModel):
    id: str
    title: str
    title_ta: Optional[str] = None
    grade: int
    subject_id: str
    chapter_id: str
    slot: str
    concept_id: Optional[str] = None
    sort_order: int
    html_content: str
    css_content: str
    status: str
    author_name: str
    author_role: str
    reviewer_note: Optional[str] = None
    created_at: str
    updated_at: str
    approved_at: Optional[str] = None
