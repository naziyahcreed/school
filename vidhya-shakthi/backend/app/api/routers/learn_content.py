from fastapi import APIRouter, HTTPException, Query

from app.schemas.learn_content import LearnLessonCreate, LearnLessonOut, LearnLessonUpdate
from app.services import learn_content_store as store

router = APIRouter()


def _to_out(row: dict) -> LearnLessonOut:
    return LearnLessonOut(**row)


@router.get("/lessons", response_model=list[LearnLessonOut])
def list_lessons(
    status: str | None = Query(None),
    subject_id: str | None = Query(None),
    chapter_id: str | None = Query(None),
    grade: int | None = Query(None),
    all_statuses: bool = Query(False, description='Admin: include pending/rejected'),
):
    effective_status = status
    if not all_statuses and effective_status is None:
        effective_status = 'APPROVED'
    rows = store.filter_lessons(
        status=effective_status,
        subject_id=subject_id,
        chapter_id=chapter_id,
        grade=grade,
    )
    return [_to_out(r) for r in rows]


@router.post("/lessons", response_model=LearnLessonOut)
def create_lesson(body: LearnLessonCreate):
    row = store.create_lesson(body.model_dump())
    return _to_out(row)


@router.patch("/lessons/{lesson_id}", response_model=LearnLessonOut)
def patch_lesson(lesson_id: str, body: LearnLessonUpdate):
    row = store.update_lesson(lesson_id, body.model_dump(exclude_unset=True))
    if not row:
        raise HTTPException(status_code=404, detail='Lesson not found')
    return _to_out(row)


@router.post("/lessons/{lesson_id}/approve", response_model=LearnLessonOut)
def approve_lesson(lesson_id: str, note: str | None = None):
    row = store.set_status(lesson_id, 'APPROVED', note)
    if not row:
        raise HTTPException(status_code=404, detail='Lesson not found')
    return _to_out(row)


@router.post("/lessons/{lesson_id}/reject", response_model=LearnLessonOut)
def reject_lesson(lesson_id: str, note: str | None = None):
    row = store.set_status(lesson_id, 'REJECTED', note or 'Needs revision')
    if not row:
        raise HTTPException(status_code=404, detail='Lesson not found')
    return _to_out(row)


@router.delete("/lessons/{lesson_id}")
def remove_lesson(lesson_id: str):
    if not store.delete_lesson(lesson_id):
        raise HTTPException(status_code=404, detail='Lesson not found')
    return {'ok': True}
