-- =============================================================================
-- Vidhya Shakthi OS — Production PostgreSQL Schema
-- Samacheer Kalvi (Tamil Nadu State Board) Unified School Operating System
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- ENUM Types
-- ---------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('ADMIN', 'TEACHER', 'STUDENT', 'PARENT');
CREATE TYPE preferred_language AS ENUM ('ta', 'en');
CREATE TYPE performance_category AS ENUM ('TOPPER', 'AVERAGE', 'SLOW_LEARNER');
CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'LEAVE', 'HALF_DAY');
CREATE TYPE alert_channel AS ENUM ('WHATSAPP', 'SMS', 'BOTH');
CREATE TYPE alert_delivery_status AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'SKIPPED');
CREATE TYPE homework_eval_status AS ENUM ('NOT_SUBMITTED', 'SUBMITTED', 'AI_GRADED', 'TEACHER_REVIEWED', 'LATE');
CREATE TYPE question_type AS ENUM ('MCQ', 'SHORT_ANSWER', 'LONG_ANSWER', 'HOTS', 'FILL_BLANK', 'TRUE_FALSE');
CREATE TYPE bloom_level AS ENUM ('REMEMBER', 'UNDERSTAND', 'APPLY', 'ANALYZE', 'EVALUATE', 'CREATE');
CREATE TYPE difficulty_level AS ENUM ('EASY', 'MEDIUM', 'HARD');
CREATE TYPE day_of_week AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT');
CREATE TYPE period_type AS ENUM ('THEORY', 'LAB', 'ACTIVITY', 'LIBRARY', 'SPORTS');

-- ---------------------------------------------------------------------------
-- 1. SCHOOLS, CLASSES, SUBJECTS (Foundation)
-- ---------------------------------------------------------------------------
CREATE TABLE schools (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    udise_code      VARCHAR(20) UNIQUE,
    district        VARCHAR(100),
    board           VARCHAR(50) DEFAULT 'Samacheer Kalvi',
    academic_year   VARCHAR(9) NOT NULL DEFAULT '2025-26',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE grades (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    grade_number    SMALLINT NOT NULL CHECK (grade_number BETWEEN 1 AND 12),
    section         VARCHAR(5) NOT NULL DEFAULT 'A',
    class_teacher_id UUID,
    UNIQUE (school_id, grade_number, section)
);

CREATE TABLE subjects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    name_ta         VARCHAR(100),
    grade_number    SMALLINT NOT NULL CHECK (grade_number BETWEEN 1 AND 12),
    samacheer_code  VARCHAR(20),
    UNIQUE (school_id, name, grade_number)
);

CREATE TABLE syllabus_chapters (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id      UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    chapter_number  SMALLINT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    title_ta        VARCHAR(255),
    term            SMALLINT CHECK (term IN (1, 2, 3)),
    pdf_url         TEXT,
    vector_index_id VARCHAR(100),
    UNIQUE (subject_id, chapter_number)
);

-- ---------------------------------------------------------------------------
-- 2. USERS & STUDENT PROFILES
-- ---------------------------------------------------------------------------
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    role                user_role NOT NULL,
    full_name           VARCHAR(255) NOT NULL,
    full_name_ta        VARCHAR(255),
    email               VARCHAR(255) UNIQUE,
    phone               VARCHAR(20),
    hashed_password     VARCHAR(255),
    preferred_language  preferred_language NOT NULL DEFAULT 'ta',
    avatar_url          TEXT,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at       TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT users_phone_format CHECK (phone IS NULL OR phone ~ '^\+?[0-9]{10,15}$')
);

CREATE INDEX idx_users_school_role ON users (school_id, role);
CREATE INDEX idx_users_email ON users (email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_phone ON users (phone) WHERE phone IS NOT NULL;

CREATE TABLE student_profiles (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    grade_id                UUID NOT NULL REFERENCES grades(id) ON DELETE RESTRICT,
    roll_number             VARCHAR(20) NOT NULL,
    admission_number        VARCHAR(50),
    date_of_birth           DATE,
    gender                  VARCHAR(10),
    performance_category    performance_category NOT NULL DEFAULT 'AVERAGE',
    category_computed_at    TIMESTAMPTZ,
    category_score          DECIMAL(5,2) DEFAULT 0,
    weak_topics             TEXT[] DEFAULT '{}',
    strong_topics           TEXT[] DEFAULT '{}',
    remedial_plan           JSONB DEFAULT '{}',
    parent_user_id          UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (grade_id, roll_number)
);

CREATE INDEX idx_student_profiles_grade ON student_profiles (grade_id);
CREATE INDEX idx_student_profiles_category ON student_profiles (performance_category);
CREATE INDEX idx_student_profiles_parent ON student_profiles (parent_user_id);

CREATE TABLE parent_student_links (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relationship    VARCHAR(30) DEFAULT 'guardian',
    is_primary      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (parent_id, student_id)
);

CREATE TABLE teacher_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    employee_id     VARCHAR(50),
    specialization  VARCHAR(100),
    max_periods_week SMALLINT NOT NULL DEFAULT 30,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3. ATTENDANCE & PARENT ALERTS
-- ---------------------------------------------------------------------------
CREATE TABLE attendance (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    grade_id            UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
    student_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    marked_by           UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    attendance_date     DATE NOT NULL DEFAULT CURRENT_DATE,
    status              attendance_status NOT NULL DEFAULT 'PRESENT',
    check_in_time       TIME,
    remarks             TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, attendance_date)
);

CREATE INDEX idx_attendance_date_grade ON attendance (attendance_date, grade_id);
CREATE INDEX idx_attendance_student_date ON attendance (student_id, attendance_date DESC);
CREATE INDEX idx_attendance_status_date ON attendance (status, attendance_date) WHERE status IN ('ABSENT', 'LEAVE');

CREATE TABLE parent_alerts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attendance_id       UUID NOT NULL REFERENCES attendance(id) ON DELETE CASCADE,
    student_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id           UUID REFERENCES users(id) ON DELETE SET NULL,
    channel             alert_channel NOT NULL DEFAULT 'WHATSAPP',
    delivery_status     alert_delivery_status NOT NULL DEFAULT 'PENDING',
    message_ta          TEXT NOT NULL,
    message_en          TEXT NOT NULL,
    recipient_phone     VARCHAR(20) NOT NULL,
    external_message_id VARCHAR(100),
    error_message       TEXT,
    sent_at             TIMESTAMPTZ,
    delivered_at        TIMESTAMPTZ,
    retry_count         SMALLINT NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_parent_alerts_status ON parent_alerts (delivery_status) WHERE delivery_status = 'PENDING';
CREATE INDEX idx_parent_alerts_student ON parent_alerts (student_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 4. HOMEWORK ASSIGNMENTS & SUBMISSIONS
-- ---------------------------------------------------------------------------
CREATE TABLE homework_assignments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    grade_id            UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
    subject_id          UUID NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
    teacher_id          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title               VARCHAR(255) NOT NULL,
    description         TEXT,
    audio_attachment_url TEXT,
    pdf_attachment_url  TEXT,
    image_attachment_url TEXT,
    due_date            DATE NOT NULL,
    priority            SMALLINT NOT NULL DEFAULT 2 CHECK (priority BETWEEN 1 AND 3),
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_homework_grade_due ON homework_assignments (grade_id, due_date DESC);
CREATE INDEX idx_homework_teacher ON homework_assignments (teacher_id, created_at DESC);

CREATE TABLE homework_submissions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    homework_id         UUID NOT NULL REFERENCES homework_assignments(id) ON DELETE CASCADE,
    student_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    submission_text     TEXT,
    photo_url           TEXT,
    audio_url           TEXT,
    ai_feedback         TEXT,
    ai_score            DECIMAL(5,2),
    teacher_remarks     TEXT,
    evaluation_status   homework_eval_status NOT NULL DEFAULT 'NOT_SUBMITTED',
    submitted_at        TIMESTAMPTZ,
    graded_at           TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (homework_id, student_id)
);

CREATE INDEX idx_homework_submissions_status ON homework_submissions (evaluation_status);
CREATE INDEX idx_homework_submissions_student ON homework_submissions (student_id, submitted_at DESC);

-- ---------------------------------------------------------------------------
-- 5. MARKS RECORDS & ACADEMIC ANALYTICS
-- ---------------------------------------------------------------------------
CREATE TABLE marks_records (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id          UUID NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
    exam_name           VARCHAR(100) NOT NULL,
    exam_type           VARCHAR(50) DEFAULT 'QUARTERLY',
    term                SMALLINT CHECK (term IN (1, 2, 3)),
    marks_obtained      DECIMAL(6,2) NOT NULL CHECK (marks_obtained >= 0),
    total_marks         DECIMAL(6,2) NOT NULL CHECK (total_marks > 0),
    percentage          DECIMAL(5,2) GENERATED ALWAYS AS (
                            ROUND((marks_obtained / NULLIF(total_marks, 0)) * 100, 2)
                        ) STORED,
    weak_topic_tags     TEXT[] DEFAULT '{}',
    recorded_by         UUID REFERENCES users(id) ON DELETE SET NULL,
    exam_date           DATE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT marks_obtained_lte_total CHECK (marks_obtained <= total_marks)
);

CREATE INDEX idx_marks_student_subject ON marks_records (student_id, subject_id);
CREATE INDEX idx_marks_exam_date ON marks_records (exam_date DESC);

CREATE TABLE academic_analytics (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id              UUID REFERENCES subjects(id) ON DELETE SET NULL,
    grade_id                UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
    academic_year           VARCHAR(9) NOT NULL,
    avg_marks_percentage    DECIMAL(5,2) NOT NULL DEFAULT 0,
    homework_completion_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    attendance_rate         DECIMAL(5,2) NOT NULL DEFAULT 0,
    composite_score         DECIMAL(5,2) NOT NULL DEFAULT 0,
    performance_category    performance_category NOT NULL DEFAULT 'AVERAGE',
    weak_topics             TEXT[] DEFAULT '{}',
    recommended_actions     JSONB DEFAULT '[]',
    computed_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, subject_id, academic_year)
);

CREATE INDEX idx_academic_analytics_category ON academic_analytics (performance_category, grade_id);

-- ---------------------------------------------------------------------------
-- 6. QUESTION BANK & AI QUESTION PAPERS
-- ---------------------------------------------------------------------------
CREATE TABLE question_bank (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    subject_id          UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    chapter_id          UUID REFERENCES syllabus_chapters(id) ON DELETE SET NULL,
    question_type       question_type NOT NULL,
    bloom_level         bloom_level NOT NULL DEFAULT 'UNDERSTAND',
    difficulty          difficulty_level NOT NULL DEFAULT 'MEDIUM',
    question_text       TEXT NOT NULL,
    question_text_ta    TEXT,
    options             JSONB,
    correct_answer      TEXT NOT NULL,
    explanation         TEXT,
    marks               DECIMAL(4,1) NOT NULL DEFAULT 1,
    is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
    created_by          UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_question_bank_subject_difficulty ON question_bank (subject_id, difficulty);
CREATE INDEX idx_question_bank_chapter ON question_bank (chapter_id);
CREATE INDEX idx_question_bank_bloom ON question_bank (bloom_level);

CREATE TABLE ai_question_papers (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    teacher_id          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    subject_id          UUID NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
    grade_number        SMALLINT NOT NULL,
    title               VARCHAR(255) NOT NULL,
    chapter_ids         UUID[] DEFAULT '{}',
    difficulty_ratio    JSONB NOT NULL DEFAULT '{"EASY": 30, "MEDIUM": 50, "HARD": 20}',
    total_marks         DECIMAL(6,1) NOT NULL DEFAULT 100,
    duration_minutes    SMALLINT NOT NULL DEFAULT 180,
    generated_paper     JSONB NOT NULL,
    answer_key          JSONB NOT NULL,
    blueprint           JSONB NOT NULL,
    llm_model           VARCHAR(50) DEFAULT 'gpt-4o',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_question_papers_teacher ON ai_question_papers (teacher_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 7. TIMETABLES & TEACHER WORKLOADS
-- ---------------------------------------------------------------------------
CREATE TABLE rooms (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    room_number     VARCHAR(20) NOT NULL,
    room_type       VARCHAR(30) DEFAULT 'CLASSROOM',
    capacity        SMALLINT DEFAULT 40,
    UNIQUE (school_id, room_number)
);

CREATE TABLE timetables (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    grade_id        UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
    day             day_of_week NOT NULL,
    period_number   SMALLINT NOT NULL CHECK (period_number BETWEEN 1 AND 8),
    subject_id      UUID NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
    teacher_id      UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    room_id         UUID REFERENCES rooms(id) ON DELETE SET NULL,
    period_type     period_type NOT NULL DEFAULT 'THEORY',
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    academic_year   VARCHAR(9) NOT NULL DEFAULT '2025-26',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (grade_id, day, period_number, academic_year),
    CONSTRAINT timetables_time_order CHECK (start_time < end_time)
);

CREATE INDEX idx_timetables_teacher_day ON timetables (teacher_id, day, period_number);
CREATE INDEX idx_timetables_room_day ON timetables (room_id, day, period_number) WHERE room_id IS NOT NULL;

CREATE TABLE teacher_workloads (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id           UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year       VARCHAR(9) NOT NULL DEFAULT '2025-26',
    week_start_date     DATE NOT NULL,
    total_periods       SMALLINT NOT NULL DEFAULT 0,
    theory_periods      SMALLINT NOT NULL DEFAULT 0,
    lab_periods         SMALLINT NOT NULL DEFAULT 0,
    max_allowed_periods SMALLINT NOT NULL DEFAULT 30,
    burnout_score       DECIMAL(5,2) NOT NULL DEFAULT 0,
    computed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (teacher_id, week_start_date, academic_year)
);

CREATE INDEX idx_teacher_workloads_burnout ON teacher_workloads (burnout_score DESC);

-- ---------------------------------------------------------------------------
-- 8. AI TUTOR CHAT SESSIONS
-- ---------------------------------------------------------------------------
CREATE TABLE tutor_chat_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id      UUID REFERENCES subjects(id) ON DELETE SET NULL,
    chapter_id      UUID REFERENCES syllabus_chapters(id) ON DELETE SET NULL,
    language        preferred_language NOT NULL DEFAULT 'ta',
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at        TIMESTAMPTZ
);

CREATE TABLE tutor_chat_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID NOT NULL REFERENCES tutor_chat_sessions(id) ON DELETE CASCADE,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('student', 'tutor', 'system')),
    content         TEXT NOT NULL,
    rag_sources     JSONB DEFAULT '[]',
    socratic_step   SMALLINT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tutor_messages_session ON tutor_chat_messages (session_id, created_at);

-- ---------------------------------------------------------------------------
-- 9. TRIGGERS — Auto-update timestamps
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_student_profiles_updated BEFORE UPDATE ON student_profiles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_attendance_updated BEFORE UPDATE ON attendance
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_homework_assignments_updated BEFORE UPDATE ON homework_assignments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_homework_submissions_updated BEFORE UPDATE ON homework_submissions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Learn Hub CMS — teacher submissions & admin-approved HTML lessons
-- ---------------------------------------------------------------------------
CREATE TYPE learn_lesson_status AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED');
CREATE TYPE learn_lesson_slot AS ENUM (
    'top_of_unit', 'before_concepts', 'after_concepts', 'append_unit', 'inline_concept'
);

CREATE TABLE learn_tutorial_lessons (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID REFERENCES schools(id) ON DELETE CASCADE,
    grade_number    SMALLINT NOT NULL DEFAULT 10 CHECK (grade_number BETWEEN 1 AND 12),
    subject_key     VARCHAR(64) NOT NULL,
    chapter_key     VARCHAR(128) NOT NULL,
    concept_key     VARCHAR(128),
    slot            learn_lesson_slot NOT NULL DEFAULT 'append_unit',
    sort_order      SMALLINT NOT NULL DEFAULT 0,
    title           VARCHAR(255) NOT NULL,
    title_ta        VARCHAR(255),
    html_content    TEXT NOT NULL DEFAULT '',
    css_content     TEXT NOT NULL DEFAULT '',
    status          learn_lesson_status NOT NULL DEFAULT 'PENDING_REVIEW',
    author_user_id  UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name     VARCHAR(255),
    reviewer_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewer_note   TEXT,
    approved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_learn_lessons_placement ON learn_tutorial_lessons (grade_number, subject_key, chapter_key, status);
CREATE INDEX idx_learn_lessons_pending ON learn_tutorial_lessons (status) WHERE status = 'PENDING_REVIEW';

-- ---------------------------------------------------------------------------
-- 10. SEED DATA — Demo school for development
-- ---------------------------------------------------------------------------
INSERT INTO schools (id, name, udise_code, district, board, academic_year)
VALUES ('a0000000-0000-0000-0000-000000000001', 'Govt. Higher Secondary School, Chennai', '33010100101', 'Chennai', 'Samacheer Kalvi', '2025-26');

INSERT INTO grades (id, school_id, grade_number, section)
VALUES ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10, 'A');

INSERT INTO subjects (id, school_id, name, name_ta, grade_number, samacheer_code)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Mathematics', 'கணிதம்', 10, 'MATH-10'),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Science', 'அறிவியல்', 10, 'SCI-10'),
    ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Tamil', 'தமிழ்', 10, 'TAM-10');
