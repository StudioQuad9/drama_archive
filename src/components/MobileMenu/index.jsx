// @/components/contents/MobileMenu/index.jsx

import styles from "./MobileMenu.module.scss";

export default function MobileMenu({ onClose, links }) {
  return (
    <nav 
      id="mobile-navigation"
      className={styles.mobileMenu}
      aria-label="モバイル・ナビゲーション"
    >
      <ul className="flex">
        {
          links.map((link) => (
            <li key={link.href}>
              <a 
                href={link.href}
                onClick={onClose}
              >
                {link.label}
              </a>
            </li>
          ))
        }
      </ul>
    </nav>
  );
}