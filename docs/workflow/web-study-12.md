# 第12章　スクロールに合わせて要素を表示する

## 目的

スクロールをトリガーにして要素を動かしてみる。
GSAPというパッケージを利用する。

## GSAPのインストール

```bash
パッケージのインストール
npm install gsap @gsap/react

バージョンの確認
npm ls gsap @gsap/react --depth=0
```

## GSAPで動かしてみる

###　01
スクロールに従ってアニメーションするコンポーネントを
`GsapScrollReveal` として作成します。

**@/components/ui/GsapScrollReveal/index.jsx** に以下のコードを書いてください。

```jsx
// @/components/ui/GsapScrollReveal/index.jsx

"use client";

// 【説明1】
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function GsapScrollReveal() {
  useGSAP(() => {
    const element = document.querySelector("[data-reveal-test]");

    if (!element) return;

    // 【説明2】
    gsap.from(element, {
      autoAlpha: 0,
      y: 40,
      duration: 0.8,
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        once: true,
        markers: true,
      }
    });
  });
  // このコンポーネント自身は何も表示しない。
  return null;
}

```

#### 【説明1】

```txt
gsap
    → アニメーション本体

ScrollTrigger
    → スクロール位置をきっかけにアニメーションを動かすプラグイン

useGSAP
    → Reactの中でGSAPを安全に使うためのHook
```

`gsap`、`ScrollTrigger`、`useGSAP` をそれぞれインポートして、

`gsap`に`ScrollTrigger`、`useGSAP`を
`registerPlugin()` 関数で登録して、
コード内で使うことを表しています。

#### 【説明2】

アニメーションの設定です。

```jsx
gsap.from(要素, 設定内容)
```

アニメーションの **開始する前** の時点の要素の状態を登録します。

設定内容はオブジェクトで記述します。初見でも非常にシンプルで分かりやすいキー名です。

`autoAlpha` は、GSAP独自の属性です。

`autoAlpha: 0` は、`opacity: 0, visiblity: 0`<br />
`autoAlpha: 1` は、`opacity: 1, visiblity: 1` と同義です。


###　02　アプリ全体で使えるようにする

`@/app/layout.js` に以下のようにコンポーネントを追記してください。

```jsx
<body>
  <GsapScrollReveal />
  <Header />
  {children}
  <Footer />
</body>
```

###　03 動かしたい要素に属性を付与する

`@/app/page.js` の `h2` 要素にdata属性を追加する。

命名は任意です。今回は、**現れる**　=　`reveal` としました。

```jsx
<h2 data-reveal-test>About</h2>へ
```

## 複数の要素に設定する その1

### 動かしたい要素に属性を付与する

`@/app/page.js`の`h2` 要素
 `@/components/contents/DramaList/index.jsx`の`h2` 要素、`li` 要素に `data-reveal` 属性を設定する。

### 複数の要素を配列にまとめて処理する

```jsx
gsap.utils.toArray(...)
```

`gsap` 本体のユーティリティ、`toArray()` 関数を使って `data-reveal` 属性がついた要素を収集する。

あとは、forEach()関数で個別に処理をする。

```jsx
// @/components/ui/GsapScrollReveal/index.jsx

"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function GsapScrollReveal() {
  useGSAP(() => {
    const elements = gsap.utils.toArray("[data-reveal]");

    elements.forEach((element) => {
      gsap.from(element, {
        autoAlpha: 0,
        y: 40,
        duration: 0.8,
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          once: true,
        },
      });
    });
  });

  return null;
}
```

## 複数の要素に設定する その2

複数の要素が同じ位置でトリガーを越える場合には、複数要素が同じタイミングでアニメーションを開始する意図しない動きになる。

これを解決するため、トリガーが同じ位置の要素をまとめてアニメーションをかける `bactch()` 関数を使う。

`onEnter` 属性の値にコールバック関数を引数にトリガーが同じ位置の要素が入った配列を入れて設定。

アニメーションのための値を設定する。

ちなみに、`stagger` 属性は、指定した数値（秒）ごとに動きをずらす。

## 複数の要素に設定する その3

batch()で同時に画面へ入った要素を集め、`onEnter`のタイミングで`from()`を実行することで、バラバラには動くようになりましたが、チラついてしまいました。

これは、すでに表示された要素を、`onEnter`が発動してから開始位置へ戻すため起こる問題です。

これを解決するために、画面に表示される前に開始状態を設定します。

`gsap` 本体に `set()` 関数を充ててアニメーションの開始地点の属性を設定します。

そして、`to()` 関数で、到達点の設定をして動きを作ります。

```jsx

// @/components/ui/GsapScrollReveal/index.jsx

"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function GsapScrollReveal() {
  useGSAP(() => {
    const elements = gsap.utils.toArray("[data-reveal]");

    gsap.set(elements, {
      autoAlpha: 0,
      y: 40,
    });

    ScrollTrigger.batch(elements, {
      start: "top 90%",
      once: true,
      markers: true,
      onEnter: (items) => {
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
        });
      },
    });
  });

  return null;
}
```

## 複数の要素に設定する その4

シングルページだけであれば『その3』まででいいのですが、`Next.js`の`App Router` を使った複数ページでサイトを構成する場合、遷移先のページでスクロールアニメーションが効かなくなります。

`Next.js` の `<Link>` コンポーネントは、ブラウザをリロードせずに、裏側でデータをサッと取得してコンポーネントだけを瞬時に差し替える仕組み（SPA遷移）になっています。

なので、

1. `/`（トップページ）でスクロールアニメーションが綺麗に動く。
1. `<Link href="/otherPage">` をクリックして移動する。
1. 画面の見た目は `/otherPage` に変わるが、共通レイアウトはそのまま残るため、`GSAP` の `useGSAP` は再実行されない。
1. 結果、`/otherPage` にある新しい `[data-reveal]` 要素を `GSAP` が認識できず、次のページではアニメーションが一切動かなくなるのです。

`usePathname` を使います。

`usePathname()`は、現在表示しているページのパスを取得します。

`useEffect()` でいうところの依存配列みたいなことをします。

この場合は、依存オブジェクトに現在アニメーションが行われているパスを設定して、`<Link>`によってページが移動し、`pathname`が変わると、次の処理が行われます。

1. 前のページに設定していたGSAPの処理を後片付けする。
1. useGSAP()の中を再実行する。
1. 遷移先にある`[data-reveal]`要素を集め直す。
1. 新しいページへスクロールアニメーションを設定する。

`revertOnUpdate: true` を指定すると、`pathname` が変わったとき、前のページ用に作ったアニメーションと `ScrollTrigger` を削除してから、新しいページ用の処理を実行します。