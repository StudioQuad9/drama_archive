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
なぜなら、コンポーネントの中はStateが変わるたびにHeaderコンポーネントは再実行される。
その度に、配列を読み込み直す必要がないからです。

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

ここからは、スマホ表示で右上端にある、モーダル開閉ボタンを押した結果によって表示を変えることをやっていきます。

Headerファイルの先頭へ`"use client"`を追加してください。

そして、Reactから`useState`を読み込みます。

```jsx
"use client";

import { useState } from "react";
import Image from "next/image";

import styles from "./Header.module.scss";
```

この`"use client"` とは？　なぜ要るのか？

これから実装していくコードの流れで説明します。

```
ブラウザ
→「ボタンがクリックされた」とReactへ知らせる

React
→ onClick属性へ渡されたtoggleMenu関数を実行する

toggleMenu
→ setIsMenuOpen()関数を実行する

React
→ stateの真偽値を切り替える
```

`JavaScript`は、ブラウザが提供する`Web API`を利用できます。`React`も`JavaScript`によって作られているため、**ブラウザのイベント機能を利用**できます。

この場合、`ブラウザ`がクリックを検知すると、`React`がその`クリックイベント`受け取って、`onClick属性`へ渡された**関数を実行**することができるのです。

`React`はクリックされたときに`toggleMenu関数`を呼び出し、

`setIsMenuOpen()関数`によって`state`の真偽値を変更します。

この一連の処理は画面を表示したあとのブラウザ上で行われるため、`Headerコンポーネント`を**Client Component**として**宣言する必要**があります。

これまでそんな宣言が必要なかったのは、
開発環境で動かせていたからです。

つまり、現在は、ローカルで開発しているPCがサーバーなわけです。

```
$ npm run dev

> drama_archive@0.1.0 dev
> next dev
▲ Next.js 16.3.5 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.100.55:3000
✓ Ready in 318ms
✓ Running next.config.mjs took 10ms
```

今回は、`GitHub Pages`へ静的ファイルをデプロイしてWEBページを公開しますが、<br />
通常は、開発したアプリを`Vercel`や`AWS`など`Next.js`の実行環境があるホスティングサービスにデプロイしてWEBページを公開します。

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
<button>
  現在の状態：
  {isMenuOpen ? "開いている" : "閉じている"}
</button>
```

最初に「現在の状態：閉じている」と表示されることを確認してください。

---

## 7. ボタンでstateを変更する

クリックしたら『閉じている』『開いている』が切り替わるボタンを作ります。

`State`を定義した式の下に、ボタンをクリックしたら『閉じている』『開いている』を切り替える関数を`toggleMenu`とし、値は無名関数を定義します。

`toggleMenu`関数が呼び出されると、更新用関数の引数に設置したコールバック関数が発動します。

`prev`とは、Reactで慣習的な呼び名です。`previous value` 『直前の状態の値』という意味です。

で、ここも不思議なんですが、更新用関数に設定するコールバック関数の引数には、State（状態）が変わる直前の値が入ることになっています。

今は、デフォルトで設定した`false`が引数に入る。

戻り値には、`false`の`！`否定なので、`true`が返ってくるという仕組みです。

これは、状態を切り替える（トグルする）際に慣用的に使われるコードです。

```jsx
const handleToggleMenu = () => {
  setIsMenuOpen((prev) => !prev);
};
```

では先ほどのボタンに`handleToggleMenu`関数を仕込んでみます。

ブラウザがクリックを検知すると、`React`は`handleToggleMenu`関数を呼び出し（発火するイメージ）
、そして、関数を実行します。実行する中身は`State`（状態）を更新する関数を実行します。


```jsx
<button
  onClick={handleToggleMenu}
>
  現在の状況: {isMenuOpen ? "開いている" : "閉じている"}
</button>
```

では、このボタンは削除して、本来のボタンに設置します。

```jsx
<button 
  type="button"
  className={styles.menuButton}
  onClick={handleToggleMenu}
>
  <span className="material-symbols-outlined">
    { isMenuOpen ? "close" : "open" }
  </span>
</button>
```

ここで留意すべき点は、

```jsx
onClick={toggleMenu}
```

`onClick`属性の値は、クリックされたときに呼び出す関数を渡すことで、`React`は定義した関数を実行します。

```jsx
onClick={toggleMenu()}
```

こちらは表示処理中に関数を実行してしまうため想定した動作をしないということです。

ちなみに、`button`要素に属性を追加しています。

`aria-expanded`は、メニューが現在開いているか閉じているかをスクリーンリーダーへ伝えます。`aria-controls`は、このボタンがどの要素を操作するのかを、対象のidによって伝えます。

`mobile-navigation`は、このあと設定するnav要素のidとします。

では、ボタンを押すたびに、表示が切り替わることを確認します。

---

## 8. 旧HTMLの開閉方法をReact用に変更する

旧HTML版では、スマートフォン用メニューを次の二つのクラスで開閉していました。

```scss
.menu {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-30px);
}

.menu.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
```

JavaScriptから`active`クラスを追加・削除することで、表示状態を変更していました。

```text
.menu
→ 閉じている

.menu.active
→ 開いている
```

React版では、この`active`クラスを使いません。

今回は、`isMenuOpen`の値から`hidden`属性コントロールします。

```jsx
<nav
  id="mobile-navigation"
  className={styles.menu}
  aria-label="モバイル・ナビゲーション"
  hidden={!isMenuOpen}
>
  {/* navigationLinksから作ったul */}
</nav>
```

そのため、旧HTML版の次の指定は削除します。

```scss
.menu {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-30px);
  transition: 0.5s;
}
```

また、`_base.scss`に残っている次の`.menu.active`も使用しません。

```scss
.modal.active,
.menu.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
```

Modal用の指定は残すため、次のように分けます。

```scss
.modal.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
```

### Header.module.scssをReact版へ変更する

では、`.menu`には開いているときのレイアウトと見た目だけを書きます。

```scss
// @/components/Header/Header.module.scss

@use "@/styles/shared" as *;

.navigation {
  align-items: center;
}

.menuButton {
  margin-left: auto;
  font-size: 32px;
  color: #000000;
  @include mq(md) {
    display: none;
  }
}

.menu {
  display: grid;
  position: fixed;
  inset: 60px 0 0;
  place-items: center;
  background: rgb(var(--modal-color) / 0.8);
  z-index: 1000;
  &[hidden] {
    display: none;
  }
  @include mq(md) {
    display: none;
  }
  & > ul {
    flex-direction: column;
    text-align: center;
  }
  & li {
    margin-top: 30px;
    padding: 10px;
    font-size: 1.5rem;
  }
  & a {
    color: #ffffff;
  }
}

.pcMenu {
  display: none;
  @include mq(md) {
    display: block;
    margin-left: auto;
  }
  & > ul {
    align-items: center;
  }
  & li {
    padding: 10px;
    font-size: 1.1rem;
  }
  & a:hover {
    background: rgb(var(--accent));
  }
}
```

今回の役割分担は、次のとおりです。

```text
isMenuOpen
→ 現在開いているかを持つ

hidden
→ 表示するか、隠すかを決める

SCSS
→ 表示されたメニューの位置や色を決める
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

動作全体は次のようになります。

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

旧HTML版のように、JavaScriptからDOMのクラスを直接追加・削除しているのではありません。

**stateを変更し、そのstateから表示を決めています。**

この章では、まず開閉の仕組みを理解することを優先するため、メニューの開閉アニメーションは付けません。

`hidden`を使うと表示と非表示が即座に切り替わります。アニメーションを付ける場合は、後から`data-state`や開閉用クラスを使う方法を別に検討します。

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

実際の表示は`isMenuOpen`から決まり、`aria-expanded`は同じ状態を支援技術（スクリーンリーダー）へ伝えます。

ブラウザの開発者ツールで、ボタンを押すたびに`aria-expanded`が`false`と`true`へ変わることを確認してください。

---

## 10. 必ず閉じる関数を作る

メニューボタンには、現在の状態を反転する`toggleMenu()`を使用しました。

メニューボタンをクリックしてモバイル・メニューが展開し、メニュー内のリンクを押した時や、展開しているモバイル・メニューを閉じたい場合に効かせる別の関数を作ります。

```jsx
const closeMenu = () => {
  setIsMenuOpen(false);
};
```

モバイルナビゲーションのリンクへ渡します。

```jsx
<nav className={styles.menu}>
  <ul className="flex">
    {
      navigationLinks.map((link) => (
        <li key={link.href}>
          <a 
            href={link.href}
            onClick={closeMenu}
          >
            {link.label}
          </a>
        </li>
      ))
    }
  </ul>
</nav>
```

役割の違いを確認します。

```text
toggleMenu()
→ 現在の状態を反転する

closeMenu()
→ 現在の状態に関係なくfalseにする
```

開閉のボタンをクリックすると、『OPEN』から『CLOSE』になります。

メニューのリンクを押して表示が『OPEN』に切り替わることを確認してください。

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
```

この章では、`MobileMenu.module.scss`を事前に用意しています。SCSSの作り直しは行いません。

Headerから呼び出します。

```jsx
import MobileMenu from "@/components/MobileMenu";
```

`MobileMenu`コンポーネントで必要な`props`を渡します。

```jsx
<MobileMenu
  isOpen={isMenuOpen}
  links={navigationLinks}
  onClose={closeMenu}
/>
```

`MobileMenu`コンポーネントは三種類のpropsを受け取ります。

```text
isOpen
→ 『真偽値』表示するかを決める

links
→ 『配列』表示するリンクを決める

onClose
→ 『関数』リンクを押したときに呼び出す
```

`MobileMenu`は自分で`State`を持ちません。

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

関数そのものは、`Header`から`MobileMenu`へ`props`として渡されています。

子の`MobileMenu`は、その関数を実行することで、親の`Header`へ「メニューを閉じてほしい」と依頼できます。

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
