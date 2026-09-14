# 第4章　CSSをSCSSの構成へ移す

## 目的

元のCSSを捨てず、役割ごとのSCSSへ整理します。

この勉強会では、スタイルが影響する範囲によってファイルを使い分けます。

- サイト全体へ適用するスタイル → 通常の `.scss`
- 特定のページやコンポーネントだけへ適用するスタイル → `.module.scss`

として進めます。

## 1. Sassを追加する

```bash
npm install --save-dev sass
```

Next.jsは `Sass` パッケージを追加すると、 `.scss` と `.module.scss` を扱えます。

わざわざ `Sass` をビルドして `CSS` に変換する必要はありません。`Sass` ファイルのまま編集して保存すればスタイルは適応されます。

## 2. スタイルの構造を作る

下のディレクトリ構成を参照して、`scss` ファイルを作成してください。波線のあるものは今は作成しなくていいです。

`@/app/globals.scss` このファイルも作ってください。

reset.cssは、元のフォルダからコピー＆ペーストで持ってきます。

```text
src
  └── styles/
      ├── _index.scss
      ├── _base.scss
      ├── ~~_form.scss~~
      ├── reset.css
      └── shared/
          ├── _index.scss
          ├── _variables.scss
          └── _mixins.scss
```

## 3. 入口を一つにする

### `HTML` のヘッダーでやったことをやる

`HTML` では、CSSを登録はヘッダーしていました。`Next.js` のやり方を解説します。

`HTML` の時と同じようにリセット `CSS` を最初に置いて、以降、サイト内で使う `CSS` を設置するのは同じです。

以下のファイルに `GoogleFonts` と**スタイルファイル**を読み込ませます。

`import`：`JavaScript` 側から、コンポーネント、フォント、スタイルシートなどを読み込む宣言をしています。

```js
// @/app/layout.js

import { Archivo, Cormorant_Garamond, Noto_Serif_JP } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import "@/styles/reset.css";
import "./globals.scss";
```

次に、最終的にサイトにかかる共通スタイルの入口を `globals.scss` として設定ます。

以下のように書きます。

`@use`：`SCSS` 側から、ほかのSassファイルを読み込む宣言をしています。

ちなみに、`@use '@/styles/' as *;` この部分は、
`@use '@/styles/_index.scss' as *;` を省略したものです。

```scss
// @/app/globals.scss

@use '@/styles/' as *;
@use '@/styles/shared/' as *;
```

とすると、`*` この記号は、すべてのファイルという正規表現的な意味ではありません。

こうすることで `scss` の記述を簡略化できます。

例えば、`styles` フォルダ内にある `SCSS` ファイルで変数を使っていたとして、値を呼び出す際に以下のようにする必要があります。

```scss
@use "@/styles/" as styles;

.example {
  color: styles.$text-color;
  @include styles.heading;
}
```

`@/styles/` の中の変数に格納されたスタイルを `styles.$text-color` として呼び出すということです。

いちいち、`styles.` と書くのが面倒なので `*` を使うことにしています。

そして、スタイルの目次（index）を作ります。

`@/styles/_index.scss` と `@/styles/shared/_index.scss` のファイルに以下のように書いてください。

`@forward`：それぞれのファイルに書いたスタイルを送り出すというふう読み替えてください。

```scss
// @/styles/_index.scss

@forward "base";
```

```scss
// @/styles/shared/_index.scss

@forward "variables";
@forward "mixins";
```

では、 `@/app/globals.css` の中身を全て `@/styles/_base.scss` へコピー＆ペーストして、ブラウザでの表示を確認してください。

## 4. 共有値

勉強会でファイルをお渡しします。

* `_variables.scss`
* `_mixins.scss`

ファイルを置き換えてください。

## 5. mixin・変数を使う

両ファイルを見ながら説明します。

以下のようにして、元のスタイルを消してブラウザで確認してください。

```scss
/* dramaのタイトル */
h4 {
  font-family: var(--sans-serif);
  font-size: 1.3rem;
  @include mq(lg) {
    color: red;
    font-size: 1.3rem;
  }
}
```

該当する箇所を全て適用させてください。

## 今日の確認

- [ ] `globals.scss`からグローバルスタイルを読み込めた
- [ ] `_index.scss`の役割を説明できる
- [ ] 変数とmixinを共有できた
- [ ] 通常のSCSSとCSS Modulesの役割を区別できた
- [ ] CSS移行前と同じ見た目を保てた

## Git

```bash
git add .
git commit -m "Organize styles with Sass modules"
```

---

# 第5章　コンポーネントへ分ける

## 目的

長い`page.js`を、役割ごとのファイルへ分けます。

## 1. 分ける基準

次のいずれかに当てはまるものを、コンポーネントの候補にします。

- 名前を付けられる
- 同じ形を繰り返す
- 別のページでも使う可能性がある
- 独立した動きを持つ
- ファイルを分けると親の役割が読みやすくなる

細かく分けること自体が目的ではありません。

## 2. HeaderとFooter

```jsx
// src/components/layout/Header.jsx
import Image from "next/image";

const navigationItems = [
  { href: "#featured", label: "Featured" },
  { href: "#dramas", label: "Dramas" },
  { href: "#about", label: "About" },
];

export default function Header() {
  return (
    <header className="header">
      <div className="header__inner inner">
        <a href="#featured" className="header__logo" aria-label="Drama Archive トップへ">
          <Image src="/pict/logo.svg" alt="Drama Archive" width={180} height={35} />
        </a>

        <nav className="header__nav" aria-label="メインナビゲーション">
          <ul>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}

          </ul>
        </nav>
      </div>
    </header>
  );
}
```

PC用とスマートフォン用に同じリンクを二度書かず、一つの配列から生成します。

```jsx
// src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="footer">
      <p>© Yasuyuki Ishizaki</p>
    </footer>
  );
}
```

## 3. pageを目次のようにする

```jsx
// src/app/page.js
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DramaArchive from "@/components/drama/DramaArchive";

export default function Home() {
  return (
    <>
      <Header />
      <main className="inner">
        <DramaArchive />
      </main>
      <Footer />
    </>
  );
}
```

親ファイルを読むと、ページの構成が短時間で分かる状態を目指します。

## 今日の確認

- [ ] コンポーネントを分ける理由を説明できる
- [ ] importとexportの対応を確認できる
- [ ] `page.js`がページ構成を示す形になった
- [ ] 分割前と同じ見た目を保った

## Git

```bash
git add .
git commit -m "Split page into reusable components"
```