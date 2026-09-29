// @/components/contents/DramaDetail/index.jsx

"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./DramaDetail.module.scss";

export default function DramaDetail({ drama }) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <article className={styles.detail}>
      <h2 className={styles.title}>{drama.title}</h2>
      <div className={styles.youtube}>
        <iframe 
          className={isVideoLoaded ? styles.isLoaded : ""}
          src={`https://www.youtube-nocookie.com/embed/${drama.youtubeId}`} 
          title={`${drama.title}の動画`}
          allow="accelerometer;
                autoplay; 
                clipboard-write; 
                encrypted-media; 
                gyroscope; 
                picture-in-picture"
          allowFullScreen
          onLoad={() => setIsVideoLoaded(true)}
        />
      </div>
      <h3 className={styles.reviewTitle}>{drama.reviewTitle}</h3>
      <div className={styles.review}>
        <ReactMarkdown
          components={{
            a: ({children, href, title}) => (
              <a
                href={href}
                title={title}
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            )
          }}
        >
          {drama.review}
        </ReactMarkdown>
      </div>
    </article>
  );
}