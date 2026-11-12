"use client";

import { Upload } from "tus-js-client";
import { getBrowserSupabase } from "@/lib/supabase/browser";

// Shared transport for images and future private PDF submissions.
// Storage validates credentials and permissions; file bodies never pass through Next.js.
export function createResumableUpload({ file, bucket, path, contentType, onProgress, onSuccess, onError }) {
  const supabase = getBrowserSupabase();
  const endpoint = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  if (endpoint.hostname.endsWith(".supabase.co")) {
    endpoint.hostname = endpoint.hostname.replace(/\.supabase\.co$/, ".storage.supabase.co");
  }
  endpoint.pathname = "/storage/v1/upload/resumable";
  endpoint.search = "";
  endpoint.hash = "";
  return new Upload(file, {
    endpoint: endpoint.href,
    chunkSize: 6 * 1024 * 1024,
    retryDelays: [0, 3000, 5000, 10000, 20000],
    uploadDataDuringCreation: true,
    // Resume this transfer in the open page. Do not retain sensitive upload URLs
    // across accounts or reuse an old upload under a newly generated object name.
    storeFingerprintForResuming: false,
    removeFingerprintOnSuccess: true,
    metadata: { bucketName: bucket, objectName: path, contentType, cacheControl: "3600" },
    async onBeforeRequest(request) {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) throw new Error("ログインし直してください。");
      request.setHeader("authorization", `Bearer ${session.access_token}`);
      request.setHeader("apikey", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
    },
    onProgress(bytes, total) { onProgress(total ? Math.round(bytes / total * 100) : 0); },
    onSuccess,
    onError,
  });
}
