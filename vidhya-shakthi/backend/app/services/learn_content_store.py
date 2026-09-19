import json
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "custom_lessons.json"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_lessons() -> list[dict]:
    if not DATA_FILE.exists():
        return []
    try:
        return json.loads(DATA_FILE.read_text(encoding='utf-8'))
    except json.JSONDecodeError:
        return []


def save_lessons(lessons: list[dict]) -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(json.dumps(lessons, indent=2, ensure_ascii=False), encoding='utf-8')


def create_lesson(payload: dict) -> dict:
    lessons = load_lessons()
    now = _now_iso()
    if payload.get('author_role') == 'ADMIN' or payload.get('publish_now'):
        status = 'APPROVED'
    else:
        status = 'PENDING_REVIEW'

    row = {
        'id': str(uuid4()),
        'title': payload['title'],
        'title_ta': payload.get('title_ta'),
        'grade': payload.get('grade', 10),
        'subject_id': payload['subject_id'],
        'chapter_id': payload['chapter_id'],
        'slot': payload.get('slot', 'append_unit'),
        'concept_id': payload.get('concept_id'),
        'sort_order': payload.get('sort_order', 0),
        'html_content': payload.get('html_content', ''),
        'css_content': payload.get('css_content', ''),
        'status': status,
        'author_name': payload.get('author_name', 'Staff'),
        'author_role': payload.get('author_role', 'TEACHER'),
        'reviewer_note': None,
        'created_at': now,
        'updated_at': now,
        'approved_at': now if status == 'APPROVED' else None,
    }
    lessons.append(row)
    save_lessons(lessons)
    return row


def update_lesson(lesson_id: str, patch: dict) -> dict | None:
    lessons = load_lessons()
    for i, row in enumerate(lessons):
        if row['id'] != lesson_id:
            continue
        for k, v in patch.items():
            if v is not None:
                row[k] = v
        row['updated_at'] = _now_iso()
        lessons[i] = row
        save_lessons(lessons)
        return row
    return None


def set_status(lesson_id: str, status: str, reviewer_note: str | None = None) -> dict | None:
    lessons = load_lessons()
    for i, row in enumerate(lessons):
        if row['id'] != lesson_id:
            continue
        row['status'] = status
        row['reviewer_note'] = reviewer_note
        row['updated_at'] = _now_iso()
        if status == 'APPROVED':
            row['approved_at'] = _now_iso()
        lessons[i] = row
        save_lessons(lessons)
        return row
    return None


def delete_lesson(lesson_id: str) -> bool:
    lessons = load_lessons()
    new_list = [x for x in lessons if x['id'] != lesson_id]
    if len(new_list) == len(lessons):
        return False
    save_lessons(new_list)
    return True


def filter_lessons(
    *,
    status: str | None = None,
    subject_id: str | None = None,
    chapter_id: str | None = None,
    grade: int | None = None,
) -> list[dict]:
    rows = load_lessons()
    if status:
        rows = [r for r in rows if r.get('status') == status]
    if subject_id:
        rows = [r for r in rows if r.get('subject_id') == subject_id]
    if chapter_id:
        rows = [r for r in rows if r.get('chapter_id') == chapter_id]
    if grade is not None:
        rows = [r for r in rows if r.get('grade') == grade]
    rows.sort(key=lambda r: (r.get('subject_id', ''), r.get('chapter_id', ''), r.get('sort_order', 0)))
    return rows
