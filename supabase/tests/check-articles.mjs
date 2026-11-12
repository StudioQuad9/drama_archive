import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const db = new PGlite();
// Reproduce Supabase roles and the JWT user-ID lookup without contacting production.
await db.exec(`
create role anon;
create role authenticated;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as
  $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
grant usage on schema auth, public to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
`);
await db.exec(await readFile(new URL('../migrations/20261112010000_create_articles.sql', import.meta.url), 'utf8'));
const admin = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
const member = '33333333-3333-4333-8333-333333333333';
await db.exec(`insert into auth.users values ('${admin}'), ('${other}'), ('${member}');
insert into public.article_admins(user_id) values ('${admin}'), ('${other}');`);
async function as(role, user = '') {
  await db.exec('reset role');
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [user]);
  await db.exec(`set role ${role}`);
}
let checks = 0;
async function denied(sql, code = '42501') {
  await assert.rejects(db.query(sql), error => error.code === code);
  checks++;
}
async function count(sql, expected) {
  const { rows } = await db.query(sql);
  assert.equal(rows.length, expected);
  checks++;
}
await as('anon');
await denied('select * from public.articles');
await denied('select * from public.article_admins');
await count('select * from public.article_publications', 0);
await denied("select public.publish_article('00000000-0000-0000-0000-000000000000', 1)");
await as('authenticated', member);
await count('select * from public.articles', 0);
await denied("insert into public.articles(slug) values ('unauthorized')");
await denied(`insert into public.article_admins(user_id) values ('${member}')`);
await denied("select public.publish_article('00000000-0000-0000-0000-000000000000', 1)");
await as('authenticated', admin);
const content = { title: 'Title', heading: '', body: 'Original', bodyFormat: 'markdown' };
const { rows: [draft] } = await db.query(
  'insert into public.articles(slug, content) values ($1, $2) returning id, revision',
  ['test-article', content],
);
const id = draft.id;
await denied(`update public.articles set owner_id = '${other}' where id = '${id}'`);
await denied(`insert into public.article_publications(article_id, slug, type, content, metadata, source_revision)
values ('${id}', 'bypass', 'drama-review', '{}', '{}', 1)`);
await db.query('select public.publish_article($1, $2)', [id, 1]);
await db.query("update public.articles set content = jsonb_set(content, '{body}', '\"Edited draft\"') where id = $1", [id]);
await as('anon');
let publication = (await db.query('select * from public.article_publications')).rows[0];
assert.equal(publication.content.body, 'Original'); checks++;
await denied('delete from public.article_publications');
await as('authenticated', other);
await count('select * from public.articles', 0);
await denied(`select public.publish_article('${id}', 2)`, 'P0002');
await denied(`select public.unpublish_article('${id}')`, 'P0002');
await as('authenticated', admin);
await denied(`select public.publish_article('${id}', 1)`, '40001');
await db.query('select public.publish_article($1, $2)', [id, 2]);
publication = (await db.query('select * from public.article_publications')).rows[0];
assert.equal(publication.content.body, 'Edited draft'); checks++;
await db.query("update public.articles set slug = 'changed-url' where id = $1", [id]);
await denied(`select public.publish_article('${id}', 3)`, '23514');
await db.query('select public.unpublish_article($1)', [id]);
await count('select * from public.articles', 1);
await as('anon');
await count('select * from public.article_publications', 0);
await as('authenticated', admin);
const { rows: [empty] } = await db.query("insert into public.articles(slug) values ('empty') returning id");
await denied(`select public.publish_article('${empty.id}', 1)`, '23514');
await db.query('select public.publish_article($1, 3)', [id]);
await db.query('insert into public.articles(slug, content) values ($1, $2)', ['changed-url', content]);
const { rows: [duplicate] } = await db.query("select id from public.articles where slug = 'changed-url' and id <> $1", [id]);
await denied(`select public.publish_article('${duplicate.id}', 1)`, '23505');
console.log(`${checks} checks passed: permissions, draft isolation, publication, conflicts, unpublication.`);
await db.close();
