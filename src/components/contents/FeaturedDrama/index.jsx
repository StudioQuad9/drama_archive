// @/components/contents/FeaturedDrama/index.jsx

import Image from "next/image";
import styles from "./FeaturedDrama.module.scss";

export default function FeaturedDrama({ drama }) {
  if (!drama) return null;

  return (
    <section id="featured">
      <h2>Featured</h2>

      <article className={styles.featured}>
        <div className={styles.visual}>
          <div className="img-wrapper">
            <Image
              src={drama.image}
              alt={`${drama.title}のサムネール`}
              width={1920}
              height={1534}
              sizes="(min-width: 900px) 900px, 100vw"
              priority
            />
          </div>

          <p className={styles.quote}>
            {drama.quote}
            <br />
            —{drama.quoteBy}
          </p>

          <h3 className={styles.title}>
            {drama.title}
          </h3>

          <p className={styles.score}>
            {drama.score}/10
          </p>
        </div>

        <p className={styles.information}>
          {drama.seasons} seasons /{" "}
          {drama.genres.join(" ∙ ")}
          <br />
          {drama.year} / {drama.platform}
        </p>
      </article>
    </section>
  );
}