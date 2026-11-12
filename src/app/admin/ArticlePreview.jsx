"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { fieldsToMetadata } from "@/lib/articles/drama-fields.mjs";
import { ImagePreview } from "./ImageUpload";
import styles from "./preview.module.scss";

function VideoPreview({ id }) {
  const [show, setShow] = useState(false);
  return show ? (
    <iframe className={styles.video} src={`https://www.youtube-nocookie.com/embed/${id}`} title="作品動画のプレビュー" allowFullScreen />
  ) : <button type="button" onClick={() => setShow(true)}>動画を確認する</button>;
}

export default function ArticlePreview({ content, details }) {
  let metadata;
  try {
    metadata = fieldsToMetadata(details);
  } catch (error) {
    return <p role="alert">プレビューを表示できません：{error.message}</p>;
  }
  const information = [
    ["評価", metadata.score == null ? "未入力" : `${metadata.score}/10`],
    ["シーズン数", metadata.seasons ?? "未入力"],
    ["作品の年", metadata.year ?? "未入力"],
    ["ジャンル", metadata.genres.join("・") || "未入力"],
    ["配信先", metadata.platforms.join("・") || "未入力"],
    ["Featured", metadata.featured ? "指定あり（公開後に反映）" : "指定なし"],
  ];
  return (
    <article className={styles.preview} aria-label="入力中の記事プレビュー">
      <p className={styles.notice}>入力中の内容です。保存・公開は行いません。公開サイトへの組み込みは次の段階です。</p>
      <h2>{content.title.trim() || "タイトル未入力"}</h2>
      {metadata.image ? <ImagePreview value={metadata.image} /> : <p>メイン画像は未設定です。</p>}
      <dl className={styles.information}>
        {information.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      {metadata.quote && <blockquote><p>{metadata.quote}</p>{metadata.quoteBy && <footer>— {metadata.quoteBy}</footer>}</blockquote>}
      {!metadata.quote && metadata.quoteBy && <p>引用者：{metadata.quoteBy}（引用文は未入力）</p>}
      {metadata.youtubeId && <VideoPreview key={metadata.youtubeId} id={metadata.youtubeId} />}
      {content.heading.trim() && <h3>{content.heading}</h3>}
      <div className={styles.body}>
        {content.body.trim() ? <ReactMarkdown skipHtml components={{
          a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
          img: () => <span>［本文内の画像は画像欄から設定してください］</span>,
        }}>{content.body}</ReactMarkdown> : <p>本文はまだ入力されていません。</p>}
      </div>
      {metadata.subImages.length > 0 && <section aria-label="追加画像"><h3>追加画像</h3><div className={styles.gallery}>{metadata.subImages.map((value, index) => <ImagePreview key={`${index}-${value}`} value={value} />)}</div></section>}
    </article>
  );
}
