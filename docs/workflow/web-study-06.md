# 第6章　mapとpropsで作品を表示する

## 目的

第5章で作った作品データを読み込み、Featuredと作品一覧へ振り分けます。

最初から完成コードを書くのではなく、現在の静的なJSXを少しずつコンポーネントへ分け、最後に`map()`で作品カードを生成します。

```text
dramas.js
↓
DramaArchive
├── FeaturedDrama
└── DramaList
    └── DramaCard × 作品数
```

この章では、次のことを学びます。

- まとまったJSXをコンポーネントへ分ける
- 親コンポーネントから子コンポーネントへpropsを渡す
- `find()`で条件に合う一件を取得する
- `filter()`で条件に合う複数件を取得する
- `sort()`で配列を並べ替える
- `map()`で配列から必要な数のコンポーネントを作る
- `key`を使って一覧の各項目を識別する

スタイルは事前に用意しています。この章では見た目を作り込まず、データとコンポーネントの流れを作ることに集中します。

カードのクリックとModalは、必要な仕組みを学んだ後の章で追加します。

---

## 1. 今回作るコンポーネント

次のファイルを使用します。

```text
src/components/contents/
├── DramaArchive/
│   ├── index.jsx
│   └── DramaArchive.module.scss
├── FeaturedDrama/
│   ├── index.jsx
│   └── FeaturedDrama.module.scss
├── DramaList/
│   ├── index.jsx
│   └── DramaList.module.scss
└── DramaCard/
    ├── index.jsx
    └── DramaCard.module.scss
```

役割は次のとおりです。

```text
DramaArchive
→ 全作品を読み込み、Featuredとその他の作品へ振り分ける

FeaturedDrama
→ Featuredに選ばれた一作品を表示する

DramaList
→ その他の作品を一覧として並べる

DramaCard
→ 渡された一作品をカードとして表示する
```

`DramaArchive`は単なる中継地点ではありません。

```text
全作品からFeaturedを探す
↓
Featured以外を取り出す
↓
公開日時の新しい順へ並べる
↓
FeaturedDramaとDramaListへ渡す
```

という、作品データ全体の整理を担当します。

---

## 2. 作業する範囲を限定する

`page.js`に残っている静的なJSXのうち、今回は次の二つだけを扱います。

```html
<section id="featured">
<section id="dramas">
```

Header、About、Footer、Modalなどは、いったんコメントアウトします。

```jsx
// @/app/page.js

import DramaArchive from "@/components/contents/DramaArchive";

export default function Home() {
  return (
    <main className="inner">
      <DramaArchive />

      {/* 今回扱わない部分は一時的にコメントアウトする */}
    </main>
  );
}
```

一度にサイト全体を変更せず、Featuredと作品一覧が表示されるところまでを確認します。

---

## 3. 静的なJSXをコンポーネントへ移す

最初はまだデータを使いません。現在表示できているJSXを、そのまま別ファイルへ移します。

### Featuredを移す

`<section id="featured">`全体を、`FeaturedDrama/index.jsx`へカット＆ペーストします。

```jsx
// @/components/contents/FeaturedDrama/index.jsx

import Image from "next/image";

export default function FeaturedDrama() {
  return (
    <section id="featured">
      <h2>Featured</h2>

      <article className="featured">
        <div className="visual">
          <div className="img-wrapper">
            <Image
              src="/pict/truedetective.avif"
              alt="True Detectiveのサムネール"
              width={1920}
              height={1534}
            />
          </div>

          <div className="quote">
            “The World needs bad men.”
            <br />
            —Rust Cohle
          </div>

          <h3 className="title">True Detective</h3>

          <div className="score">10/10</div>
        </div>

        <p className="information">
          4 seasons / Crime ∙ Mystery
          <br />
          2014 / HBO
        </p>
      </article>
    </section>
  );
}
```

構造を整理すると、次のようになります。

```text
section#featured
├── h2
└── article.featured
    ├── .visual
    │   ├── .img-wrapper
    │   │   └── Image
    │   ├── .quote
    │   ├── h3.title
    │   └── .score
    └── p.information
```

### 作品一覧を移す

`<section id="dramas">`全体を、`DramaList/index.jsx`へカット＆ペーストします。

最初は作品を一件だけ残します。

```jsx
// @/components/contents/DramaList/index.jsx

import Image from "next/image";

export default function DramaList() {
  return (
    <section id="dramas">
      <h2 className="heading2">Dramas</h2>

      <ul className="list">
        <li className="item">
          <article className="card">
            <div className="img-wrapper">
              <Image
                src="/pict/strangerthings.avif"
                alt="Stranger Thingsのサムネール"
                width={1920}
                height={1076}
              />
            </div>

            <div className="score">9/10</div>

            <div className="body">
              <div className="heading">
                <span className="order"></span>
                <h3 className="title">Stranger Things</h3>
              </div>

              <p className="information">
                5 seasons / SF ∙ Juvenile
                <br />
                2016 / Netflix
              </p>
            </div>
          </article>
        </li>
      </ul>
    </section>
  );
}
```

構造を整理すると、次のようになります。

```text
section#dramas
├── h2
└── ul.list
    └── li.item
        └── article.card
            ├── .img-wrapper
            │   └── Image
            ├── .score
            └── .body
                ├── .heading
                │   ├── span.order
                │   └── h3.title
                └── p.information
```

この段階では、まだ同じ内容を直接書いています。ファイルを分けても表示内容が変わらないことを確認してください。

---

## 4. コンポーネントの親子関係を作る

`DramaArchive`から、二つのコンポーネントを呼び出します。

```jsx
// @/components/contents/DramaArchive/index.jsx

import FeaturedDrama from "@/components/contents/FeaturedDrama";
import DramaList from "@/components/contents/DramaList";

export default function DramaArchive() {
  return (
    <>
      <FeaturedDrama />
      <DramaList />
    </>
  );
}
```

これで、次の親子関係ができました。

```text
page.js
└── DramaArchive
    ├── FeaturedDrama
    └── DramaList
```

この時点では、親が子を呼び出しているだけです。まだデータの受け渡しは行っていません。

---

## 5. データを読み込み、内容を確認する

`DramaArchive`で、第5章に作った`dramas`を読み込みます。

```jsx
import { dramas } from "@/data/dramas";
```

まずは、作品タイトルだけの配列を作ってみます。

```jsx
const dramaTitleArray = dramas.map((drama) => {
  return drama.title;
});

console.log(dramaTitleArray);
```

ここでの`map()`は、画面を作るためではなく、配列の各作品から`title`を取り出すために使っています。

```text
作品オブジェクトの配列
↓ map()
タイトル文字列の配列
```

`DramaArchive`はServer Componentです。そのため、この`console.log()`はブラウザの開発者ツールではなく、`npm run dev`を実行しているターミナルへ表示されます。

次に、`featured: true`の作品を一件探します。

```jsx
const featuredContents = dramas.find((drama) => {
  return drama.featured;
});

console.log(featuredContents);
console.log(featuredContents.title);
```

`map()`と`find()`の違いを確認します。

```text
map()
→ 配列の全件を順番に処理して、新しい配列を作る

find()
→ 条件に合う最初の一件を返す
```

確認ができたら、練習用の`console.log()`は削除して構いません。

---

## 6. Featuredとその他の作品へ振り分ける

`DramaArchive`で、全作品を二つに分けます。

```jsx
// @/components/contents/DramaArchive/index.jsx

import FeaturedDrama from "@/components/contents/FeaturedDrama";
import DramaList from "@/components/contents/DramaList";
import { dramas } from "@/data/dramas";

export default function DramaArchive() {
  // Featuredに指定された一作品を取得する
  const featuredDrama = dramas.find((drama) => {
    return drama.featured;
  });

  // Featured以外を取得し、レビュー公開日時の新しい順に並べる
  const otherDramas = dramas
    .filter((drama) => {
      return !drama.featured;
    })
    .sort((a, b) => {
      return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
    });

  return (
    <>
      <FeaturedDrama drama={featuredDrama} />
      <DramaList dramas={otherDramas} />
    </>
  );
}
```

それぞれの処理は、次の役割を持ちます。

```text
find()
→ Featuredに使う一作品を取得する

filter()
→ Featuredではない作品をすべて取得する

sort()
→ 取得した作品をレビュー公開日時の新しい順に並べる
```

`publishedAt`は日時を表す文字列です。

```js
publishedAt: "2026-09-17T16:05:20+09:00"
```

`Date.parse()`は、この文字列を比較できるミリ秒の数値へ変換します。

```js
Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
```

`b - a`の順で比較するため、新しい日時が先になります。

`filter()`は新しい配列を返します。そのため、このあとに`sort()`しても元の`dramas`配列の順番は変更されません。

---

## 7. propsで子コンポーネントへ渡す

先ほどのJSXでは、次のように値を渡しました。

```jsx
<FeaturedDrama drama={featuredDrama} />
<DramaList dramas={otherDramas} />
```

名前を単数形と複数形に分けています。

```text
drama
→ 一作品

dramas
→ 複数作品の配列
```

データの流れは次のようになります。

```text
DramaArchive
├── featuredDramaを渡す
│   └── FeaturedDrama
└── otherDramasを渡す
    └── DramaList
```

コンポーネントだから、必ず自分でデータを読み込むわけではありません。

今回の`DramaArchive`は全作品を検索・分類し、`FeaturedDrama`と`DramaList`は、渡された内容を表示します。

必要な場所で一度データを整理し、表示を担当する子へ必要な値を渡すことで、処理の場所を判断しやすくしています。

---

## 8. FeaturedDramaでpropsを受け取る

`FeaturedDrama`は一作品を受け取ります。

```jsx
export default function FeaturedDrama({ drama }) {
```

`find()`で条件に合う作品が見つからなかった場合、`drama`は`undefined`になります。エラーを防ぐため、最初に確認します。

```jsx
if (!drama) return null;
```

プラットフォームとジャンルは配列なので、表示用の文字列へ変換します。

```jsx
const platforms = drama.platforms.join(" ・ ");
const genres = drama.genres.join(" ∙ ");
```

`join()`は配列の要素の間にだけ区切り文字を入れます。

```js
["Netflix"].join(" ・ ");
// "Netflix"

["HBO", "AWS"].join(" ・ ");
// "HBO ・ AWS"
```

一件だけの場合、末尾に区切り文字は付きません。

静的に書かれている次の内容を、`drama`のプロパティへ置き換えてください。

| 現在の固定内容 | 使用するデータ |
|---|---|
| 画像のパス | `drama.image` |
| 画像の代替テキスト | `drama.title` |
| 引用文 | `drama.quote` |
| 引用者 | `drama.quoteBy` |
| タイトル | `drama.title` |
| スコア | `drama.score` |
| シーズン数 | `drama.seasons` |
| ジャンル | `genres` |
| 公開年 | `drama.year` |
| 配信サービス | `platforms` |

固定文字列をすべて置き換えたら、`dramas.js`のFeatured作品を変更して、表示も変わることを確認します。

---

## 9. 一作品分をDramaCardへ移す

`DramaList`に残っている次の部分が、一作品分のカードです。

```text
article.card
├── .img-wrapper
├── .score
└── .body
```

`article.card`全体を、`DramaCard/index.jsx`へカット＆ペーストします。

`li.item`は一覧を構成する要素なので、`DramaList`側に残します。

```text
DramaList
└── ul.list
    └── li.item
        └── DramaCard
            └── article.card
```

`DramaCard`は一作品と、その表示順をpropsで受け取ります。

```jsx
export default function DramaCard({ drama, order }) {
```

表示順を2桁の文字列へ変換します。

```jsx
const displayOrder = String(order).padStart(2, "0");
```

```text
1  → "01"
2  → "02"
10 → "10"
```

カード内の固定内容を、次の値へ置き換えてください。

| 現在の固定内容 | 使用するデータ |
|---|---|
| 画像のパス | `drama.image` |
| 画像の代替テキスト | `drama.title` |
| スコア | `drama.score` |
| 番号 | `displayOrder` |
| タイトル | `drama.title` |
| シーズン数 | `drama.seasons` |
| ジャンル | `drama.genres.join(" ∙ ")` |
| 公開年 | `drama.year` |
| 配信サービス | `drama.platforms.join(" ・ ")` |

`DramaCard`自身は`dramas.js`を読み込みません。

```text
DramaCard
→ 渡された一作品をカードとして表示する
```

どの作品を何番目に表示するかは、一覧を担当する`DramaList`が決めます。

---

## 10. map()でDramaCardを必要な数だけ作る

現在の`DramaList`には、作品一件分を直接書いた`li`がありました。

これを、`map()`を使った処理へ置き換えます。

```jsx
// @/components/contents/DramaList/index.jsx

import DramaCard from "@/components/contents/DramaCard";

export default function DramaList({ dramas }) {
  return (
    <section id="dramas">
      <h2 className="heading2">Dramas</h2>

      <ul className="list">
        {/* ここにmap()を使った処理を書く */}
      </ul>
    </section>
  );
}
```

次の点を考えながら書いてください。

1. `map()`を実行する配列は何か
2. 現在処理している一作品を、何という変数で受け取るか
3. 何番目かを表す値を、何という変数で受け取るか
4. `li`の`key`には何を使うか
5. `DramaCard`へ、一作品と表示順をどう渡すか

```text
dramasに6作品ある
↓
map()が6回処理する
↓
liとDramaCardが6組作られる
```

`key`は画面には表示されません。Reactが一覧の各項目を安定して識別するために使用します。

配列の順番が変わっても作品を識別できるように、配列の位置ではなく、作品データの安定した`id`を使用します。

完成したら、講師側の完成コードと比較します。

---

## 11. CSS Modulesのクラス名へ接続する

この章ではSCSSの内容を作り直しません。事前に用意されたCSS ModuleとJSXを接続します。

例えば、次のグローバルクラスを、

```jsx
<article className="card">
```

次のように変更します。

```jsx
import styles from "./DramaCard.module.scss";
```

```jsx
<article className={styles.card}>
```

同じコンポーネント内で使用するクラスも、対応する`styles`のプロパティへ変更してください。

```text
"card"        → styles.card
"score"       → styles.score
"body"        → styles.body
"heading"     → styles.heading
"order"       → styles.order
"title"       → styles.title
"information" → styles.information
```

`img-wrapper`はサイト全体で共通して使用するグローバルクラスなので、文字列のまま残します。

```jsx
<div className="img-wrapper">
```

`DramaList`と`FeaturedDrama`も、それぞれの`.module.scss`に定義されているクラスへ接続します。

見た目を変更する作業ではなく、どのコンポーネントがどのスタイルを使用するかを明確にする作業です。

---

## 12. データを変更して確かめる

次の操作を一つずつ試してください。

1. `dramas`へ作品を一件追加する
2. `publishedAt`を変更する
3. `featured: true`を別の作品へ移す
4. `platforms`へ配信サービスを追加する

次の結果になれば成功です。

- JSXを複製しなくてもカードが増える
- `publishedAt`が新しい作品から順番に並ぶ
- Featured作品が通常一覧には表示されない
- `featured: true`を変更するとFeatured表示が変わる
- 複数の配信サービスが`・`で区切って表示される

---

## この章で作ったデータの流れ

```text
dramas.js
↓
DramaArchive
├── find()で一作品を取得
│   ↓
│   FeaturedDrama
│
└── filter()とsort()で一覧を作る
    ↓
    DramaList
    └── map()で一作品ずつ渡す
        ↓
        DramaCard
```

各コンポーネントの責任は次のようになります。

```text
DramaArchive
→ 全作品を検索・分類・並べ替えする

FeaturedDrama
→ Featuredの一作品を表示する

DramaList
→ 配列から一覧を作る

DramaCard
→ 一作品をカードとして表示する
```

---

## 今日の確認

- [ ] 静的なJSXをコンポーネントへ移せた
- [ ] コンポーネントの親子関係を説明できる
- [ ] `map()`と`find()`の違いを説明できる
- [ ] `filter()`でFeatured以外を取得できた
- [ ] `sort()`で公開日時の新しい順に並べられた
- [ ] 親から子へpropsで値を渡せた
- [ ] `DramaCard`が一作品だけを表示することを確認した
- [ ] `map()`から必要な数のカードを生成できた
- [ ] `key`に安定した`id`を使用した
- [ ] `join()`で配列を表示用の文字列へ変換できた
- [ ] CSS Modulesへクラス名を接続できた
- [ ] この段階ではクリック処理を追加していない

## Git

```bash
git add .
git commit -m "Render drama content from structured data"
```

## 補足
### Markdownのリンクを表示する

```bash
$ npm install react-markdown
```

`react-markdown` をインストール。レビュー本文はMarkdownで書きます。リンクは次のように記述します。

```md
[［Antibody］（https://antibody.tv/）](https://antibody.tv/)
```

JSXでは、`ReactMarkdown`を使ってレビューを表示します。

`ReactMarkdown` の `components` 属性に、リンクの変換方法を定義したオブジェクトを渡します。

```jsx
<ReactMarkdown
  components={{
    a: ({ node, children, ...props }) => (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  }}
>
  {drama.review}
</ReactMarkdown>
```

`children`にはリンクとして表示する文字が入り、`props`には`href`などの属性が入ります。

画面には、次のHTMLとして展開されます。

```html
<a
  href="https://antibody.tv/"
  target="_blank"
  rel="noopener noreferrer"
>
  ［Antibody］（https://antibody.tv/）
</a>
```

これにより、レビュー内に複数のリンクがあっても、すべて同じルールで新しいタブに表示できます。