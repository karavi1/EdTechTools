-- ============================================================
-- Student Tracker - Supabase Schema
-- Run this in your Supabase project's SQL editor
-- ============================================================

-- Extends auth.users. Auto-created via trigger on signup.
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  school      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Students belong to exactly one teacher.
CREATE TABLE public.students (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  grade       TEXT,
  notes       TEXT,
  archived    BOOLEAN DEFAULT FALSE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Behavior/event records.
CREATE TABLE public.records (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  notes       TEXT,
  value       NUMERIC,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_records_student_date ON public.records (student_id, date DESC);
CREATE INDEX idx_students_teacher ON public.students (teacher_id, created_at DESC);

-- ============================================================
-- Profile auto-creation trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.records   ENABLE ROW LEVEL SECURITY;

-- Grant table-level permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.records TO authenticated;

-- Profiles: teachers can only read/update their own profile
CREATE POLICY "Own profile only" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- Students: teachers can only CRUD their own students
CREATE POLICY "Teacher owns students" ON public.students
  FOR ALL USING (auth.uid() = teacher_id);

-- Records: teachers can only read/update/delete records they own
CREATE POLICY "Teacher owns records" ON public.records
  FOR ALL USING (auth.uid() = teacher_id);

-- Records: on insert, student must belong to this teacher
CREATE POLICY "Record student must belong to teacher" ON public.records
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE students.id = records.student_id
        AND students.teacher_id = auth.uid()
    )
  );
