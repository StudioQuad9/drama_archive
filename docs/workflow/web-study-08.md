# 第8章　再利用できるModalを作る

## 目的

第7章で作成したモバイルメニューを、共通のModalコンポーネントへ入れます。

完成するModalは、次の機能を持ちます。

- `isOpen`の真偽値によって表示・非表示を切り替える
- 目に見える閉じるボタンを持つ
- 背景をクリックすると閉じる
- Modal内部をクリックしても閉じない
- Escapeキーで閉じる
- 開いている間は背景スクロールを止める
- `role="dialog"`と`aria-modal="true"`を持つ
- 中身を`children`で入れ替えられる
- Portalを使って`body`直下へ表示する

この章では、まずHeader、Modal、MobileMenuの役割を分けます。

そのあと、`createPortal`と`useEffect`を使い、Modalの表示場所、背景スクロール、Escapeキーの操作を追加します。

---

## 1. Header、Modal、MobileMenuの役割を分ける

第7章では、Headerがメニューの状態を管理していました。

```jsx
const [isMenuOpen, setIsMenuOpen] = useState(false);
```

`isMenuOpen`には、次のどちらかが入ります。

```text
false
→ メニューが閉じている

true
→ メニューが開いている
```

ボタンを押すと、`handleToggleMenu()`によって値が反転します。

```jsx
const handleToggleMenu = () => {
  setIsMenuOpen((prev) => !prev);
};
```

必ず閉じたい場合は、`handleCloseMenu()`を使います。

```jsx
const handleCloseMenu = () => {
  setIsMenuOpen(false);
};
```

この状態管理は、引き続きHeaderが担当します。

```text
Header
├── isMenuOpenで現在の状態を持つ
├── ボタンを押したら状態を反転する
└── メニューを必ず閉じる関数を持つ
```

Modalは、表示と閉じるための共通機能を担当します。

```text
Modal
├── isOpenを受け取る
├── 表示・非表示を切り替える
├── 画面全体を覆う
├── 閉じるボタンを表示する
├── 背景クリックとEscapeキーを扱う
└── childrenを表示する
```

MobileMenuは、ナビゲーションの内容だけを担当します。

```text
MobileMenu
├── navでナビゲーションであることを伝える
├── linksを受け取る
├── map()でリンクを表示する
└── リンクが押されたらonCloseを実行する
```

---

## 2. Modalは真偽値を受け取って表示を決める

HeaderからModalへ、`isMenuOpen`を渡します。

```jsx
<Modal
  isOpen={isMenuOpen}
  onClose={handleCloseMenu}
>
  表示したい中身
</Modal>
```

`isOpen`は、Modalコンポーネントで付けたpropsの名前です。

```text
HeaderのisMenuOpen
↓
ModalのisOpenへ渡される
```

Modalでは、受け取った`isOpen`を確認します。

```jsx
if (isOpen === false) return null;
```

```text
isOpenがfalse
↓
isOpen === falseはtrue
↓
return null
↓
何も表示しない
```

```text
isOpenがtrue
↓
isOpen === falseはfalse
↓
return nullを実行しない
↓
その下のJSXを表示する
```

つまり、Modalは受け取った真偽値によって、要素を点けたり消したりしています。

`isOpen`という名前自体に、Modalを開く特別な機能があるわけではありません。

次の判定を自分で書くことで、表示が切り替わります。

```jsx
if (isOpen === false) return null;
```

---

## 3. MobileMenuから表示管理を外す

第7章のMobileMenuは、`hidden`を使って表示と非表示を切り替えていました。

```jsx
<nav
  id="mobile-navigation"
  className={styles.mobileMenu}
  aria-label="モバイルナビゲーション"
  hidden={!isOpen}
>
```

今回は、表示・非表示をModalが担当します。

そのため、MobileMenuから次の指定を削除します。

```jsx
hidden={!isOpen}
```

MobileMenuは表示状態を管理しなくなるため、`isOpen`も受け取りません。

ただし、`nav`要素は残します。

`nav`には、スクリーンリーダーなどへ「これはナビゲーションです」と伝える役割があるためです。

```text
表示・非表示を切り替える
画面全体を覆う
閉じるボタンを表示する
→ Modalへ移す

ナビゲーションであることを伝える
リンクを表示する
→ MobileMenuに残す
```

---

## 4. Modalの中へMobileMenuを入れる

Header側を次の形へ変更します。

```jsx
<Modal
  isOpen={isMenuOpen}
  onClose={handleCloseMenu}
  ariaLabel="モバイルメニュー"
>
  <MobileMenu
    onClose={handleCloseMenu}
    links={navigationLinks}
  />
</Modal>
```

HeaderからModalへ、propsとして三つの情報を渡しています。

```text
isOpen
→ Modalを表示するかどうか

onClose
→ Modalを閉じるときに実行する関数

ariaLabel
→ Modalが何のための画面なのかを示す名前
```

処理の流れは次のとおりです。

```text
HeaderがisMenuOpenを持つ
↓
isOpenという名前でModalへ渡す
↓
Modalがtrueかfalseかを確認する
↓
trueならMobileMenuを含むModalを表示する
↓
falseならnullを返して何も表示しない
```

Modal自身は、モバイルメニューの状態を直接管理しません。

```text
開閉状態を管理する
→ Header

受け取った状態に従って表示する
→ Modal
```

---

## 5. childrenで中身を入れ替える

Modalの開始タグと終了タグの間には、MobileMenuが書かれています。

```jsx
<Modal>
  <MobileMenu />
</Modal>
```

この`MobileMenu`が、Modal側の`children`へ入ります。

```jsx
export default function Modal({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}
```

実際には、次のような構造として表示されます。

```jsx
<div className={styles.modal}>
  <nav>
    <ul>
      <li>...</li>
    </ul>
  </nav>

  <button>閉じる</button>
</div>
```

Modalの中身は、MobileMenuに固定されていません。

将来は、同じModalへ作品詳細を渡すこともできます。

```jsx
<Modal>
  <DramaDetail />
</Modal>
```

別のフォームも渡せます。

```jsx
<Modal>
  <ContactForm />
</Modal>
```

役割を整理します。

```text
isOpen
→ 外部から開閉状態を受け取れる

onClose
→ 外部から閉じる処理を受け取れる

children
→ Modalの中身を用途に応じて入れ替えられる
```

この三つを外部から受け取ることで、ModalはMobileMenu専用ではなく、**どのコンポーネントからも再利用できるModalになります。**

---

## 6. Modalのファイルを作る

次のファイルを作ります。

```text
src/
└── components/
    └── ui/
        └── Modal/
            ├── index.jsx
            └── Modal.module.scss
```

まずは、最小構造を作ります。

```jsx
export default function Modal({
  isOpen,
  onClose,
  ariaLabel,
  children,
}) {
  if (isOpen === false) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      {children}

      <button
        type="button"
        onClick={onClose}
      >
        閉じる
      </button>
    </div>
  );
}
```

`role="dialog"`は、この領域がダイアログであることを支援技術へ伝えます。

`aria-modal="true"`は、現在操作する対象がこのModalであることを伝えます。

`ariaLabel`はModalコンポーネントへ渡すpropsの名前です。

Modal側で、HTMLの`aria-label`へ渡します。

```text
HeaderのariaLabel
↓
Modalがpropsとして受け取る
↓
HTMLのaria-labelへ渡す
```

---

## 7. スタイルの役割を移す

これまでMobileMenuが持っていた、画面全体を覆うスタイルをModalへ移します。

```text
position: fixed
画面全体を覆う指定
背景色
重なり順
中央配置
```

```scss
.modal {
  display: grid;
  place-content: center;
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(
    $color: $color-black,
    $alpha: .9
  );
}
```

`inset: 0`は、上下左右をすべて`0`にします。

```text
top: 0
right: 0
bottom: 0
left: 0
```

MobileMenuは、ナビゲーション内容のスタイルだけを担当します。

Modalが中央配置を担当するため、MobileMenuへ`height: 100%`や`height: 100vh`は指定しません。

MobileMenuが画面全体を覆うと、背景に見える場所までMobileMenuになり、あとで実装する背景クリックを判定できなくなるためです。

旧HTMLで使用していた、JavaScriptによるクラスの付け外しは使いません。

```scss
.modal.active
```

今回はReactの真偽値によって、要素そのものを表示・非表示にします。

---

## 8. MobileMenuのリンクからModalを閉じる

MobileMenuは、Headerで定義した`handleCloseMenu`を、`onClose`という名前で受け取ります。

```jsx
<MobileMenu
  onClose={handleCloseMenu}
  links={navigationLinks}
/>
```

リンクを押したときに、受け取った`onClose`を実行します。

```jsx
<a
  href={link.href}
  onClick={onClose}
>
  {link.label}
</a>
```

```text
href
→ 移動先を示す

onClick
→ リンクを選択したあとにModalを閉じる
```

MobileMenu自身が、Headerのstateを直接変更しているわけではありません。

```text
リンクを押す
↓
onCloseを実行する
↓
HeaderのhandleCloseMenuが実行される
↓
isMenuOpenがfalseになる
↓
ModalのisOpenもfalseになる
↓
Modalがnullを返す
↓
Modalが消える
```

---

## 9. 背景クリックと内部クリックを区別する

Modalの背景へ`onClick={onClose}`だけを書くと、Modal内部をクリックしたイベントも背景まで伝わり、Modalが閉じます。

そこで、実際にクリックされた要素を確認します。

```jsx
const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    onClose();
  }
};
```

```text
event.target
→ 実際にクリックされた要素

event.currentTarget
→ onClickを書いたModalの背景要素
```

両方が同じ場合だけ、背景そのものがクリックされたと判断します。

```jsx
<div
  className={styles.modal}
  onClick={handleBackdropClick}
>
```

```text
背景そのものをクリック
→ 閉じる

リンクやボタンをクリック
→ 背景クリックではないため閉じない
```

MobileMenuのリンクには別途`onClick={onClose}`があるため、リンクを選択した場合はModalが閉じます。

---

## 10. Portalでbody直下へ表示する

ModalはHeaderから呼び出しています。

そのまま表示すると、実際のDOMでもModalはHeaderの中に作られます。

Headerやその親要素に`overflow`や`transform`などが指定されると、Modalが途中で切れたり、重なり順の影響を受けたりする可能性があります。

そこで、`createPortal()`を使います。

```jsx
import { createPortal } from "react-dom";
```

Modalが返すJSXを、`createPortal()`の第1引数へ入れます。

第2引数には、実際のDOMを表示する場所を指定します。

```jsx
return createPortal(
  <div>
    {/* Modalの内容 */}
  </div>,
  document.body,
);
```

```text
第1引数
→ body直下へ表示するJSX

第2引数
→ JSXを表示する場所
```

`children`を含むModal全体が、まとめて`body`直下へ表示されます。

```text
React上

Header
└── Modal
    └── MobileMenu
```

```text
実際のDOM

body
├── Header
├── main
└── Modal
    └── MobileMenu
```

React上の親子関係は変わらないため、`isOpen`、`onClose`、`children`はこれまでどおり使用できます。

変わるのは、ブラウザ上でModalのDOMが置かれる場所だけです。

この教材では、`isOpen`の初期値が`false`です。

最初の表示では`return null`によって処理が終了し、ブラウザでメニューボタンを押したあとに`createPortal()`まで進みます。

そのため、この実装では表示準備を管理するための追加stateは作りません。

---

## 11. useEffectの役割

`useEffect`は、Reactのstateやpropsが変化して表示処理が行われたあとに、Reactの外側にある仕組みを操作するときに使います。

Reactの外側にある仕組みには、次のようなものがあります。

```text
ブラウザの機能
→ スクロール、キーボード、ページタイトル

時間に関する処理
→ setTimeout、setInterval

外部データ
→ APIからのデータ取得

外部の仕組み
→ ライブラリ、通信、購読処理
```

APIからデータを取得する非同期処理でもよく使われますが、`useEffect`自体が非同期処理を行う機能というわけではありません。

`useEffect`の主な役割は、**Reactの状態と、Reactの外側にある仕組みの状態を合わせること**です。

今回同期させるのは、次の状態です。

```text
Reactが持っている状態
→ isOpen

ブラウザ側の状態
→ bodyのスクロール
→ Escapeキーの監視
```

```text
isOpenがtrueになった
↓
bodyのスクロールを止める
Escapeキーの監視を始める

isOpenがfalseになった
↓
bodyのスクロールを元へ戻す
Escapeキーの監視を解除する
```

---

## 12. 依存配列でEffectが反応する値を指定する

`useEffect`の最後に書く配列を、依存配列と呼びます。

```jsx
useEffect(() => {
  console.log("現在のisOpen:", isOpen);
}, [isOpen]);
```

`[isOpen]`と書くと、最初の表示時と、`isOpen`が変わったときにEffectが実行されます。

```text
依存配列を書かない
→ コンポーネントが再表示されるたびに実行する

[]
→ コンポーネントが最初に呼ばれたときに実行する

[isOpen]
→ 最初の表示時とisOpenが変わったときに実行する
```

Modalは画面に見えていないときも、HeaderのJSXに書かれているため、すでに呼ばれています。

```jsx
<Modal
  isOpen={isMenuOpen}
  onClose={handleCloseMenu}
>
  <MobileMenu />
</Modal>
```

`isOpen`が`false`の場合は、Modalコンポーネントが呼ばれたあとに`null`を返しているため、画面に見えていないだけです。

依存配列を空にすると、ページを最初に表示したときにEffectが一度実行され、その後Modalを開いても実行されません。

Modalの開閉へ反応させるため、依存配列へ`isOpen`を入れます。

```jsx
useEffect(() => {
  if (isOpen === false) return;

  console.log("Modalが開いた");
}, [isOpen]);
```

```text
isOpenがfalse
→ そこで処理を終了する

isOpenがtrue
→ Modalを開いたときの処理へ進む
```

これはクリックそのものを監視しているのではありません。

```text
ボタン、背景、Escapeキーなどを操作する
↓
isOpenが変わる
↓
useEffectがisOpenの変化に反応する
```

クリック時に一つの処理を実行するだけなら、`onClick`にも書けます。

今回は操作方法ではなく、Modalの開閉状態を基準にブラウザ機能をまとめて設定・解除するため、`useEffect`を使います。

---

## 13. cleanupで設定を元へ戻す

Effectでイベント監視やブラウザの設定を追加した場合は、不要になったときに元へ戻します。

Effectの`return`から返す関数を、cleanup関数と呼びます。

```jsx
useEffect(() => {
  if (isOpen === false) return;

  // Modalが開いたときの設定

  return () => {
    // 設定したものを元へ戻す
  };
}, [isOpen]);
```

JSXを表示するための`return`とは役割が違います。

```jsx
return (
  <div>...</div>
);
```

こちらは、コンポーネントが画面へ表示するJSXを返します。

Effect内の`return`は、Effectで行った設定を片付ける関数を返します。

```jsx
return () => {
  // 後始末
};
```

cleanup関数は、主に次のタイミングで実行されます。

```text
依存する値が変わり、Effectをやり直す前

または

コンポーネントが不要になったとき
```

---

## 14. 背景スクロールを止める

Modalを開いている間だけ、背景スクロールを止めます。

```jsx
useEffect(() => {
  if (isOpen === false) return;

  const previousOverflow =
    document.body.style.overflow;

  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow =
      previousOverflow;
  };
}, [isOpen]);
```

最初に、現在の`body`へ直接指定されている`overflow`の値を保存します。

```jsx
const previousOverflow =
  document.body.style.overflow;
```

`document.body.style.overflow`が取得するのは、`body`の`style`属性へ直接書かれた値です。

現在の`body`には`overflow`を直接指定していないため、値は空文字です。

```jsx
console.log(
  JSON.stringify(document.body.style.overflow)
);
```

```text
""
```

これは、ブラウザに`overflow`の設定が存在しないという意味ではありません。

JavaScriptから直接指定した値がないため、CSS本来の動作によって通常どおりスクロールできます。

Modalを開いたとき、`hidden`を指定します。

```jsx
document.body.style.overflow = "hidden";
```

```text
bodyにoverflow: hiddenが付く
↓
背景をスクロールできなくなる
```

Modalを閉じると、cleanup関数が実行されます。

```jsx
document.body.style.overflow = previousOverflow;
```

今回の`previousOverflow`には空文字が保存されています。

空文字を戻すことで、JavaScriptが追加した`overflow: hidden`が取り除かれ、元どおりスクロールできるようになります。

`visible`を直接指定しない理由は、元の値が必ず`visible`とは限らないためです。

```text
元の値を保存する
↓
一時的にhiddenへ変更する
↓
cleanupで保存していた値へ戻す
```

この方法なら、Modalを使用するページのCSS設定を壊しません。

---

## 15. Escapeキーで閉じる

Modalを開いている間だけ、キーボード操作を監視します。

```jsx
const handleKeyDown = (event) => {
  if (event.key === "Escape") {
    onClose();
  }
};
```

`onClose`には真偽値ではなく、Headerから渡された関数が入っています。

```text
onClose
→ HeaderのhandleCloseMenu関数
```

Escapeキーを押すと、`onClose()`を実行します。

```text
Escapeキーを押す
↓
onCloseを実行する
↓
HeaderのhandleCloseMenuが実行される
↓
isMenuOpenがfalseになる
↓
Modalが閉じる
```

監視を開始します。

```jsx
document.addEventListener(
  "keydown",
  handleKeyDown
);
```

cleanupで監視を解除します。

```jsx
document.removeEventListener(
  "keydown",
  handleKeyDown
);
```

背景スクロールとキーボード監視を一つのEffectへまとめます。

```jsx
useEffect(() => {
  if (isOpen === false) return;

  const previousOverflow =
    document.body.style.overflow;

  document.body.style.overflow = "hidden";

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  document.addEventListener(
    "keydown",
    handleKeyDown
  );

  return () => {
    document.body.style.overflow =
      previousOverflow;

    document.removeEventListener(
      "keydown",
      handleKeyDown
    );
  };
}, [isOpen, onClose]);
```

依存配列には、Effect内で使用している`isOpen`と`onClose`を入れます。

なお、`useEffect`は早期returnより前に書きます。

```jsx
export default function Modal({ isOpen }) {
  useEffect(() => {
    if (isOpen === false) return;
  }, [isOpen]);

  if (isOpen === false) return null;

  return (
    <div>Modal</div>
  );
}
```

`useState`、`useEffect`などのReact Hooksは、コンポーネントが呼ばれるたびに、必ず同じ順番で呼び出す必要があるためです。

---

## 16. ここまでのコードまとめ

### Header

```jsx
// src/components/Header/index.jsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

import MobileMenu from "@/components/MobileMenu";
import Modal from "@/components/ui/Modal";
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
            src="/pict/logo.svg"
            alt="Drama Archive"
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
          aria-label={
            isMenuOpen
              ? "メニューを閉じる"
              : "メニューを開く"
          }
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
          ariaLabel="モバイルメニュー"
        >
          <MobileMenu
            links={navigationLinks}
            onClose={handleCloseMenu}
          />
        </Modal>

        <nav
          className={styles.pcMenu}
          aria-label="グローバルナビゲーション"
        >
          <ul className="flex">
            {
              navigationLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))
            }
          </ul>
        </nav>
      </div>
    </div>
  );
}
```

### Modal

```jsx
// src/components/ui/Modal/index.jsx

"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import styles from "./Modal.module.scss";

export default function Modal({
  isOpen,
  onClose,
  ariaLabel,
  children,
}) {
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

  if (isOpen === false) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={styles.modal}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={handleBackdropClick}
    >
      {children}

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
    </div>,
    document.body,
  );
}
```

### ModalのSCSS

```scss
// src/components/ui/Modal/Modal.module.scss

@use "@/styles/shared" as *;

.modal {
  display: grid;
  place-content: center;
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(
    $color: $color-black,
    $alpha: .9
  );

  & > .modalBtn {
    display: grid;
    place-content: center;
    position: absolute;
    top: 15px;
    right: 18px;
    font-size: .7rem;
    color: $color-white;

    & > .cross {
      margin: 0 auto;
    }
  }
}
```

### MobileMenu

```jsx
// src/components/MobileMenu/index.jsx

import styles from "./MobileMenu.module.scss";

export default function MobileMenu({
  links,
  onClose,
}) {
  return (
    <nav
      id="mobile-navigation"
      aria-label="モバイルナビゲーション"
    >
      <ul className={styles.list}>
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

### MobileMenuのSCSS

```scss
// src/components/MobileMenu/MobileMenu.module.scss

@use "@/styles/shared" as *;

.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;

  & > li {
    padding: 30px;
    font-size: 1.5rem;

    & > a {
      color: $color-white;
    }
  }
}
```

次の順番で確認します。

1. メニューボタンを押すとModalが表示される
2. 開いている間、背景をスクロールできない
3. Modal内部をクリックしても閉じない
4. 背景をクリックすると閉じる
5. Escapeキーを押すと閉じる
6. CLOSEボタンを押すと閉じる
7. MobileMenuのリンクを選ぶと閉じる
8. PC幅ではメニューボタンが表示されない

---

## 17. 開閉アニメーションを追加する

ここまでで、再利用できるModalの構造と機能は完成しました。

現在のModalには、次の機能があります。

```text
isOpenによる開閉
childrenによる中身の変更
Portalによるbody直下への表示
背景クリックで閉じる
Escapeキーで閉じる
背景スクロールを止める
```

最後に、スタイルを使ってModalが上から降りてくるアニメーションを追加します。

まずは現在ある`state` の `isOpen`だけで実装できないか試します。

---

### isOpenをスタイルへ接続する

Headerは、Modalの開閉状態を`isMenuOpen`で管理しています。

```jsx
const [isMenuOpen, setIsMenuOpen] =
  useState(false);
```

その値を、`isOpen`というprops名でModalへ渡しています。

```jsx
<Modal
  isOpen={isMenuOpen}
  onClose={handleCloseMenu}
>
```

したがって、Modal側の`isOpen`には、次のどちらかが入ります。

```text
false
→ Modalは閉じている

true
→ Modalは開いている
```

この値を使えば、クラスも切り替えられます。

Modalの`className`を変更します。

```jsx
<div
  className={`
    ${styles.modal} 
    ${isOpen ? styles.isOpen : styles.isClosed}
  `}
  role="dialog"
  aria-modal="true"
  aria-label={ariaLabel}
  onClick={handleBackdropClick}
>
```

```text
isOpenがfalse
→ styles.isOpenを付けない

isOpenがtrue
→ styles.isOpenを付ける
```

開閉状態を管理するstateを、新しく追加する必要はありません。

```text
isMenuOpen
↓
ModalのisOpenへ渡す
↓
isOpenからクラスを決める
↓
SCSSの表示を変える
```

一つの開閉状態を、表示とスタイルの両方に使用しています。

---

### まず、開くアニメーションを作る

`.modal`へ、アニメーションを始める位置を書きます。

```scss
// 条件付きレンダリング型
&.isOpen {
  pointer-events: auto;
  animation: modal-open .5s ease forwards;
}
&.isClosed {
  pointer-events: none;
  animation: modal-close .5s ease forwards;
} 
```

アニメーションの終了位置を追加します。

```scss
@keyframes modal-open {
  from {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-50%);
  }
  to {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

@keyframes modal-close {
  from {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-50%);
  }
}
```

処理の流れは次のとおりです。

```text
メニューボタンを押す
↓
isMenuOpenがtrueになる
↓
ModalのisOpenもtrueになる
↓
styles.isOpenが付く
↓
modal-openが実行される
↓
Modalが上から降りてくる
```

実際にメニューボタンを押し、Modalが上から滑らかに表示されることを確認してください。

---

### Modalを閉じて確認する

次に、CLOSEボタンを押してModalを閉じてください。

開くときは滑らかに表示されましたが、閉じるときは突然消えます。

```text
開くとき
→ 上から滑らかに表示される

閉じるとき
→ アニメーションせず突然消える
```

`isOpen`でクラスを切り替えているのに、なぜ閉じるアニメーションは実行されないのでしょうか。

原因は、現在の次の処理です。

```jsx
if (isOpen === false) return null;
```

`isOpen`が`false`になった瞬間、Modalは`null`を返します。

```text
isOpenがfalseになる
↓
nullを返す
↓
ModalがDOMから削除される
```

`isOpen`という状態がなくなったわけではありません。

```text
isOpen
→ trueからfalseへ変わっている

ModalのDOM
→ return nullによって削除されている
```

CSSは、DOMに存在しない要素を動かせません。

そのため、閉じるスタイルへ変化する前に、Modalそのものがなくなっています。

---

### ModalをDOMへ残す必要がある

開くときと閉じるときの両方を滑らかにするには、Modalをすぐに削除しない構造が必要です。

```text
現在の構造

isOpenがfalse
↓
ModalをDOMから削除する
```

これを、次の構造へ変更します。

```text
変更後の構造

ModalはDOMへ用意しておく
↓
isOpenがtrueなら表示する
↓
isOpenがfalseならCSSで隠す
```

ここで、二つの状態を分けて考えます。

```text
isMounted
→ PortalをDOMへ用意できたか

isOpen
→ 用意したModalを見せるか隠すか
```

二つとも真偽値ですが、役割は異なります。

```text
isMounted
→ 最初の一回だけfalseからtrueになる
→ その後はtrueのまま

isOpen
→ ボタン操作によってtrueとfalseを繰り返す
```

つまり、次の二重構造になります。

```text
isMounted
→ Modalの置き場所を一度だけ準備する

isOpen
→ 準備済みのModalを何度でも開閉する
```

---

### なぜuseEffectを使うのか

`isMounted`も`useState`で管理します。

```jsx
const [isMounted, setIsMounted] =
  useState(false);
```

ただし、`useState(false)`と書いただけでは、値は自動的に`true`になりません。

どこかで更新関数を実行する必要があります。

```jsx
setIsMounted(true);
```

メニューボタンを押したときに実行することもできます。

しかし、メニューボタンが担当するのは、Modalの開閉です。

```text
メニューボタン
→ isOpenを変更する
```

一方、`isMounted`が表しているのは、ブラウザへ表示され、`document.body`を使えるようになったかどうかです。

```text
ブラウザへ表示された
→ isMountedをtrueにする
```

これはユーザーがボタンを押したかどうかとは関係ありません。

そのため、ブラウザへ表示されたあとに処理を実行できる`useEffect`から更新します。

```jsx
const [isMounted, setIsMounted] =
  useState(false);

useEffect(() => {
  // Portalでdocument.bodyを使うため、
  // ブラウザ表示後に一度だけ更新する。
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setIsMounted(true);
}, []);
```

空の依存配列`[]`を指定しているため、このEffectは最初にブラウザへ表示されたあとに一度実行されます。

```text
最初
↓
isMountedはfalse
↓
Portalをまだ作らない

ブラウザへ表示されたあと
↓
useEffectが実行される
↓
setIsMounted(true)
↓
Portalを作る
```

ここで使う`useEffect`は、Modalの開閉アニメーションを実行しているわけではありません。

```text
useEffect
→ Portalを一度だけ準備する

isOpen
→ 開閉クラスを切り替える

SCSS
→ 実際のアニメーションを行う
```

まず`isOpen`だけで実装し、閉じるアニメーションができないことを確認したため、ここで初めて`isMounted`と`useEffect`が必要な理由が分かります。

---

### 早期returnを変更する

現在の処理を削除します。

```jsx
if (isOpen === false) return null;
```

代わりに、ブラウザへの表示が終わっていない場合だけ`null`を返します。

```jsx
if (!isMounted) return null;
```

この違いを確認します。

```text
以前

isOpenがfalse
→ nullを返す
→ ModalをDOMから削除する
```

```text
変更後

isMountedがfalse
→ Portalをまだ作らない

isMountedがtrue
→ PortalをDOMへ用意する
→ 以後は削除しない
```

`isMounted`が一度`true`になったあとは、`isOpen`が`false`になってもModalはDOMに残ります。

---

### isOpenから表示クラスを決める

`isOpen`が`true`の場合だけ、`.isOpen`を追加します。

```jsx
<div
  className={`
    ${styles.modal}
    ${isOpen ? styles.isOpen : ""}
  `}
  role={isOpen ? "dialog" : undefined}
  aria-modal={isOpen ? "true" : undefined}
  aria-label={isOpen ? ariaLabel : undefined}
  aria-hidden={!isOpen}
  onClick={handleBackdropClick}
>
```

```text
isOpenがfalse
→ styles.isOpenを付けない
→ CSSで隠す

isOpenがtrue
→ styles.isOpenを付ける
→ CSSで表示する
```

ReactはModalを追加・削除しません。

Reactは`isOpen`からクラスを切り替え、CSSが表示とアニメーションを担当します。

---

### SCSSへ閉じた状態を書く

`.modal`には、閉じている状態を書きます。

```scss
.modal {
  display: grid;
  place-content: center;
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow: hidden;

  background-color: rgba(
    $color: $color-black,
    $alpha: .9
  );

  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-50%);

  transition:
    opacity .5s ease,
    visibility 0s linear .5s,
    transform .5s ease;
}
```

```text
opacity: 0
→ 透明にする

visibility: hidden
→ 非表示として扱う

pointer-events: none
→ 閉じている間は操作できない

translateY(-50%)
→ 本来の位置より少し上へ移動する
```

---

### 開いた状態を書く

`.isOpen`が付いた場合は、表示状態へ変更します。

```scss
.modal {
  // 閉じている状態

  &.isOpen {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0);

    transition:
      opacity .5s ease,
      transform .5s ease,
      visibility 0s linear 0s;
  }
}
```

最初に試した`@keyframes`は削除します。

```scss
// 削除する
@keyframes modal-open {
  ... 
  ... 
}

@keyframes modal-close {
  ...
  ...
}
```

DOMへ残した要素の値を、`transition`によって行き来させます。

```text
Modalを開く
↓
isOpenがtrueになる
↓
styles.isOpenが付く
↓
opacityが0から1へ変わる
↓
translateY(-50%)から0へ変わる
```

```text
Modalを閉じる
↓
isOpenがfalseになる
↓
styles.isOpenが外れる
↓
opacityが1から0へ変わる
↓
translateY(0)から-30pxへ変わる
```

これで、開くときと閉じるときの両方が滑らかになります。

---

### 三つの役割を整理する

今回の実装は、次の三つに役割を分けています。

```text
isMounted
→ 最初にPortalを一度だけ準備する

isOpen
→ 準備済みのModalを何度でも開閉する

SCSS
→ isOpenの変化をアニメーションとして表示する
```

また、これまで作ったもう一つのEffectは、別の役割を持っています。

```text
isOpenに反応するuseEffect
→ 背景スクロールを止める
→ Escapeキーの監視を始める
→ 閉じたら設定を元へ戻す
```

```text
開閉状態の管理
→ useState

Portalを一度だけ準備する
→ useEffectとisMounted

スクロールとEscapeキーの同期
→ useEffect

開閉アニメーション
→ isOpenによるクラス変更とSCSS
```

まず既存のstateとCSSで実装し、そこでは解決できない「閉じてもDOMを残しておく」という要件に対して、`isMounted`と`useEffect`を追加しています。

---

## 18. アニメーション対応後のModal

```jsx
// src/components/ui/Modal/index.jsx

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import styles from "./Modal.module.scss";

export default function Modal({ isOpen, onClose, ariaLabel, children }) {

  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // Portalでdocument.bodyを使うため、ブラウザ表示後に一度だけ更新する。
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // // DOM型
  // if (isOpen === false) return null;
  // state型
  // メニュー（グローバルメニューのスマートフォン版）が
  // 開いていなければ、以降の処理はせずに終了。
  if (isMounted === false) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      // // DOM型
      // className={`
      //   ${styles.modal} ${isOpen ? styles.isOpen : styles.isClosed}
      // `}
      // role="dialog"
      // aria-modal="true"
      // aria-label={ariaLabel}
      // onClick={handleBackdropClick}

      // state型
      className={`
        ${styles.modal} ${isOpen ? styles.isOpen : ""}
      `}
      role={isOpen ? "dialog" : undefined}
      aria-modal={isOpen ? "true" : undefined}
      aria-label={isOpen ? ariaLabel : undefined}
      aria-hidden={!isOpen}
      onClick={handleBackdropClick}
    >
      {/* <button
        type="button"
        style={{
          height: "100px",
          backgroundColor: "red",
        }}
      >
        閉じたくないボタン
      </button> */}

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
```

SCSSは次の形です。

```scss
// @/components/ui/Modal/Modal.module.scss

@use "@/styles/shared" as *;

.modal {
  display: grid;
  place-content: center;
  position: fixed;
  inset: 0;
  background-color: rgba($color: $color-black, $alpha: .9);
  z-index: 100;

  // // 条件付きレンダリング型
  // &.isOpen {
  //   pointer-events: auto;
  //   animation: modal-open .5s ease forwards;
  // }
  // &.isClosed {
  //   pointer-events: none;
  //   animation: modal-close .5s ease forwards;
  // }  

  // DOM常駐・クラス切り替え型
  opacity: 0;
  visibility: hidden;
  pointer-events: none;  
  transform: translateY(-50%);
  transition: opacity .5s ease,
              visibility 0s linear .5s,
              transform .5s ease;
  &.isOpen {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0);
    transition: opacity .5s ease,
                visibility 0s linear 0s,
                transform .5s ease;
  }
  & > .modalBtn {
    display: grid;
    place-content: center;
    position: absolute;
    top: 15px;
    right: 18px;
    font-size: .7rem;
    color: $color-white;
    & > .cross {
      margin: 0 auto;
    }
  }
}

// // 条件付きレンダリング型
// @keyframes modal-open {
//   from {
//     opacity: 0;
//     visibility: hidden;
//     transform: translateY(-50%);
//   }
//   to {
//     opacity: 1;
//     visibility: visible;
//     transform: translateY(0);
//   }
// }

// @keyframes modal-close {
//   from {
//     opacity: 1;
//     visibility: visible;
//     transform: translateY(0);
//   }
//   to {
//     opacity: 0;
//     visibility: hidden;
//     transform: translateY(-50%);
//   }
// }
```

---

## 今日の確認

- [ ] Modalの状態は呼び出し側が持っている
- [ ] `children`で中身を入れ替えられる
- [ ] 背景と内部のクリックを区別できる
- [ ] Portalによって`body`直下へ表示できる
- [ ] `useEffect`とcleanupの役割を説明できる
- [ ] Escapeキーと閉じるボタンで閉じられる
- [ ] 背景スクロールが止まる
- [ ] ModalのSCSSがコンポーネントと同じ場所にある

## Git

```bash
git add .
git commit -m "Build reusable modal"
```

## 補足：Lucideを使用する

今回は、外部フォントとしてMaterial Symbolsを読み込まず、SVGアイコンをReactコンポーネントとして扱えるLucideを使用します。

インストールします。

```bash
npm install lucide-react
```

コンポーネントから呼び出します。

```jsx
import { Menu, X } from "lucide-react";
```

JSX内では、通常のReactコンポーネントと同じように使用できます。

```jsx
<span aria-hidden="true">
  {
    isMenuOpen
      ? <X size={30} strokeWidth={2} />
      : <Menu size={30} strokeWidth={2} />
  }
</span>
```

厳密なフォーカス管理が必要なModalでは、開いた直後のフォーカス移動、Tabキーの移動制限、閉じたあとのフォーカス復元も必要です。

これらを自作するとコード量と難易度が大きく上がるため、この教材では扱いません。実務では、必要に応じてアクセシビリティ対応済みのDialogライブラリを利用します。
