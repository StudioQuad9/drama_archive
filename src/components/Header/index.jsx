// @/components/contents/Header/index.jsx

import styles from "./Header.module.scss";

import Image from "next/image";

export default function Header() {
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

          <button className={styles.menuButton}>
            <span className="material-symbols-outlined">menu</span>
          </button>

          <nav className={styles.menu}>
            <ul className="flex">
              <li><a href="#featured">Featured</a></li>
              <li><a href="#dramas">Dramas</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </nav>

          <nav className={styles.pcMenu}>
            <ul className="flex">
              <li><a href="#featured">Featured</a></li>
              <li><a href="#dramas">Dramas</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </nav>

        </div>
    </div>
  );  
}