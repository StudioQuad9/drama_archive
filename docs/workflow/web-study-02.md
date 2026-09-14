# 第2章　HTMLをJSXへ移す

## 目的

静的な内容を `Next.js` で表示します。

## 1. Next.jsをインストールする

最初に、元の `HTML`, `CSS`, `JS`, `画像` などを`tmp` フォルダに適当な名前のフォルダを作成して退避させます。

ターミナルで、Node.jsとnpmが使用できることを確認します。

```bash
node -v
npm -v
```

バージョン番号が表示されたら準備できています。

`drama_archive`フォルダ内にNext.jsプロジェクトを作成します。

```bash
npx create-next-app@latest .
```

最後の `.`は、「新しいフォルダを作らず、現在のフォルダにNext.jsをインストールする」という意味です。

### 最初に「おすすめ設定を使用しますか？」と聞かれた場合

**No, customize settings（自分で設定する）**

を選択します。

### 1. JavaScript：選択する

「TypeScriptを使用しますか？」には、**No**を選択します。

今回は、まず分かりやすいJavaScriptで作成します。TypeScriptは便利ですが、追加のルールを覚える必要があるため、現段階では使用しません。

設定名：`js`

### 2. ESLint：選択する

コードの間違いや、問題になりそうな書き方を見つけて知らせてくれる機能です。

**ESLint**を選択します。

設定名：`eslint`

### 3. Tailwind CSS：使用しない

「Tailwind CSSを使用しますか？」には、**No**を選択します。

今回は通常のCSSを使います。HTMLとCSSの基本的な関係が分かりやすくなるためです。

設定名：`no-tailwind`

### 4. React Compiler：使用しない

「React Compilerを使用しますか？」には、**No**を選択します。

自動的に動作を最適化する比較的新しい機能ですが、最初の学習には必須ではありません。構成をシンプルにするため、今回は使用しません。

設定名：`no-react-compiler`

### 5. srcフォルダ：使用する

「コードをsrcフォルダの中に配置しますか？」には、**Yes**を選択します。

プログラム本体と設定ファイルを分けられるため、ファイルを整理しやすくなります。

設定名：`src-dir`

### 6. App Router：使用する

「App Routerを使用しますか？」には、**Yes**を選択します。

現在のNext.jsで推奨されている、新しいページ管理方式です。

設定名：`app`

### 7. パッケージ管理：npmを選択する

選択肢が表示された場合は、**npm**を選択します。

npmはNode.jsと一緒に利用でき、教材や解説も多いため、最初の学習に向いています。

設定名：`use-npm`

### 8. Import Alias：@/*を使用する

インポートエイリアスには、**@/\***を使用します。

これは、深い階層のファイルを読み込むときに、短く分かりやすく指定するための設定です。

入力欄が表示された場合は、次のように入力します。

`@/*`

ただし、「標準の@/*を変更しますか？」という質問の場合は、すでに希望どおりの設定なので、**No**を選択します。

設定名：`import-alias`

### 9. AGENTS.md：作成する

選択肢が表示された場合は、**Yes**を選択します。

AGENTS.mdは、CodexなどのAIに、このプロジェクトで守るルールや参照すべきNext.jsの説明書を伝えるファイルです。人が操作するための設定ではありませんが、今後AIに作業を手伝ってもらう際に役立ちます。

設定名：`agents-md`

以上で設定完了です。

このコマンドでは、主に次のパッケージがインストールされます。

```text
next
react
react-dom
```

同時に、Next.jsを動かすために必要なファイルも作成されます。

```text
drama_archive/
├── public/
├── src/
│   └── app/
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.js
│       └── page.js
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
└── package-lock.json
```

インストールが完了したら、開発用サーバーを起動します。

```bash
npm run dev
```

ブラウザで次のURLを開きます。

```text
http://localhost:3000
```

Next.jsの初期ページが表示されたら、インストールは完了です。

開発用サーバーを終了するときは、ターミナルで `control + C`を押します。

このあと、Next.jsが用意した `src/app/page.js`の中身を、Drama Archiveの内容へ変更していきます。

## 2. JSXで変わる部分

主な違いは次のとおりです。

```jsx
// HTML
<div class="drama-card"></div>

// JSX
<div className="drama-card"></div>
```

```jsx
// HTML
<iframe allowfullscreen></iframe>

// JSX
<iframe allowFullScreen></iframe>
```

## 3. `page.js`の役割

```jsx
// src/app/page.js
export default function Home() {
  return (
    <main className="inner">
      <section id="featured">
        <h1>Drama Archive</h1>
      </section>
    </main>
  );
}
```

`page.js`は、このサイトのトップページを返すコンポーネントです。

`return();` の中にJSXを書きます。HTMLの要素を真似たタグを書き構造を表現します。要素の属性はHTMLタグと同じです。

## 4. 画像を配置する

元サイトの`pict`フォルダを`public/pict`へコピー&ペーストします。`public`内のファイルは、URLの先頭を`/`にして参照できます。

```jsx
<img src="/pict/truedetective.avif" alt="True Detective" />
```

## 5. 中身を移す

中身を移しましょう。

今は、HTMLをAIに確認させてから一度にHTML全体を移す方法もあります。まとまり毎に貼り付けてという方法でもどちらでも結構です。

## 6. スタイルを適用させる

元の `CSS` の中身を `globals.css` を空にしてコピー＆ペースト。

`@/app/page.js` の先頭にスタイルシートを読み込ませてください。

```jsx
// @/app/page.js

import "./globals.css";

export default function Home() {
  return ();
}
```

ブラウザで結果を確認します。

## 7. HeaderとFooterをコンポーネントにする

このパスを参考に2つのファイルを置いてください。

* `@/components/Header/index.jsx`
* `@/components/Footer/index.jsx`

`@/app/page.js` に書いてあるヘッダーとフッターをそれぞれのファイルにカット＆ペーストで移動させてください。

```jsx
// @/components/Header/index.jsx

// コンポーネントの命名は、先頭が大文字で始まります。
export default function Header() {
  return (
    <header>
      ...
      ...
    </header>
  );
}
```

```jsx
// @/components/Footer/index.jsx

export default function Footer() {
  return (
    <footer>
      ...
    </footer>
  );
}
```

そして、

`@/app/layout.js` の `{children}` の前後にコンポーネントを置きます。

* ヘッダーのコンポーネント => `<Header />`
* フッターのコンポーネント => `<Footer />`

```jsx
// @/app/layout.js

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

`{children}` の正体は `@/app/page.js` です。

`RootLayout()` 関数が呼び出されると、引数に `{children}` 、つまり `@/app/page.js` を呼び出して、`return ();` の中で展開されるという仕組み。

先ほど設置した `Header.jsx` `Footer.jsx` の参照をファイルの先頭に記述します。

ブラウザで結果を確認します。

## 今日の確認

- [ ] `class`を`className`へ変更した
- [ ] JSXの要素を閉じた
- [ ] `public`の画像を表示できた
- [ ] 元ページの主要部分がNext.js上に表示された
- [ ] スタイルを適用できた
- [ ] コンポーネントを使って表示できた

## Git

```bash
git add .
git commit -m "Migrate Drama Archive from HTML to JSX"
```