import { manuscriptToDrama } from "./drama-adapter.mjs";

const imageForPublicPage = (value) => {
  if (typeof value !== "string") return "";
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return value;
  try {
    const url = new URL(value);
    if (["https:", "http:"].includes(url.protocol) && !url.username && !url.password) return value;
  } catch { /* Private Storage references will be served in the next step. */ }
  return "";
};
const strings = (value) => Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];

export function publicationToDrama(record) {
  const metadata = record.metadata ?? {};
  return manuscriptToDrama({
    slug: record.slug,
    publishedAt: record.published_at,
    content: record.content,
    metadata: {
      ...metadata,
      image: imageForPublicPage(metadata.image) || "/pict/image-pending.svg",
      subImages: strings(metadata.subImages).map(imageForPublicPage).filter(Boolean),
      genres: strings(metadata.genres),
      platforms: strings(metadata.platforms),
      score: metadata.score ?? null,
      seasons: metadata.seasons ?? null,
      year: metadata.year ?? null,
      featured: metadata.featured === true,
      quote: metadata.quote ?? "",
      quoteBy: metadata.quoteBy ?? "",
      youtubeId: metadata.youtubeId ?? "",
    },
  });
}
