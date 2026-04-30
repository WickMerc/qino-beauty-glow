-- Create coach_messages table for QINO Coach chat history
CREATE TABLE public.coach_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT coach_messages_role_check CHECK (role IN ('user', 'qino'))
);

-- Index for fast history fetches per user, newest first
CREATE INDEX idx_coach_messages_user_created
  ON public.coach_messages (user_id, created_at DESC);

-- RLS intentionally left disabled for this iteration (matches iteration 6A pattern;
-- auth + policies land in iteration 11).
ALTER TABLE public.coach_messages DISABLE ROW LEVEL SECURITY;