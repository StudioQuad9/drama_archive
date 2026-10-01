// @/components/contents/DramaList/index.jsx

import DramaCard from "@/components/contents/DramaCard";
import styles from "./DramaList.module.scss";

export default function DramaList({ dramas, onSelect, searchText, selectedGenre }) {
  // console.log(dramas.length);
  // console.log(searchText, selectedGenre);
  return (
    <section id="dramas">
      <h2 className={styles.heading2}>Dramas</h2>

      {
        searchText.trim() !== "" || selectedGenre !== "all"
          ? dramas.length !== 0
            ? <p className={styles.resultComment}>{dramas.length}件の作品が該当しました。</p>
            : <p className={styles.resultComment}>該当する作品はありません。</p>
          : null
      }

      <ul className={styles.list}>
        {dramas.map((drama, index) => (
          <li
            key={drama.id}
            className={styles.item}
          >
            <DramaCard
              drama={drama}
              order={index + 1}
              onSelect={onSelect}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}