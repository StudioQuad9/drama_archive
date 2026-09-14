# 第6章　作品情報をデータへ分離する

## 目的

作品の内容と、画面の形を分けます。

## 1. データの形を決める

```js
// src/data/dramas.js
export const dramas = [
  {
    id: "true-detective",
    title: "True Detective",
    image: "/pict/truedetective.avif",
    score: 10,
    seasons: 4,
    genre: ["Crime", "Mystery"],
    year: 2014,
    platform: "HBO",
    featured: true,
    large: false,
    quote: "“The World needs bad men.”",
    quoteBy: "Rust Cohle",
    youtubeId: "jdu3hAAmFtk",
    reviewTitle: "マスターピース",
    review: [
      "1シーズン完結型。シーズンごとに内容が大きく異なる。",
      "どのシーズンも素晴らしいのだが、やはりシーズン1が別格。",
    ],
  },
  {
    id: "stranger-things",
    title: "Stranger Things",
    image: "/pict/strangerthings.avif",
    score: 9,
    seasons: 5,
    genre: ["SF", "Juvenile"],
    year: 2016,
    platform: "NETFLIX",
    featured: false,
    large: false,
    youtubeId: "6HkQ5ys3vEY",
    reviewTitle: "三つ星レストランのジャンル全盛り丼",
    review: ["NETFLIXの看板ドラマの1つ。加入したらまず観てほしい名作。"],
  },
];
```

実際には、元HTMLにある全作品とレビュー全文を移します。文章を一つの長い文字列へ入れるより、段落の配列にすると表示方法を変更しやすくなります。

## 2. IDの役割

`id`はReactが一覧を識別するとき、モーダルで選択作品を識別するとき、将来URLを作るときに使えます。

タイトルをそのままIDにせず、半角英数の安定した値にします。

## 3. データに入れないもの

次のような見た目の指定は、基本的にデータへ入れません。

```js
color: "yellow"
fontSize: "24px"
marginTop: "20px"
```

データは内容、SCSSは見た目を担当します。ただし、`featured`や`large`のような表示上の意味を示す値はデータとして持てます。

## 今日の確認

- [ ] 全作品に重複しないIDがある
- [ ] 作品情報と見た目の指定を分けた
- [ ] レビュー全文が失われていない
- [ ] データだけを見て内容を更新できる

## Git

```bash
git add .
git commit -m "Move drama content into structured data"
```
