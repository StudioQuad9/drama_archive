begin;

-- An account is not an administrator until added here by the database owner.
create table public.article_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.article_admins enable row level security;
revoke all on public.article_admins from public, anon, authenticated;
grant select on public.article_admins to authenticated;
create policy admins_read_own_membership on public.article_admins
  for select to authenticated using (user_id = (select auth.uid()));

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  type text not null default 'drama-review' check (type = 'drama-review'),
  content jsonb not null default '{"title":"","heading":"","body":"","bodyFormat":"markdown"}',
  metadata jsonb not null default '{}',
  revision integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint article_content_shape check (
    jsonb_typeof(content) = 'object'
    and content ?& array['title','heading','body','bodyFormat']
    and jsonb_typeof(content->'title') = 'string'
    and jsonb_typeof(content->'heading') = 'string'
    and jsonb_typeof(content->'body') = 'string'
    and content->>'bodyFormat' = 'markdown'
  ),
  constraint article_metadata_shape check (jsonb_typeof(metadata) = 'object')
);

create table public.article_publications (
  article_id uuid primary key references public.articles(id) on delete cascade,
  slug text not null unique,
  type text not null,
  content jsonb not null,
  metadata jsonb not null,
  source_revision integer not null,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index article_publications_date_idx
  on public.article_publications (published_at desc);
create index articles_owner_idx on public.articles (owner_id);

alter table public.articles enable row level security;
alter table public.article_publications enable row level security;
revoke all on public.articles, public.article_publications from public, anon, authenticated;
grant select on public.articles to authenticated;
grant insert (slug, type, content, metadata) on public.articles to authenticated;
grant update (slug, type, content, metadata) on public.articles to authenticated;
grant select on public.article_publications to anon, authenticated;

create policy admins_read_own_drafts on public.articles
  for select to authenticated using (
    owner_id = (select auth.uid()) and exists (
      select 1 from public.article_admins where user_id = (select auth.uid())
    )
  );
create policy admins_create_own_drafts on public.articles
  for insert to authenticated with check (
    owner_id = (select auth.uid()) and exists (
      select 1 from public.article_admins where user_id = (select auth.uid())
    )
  );
create policy admins_update_own_drafts on public.articles
  for update to authenticated using (
    owner_id = (select auth.uid()) and exists (
      select 1 from public.article_admins where user_id = (select auth.uid())
    )
  ) with check (
    owner_id = (select auth.uid()) and exists (
      select 1 from public.article_admins where user_id = (select auth.uid())
    )
  );
create policy everyone_reads_publications on public.article_publications
  for select to anon, authenticated using (true);

create function public.advance_article_revision()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.revision := old.revision + 1;
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function public.advance_article_revision() from public, anon, authenticated;
create trigger advance_article_revision before update on public.articles
  for each row execute function public.advance_article_revision();

-- Only this operation can copy a draft to the public table.
-- expected_revision prevents publishing a draft changed since it was reviewed.
create function public.publish_article(p_article_id uuid, p_expected_revision integer)
returns void language plpgsql security definer set search_path = '' as $$
declare
  draft public.articles%rowtype;
begin
  if not exists (select 1 from public.article_admins where user_id = auth.uid()) then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
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

create function public.unpublish_article(p_article_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.article_admins where user_id = auth.uid()) then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
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
