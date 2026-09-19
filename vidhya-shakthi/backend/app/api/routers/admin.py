from fastapi import APIRouter

router = APIRouter()

@router.get("/dashboard")
def get_admin_dashboard():
    return {
        "total_students": 1245,
        "total_teachers": 84,
        "school_avg_attendance": 92.4,
        "active_alerts": 3
    }
