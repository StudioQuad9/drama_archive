import { parseImageReference } from "../uploads/image-file.mjs";

// Input fields are strings; stored metadata uses numbers, arrays and booleans.
export function metadataToFields(metadata = {}) {
  return {
    image: metadata.image ?? "",
    subImages: (metadata.subImages ?? []).join("\n"),
    score: metadata.score == null ? "" : String(metadata.score),
    seasons: metadata.seasons == null ? "" : String(metadata.seasons),
    year: metadata.year == null ? "" : String(metadata.year),
    genres: (metadata.genres ?? []).join("\n"),
    platforms: (metadata.platforms ?? []).join("\n"),
    featured: metadata.featured ?? false,
    quote: metadata.quote ?? "",
    quoteBy: metadata.quoteBy ?? "",
    youtubeId: metadata.youtubeId ?? "",
  };
}

const lines = (value) => value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
function number(value, label, min, max = Infinity) {
  if (value.trim() === "") return null;
  const result = Number(value);
  if (!Number.isInteger(result) || result < min || result > max) {
    throw new Error(`${label}は${min}以上${Number.isFinite(max) ? `${max}以下` : ""}の整数で入力してください。`);
  }
  return result;
}
function imageLocation(value) {
  const location = value.trim();
  if (!location) return location;
  if (parseImageReference(location)) return location;
  if (location.startsWith("/") && !location.startsWith("//") && !location.includes("\\")) return location;
  try {
    const url = new URL(location);
    if (["https:", "http:"].includes(url.protocol) && !url.username && !url.password) return location;
  } catch { /* Show the same guidance for all unsupported locations. */ }
  throw new Error("画像は /pict/example.avif のようなパス、または http(s) のURLで入力してください。");
}

export function fieldsToMetadata(fields, existing = {}) {
  const youtubeId = fields.youtubeId.trim();
  if (youtubeId && !/^[A-Za-z0-9_-]{11}$/.test(youtubeId)) {
    throw new Error("YouTubeはURL全体ではなく、11文字の動画IDを入力してください。");
  }
  return {
    ...existing,
    image: imageLocation(fields.image),
    subImages: lines(fields.subImages).map(imageLocation),
    score: number(fields.score, "評価", 0, 10),
    seasons: number(fields.seasons, "シーズン数", 1),
    year: number(fields.year, "作品の年", 1, 9999),
    genres: lines(fields.genres),
    platforms: lines(fields.platforms),
    featured: Boolean(fields.featured),
    quote: fields.quote,
    quoteBy: fields.quoteBy,
    youtubeId,
  };
}
