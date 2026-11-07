// @/components/contents/DramaList/index.jsx

import DramaCard from "@/components/contents/DramaCard";
// import useScrollReveal from "@/hook/useScrollReveal";
import styles from "./DramaList.module.scss";

export default function DramaList({ dramas, onSelect, searchText, selectedGenre }) {
  // // 01
  // const observerRef = useScrollReveal();
  // // 02
  // const { observerRef, isInView } = useScrollReveal();
  // console.log("Dramas見出し：", isInView);

  return (
    <section 
      id="dramas"
      className="appear up"
    >
      {/* 01 */}
      {/* <h2
        className={styles.heading2}
        ref={observerRef}
      > */}
      {/* 02 */}
      {/* <h2
        className={`
          ${styles.heading2}
          reveal
          ${isInView ? "inView" : ""}
        `}
        ref={observerRef}
      > */}
      <h2
        className={`${styles.heading2} item`}
      >
        Dramas
      </h2>

      {
        searchText.trim() !== "" || selectedGenre !== "all"
          ? dramas.length !== 0
            ? <p className={styles.resultComment}>{dramas.length}件の作品が該当しました。</p>
            : <p className={styles.resultComment}>該当する作品はありません。</p>
          : null
      }

      <ul className={`${styles.list} appear up`}>
        {dramas.map((drama, index) => (
          <li
            key={drama.id}
            className={`
              ${styles.item}
              item
            `}
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