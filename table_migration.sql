-- ============================================================================
-- AGORA DATABASE SCHEMA MIGRATION
-- Target: Supabase PostgreSQL 17
-- Focus: Performance, 100k+ scalability, Strict RLS Caching, Rollup Aggregations
-- ============================================================================
-- ----------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ----------------------------------------------------------------------------
-- Enables pg_trgm for fast trigram search (ILKE '%query%') on usernames
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- Enables uuid-ossp for random UUID generation (fallback for Postgres 17 native)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ----------------------------------------------------------------------------
-- 2. CUSTOM TYPES & ENUMS
-- ----------------------------------------------------------------------------
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_type') THEN
        CREATE TYPE public.role_type AS ENUM ('student', 'admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quiz_mode') THEN
        CREATE TYPE public.quiz_mode AS ENUM ('free', 'blitz', 'room');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_type') THEN
        CREATE TYPE public.difficulty_type AS ENUM ('easy', 'medium', 'hard');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'room_status') THEN
        CREATE TYPE public.room_status AS ENUM ('waiting', 'active', 'finished');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'friendship_status') THEN
        CREATE TYPE public.friendship_status AS ENUM ('pending', 'accepted', 'rejected', 'blocked');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status') THEN
        CREATE TYPE public.post_status AS ENUM ('draft', 'published');
    END IF;
END $$;
-- ----------------------------------------------------------------------------
-- 3. TABLES (Dependency Order)
-- ----------------------------------------------------------------------------
-- Users (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username text UNIQUE NOT NULL,
    avatar_url text,
    year_of_study int CHECK (year_of_study BETWEEN 1 AND 7),
    university text,
    role public.role_type NOT NULL DEFAULT 'student',
    streak_current int NOT NULL DEFAULT 0 CHECK (streak_current >= 0),
    streak_best int NOT NULL DEFAULT 0 CHECK (streak_best >= 0),
    last_activity_date date,
    is_premium boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
-- Subjects
CREATE TABLE IF NOT EXISTS public.subjects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    description text,
    icon_url text,
    color_hex varchar(7),
    display_order int NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);
-- Units
CREATE TABLE IF NOT EXISTS public.units (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    name text NOT NULL,
    display_order int NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);
-- Lessons
CREATE TABLE IF NOT EXISTS public.lessons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id uuid NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
    subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title text NOT NULL,
    content text NOT NULL,
    display_order int NOT NULL DEFAULT 0,
    is_published boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
-- Questions
CREATE TABLE IF NOT EXISTS public.questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    question_text text NOT NULL,
    options jsonb NOT NULL,
    correct_index int NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
    explanation text,
    difficulty public.difficulty_type NOT NULL DEFAULT 'medium',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT check_options_is_array CHECK (jsonb_typeof(options) = 'array' AND jsonb_array_length(options) = 4)
);
-- Quiz Sessions
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mode public.quiz_mode NOT NULL,
    lesson_id uuid REFERENCES public.lessons(id) ON DELETE SET NULL,
    subject_id uuid REFERENCES public.subjects(id) ON DELETE SET NULL,
    total_questions int NOT NULL CHECK (total_questions >= 0),
    correct_answers int NOT NULL CHECK (correct_answers >= 0 AND correct_answers <= total_questions),
    duration_seconds int NOT NULL CHECK (duration_seconds >= 0),
    best_streak int NOT NULL DEFAULT 0 CHECK (best_streak >= 0),
    completed_at timestamptz NOT NULL DEFAULT now()
);
-- Question Answers
CREATE TABLE IF NOT EXISTS public.question_answers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
    question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    selected_index int NOT NULL CHECK (selected_index BETWEEN 0 AND 3),
    is_correct boolean NOT NULL,
    answered_at timestamptz NOT NULL DEFAULT now()
);
-- Multiplayer Rooms
CREATE TABLE IF NOT EXISTS public.rooms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    invite_code varchar(6) UNIQUE NOT NULL,
    status public.room_status NOT NULL DEFAULT 'waiting',
    max_players int NOT NULL DEFAULT 5 CHECK (max_players BETWEEN 2 AND 10),
    question_count int NOT NULL DEFAULT 10 CHECK (question_count > 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    started_at timestamptz,
    finished_at timestamptz
);
-- Room Participants
CREATE TABLE IF NOT EXISTS public.room_participants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    score int NOT NULL DEFAULT 0 CHECK (score >= 0),
    joined_at timestamptz NOT NULL DEFAULT now(),
    is_ready boolean NOT NULL DEFAULT false,
    UNIQUE (room_id, user_id)
);
-- Room Chat Messages
CREATE TABLE IF NOT EXISTS public.room_chat_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content varchar(500) NOT NULL,
    sent_at timestamptz NOT NULL DEFAULT now()
);
-- Friendships
CREATE TABLE IF NOT EXISTS public.friendships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    recipient_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status public.friendship_status NOT NULL DEFAULT 'pending',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT check_not_self_friend CHECK (requester_id <> recipient_id),
    UNIQUE (requester_id, recipient_id)
);
-- Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    content text NOT NULL,
    status public.post_status NOT NULL DEFAULT 'draft',
    published_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
-- Rollup Table: User Stats Summary
CREATE TABLE IF NOT EXISTS public.user_stats_summary (
    user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    total_sessions int NOT NULL DEFAULT 0,
    total_questions_answered int NOT NULL DEFAULT 0,
    total_correct int NOT NULL DEFAULT 0,
    overall_precision numeric(5,2) NOT NULL DEFAULT 0.00,
    total_xp int NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
-- Rollup Table: User Subject Stats
CREATE TABLE IF NOT EXISTS public.user_subject_stats (
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    questions_answered int NOT NULL DEFAULT 0,
    correct_answers int NOT NULL DEFAULT 0,
    precision_rate numeric(5,2) NOT NULL DEFAULT 0.00,
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, subject_id)
);
-- Content Reports
CREATE TABLE IF NOT EXISTS public.content_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    question_id uuid REFERENCES public.questions(id) ON DELETE SET NULL,
    lesson_id uuid REFERENCES public.lessons(id) ON DELETE SET NULL,
    issue_type text NOT NULL,
    description text NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'ignored')),
    created_at timestamptz NOT NULL DEFAULT now()
);
-- ----------------------------------------------------------------------------
-- 4. INDEXES
-- ----------------------------------------------------------------------------
-- Indexes on Foreign Keys (to prevent sequential scans on JOINs/RLS constraints)
CREATE INDEX IF NOT EXISTS idx_units_subject_id ON public.units(subject_id);
CREATE INDEX IF NOT EXISTS idx_lessons_unit_id ON public.lessons(unit_id);
CREATE INDEX IF NOT EXISTS idx_lessons_subject_id ON public.lessons(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_lesson_id ON public.questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_questions_subject_id ON public.questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON public.quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_lesson_id ON public.quiz_sessions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_subject_id ON public.quiz_sessions(subject_id);
CREATE INDEX IF NOT EXISTS idx_question_answers_session_id ON public.question_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_question_answers_question_id ON public.question_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_rooms_host_id ON public.rooms(host_id);
CREATE INDEX IF NOT EXISTS idx_rooms_lesson_id ON public.rooms(lesson_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_room_id ON public.room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_user_id ON public.room_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_room_chat_messages_room_id ON public.room_chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_room_chat_messages_user_id ON public.room_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_requester_id ON public.friendships(requester_id);
CREATE INDEX IF NOT EXISTS idx_friendships_recipient_id ON public.friendships(recipient_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_content_reports_reporter_id ON public.content_reports(reporter_id);
-- Composite index: Quiz Sessions queried by user_id and ordered by completed_at
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_completed ON public.quiz_sessions(user_id, completed_at DESC);
-- Partial index: Lessons queried on is_published (keeps index size optimized for client lookups)
CREATE INDEX IF NOT EXISTS idx_lessons_published ON public.lessons(subject_id, unit_id) WHERE is_published = true;
-- GIN index on Options JSONB column in Questions (supports indexing arrays inside JSONB structures)
CREATE INDEX IF NOT EXISTS idx_questions_options_gin ON public.questions USING gin (options);
-- Trigram index for username searches (pg_trgm) - allows index scans for username search autocompletion
CREATE INDEX IF NOT EXISTS idx_users_username_trgm ON public.users USING gin (username gin_trgm_ops);
-- Chat message temporal ordering check index
CREATE INDEX IF NOT EXISTS idx_room_chat_messages_rate_limit ON public.room_chat_messages(room_id, user_id, sent_at DESC);
-- ----------------------------------------------------------------------------
-- 5. FUNCTIONS (Business Logic & Security Helper Functions)
-- ----------------------------------------------------------------------------
-- 5.1 Admin Verification Helper
-- Performance: Cached across RLS query execution via STABLE marker, runs securely bypass RLS rules.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'admin',
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = (SELECT auth.uid()) AND role = 'admin'
    )
  );
$$;
-- 5.2 Streak Calculation
-- Performance: Fast transactional update logic. Uses UTC timezone logic for midnight consistency.
CREATE OR REPLACE FUNCTION public.update_streak(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_last_active date;
  v_current_streak int;
  v_best_streak int;
  v_today date;
BEGIN
  v_today := (timezone('UTC', now()))::date;
  SELECT last_activity_date, streak_current, streak_best
  INTO v_last_active, v_current_streak, v_best_streak
  FROM public.users
  WHERE id = p_user_id;
  IF NOT FOUND THEN
    RETURN;
  END IF;
  IF v_last_active IS NULL THEN
    v_current_streak := 1;
    v_best_streak := COALESCE(v_best_streak, 1);
  ELSIF v_last_active = v_today THEN
    -- Already solved a quiz today
    NULL;
  ELSIF v_last_active = v_today - 1 THEN
    -- Consecutive solve
    v_current_streak := v_current_streak + 1;
    IF v_current_streak > v_best_streak THEN
      v_best_streak := v_current_streak;
    END IF;
  ELSE
    -- Missed at least one day
    v_current_streak := 1;
  END IF;
  UPDATE public.users
  SET 
    streak_current = v_current_streak,
    streak_best = v_best_streak,
    last_activity_date = v_today,
    updated_at = now()
  WHERE id = p_user_id;
END;
$$;
-- 5.3 Blitz Anti-Cheat Score Validation
-- Performance: Pure function (IMMUTABLE), fast execution inside validation checks.
CREATE OR REPLACE FUNCTION public.validate_blitz_session(
  p_total_questions int,
  p_correct int,
  p_duration_seconds int
)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = public, pg_temp
AS $$
  -- Enforce a minimum threshold of 1.5 seconds average time per question to filter bot/cheated inputs
  SELECT CASE
    WHEN p_total_questions <= 0 THEN true
    ELSE p_duration_seconds::numeric / p_total_questions::numeric >= 1.5
  END;
$$;
-- 5.4 Rollup Table Incremental Statistics updates
-- Performance: Updates rollup aggregates incrementally on write, avoiding costly live aggregates (SUM/AVG).
CREATE OR REPLACE FUNCTION public.update_user_stats_summary(
  p_user_id uuid,
  p_subject_id uuid,
  p_questions_answered int,
  p_correct_answers int
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Rollup summary aggregation
  INSERT INTO public.user_stats_summary (
    user_id,
    total_sessions,
    total_questions_answered,
    total_correct,
    overall_precision,
    total_xp,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    1,
    p_questions_answered,
    p_correct_answers,
    CASE WHEN p_questions_answered = 0 THEN 0.0 ELSE (p_correct_answers::numeric / p_questions_answered::numeric) * 100 END,
    (p_correct_answers * 10), -- 10 XP per correct answer
    now(),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_sessions = user_stats_summary.total_sessions + 1,
    total_questions_answered = user_stats_summary.total_questions_answered + p_questions_answered,
    total_correct = user_stats_summary.total_correct + p_correct_answers,
    overall_precision = CASE 
      WHEN (user_stats_summary.total_questions_answered + p_questions_answered) = 0 THEN 0.0 
      ELSE ((user_stats_summary.total_correct + p_correct_answers)::numeric / (user_stats_summary.total_questions_answered + p_questions_answered)::numeric) * 100 
    END,
    total_xp = user_stats_summary.total_xp + (p_correct_answers * 10),
    updated_at = now();
  -- Subject level aggregation
  IF p_subject_id IS NOT NULL THEN
    INSERT INTO public.user_subject_stats (
      user_id,
      subject_id,
      questions_answered,
      correct_answers,
      precision_rate,
      updated_at
    ) VALUES (
      p_user_id,
      p_subject_id,
      p_questions_answered,
      p_correct_answers,
      CASE WHEN p_questions_answered = 0 THEN 0.0 ELSE (p_correct_answers::numeric / p_questions_answered::numeric) * 100 END,
      now()
    )
    ON CONFLICT (user_id, subject_id) DO UPDATE SET
      questions_answered = user_subject_stats.questions_answered + p_questions_answered,
      correct_answers = user_subject_stats.correct_answers + p_correct_answers,
      precision_rate = CASE 
        WHEN (user_subject_stats.questions_answered + p_questions_answered) = 0 THEN 0.0 
        ELSE ((user_subject_stats.correct_answers + p_correct_answers)::numeric / (user_subject_stats.questions_answered + p_questions_answered)::numeric) * 100 
      END,
      updated_at = now();
  END IF;
END;
$$;
-- 5.5 Invite Code Generator
-- Performance: Alphanumeric generation loop with collision detection.
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  v_code text;
  v_exists boolean;
  v_loop_count int := 0;
BEGIN
  LOOP
    v_code := '';
    FOR i IN 1..6 LOOP
      v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::integer, 1);
    END LOOP;
    
    SELECT EXISTS (SELECT 1 FROM public.rooms WHERE invite_code = v_code) INTO v_exists;
    
    IF NOT v_exists THEN
      RETURN v_code;
    END IF;
    
    v_loop_count := v_loop_count + 1;
    IF v_loop_count > 100 THEN
      RAISE EXCEPTION 'Unique invite code generation exhausted after 100 attempts.';
    END IF;
  END LOOP;
END;
$$;
-- 5.6 Room Access Validation Helper
-- Performance: STABLE SQL function, caching policy results avoiding subquery evaluation inside RLS.
CREATE OR REPLACE FUNCTION public.can_access_room(p_room_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.room_participants
    WHERE room_id = p_room_id AND user_id = (SELECT auth.uid())
  );
$$;
-- ----------------------------------------------------------------------------
-- 6. TRIGGERS
-- ----------------------------------------------------------------------------
-- Reusable update timestamp trigger
CREATE OR REPLACE FUNCTION public.fn_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
-- Blitz validation trigger logic
CREATE OR REPLACE FUNCTION public.fn_validate_blitz_before_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.mode = 'blitz' THEN
    IF NOT public.validate_blitz_session(NEW.total_questions, NEW.correct_answers, NEW.duration_seconds) THEN
      RAISE EXCEPTION 'Anti-Cheat: Invalid quiz session results detected.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
-- Streak + rollups updater trigger logic
CREATE OR REPLACE FUNCTION public.fn_update_streak_after_session()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM public.update_streak(NEW.user_id);
  PERFORM public.update_user_stats_summary(
    NEW.user_id, 
    NEW.subject_id, 
    NEW.total_questions, 
    NEW.correct_answers
  );
  RETURN NEW;
END;
$$;
-- Chat rate-limiting trigger logic
CREATE OR REPLACE FUNCTION public.fn_room_chat_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_last_message timestamptz;
BEGIN
  SELECT sent_at INTO v_last_message
  FROM public.room_chat_messages
  WHERE room_id = NEW.room_id AND user_id = NEW.user_id
  ORDER BY sent_at DESC
  LIMIT 1;
  IF FOUND AND (NEW.sent_at - v_last_message) < INTERVAL '1 second' THEN
    RAISE EXCEPTION 'Rate Limit: You are sending messages too quickly (limit 1 message/second).';
  END IF;
  RETURN NEW;
END;
$$;
-- Trigger associations
CREATE TRIGGER trg_validate_blitz_before_insert
  BEFORE INSERT ON public.quiz_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_validate_blitz_before_insert();
CREATE TRIGGER trg_update_streak_after_session
  AFTER INSERT ON public.quiz_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_update_streak_after_session();
CREATE TRIGGER trg_room_chat_rate_limit
  BEFORE INSERT ON public.room_chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_room_chat_rate_limit();
-- Set updated_at trigger associations
CREATE TRIGGER trg_set_updated_at_users BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_lessons BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_questions BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_friendships BEFORE UPDATE ON public.friendships
  FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_blog_posts BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();
-- ----------------------------------------------------------------------------
-- 7. MATERIALIZED VIEWS
-- ----------------------------------------------------------------------------
-- Materialized view: Blitz Leaderboard (stores best attempt score per user per lesson)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.blitz_leaderboard_mv AS
WITH RankedScores AS (
  SELECT 
    user_id,
    lesson_id,
    correct_answers,
    duration_seconds,
    completed_at,
    ROW_NUMBER() OVER (
      PARTITION BY user_id, lesson_id 
      ORDER BY correct_answers DESC, duration_seconds ASC, completed_at ASC
    ) as rn
  FROM public.quiz_sessions
  WHERE mode = 'blitz'
)
SELECT 
  user_id,
  lesson_id,
  correct_answers as best_score,
  duration_seconds,
  completed_at
FROM RankedScores
WHERE rn = 1;
-- Unique composite index supporting REFRESH MATERIALIZED VIEW CONCURRENTLY
CREATE UNIQUE INDEX IF NOT EXISTS blitz_leaderboard_mv_uidx 
ON public.blitz_leaderboard_mv (user_id, lesson_id);
-- Leaderboard query functions
-- Performance: Resolves from MV using index scan, appends caller row without scanning entire tables.
CREATE OR REPLACE FUNCTION public.get_blitz_leaderboard(
  p_lesson_id uuid,
  p_limit int DEFAULT 10
)
RETURNS TABLE (
  rank bigint,
  user_id uuid,
  username text,
  avatar_url text,
  best_score int,
  duration_seconds int,
  completed_at timestamptz,
  is_caller boolean
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  WITH Leaderboard AS (
    SELECT 
      ROW_NUMBER() OVER (ORDER BY best_score DESC, duration_seconds ASC, completed_at ASC) as r,
      mv.user_id,
      u.username,
      u.avatar_url,
      mv.best_score,
      mv.duration_seconds,
      mv.completed_at
    FROM public.blitz_leaderboard_mv mv
    JOIN public.users u ON u.id = mv.user_id
    WHERE mv.lesson_id = p_lesson_id
  ),
  TopLimit AS (
    SELECT *, (user_id = (SELECT auth.uid())) as is_caller
    FROM Leaderboard
    ORDER BY r ASC
    LIMIT p_limit
  ),
  CallerRow AS (
    SELECT *, true as is_caller
    FROM Leaderboard
    WHERE user_id = (SELECT auth.uid())
      AND NOT EXISTS (SELECT 1 FROM TopLimit WHERE user_id = (SELECT auth.uid()))
  )
  SELECT r as rank, user_id, username, avatar_url, best_score, duration_seconds, completed_at, is_caller FROM TopLimit
  UNION ALL
  SELECT r as rank, user_id, username, avatar_url, best_score, duration_seconds, completed_at, is_caller FROM CallerRow
  ORDER BY rank ASC;
$$;
-- 7.1 scheduled Cron Refresh notes
-- To run MV refresh automatically in Supabase every 5 minutes:
SELECT cron.schedule('refresh-blitz-leaderboard', '*/5 * * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY public.blitz_leaderboard_mv;');
-- ----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
-- Enable RLS on every table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subject_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
-- 8.1 Users Policies
CREATE POLICY select_users_authenticated ON public.users 
  FOR SELECT TO authenticated USING (true);
CREATE POLICY update_users_self ON public.users 
  FOR UPDATE TO authenticated USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);
CREATE POLICY update_users_admin ON public.users 
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
-- 8.2 subjects, units, lessons Policies
CREATE POLICY select_subjects_authenticated ON public.subjects
  FOR SELECT TO authenticated USING (true);
CREATE POLICY modify_subjects_admin ON public.subjects
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY select_units_authenticated ON public.units
  FOR SELECT TO authenticated USING (true);
CREATE POLICY modify_units_admin ON public.units
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY select_lessons_published ON public.lessons
  FOR SELECT TO authenticated USING (is_published = true OR public.is_admin());
CREATE POLICY modify_lessons_admin ON public.lessons
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
-- 8.3 Questions Policies
CREATE POLICY select_questions_authenticated ON public.questions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY modify_questions_admin ON public.questions
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
-- 8.4 Quiz Sessions & Answers Policies
CREATE POLICY select_quiz_sessions_self ON public.quiz_sessions
  FOR SELECT TO authenticated USING ((select auth.uid()) = user_id OR public.is_admin());
CREATE POLICY insert_quiz_sessions_self ON public.quiz_sessions
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY select_question_answers_self ON public.question_answers
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions
      WHERE id = session_id AND (user_id = (select auth.uid()) OR public.is_admin())
    )
  );
CREATE POLICY insert_question_answers_self ON public.question_answers
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions
      WHERE id = session_id AND user_id = (select auth.uid())
    )
  );
-- 8.5 Multiplayer Rooms Policies
CREATE POLICY select_rooms_public_waiting ON public.rooms
  FOR SELECT TO authenticated USING (status = 'waiting');
CREATE POLICY select_rooms_participant ON public.rooms
  FOR SELECT TO authenticated USING (public.can_access_room(id) OR public.is_admin());
CREATE POLICY insert_rooms_host ON public.rooms
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = host_id);
CREATE POLICY update_rooms_host ON public.rooms
  FOR UPDATE TO authenticated USING ((select auth.uid()) = host_id) WITH CHECK ((select auth.uid()) = host_id);
CREATE POLICY delete_rooms_host ON public.rooms
  FOR DELETE TO authenticated USING ((select auth.uid()) = host_id OR public.is_admin());
-- 8.6 Room Participants Policies
CREATE POLICY select_room_participants_member ON public.room_participants
  FOR SELECT TO authenticated USING (public.can_access_room(room_id));
CREATE POLICY insert_room_participants_self ON public.room_participants
  FOR INSERT TO authenticated WITH CHECK (
    (select auth.uid()) = user_id AND (
      SELECT count(*) FROM public.room_participants WHERE room_id = room_participants.room_id
    ) < (
      SELECT max_players FROM public.rooms WHERE id = room_participants.room_id
    )
  );
CREATE POLICY update_room_participants_self ON public.room_participants
  FOR UPDATE TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY delete_room_participants_self ON public.room_participants
  FOR DELETE TO authenticated USING ((select auth.uid()) = user_id OR public.is_admin());
-- 8.7 Room Chat Messages Policies
CREATE POLICY select_room_chat_messages_member ON public.room_chat_messages
  FOR SELECT TO authenticated USING (public.can_access_room(room_id));
CREATE POLICY insert_room_chat_messages_member ON public.room_chat_messages
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id AND public.can_access_room(room_id));
-- 8.8 Friendships Policies
CREATE POLICY select_friendships_self ON public.friendships
  FOR SELECT TO authenticated USING ((select auth.uid()) = requester_id OR (select auth.uid()) = recipient_id);
CREATE POLICY insert_friendships_self ON public.friendships
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = requester_id);
CREATE POLICY update_friendships_self ON public.friendships
  FOR UPDATE TO authenticated USING (
    (select auth.uid()) = recipient_id OR -- recipient can respond
    ((select auth.uid()) = requester_id AND status = 'blocked') -- either can unblock
  );
CREATE POLICY delete_friendships_self ON public.friendships
  FOR DELETE TO authenticated USING ((select auth.uid()) = requester_id OR (select auth.uid()) = recipient_id);
-- 8.9 Blog Posts Policies
CREATE POLICY select_blog_posts_published ON public.blog_posts
  FOR SELECT TO authenticated USING (status = 'published' OR public.is_admin());
CREATE POLICY modify_blog_posts_admin ON public.blog_posts
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
-- 8.10 User summary Stats Policies
CREATE POLICY select_user_stats_summary_self ON public.user_stats_summary
  FOR SELECT TO authenticated USING ((select auth.uid()) = user_id OR public.is_admin());
CREATE POLICY select_user_subject_stats_self ON public.user_subject_stats
  FOR SELECT TO authenticated USING ((select auth.uid()) = user_id OR public.is_admin());
-- 8.11 Content Reports Policies
CREATE POLICY select_content_reports_self ON public.content_reports
  FOR SELECT TO authenticated USING ((select auth.uid()) = reporter_id OR public.is_admin());
CREATE POLICY insert_content_reports_self ON public.content_reports
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = reporter_id);
CREATE POLICY update_content_reports_admin ON public.content_reports
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
-- ----------------------------------------------------------------------------
-- 9. REALTIME PUBLICATION
-- ----------------------------------------------------------------------------
BEGIN;
  -- Drop existing realtime publication if present to recreate cleanly
  DROP PUBLICATION IF EXISTS supabase_realtime;
  
  -- Create publication containing only the required rooms/messages tables
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.rooms, 
    public.room_participants, 
    public.room_chat_messages;
COMMIT;
-- ----------------------------------------------------------------------------
-- 10. REFERENCE DATA / SEED
-- ----------------------------------------------------------------------------
-- Inserting general lookup constants for subjects
INSERT INTO public.subjects (name, description, color_hex, display_order)
VALUES 
  ('Cardiologie', 'Cours et QCMs d''insuffisance cardiaque, hypertension, etc.', '#E63946', 1),
  ('Neurologie', 'Sémiologie neurologique, AVC, neuropathies.', '#457B9D', 2),
  ('Pharmacologie', 'Cinétique des médicaments, classes de molécules.', '#1D3557', 3)
ON CONFLICT (name) DO NOTHING;
-- ----------------------------------------------------------------------------
-- 11. DATABASE VERIFICATION QUERIES (RUN CHECKS)
-- ----------------------------------------------------------------------------
-- Verification 11.a: Check that all RLS policy filter columns have matching indexes
-- Expected: All columns used inside USING or CHECK logic must be index-scanned.
/*
SELECT 
    schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public';
*/
-- Verification 11.b: Find any unindexed foreign keys in the public schema
/*
WITH IndexedCols AS (
    SELECT 
        conrelid AS table_object_id,
        conname AS constraint_name,
        a.attname AS col_name
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
    WHERE c.contype = 'f'
),
IndexScanCols AS (
    SELECT 
        indrelid AS table_object_id,
        a.attname AS col_name
    FROM pg_index i
    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
)
SELECT 
    t.relname AS table_name,
    ic.constraint_name,
    ic.col_name AS foreign_key_column
FROM IndexedCols ic
JOIN pg_class t ON t.oid = ic.table_object_id
LEFT JOIN IndexScanCols isc ON isc.table_object_id = ic.table_object_id AND isc.col_name = ic.col_name
WHERE isc.col_name IS NULL;
*/
-- Verification 11.c: Check that RLS is successfully enabled on all tables in public schema
/*
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
*/
-- ----------------------------------------------------------------------------
-- 12. INDEX SCAN TUNING TEST (EXPLAIN ANALYZE)
-- ----------------------------------------------------------------------------
-- Run this test query in your Supabase SQL editor to confirm index scans are used:
/*
EXPLAIN ANALYZE
SELECT id, question_text, difficulty 
FROM public.questions 
WHERE lesson_id = 'c3b2e591-1234-4bc6-8d19-456789abcdef'::uuid
LIMIT 10;
*/