"use client";

import { useEffect, useRef, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import styles from "./admin.module.scss";
import DramaFields from "./DramaFields";
import ArticlePreview from "./ArticlePreview";
import { metadataToFields, fieldsToMetadata } from "@/lib/articles/drama-fields.mjs";

const fields = "id,slug,type,content,metadata,revision,updated_at";
const emptyContent = () => ({ title: "", heading: "", body: "", bodyFormat: "markdown" });
const formatDate = (value) => new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "short", timeStyle: "short", timeZone: "Asia/Tokyo",
}).format(new Date(value));

export default function DraftWorkspace({ userId, onDirtyChange, onSavingChange }) {
  const [articles, setArticles] = useState([]);
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
    onSavingChange(saving || uploadBusy);
    return () => onSavingChange(false);
  }, [saving, uploadBusy, onSavingChange]);

  useEffect(() => {
    if (!dirty && !saving && !uploadBusy) return;
    function warn(event) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, saving, uploadBusy]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data, error } = await getBrowserSupabase()
          .from("articles")
          .select(fields)
          .eq("owner_id", userId)
          .order("updated_at", { ascending: false })
          .limit(100);
        if (error) throw error;
        if (!cancelled) {
          setArticles(data);
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
  }, [userId, refresh]);

  function open(article) {
    if (inFlight.current || uploadBusy) return;
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
    if (inFlight.current || uploadBusy) return;
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
      setArticles((previous) => [data, ...previous.filter((item) => item.id !== data.id)].slice(0, 100));
      setMessage(`下書きを保存しました（${formatDate(data.updated_at)}）。Webには公開していません。`);
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
        <p>更新が新しい順に最大100件表示します。</p>
        <div className={styles.actions}>
          <button type="button" onClick={() => open(null)} disabled={saving || uploadBusy}>新しい下書き</button>
          <button type="button" disabled={loading || saving || uploadBusy} onClick={() => {
            setLoading(true);
            setRefresh((value) => value + 1);
          }}>一覧を更新</button>
        </div>
        {loading && <p role="status">原稿を読み込んでいます…</p>}
        {listError && <p role="alert">{listError}</p>}
        {!loading && !listError && articles.length === 0 && <p>保存した原稿はまだありません。</p>}
        <ul>
          {articles.map((article) => (
            <li key={article.id}>
              <button type="button" onClick={() => open(article)} disabled={saving || uploadBusy} aria-current={selected?.id === article.id ? "true" : undefined}>
                <span>{article.content.title.trim() || "無題の原稿"}</span>
                <small>保存：{formatDate(article.updated_at)}</small>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="draft-editor-title">
        <h2 id="draft-editor-title">{selected ? "原稿を編集" : "新しい下書き"}</h2>
        <p>ここでの保存は下書き保存です。Web公開は行いません。</p>
        <form onSubmit={save} className={styles.form}>
          <label htmlFor="draft-title">タイトル</label>
          <input id="draft-title" name="title" value={content.title} onChange={change} disabled={saving || uploadBusy} />
          <label htmlFor="draft-heading">レビュー見出し</label>
          <input id="draft-heading" name="heading" value={content.heading} onChange={change} disabled={saving || uploadBusy} />
          <label htmlFor="draft-body">本文（Markdown）</label>
          <textarea id="draft-body" name="body" rows={16} value={content.body} onChange={change} disabled={saving || uploadBusy} aria-describedby="body-help" />
          <p id="body-help">見出しは「## 見出し」、強調は「**強調**」と書けます。文章だけでも保存できます。</p>
          <DramaFields userId={userId} onMainBusy={setMainUploading} onExtraBusy={setExtraUploading} uploadBusy={uploadBusy} key={selected?.id ?? "new"} values={details} onChange={(value) => { setDetails(value); setMessage(""); }} disabled={saving} />
          <p role="status">{dirty ? "未保存の変更があります。" : selected ? "保存済みです。" : "まだ保存していません。"}</p>
          <button type="submit" disabled={saving || uploadBusy || (!dirty && Boolean(selected))}>{saving ? "保存しています…" : "下書き保存"}</button>
        </form>
        <details className={styles.previewDisclosure}>
          <summary>記事プレビューを開く・閉じる</summary>
          <ArticlePreview content={content} details={details} />
        </details>
        {message && <p role="status">{message}</p>}
        {saveError && <p role="alert">{saveError}</p>}
      </section>
    </div>
  );
}
