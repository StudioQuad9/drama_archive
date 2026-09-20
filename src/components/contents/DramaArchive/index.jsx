// @/components/contents/DramaArchive/index.jsx

import FeaturedDrama from "@/components/contents/FeaturedDrama";
import DramaList from "@/components/contents/DramaList";
import { dramas } from "@/data/dramas"

export default function DramaArchive() {
  const featureDrama = dramas.find((drama) => {
    return drama.featured;
  });

  const otherDramas = dramas.filter((drama) => {
    return !drama.featured;
  }).sort((a, b) => {
    return Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  });
  
  return (
    <>
      <FeaturedDrama drama={featureDrama} />
      <DramaList dramas={otherDramas} />
    </>
  );
}



// import { dramas } from "@/data/dramas";

// import FeaturedDrama from "./FeaturedDrama";
// import DramaList from "./DramaList";

// import styles from "./DramaArchive.module.scss";

// export default function DramaArchive() {
//   const featuredDrama = dramas
//     .find((drama) => drama.featured);
  
//   const otherDramas = dramas
//     .filter((drama) => !drama.featured)
//     // ミリ秒に変換して比較してソートする。
//     .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

//   return (
//     <div className={styles.archive}>
//       <FeaturedDrama drama={featuredDrama} />
//       <DramaList dramas={otherDramas} />
//     </div>
//   );
// }