// src/components/ui/Modal/index.jsx

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import styles from "./Modal.module.scss";

export default function Modal({ isOpen, onClose, ariaLabel, children }) {

  // そのままだとエラーになるので対策したものを置く。
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // Portalでdocument.bodyを使うため、ブラウザ表示後に一度だけ更新する。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  console.log({ isOpen, isMounted });

  // // 例1）
  // useEffect(() => {
  //   console.log("現在のisOpen:", isOpen)
  // }, [isOpen]);
  // // }, []);
  
  // // 例2）
  // useEffect(() => {
  //   if (isOpen === false) return;
  //   console.log("現在のisOpen:", isOpen)
  //   console.log("モーダルが開くたびに出力する")
  // // }, []);
  // }, [isOpen]);
  
  // // 例3）
  // useEffect(() => {
  //   if (isOpen === false) return;
  //   // console.log(getComputedStyle(document.body).overflow);
  //   const previousOverflow = document.body.style.overflow;
  //   document.body.style.overflow = "hidden";
  //   return () => {
  //     document.body.style.overflow = previousOverflow;
  //   };
  // }, [isOpen]);

  useEffect(() => {
    if (isOpen === false) return;

    // 下のレイヤーをスクロースさせない
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    // Escキーで閉じる
    const handleKeyDown = (event) => {
      event.key === "Escape" && onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // メニュー（グローバルメニューのスマートフォン版）が
  // 開いていなければ、以降の処理はせずに終了。
  // // DOM型
  // if (isOpen === false) return null;
  // state型
  if (isMounted === false) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      // // DOM型
      // className={`
      //   ${styles.modal} ${isOpen ? styles.isOpen : styles.isClosed}
      // `}
      // role="dialog"
      // aria-modal="true"
      // aria-label={ariaLabel}
      // onClick={handleBackdropClick}

      // state型
      className={`
        ${styles.modal} ${isOpen ? styles.isOpen : ""}
      `}
      role={isOpen ? "dialog" : undefined}
      aria-modal={isOpen ? "true" : undefined}
      aria-label={isOpen ? ariaLabel : undefined}
      aria-hidden={!isOpen}
      onClick={handleBackdropClick}
    >
      {/* <button
        type="button"
        style={{
          height: "100px",
          backgroundColor: "red",
        }}
      >
        閉じたくないボタン
      </button> */}

      <button
        type="button"
        className={styles.modalBtn}
        onClick={onClose}
        aria-label="ダイアログを閉じる"
        >
        <X
          className={styles.cross}
          size={30}
          strokeWidth={2}
          />
        CLOSE
      </button>

      {children}
    </div>,
    document.body,
  );
}