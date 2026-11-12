// src/components/ui/Modal/index.jsx

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import styles from "./Modal.module.scss";

export default function Modal({ isOpen, onClose, ariaLabel, children }) {

  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  if (isMounted === false) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={`
        ${styles.modal} ${isOpen ? styles.isOpen : ""}
      `}
      role={isOpen ? "dialog" : undefined}
      aria-modal={isOpen ? "true" : undefined}
      aria-label={isOpen ? ariaLabel : undefined}
      aria-hidden={!isOpen}
      onClick={handleBackdropClick}
    >
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