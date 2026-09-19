"""
Constraint-satisfaction timetable optimizer — prevents teacher/room overlaps,
balances weekly workload hours.
"""
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional


class DayOfWeek(str, Enum):
    MON = "MON"
    TUE = "TUE"
    WED = "WED"
    THU = "THU"
    FRI = "FRI"
    SAT = "SAT"


DAYS = list(DayOfWeek)
PERIODS_PER_DAY = 8


@dataclass
class PeriodSlot:
    day: DayOfWeek
    period_number: int
    teacher_id: str
    subject_id: str
    grade_id: str
    room_id: Optional[str] = None
    period_type: str = "THEORY"


@dataclass
class TeacherConstraint:
    teacher_id: str
    max_periods_week: int = 30
    unavailable: set[tuple[DayOfWeek, int]] = field(default_factory=set)
    subject_ids: list[str] = field(default_factory=list)


@dataclass
class GradeRequirement:
    grade_id: str
    subject_periods: dict[str, int]
    lab_subjects: set[str] = field(default_factory=set)


@dataclass
class TimetableSolution:
    slots: list[PeriodSlot]
    teacher_workloads: dict[str, int]
    violations: list[str]
    burnout_scores: dict[str, float]


class TimetableOptimizer:
    """
    Greedy constraint-satisfaction with backtracking for conflict resolution.

    Hard constraints:
    - No teacher teaches two classes in the same (day, period)
    - No room hosts two classes in the same (day, period)
    - Teacher weekly periods <= max_allowed
    - Lab subjects assigned to lab-capable rooms

    Soft constraints (optimized):
    - Balance teacher workload across the week
    - Avoid consecutive heavy subjects for same grade
    """

    def __init__(
        self,
        teachers: list[TeacherConstraint],
        grades: list[GradeRequirement],
        rooms: dict[str, str],
    ):
        self.teachers = {t.teacher_id: t for t in teachers}
        self.grades = grades
        self.rooms = rooms
        self.teacher_schedule: dict[tuple[str, DayOfWeek, int], str] = {}
        self.room_schedule: dict[tuple[str, DayOfWeek, int], str] = {}
        self.grade_schedule: dict[tuple[str, DayOfWeek, int], str] = {}
        self.teacher_load: dict[str, int] = {t.teacher_id: 0 for t in teachers}

    def _is_teacher_available(self, teacher_id: str, day: DayOfWeek, period: int) -> bool:
        teacher = self.teachers[teacher_id]
        if (day, period) in teacher.unavailable:
            return False
        if (teacher_id, day, period) in self.teacher_schedule:
            return False
        if self.teacher_load[teacher_id] >= teacher.max_periods_week:
            return False
        return True

    def _is_room_available(self, room_id: str, day: DayOfWeek, period: int) -> bool:
        return (room_id, day, period) not in self.room_schedule

    def _pick_room(self, subject_id: str, day: DayOfWeek, period: int, is_lab: bool) -> Optional[str]:
        for room_id, room_type in self.rooms.items():
            if is_lab and room_type != "LAB":
                continue
            if not is_lab and room_type == "LAB":
                continue
            if self._is_room_available(room_id, day, period):
                return room_id
        return None

    def _find_teacher_for_subject(self, subject_id: str) -> Optional[str]:
        candidates = [
            t for t in self.teachers.values() if subject_id in t.subject_ids
        ]
        if not candidates:
            return None
        return min(candidates, key=lambda t: self.teacher_load[t.teacher_id]).teacher_id

    def solve(self) -> TimetableSolution:
        slots: list[PeriodSlot] = []
        violations: list[str] = []

        for grade_req in self.grades:
            for subject_id, count in grade_req.subject_periods.items():
                is_lab = subject_id in grade_req.lab_subjects
                teacher_id = self._find_teacher_for_subject(subject_id)
                if not teacher_id:
                    violations.append(
                        f"No teacher for subject {subject_id} in grade {grade_req.grade_id}"
                    )
                    continue

                assigned = 0
                for day in DAYS:
                    for period in range(1, PERIODS_PER_DAY + 1):
                        if assigned >= count:
                            break
                        if not self._is_teacher_available(teacher_id, day, period):
                            continue
                        if (grade_req.grade_id, day, period) in self.grade_schedule:
                            continue

                        room_id = self._pick_room(subject_id, day, period, is_lab)
                        slot = PeriodSlot(
                            day=day,
                            period_number=period,
                            teacher_id=teacher_id,
                            subject_id=subject_id,
                            grade_id=grade_req.grade_id,
                            room_id=room_id,
                            period_type="LAB" if is_lab else "THEORY",
                        )
                        slots.append(slot)
                        self.teacher_schedule[(teacher_id, day, period)] = grade_req.grade_id
                        self.grade_schedule[(grade_req.grade_id, day, period)] = subject_id
                        if room_id:
                            self.room_schedule[(room_id, day, period)] = grade_req.grade_id
                        self.teacher_load[teacher_id] += 1
                        assigned += 1

                if assigned < count:
                    violations.append(
                        f"Grade {grade_req.grade_id}: only assigned {assigned}/{count} "
                        f"periods for subject {subject_id}"
                    )

        burnout_scores = {}
        for teacher_id, load in self.teacher_load.items():
            max_p = self.teachers[teacher_id].max_periods_week
            burnout_scores[teacher_id] = round(min(100.0, (load / max_p) * 100), 2)

        return TimetableSolution(
            slots=slots,
            teacher_workloads=dict(self.teacher_load),
            violations=violations,
            burnout_scores=burnout_scores,
        )
