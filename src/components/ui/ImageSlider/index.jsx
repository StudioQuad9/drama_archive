// src/components/ui/ImageSlider/index.jsx

"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./ImageSlider.module.scss";

export default function ImageSlider({ title, images, onSelect }) {
  if (!images?.length) return null;

  return (
    <Swiper 
      className={styles.slider}
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      loop={images.length > 1}
      autoplay={{
        delay: 3000,
        // ユーザーが矢印クリックやスワイプ操作をしたあとも、
        // 自動再生を続けるかの設定
        disableOnInteraction: false,
      }}
      onClick={(swiper, event) => {
        if (swiper.allowClick && event.target.closest(".swiper-slide")) {
          onSelect?.();
        }
      }}
    >
      {
        images.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`}>
            <div className={styles.image}>
              <Image 
                src={image}
                alt={`${title} ${index + 1}枚目`}
                fill
                unoptimized={/^https?:/.test(image) || image.startsWith("/api/article-images/")}
                sizes="(min-width: 900px) 900px, 100vw"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))
      }
    </Swiper>
  );
}