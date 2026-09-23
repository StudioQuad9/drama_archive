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