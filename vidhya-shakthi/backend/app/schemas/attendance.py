from datetime import date, time
from enum import Enum
from uuid import UUID
from pydantic import BaseModel, Field


class AttendanceStatus(str, Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"
    LEAVE = "LEAVE"
    HALF_DAY = "HALF_DAY"


class StudentAttendanceEntry(BaseModel):
    student_id: UUID
    status: AttendanceStatus
    check_in_time: time | None = None
    remarks: str | None = None


class AttendanceSubmitRequest(BaseModel):
    school_id: UUID
    grade_id: UUID
    marked_by: UUID
    attendance_date: date = Field(default_factory=date.today)
    entries: list[StudentAttendanceEntry]
    trigger_alerts: bool = True
    alert_channel: str = "WHATSAPP"


class ParentAlertResponse(BaseModel):
    alert_id: UUID
    student_id: UUID
    parent_phone: str
    delivery_status: str
    message_preview: str


class AttendanceSubmitResponse(BaseModel):
    attendance_date: date
    total_marked: int
    present_count: int
    absent_count: int
    leave_count: int
    alerts_queued: int
    alerts: list[ParentAlertResponse]
