-- ============================================================================
-- VELAMETRIC GLOBAL — SUPABASE RLS, STORAGE & SECURITY REFINEMENT
-- ============================================================================

-- 1. Fix Security Definer Functions with search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM public, anon, authenticated;

-- 2. Storage Buckets for Media & Documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('media', 'media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'model/gltf-binary', 'model/gltf+json']),
  ('documents', 'documents', true, 20971520, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Bucket Policies
DROP POLICY IF EXISTS "Public Access for media bucket" ON storage.objects;
CREATE POLICY "Public Access for media bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Public Insert for media bucket" ON storage.objects;
CREATE POLICY "Public Insert for media bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "Public Access for documents bucket" ON storage.objects;
CREATE POLICY "Public Access for documents bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "Public Insert for documents bucket" ON storage.objects;
CREATE POLICY "Public Insert for documents bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents');

-- 3. Comprehensive RLS Policies for Public and Authenticated Access
DO $$
DECLARE
  t text;
  public_read_tables text[] := ARRAY[
    'companies', 'company_branding', 'site_media_settings', 'roles',
    'service_categories', 'services', 'service_packages', 'portfolio_projects',
    'case_studies', 'testimonials', 'events', 'site_settings', 'document_types', 'document_templates'
  ];
BEGIN
  FOREACH t IN ARRAY public_read_tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public read access for %I" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "Public read access for %I" ON public.%I FOR SELECT USING (true)', t, t);
    
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated full access for %I" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "Authenticated full access for %I" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t, t);
  END LOOP;
END $$;

DO $$
DECLARE
  t text;
  public_insert_tables text[] := ARRAY['leads', 'lead_followups', 'event_registrations'];
BEGIN
  FOREACH t IN ARRAY public_insert_tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public insert access for %I" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "Public insert access for %I" ON public.%I FOR INSERT WITH CHECK (true)', t, t);
    
    EXECUTE format('DROP POLICY IF EXISTS "Public select access for %I" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "Public select access for %I" ON public.%I FOR SELECT USING (true)', t, t);

    EXECUTE format('DROP POLICY IF EXISTS "Authenticated full access for %I" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "Authenticated full access for %I" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t, t);
  END LOOP;
END $$;

DO $$
DECLARE
  t text;
  auth_tables text[] := ARRAY[
    'user_company_profiles', 'user_subscriptions', 'generated_documents',
    'profiles', 'user_roles', 'storage_usage', 'communication_logs',
    'campaigns', 'proposals', 'invoices', 'payments', 'security_audit_logs'
  ];
BEGIN
  FOREACH t IN ARRAY auth_tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated full access for %I" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "Authenticated full access for %I" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t, t);
    
    EXECUTE format('DROP POLICY IF EXISTS "Anon read access for %I" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "Anon read access for %I" ON public.%I FOR SELECT USING (true)', t, t);
  END LOOP;
END $$;
