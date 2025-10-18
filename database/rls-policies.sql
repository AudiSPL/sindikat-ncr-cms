-- RLS Policies for Members Table
-- Run this in Supabase SQL Editor on the project that the app uses

-- Enable RLS on members table (if not already enabled)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public insert (for membership applications)
-- This allows anonymous users to submit membership applications
CREATE POLICY IF NOT EXISTS "public_insert_members"
ON public.members
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy 2: Allow authenticated users to read members
-- This allows logged-in users to view member data
CREATE POLICY IF NOT EXISTS "read_members_authenticated"
ON public.members
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Allow authenticated users to update members
-- This allows admin users to update member information
CREATE POLICY IF NOT EXISTS "update_members_authenticated"
ON public.members
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 4: Allow authenticated users to delete members (if needed)
-- This allows admin users to delete members
CREATE POLICY IF NOT EXISTS "delete_members_authenticated"
ON public.members
FOR DELETE
TO authenticated
USING (true);

-- Note: If admin API uses service key (server-side), RLS is bypassed anyway
-- These policies are mainly for client-side operations and additional security
