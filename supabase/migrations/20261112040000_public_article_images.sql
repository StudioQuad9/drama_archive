begin;

-- Keep the bucket private. Only objects referenced by a published snapshot
-- become readable to visitors; drafts and other buckets remain protected.
create policy article_images_published_read on storage.objects
for select to anon, authenticated using (
  bucket_id = 'article-images'
  and exists (
    select 1 from public.article_publications as publication
    where publication.metadata->>'image' = 'storage://article-images/' || storage.objects.name
      or (
        jsonb_typeof(publication.metadata->'subImages') = 'array'
        and publication.metadata->'subImages' ? ('storage://article-images/' || storage.objects.name)
      )
  )
);
commit;
