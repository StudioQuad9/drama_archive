# 第13章　SwiperでHeroスライドを作る

```bash
$ npm install swiper
バージョンの確認
$ npm ls swiper --depth=0
```

## スライダーを作る

```jsx
// src/components/ui/ImageSlider/index.jsx

"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./ImageSlider.module.scss";

export default function ImageSlider({ title, images }) {
  if (!images?.length) return null;

  return (
    <Swiper 
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
    >
      {
        images.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`}>
            <div className={styles.image}>
              <Image 
                src={image}
                // alternative text（代替テキスト）
                alt={`${title} ${index + 1}枚目`}
                fill
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
```