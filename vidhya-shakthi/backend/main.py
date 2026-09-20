from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api.routers import auth, admin, student, teacher, parent, attendance, ai, whatsapp_webhook, learn_content

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Vidhya Shakthi — Unified School Operating System for Samacheer Kalvi",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(student.router, prefix="/api/student", tags=["Student"])
app.include_router(teacher.router, prefix="/api/teacher", tags=["Teacher"])
app.include_router(parent.router, prefix="/api/parent", tags=["Parent"])
app.include_router(attendance.router, prefix="/api/v1/attendance", tags=["Attendance"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI Engine"])
app.include_router(whatsapp_webhook.router, prefix="/api/v1/whatsapp", tags=["WhatsApp Webhook"])
app.include_router(learn_content.router, prefix="/api/v1/learn-content", tags=["Learn CMS"])


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "Vidhya Shakthi Backend Running",
        "version": settings.APP_VERSION,
    }


@app.get("/api/v1/health")
def detailed_health():
    return {
        "database": "configured",
        "ai_engine": "ready",
        "messaging": "whatsapp+sms",
        "vector_db": "pgvector",
    }
