-- 1. Create buckets for Players, Matches, and News
-- Go to Supabase Dashboard -> Storage -> New Bucket
-- Set bucket names to: 'players', 'matches', 'news'
-- Set all buckets to PUBLIC

-- 2. Set up RLS Policies for Storage (Run this in the SQL Editor)
-- Replace 'authenticated' with 'public' if you want anyone to see images without tokens

-- Allow public to view images in our buckets
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('players', 'matches', 'news'));

-- Allow authenticated admins to manage images (upload/update/delete)
CREATE POLICY "Admin Full Access" ON storage.objects FOR ALL 
TO authenticated
USING (
  bucket_id IN ('players', 'matches', 'news') AND 
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
)
WITH CHECK (
  bucket_id IN ('players', 'matches', 'news') AND 
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);
