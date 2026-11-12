// @/app/admin/AdminAccess.jsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import styles from "./admin.module.scss";
import DraftWorkspace from "./DraftWorkspace";

export default function AdminAccess() {
  const [access, setAccess] = useState({ status: "checking" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [draftDirty, setDraftDirty] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);

  useEffect(() => {
    let active = true;
    let generation = 0;
    let subscription;
    let timer;

    async function verify() {
      const current = ++generation;
      const update = (value) => {
        if (active && current === generation) setAccess(value);
      };
      try {
        const supabase = getBrowserSupabase();
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          update({ status: "login" });
          return;
        }
        const { data: admin, error: membershipError } = await supabase
          .from("article_admins")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();
        if (membershipError) {
          update({ status: "error", email: user.email });
          return;
        }
        update({ status: admin ? "admin" : "denied", email: user.email, userId: user.id });
      } catch {
        update({ status: "error" });
      }
    }

    try {
      const supabase = getBrowserSupabase();
      ({ data: { subscription } } = supabase.auth.onAuthStateChange(() => {
        // Defer API calls until the auth event callback releases its lock.
        clearTimeout(timer);
        timer = setTimeout(verify, 0);
      }));
      void verify();
    } catch {
      void verify();
    }
    return () => {
      active = false;
      generation++;
      clearTimeout(timer);
      subscription?.unsubscribe();
    };
  }, []);

  async function login(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = event.currentTarget;
    const fields = new FormData(form);
    try {
      const { error } = await getBrowserSupabase().auth.signInWithPassword({
        email: String(fields.get("email")).trim(),
        password: String(fields.get("password")),
      });
      if (error) {
        setMessage("ログインできませんでした。メールアドレス・パスワードと、メール確認が完了しているかをご確認ください。");
      } else {
        form.reset();
      }
    } catch {
      setMessage("接続できませんでした。通信状態を確認して、もう一度お試しください。");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    if (draftSaving) return;
    if (draftDirty && !window.confirm("未保存の変更があります。保存せずにログアウトしますか？")) return;
    setBusy(true);
    setMessage("");
    try {
      const { error } = await getBrowserSupabase().auth.signOut({ scope: "local" });
      if (error) throw error;
      setAccess({ status: "login" });
    } catch {
      setMessage("ログアウトできませんでした。もう一度お試しください。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={`${styles.panel} ${access.status === "admin" ? styles.workspacePanel : ""}`} aria-labelledby="admin-title">
        <p className={styles.eyebrow}>Commerce Engine</p>
        <h1 id="admin-title">記事管理</h1>
        {access.status === "checking" && <p role="status">ログイン状態を確認しています…</p>}
        {access.status === "login" && (
          <>
            <p>登録済みの管理者アカウントでログインしてください。</p>
            <form onSubmit={login} className={styles.form}>
              <label htmlFor="admin-email">メールアドレス</label>
              <input id="admin-email" name="email" type="email" autoComplete="username" required disabled={busy} />
              <label htmlFor="admin-password">パスワード</label>
              <input id="admin-password" name="password" type="password" autoComplete="current-password" required disabled={busy} />
              <button type="submit" disabled={busy}>{busy ? "ログインしています…" : "ログイン"}</button>
            </form>
          </>
        )}
        {access.status === "admin" && (
          <>
            <p role="status">ログインしました。記事の管理者として確認できました。</p>
            <p>{access.email}</p>
            <DraftWorkspace key={access.userId} userId={access.userId} onDirtyChange={setDraftDirty} onSavingChange={setDraftSaving} />
          </>
        )}
        {access.status === "denied" && <p role="alert">このアカウントには記事管理の権限がありません。</p>}
        {access.status === "error" && (
          <>
            <p role="alert">管理者の確認ができませんでした。接続設定や通信状態を確認してください。</p>
            <button type="button" onClick={() => window.location.reload()}>再読み込み</button>
          </>
        )}
        {access.email && <button type="button" onClick={logout} disabled={busy || draftSaving}>ログアウト</button>}
        {message && <p role="alert">{message}</p>}
        <Link href="/" className={styles.back} onClick={(event) => {
          if (draftSaving || (draftDirty && !window.confirm("未保存の変更があります。保存せずに公開サイトへ戻りますか？"))) event.preventDefault();
        }}>公開サイトに戻る</Link>
      </section>
    </main>
  );
}
