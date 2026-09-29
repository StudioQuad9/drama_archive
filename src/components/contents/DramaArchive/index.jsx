// @/components/contents/DramaArchive/index.jsx

"use client";

import { useState } from "react";
import FeaturedDrama from "@/components/contents/FeaturedDrama";
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

  const featuredDrama = dramas.find((drama) => {
    return drama.featured;
  });

  const otherDramas = dramas.filter((drama) => {
    return !drama.featured;
  }).sort((a, b) => {
    return Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  });
  
  return (
    <div className={styles.archive}>
      <FeaturedDrama 
        drama={featuredDrama} 
        onSelect={handleSelectDrama}
      />

      <DramaList 
        dramas={otherDramas} 
        onSelect={handleSelectDrama}
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