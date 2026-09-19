# Vidhya Shakthi — Complete Technical Blueprint

All-in-one unified School Operating System for Tamil Nadu State Board (Samacheer Kalvi).

---

## STAGE 1: Database Architecture

**Location:** `database/schema.sql`

### Entity Relationship Overview

```
schools ──┬── grades ──┬── student_profiles ── users
          │            └── timetables
          ├── subjects ── syllabus_chapters
          │            └── question_bank
          └── users (ADMIN|TEACHER|STUDENT|PARENT)
                ├── attendance ── parent_alerts
                ├── homework_assignments ── homework_submissions
                ├── marks_records
                └── academic_analytics
```

### Key Design Decisions

| Module | Tables | Constraints |
|--------|--------|-------------|
| Users | `users`, `student_profiles`, `parent_student_links`, `teacher_profiles` | Role enum, phone regex, unique roll per grade |
| Attendance | `attendance`, `parent_alerts` | Unique (student, date); alert delivery status tracking |
| Homework | `homework_assignments`, `homework_submissions` | Unique (homework, student); eval status enum |
| Analytics | `marks_records`, `academic_analytics` | Generated `percentage` column; composite score index |
| Questions | `question_bank`, `ai_question_papers` | Bloom's taxonomy + difficulty enums; JSONB paper storage |
| Timetable | `timetables`, `teacher_workloads`, `rooms` | No double-booking via unique (grade, day, period) |

### Apply Schema

```bash
docker compose up -d postgres
psql postgresql://vidhya:vidhya@localhost:5432/vidhya_shakthi -f database/schema.sql
```

---

## STAGE 2: Backend FastAPI Core APIs

**Location:** `backend/`

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/attendance/submit` | POST | Mark attendance + auto WhatsApp/SMS alerts |
| `/api/v1/ai/generate-question-paper` | POST | LLM question paper with difficulty ratio |
| `/api/v1/ai/tutor-chat` | POST | RAG + Socratic Tamil tutor |
| `/api/v1/ai/categorize-student` | POST | Performance categorization engine |
| `/api/v1/ai/optimize-timetable` | POST | Constraint-satisfaction demo |
| `/api/v1/whatsapp/webhook` | GET/POST | Meta WhatsApp verification + delivery callbacks |

### Attendance + Alert Flow

1. Teacher POSTs batch attendance entries to `/api/v1/attendance/submit`
2. Service upserts `attendance` rows (ON CONFLICT update)
3. Filters `status = ABSENT` student IDs
4. Joins `student_profiles` → parent phone + preferred language
5. Builds bilingual Tamil/English message templates
6. Inserts `parent_alerts` rows with `PENDING` status
7. Async dispatches via Meta WhatsApp Business API
8. On failure → Twilio SMS fallback
9. Updates `delivery_status` to `SENT` or `FAILED`

### Run Backend

```bash
cd backend
cp .env.example .env
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## STAGE 3: Frontend Unified Dashboard

**Location:** `frontend/src/UnifiedDashboard.jsx`

Single-file React component with 6 tab-based modules:

1. **Admin Master Control** — KPI cards, academic health bar chart, teacher workload gauge, attendance trend, critical alerts
2. **Teacher Attendance & Alerts** — Present/Absent/Leave toggles, one-click WhatsApp trigger
3. **Smart Homework Diary** — Publish form with audio/PDF, student priority view, completion progress bars
4. **Student Categorization** — Topper/Average/Slow Learner table with remedial action buttons
5. **AI Tamil Tutor** — Socratic chat widget + Samacheer digital book shelf
6. **Question Generator & Timetable** — Dynamic paper builder + master timetable grid

### Run Frontend

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

---

## STAGE 4: Core System Logic Deep-Dive

### 4.1 Student Categorization Logic

**Implementation:** `backend/app/services/categorization_service.py`

The system computes a **composite score** from three weighted inputs:

```
composite = (marks × 0.50) + (homework × 0.30) + (attendance × 0.20)
```

**Step-by-step algorithm:**

1. **Aggregate marks** — Query `marks_records` for the student's subject averages over the current academic year. Compute `avg_marks_percentage`.

2. **Homework completion rate** — Count submissions with `evaluation_status != NOT_SUBMITTED` divided by total active assignments in `homework_assignments` for the student's grade.

3. **Attendance rate** — Count `PRESENT` + `HALF_DAY` (weighted 0.5) days divided by total school days in the term from `attendance`.

4. **Class-relative adjustment** — Compute class average marks for the same grade/subject. If student exceeds class average by ≥10 percentage points, boost toward TOPPER.

5. **Category assignment:**
   - `composite ≥ 80 AND relative_performance ≥ +10` → **TOPPER**
   - `composite < 45 OR weak_topic_count ≥ 3` → **SLOW_LEARNER**
   - Otherwise → **AVERAGE**

6. **Remedial action mapping:**
   - TOPPER → HOTS problems, advanced reading, peer mentoring
   - SLOW_LEARNER → Foundational videos, audio flashcards (Tamil), remedial worksheets, parent conference
   - AVERAGE → Targeted practice drills, revision notes
   - Cross-cutting: if homework completion < 60%, inject homework coaching regardless of category

7. **Persistence** — Results written to `academic_analytics` and `student_profiles.performance_category` with timestamp.

### 4.2 Socratic Teaching AI Logic

**Implementation:** `backend/app/services/tutor_service.py`

The tutor is designed to **never give direct answers on first contact**. The logic operates in layers:

**Layer 1 — RAG Retrieval:**
- Embed the student's question using `text-embedding-3-small`
- Query Qdrant collection `samacheer_kalvi_books` with subject/chapter filters
- Retrieve top-5 chunks above 0.65 cosine similarity threshold
- Format as syllabus context block for the LLM

**Layer 2 — Socratic Prompt Engineering:**
The system prompt enforces 7 rules:
1. Never give direct final answer on first response
2. Guide through building questions
3. Use grade-appropriate Tamil/English
4. Reference syllabus context
5. Redirect "give me the answer" requests to guiding questions
6. After 3+ exchanges, allow partial hints only
7. Celebrate correct reasoning, redirect misconceptions

**Layer 3 — Conversation State:**
- Track `socratic_step` (1 = initial probe, 2 = scaffold, 3 = hint, 4+ = partial reveal)
- Track `hint_level`: none → gentle → moderate
- `direct_answer_blocked: true` flag returned to frontend

**Layer 4 — Response Structure:**
```json
{
  "reply_ta": "இந்த சூத்திரத்தை நீங்கள் ஏற்கனவே கற்றுள்ளீர்களா?",
  "socratic_step": 1,
  "follow_up_questions": ["What formula applies here?"],
  "direct_answer_blocked": true
}
```

**Example flow for "What is the value of x in 2x + 4 = 10?":**
1. Tutor: "Linear equations-ஐ பற்றி உனக்கு என்ன தெரியும்?" (Step 1)
2. Student: "x is unknown"
3. Tutor: "சரி! 2x + 4 = 10-ல், முதலில் எந்த side-ல் constant-ஐ isolate செய்வீர்கள்?" (Step 2)
4. Student: "Subtract 4"
5. Tutor: "Excellent! 2x = 6. இப்போது x-ஐ கண்டுபிடிக்க என்ன செய்வீர்கள்?" (Step 3, gentle hint)
6. Student: "Divide by 2"
7. Tutor: "✓ x = 3! நீங்களே solve செய்தீர்கள்!" (Step 4, confirmation)

### 4.3 Timetable Optimizer Logic

**Implementation:** `backend/app/services/timetable_optimizer.py`

A **greedy constraint-satisfaction engine** with backtracking for conflict resolution.

**Hard Constraints (must never violate):**
1. **Teacher exclusivity** — One teacher cannot be in two places at the same (day, period)
2. **Room exclusivity** — One room cannot host two classes simultaneously
3. **Teacher capacity** — Weekly periods ≤ `teacher_profiles.max_periods_week`
4. **Lab assignment** — Lab subjects must use rooms with `room_type = LAB`
5. **Grade slot uniqueness** — One subject per (grade, day, period)

**Soft Constraints (optimized):**
1. Balance teacher workload evenly across the week
2. Avoid scheduling heavy subjects (Math, Science) consecutively for same grade
3. Minimize teacher burnout score: `(assigned_periods / max_allowed) × 100`

**Algorithm steps:**
1. Input: list of `GradeRequirement` (subject → period count), `TeacherConstraint` (subjects, max periods, unavailable slots), `rooms` map
2. For each grade, for each subject needing N periods:
   a. Find teacher with matching `subject_ids` and lowest current load
   b. Iterate days MON→SAT, periods 1→8
   c. Skip if teacher unavailable, grade slot taken, or teacher at capacity
   d. Assign room (lab-capable for lab subjects)
   e. Record slot, update schedules and load counters
3. Report violations for unassigned periods
4. Compute burnout scores per teacher

**Conflict detection query (PostgreSQL):**
```sql
SELECT t1.teacher_id, t1.day, t1.period_number
FROM timetables t1
JOIN timetables t2 ON t1.teacher_id = t2.teacher_id
  AND t1.day = t2.day AND t1.period_number = t2.period_number
  AND t1.id != t2.id AND t1.is_active AND t2.is_active;
```

---

## STAGE 5: 8-Week Production Deployment Roadmap

### Week 1 — Foundation & Infrastructure

| Day | Task |
|-----|------|
| 1-2 | Docker Compose setup (PostgreSQL, Redis, Qdrant, Backend, Frontend) |
| 3 | Apply `database/schema.sql`, seed demo school data |
| 4 | Configure `.env` with secrets (OpenAI, WhatsApp, Twilio) |
| 5 | CI pipeline: lint, test, Docker build on push |

**Deliverable:** All services running locally via `docker compose up`

### Week 2 — Authentication & RBAC

| Day | Task |
|-----|------|
| 1-2 | JWT auth with role-based middleware (ADMIN, TEACHER, STUDENT, PARENT) |
| 3 | Route guards: teachers see only their classes, parents see only linked wards |
| 4 | Password hashing (bcrypt), refresh tokens, session management |
| 5 | Frontend login flow with role-based dashboard routing |

**Deliverable:** Secure multi-role authentication

### Week 3 — Core Modules (Attendance + Homework)

| Day | Task |
|-----|------|
| 1-2 | Attendance CRUD + batch submit API (complete) |
| 3 | WhatsApp Business API integration + webhook for delivery receipts |
| 4 | Homework publish/submit/grade workflow |
| 5 | File upload (S3/GCS) for PDF, audio, photo attachments |

**Deliverable:** Teachers can take attendance, trigger alerts, assign homework

### Week 4 — Analytics & Categorization

| Day | Task |
|-----|------|
| 1-2 | Marks entry API + bulk CSV import |
| 3 | Nightly Celery job: recompute `academic_analytics` for all students |
| 4 | Categorization engine integration with remedial action triggers |
| 5 | Admin dashboard wired to live PostgreSQL data via Recharts |

**Deliverable:** Live student categorization with remedial recommendations

### Week 5 — AI Pipeline (Vector DB + RAG Tutor)

| Day | Task |
|-----|------|
| 1-2 | Download Samacheer Kalvi Grade 1-12 PDFs from official TN SCERT portal |
| 3 | Run `scripts/index_syllabus.py` — chunk, embed, upsert to Qdrant |
| 4 | Tutor chat API with Socratic prompt tuning for Tamil |
| 5 | Load testing: 100 concurrent chat sessions |

**Deliverable:** RAG tutor answering syllabus-grounded questions in Tamil

### Week 6 — Question Paper Generator + Timetable

| Day | Task |
|-----|------|
| 1-2 | Question paper LLM pipeline with difficulty ratio enforcement |
| 3 | Question bank CRUD + teacher review/verify workflow |
| 4 | Timetable optimizer integration with conflict detection |
| 5 | PDF export of generated question papers |

**Deliverable:** Teachers generate, review, and print exam papers

### Week 7 — Parent Mobile + Security Hardening

| Day | Task |
|-----|------|
| 1-2 | Parent PWA: attendance status, homework checklist, progress charts |
| 3 | Rate limiting, input sanitization, SQL injection prevention audit |
| 4 | HTTPS/TLS, CORS lockdown, API key rotation |
| 5 | Penetration testing + OWASP Top 10 remediation |

**Deliverable:** Parent-facing mobile app + security audit passed

### Week 8 — Cloud Deployment & Go-Live

| Day | Task |
|-----|------|
| 1-2 | **AWS deployment:** ECS Fargate (backend), RDS PostgreSQL, ElastiCache Redis, S3 (files) |
| 3 | **Alternative GCP:** Cloud Run + Cloud SQL + Memorystore + Cloud Storage |
| 4 | Qdrant Cloud or self-hosted on EC2/GCE |
| 5 | DNS, SSL (ACM/Let's Encrypt), monitoring (CloudWatch/Datadog), go-live |

**Deliverable:** Production deployment with monitoring and rollback plan

### WhatsApp Webhook Setup (Meta Business API)

1. Create Meta Business Account at business.facebook.com
2. Add WhatsApp product → get Phone Number ID and permanent access token
3. Set webhook URL: `https://your-domain.com/api/v1/whatsapp/webhook`
4. Verify token: match `WHATSAPP_VERIFY_TOKEN` in `.env`
5. Subscribe to `messages` and `message_status` fields
6. Test with sandbox number before production

### Environment Variables (Production)

```env
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/vidhya_shakthi
REDIS_URL=redis://elasticache-endpoint:6379/0
QDRANT_URL=https://your-qdrant.cloud:6333
OPENAI_API_KEY=sk-...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_ACCESS_TOKEN=...
TWILIO_ACCOUNT_SID=...
SECRET_KEY=<openssl rand -hex 32>
```

### Monitoring Checklist

- [ ] PostgreSQL connection pool metrics
- [ ] API latency p50/p95/p99
- [ ] WhatsApp delivery success rate
- [ ] Qdrant query latency
- [ ] LLM token usage and cost tracking
- [ ] Celery task queue depth
- [ ] Error rate alerting (PagerDuty/Slack)

---

## Project Structure

```
vidhya-shakthi/
├── database/schema.sql          # STAGE 1 — Full PostgreSQL schema
├── backend/
│   ├── main.py                  # FastAPI entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   └── app/
│       ├── core/config.py       # Settings & env vars
│       ├── schemas/             # Pydantic request/response models
│       ├── services/            # Business logic engines
│       └── api/routers/         # REST endpoints
├── frontend/
│   └── src/UnifiedDashboard.jsx # STAGE 3 — Single-file unified UI
├── scripts/index_syllabus.py    # Vector DB indexing pipeline
├── docker-compose.yml           # Full stack orchestration
└── docs/BLUEPRINT.md            # This document (STAGE 4 & 5)
```
