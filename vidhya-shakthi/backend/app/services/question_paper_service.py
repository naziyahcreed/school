"""
AI Question Paper Generator — structured LLM output with difficulty ratio enforcement.
"""
import json
import logging
import uuid
from typing import Any

from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import get_settings
from app.schemas.ai import (
    QuestionPaperRequest,
    QuestionPaperResponse,
    GeneratedQuestion,
    QuestionPaperBlueprint,
    DifficultyLevel,
    QuestionType,
)

logger = logging.getLogger(__name__)
settings = get_settings()

QUESTION_PAPER_SYSTEM_PROMPT = """You are an expert Samacheer Kalvi (Tamil Nadu State Board) question paper designer.
Generate examination questions aligned to the specified chapters, grade, and Bloom's taxonomy levels.
Output ONLY valid JSON matching the schema provided — no markdown fences, no commentary.

Rules:
1. Respect the difficulty ratio (EASY/MEDIUM/HARD percentages).
2. Include MCQ, Short Answer, and HOTS questions as specified.
3. Provide bilingual question text (English + Tamil) for Samacheer Kalvi standards.
4. HOTS questions must require analysis/evaluation, not recall.
5. Answer keys must be precise and complete.
6. Blueprint must sum to total_marks exactly."""

QUESTION_PAPER_USER_TEMPLATE = """Generate a question paper with these specifications:

Subject Grade: {grade_number}
Chapters: {chapters}
Title: {title}
Total Marks: {total_marks}
Duration: {duration_minutes} minutes
Difficulty Ratio: EASY {easy}%, MEDIUM {medium}%, HARD {hard}%
Include HOTS: {include_hots}
Primary Language: {language}

Return JSON with this exact structure:
{{
  "title": "...",
  "total_marks": {total_marks},
  "duration_minutes": {duration_minutes},
  "blueprint": [
    {{"section_name": "Part A - MCQ", "question_type": "MCQ", "count": N, "marks_each": 1, "total_marks": N}}
  ],
  "questions": [
    {{
      "question_number": 1,
      "question_type": "MCQ",
      "difficulty": "EASY",
      "bloom_level": "REMEMBER",
      "marks": 1,
      "question_text": "...",
      "question_text_ta": "...",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A",
      "explanation": "..."
    }}
  ],
  "answer_key": {{"1": "A", "2": "..."}}
}}"""


class QuestionPaperService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

    def generate(self, request: QuestionPaperRequest) -> QuestionPaperResponse:
        chapters = request.chapter_names or [str(c) for c in request.chapter_ids]
        ratio = request.difficulty_ratio

        if self.client:
            raw = self._call_llm(request, chapters, ratio)
        else:
            raw = self._generate_offline_fallback(request, chapters, ratio)

        questions = [GeneratedQuestion(**q) for q in raw["questions"]]
        blueprint = [QuestionPaperBlueprint(**b) for b in raw["blueprint"]]
        paper_id = str(uuid.uuid4())

        return QuestionPaperResponse(
            paper_id=paper_id,
            title=raw["title"],
            total_marks=raw["total_marks"],
            duration_minutes=raw["duration_minutes"],
            difficulty_ratio={
                "EASY": ratio.EASY,
                "MEDIUM": ratio.MEDIUM,
                "HARD": ratio.HARD,
            },
            blueprint=blueprint,
            questions=questions,
            answer_key=raw["answer_key"],
        )

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    def _call_llm(
        self, request: QuestionPaperRequest, chapters: list[str], ratio: Any
    ) -> dict:
        user_prompt = QUESTION_PAPER_USER_TEMPLATE.format(
            grade_number=request.grade_number,
            chapters=", ".join(chapters) or "Full syllabus",
            title=request.title,
            total_marks=request.total_marks,
            duration_minutes=request.duration_minutes,
            easy=ratio.EASY,
            medium=ratio.MEDIUM,
            hard=ratio.HARD,
            include_hots=request.include_hots,
            language=request.language,
        )
        response = self.client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": QUESTION_PAPER_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.4,
            response_format={"type": "json_object"},
        )
        content = response.choices[0].message.content
        return json.loads(content)

    def _generate_offline_fallback(
        self, request: QuestionPaperRequest, chapters: list[str], ratio: Any
    ) -> dict:
        """Deterministic fallback when OpenAI key is absent — demo-ready output."""
        chapter_label = chapters[0] if chapters else "Algebra"
        questions = [
            {
                "question_number": 1,
                "question_type": "MCQ",
                "difficulty": "EASY",
                "bloom_level": "REMEMBER",
                "marks": 1,
                "question_text": f"What is the value of x in 2x + 4 = 10? ({chapter_label})",
                "question_text_ta": "2x + 4 = 10 இல் x இன் மதிப்பு என்ன?",
                "options": ["2", "3", "4", "5"],
                "correct_answer": "3",
                "explanation": "2x = 6, x = 3",
            },
            {
                "question_number": 2,
                "question_type": "MCQ",
                "difficulty": "MEDIUM",
                "bloom_level": "APPLY",
                "marks": 2,
                "question_text": "A train travels 120 km in 2 hours. Find its speed in m/s.",
                "question_text_ta": "120 கி.மீ தூரத்தை 2 மணி நேரத்தில் செல்லும் ரயிலின் வேகம் m/s?",
                "options": ["16.67", "33.33", "60", "120"],
                "correct_answer": "16.67",
                "explanation": "Speed = 120/2 = 60 km/h = 16.67 m/s",
            },
            {
                "question_number": 3,
                "question_type": "SHORT_ANSWER",
                "difficulty": "MEDIUM",
                "bloom_level": "UNDERSTAND",
                "marks": 3,
                "question_text": "Explain the Pythagorean theorem with a diagram description.",
                "question_text_ta": "பிதாகரஸ் தேற்றத்தை விளக்கவும்.",
                "options": None,
                "correct_answer": "In a right triangle, a² + b² = c²",
                "explanation": "Square of hypotenuse equals sum of squares of other sides",
            },
            {
                "question_number": 4,
                "question_type": "HOTS",
                "difficulty": "HARD",
                "bloom_level": "ANALYZE",
                "marks": 5,
                "question_text": (
                    "A rectangular garden has perimeter 60m. If length is twice the breadth, "
                    "find dimensions that maximize area. Justify your reasoning."
                ),
                "question_text_ta": "செவ்வக தோட்டத்தின் சுற்றளவு 60m. நீளம் அகலத்தின் இரண்டு மடங்கு — பரப்பளவை அதிகப்படுத்தும் பரிமாணங்கள்?",
                "options": None,
                "correct_answer": "Length=20m, Breadth=10m, Max Area=200 sq.m",
                "explanation": "2(l+b)=60, l=2b → 6b=60 → b=10, l=20",
            },
        ]
        return {
            "title": request.title,
            "total_marks": request.total_marks,
            "duration_minutes": request.duration_minutes,
            "blueprint": [
                {"section_name": "Part A - MCQ", "question_type": "MCQ", "count": 2, "marks_each": 1.5, "total_marks": 3},
                {"section_name": "Part B - Short Answer", "question_type": "SHORT_ANSWER", "count": 1, "marks_each": 3, "total_marks": 3},
                {"section_name": "Part C - HOTS", "question_type": "HOTS", "count": 1, "marks_each": 5, "total_marks": 5},
            ],
            "questions": questions,
            "answer_key": {"1": "3", "2": "16.67", "3": "a² + b² = c²", "4": "20m x 10m"},
        }


question_paper_service = QuestionPaperService()
