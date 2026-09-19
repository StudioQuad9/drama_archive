// @/components/contents/FeaturedDrama/index.jsx

import Image from "next/image";

export default function FeautreDrama() {
  return (
    <section id="featured">
      <h2>Featured</h2>
  
      <div className="open-modal" data-modal="modal-true-detective">
        <Image
          src="/pict/truedetective.avif"
          alt="True Detective"
          width={1920}
          height={1534}
        />
        <p className="quote">
          “The World needs bad men.”
          <br />
          —Rust Cohle
        </p>
        <h3>True Detective</h3>
        <p className="score">10/10</p>
      </div>
      <p className="information">
        4 sesons / Crime ∙ Mystery
        <br />
        2014 / HBO
      </p>
    </section>
  );
}



// import Image from "next/image";

// import styles from "./FeaturedDrama.module.scss";

// export default function FeaturedDrama({ drama }) {
//   if (!drama) return null;

//   return (
//     <section id="featured">
//       <h2>Featured</h2>

//       <article className={styles.featured}>
//         <div className={styles.visual}>
//           <div className="img-wrapper">
//             <Image
//               src={drama.image}
//               alt={`${drama.title}のサムネール`}
//               width={1920}
//               height={1534}
//               sizes="(min-width: 900px) 900px, 100vw"
//               priority
//             />
//           </div>

//           <p className={styles.quote}>
//             {drama.quote}
//             <br />
//             —{drama.quoteBy}
//           </p>

//           <h3 className={styles.title}>
//             {drama.title}
//           </h3>

//           <p className={styles.score}>
//             {drama.score}/10
//           </p>
//         </div>

//         <p className={styles.information}>
//           {drama.seasons} seasons /{" "}
//           {drama.genres.join(" ∙ ")}
//           <br />
//           {drama.year} / {drama.platform}
//         </p>
//       </article>
//     </section>
//   );
// }