from fastapi import APIRouter

router = APIRouter()

@router.get("/dashboard")
def get_parent_dashboard():
    return {
        "student_name": "Karthik Kumar",
        "attendance": "94%",
        "recent_grades": {"Math": "A", "Science": "B+"},
        "fee_status": "Paid"
    }
