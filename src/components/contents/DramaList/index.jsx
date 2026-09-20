// @/components/contents/DramaList/index.jsx

import DramaCard from "@/components/contents/DramaCard";
import styles from "./DramaList.module.scss";

export default function DramaList({ dramas }) {
  return (
    <section id="dramas">
      <h2 className={styles.heading2}>Dramas</h2>

      <ul className={styles.list}>
        {dramas.map((drama, index) => (
          <li
            key={drama.id}
            className={styles.item}
          >
            <DramaCard
              drama={drama}
              order={index + 1}
              />
          </li>
        ))}
      </ul>
    </section>
  );
}

{/* 
::::: origin html :::::
<section id="dramas">
  <h2>Dramas</h2>

  <div className="drama-cards">
    <article
      className="drama open-modal"
      data-modal="modal-stranger-things"
    >
      <div className="flex">
        <div className="thumbnail">
          <Image
            src="/pict/strangerthings.avif"
            alt="Stranger Things"
            width={1920}
            height={1076}
          />
        </div>
        <h4></h4>
        <div className="score"></p>
      </div>
      <p className="information">
        5 seasons / SF ∙ Juvenile
        <br />
        2016 / NETFLIX
      </p>
    </article>
  </div>
</section>
  */}

