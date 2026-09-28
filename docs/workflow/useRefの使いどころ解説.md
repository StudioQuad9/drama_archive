実務でも使います。ただし、サイトの種類によって頻度がかなり変わります。

一般的な情報サイトでは少なめですが、アニメーション、動画、地図、スライダー、入力フォームなどが増えるとよく使います。

代表例は次のとおりです。

## 1. 入力欄へフォーカスする

```jsx
const inputRef = useRef(null);

const handleFocus = () => {
  inputRef.current?.focus();
};
```

検索ボタンを押したら検索欄へ移動する場合などです。

---

## 2. 特定の場所までスクロールする

```jsx
const sectionRef = useRef(null);

const handleScroll = () => {
  sectionRef.current?.scrollIntoView({
    behavior: "smooth",
  });
};
```

```jsx
<section ref={sectionRef}>
  ...
</section>
```

目次から特定のセクションへ移動する場合などに使います。

---

## 3. 動画や音声を操作する

```jsx
const videoRef = useRef(null);

const handlePlay = () => {
  videoRef.current?.play();
};

const handlePause = () => {
  videoRef.current?.pause();
};
```

```jsx
<video ref={videoRef} src="/movie.mp4" />
```

HTMLのvideo要素をJavaScriptから操作する例です。

---

## 4. 要素の大きさや位置を調べる

```jsx
const boxRef = useRef(null);

const handleMeasure = () => {
  const rect =
    boxRef.current?.getBoundingClientRect();

  console.log(rect?.width);
  console.log(rect?.top);
};
```

次のような実装で使います。

```text
要素が画面に入ったらアニメーションする
吹き出しの表示位置を計算する
要素の幅に合わせてレイアウトを変える
ドラッグ操作の位置を計算する
```

---

## 5. 外部ライブラリへDOM要素を渡す

Swiper、地図、グラフ、エディターなどのライブラリでは、表示先のDOM要素が必要になる場合があります。

```jsx
const sliderRef = useRef(null);

useEffect(() => {
  const slider = new SomeSlider(
    sliderRef.current
  );

  return () => {
    slider.destroy();
  };
}, []);
```

```jsx
<div ref={sliderRef}>
  ...
</div>
```

これは実務でよくある用途です。

---

## 6. タイマーのIDを覚える

```jsx
const timerRef = useRef(null);

const startTimer = () => {
  timerRef.current = setTimeout(() => {
    console.log("実行");
  }, 1000);
};

const stopTimer = () => {
  clearTimeout(timerRef.current);
};
```

画面へ表示する必要はないが、あとで停止するために覚えておきたい値です。

---

## 7. 外部機能のインスタンスを保存する

```jsx
const mapRef = useRef(null);

useEffect(() => {
  mapRef.current = new MapLibrary.Map();

  return () => {
    mapRef.current?.destroy();
  };
}, []);
```

次のようなインスタンスを保存します。

```text
地図
Swiper
動画プレイヤー
WebSocket
エディター
アニメーション
```

## 判断基準

次の基準で考えると分かりやすいです。

```text
値が変わったら画面も変えたい
→ useState

実際のDOM要素を操作したい
→ useRef

画面を変えず、あとで使う値を保存したい
→ useRef
```

今回の教材なら、入力欄へのフォーカスだけで十分です。

将来、Swiper、動画、地図、スクロールアニメーションなどを実装するときに、「これは`useRef`を使う場面ではないか」と思い出せれば成功です。

---

# フォーカスを移動させるuseRef


`useRef`の一般説明から、実際のフォーカス移動、Modalへの適用という順番に組み直しました。

## 15. useRefの役割

`useRef`は、DOM要素や値を覚えておくためのReact Hookです。

```jsx
const sampleRef = useRef(null);
```

`useRef()`が覚えている値は、`.current`から確認できます。

```jsx
sampleRef.current
```

最初は何も入っていないため、初期値として`null`を渡します。

```text
sampleRef.current
→ null
```

`useState`との大きな違いは、値を変更しても画面が再表示されないことです。

```text
useState
→ 値が変わると画面を再表示する

useRef
→ 値を保持するが、画面は再表示しない
```

`useRef`の代表的な用途は、実際に表示されたDOM要素を覚えて、JavaScriptから操作することです。

---

### 例4）入力欄へフォーカスを移す

次の入力欄とボタンを一時的にModalへ追加します。

```jsx
const inputRef = useRef(null);

const handleFocus = () => {
  inputRef.current?.focus();
};
```

```jsx
<input
  ref={inputRef}
  type="text"
/>

<button
  type="button"
  onClick={handleFocus}
>
  入力欄へフォーカスする
</button>
```

`input`の`ref`属性へ、作成した`inputRef`を渡します。

```jsx
ref={inputRef}
```

Reactが`input`を画面へ表示すると、`inputRef.current`へ実際のinput要素が入ります。

```text
画面へ表示する前

inputRef.current
→ null
```

```text
画面へ表示したあと

inputRef.current
→ 実際のinput要素
```

ボタンを押したとき、`.focus()`を実行します。

```jsx
inputRef.current?.focus();
```

処理の流れは次のとおりです。

```text
ボタンを押す
↓
inputRef.currentからinput要素を取得する
↓
focus()を実行する
↓
入力欄へフォーカスが移る
```

`useRef`を使うことで、Reactが表示したDOM要素をあとから操作できます。

---

## 16. Modalでフォーカスを管理する理由

フォーカスとは、キーボードで現在操作している要素のことです。

マウスを使わず、`Tab`キーで3本線のメニューボタンまで移動します。

```text
3本線のボタン
← 現在ここにフォーカスがある
```

その状態で`Enter`キーを押すと、Modalが開きます。

しかし、Modalを表示しただけでは、フォーカスが背景にある3本線のボタンに残る場合があります。

```text
画面に見えているもの
→ Modal

キーボードで選択しているもの
→ 背景にある3本線のボタン
```

これでは、キーボードを使っている人は、Modalのどこから操作すればよいのか分かりません。

そこで、Modalを開いた直後に、最初のリンクである`Featured`へフォーカスを移します。

```text
3本線のボタンでModalを開く
↓
Featuredへフォーカスを移す
```

Modal内では、次の順番でフォーカスを移動できるようにします。

```text
Featured
↓ Tab
Dramas
↓ Tab
About
↓ Tab
CLOSEボタン
↓ Tab
Featuredへ戻る
```

Modalを開いている間は、フォーカスを背景へ移動させません。

このように、Tabキーの移動をModal内に留める処理を、フォーカストラップと呼びます。

Modalを閉じたあとは、開く前に選択していた3本線のボタンへフォーカスを戻します。

```text
Modalを開く前
→ 3本線のボタン

Modalを開いた直後
→ Featured

Modalを閉じたあと
→ 3本線のボタンへ戻る
```

ここでいう「元の要素」とは、Modalを開く直前にフォーカスされていた要素です。

---

## 17. Modalで使用するrefを作る

今回のModalでは、三つのrefを使います。

```jsx
const panelRef = useRef(null);
const previousFocusRef = useRef(null);
const onCloseRef = useRef(onClose);
```

役割は次のとおりです。

```text
panelRef
→ 実際に表示されたModalのDOM要素を覚える

previousFocusRef
→ Modalを開く前にフォーカスされていた要素を覚える

onCloseRef
→ 最新のonClose関数を覚える
```

### panelRef

`panelRef`は、ModalのDOM要素を参照するために使います。

```jsx
<div
  ref={panelRef}
  className={styles.modal}
>
```

画面へ表示されたあと、`panelRef.current`には実際のModal要素が入ります。

```text
panelRef.current
→ 実際に表示されたModalのdiv要素
```

これにより、Modalの中にあるリンクやボタンを探せます。

### previousFocusRef

Modalを開く直前にフォーカスされていた要素は、次のコードで取得できます。

```jsx
document.activeElement
```

取得した要素を`previousFocusRef`へ保存します。

```jsx
previousFocusRef.current = document.activeElement;
```

今回、キーボードで3本線のボタンからModalを開いた場合は、そのボタンが保存されます。

```text
previousFocusRef.current
→ 3本線のメニューボタン
```

Modalを閉じるときは、保存していた要素へフォーカスを戻します。

```jsx
previousFocusRef.current?.focus();
```

### onCloseRef

`onClose`も関数という値です。

親コンポーネントが再表示されると、親で宣言した関数が新しく作られる場合があります。

```jsx
const onCloseRef = useRef(onClose);
```

最新の`onClose`を使えるように、Effectでrefへ保存します。

```jsx
useEffect(() => {
  onCloseRef.current = onClose;
}, [onClose]);
```

Escapeキーを押したときは、refに保存されている最新の関数を実行します。

```jsx
onCloseRef.current();
```

`panelRef`と`previousFocusRef`はDOM要素を覚えます。

`onCloseRef`は関数を覚えます。

```text
useRefが覚えられるもの

DOM要素
→ panelRef、previousFocusRef

通常の値や関数
→ onCloseRef
```

---

## 18. フォーカスできる要素を探す

Modal内でTabキーを使って移動できる要素を探します。

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

配列には、フォーカスできる要素のCSSセレクタを入れています。

```text
a[href]
→ リンク

button:not([disabled])
→ 無効化されていないボタン

input:not([disabled])
→ 無効化されていない入力欄

select:not([disabled])
→ 無効化されていない選択欄

textarea:not([disabled])
→ 無効化されていない複数行入力欄

[tabindex]:not([tabindex='-1'])
→ Tabキーで選択できるようにした要素
```

`.join(",")`を使い、配列を一つのCSSセレクタへ変換します。

```text
a[href],button:not([disabled]),input:not([disabled]),...
```

次に、Modal内から条件に合う要素を探します。

```jsx
const getFocusableItems = () => {
  if (!panelRef.current) return [];

  const items = panelRef.current.querySelectorAll(
    FOCUSABLE_SELECTOR
  );

  return Array.from(items).filter((element) => {
    return element.getClientRects().length > 0;
  });
};
```

最初に、ModalのDOM要素が取得できているか確認します。

```jsx
if (!panelRef.current) return [];
```

まだDOM要素が取得できていない場合は、空の配列を返します。

`querySelectorAll()`で、Modal内にあるフォーカス可能な要素を探します。

```jsx
panelRef.current.querySelectorAll(
  FOCUSABLE_SELECTOR
);
```

ページ全体ではなく、`panelRef.current`の中だけを検索することが重要です。

```text
documentから検索する
→ ページ全体のリンクやボタンが対象になる

panelRef.currentから検索する
→ Modal内のリンクやボタンだけが対象になる
```

`getClientRects()`を使い、現在画面に表示されている要素だけを残します。

```jsx
.filter((element) => {
  return element.getClientRects().length > 0;
});
```

---

## 19. Tabキーの順番に合わせてJSXを並べる

キーボードのフォーカスは、基本的にDOMへ書かれている順番で移動します。

今回は、次の順番にします。

```text
Featured
Dramas
About
CLOSEボタン
```

そのため、ModalのJSXでは`children`を先に書き、CLOSEボタンをあとに書きます。

```jsx
<div
  ref={panelRef}
  className={styles.modal}
  role="dialog"
  aria-modal="true"
  aria-label={ariaLabel}
>
  {children}

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
</div>
```

CLOSEボタンはCSSの`position: absolute`で右上へ配置しているため、JSX内の記述位置を変えても、見た目は右上のままです。

```text
画面上の位置
→ CSSで決まる

Tabキーの基本的な移動順
→ DOMの記述順で決まる
```

この構造で`getFocusableItems()`を実行すると、次の順番で配列に入ります。

```text
0: Featured
1: Dramas
2: About
3: CLOSEボタン
```

---

## 20. Modalを開いたらFeaturedへフォーカスする

Modalを開く直前に、現在フォーカスされている要素を保存します。

```jsx
previousFocusRef.current = document.activeElement;
```

次に、Modal内のフォーカス可能な要素を取得します。

```jsx
const focusableItems = getFocusableItems();
```

配列の最初に入っている要素へフォーカスを移します。

```jsx
focusableItems[0]?.focus();
```

まとめると、次のようになります。

```jsx
useEffect(() => {
  if (isOpen === false) return;

  previousFocusRef.current = document.activeElement;

  const focusableItems = getFocusableItems();
  focusableItems[0]?.focus();
}, [isOpen]);
```

処理の流れは次のとおりです。

```text
isOpenがtrueになる
↓
3本線ボタンをpreviousFocusRefへ保存する
↓
Modal内のフォーカス可能な要素を取得する
↓
配列の最初にあるFeaturedへフォーカスする
```

---

## 21. Tabキーの移動をModal内に留める

Tabキーが押されたとき、現在のフォーカス位置を確認します。

```jsx
const handleKeyDown = (event) => {
  if (event.key !== "Tab") return;

  const focusableItems = getFocusableItems();

  const firstItem = focusableItems[0];
  const lastItem =
    focusableItems[focusableItems.length - 1];

  if (!firstItem || !lastItem) return;

  if (
    event.shiftKey &&
    document.activeElement === firstItem
  ) {
    event.preventDefault();
    lastItem.focus();
    return;
  }

  if (
    !event.shiftKey &&
    document.activeElement === lastItem
  ) {
    event.preventDefault();
    firstItem.focus();
  }
};
```

通常の`Tab`キーでは、前から後ろへ移動します。

CLOSEボタンで`Tab`キーを押した場合は、最初のFeaturedへ戻します。

```text
CLOSEボタン
↓ Tab
Featured
```

`Shift + Tab`では、反対方向へ移動します。

Featuredで`Shift + Tab`を押した場合は、最後のCLOSEボタンへ移します。

```text
Featured
↓ Shift + Tab
CLOSEボタン
```

これにより、フォーカスがModalの外へ出なくなります。

---

## 22. Modalを閉じたら元の要素へ戻す

Effectのcleanupで、Modalを開く前に保存した要素へフォーカスを戻します。

```jsx
return () => {
  previousFocusRef.current?.focus();
};
```

今回の操作では、3本線のメニューボタンへ戻ります。

```text
3本線のボタン
↓ Enter
Modalを開く
↓
Featured
↓ Tab
Dramas
↓ Tab
About
↓ Tab
CLOSEボタン
↓ Enter
Modalを閉じる
↓
3本線のボタンへ戻る
```

この処理によって、キーボードを使っている人は、Modalを閉じたあとも、開く前の場所から操作を続けられます。


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
  const [isMounted, setIsMounted] = useState(false);
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isMounted || !isOpen) return;

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
  }, [isOpen, isMounted]);

  useEffect(() => {
    if (!isMounted || !isOpen) return;

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
  }, [isOpen, isMounted]);

  if (!isMounted || !isOpen) return null;

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

      {/* <input type="text" ref={inputRef} />
      <button
        className={styles.myButton}
        type="button"
        onClick={handleFocus}
      >
        入力欄へフォーカスする
      </button> */}