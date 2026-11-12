"use client";

import { useEffect, useRef, useState } from "react";
import { createResumableUpload } from "@/lib/uploads/resumable";
import { IMAGE_ACCEPT, IMAGE_BUCKET, imageReference, inspectImage } from "@/lib/uploads/image-file.mjs";
import styles from "./admin.module.scss";
import { ImagePreview } from "@/components/contents/DramaDetail/ArticleImage";
export { ImagePreview } from "@/components/contents/DramaDetail/ArticleImage";

export default function ImageUpload({ userId, label, value, disabled, onUploaded, onBusyChange }) {
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const task = useRef(null);
  const alive = useRef(true);
  const locked = useRef(false);
  const uploading = ["validating", "uploading"].includes(status);
  const pending = uploading || status === "paused" || status === "error";

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      void task.current?.abort();
    };
  }, []);
  useEffect(() => {
    onBusyChange(pending);
    return () => onBusyChange(false);
  }, [pending, onBusyChange]);

  async function choose(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || locked.current) return;
    locked.current = true;
    setStatus("validating");
    setMessage("");
    setProgress(0);
    try {
      const info = await inspectImage(file);
      if (!alive.current) return;
      const path = `${userId}/${crypto.randomUUID()}.${info.extension}`;
      const reference = imageReference(path);
      task.current = createResumableUpload({
        file, bucket: IMAGE_BUCKET, path, contentType: info.contentType,
        onProgress(percent) { if (alive.current) setProgress(percent); },
        onSuccess() {
          if (!alive.current) return;
          task.current = null;
          locked.current = false;
          setStatus("done");
          setMessage("アップロードしました。原稿に反映するには下書き保存を押してください。");
          onUploaded(reference);
        },
        onError() {
          if (!alive.current) return;
          setStatus("error");
          setMessage("送信が止まりました。保存先の準備・通信・ログイン状態を確認し、再開してください。取り消す場合は中止を押してください。");
        },
      });
      setStatus("uploading");
      task.current.start();
    } catch (error) {
      if (!alive.current) return;
      locked.current = false;
      task.current = null;
      setStatus("idle");
      setMessage(error.message || "画像を確認できませんでした。");
    }
  }

  async function pause() {
    try {
      const current = task.current;
      await current?.abort();
      if (alive.current && current && task.current === current) setStatus("paused");
    } catch {
      if (alive.current) setMessage("一時停止できませんでした。通信状態をご確認ください。");
    }
  }
  function resume() {
    if (!task.current) return;
    setStatus("uploading");
    setMessage("");
    task.current.start();
  }
  async function cancel() {
    try {
      const current = task.current;
      await current?.abort();
      if (!alive.current || task.current !== current) return;
      task.current = null;
      locked.current = false;
      setStatus("idle");
      setProgress(0);
      setMessage("アップロードを中止しました。");
    } catch {
      if (alive.current) setMessage("中止できませんでした。もう一度お試しください。");
    }
  }

  return (
    <div className={styles.uploadBox}>
      <label>{label}<input type="file" accept={IMAGE_ACCEPT} disabled={disabled || pending} onChange={choose} /></label>
      <p>JPEG・PNG・WebP・AVIF・GIF。現在は1ファイル50MBまで。</p>
      {pending && <><progress value={progress} max="100" aria-label="アップロード進捗" /><p role="status">{status === "paused" ? "一時停止中" : status === "validating" ? "画像を確認中" : `転送 ${progress}%`}</p></>}
      <div className={styles.actions}>
        {status === "uploading" && <button type="button" onClick={pause}>一時停止</button>}
        {["paused", "error"].includes(status) && <button type="button" onClick={resume}>再開</button>}
        {pending && status !== "validating" && <button type="button" onClick={cancel}>中止</button>}
      </div>
      {message && <p role="status">{message}</p>}
      <ImagePreview value={value} />
    </div>
  );
}
