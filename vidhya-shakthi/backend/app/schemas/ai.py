from enum import Enum
from uuid import UUID
from pydantic import BaseModel, Field


class DifficultyLevel(str, Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"


class QuestionType(str, Enum):
    MCQ = "MCQ"
    SHORT_ANSWER = "SHORT_ANSWER"
    LONG_ANSWER = "LONG_ANSWER"
    HOTS = "HOTS"
    FILL_BLANK = "FILL_BLANK"


class DifficultyRatio(BaseModel):
    EASY: int = Field(default=30, ge=0, le=100)
    MEDIUM: int = Field(default=50, ge=0, le=100)
    HARD: int = Field(default=20, ge=0, le=100)


class QuestionPaperRequest(BaseModel):
    teacher_id: UUID
    school_id: UUID
    subject_id: UUID
    grade_number: int = Field(ge=1, le=12)
    title: str
    chapter_ids: list[UUID] = []
    chapter_names: list[str] = []
    difficulty_ratio: DifficultyRatio = DifficultyRatio()
    total_marks: float = 100
    duration_minutes: int = 180
    include_hots: bool = True
    language: str = "ta"


class GeneratedQuestion(BaseModel):
    question_number: int
    question_type: QuestionType
    difficulty: DifficultyLevel
    bloom_level: str
    marks: float
    question_text: str
    question_text_ta: str | None = None
    options: list[str] | None = None
    correct_answer: str
    explanation: str | None = None


class QuestionPaperBlueprint(BaseModel):
    section_name: str
    question_type: QuestionType
    count: int
    marks_each: float
    total_marks: float


class QuestionPaperResponse(BaseModel):
    paper_id: str
    title: str
    total_marks: float
    duration_minutes: int
    difficulty_ratio: dict
    blueprint: list[QuestionPaperBlueprint]
    questions: list[GeneratedQuestion]
    answer_key: dict[str, str]


class TutorChatRequest(BaseModel):
    student_id: UUID
    session_id: UUID | None = None
    message: str
    subject_id: UUID | None = None
    chapter_id: UUID | None = None
    language: str = "ta"
    grade_number: int = 10


class TutorChatResponse(BaseModel):
    session_id: UUID
    reply: str
    reply_ta: str | None = None
    socratic_step: int
    hint_level: str
    rag_sources: list[dict]
    follow_up_questions: list[str]
    direct_answer_blocked: bool = True
