
-- Table 1: profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  name text NOT NULL,
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table 2: onboarding_answers
CREATE TABLE public.onboarding_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL UNIQUE REFERENCES public.profiles(user_id),
  goals jsonb NOT NULL DEFAULT '[]'::jsonb,
  personalization jsonb NOT NULL DEFAULT '{}'::jsonb,
  comfort jsonb NOT NULL DEFAULT '[]'::jsonb,
  budget text,
  routine text,
  body jsonb,
  skin jsonb NOT NULL DEFAULT '[]'::jsonb,
  hair jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table 3: scan_sessions
CREATE TABLE public.scan_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES public.profiles(user_id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','uploaded','processing','complete','failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

-- Table 4: scan_photos
CREATE TABLE public.scan_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_session_id uuid NOT NULL REFERENCES public.scan_sessions(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES public.profiles(user_id),
  angle_type text NOT NULL CHECK (angle_type IN ('front','smile','left','right','fortyfive','skin')),
  storage_path text NOT NULL,
  quality_status text CHECK (quality_status IN ('good','warn','bad') OR quality_status IS NULL),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table 5: analysis_reports
CREATE TABLE public.analysis_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES public.profiles(user_id),
  scan_session_id uuid NOT NULL REFERENCES public.scan_sessions(id),
  status text NOT NULL DEFAULT 'generating' CHECK (status IN ('generating','complete','failed')),
  headline text,
  insight text,
  current_phase jsonb,
  scores jsonb NOT NULL DEFAULT '[]'::jsonb,
  strengths jsonb NOT NULL DEFAULT '[]'::jsonb,
  opportunities jsonb NOT NULL DEFAULT '[]'::jsonb,
  priorities jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

-- Table 6: feature_findings
CREATE TABLE public.feature_findings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_report_id uuid NOT NULL REFERENCES public.analysis_reports(id) ON DELETE CASCADE,
  group_id text NOT NULL,
  title text NOT NULL,
  icon_key text NOT NULL,
  accent_key text NOT NULL,
  findings jsonb NOT NULL DEFAULT '[]'::jsonb,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table 7: priority_items
CREATE TABLE public.priority_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_report_id uuid NOT NULL REFERENCES public.analysis_reports(id) ON DELETE CASCADE,
  title text NOT NULL,
  priority_level text NOT NULL CHECK (priority_level IN ('high','medium','low')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Disable RLS on all 7 tables (auth comes later)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_findings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.priority_items DISABLE ROW LEVEL SECURITY;

-- Storage buckets (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('scan-photos','scan-photos', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('progress-photos','progress-photos', false) ON CONFLICT (id) DO NOTHING;

-- Permissive storage policies for prototype (anon + authenticated full access)
CREATE POLICY "prototype_scan_photos_all" ON storage.objects FOR ALL TO public
  USING (bucket_id = 'scan-photos') WITH CHECK (bucket_id = 'scan-photos');
CREATE POLICY "prototype_progress_photos_all" ON storage.objects FOR ALL TO public
  USING (bucket_id = 'progress-photos') WITH CHECK (bucket_id = 'progress-photos');
