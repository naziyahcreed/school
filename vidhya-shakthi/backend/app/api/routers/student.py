from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.get("/dashboard")
def get_student_dashboard():
    return {
        "attendance": "94%",
        "upcoming_classes": ["Math (10:00 AM)", "Physics (11:30 AM)"],
        "pending_homework": 2
    }

@router.get("/courses")
def get_student_courses():
    return [
        {"id": 1, "title": "Samacheer Kalvi 10th Math", "progress": 45},
        {"id": 2, "title": "Samacheer Kalvi 10th Science", "progress": 70}
    ]

@router.post("/chatbot")
def ask_chatbot(req: ChatRequest):
    responses = [
        "That's a great question! Based on chapter 4, the answer is...",
        "According to the Samacheer Kalvi textbook, photosynthesis is...",
        "Let me explain this simply: Newton's second law states that..."
    ]
    return {"reply": random.choice(responses)}
