"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { parseImageReference } from "@/lib/uploads/image-file.mjs";
import styles from "./DramaDetail.module.scss";

export function ImagePreview({ value }) {
  const [result, setResult] = useState({ source: "", url: "", error: "" });
  const [broken, setBroken] = useState("");
  useEffect(() => {
    let active = true;
    async function resolve() {
      const reference = parseImageReference(value);
      if (!reference) return;
      try {
        const { data, error } = await getBrowserSupabase().storage
          .from(reference.bucket).createSignedUrl(reference.path, 3600);
        if (error) throw error;
        if (active) setResult({ source: value, url: data.signedUrl, error: "" });
      } catch {
        if (active) setResult({ source: value, url: "", error: "プレビューを取得できません。保存先の設定とログイン状態をご確認ください。" });
      }
    }
    void resolve();
    const timer = setInterval(resolve, 50 * 60 * 1000);
    return () => { active = false; clearInterval(timer); };
  }, [value]);
  if (!value) return null;
  const privateImage = parseImageReference(value);
  const safeUrl = (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) || /^https?:\/\//i.test(value);
  const url = privateImage ? (result.source === value ? result.url : "") : safeUrl ? value : "";
  const error = result.source === value ? result.error : "";
  if (error) return <p role="alert">{error}</p>;
  if (!url) return privateImage ? <p role="status">画像を確認しています…</p> : null;
  if (broken === url) return <p>画像を表示できません。画像の場所をご確認ください。</p>;
  return <Image className={styles.imagePreview} src={url} alt="選択中の記事画像" width={480} height={270} unoptimized onError={() => setBroken(url)} />;
}

