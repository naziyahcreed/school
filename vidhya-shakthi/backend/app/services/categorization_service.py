"""
Student performance categorization: TOPPER | AVERAGE | SLOW_LEARNER
Composite score from marks (50%), homework (30%), attendance (20%).
"""
from dataclasses import dataclass
from enum import Enum


class PerformanceCategory(str, Enum):
    TOPPER = "TOPPER"
    AVERAGE = "AVERAGE"
    SLOW_LEARNER = "SLOW_LEARNER"


@dataclass
class CategorizationInput:
    avg_marks_percentage: float
    homework_completion_rate: float
    attendance_rate: float
    class_avg_marks: float = 65.0
    weak_topic_count: int = 0


@dataclass
class CategorizationResult:
    category: PerformanceCategory
    composite_score: float
    recommended_actions: list[dict]


WEIGHTS = {"marks": 0.50, "homework": 0.30, "attendance": 0.20}

TOPPER_THRESHOLD = 80.0
SLOW_LEARNER_THRESHOLD = 45.0


def compute_composite_score(data: CategorizationInput) -> float:
    return round(
        data.avg_marks_percentage * WEIGHTS["marks"]
        + data.homework_completion_rate * WEIGHTS["homework"]
        + data.attendance_rate * WEIGHTS["attendance"],
        2,
    )


def categorize_student(data: CategorizationInput) -> CategorizationResult:
    composite = compute_composite_score(data)
    relative_performance = data.avg_marks_percentage - data.class_avg_marks

    if composite >= TOPPER_THRESHOLD and relative_performance >= 10:
        category = PerformanceCategory.TOPPER
        actions = [
            {"action": "ASSIGN_HOTS_PROBLEMS", "priority": "HIGH", "label": "Insert HOTS Problems"},
            {"action": "ADVANCED_READING", "priority": "MEDIUM", "label": "Assign Advanced Chapter Reading"},
            {"action": "PEER_MENTOR", "priority": "LOW", "label": "Assign as Peer Mentor"},
        ]
    elif composite < SLOW_LEARNER_THRESHOLD or data.weak_topic_count >= 3:
        category = PerformanceCategory.SLOW_LEARNER
        actions = [
            {"action": "ASSIGN_FOUNDATIONAL_VIDEO", "priority": "HIGH", "label": "Assign Foundational Video"},
            {"action": "AUDIO_FLASHCARDS", "priority": "HIGH", "label": "Audio Flashcards (Tamil)"},
            {"action": "REMEDIAL_WORKSHEET", "priority": "MEDIUM", "label": "Remedial Worksheet"},
            {"action": "PARENT_CONFERENCE", "priority": "MEDIUM", "label": "Schedule Parent Conference"},
        ]
    else:
        category = PerformanceCategory.AVERAGE
        actions = [
            {"action": "PRACTICE_DRILLS", "priority": "MEDIUM", "label": "Targeted Practice Drills"},
            {"action": "REVISION_NOTES", "priority": "LOW", "label": "Revision Notes"},
        ]

    if data.homework_completion_rate < 60 and category != PerformanceCategory.SLOW_LEARNER:
        actions.insert(0, {
            "action": "HOMEWORK_COACHING",
            "priority": "HIGH",
            "label": "Homework Completion Coaching",
        })

    return CategorizationResult(
        category=category,
        composite_score=composite,
        recommended_actions=actions,
    )
