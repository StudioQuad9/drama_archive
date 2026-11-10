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

  const genres = [...new Set(dramas.flatMap((drama) => drama.genres))];
  const normalizedSearchText = searchText.trim().toLowerCase();
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
    ].filter(Boolean).join(" ").toLocaleLowerCase();

    const matchesSearch = 
      normalizedSearchText === "" ||
      searchTarget.includes(normalizedSearchText);

    const matchesGenre = 
      selectedGenre === "all" ||
      drama.genres.includes(selectedGenre)

    return matchesSearch && matchesGenre;
  });

  const featuredDrama = dramas.find((drama) => {
    return drama.featured;
  });

  const otherDramas = visibleDramas.filter((drama) => {
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