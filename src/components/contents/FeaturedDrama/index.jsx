// @/components/contents/FeaturedDrama/index.jsx

// import Image from "next/image";
import ImageSlider from "@/components/ui/ImageSlider";
import styles from "./FeaturedDrama.module.scss";

export default function FeaturedDrama({ drama, onSelect }) {
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
              onSelect={() => onSelect(drama)}
            />
          </div>

          {drama.quote && <p className={styles.quote}>
            {drama.quote}
            <br />
            —{drama.quoteBy}
          </p>}

          <h3 className={styles.title}>
            <button
              type="button"
              onClick={() => onSelect(drama)}
            >
              {drama.title}
            </button>
          </h3>

          {drama.score != null && <p className={styles.score}>
            {drama.score}/10
          </p>}
        </div>

        <p className={styles.information}>
          {drama.seasons != null ? `${drama.seasons} seasons` : ""} /{" "}
          {drama.genres.join(" ∙ ")}
          <br />
          {drama.year} / {drama.platforms.join(" ∙ ")}
        </p>
      </article>
    </section>
  );
}