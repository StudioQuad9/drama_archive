begin;

-- Normalize any already-published duplicates before adding the unique index.
do $$
declare previous record; new_revision integer;
begin
  for previous in
    select article_id from public.article_publications
    where metadata->>'featured' = 'true'
    order by updated_at desc, article_id
    offset 1
  loop

      new_revision := null;
      update public.articles
        set metadata = jsonb_set(metadata, '{featured}', 'false'::jsonb)
        where id = previous.article_id and metadata->>'featured' = 'true'
        returning revision into new_revision;
      update public.article_publications
        set metadata = jsonb_set(metadata, '{featured}', 'false'::jsonb),
            source_revision = case
              when new_revision is not null and source_revision = new_revision - 1 then new_revision
              else source_revision end,
            updated_at = now()
        where article_id = previous.article_id;
  end loop;
end;
$$;
create unique index article_publications_one_featured
  on public.article_publications ((metadata->>'featured'))
  where metadata->>'featured' = 'true';

create or replace function public.publish_article(p_article_id uuid, p_expected_revision integer)
returns void language plpgsql security definer set search_path = '' as $$
declare
  draft public.articles%rowtype;
  previous record;
  new_revision integer;
begin
  if not exists (select 1 from public.article_admins where user_id = auth.uid()) then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  perform pg_advisory_xact_lock(73021, 1);
  select * into draft from public.articles
    where id = p_article_id and owner_id = auth.uid() for update;
  if not found then
    raise exception 'Article not found' using errcode = 'P0002';
  end if;
  if p_expected_revision is distinct from draft.revision then
    raise exception 'Draft changed. Reload before publishing.' using errcode = '40001';
  end if;
  if btrim(draft.content->>'title') = '' or btrim(draft.content->>'body') = '' then
    raise exception 'Title and body are required for publication' using errcode = '23514';
  end if;
  if exists (
    select 1 from public.article_publications
      where article_id = draft.id and slug <> draft.slug
  ) then
    raise exception 'Unpublish before changing the public URL' using errcode = '23514';
  end if;
  if draft.metadata->>'featured' = 'true' then
    for previous in
      select article_id from public.article_publications
      where article_id <> draft.id and metadata->>'featured' = 'true'
      order by article_id
    loop

      new_revision := null;
      update public.articles
        set metadata = jsonb_set(metadata, '{featured}', 'false'::jsonb)
        where id = previous.article_id and metadata->>'featured' = 'true'
        returning revision into new_revision;
      update public.article_publications
        set metadata = jsonb_set(metadata, '{featured}', 'false'::jsonb),
            source_revision = case
              when new_revision is not null and source_revision = new_revision - 1 then new_revision
              else source_revision end,
            updated_at = now()
        where article_id = previous.article_id;
    end loop;
  end if;
  insert into public.article_publications
    (article_id, slug, type, content, metadata, source_revision)
  values (draft.id, draft.slug, draft.type, draft.content, draft.metadata, draft.revision)
  on conflict (article_id) do update set
    content = excluded.content,
    metadata = excluded.metadata,
    type = excluded.type,
    source_revision = excluded.source_revision,
    updated_at = now();
end;
$$;

create or replace function public.unpublish_article(p_article_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.article_admins where user_id = auth.uid()) then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  perform pg_advisory_xact_lock(73021, 1);
  -- Same lock as publication, so simultaneous operations cannot interleave.
  perform 1 from public.articles
    where id = p_article_id and owner_id = auth.uid() for update;
  if not found then
    raise exception 'Article not found' using errcode = 'P0002';
  end if;
  delete from public.article_publications where article_id = p_article_id;
end;
$$;

revoke all on function public.publish_article(uuid, integer) from public, anon, authenticated;
revoke all on function public.unpublish_article(uuid) from public, anon, authenticated;
grant execute on function public.publish_article(uuid, integer) to authenticated;
grant execute on function public.unpublish_article(uuid) to authenticated;
commit;
