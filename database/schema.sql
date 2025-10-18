-- ============================================
-- SINDIKAT NCR ATLEOS - DATABASE SCHEMA
-- Production Setup for Supabase
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE 1: ADMINS
-- ============================================
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid PRIMARY KEY,
  email varchar NOT NULL UNIQUE,
  full_name varchar,
  role text DEFAULT 'admin',
  two_factor_enabled boolean DEFAULT false,
  two_factor_secret text,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT admins_role_check CHECK (role IN ('admin', 'super_admin'))
);

-- Admins table indexes
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON public.admins(role);

-- ============================================
-- TABLE 2: MEMBERS
-- ============================================
-- First, create ENUM for member status
DO $$ BEGIN
  CREATE TYPE enum_members_status AS ENUM ('active', 'pending', 'inactive');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.members (
  id serial PRIMARY KEY,
  full_name varchar NOT NULL,
  email varchar NOT NULL UNIQUE,
  quicklook_id varchar NOT NULL,
  city varchar,
  organization varchar,
  phone varchar,
  team varchar,
  status enum_members_status DEFAULT 'active',
  consent boolean DEFAULT false,
  agree_join boolean DEFAULT false,
  agree_gdpr boolean DEFAULT false,
  agree_newsletter boolean DEFAULT false,
  active_participation boolean DEFAULT false,
  send_copy boolean DEFAULT false,
  language varchar DEFAULT 'sr',
  member_id varchar,
  card_number varchar,
  card_sent boolean DEFAULT false,
  qr_media_id int,
  card_pdf_id int,
  joined_at timestamptz,
  approved_at timestamptz,
  approved_by uuid REFERENCES public.admins(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Members table indexes
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(status);
CREATE INDEX IF NOT EXISTS idx_members_quicklook_id ON public.members(quicklook_id);
CREATE INDEX IF NOT EXISTS idx_members_created_at ON public.members(created_at);
CREATE INDEX IF NOT EXISTS idx_members_organization ON public.members(organization);
CREATE INDEX IF NOT EXISTS idx_members_city ON public.members(city);

-- ============================================
-- TABLE 3: DOCUMENTS
-- ============================================
DO $$ BEGIN
  CREATE TYPE enum_document_type AS ENUM ('application', 'card', 'agreement', 'confirmation', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id integer REFERENCES public.members(id) ON DELETE CASCADE,
  document_type enum_document_type NOT NULL,
  file_name varchar NOT NULL,
  file_url text NOT NULL,
  file_size integer NOT NULL,
  mime_type varchar,
  uploaded_by uuid REFERENCES public.admins(id),
  uploaded_at timestamptz DEFAULT now()
);

-- Documents table indexes
CREATE INDEX IF NOT EXISTS idx_documents_member_id ON public.documents(member_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON public.documents(uploaded_at);

-- ============================================
-- TABLE 4: AUDIT LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id uuid REFERENCES public.admins(id),
  action varchar NOT NULL,
  target_type varchar NOT NULL,
  target_id varchar,
  details jsonb,
  ip_address varchar,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON public.audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_type ON public.audit_logs(target_type);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - ADMINS TABLE
-- ============================================

-- Admins can read their own data
CREATE POLICY "Admins can view own profile"
  ON public.admins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Admins can update their own data
CREATE POLICY "Admins can update own profile"
  ON public.admins
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Super admins can view all admins
CREATE POLICY "Super admins can view all admins"
  ON public.admins
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- ============================================
-- RLS POLICIES - MEMBERS TABLE
-- ============================================

-- Admins can view all members
CREATE POLICY "Admins can view all members"
  ON public.members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE id = auth.uid()
    )
  );

-- Admins can insert members
CREATE POLICY "Admins can insert members"
  ON public.members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE id = auth.uid()
    )
  );

-- Admins can update members
CREATE POLICY "Admins can update members"
  ON public.members
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE id = auth.uid()
    )
  );

-- Admins can delete members
CREATE POLICY "Admins can delete members"
  ON public.members
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE id = auth.uid()
    )
  );

-- ============================================
-- RLS POLICIES - DOCUMENTS TABLE
-- ============================================

-- Admins can view all documents
CREATE POLICY "Admins can view all documents"
  ON public.documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE id = auth.uid()
    )
  );

-- Admins can insert documents
CREATE POLICY "Admins can insert documents"
  ON public.documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE id = auth.uid()
    )
  );

-- Admins can delete documents
CREATE POLICY "Admins can delete documents"
  ON public.documents
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE id = auth.uid()
    )
  );

-- ============================================
-- RLS POLICIES - AUDIT LOGS TABLE
-- ============================================

-- Admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE id = auth.uid()
    )
  );

-- System can insert audit logs (service role)
CREATE POLICY "Service role can insert audit logs"
  ON public.audit_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for admins table
DROP TRIGGER IF EXISTS update_admins_updated_at ON public.admins;
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON public.admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for members table
DROP TRIGGER IF EXISTS update_members_updated_at ON public.members;
CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL DATA (Optional)
-- ============================================

-- Insert sample cities (optional - for autocomplete)
-- CREATE TABLE IF NOT EXISTS public.cities (
--   id serial PRIMARY KEY,
--   name varchar NOT NULL UNIQUE,
--   country varchar DEFAULT 'Serbia'
-- );

-- INSERT INTO public.cities (name) VALUES
--   ('Beograd'),
--   ('Novi Sad'),
--   ('Niš'),
--   ('Kragujevac'),
--   ('Subotica')
-- ON CONFLICT (name) DO NOTHING;

-- ============================================
-- GRANTS (for service role)
-- ============================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT SELECT ON public.admins TO authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;

-- Grant sequence usage for serial columns
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- CLEANUP (if needed - CAREFUL!)
-- ============================================

-- Drop all tables (WARNING: This deletes all data!)
-- DROP TABLE IF EXISTS public.audit_logs CASCADE;
-- DROP TABLE IF EXISTS public.documents CASCADE;
-- DROP TABLE IF EXISTS public.members CASCADE;
-- DROP TABLE IF EXISTS public.admins CASCADE;
-- DROP TYPE IF EXISTS enum_members_status;
-- DROP TYPE IF EXISTS enum_document_type;