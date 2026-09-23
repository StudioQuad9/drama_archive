// @/components/contents/Header/index.jsx

"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Header.module.scss";
import MobileMenu from "@/components/MobileMenu";

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
          <div>
            <h1>
              <Image
                src="pict/logo.svg"
                alt=""
                width={230}
                height={35}
              />
            </h1>
          </div>

          <button 
            type="button"
            className={styles.menuButton}
            onClick={handleToggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span className="material-symbols-outlined">
              { isMenuOpen ? "close" : "open" }
            </span>
          </button>

          <MobileMenu 
            isOpen={isMenuOpen} 
            onClose={handleCloseMenu}
            links={navigationLinks}
          />
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