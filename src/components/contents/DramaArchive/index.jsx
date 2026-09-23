// @/components/contents/DramaArchive/index.jsx

import FeaturedDrama from "@/components/contents/FeaturedDrama";
import DramaList from "@/components/contents/DramaList";
import { dramas } from "@/data/dramas"
import styles from "./DramaArchive.module.scss";

export default function DramaArchive() {
  const featuredDrama = dramas.find((drama) => {
    return drama.featured;
  });

  const otherDramas = dramas.filter((drama) => {
    return !drama.featured;
  }).sort((a, b) => {
    return Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  });
  
  return (
    <div className={styles.archive}>
      <FeaturedDrama drama={featuredDrama} />
      <DramaList dramas={otherDramas} />
    </div>
  );
}