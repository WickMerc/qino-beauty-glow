
-- 0. Drop existing internal FKs that point at profiles.user_id
ALTER TABLE public.onboarding_answers DROP CONSTRAINT IF EXISTS onboarding_answers_user_id_fkey;
ALTER TABLE public.scan_sessions      DROP CONSTRAINT IF EXISTS scan_sessions_user_id_fkey;
ALTER TABLE public.scan_photos        DROP CONSTRAINT IF EXISTS scan_photos_user_id_fkey;
ALTER TABLE public.analysis_reports   DROP CONSTRAINT IF EXISTS analysis_reports_user_id_fkey;
ALTER TABLE public.coach_messages     DROP CONSTRAINT IF EXISTS coach_messages_user_id_fkey;

-- 1. Wipe data
DELETE FROM public.coach_messages;
DELETE FROM public.priority_items;
DELETE FROM public.feature_findings;
DELETE FROM public.analysis_reports;
DELETE FROM public.scan_photos;
DELETE FROM public.scan_sessions;
DELETE FROM public.onboarding_answers;
DELETE FROM public.profiles;

-- 2. Convert text -> uuid
ALTER TABLE public.profiles            ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.onboarding_answers  ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.scan_sessions       ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.scan_photos         ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.analysis_reports    ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.coach_messages      ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.profiles ALTER COLUMN email SET NOT NULL;

-- 3. New FKs to auth.users with cascade delete
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.onboarding_answers
  ADD CONSTRAINT onboarding_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.scan_sessions
  ADD CONSTRAINT scan_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.scan_photos
  ADD CONSTRAINT scan_photos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.analysis_reports
  ADD CONSTRAINT analysis_reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.coach_messages
  ADD CONSTRAINT coach_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NULLIF(split_part(NEW.email, '@', 1), ''), 'Friend')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. RLS + own-row policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.onboarding_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "oa_select_own" ON public.onboarding_answers FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "oa_insert_own" ON public.onboarding_answers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "oa_update_own" ON public.onboarding_answers FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "oa_delete_own" ON public.onboarding_answers FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.scan_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ss_select_own" ON public.scan_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "ss_insert_own" ON public.scan_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ss_update_own" ON public.scan_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ss_delete_own" ON public.scan_sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.scan_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sp_select_own" ON public.scan_photos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "sp_insert_own" ON public.scan_photos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sp_update_own" ON public.scan_photos FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sp_delete_own" ON public.scan_photos FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.analysis_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ar_select_own" ON public.analysis_reports FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "ar_insert_own" ON public.analysis_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ar_update_own" ON public.analysis_reports FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ar_delete_own" ON public.analysis_reports FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.coach_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cm_select_own" ON public.coach_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "cm_insert_own" ON public.coach_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cm_update_own" ON public.coach_messages FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cm_delete_own" ON public.coach_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.feature_findings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ff_select_own" ON public.feature_findings FOR SELECT TO authenticated
  USING (analysis_report_id IN (SELECT id FROM public.analysis_reports WHERE user_id = auth.uid()));
CREATE POLICY "ff_insert_own" ON public.feature_findings FOR INSERT TO authenticated
  WITH CHECK (analysis_report_id IN (SELECT id FROM public.analysis_reports WHERE user_id = auth.uid()));
CREATE POLICY "ff_update_own" ON public.feature_findings FOR UPDATE TO authenticated
  USING (analysis_report_id IN (SELECT id FROM public.analysis_reports WHERE user_id = auth.uid()))
  WITH CHECK (analysis_report_id IN (SELECT id FROM public.analysis_reports WHERE user_id = auth.uid()));
CREATE POLICY "ff_delete_own" ON public.feature_findings FOR DELETE TO authenticated
  USING (analysis_report_id IN (SELECT id FROM public.analysis_reports WHERE user_id = auth.uid()));

ALTER TABLE public.priority_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pi_select_own" ON public.priority_items FOR SELECT TO authenticated
  USING (analysis_report_id IN (SELECT id FROM public.analysis_reports WHERE user_id = auth.uid()));
CREATE POLICY "pi_insert_own" ON public.priority_items FOR INSERT TO authenticated
  WITH CHECK (analysis_report_id IN (SELECT id FROM public.analysis_reports WHERE user_id = auth.uid()));
CREATE POLICY "pi_update_own" ON public.priority_items FOR UPDATE TO authenticated
  USING (analysis_report_id IN (SELECT id FROM public.analysis_reports WHERE user_id = auth.uid()))
  WITH CHECK (analysis_report_id IN (SELECT id FROM public.analysis_reports WHERE user_id = auth.uid()));
CREATE POLICY "pi_delete_own" ON public.priority_items FOR DELETE TO authenticated
  USING (analysis_report_id IN (SELECT id FROM public.analysis_reports WHERE user_id = auth.uid()));

-- 6. Storage policies (folder == auth.uid())
CREATE POLICY "scan_photos_select_own" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'scan-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "scan_photos_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'scan-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "scan_photos_update_own" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'scan-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "scan_photos_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'scan-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "progress_photos_select_own" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "progress_photos_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "progress_photos_update_own" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "progress_photos_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
