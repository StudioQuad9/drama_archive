
---

# 第3章　フォント、画像、metadataなどHeadを整理する

## 目的

Next.jsが用意している仕組みを使い、HTMLの `head` にあった設定を整理します。

## 1. layout.jsへ共通設定を書く

`layout.js`は全ページに共通する外枠です。

`html`の言語、共通フォント、metadata、全体スタイルをここで扱います。

`GoogleFonts` と `metadata` の設定を行う。

### Next.jsでのフォント設定

元の `CSS` は、

```scss
/* // @/app/global.css */

/* 共通部分 */
:root {
  --accent: 255 216 0;

  --sans-serif: "Archivo", "Zen Kaku Gothic New", sans-serif;
  --serif: "Cormorant Garamond", "Noto Serif JP", serif; 
  
  --modal-color: 30 30 30;
}
```

やるべきとことは、

* 本文が、ゴシック系と明朝系の変数を作る。
* GoogleFontsを利用する。

で、方法として、

1. `next/font/google`からフォントを読み込む
2. ウェイトやCSS変数名などを設定する
3. 設定結果を `notoSerif` などの変数に格納する
4. `notoSerif.variable` をクラスとして付与し、ルートレイアウトの `<html>` へ
5. SCSS側で `var(--font-gothic)` を参照する
6. 必要に応じてサイト独自の変数にまとめる

下のコードを見ながら流れを説明します。

```jsx
// @/app/layout.js

import { Archivo, Cormorant_Garamond, Noto_Serif_JP } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans-en",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif-en",
});

const notoSerifJp = Noto_Serif_JP({
  weight: ["400", "600", "900"],
  subsets: ["latin"],
  variable: "--font-serif-ja",
});

export const metadata = {
  title: "Drama Archive | powered by Next.js",
  description: "海外ドラマのレビューをまとめた個人アーカイブ",
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="ja"
      className={`
        ${archivo.variable}
        ${cormorant.variable}
        ${notoSerifJp.variable}
      `}
    >
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

そして、スタイルでフォントの仕様を設定する。

```scss
/* // @/app/global.css */

/* 共通部分 */
:root {
  --accent: 255 216 0;

  --sans-serif: var(--font-sans-en), "Zen Kaku Gothic New", sans-serif;
  --serif: var(--font-serif-en), var(--font-serif-ja), serif; 

  /* 日本語のゴシック指定があってもいいですね。 */
  --gothic-jp: var(--font-serif-ja), serif;

  --modal-color: 30 30 30;
}
```

参考までに、上田さんのプロジェクトで作ったLPにはこのような指定をしています。

日本語の本文、英語の本文、英語のキャッチは...みたいな指定をしてます。

そして、本文の文字の大きさの指定はこちらが正確です。特に、本文内の文字の大きさの単位を `rem`、`em` で行う場合はマストです。

```css
:root {
  font-size: 93.75%; // 15px ÷ 16px ＝ 0.9375
  --ff-gothic: var(--font-gothic), -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Hiragino Sans", sans-serif;
  --ff-mincho: var(--font-mincho), "Georgia", "Times New Roman", "Yu Mincho", "Hiragino Mincho ProN", serif;
  --ff-en-gothic: var(--font-en-gothic), sans-serif;
  --ff-en-catch: var(--font-en-catch), sans-serif;
  --ff-jp-catch: var(--font-jp-catch), sans-serif;
}
```

```scss
body {
  font-family: var(--ff-gothic);
}
```

### metadata

`metadata` については、変数に格納して `export` するだけで完了。

書く内容としては、以下。

なお、`UTF-8`、`view port` は `Next.js` が自動的に設定します。

`Next.js` なら、タイトルをページ毎に変化させるのも簡単です。

```jsx
export const metadata = {
  title: {
    default: "Drama Archive",
    template: "%s | powered by Next.js"
  }
  description: "海外ドラマのレビューをまとめた個人アーカイブ",
  keywords: [
    "海外ドラマ",
    "ドラマレビュー",
    "Drama Archive",
  ],  
};
```

では、global.cssのフォントの記述をコメントアウトして、ブラウザで状態を確認してください。

## 2. `img`要素

`HTML` ではこうなんですが、

```html
<img src="pict/strangerthings.avif" alt="Stranger Things">
```

`Next.js` では、

`/` は `public` フォルダを省略していると思ってください。

そして、`/>` 終了タグが必要です。

```jsx
<img src="/pict/strangerthings.avif" alt="Stranger Things" />
```

`img`要素の構造に関して、お勧めは以下です。

また、`img`要素の管理では、画像の表示領域をwrapperに包むようにしています。画像へ直接スタイルを指定するのではなく、`.image-wrapper`で囲んで管理します。

画像を囲む要素を用意すると、「画像を表示する範囲」と「画像そのもの」の役割を分けられます。

なお、このような構造を `SCSS` スタイル付けをすることで、親子関係を持たせた構造を直感的にわかりやすく記述することができます。

`SCSS` で縦横比を一か所で管理するスタイルの記述例です。

```scss
.image-wrapper {
  overflow: hidden;
  & > img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &.is-portrait {
    aspect-ratio: 4 / 3;
  }
  &.is-landscape {
    aspect-ratio: 2 / 3;
  }
  &.is-square {
    aspect-ratio: 1 / 1;
  }
}
```

なお、`Next.js` では、以下のような管理方法もあります。

ただ、構造にスタイルの指定を入れるのが嫌なので、私はこの方法を使っていません。

```jsx
import Image from "next/image";

<div className="featured__image">
  <Image
    src="/pict/truedetective.avif"
    alt="True Detective"
    fill
    sizes="(min-width: 900px) 860px, calc(100vw - 40px)"
    priority
  />
</div>
```

`fill`を使う場合、親要素に`position: relative`と表示領域が必要です。

```scss
.featured__image {
  position: relative;
  aspect-ratio: 3 / 2;
  &img {
    object-fit: cover;
  }
}
```

最初に見えるFeatured画像には `priority` を付け、一覧の画像には付けないということらしいです。

一応、情報としてお伝えします。

今回の勉強会では、上の方法で進めたいと思います。

## 今日の確認

- [ ] ページタイトルがDrama Archiveになった
- [ ] `html lang="ja"`になった
- [ ] フォントをlayoutで管理した

## Git

```bash
git add .
git commit -m "Configure metadata fonts and images"
```