"""
Attendance submission with automatic parent WhatsApp/SMS alert dispatch.
"""
import asyncio
import logging
from datetime import date
from uuid import UUID, uuid4

from sqlalchemy.orm import Session
from sqlalchemy import text

from app.schemas.attendance import (
    AttendanceSubmitRequest,
    AttendanceSubmitResponse,
    ParentAlertResponse,
    AttendanceStatus,
)
from app.services.messaging_service import (
    messaging_service,
    build_absence_message_ta,
    build_absence_message_en,
)

logger = logging.getLogger(__name__)


async def _dispatch_single_alert(
    alert_id: UUID,
    phone: str,
    message_ta: str,
    message_en: str,
    preferred_language: str,
    channel: str,
) -> dict:
    try:
        result = await messaging_service.dispatch_alert(
            phone=phone,
            message_ta=message_ta,
            message_en=message_en,
            preferred_language=preferred_language,
            channel=channel,
        )
        return {"alert_id": str(alert_id), "status": "SENT", **result}
    except Exception as exc:
        logger.exception("Alert dispatch failed for alert %s", alert_id)
        return {"alert_id": str(alert_id), "status": "FAILED", "error": str(exc)}


class AttendanceService:
    def submit_attendance(
        self, db: Session, request: AttendanceSubmitRequest
    ) -> AttendanceSubmitResponse:
        present = absent = leave_count = 0
        alerts: list[ParentAlertResponse] = []
        absent_student_ids: list[UUID] = []

        for entry in request.entries:
            status_val = entry.status.value
            db.execute(
                text("""
                    INSERT INTO attendance (
                        id, school_id, grade_id, student_id, marked_by,
                        attendance_date, status, check_in_time, remarks
                    ) VALUES (
                        :id, :school_id, :grade_id, :student_id, :marked_by,
                        :attendance_date, :status, :check_in_time, :remarks
                    )
                    ON CONFLICT (student_id, attendance_date)
                    DO UPDATE SET
                        status = EXCLUDED.status,
                        check_in_time = EXCLUDED.check_in_time,
                        remarks = EXCLUDED.remarks,
                        marked_by = EXCLUDED.marked_by,
                        updated_at = NOW()
                """),
                {
                    "id": str(uuid4()),
                    "school_id": str(request.school_id),
                    "grade_id": str(request.grade_id),
                    "student_id": str(entry.student_id),
                    "marked_by": str(request.marked_by),
                    "attendance_date": request.attendance_date,
                    "status": status_val,
                    "check_in_time": entry.check_in_time,
                    "remarks": entry.remarks,
                },
            )

            if entry.status == AttendanceStatus.PRESENT:
                present += 1
            elif entry.status == AttendanceStatus.ABSENT:
                absent += 1
                absent_student_ids.append(entry.student_id)
            elif entry.status == AttendanceStatus.LEAVE:
                leave_count += 1

        db.commit()

        if request.trigger_alerts and absent_student_ids:
            alerts = self._queue_absentee_alerts(
                db, request, absent_student_ids
            )

        return AttendanceSubmitResponse(
            attendance_date=request.attendance_date,
            total_marked=len(request.entries),
            present_count=present,
            absent_count=absent,
            leave_count=leave_count,
            alerts_queued=len(alerts),
            alerts=alerts,
        )

    def _queue_absentee_alerts(
        self,
        db: Session,
        request: AttendanceSubmitRequest,
        absent_student_ids: list[UUID],
    ) -> list[ParentAlertResponse]:
        alerts: list[ParentAlertResponse] = []
        date_str = request.attendance_date.strftime("%d-%m-%Y")
        dispatch_tasks = []

        for student_id in absent_student_ids:
            row = db.execute(
                text("""
                    SELECT
                        u.full_name,
                        u.phone AS student_phone,
                        u.preferred_language,
                        sp.parent_user_id,
                        pu.phone AS parent_phone,
                        pu.full_name AS parent_name,
                        g.grade_number,
                        g.section,
                        a.id AS attendance_id
                    FROM users u
                    JOIN student_profiles sp ON sp.user_id = u.id
                    JOIN grades g ON g.id = sp.grade_id
                    JOIN attendance a ON a.student_id = u.id
                        AND a.attendance_date = :attendance_date
                    LEFT JOIN users pu ON pu.id = sp.parent_user_id
                    WHERE u.id = :student_id
                """),
                {
                    "student_id": str(student_id),
                    "attendance_date": request.attendance_date,
                },
            ).mappings().first()

            if not row:
                continue

            parent_phone = row["parent_phone"] or row["student_phone"]
            if not parent_phone:
                logger.warning("No phone for student %s — skipping alert", student_id)
                continue

            grade_label = f"Std {row['grade_number']}-{row['section']}"
            message_ta = build_absence_message_ta(row["full_name"], date_str, grade_label)
            message_en = build_absence_message_en(row["full_name"], date_str, grade_label)
            alert_id = uuid4()
            preferred_lang = row["preferred_language"] or "ta"

            db.execute(
                text("""
                    INSERT INTO parent_alerts (
                        id, attendance_id, student_id, parent_id,
                        channel, delivery_status, message_ta, message_en,
                        recipient_phone
                    ) VALUES (
                        :id, :attendance_id, :student_id, :parent_id,
                        :channel, 'PENDING', :message_ta, :message_en,
                        :recipient_phone
                    )
                """),
                {
                    "id": str(alert_id),
                    "attendance_id": str(row["attendance_id"]),
                    "student_id": str(student_id),
                    "parent_id": str(row["parent_user_id"]) if row["parent_user_id"] else None,
                    "channel": request.alert_channel,
                    "message_ta": message_ta,
                    "message_en": message_en,
                    "recipient_phone": parent_phone,
                },
            )

            dispatch_tasks.append(
                _dispatch_single_alert(
                    alert_id=alert_id,
                    phone=parent_phone,
                    message_ta=message_ta,
                    message_en=message_en,
                    preferred_language=preferred_lang,
                    channel=request.alert_channel,
                )
            )

            alerts.append(
                ParentAlertResponse(
                    alert_id=alert_id,
                    student_id=student_id,
                    parent_phone=parent_phone,
                    delivery_status="PENDING",
                    message_preview=message_ta[:80] + "...",
                )
            )

        db.commit()

        if dispatch_tasks:
            loop = asyncio.new_event_loop()
            try:
                results = loop.run_until_complete(asyncio.gather(*dispatch_tasks))
            finally:
                loop.close()

            for result in results:
                status = result.get("status", "FAILED")
                db.execute(
                    text("""
                        UPDATE parent_alerts
                        SET delivery_status = :status,
                            external_message_id = :msg_id,
                            sent_at = CASE WHEN :status = 'SENT' THEN NOW() ELSE sent_at END,
                            error_message = :error
                        WHERE id = :alert_id
                    """),
                    {
                        "alert_id": result["alert_id"],
                        "status": "SENT" if status in ("SENT", "simulated") else "FAILED",
                        "msg_id": result.get("message_id"),
                        "error": result.get("error"),
                    },
                )
                for alert in alerts:
                    if str(alert.alert_id) == result["alert_id"]:
                        alert.delivery_status = "SENT" if status in ("SENT", "simulated") else "FAILED"

            db.commit()

        return alerts


attendance_service = AttendanceService()
