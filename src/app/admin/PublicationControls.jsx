"use client";

import { useEffect, useRef, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import styles from "./admin.module.scss";

const formatDate = (value) => new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "short", timeStyle: "short", timeZone: "Asia/Tokyo",
}).format(new Date(value));

export default function PublicationControls({ article, dirty, disabled, onBusyChange, onChanged }) {
  const [state, setState] = useState({ status: "loading", publication: null });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const locked = useRef(false);
  const active = useRef(true);

  useEffect(() => {
    active.current = true;
    return () => { active.current = false; };
  }, []);
  useEffect(() => {
    onBusyChange(busy);
    return () => onBusyChange(false);
  }, [busy, onBusyChange]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data, error } = await getBrowserSupabase()
          .from("article_publications")
          .select("article_id,source_revision,published_at,updated_at")
          .eq("article_id", article.id).maybeSingle();
        if (error) throw error;
        if (!cancelled) setState({ status: "ready", publication: data });
      } catch {
        if (!cancelled) setState({ status: "error", publication: null });
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [article.id, article.revision]);

  const publication = state.publication;
  const stale = publication && publication.source_revision > article.revision;
  const sameRevision = publication?.source_revision === article.revision;
  const validContent = Boolean(article.content.title.trim() && article.content.body.trim());
  const unavailable = disabled || busy || state.status !== "ready";

  async function operate(action) {
    if (locked.current || unavailable) return;
    if (action === "publish" && (dirty || !validContent || sameRevision || stale)) return;
    if (action === "unpublish" && !publication) return;
    const question = action === "publish"
      ? `「${article.content.title}」の保存済み原稿を${publication ? "公開中の記事へ反映しますか" : "公開しますか"}？公開版の文章・作品情報は一般の閲覧対象になります。`
      : "この記事を非公開にしますか？公開版を取り下げ、編集中の原稿は残します。";
    if (!window.confirm(question)) return;
    locked.current = true;
    setBusy(true);
    setMessage("");
    setErrorMessage("");
    try {
      const supabase = getBrowserSupabase();
      const args = action === "publish"
        ? { p_article_id: article.id, p_expected_revision: article.revision }
        : { p_article_id: article.id };
      let operationError;
      try {
        const result = await supabase.rpc(
          action === "publish" ? "publish_article" : "unpublish_article", args,
        );
        operationError = result.error;
      } catch (error) {
        operationError = error;
      }

      // Even a failed response may follow a committed write. Read before allowing
      // another submission, and keep controls locked until this check completes.
      const { data: current, error: readError } = await supabase
        .from("article_publications")
        .select("article_id,source_revision,published_at,updated_at")
        .eq("article_id", article.id).maybeSingle();
      if (readError) throw readError;
      if (!active.current) return;
      setState({ status: "ready", publication: current });
      onChanged?.();

      if (action === "publish" && current?.source_revision === article.revision) {
        setMessage(publication ? "更新しました。" : "公開しました。");
      } else if (action === "unpublish" && !current) {
        setMessage("非公開にしました。編集中の原稿は残っています。");
      } else if (operationError?.code === "40001" || (current && current.source_revision > article.revision)) {
        setErrorMessage("原稿が別の画面で更新されています。入力を保管してから、原稿一覧を更新して開き直してください。");
      } else if (["42501", "P0002"].includes(operationError?.code)) {
        setErrorMessage("この記事を操作する権限が確認できません。入力を保管し、ログイン状態をご確認ください。");
      } else if (operationError?.code === "23505") {
        setErrorMessage("同じ公開URLの記事がすでにあります。記事の設定を確認してください。");
      } else if (operationError?.code === "23514") {
        setErrorMessage("公開できませんでした。保存済みのタイトル・本文と記事の設定を確認してから、もう一度操作してください。");
      } else if (action === "unpublish") {
        setErrorMessage("記事はまだ公開中です。内容を確認し、もう一度「非公開にする」を押してください。");
      } else {
        setErrorMessage(`今回の内容は公開中の記事に反映されていません。内容を確認し、もう一度「${current ? "更新する" : "公開する"}」を押してください。`);
      }
    } catch {
      if (active.current) {
        setState({ status: "error", publication: null });
        setErrorMessage("通信が不安定なため、操作が完了したか確認できません。入力内容を保管し、時間をおいて、この原稿を開き直してください。");
      }
    } finally {
      locked.current = false;
      if (active.current) setBusy(false);
    }
  }

  return (
    <section className={styles.publication} aria-labelledby="publication-title">
      <h2 id="publication-title">公開設定</h2>
      <p>この段階では公開版のDBを操作します。トップページへの表示は次の段階で接続します。非公開画像の一般向け配信も後の段階で追加します。</p>
      {state.status === "loading" && <p role="status">公開状態を確認しています…</p>}
      {state.status === "error" && !errorMessage && <p role="alert">公開中かどうか確認できません。入力内容を保管し、時間をおいて、この原稿を開き直してください。</p>}
      {state.status === "ready" && (
        <>
          <p role="status"><strong>{publication ? "公開中" : "未公開"}</strong>
            {publication && ` ／ 初回公開：${formatDate(publication.published_at)} ／ 更新：${formatDate(publication.updated_at)}`}</p>
          {publication && <p>{sameRevision ? "保存済みの原稿と公開版は同じ版です。" : stale ? "画面より新しい版が公開されています。原稿一覧を更新して開き直してください。" : "保存済みの変更は、まだ公開版に反映されていません。"}</p>}
        </>
      )}
      {dirty && <p>未保存の変更があります。公開・更新するには、先に下書き保存してください。</p>}
      {!validContent && <p>公開には、保存済みのタイトルと本文が必要です。</p>}
      <div className={styles.actions}>
        <button type="button" disabled={unavailable || dirty || !validContent || sameRevision || Boolean(stale)} onClick={() => operate("publish")}>
          {busy ? "処理中…" : publication ? "更新する" : "公開する"}
        </button>
        <button type="button" disabled={unavailable || !publication} onClick={() => operate("unpublish")}>非公開にする</button>
      </div>
      {message && <p role="status">{message}</p>}
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </section>
  );
}
