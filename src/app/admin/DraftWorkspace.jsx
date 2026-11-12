"use client";

import { useEffect, useRef, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import styles from "./admin.module.scss";
import DramaFields from "./DramaFields";
import ArticleImages from "./ArticleImages";
import ArticlePreview from "./ArticlePreview";
import PublicationControls from "./PublicationControls";
import { metadataToFields, fieldsToMetadata } from "@/lib/articles/drama-fields.mjs";

const fields = "id,slug,type,content,metadata,revision,updated_at";
const emptyContent = () => ({ title: "", heading: "", body: "", bodyFormat: "markdown" });
const formatDate = (value) => new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "short", timeStyle: "short", timeZone: "Asia/Tokyo",
}).format(new Date(value));

export default function DraftWorkspace({ userId, onDirtyChange, onSavingChange }) {
  const [articles, setArticles] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState(emptyContent);
  const [baseline, setBaseline] = useState(emptyContent);
  const [details, setDetails] = useState(() => metadataToFields());
  const [detailsBaseline, setDetailsBaseline] = useState(() => metadataToFields());
  const [mainUploading, setMainUploading] = useState(false);
  const [extraUploading, setExtraUploading] = useState(false);
  const uploadBusy = mainUploading || extraUploading;
  const [publishing, setPublishing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const inFlight = useRef(false);
  const active = useRef(true);
  const dirty = JSON.stringify(content) !== JSON.stringify(baseline)
    || JSON.stringify(details) !== JSON.stringify(detailsBaseline);

  useEffect(() => {
    active.current = true;
    return () => { active.current = false; };
  }, []);

  useEffect(() => {
    onDirtyChange(dirty);
    return () => onDirtyChange(false);
  }, [dirty, onDirtyChange]);

  useEffect(() => {
    onSavingChange(saving || uploadBusy || publishing);
    return () => onSavingChange(false);
  }, [saving, uploadBusy, publishing, onSavingChange]);

  useEffect(() => {
    if (!dirty && !saving && !uploadBusy && !publishing) return;
    function warn(event) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, saving, uploadBusy, publishing]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        let query = getBrowserSupabase().from("articles")
          .select(fields, { count: "exact" }).eq("owner_id", userId);
        if (search) {
          // Quote the PostgREST value so punctuation cannot change the filter.
          const escaped = search.replace(/[\\%_]/g, "\\$&");
          const pattern = JSON.stringify(`%${escaped}%`);
          query = query.or(["title", "heading", "body"].map((key) => `content->>${key}.ilike.${pattern}`).join(","));
        }
        const { data, error, count } = await query
          .order("updated_at", { ascending: false }).order("id", { ascending: true })
          .range(page * 10, page * 10 + 9);
        if (error) throw error;
        if (!cancelled) {
          const lastPage = Math.max(0, Math.ceil((count ?? 0) / 10) - 1);
          if (page > lastPage) setPage(lastPage);
          setArticles(data);
          setTotal(count ?? 0);
          setListError("");
        }
      } catch {
        if (!cancelled) setListError("原稿一覧を取得できませんでした。通信状態とログイン状態をご確認ください。");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [userId, refresh, search, page]);

  function open(article) {
    if (inFlight.current || uploadBusy || publishing) return;
    if (dirty && !window.confirm("未保存の変更があります。保存せずに別の原稿を開きますか？")) return;
    const next = article ? { ...article.content } : emptyContent();
    setSelected(article);
    setContent(next);
    setBaseline(next);
    const nextDetails = metadataToFields(article?.metadata);
    setDetails(nextDetails);
    setDetailsBaseline(nextDetails);
    setMessage("");
    setSaveError("");
  }

  function change(event) {
    const { name, value } = event.target;
    setContent((previous) => ({ ...previous, [name]: value }));
    setMessage("");
  }

  async function save(event) {
    event.preventDefault();
    if (inFlight.current || uploadBusy || publishing) return;
    inFlight.current = true;
    setSaving(true);
    setMessage("");
    setSaveError("");
    try {
      const metadata = fieldsToMetadata(details, selected?.metadata);
      const supabase = getBrowserSupabase();
      const query = selected
        ? supabase.from("articles").update({ content, metadata })
          .eq("id", selected.id).eq("revision", selected.revision)
        : supabase.from("articles").insert({
          slug: `draft-${crypto.randomUUID()}`,
          type: "drama-review",
          content,
          metadata,
        });
      const { data, error } = await query.select(fields).single();
      if (error) {
        if (error.code === "PGRST116") {
          throw new Error("この原稿は別の画面で更新されたか、編集権限が変わっています。入力内容をコピーしてから、一覧を更新して原稿を開き直してください。");
        }
        throw new Error("保存を確認できませんでした。入力内容は画面に残しています。通信状態をご確認ください。新規保存の場合は、再度保存する前に一覧を更新し、保存済みの原稿がないか確認してください。");
      }
      if (!active.current) return;
      setSelected(data);
      setContent(data.content);
      setBaseline(data.content);
      const savedDetails = metadataToFields(data.metadata);
      setDetails(savedDetails);
      setDetailsBaseline(savedDetails);
      setLoading(true);
      setRefresh((value) => value + 1);
      setMessage(`下書きを保存しました（${formatDate(data.updated_at)}）。公開版は変更していません。`);
    } catch (error) {
      if (active.current) setSaveError(error.message || "保存できませんでした。入力内容をコピーして保管してください。");
    } finally {
      inFlight.current = false;
      if (active.current) setSaving(false);
    }
  }

  return (
    <div className={styles.workspace}>
      <section className={styles.articleList} aria-labelledby="draft-list-title">
        <h2 id="draft-list-title">保存した原稿</h2>
        <p>保存済み原稿全体を検索し、更新が新しい順に10件ずつ表示します。</p>
        <form className={styles.form} onSubmit={(event) => {
          event.preventDefault();
          setLoading(true);
          setPage(0);
          setSearch(searchInput.trim());
          setRefresh((value) => value + 1);
        }}>
          <label htmlFor="article-search">原稿を検索（タイトル・見出し・本文）</label>
          <input id="article-search" type="search" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} />
          <div className={styles.actions}>
            <button type="submit" disabled={saving || uploadBusy || publishing}>検索</button>
            <button type="button" disabled={saving || uploadBusy || publishing} onClick={() => {
              setSearchInput(""); setSearch(""); setPage(0); setLoading(true); setRefresh((value) => value + 1);
            }}>検索をクリア</button>
          </div>
        </form>
        <div className={styles.actions}>
          <button type="button" onClick={() => open(null)} disabled={saving || uploadBusy || publishing}>新しい下書き</button>
          <button type="button" disabled={loading || saving || uploadBusy || publishing} onClick={() => {
            setLoading(true);
            setRefresh((value) => value + 1);
          }}>一覧を更新</button>
        </div>
        {loading && <p role="status">原稿を読み込んでいます…</p>}
        {listError && <p role="alert">{listError}</p>}
        {!loading && !listError && articles.length === 0 && <p>{search ? "条件に一致する原稿はありません。" : "保存した原稿はまだありません。"}</p>}
        {!loading && !listError && <p>{total}件中 {total ? page * 10 + 1 : 0}〜{Math.min((page + 1) * 10, total)}件</p>}
        <ul hidden={loading || Boolean(listError)}>
          {articles.map((article) => (
            <li key={article.id}>
              <button type="button" onClick={() => open(article)} disabled={saving || uploadBusy || publishing} aria-current={selected?.id === article.id ? "true" : undefined}>
                <span>{article.content.title.trim() || "無題の原稿"}</span>
                <small>保存：{formatDate(article.updated_at)}</small>
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <button type="button" disabled={loading || page === 0 || saving || uploadBusy || publishing} onClick={() => { setLoading(true); setPage((value) => value - 1); }}>前の10件</button>
          <button type="button" disabled={loading || (page + 1) * 10 >= total || saving || uploadBusy || publishing} onClick={() => { setLoading(true); setPage((value) => value + 1); }}>次の10件</button>
        </div>
        <h2>編集中の原稿の画像</h2>
        <p>{content.title.trim() || "無題の原稿"}の画像です。変更後は右側の下書き保存を押してください。</p>
        <div className={styles.form}>
          <ArticleImages key={selected?.id ?? "new"} userId={userId} onMainBusy={setMainUploading} onExtraBusy={setExtraUploading} uploadBusy={uploadBusy} values={details} onChange={(value) => { setDetails(value); setMessage(""); }} disabled={saving || publishing} />
        </div>
      </section>
      <section aria-labelledby="draft-editor-title">
        <h2 id="draft-editor-title">{selected ? "原稿を編集" : "新しい下書き"}</h2>
        <p>ここでの保存は下書き保存です。Web公開は行いません。</p>
        <form onSubmit={save} className={styles.form}>
          <label htmlFor="draft-title">タイトル</label>
          <input id="draft-title" name="title" value={content.title} onChange={change} disabled={saving || uploadBusy || publishing} />
          <label htmlFor="draft-heading">レビュー見出し</label>
          <input id="draft-heading" name="heading" value={content.heading} onChange={change} disabled={saving || uploadBusy || publishing} />
          <label htmlFor="draft-body">本文（Markdown）</label>
          <textarea id="draft-body" name="body" rows={16} value={content.body} onChange={change} disabled={saving || uploadBusy || publishing} aria-describedby="body-help" />
          <p id="body-help">見出しは「## 見出し」、強調は「**強調**」と書けます。文章だけでも保存できます。</p>
          <DramaFields featuredRefresh={refresh} uploadBusy={uploadBusy} key={selected?.id ?? "new"} values={details} onChange={(value) => { setDetails(value); setMessage(""); }} disabled={saving || publishing} />
          <p role="status">{dirty ? "未保存の変更があります。" : selected ? "保存済みです。" : "まだ保存していません。"}</p>
          <button type="submit" disabled={saving || uploadBusy || publishing || (!dirty && Boolean(selected))}>{saving ? "保存しています…" : "下書き保存"}</button>
        </form>
        <ArticlePreview content={content} details={details} />
        {selected ? <PublicationControls key={selected.id} article={selected} dirty={dirty} disabled={saving || uploadBusy} onBusyChange={setPublishing} onChanged={() => { setLoading(true); setRefresh((value) => value + 1); }} /> : <p>公開設定は、下書きを保存すると表示されます。</p>}
        {message && <p role="status">{message}</p>}
        {saveError && <p role="alert">{saveError}</p>}
      </section>
    </div>
  );
}
