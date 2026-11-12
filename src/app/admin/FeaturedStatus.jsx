"use client";

import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/browser";

export default function FeaturedStatus({ refresh, requested }) {
  const [state, setState] = useState({ status: "loading" });
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const { data, error } = await getBrowserSupabase().from("article_publications")
          .select("article_id,content").eq("metadata->>featured", "true").maybeSingle();
        if (error) throw error;
        if (active) setState({ status: "ready", article: data });
      } catch {
        if (active) setState({ status: "error" });
      }
    }
    void load();
    return () => { active = false; };
  }, [refresh]);
  return (
    <>
      {state.status === "loading" && <p>現在の特集を確認しています…</p>}
      {state.status === "error" && <p>現在の特集を確認できません。時間をおいて原稿を開き直してください。</p>}
      {state.status === "ready" && <p>現在の特集：{state.article?.content.title || "未指定"}</p>}
      <p>{requested ? "この指定を保存して公開・更新すると、この記事がトップの特集になり、以前の特集は通常の記事に戻ります。" : "下書き保存だけでは、現在の特集は変わりません。"}</p>
    </>
  );
}
