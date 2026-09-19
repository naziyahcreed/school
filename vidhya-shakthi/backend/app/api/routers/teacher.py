from fastapi import APIRouter

router = APIRouter()

@router.get("/dashboard")
def get_teacher_dashboard():
    return {
        "classes_today": 4,
        "homework_to_grade": 15,
        "upcoming_meetings": 1
    }
