from fastapi import APIRouter, HTTPException
from uuid import UUID

from app.schemas.ai import QuestionPaperRequest, QuestionPaperResponse, TutorChatRequest, TutorChatResponse
from app.services.question_paper_service import question_paper_service
from app.services.tutor_service import tutor_service
from app.services.categorization_service import categorize_student, CategorizationInput
from app.services.timetable_optimizer import (
    TimetableOptimizer,
    TeacherConstraint,
    GradeRequirement,
)

router = APIRouter()


@router.post("/generate-question-paper", response_model=QuestionPaperResponse)
def generate_question_paper(request: QuestionPaperRequest):
    """
    AI Question Paper Generator.
    Accepts subject, grade, chapters, and difficulty ratio.
    Returns structured JSON with questions, answer keys, and blueprint.
    """
    total_ratio = (
        request.difficulty_ratio.EASY
        + request.difficulty_ratio.MEDIUM
        + request.difficulty_ratio.HARD
    )
    if total_ratio != 100:
        raise HTTPException(
            status_code=400,
            detail=f"Difficulty ratio must sum to 100, got {total_ratio}",
        )
    try:
        return question_paper_service.generate(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Question paper generation failed: {exc}") from exc


@router.post("/tutor-chat", response_model=TutorChatResponse)
def tutor_chat(request: TutorChatRequest):
    """
    RAG-Based Socratic Tamil AI Tutor.
    Queries Samacheer Kalvi vector DB and guides students without direct answers.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    try:
        return tutor_service.chat(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Tutor chat failed: {exc}") from exc


@router.post("/categorize-student")
def categorize_student_endpoint(
    avg_marks: float,
    homework_rate: float,
    attendance_rate: float,
    class_avg: float = 65.0,
    weak_topics: int = 0,
):
    """Compute performance category and remedial action recommendations."""
    result = categorize_student(
        CategorizationInput(
            avg_marks_percentage=avg_marks,
            homework_completion_rate=homework_rate,
            attendance_rate=attendance_rate,
            class_avg_marks=class_avg,
            weak_topic_count=weak_topics,
        )
    )
    return {
        "category": result.category.value,
        "composite_score": result.composite_score,
        "recommended_actions": result.recommended_actions,
    }


@router.post("/optimize-timetable")
def optimize_timetable_demo():
    """Demo timetable optimization with sample constraints."""
    teachers = [
        TeacherConstraint("t1", max_periods_week=30, subject_ids=["math", "science"]),
        TeacherConstraint("t2", max_periods_week=28, subject_ids=["tamil", "english"]),
    ]
    grades = [
        GradeRequirement(
            grade_id="10A",
            subject_periods={"math": 6, "science": 5, "tamil": 4},
            lab_subjects={"science"},
        )
    ]
    rooms = {"R101": "CLASSROOM", "R102": "CLASSROOM", "LAB1": "LAB"}
    optimizer = TimetableOptimizer(teachers, grades, rooms)
    solution = optimizer.solve()
    return {
        "total_slots": len(solution.slots),
        "teacher_workloads": solution.teacher_workloads,
        "burnout_scores": solution.burnout_scores,
        "violations": solution.violations,
        "sample_slots": [
            {
                "day": s.day.value,
                "period": s.period_number,
                "teacher": s.teacher_id,
                "subject": s.subject_id,
                "room": s.room_id,
            }
            for s in solution.slots[:10]
        ],
    }
