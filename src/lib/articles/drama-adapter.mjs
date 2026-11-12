/**
 * Convert the current static drama record into an editable manuscript.
 * This is a data conversion only; publication permissions belong on the server/DB.
 * Manuscript content must stay independent of Web and print presentation styles.
 */
export function dramaToManuscript(drama) {
  return {
    slug: drama.id,
    type: "drama-review",
    content: {
      title: drama.title,
      heading: drama.reviewTitle,
      body: drama.review,
      bodyFormat: "markdown",
    },
    metadata: {
      image: drama.image,
      subImages: [...(drama.subImages ?? [])],
      score: drama.score,
      seasons: drama.seasons,
      genres: [...drama.genres],
      year: drama.year,
      platforms: [...drama.platforms],
      featured: drama.featured,
      quote: drama.quote,
      quoteBy: drama.quoteBy,
      youtubeId: drama.youtubeId,
    },
    publishedAt: drama.publishedAt,
  };
}

/** Convert a published manuscript snapshot to the existing display contract. */
export function manuscriptToDrama(manuscript) {
  const { content, metadata } = manuscript;
  return {
    id: manuscript.slug,
    publishedAt: manuscript.publishedAt,
    title: content.title,
    image: metadata.image,
    subImages: [...metadata.subImages],
    score: metadata.score,
    seasons: metadata.seasons,
    genres: [...metadata.genres],
    year: metadata.year,
    platforms: [...metadata.platforms],
    featured: metadata.featured,
    quote: metadata.quote,
    quoteBy: metadata.quoteBy,
    youtubeId: metadata.youtubeId,
    reviewTitle: content.heading,
    review: content.body,
  };
}
