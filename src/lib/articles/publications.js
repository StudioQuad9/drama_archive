import "server-only";

import { createClient } from "@supabase/supabase-js";
import { publicationToDrama } from "./publication-record.mjs";

export async function getPublishedDramas() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Public article connection is not configured");
  // Always read as a visitor, independently of any administrator's browser session.
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
  const records = [];
  const size = 100;
  for (let offset = 0; ; offset += size) {
    const { data, error } = await supabase.from("article_publications")
      .select("article_id,slug,content,metadata,published_at")
      .order("published_at", { ascending: false }).order("article_id", { ascending: true })
      .range(offset, offset + size - 1);
    if (error) throw new Error("Could not load published articles");
    records.push(...data);
    if (data.length < size) break;
  }
  return records.map(publicationToDrama);
}
