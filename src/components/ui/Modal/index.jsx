// @/components/ui/Modal/index.jsx

import styles from "./Modal.module.scss";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, ariaLabel, children }) {
  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    return event.target === event.currentTarget && onClose();
  };

  return (
    <div
      className={styles.modal}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={handleBackdropClick}
    >

      <button
        type="button"
        style={{
          height: "100px",
          backgroundColor: "red",
        }}
      >
        閉じたくないボタン
      </button>      

      <button
        className={styles.modalBtn}
        type="button"
        onClick={onClose}
      >
        <X className={styles.cross} size={30} strokeWidth={2} />
        CLOSE
      </button>

      {children}
    </div>
  );
}