begin;

-- Private drafts must not become public merely because an image was uploaded.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'article-images', 'article-images', false, 52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
);

create policy article_images_admin_insert on storage.objects
for insert to authenticated with check (
  bucket_id = 'article-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select 1 from public.article_admins where user_id = (select auth.uid()))
);

create policy article_images_admin_select on storage.objects
for select to authenticated using (
  bucket_id = 'article-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select 1 from public.article_admins where user_id = (select auth.uid()))
);

-- Immutable object names: replacing an image creates a new object.
-- Public delivery will be added with article publication; no public read policy here.
commit;
