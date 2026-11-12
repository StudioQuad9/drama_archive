"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import DramaDetail from "@/components/contents/DramaDetail";
import { fieldsToMetadata } from "@/lib/articles/drama-fields.mjs";
import { manuscriptToDrama } from "@/lib/articles/drama-adapter.mjs";

export default function ArticlePreview({ content, details }) {
  const [drama, setDrama] = useState(null);
  const [error, setError] = useState("");
  function open() {
    try {
      const metadata = fieldsToMetadata(details);
      setDrama(manuscriptToDrama({
        slug: "preview", content: { ...content, title: content.title.trim() || "タイトル未入力" }, metadata,
      }));
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }
  return (
    <>
      <button type="button" onClick={open}>記事をプレビュー</button>
      <p>保存前の入力内容を、公開時と同じ記事表示で確認します。</p>
      {error && <p role="alert">プレビューを開けません：{error}</p>}
      <Modal isOpen={Boolean(drama)} onClose={() => setDrama(null)} ariaLabel="記事プレビュー">
        {drama && <DramaDetail key={drama.youtubeId || "preview"} drama={drama} />}
      </Modal>
    </>
  );
}
