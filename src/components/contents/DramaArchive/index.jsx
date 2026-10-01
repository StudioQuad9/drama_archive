// @/components/contents/DramaArchive/index.jsx

"use client";

import { useState } from "react";
import FeaturedDrama from "@/components/contents/FeaturedDrama";
import DramaSearch from "@/components/contents/DramaSearch";
import DramaList from "@/components/contents/DramaList";
import DramaDetail from "@/components/contents/DramaDetail";
import Modal from "@/components/ui/Modal";
import { dramas } from "@/data/dramas"
import styles from "./DramaArchive.module.scss";

export default function DramaArchive() {

  const [selectedDrama, setSelectedDrama] = useState(null);
  const handleSelectDrama = (drama) => {
    setSelectedDrama(drama);
    setIsDramaModalOpen(true);
  };

  const [isDramaModalOpen, setIsDramaModalOpen] = useState(false);
  const handleCloseDrama = () => {
    setIsDramaModalOpen(false);
  };

  const [searchText, setSearchText] = useState("");

  const [selectedGenre, setSelectedGenre] = useState("all");

  // // 説明用
  // // データから取ったままの2時配列の値
  // const arr = dramas.map((drama) => drama.genres);
  // console.log(Array.isArray(arr), arr);
  
  // // 2時配列を平す
  // const arrFlat = dramas.flatMap((drama) => drama.genres);
  // console.log(Array.isArray(arrFlat), arrFlat);
  
  // // Setクラスに配列を引数にとってインスタンスを生成させてダブる値を間引く
  // const setInsUniq = new Set(dramas.flatMap((drama) => drama.genres));
  // // このインスタンスはSetクラスのオブジェクト
  // console.log(Array.isArray(setInsUniq), setInsUniq);

  // // Setクラスのインスタンスをスプレッド構文で展開し、
  // // 配列リテラル[]へ入れて新しい配列を作る
  // const arrUniq = [...setInsUniq];
  // console.log(Array.isArray(arrUniq), arrUniq);

  // ジャンルを収集する
  const genres = [...new Set(dramas.flatMap((drama) => drama.genres))];

  // 検索欄へ入力された文字を小文字へ揃える
  const normalizedSearchText = searchText.trim().toLowerCase();

  // 無名関数の中の式で真になったドラマのデータをフィルタリングして収集していってる
  const visibleDramas = dramas.filter((drama) => {
    const searchTarget = [
      drama.title,
      drama.genres.join(" "),
      drama.platforms.join(" "),
      String(drama.year),
      drama.reviewTitle,
      drama.review,
      drama.quote,
      drama.quoteBy,
      // 全文検索の対象を作る
      // filter(Boolean)で空の値を除く
      // join(" ")で一つの文字列へつなぐ
    ].filter(Boolean).join(" ").toLocaleLowerCase();

    const matchesSearch = 
      // 検索文字がなければマッチとして作品に真を返す
      normalizedSearchText === "" ||
      searchTarget.includes(normalizedSearchText);

    const matchesGenre = 
      // ジャンルを絞り込まなくてもマッチしたとして真を返す
      selectedGenre === "all" ||
      drama.genres.includes(selectedGenre)

    return matchesSearch && matchesGenre;
  });

  const featuredDrama = dramas.find((drama) => {
    return drama.featured;
  });

  const otherDramas = visibleDramas.filter((drama) => {
    // console.log(!drama.featured);
    return searchText !== "" || selectedGenre !== "all"
      ? true
      : !drama.featured
  }).sort((a, b) => {
    return Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  });
  
  return (
    <div className={styles.archive}>
      <FeaturedDrama 
        drama={featuredDrama} 
        onSelect={handleSelectDrama}
      />

      <DramaSearch
        genres={genres}
        searchText={searchText}
        setSearchText={setSearchText}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        />
      
      <DramaList 
        dramas={otherDramas} 
        onSelect={handleSelectDrama}
        searchText={searchText}
        selectedGenre={selectedGenre}
      />

      <Modal 
        isOpen={isDramaModalOpen}
        onClose={handleCloseDrama}
        ariaLabel={
          selectedDrama
            ? `${selectedDrama.title}のレビュー`
            : "作品レビュー"
        }
      >
        {
          isDramaModalOpen &&
          selectedDrama && 
            <DramaDetail 
              drama={selectedDrama} 
            />
        }
      </Modal>
    </div>
  );
}