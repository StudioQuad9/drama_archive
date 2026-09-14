# 第7章　状態を使ってメニューを動かす

## 目的

`classList.toggle()`で行っていたメニュー開閉を、Reactのstateへ置き換えます。

## 1. Client Component

Next.jsのページやコンポーネントは、基本的にサーバー側で表示内容を準備します。しかし、サーバーは「今、利用者がメニューボタンを押した」という操作を直接扱えません。クリックは、ページを開いているブラウザで起こるからです。

そこで、クリックに応じて表示を変える部分には、ファイルの先頭に`"use client"`を書きます。

```jsx
"use client";

import { useState } from "react";
```

これで、ブラウザ側で`onClick`を受け取り、`useState`に「メニューが開いているか」を覚えさせられます。`useEffect`や、ブラウザにしかない`window`、`document`などを使う場合も同様です。

`"use client"`は「ページ全体をブラウザだけで作る」という意味ではありません。**操作が必要な部品を、ブラウザでも動かせるようにする印**です。

## 2. メニューの状態

```jsx
const [isMenuOpen, setIsMenuOpen] = useState(false);

const toggleMenu = () => {
  setIsMenuOpen((current) => !current);
};

const closeMenu = () => {
  setIsMenuOpen(false);
};
```

表示はstateから決めます。

```jsx
<button
  type="button"
  className="menu-button"
  onClick={toggleMenu}
  aria-expanded={isMenuOpen}
  aria-controls="mobile-menu"
  aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
>
  {isMenuOpen ? "close" : "menu"}
</button>

<nav
  id="mobile-menu"
  className={`mobile-menu ${isMenuOpen ? "is-open" : ""}`}
  aria-label="モバイルナビゲーション"
>
  {/* links */}
</nav>
```

Reactでは、DOMを探して状態を質問するのではなく、stateを正として表示を決めます。

```text
stateが変わる
↓
Reactが表示を更新する
```

## 今日の確認

- [ ] stateの値と画面表示が一致する
- [ ] リンクを押すとメニューが閉じる
- [ ] `aria-expanded`が変化する
- [ ] JavaScriptでDOMを直接検索していない

## Git

```bash
git add .
git commit -m "Rebuild mobile navigation with React state"
```