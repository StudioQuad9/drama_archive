import { NextResponse } from "next/server";
import { createPublicSupabase } from "@/lib/supabase/public-server";
import { imageReference, parseImageReference } from "@/lib/uploads/image-file.mjs";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

export async function GET(_request, context) {
  const { path } = await context.params;
  const reference = parseImageReference(imageReference(path.join("/")));
  if (!reference) return NextResponse.json({ error: "画像が見つかりません。" }, { status: 404, headers });
  try {
    // Anonymous SELECT policy checks the published snapshot. Never sign as an admin.
    const { data, error } = await createPublicSupabase().storage
      .from(reference.bucket).createSignedUrl(reference.path, 60);
    if (error) {
      const unavailable = Number(error.statusCode) >= 500;
      return NextResponse.json({ error: unavailable ? "画像を読み込めませんでした。" : "画像が見つかりません。" }, { status: unavailable ? 503 : 404, headers });
    }
    // Only the redirect passes through Vercel; image bytes come from Storage.
    return NextResponse.redirect(data.signedUrl, { status: 307, headers });
  } catch {
    return NextResponse.json({ error: "画像を読み込めませんでした。" }, { status: 503, headers });
  }
}
