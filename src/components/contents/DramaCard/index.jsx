// @/components/contents/DramaCard/index.jsx

import ReactMarkdown from "react-markdown";
import Image from "next/image";
import styles from "./DramaCard.module.scss";

export default function DramaCard({ drama, order }) {
  const displayOrder = String(order).padStart(2, "0");

  return (
    <article className={styles.card}>
      <div className="img-wrapper">
        <Image
          src={drama.image}
          alt={`${drama.title}のサムネール`}
          width={1920}
          height={1076}
        />
      </div>

      <p className={styles.score}>{drama.score}/10</p>

      <div className={styles.body}>
        <div className={styles.heading}>
          <span className={styles.order}>{displayOrder}</span>
          <h3 className={styles.title}>
            {drama.title}
          </h3>
        </div>

        <p className={styles.information}>
          {drama.seasons} seasons / {drama.genres.join(" ∙ ")}
          <br />
          {drama.year} / {drama.platforms.join(" ∙ ")}
        </p> 
        <ReactMarkdown
          components={{
            a: ({ node, children, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),            
          }}
        >
          {drama.review}
        </ReactMarkdown>
      </div>
    </article>
  );
}