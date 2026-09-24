// @/components/contents/Header/index.jsx

"use client";

import { useState } from "react";
import MobileMenu from "@/components/MobileMenu";
import Modal from "@/components/ui/Modal";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import styles from "./Header.module.scss";

const navigationLinks = [
  { href: "#featured", label: "Featured" },
  { href: "#dramas", label: "Dramas" },
  { href: "#about", label: "About" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="header">
      <div className={`${styles.navigation} inner flex`}>
        <h1>
          <Image
            src="pict/logo.svg"
            alt=""
            width={230}
            height={35}
          />
        </h1>

        <button 
          type="button"
          className={styles.menuButton}
          onClick={handleToggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          <span aria-hidden="true">
            {
              isMenuOpen 
                ? <X size={30} strokeWidth={2} /> 
                : <Menu size={30} strokeWidth={2} /> 
            }
          </span>          
        </button>

        <Modal 
          isOpen={isMenuOpen} 
          onClose={handleCloseMenu}
          ariaLabel="モバイルメニューのモーダル"
        >
          <MobileMenu 
            onClose={handleCloseMenu}
            links={navigationLinks}
          />
        </Modal>

        <nav 
          className={styles.pcMenu}
          aria-label="グローバル・ナビゲーション"
        >
          <ul className="flex">
            {
              navigationLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))
            }
          </ul>
        </nav>
      </div>
    </div>
  );  
}