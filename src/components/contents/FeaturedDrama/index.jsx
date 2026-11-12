// @/components/contents/FeaturedDrama/index.jsx

// import Image from "next/image";
import ImageSlider from "@/components/ui/ImageSlider";
import styles from "./FeaturedDrama.module.scss";

export default function FeaturedDrama({ drama }) {
  if (!drama) return null;

  const images = [drama.image, ...(drama.subImages ?? [])];

  return (
    <section id="featured" className={styles.section}>
      <h2>Featured</h2>

      <article className={styles.featured}>
        <div className={styles.visual}>
          <div className="img-wrapper">
            <ImageSlider
              title={drama.title}
              images={images}
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