# 第7章　共通データとuseStateでメニューを作る

## 目的

現在のHeaderには、PC用とスマートフォン用で同じリンクが二度書かれています。

この章では、リンク情報を一つの配列へまとめ、`map()`から二つのナビゲーションを作ります。

次に、`useState`でモバイルメニューの開閉状態を管理します。最初から別コンポーネントへ分けず、Header内で動作を完成させてから`MobileMenu`へ切り出します。

```text
現在の静的Header
↓
重複したリンクを一つの配列へまとめる
↓
map()でPC用とスマートフォン用を作る
↓
useStateの値を画面に表示する
↓
ボタンでtrue / falseを切り替える
↓
stateをメニューの表示へ接続する
↓
動作するメニューをMobileMenuへ分ける
```

この章では、まだ共通Modalを使用しません。

```text
第7章
→ stateによって表示が変わる仕組みを理解する

第8章
→ 表示部分を実用的なModalへ置き換える
```

スタイルは事前に用意しています。この章ではSCSSを作り込まず、配列、state、props、コンポーネントの流れに集中します。

---

## 1. 現在のHeaderを確認する

現在のHeaderには、PC用とスマートフォン用のリンクが直接書かれています。

```jsx
// @/components/Header/index.jsx

import Image from "next/image";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className="header">
      <div className={`${styles.navigation} inner flex`}>
        <h1>
          <Image
            src="/pict/logo.svg"
            alt=""
            width={230}
            height={35}
          />
        </h1>

        <button
          type="button"
          className={styles.menuButton}
        >
          <span className="material-symbols-outlined">
            menu
          </span>
        </button>

        <nav
          className={styles.menu}
          aria-label="モバイルナビゲーション"
        >
          <ul className="flex">
            <li><a href="#featured">Featured</a></li>
            <li><a href="#dramas">Dramas</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </nav>

        <nav
          className={styles.pcMenu}
          aria-label="メインナビゲーション"
        >
          <ul className="flex">
            <li><a href="#featured">Featured</a></li>
            <li><a href="#dramas">Dramas</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
```

同じ三つのリンクが二度書かれています。

```text
PC Navigation
├── Featured
├── Dramas
└── About

Mobile Navigation
├── Featured
├── Dramas
└── About
```

見た目やHTML構造が違うことは問題ではありません。

問題は、リンクを一件追加・変更するたびに、二か所を修正しなければならないことです。

---

## 2. リンク情報を配列へまとめる

Headerファイルの中に、ナビゲーション用の配列を作ります。

```jsx
const navigationLinks = [
  { href: "#featured", label: "Featured" },
  { href: "#dramas", label: "Dramas" },
  { href: "#about", label: "About" },
];
```

一件分のデータは、次の形です。

```jsx
{
  href: "#featured",
  label: "Featured",
}
```

```text
href
→ リンク先

label
→ 画面に表示する文字
```

この配列には、PC用・スマートフォン用という見た目の情報を入れません。

```text
リンクの内容
→ navigationLinks

PCとスマートフォンの見た目
→ JSXとSCSS
```

`navigationLinks`はHeaderだけで使う固定データなので、コンポーネントの外側へ置きます。

```jsx
import Image from "next/image";
import styles from "./Header.module.scss";

const navigationLinks = [
  { href: "#featured", label: "Featured" },
  { href: "#dramas", label: "Dramas" },
  { href: "#about", label: "About" },
];

export default function Header() {
  // ...
}
```

Header以外でも同じリンクを使うようになった場合は、`src/data/navigation.js`などへ移すことを検討します。今はHeaderだけで使うため、同じファイル内で構いません。

---

## 3. PC用ナビゲーションをmap()へ変える

まず、PC用ナビゲーションだけを変更します。

```jsx
<nav
  className={styles.pcMenu}
  aria-label="メインナビゲーション"
>
  <ul className="flex">
    {navigationLinks.map((link) => (
      <li key={link.href}>
        <a href={link.href}>{link.label}</a>
      </li>
    ))}
  </ul>
</nav>
```

第6章では、作品データから作品カードを作りました。

今回は、リンクデータから`li`を作っています。

```text
navigationLinks
↓
map()
↓
リンクの数だけliを作る
```

`key`には、各リンクで重複しない`href`を使用します。

変更後も、PC用ナビゲーションの表示が変わらないことを確認してください。

---

## 4. スマートフォン用も同じ配列から作る

PC用が表示できたら、同じ方法でスマートフォン用ナビゲーションも`map()`へ変更します。

考える点は次のとおりです。

1. 使用する配列は何か
2. 一件分をどの変数で受け取るか
3. `key`には何を使うか
4. `href`と表示文字には何を使うか

PC用とスマートフォン用には、それぞれ`map()`があります。これは問題ありません。

```text
共通にするもの
→ hrefとlabel

別にしてよいもの
→ HTML構造、クラス名、表示方法
```

すべてのコードを一つにすることが共通化ではありません。

**同じ情報は一つにし、異なる表示は必要に応じて分けます。**

配列へ一件追加してみます。

```jsx
{ href: "#contact", label: "Contact" }
```

PC用とスマートフォン用の両方に`Contact`が追加されれば成功です。

確認後、今回のサイトに`#contact`がない場合は、この練習用データを削除します。

---

## 5. 操作に反応する境界を作る

ここまでは、データから静的な表示を作りました。

ここからは、ボタンを押した結果によって表示を変えます。

Headerファイルの先頭へ`"use client"`を追加し、Reactから`useState`を読み込みます。

```jsx
"use client";

import { useState } from "react";
import Image from "next/image";

import styles from "./Header.module.scss";
```

`useState`はブラウザ上の操作によって変わる値を扱います。そのため、このHeaderはClient Componentになります。

`"use client"`は、サイト全体をClient Componentにする指定ではありません。

```text
Header
→ ボタン操作とstateを扱うClient Component

DramaArchive
→ 操作を持たないためServer Componentのまま
```

---

## 6. メニューの状態を作る

Headerの中に、メニューが開いているかを表すstateを作ります。

```jsx
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ...
}
```

二つの名前には、それぞれ異なる役割があります。

```text
isMenuOpen
→ 現在の値

setIsMenuOpen
→ 値を変更する関数
```

最初の値は`false`です。

```text
false
→ メニューは閉じている

true
→ メニューは開いている
```

この段階では、まだメニューの表示に接続しません。まずstateそのものを画面に出します。

```jsx
<p>
  現在の状態：
  {isMenuOpen ? "開いている" : "閉じている"}
</p>
```

最初に「現在の状態：閉じている」と表示されることを確認してください。

この`p`はstateを確認するための一時的な表示です。動作確認後に削除します。

---

## 7. ボタンでstateを変更する

現在の状態を反転する関数を作ります。

```jsx
const toggleMenu = () => {
  setIsMenuOpen((current) => !current);
};
```

```text
現在がfalse
↓
!false
↓
trueへ変更
```

```text
現在がtrue
↓
!true
↓
falseへ変更
```

`current`は、更新直前のstateです。

メニューボタンの`onClick`へ、作成した関数を渡します。

```jsx
<button
  type="button"
  className={styles.menuButton}
  onClick={toggleMenu}
>
  <span className="material-symbols-outlined">
    menu
  </span>
</button>
```

ここで大切なのは、次の違いです。

```jsx
onClick={toggleMenu}
```

これは、クリックされたときに呼び出す関数を渡しています。

```jsx
onClick={toggleMenu()}
```

こちらは表示処理中に関数を実行してしまうため、今回の指定には使いません。

ボタンを押すたびに、画面の文字が「開いている」「閉じている」と変わることを確認します。

---

## 8. stateをメニューの表示へ接続する

stateが切り替わることを確認できたら、スマートフォン用ナビゲーションへ接続します。

```jsx
<nav
  id="mobile-navigation"
  className={styles.menu}
  aria-label="モバイルナビゲーション"
  hidden={!isMenuOpen}
>
  {/* navigationLinksから作ったul */}
</nav>
```

`hidden`には、非表示にする場合に`true`を渡します。

```text
isMenuOpenがfalse
↓
!isMenuOpenはtrue
↓
hidden={true}
↓
メニューを隠す
```

```text
isMenuOpenがtrue
↓
!isMenuOpenはfalse
↓
hidden={false}
↓
メニューを表示する
```

この章で使用する`.menu`は、`hidden`がないときに表示されるよう、事前にSCSSを調整しておきます。旧HTMLで使用していた`.menu.active`による開閉は使用しません。

動作は、次の順番です。

```text
ボタンを押す
↓
toggleMenu()を実行する
↓
isMenuOpenが変わる
↓
hiddenの値が変わる
↓
Reactが表示を更新する
```

JavaScriptからDOMのクラスを直接追加・削除しているのではありません。

**stateを変更し、そのstateから表示を決めています。**

---

## 9. 現在の状態を支援技術へ伝える

メニューボタンへ、二つの属性を追加します。

```jsx
<button
  type="button"
  className={styles.menuButton}
  onClick={toggleMenu}
  aria-expanded={isMenuOpen}
  aria-controls="mobile-navigation"
>
  <span className="material-symbols-outlined">
    menu
  </span>
</button>
```

```text
aria-expanded
→ 現在メニューが開いているかを伝える

aria-controls
→ このボタンがどの要素を操作するかを伝える
```

`aria-expanded`がメニューを開閉するわけではありません。

実際の表示は`isMenuOpen`から決まり、`aria-expanded`は同じ状態を支援技術へ伝えます。

ブラウザの開発者ツールで、ボタンを押すたびに`aria-expanded`が`false`と`true`へ変わることを確認してください。

---

## 10. 必ず閉じる関数を作る

メニューボタンには、現在の状態を反転する`toggleMenu()`を使用しました。

メニュー内のリンクを押した場合は、現在の状態に関係なく、必ず閉じたいので別の関数を作ります。

```jsx
const closeMenu = () => {
  setIsMenuOpen(false);
};
```

モバイルナビゲーションのリンクへ渡します。

```jsx
<a href={link.href} onClick={closeMenu}>
  {link.label}
</a>
```

役割の違いを確認します。

```text
toggleMenu()
→ 現在の状態を反転する

closeMenu()
→ 現在の状態に関係なくfalseにする
```

リンクを押したあとに、メニューが閉じることを確認してください。

---

## 11. 動作するメニューをコンポーネントへ分ける

ここまで、Headerの中でモバイルメニューを動かしました。

動作が確認できてから、まとまりを`MobileMenu`へ移します。

```text
src/components/
├── Header/
│   ├── index.jsx
│   └── Header.module.scss
└── MobileMenu/
    ├── index.jsx
    └── MobileMenu.module.scss
```

スマートフォン用の`nav`全体を、`MobileMenu/index.jsx`へカット＆ペーストします。

```jsx
// @/components/MobileMenu/index.jsx

import styles from "./MobileMenu.module.scss";

export default function MobileMenu({ isOpen, links, onClose }) {
  return (
    <nav
      id="mobile-navigation"
      className={styles.menu}
      aria-label="モバイルナビゲーション"
      hidden={!isOpen}
    >
      <ul className={styles.list}>
        {/* linksをmap()で展開する */}
      </ul>
    </nav>
  );
}
```

この章では、`MobileMenu.module.scss`を事前に用意しています。SCSSの作り直しは行いません。

Headerから呼び出します。

```jsx
import MobileMenu from "@/components/MobileMenu";
```

```jsx
<MobileMenu
  isOpen={isMenuOpen}
  links={navigationLinks}
  onClose={closeMenu}
/>
```

`MobileMenu`は三種類のpropsを受け取ります。

```text
isOpen
→ 真偽値。表示するかを決める

links
→ 配列。表示するリンクを決める

onClose
→ 関数。リンクを押したときに呼び出す
```

`MobileMenu`は自分でstateを持ちません。

```text
Header
├── メニューボタンを持つ
├── isMenuOpenを持つ
├── toggleMenu()で反転する
├── closeMenu()で閉じる
└── MobileMenuへ必要な値と関数を渡す
```

ボタンとメニューの両方が同じ開閉状態を必要とするため、共通の親であるHeaderがstateを持ちます。

---

## 12. 関数をpropsで渡す意味

第6章では、作品データを親から子へ渡しました。

```text
DramaList
↓ drama
DramaCard
```

第7章では、関数も親から子へ渡します。

```text
Header
↓ onCloseという関数を渡す
MobileMenu
↓ リンクを押したときにonClose()を呼ぶ
Headerが持つisMenuOpenがfalseになる
```

関数そのものは、HeaderからMobileMenuへpropsとして渡されています。

子の`MobileMenu`は、その関数を実行することで、親のHeaderへ「メニューを閉じてほしい」と依頼できます。

stateをどちらにも持たせないことが重要です。

```text
HeaderにもisMenuOpen
MobileMenuにもisMenuOpen
→ 二つの状態がずれる可能性がある
```

```text
HeaderだけがisMenuOpenを持つ
MobileMenuはpropsで受け取る
→ 現在の状態が一つに決まる
```

---

## 13. Client Componentの境界を確認する

`"use client"`はHeaderに書きます。

```jsx
// @/components/Header/index.jsx
"use client";
```

Headerから読み込まれる`MobileMenu`は、HeaderのClient Component境界の内側で使用されます。そのため、今回の`MobileMenu/index.jsx`へ重ねて`"use client"`を書く必要はありません。

```text
layout.js
└── Header  ← "use client"
    ├── useState
    └── MobileMenu
```

必要な範囲だけをClient Componentにし、作品一覧など操作を持たない部分はServer Componentのまま残します。

---

## 14. stateを正として考える

静的JavaScriptでは、DOMのクラスを直接変更して開閉することがあります。

```js
element.classList.toggle("active");
```

Reactでは、現在の状態を値として持ちます。

```text
ボタンを押す
↓
stateが変わる
↓
Reactが新しいstateを見る
↓
表示とaria-expandedが変わる
```

```text
DOMを確認して状態を判断する
```

のではなく、

```text
stateを正としてDOMを作る
```

ことが、この章の中心です。

動作確認用に追加した、現在の状態を表示する`p`はここで削除します。

---

## 15. 確認する

次の操作を一つずつ確認してください。

1. `navigationLinks`へリンクを追加すると、PC用とスマートフォン用の両方へ反映される
2. ボタンを押すとモバイルメニューが開く
3. もう一度ボタンを押すと閉じる
4. `aria-expanded`が`true`と`false`へ変わる
5. モバイルメニュー内のリンクを押すと閉じる
6. PC用ナビゲーションは開閉の影響を受けない

この段階では、次の機能はまだありません。

- Escapeキーで閉じる
- 背景クリックで閉じる
- 開いたメニューへフォーカスを移す
- Tabキーの移動をメニュー内へ留める
- 閉じたときにフォーカスを戻す
- 背景スクロールを止める

これらは、次章の共通Modalで追加します。

---

## この章で作った流れ

```text
navigationLinks
├── map()でPC用ナビゲーションを作る
└── MobileMenuへpropsで渡す
    └── map()でモバイル用ナビゲーションを作る
```

```text
Header
├── isMenuOpen
├── toggleMenu()
├── closeMenu()
├── MenuButton
└── MobileMenu
    ├── isOpenを受け取る
    ├── linksを受け取る
    └── onCloseを受け取る
```

---

## 今日の確認

- [ ] 重複していたリンク情報を一つの配列へまとめた
- [ ] 一つの配列からPC用とスマートフォン用を生成した
- [ ] `map()`と`key`の役割を確認した
- [ ] HeaderをClient Componentにした理由を説明できる
- [ ] `useState`の現在値と更新関数を区別できる
- [ ] stateの値を画面へ表示して確認した
- [ ] stateからメニューの表示を決めた
- [ ] `toggleMenu()`と`closeMenu()`の違いを説明できる
- [ ] MobileMenuへ真偽値、配列、関数をpropsで渡した
- [ ] stateをHeaderだけが持つ理由を説明できる
- [ ] DOMを直接操作せず、stateを正として表示を作った
- [ ] まだModalの実用機能を実装していないことを確認した

## Git

```bash
git add .
git commit -m "Manage mobile navigation with state"
```


<!-- # 第7章　共通データとuseStateでメニューを作る

## 目的

PC用とスマートフォン用のナビゲーションを一つのデータから作り、`useState`でモバイルメニューの開閉を管理します。

この章では、まだ共通Modalを使いません。

```text
第7章
→ stateによって表示が変わる仕組みを理解する

第8章
→ 表示部分を実用的なModalへ置き換える
```

---

## 1. 同じ内容を二度書く問題

PC用とスマートフォン用へリンクを直接書くと、一件追加するたびに二か所を修正する必要があります。

```text
PC Navigation
├── Featured
├── Dramas
└── About

Mobile Navigation
├── Featured
├── Dramas
└── About
```

見た目やHTML構造が違うことは問題ではありません。問題は、同じリンク情報を二か所で管理することです。

---

## 2. ナビゲーションの内容を配列にする

```jsx
const navigationLinks = [
  { href: "#featured", label: "Featured" },
  { href: "#dramas", label: "Dramas" },
  { href: "#about", label: "About" },
];
```

この配列には、リンク先と表示文字だけを入れます。PC用・スマートフォン用という見た目の情報は入れません。

---

## 3. PC用ナビゲーションをmapで作る

```jsx
<nav className={styles.desktopNav} aria-label="メインナビゲーション">
  <ul>
    {navigationLinks.map((item) => (
      <li key={item.href}>
        <a href={item.href}>{item.label}</a>
      </li>
    ))}
  </ul>
</nav>
```

第6章では作品データからカードを作りました。今回はリンクデータから`li`を作っています。

```text
配列
↓
map()
↓
必要な数だけ同じ構造を作る
```

という基本は同じです。

---

## 4. HeaderをClient Componentにする

メニューボタンを押した結果を画面へ反映するため、Headerで`useState`を使います。

```jsx
"use client";

import { useState } from "react";
```

`"use client"`は、このファイルをブラウザ上の操作に対応する境界にする指定です。サイト全体がブラウザだけで作られるという意味ではありません。

次の状態を作ります。

```jsx
const [isMenuOpen, setIsMenuOpen] = useState(false);
```

```text
false → 閉じている
true  → 開いている
```

状態を変更する関数も作ります。

```jsx
const toggleMenu = () => {
  setIsMenuOpen((current) => !current);
};

const closeMenu = () => {
  setIsMenuOpen(false);
};
```

```text
toggleMenu()
→ 現在の状態を反転する

closeMenu()
→ 必ず閉じる
```

---

## 5. MobileMenuを作る

```text
src/components/layout/MobileMenu/
├── index.jsx
└── MobileMenu.module.scss
```

```jsx
// src/components/layout/MobileMenu/index.jsx
import styles from "./MobileMenu.module.scss";

export default function MobileMenu({ isOpen, links, onClose }) {
  return (
    <div
      id="mobile-navigation"
      className={styles.menu}
      hidden={!isOpen}
    >
      <nav aria-label="モバイルナビゲーション">
        <ul className={styles.list}>
          {links.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={onClose}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
```

`MobileMenu`はstateを持ちません。

```text
isOpen
→ 表示するか

links
→ 何を表示するか

onClose
→ 閉じるとき何を呼ぶか
```

をHeaderからpropsで受け取ります。

```scss
// src/components/layout/MobileMenu/MobileMenu.module.scss
@use "@/styles/shared" as shared;

.menu {
  padding: 32px shared.$side-space;
  background: shared.$color-background;

  &[hidden] {
    display: none;
  }
}

.list {
  display: grid;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}
```

---

## 6. Header全体

```jsx
// src/components/layout/Header/index.jsx
"use client";

import { useState } from "react";

import MobileMenu from "@/components/layout/MobileMenu";
import styles from "./Header.module.scss";

const navigationLinks = [
  { href: "#featured", label: "Featured" },
  { href: "#dramas", label: "Dramas" },
  { href: "#about", label: "About" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((current) => !current);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a
          href="#featured"
          className={styles.logo}
          aria-label="Drama Archive トップへ"
        >
          <img src="/pict/logo.svg" alt="" />
        </a>

        <nav
          className={styles.desktopNav}
          aria-label="メインナビゲーション"
        >
          <ul>
            {navigationLinks.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          Menu
        </button>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        links={navigationLinks}
        onClose={closeMenu}
      />
    </header>
  );
}
```

`aria-expanded`は開閉を実行する属性ではありません。現在の状態を支援技術へ伝える属性です。

HeaderのCSS Moduleでは、PC用ナビゲーションとメニューボタンの表示を画面幅で切り替えます。

```scss
// src/components/layout/Header/Header.module.scssへ追加
// 先頭の @use "@/styles/shared" as shared; は第4章で追加済みです。

.logo {
  display: block;
  width: 180px;
}

.desktopNav {
  display: none;
}

.menuButton {
  min-width: 44px;
  min-height: 44px;
}

@include shared.mq(md) {
  .desktopNav {
    display: block;
  }

  .menuButton {
    display: none;
  }
}
```

第4章ですでに同じセレクタを移している場合は重複して追加せず、既存の指定をこの方針へ合わせます。

---

## 7. stateを正として考える

静的JavaScriptでは、DOMのクラスを直接追加・削除することがあります。

```js
element.classList.toggle("is-open");
```

Reactでは、現在の状態を先に値として持ちます。

```text
ボタンを押す
↓
isMenuOpenが変わる
↓
Reactが新しいstateを見る
↓
MobileMenuのhiddenが変わる
```

DOMを見て現在の状態を判断するのではなく、**stateを正として表示を作る**ことが、この章の中心です。

---

## 8. 同じデータと同じ構造は別の話

PC用とスマートフォン用には、それぞれ`map()`があります。これは問題ありません。

```text
共通にするもの
→ href、label

別にするもの
→ HTML構造、スタイル、開閉動作
```

すべてを一つにまとめることが共通化ではありません。

**同じものは一つにし、違うものは分ける。**

その境界を考えることが重要です。

Header以外でも同じリンクを使うようになったら、`navigationLinks`を`src/data/navigation.js`へ移すことを検討します。今はHeaderだけで使うため、同じファイル内で構いません。

---

## 9. 確認する

配列へ次の項目を一件追加します。

```jsx
{ href: "#contact", label: "Contact" }
```

PC用とスマートフォン用の両方へ反映されることを確認します。

さらに、次も確認してください。

- ボタンを押すと開閉する
- `aria-expanded`が`true`と`false`に変わる
- モバイルメニューのリンクを押すと閉じる
- PC用ナビゲーションは影響を受けない

この段階では、Escapeキー、背景クリック、フォーカス移動、スクロール停止はまだありません。次章で共通Modalとして追加します。

---

## 今日の確認

- [ ] 一つの配列からPC用とスマートフォン用を生成した
- [ ] HeaderをClient Componentにした理由を説明できる
- [ ] `useState`の現在値と更新関数を区別できる
- [ ] stateから表示を決めた
- [ ] MobileMenuへデータと関数をpropsで渡した
- [ ] データと表示構造を分けて考えられる
- [ ] まだModalの機能を実装していないことを確認した

## Git

```bash
git add .
git commit -m "Manage mobile navigation with state"
``` -->


