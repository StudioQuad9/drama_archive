// @/components/contents/DramaArchive/index.jsx

import FeaturedDrama from "@/components/contents/FeaturedDrama";
import DramaList from "@/components/contents/DramaList";

export default function DramaArchive() {
  return (
    <>
      <FeaturedDrama />
      <DramaList />
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