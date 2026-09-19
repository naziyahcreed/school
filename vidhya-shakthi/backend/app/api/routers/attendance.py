from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.attendance import AttendanceSubmitRequest, AttendanceSubmitResponse
from app.services.attendance_service import attendance_service

router = APIRouter()


@router.post("/submit", response_model=AttendanceSubmitResponse)
def submit_attendance(
    request: AttendanceSubmitRequest,
    db: Session = Depends(get_db),
):
    """
    Submit daily class attendance.
    Automatically filters ABSENT students and queues WhatsApp/SMS parent alerts.
    """
    if not request.entries:
        raise HTTPException(status_code=400, detail="At least one attendance entry is required")
    try:
        return attendance_service.submit_attendance(db, request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Attendance submission failed: {exc}") from exc
