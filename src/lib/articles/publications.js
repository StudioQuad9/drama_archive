import "server-only";

import { createPublicSupabase } from "@/lib/supabase/public-server";
import { publicationToDrama } from "./publication-record.mjs";

export async function getPublishedDramas() {
  const supabase = createPublicSupabase();
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
