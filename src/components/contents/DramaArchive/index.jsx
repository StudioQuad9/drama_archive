// @/components/contents/DramaArchive/index.jsx

import FeaturedDrama from "@/components/contents/FeaturedDrama";
import DramaList from "@/components/contents/DramaList";
import { dramas } from "@/data/dramas"

export default function DramaArchive() {
  const featuredDrama= dramas.find((drama) => {
    return drama.featured;
  });

  const otherDramas = dramas.filter((drama) => {
    return !drama.featured;
  }).sort((a, b) => {
    return Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  });
  
  return (
    <>
      <FeaturedDrama drama={featuredDrama} />
      <DramaList dramas={otherDramas} />
    </>
  );
}