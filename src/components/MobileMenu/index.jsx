// @/components/contents/MobileMenu/index.jsx

import styles from "./MobileMenu.module.scss";

export default function MobileMenu({ isOpen, onClose, links }) {
  console.log(isOpen)
  console.log(links)
  return (
    <nav 
      id="mobile-navigation"
      className={styles.mobileMenu}
      aria-label="モバイル・ナビゲーション"
      hidden={!isOpen}
    >
      <ul className="flex">
        {
          links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))
        }
      </ul>
    </nav>
  );
}