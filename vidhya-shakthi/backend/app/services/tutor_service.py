"""
RAG-Based Socratic Tamil AI Tutor — Samacheer Kalvi syllabus grounding using pgvector.
"""
import json
import logging
import uuid
from typing import Any

from openai import OpenAI
from langchain_openai import OpenAIEmbeddings
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import SessionLocal
from app.models.document_chunk import DocumentChunk
from app.schemas.ai import TutorChatRequest, TutorChatResponse

logger = logging.getLogger(__name__)
settings = get_settings()

SOCRATIC_SYSTEM_PROMPT = """You are Vidhya Shakthi AI Tamil Tutor — a Socratic teacher for Samacheer Kalvi students.

CRITICAL RULES (never violate):
1. NEVER give the direct final answer on the first response.
2. Guide the student through questions that build understanding step-by-step.
3. Use simple everyday Tamil (and English if requested) appropriate for the grade level.
4. Reference the provided syllabus context when explaining concepts.
5. If the student asks for the answer directly, respond with a guiding question instead.
6. After 3+ socratic exchanges, you may provide a partial hint — still not the full answer.
7. Celebrate correct reasoning and gently redirect misconceptions.

Respond in JSON:
{
  "reply": "English response",
  "reply_ta": "Tamil response (primary)",
  "socratic_step": 1,
  "hint_level": "none|gentle|moderate",
  "follow_up_questions": ["question1", "question2"],
  "direct_answer_blocked": true
}"""


class TutorService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        self.embeddings = (
            OpenAIEmbeddings(model=settings.EMBEDDING_MODEL, api_key=settings.OPENAI_API_KEY)
            if settings.OPENAI_API_KEY
            else None
        )

    def chat(self, request: TutorChatRequest, conversation_history: list[dict] | None = None) -> TutorChatResponse:
        session_id = request.session_id or uuid.uuid4()
        rag_sources = self._retrieve_context(request)
        context_block = self._format_context(rag_sources)

        if self.client:
            parsed = self._call_llm(request, context_block, conversation_history or [])
        else:
            parsed = self._offline_socratic_response(request, rag_sources)

        return TutorChatResponse(
            session_id=session_id,
            reply=parsed["reply"],
            reply_ta=parsed.get("reply_ta"),
            socratic_step=parsed.get("socratic_step", 1),
            hint_level=parsed.get("hint_level", "none"),
            rag_sources=rag_sources,
            follow_up_questions=parsed.get("follow_up_questions", []),
            direct_answer_blocked=parsed.get("direct_answer_blocked", True),
        )

    def _retrieve_context(self, request: TutorChatRequest) -> list[dict]:
        if not self.embeddings:
            return self._fallback_syllabus_chunks(request)

        try:
            query_vector = self.embeddings.embed_query(request.message)
            
            db: Session = SessionLocal()
            try:
                query = db.query(DocumentChunk, DocumentChunk.embedding.cosine_distance(query_vector).label("distance"))
                
                if request.subject_id:
                    query = query.filter(DocumentChunk.subject_id == str(request.subject_id))
                if getattr(request, "chapter_id", None): # chapter_title might be what is stored in DB
                    pass # Or handle chapter filter if strictly UUID or title

                # We want threshold corresponding to similarity score > 0.65.
                # Distance = 1 - cosine_similarity. So similarity > 0.65 means distance < 0.35.
                results = query.filter(DocumentChunk.embedding.cosine_distance(query_vector) < 0.35) \
                               .order_by("distance") \
                               .limit(5) \
                               .all()

                return [
                    {
                        "text": hit.DocumentChunk.content,
                        "chapter": hit.DocumentChunk.chapter_title,
                        "page": hit.DocumentChunk.page_number,
                        "score": 1.0 - float(hit.distance),
                    }
                    for hit in results
                ]
            finally:
                db.close()
                
        except Exception as exc:
            logger.warning("pgvector search failed: %s", exc)
            return self._fallback_syllabus_chunks(request)

    def _fallback_syllabus_chunks(self, request: TutorChatRequest) -> list[dict]:
        return [
            {
                "text": (
                    "Samacheer Kalvi Grade 10 Mathematics — Real Numbers: "
                    "A rational number can be expressed as p/q where p and q are integers and q ≠ 0. "
                    "Irrational numbers like √2 cannot be written as fractions."
                ),
                "chapter": "Chapter 1 — Real Numbers",
                "page": 12,
                "score": 0.85,
            },
            {
                "text": (
                    "Euclid's Division Lemma: For positive integers a and b, "
                    "there exist unique integers q and r such that a = bq + r, where 0 ≤ r < b."
                ),
                "chapter": "Chapter 1 — Real Numbers",
                "page": 15,
                "score": 0.78,
            },
        ]

    def _format_context(self, sources: list[dict]) -> str:
        if not sources:
            return "No syllabus context retrieved."
        blocks = []
        for i, src in enumerate(sources, 1):
            blocks.append(
                f"[Source {i}] {src.get('chapter', 'Unknown')} (p.{src.get('page', '?')}):\n{src['text']}"
            )
        return "\n\n".join(blocks)

    def _call_llm(
        self,
        request: TutorChatRequest,
        context: str,
        history: list[dict],
    ) -> dict:
        history_text = "\n".join(
            f"{msg['role']}: {msg['content']}" for msg in history[-6:]
        )
        user_content = f"""Student Grade: {request.grade_number}
Language preference: {request.language}

Syllabus Context:
{context}

Conversation so far:
{history_text or "(New conversation)"}

Student message: {request.message}

Remember: Use Socratic method. Do NOT give direct answers."""

        response = self.client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": SOCRATIC_SYSTEM_PROMPT},
                {"role": "user", "content": user_content},
            ],
            temperature=0.7,
            response_format={"type": "json_object"},
        )
        return json.loads(response.choices[0].message.content)

    def _offline_socratic_response(self, request: TutorChatRequest, sources: list[dict]) -> dict:
        chapter = sources[0]["chapter"] if sources else "Samacheer Kalvi"
        return {
            "reply": (
                f"Good question! Before I explain, let me ask you: "
                f"What do you already know about this topic from {chapter}? "
                f"Try to connect it to something you've learned in class."
            ),
            "reply_ta": (
                "நல்ல கேள்வி! நான் விளக்குவதற்கு முன், "
                f"{chapter} பாடத்தில் இதைப் பற்றி உனக்கு ஏற்கனவே தெரிந்தது என்ன? "
                "வகுப்பில் கற்றதோடு இதை இணைக்க முயற்சி செய்."
            ),
            "socratic_step": 1,
            "hint_level": "none",
            "follow_up_questions": [
                "Can you define the key terms in your own words?",
                "What formula or concept might apply here?",
            ],
            "direct_answer_blocked": True,
        }


tutor_service = TutorService()
