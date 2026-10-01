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
  // 親で状態を生成して、子で更新用関数作って発火させる
  const inputSearchWord = (e) => {
    setSearchText(e.target.value)
  };
  // console.log(searchText);
  
  const selectedGenreName = (e) => {
    setSelectedGenre(e.target.value)
  };
  // console.log(selectedGenre);
  
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