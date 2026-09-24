# 第8章　再利用できるModalを作る

## 目的

第7章で作成したモバイルメニューを、共通のModalコンポーネントへ入れます。

完成するModalは、次の機能を持ちます。

- Escapeキーで閉じる
- 背景をクリックすると閉じる
- 内側をクリックしても閉じない
- 開いたらModal内へフォーカスを移す
- Tabキーの移動をModal内に留める
- 閉じたら元の要素へフォーカスを戻す
- 開いている間は背景スクロールを止める
- 目に見える閉じるボタンを持つ
- `role="dialog"`と`aria-modal="true"`を持つ
- 中身を`children`で入れ替えられる

この章の前半では、まずModalの構造を作ります。

後半では、`useEffect`と`useRef`を使って、キーボード操作やフォーカス管理を追加します。

一度にすべてを覚える必要はありません。それぞれの機能が何を担当しているのかを確認しながら進めます。

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
if (!isOpen) return null;
```

動きは次のとおりです。

```text
isOpenがfalse
↓
!isOpenはtrue
↓
return null
↓
何も表示しない
```

```text
isOpenがtrue
↓
!isOpenはfalse
↓
return nullを実行しない
↓
その下にあるJSXを表示する
```

つまり、Modalは受け取った真偽値によって、要素を点けたり消したりしています。

```text
true
→ Modalを表示する

false
→ Modalを表示しない
```

`isOpen`という属性自体に、Modalを開く特別な機能があるわけではありません。

Modalコンポーネントの中にある、次の判定によって表示が切り替わります。

```jsx
if (!isOpen) return null;
```

---

## 3. 各コンポーネントの担当を整理する

今回、役割を次のように分けます。

```text
Header
├── stateを持つ
├── 開く・閉じるを決める
└── Modalへ状態と関数を渡す
```

```text
Modal
├── isOpenを受け取る
├── 表示・非表示を切り替える
├── 画面全体を覆う
├── 閉じるボタンを表示する
└── childrenを表示する
```

```text
MobileMenu
├── navでナビゲーションであることを伝える
├── linksを受け取る
├── map()でリンクを表示する
└── リンクが押されたらonCloseを実行する
```

Modal自身は、開閉用の`useState`を持ちません。

Headerが持っている状態を、propsとして受け取ります。

このように、親から渡された値によって状態が制御されるコンポーネントを、controlled componentと呼びます。

---

## 4. 現在のMobileMenuから役割を分ける

第7章のMobileMenuは、次のような構造でした。

```jsx
<MobileMenu
  isOpen={isMenuOpen}
  onClose={handleCloseMenu}
  links={navigationLinks}
/>
```

MobileMenuの`nav`では、`hidden`を使って表示と非表示を切り替えていました。

```jsx
<nav
  id="mobile-navigation"
  className={styles.mobileMenu}
  aria-label="モバイル・ナビゲーション"
  hidden={!isOpen}
>
```

この状態では、MobileMenuが複数の役割を担当しています。

```text
MobileMenu
├── 表示・非表示を切り替える
├── 画面全体を覆う
├── ナビゲーションであることを伝える
└── リンクを表示する
```

今回は、この中からModalに関係する役割を分離します。

```text
表示・非表示を切り替える
画面全体を覆う
閉じるボタンを表示する
→ Modalへ移す
```

```text
ナビゲーションであることを伝える
リンクを表示する
→ MobileMenuに残す
```

そのため、MobileMenuから次の指定を削除します。

```jsx
hidden={!isOpen}
```

MobileMenuは、表示状態を管理しなくなるため、`isOpen`も受け取りません。

ただし、`nav`要素は残します。

`nav`には、スクリーンリーダーなどへ「これはナビゲーションです」と伝える役割があるためです。

---

## 5. Modalの中へMobileMenuを入れる

Header側を次の形へ変更します。

```jsx
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
  <button>閉じる</button>

  <nav>
    <ul>
      <li>...</li>
    </ul>
  </nav>
</div>
```

将来は、同じModalへ別の内容も渡せます。

```jsx
<Modal>
  <DramaDetail />
</Modal>
```

このように、`children`を使うことで、Modalの中身を用途に応じて入れ替えられます。

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

Modalの最小構造は、次の形です。

```jsx
export default function Modal({
  isOpen,
  onClose,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div>
      <button
        type="button"
        onClick={onClose}
      >
        閉じる
      </button>

      {children}
    </div>
  );
}
```

受け取っているpropsを確認します。

```text
isOpen
→ trueかfalseを受け取る
→ Modalを表示するか決める

onClose
→ Headerで定義した閉じる関数を受け取る

children
→ Modalの開始タグと終了タグの間に書かれた内容を受け取る
```

---

## 7. Modalへダイアログの情報を付ける

Modalの外側へ、次の属性を付けます。

```jsx
<div
  role="dialog"
  aria-modal="true"
>
```

`role="dialog"`は、この領域がダイアログであることを支援技術へ伝えます。

```jsx
role="dialog"
```

`aria-modal="true"`は、現在操作する対象がこのModalであることを伝えます。

```jsx
aria-modal="true"
```

さらに、Modalの名前を指定できるようにします。

Headerからは、次のように渡します。

```jsx
<Modal ariaLabel="モバイルメニューのモーダル">
```

`ariaLabel`は、Modalコンポーネントへ渡すために付けたpropsの名前です。

Modal側では、HTMLの`aria-label`へ渡します。

```jsx
<div aria-label={ariaLabel}>
```

```text
HeaderのariaLabel
↓
Modalがpropsとして受け取る
↓
HTMLのaria-labelへ渡す
```

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

アンカーが担当するのは、次の二つです。

```text
href
→ 移動先を示す

onClick
→ リンクを選択したあとにModalを閉じる
```

MobileMenu自身が、Headerのstateを直接変更しているわけではありません。

```text
MobileMenuのリンクを押す
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

## 9. スタイルの役割を移動する

これまでMobileMenuが持っていた、次のようなスタイルはModal側へ移します。

```text
position: fixed
画面全体を覆う指定
背景色
z-index
```

Modalが、画面全体を覆う黒い背景を担当します。

```scss
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba($color: $color-black, $alpha: .9);
  z-index: 100;
}
```

MobileMenuは、Modalの中でナビゲーションを中央に配置する役割だけを担当します。

```scss
.mobileMenu {
  display: grid;
  place-content: center;
  height: 100%;
}
```

旧HTMLから残っている、次のスタイルは使用しません。

```scss
.open-modal
.modal
.modal.active
```

これらは、JavaScriptでクラスを付け外ししてModalを開閉するためのスタイルです。

今回はReactの真偽値によって要素そのものを表示・非表示にするため、古いModalのスタイルはコメントアウトします。

作品詳細用として残している`.modal-content`などは、この段階では変更しません。

---

## 10. 最低限の動作を確認する

ここまで実装したら、次の動作を確認します。

- メニューボタンを押すとModalが表示される
- もう一度メニューボタンを押すとModalが消える
- Modal内にMobileMenuが表示される
- Modalの閉じるボタンを押すと閉じる
- MobileMenuのリンクを押すと閉じる
- PC幅ではメニューボタンが表示されない

この段階では、Escapeキー、背景クリック、フォーカス管理、背景スクロールの停止はまだ実装しません。

まず、Header、Modal、MobileMenuの役割を分けられたことを確認します。

---

## 11. ここまでの完成コード

## Header

```jsx
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

## Modal

```jsx
// @/components/ui/Modal/index.jsx

import styles from "./Modal.module.scss";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  ariaLabel,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div
      className={styles.modal}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <button
        className={styles.modalBtn}
        type="button"
        onClick={onClose}
      >
        <X
          className={styles.cross}
          size={30}
          strokeWidth={2}
        />
        CLOSE
      </button>

      {children}
    </div>
  );
}
```

## Modalのスタイル

```scss
// @/components/ui/Modal/Modal.module.scss

@use "@/styles/shared" as *;

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(
    $color: $color-black,
    $alpha: .9
  );
  z-index: 100;

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

## MobileMenu

```jsx
// @/components/contents/MobileMenu/index.jsx

import styles from "./MobileMenu.module.scss";

export default function MobileMenu({
  onClose,
  links,
}) {
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
```

## MobileMenuのスタイル

```scss
// @/components/contents/MobileMenu/MobileMenu.module.scss

@use "@/styles/shared" as *;

.mobileMenu {
  display: grid;
  place-content: center;
  height: 100%;

  & > ul {
    flex-direction: column;
    align-items: center;

    & > li {
      padding: 30px;
      font-size: 1.5rem;

      & > a {
        color: $color-white;
      }
    }
  }
}
```

以上で、共通ModalへMobileMenuを入れるための最低限の構造が完成しました。


---

## 12. 背景クリックを区別する

背景に`onClick={onClose}`だけを書くと、Modal内部をクリックした場合もイベントが背景まで伝わって閉じます。

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
→ onClickを書いた背景要素
```

両方が同じときだけ、背景そのものがクリックされたと判断します。

---

## 4. Portalでbody直下へ表示する

ModalはHeaderから呼び出しますが、見た目はページ全体を覆います。

```jsx
import { createPortal } from "react-dom";
```

```jsx
return createPortal(
  <div>{/* Modal */}</div>,
  document.body,
);
```

これにより、React上ではHeaderの子でも、実際のDOMでは`body`直下へ表示できます。親要素の`overflow`や重なり順の影響を受けにくくなります。

`document`はブラウザにしかないため、ブラウザで表示準備ができたかをstateで管理します。

```jsx
const [isReady, setIsReady] = useState(false);

useEffect(() => {
  setIsReady(true);
}, []);
```

---

## 5. useEffectの役割

`useEffect`は、Reactの表示結果をブラウザなど外部の仕組みと同期するときに使います。

今回のModalでは、次を行います。

```text
Modalが開いた
↓
bodyのスクロールを止める
キーボード操作を監視する
フォーカスをModal内へ移す

Modalが閉じた
↓
設定を元へ戻す
監視を解除する
元の要素へフォーカスを戻す
```

Effectの`return`で返す関数はcleanupです。JSXを返す`return`とは役割が違います。

```jsx
useEffect(() => {
  // 開いたときの設定

  return () => {
    // 閉じるとき・Effectをやり直す前の後始末
  };
}, [/* このEffectが反応する値 */]);
```

---

## 6. useRefの役割

このModalでは三つのrefを使います。

```jsx
const panelRef = useRef(null);
const previousFocusRef = useRef(null);
const onCloseRef = useRef(onClose);
```

```text
panelRef
→ 実際のModal要素を参照する

previousFocusRef
→ 開く前にフォーカスされていた要素を覚える

onCloseRef
→ 最新のonClose関数を覚える
```

`useState`は値が変わると表示を更新します。`useRef`は、表示更新を起こさずDOMや値を保持します。

親コンポーネントが再表示されると、親で宣言した関数は新しく作られる場合があります。キーボード監視をそのたびに付け直さないよう、最新の`onClose`をrefへ保存します。

```jsx
useEffect(() => {
  onCloseRef.current = onClose;
}, [onClose]);
```

---

## 7. フォーカスできる要素を探す

```jsx
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");
```

Modal内から、この条件に合う表示中の要素を探します。

```jsx
const getFocusableItems = () =>
  Array.from(
    panelRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) ?? [],
  ).filter((element) => element.getClientRects().length > 0);
```

ページ全体ではなく、`panelRef.current`の中だけを検索することが重要です。

---

## 8. 完成したModal

```jsx
// src/components/ui/Modal/index.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./Modal.module.scss";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export default function Modal({
  isOpen,
  onClose,
  ariaLabel = "ダイアログ",
  children,
}) {
  const [isReady, setIsReady] = useState(false);
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isReady || !isOpen) return;

    previousFocusRef.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      const firstTarget = Array.from(
        panelRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) ?? [],
      ).find((element) => element.getClientRects().length > 0);

      firstTarget?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;

      const previousFocus = previousFocusRef.current;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [isOpen, isReady]);

  useEffect(() => {
    if (!isReady || !isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const items = Array.from(
        panelRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) ?? [],
      ).filter((element) => element.getClientRects().length > 0);

      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const activeElement = document.activeElement;

      if (!panelRef.current?.contains(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isReady]);

  if (!isReady || !isOpen) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="ダイアログを閉じる"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
```

最初のフォーカス対象は、Modal先頭の閉じるボタンです。そのため、キーボードだけでも必ず閉じられます。

---

## 9. ModalのSCSS

```scss
// src/components/ui/Modal/Modal.module.scss
@use "@/styles/shared" as shared;

.backdrop {
  position: fixed;
  z-index: shared.$z-modal;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgb(0 0 0 / 70%);
}

.panel {
  position: relative;
  width: min(100%, 960px);
  max-height: calc(100dvh - 40px);
  overflow: auto;
  color: shared.$color-text;
  background: shared.$color-background;
  border: 1px solid rgb(255 255 255 / 20%);
}

.closeButton {
  position: sticky;
  z-index: 1;
  top: 12px;
  display: grid;
  width: 44px;
  height: 44px;
  margin-inline: auto 12px;
  border: 1px solid currentcolor;
  color: inherit;
  background: shared.$color-background;
  cursor: pointer;
  place-items: center;
}

.closeButton:focus-visible {
  outline: 3px solid shared.$color-accent;
  outline-offset: 3px;
}

.content {
  padding: 24px;
}
```

`z-index`を直接大きな数字で書かず、第4章の共有値を使います。

---

## 10. MobileMenuをModalの中身にする

`MobileMenu`から表示・非表示の責務を外します。

```jsx
// src/components/layout/MobileMenu/index.jsx
import styles from "./MobileMenu.module.scss";

export default function MobileMenu({ links, onClose }) {
  return (
    <nav
      id="mobile-navigation"
      aria-label="モバイルナビゲーション"
    >
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
  );
}
```

`MobileMenu.module.scss`では、第7章の`.menu`を削除し、ナビゲーションの`.list`だけを残します。表示・非表示と背景はModalの責務になったためです。

Headerでは、次のように使います。

```jsx
import Modal from "@/components/ui/Modal";

<Modal
  isOpen={isMenuOpen}
  onClose={closeMenu}
  ariaLabel="メニュー"
>
  <MobileMenu
    links={navigationLinks}
    onClose={closeMenu}
  />
</Modal>
```

```text
Header
→ 開いているかを管理

Modal
→ ダイアログ共通の動作を管理

MobileMenu
→ ナビゲーションの内容を表示
```

三つの責務が分かれました。

---

## 11. マウスを使わず確認する

次の順番で確認します。

1. TabキーでMenuボタンへ移動する
2. Enterキーで開く
3. フォーカスが閉じるボタンへ移る
4. TabとShift + TabでModal内を移動する
5. Tabが背景へ抜けないことを確認する
6. Escapeキーで閉じる
7. Menuボタンへフォーカスが戻る
8. もう一度開き、背景クリックでも閉じる
9. Modal内部のクリックでは閉じない
10. 開いている間、背景をスクロールできない

ブラウザの見た目だけでなく、キーボード操作まで確認して完成です。

---

## 今日の確認

- [ ] Modalの状態は呼び出し側が持っている
- [ ] `children`で中身を入れ替えられる
- [ ] 背景と内部のクリックを区別できる
- [ ] `useEffect`とcleanupの役割を説明できる
- [ ] `useState`と`useRef`の違いを説明できる
- [ ] Escapeキーと閉じるボタンで閉じられる
- [ ] 背景スクロールが止まる
- [ ] フォーカスがModal内に留まる
- [ ] 閉じると呼び出し元へフォーカスが戻る
- [ ] ModalのSCSSがコンポーネントと同じ場所にある

## Git

```bash
git add .
git commit -m "Build reusable accessible modal"
```

## 補足

`Next.js` では、Googleフォントの `Material+Symbols+Outlined` が使えません。

**SVGコンポーネント** の `Lucide` で対応します。

DOM操作ではなく、コンポーネントを状態によって点滅させます。

コンポーネントをインストールして、

```bash
$ nnpm install lucide-react
```

呼び出し、

```jsx
// @/components/contents/Header/index.jsx

import { Menu, X } from "lucide-react";
```

`JSX` 内で展開します。

```jsx
// @/components/contents/Header/index.jsx

<button 
  type="button"
  className={styles.menuButton}
  onClick={handleToggleMenu}
  aria-expanded={isMenuOpen}
  aria-controls="mobile-navigation"
>
  <span className={styles.menuIcon} aria-hidden="true">
    {
      isMenuOpen 
        ? <X size={30} strokeWidth={2} /> 
        : <Menu size={30} strokeWidth={2} /> 
    }
  </span>          
</button>
```