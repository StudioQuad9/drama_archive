// @/components/contents/DramaSearch/index.jsx

import { getRequestInsightKey } from "next/dist/shared/lib/request-insights";
import styles from "./DramaSearch.module.scss";

export default function DramaSearch({
  genres,
  searchText,
  setSearchText,
  selectedGenre,
  setSelectedGenre,
}) {
  const inputSearchWord = (e) => {
    setSearchText(e.target.value)
  };
  
  const selectedGenreName = (e) => {
    setSelectedGenre(e.target.value)
  };
  
  return (
    <div className={styles.search}>
      <label className={styles.field}>
        <span>全文検索</span>
        <input 
          type="search"
          value={searchText}
          placeholder="サイト内検索"
          onChange={inputSearchWord}
        />
      </label>

      <label htmlFor="" className={styles.field}>
        <span>ジャンル</span>
        <select 
          name="" 
          id=""
          value={selectedGenre}
          onChange={selectedGenreName}
        >
          <option value="all">全て</option> 
          {
            genres.map((genre) => (
              <option 
                key={genre}
                value={genre}
              >
                {genre}
              </option>
            ))
          }
        </select>
      </label>
    </div>
  );
}