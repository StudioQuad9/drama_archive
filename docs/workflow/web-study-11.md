
# 第11章　作品検索機能をつける

ここまでは、元のHTML版をNext.jsへ移植する作業でした。

ここからは、元のHTML版にはなかった検索機能を追加します。

この章で作る検索は、次の二つです。

```text
文字を入力する
→ 作品データ全体から検索する

ジャンルを選択する
→ そのジャンルを持つ作品を検索する
```

文字とジャンルの両方が指定されている場合は、両方の条件に合う作品を表示します。

```text
全文に「刑事」を含む
かつ
ジャンルにCrimeを持つ
↓
両方の条件に合う作品を一覧表示する
```

検索対象には、特集作品も含めます。

現状では、特集作品は画面上部へそのまま表示し、同じ作品が検索結果にも表示されることを暫定の仕様とします。

---

## 11. 検索条件をstateで持つ

`DramaArchive`へ二つのstateを追加します。

```jsx
// @/components/contents/DramaArchive/index.jsx

const [searchText, setSearchText] =
  useState("");

const [selectedGenre, setSelectedGenre] =
  useState("all");
```

役割は次のとおりです。

```text
searchText
→ 検索欄へ入力された文字

selectedGenre
→ 選択されたジャンル
```

初期値では、検索文字がなく、ジャンルも指定されていません。

```text
searchText
→ 空文字

selectedGenre
→ all

結果
→ 全作品を表示する
```

利用者の操作によって表示内容を変えるため`useState`を使います。

### 更新用関数も用意します。

```jsx
// 検索窓に入れる文字　input要素の入力されるたびに発火する
const [searchText, setSearchText] = useState("");
const handleSearchTextChange = (value) => {
  setSearchText(value);
};

// 単一のジャンルが入る
const [selectedGenre, setSelectedGenre] = useState("all");
const handleGenreChange = (value) => {
  setSelectedGenre(value)
};
```

---

## 12. データからジャンル一覧を作る

ジャンルの選択肢も、作品データから作ります。

```jsx
const genres = [
  ...new Set(
    dramas.flatMap((drama) => drama.genres),
  ),
];
```

処理を分けて確認します。

```text
flatMap()
→ 全作品のgenresを一つの配列にする

new Set()
→ 重複したジャンルを取り除く

[...]
→ Setを配列へ戻す
```

ジャンル名を検索用コンポーネントへ直接書かず、作品データから作ることが重要です。

新しいジャンルを`dramas.js`へ追加すると、検索欄の選択肢にも反映されます。

---

## 13. 全文検索の対象を作る

文字による検索では、作品データに含まれる文章全体から、入力された文字を探します。

今回の検索対象は次のとおりです。

```text
作品名
ジャンル
配信サービス
公開年
レビュータイトル
レビュー本文
引用文
登場人物名
```

画像パス、YouTube ID、内部管理用の`id`、`featured`の真偽値は検索対象にしません。

一作品分の検索対象を、一つの文字列へまとめます。

```jsx
const searchTarget = [
  drama.title,
  drama.genres.join(" "),
  drama.platforms.join(" "),
  String(drama.year),
  drama.reviewTitle,
  drama.review,
  drama.quote,
  drama.quoteBy,
]
  .filter(Boolean)
  .join(" ")
  .toLowerCase();
```

それぞれの処理を確認します。

```text
配列へ検索対象を入れる
↓
filter(Boolean)で空の値を除く
↓
join(" ")で一つの文字列へつなぐ
↓
toLowerCase()で小文字へ揃える
```

検索欄へ入力された文字も、小文字へ揃えます。

```jsx
const normalizedSearchText =
  searchText.trim().toLowerCase();
```

`trim()`によって、入力文字の前後にある空白を取り除きます。

大文字と小文字を揃えるため、次の入力は同じ文字として扱われます。

```text
netflix
NETFLIX
Netflix
```

---

## 14. 全文検索とジャンル検索を組み合わせる

作品データと検索条件を管理している、最上位の`DramaArchive`コンポーネントに検索機能を作ります。

`dramas`全体を`filter()`で調べ、全文検索とジャンル検索の条件に合う作品データだけを抽出します。

抽出した作品データは、画面へ表示する作品として`visibleDramas`へ格納します。

```jsx
// @/components/contents/DramaArchive/index.jsx

const visibleDramas = dramas.filter((drama) => {
  const searchTarget = [
    drama.title,
    drama.genres.join(" "),
    drama.platforms.join(" "),
    String(drama.year),
    drama.reviewTitle,
    drama.review,
    drama.quote,
    drama.quoteBy,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const matchesSearch =
    normalizedSearchText === "" ||
    searchTarget.includes(normalizedSearchText);

  const matchesGenre =
    selectedGenre === "all" ||
    drama.genres.includes(selectedGenre);

  return matchesSearch && matchesGenre;
});
```

二つの条件を分けて確認します。

```text
matchesSearch
→ 入力した文字を作品データに含んでいるか

matchesGenre
→ 選択したジャンルを持っているか
```

最後に、二つの条件を`&&`でつなぎます。

```jsx
return matchesSearch && matchesGenre;
```

```text
文字の条件に合う
かつ
ジャンルの条件に合う
↓
検索結果へ残す
```

条件ごとの結果は次のようになります。

```text
検索文字なし・ジャンルはすべて
→ 全作品を表示

検索文字あり・ジャンルはすべて
→ 全作品から全文検索

検索文字なし・ジャンルを選択
→ 選択したジャンルの作品を表示

検索文字あり・ジャンルを選択
→ 全文検索とジャンルの両方に合う作品を表示
```

`visibleDramas`は新しいstateではありません。

`dramas`、`searchText`、`selectedGenre`から、その都度計算できる値です。

---

## 15. DramaArchiveへ組み込む

```jsx
// @/components/contents/DramaArchive/index.jsx

"use client";

import { useState } from "react";
import FeaturedDrama from "@/components/contents/FeaturedDrama";
import DramaList from "@/components/contents/DramaList";
import DramaDetail from "@/components/contents/DramaDetail";
import Modal from "@/components/ui/Modal";
import { dramas } from "@/data/dramas"
import styles from "./DramaArchive.module.scss";

export default function DramaArchive() {

  const [selectedDrama, setSelectedDrama] = useState(null);
  const handleSelectDrama = (drama) => {
    setSelectedDrama(drama);
    setIsDramaModalOpen(true);
  };

  const [isDramaModalOpen, setIsDramaModalOpen] = useState(false);
  const handleCloseDrama = () => {
    setIsDramaModalOpen(false);
  };

  const [searchText, setSearchText] = useState("");

  const [selectedGenre, setSelectedGenre] = useState("all");

  // ジャンルを収集する
  const genres = [...new Set(dramas.flatMap((drama) => drama.genres))];

  // 検索欄へ入力された文字を小文字へ揃える
  const normalizedSearchText = searchText.trim().toLowerCase();

  // 無名関数の中の式で真になったドラマのデータをフィルタリングして収集する
  const visibleDramas = dramas.filter((drama) => {
    const searchTarget = [
      drama.title,
      drama.genres.join(" "),
      drama.platforms.join(" "),
      String(drama.year),
      drama.reviewTitle,
      drama.review,
      drama.quote,
      drama.quoteBy,
      // 全文検索の対象を作る
      // filter(Boolean)で空の値を除く
      // join(" ")で一つの文字列へつなぐ
    ].filter(Boolean).join(" ").toLocaleLowerCase();

    const matchesSearch = 
      // 検索文字がなければマッチとして作品に真を返す
      normalizedSearchText === "" ||
      searchTarget.includes(normalizedSearchText);

    const matchesGenre = 
      // ジャンルを絞り込まなくてもマッチしたとして真を返す
      selectedGenre === "all" ||
      drama.genres.includes(selectedGenre)

    return matchesSearch && matchesGenre;
  });

  const featuredDrama = dramas.find((drama) => {
    return drama.featured;
  });

  // 重要: dramas => visibleDramasへ変更
  const otherDramas = visibleDramas.filter((drama) => {
    return !drama.featured;
  }).sort((a, b) => {
    return Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  });
  
  return (
    <div className={styles.archive}>
      <FeaturedDrama 
        drama={featuredDrama} 
        onSelect={handleSelectDrama}
      />

      <DramaList 
        dramas={otherDramas} 
        onSelect={handleSelectDrama}
      />

      <Modal 
        isOpen={isDramaModalOpen}
        onClose={handleCloseDrama}
        ariaLabel={
          selectedDrama
            ? `${selectedDrama.title}のレビュー`
            : "作品レビュー"
        }
      >
        {
          isDramaModalOpen &&
          selectedDrama && 
            <DramaDetail 
              drama={selectedDrama} 
            />
        }
      </Modal>
    </div>
  );
}
```

`dramas => visibleDramas`としているので、動きを確認する。

作品を検索する処理ができたので、利用者が検索文字やジャンルを入力する機能を担当する`DramaSearchma`コンポーネントを作り、`DramaArchive`に読み込ませます。

位置は、`FeaturedDrama`と`DramaList`の間へ配置します。

```jsx
<FeaturedDrama />

<DramaSearch />

<DramaList />

<Modal />
```

役割は次のように分けます。

```text
DramaArchive
→ 検索条件をstateで管理する
→ 作品データを検索する

DramaSearch
→ 利用者が検索条件を入力する

DramaList
→ 全ドラマのリスト、または、検索結果を表示する
```

空でいいので、次のファイルを作ります。

```text
src/components/contents/DramaSearch/
├ index.jsx
└ DramaSearch.module.scss
```

`DramaArchive`に戻り、ファイルの先頭で`DramaSearch`を読み込みます。

```jsx
import DramaSearch from "@/components/contents/DramaSearch";
```

`DramaSearch`に必要な状態や更新用関数をpropsで送ります。

```jsx
<FeaturedDrama
  drama={featuredDrama}
  onSelect={handleSelectDrama}
/>

<DramaSearch
  genres={genres}
  searchText={searchText}
  onSearchTextChange={handleSearchTextChange}
  selectedGenre={selectedGenre}
  onGenreChange={handleGenreChange}
/>

<DramaList
  // 改めてこちらに変更はなし
  dramas={otherDramas}
  onSelect={handleSelectDrama}
/>
```

特集作品は常に表示します。

検索結果には`dramas`全体を使用しているため、条件に合えば特集作品も表示されます。

```text
FeaturedDrama
→ 特集作品として常に表示する

DramaList
→ 特集を含む全作品から検索した結果を表示する
```

---

## 15. DramaSearchを作る

```jsx
// @/components/contents/DramaSearch/index.jsx

import styles from "./DramaSearch.module.scss";

export default function DramaSearch({
  genres,
  searchText,
  selectedGenre,
  onSearchTextChange,
  onGenreChange,
}) {
  return (
    <div className={styles.search}>
      <label className={styles.field}>
        <span>全文検索</span>

        <input
          type="search"
          value={searchText}
          placeholder="作品名やレビューを検索"
          onChange={(event) =>
            onSearchTextChange(event.target.value)
          }
        />
      </label>

      <label className={styles.field}>
        <span>ジャンル</span>

        <select
          value={selectedGenre}
          onChange={(event) =>
            onGenreChange(event.target.value)
          }
        >
          <option value="all">
            すべて
          </option>

          {genres.map((genre) => (
            <option
              key={genre}
              value={genre}
            >
              {genre}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
```

`DramaSearch`は、現在の検索条件をpropsで受け取ります。

入力された文字やジャンルを、自分のstateとして保存しません。

```text
検索欄へ入力する
↓
onSearchTextChangeへ文字を渡す
↓
DramaArchiveのsearchTextが変わる
```

```text
ジャンルを選択する
↓
onGenreChangeへジャンルを渡す
↓
DramaArchiveのselectedGenreが変わる
```

### DramaSearchのSCSS

```scss
// @/components/contents/DramaSearch/DramaSearch.module.scss

@use "@/styles/shared" as *;

.search {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: .5rem;
  width: 100%;
  max-width: 500px;
  margin-inline: auto;
}

.field {
  display: grid;
  min-width: 0;
  & > span {
    display: inline-block;
    margin-bottom: .3em;
    font-size: .85rem;
    font-weight: 700;
    color: rgba($color: $color-black, $alpha: .7);
  }
  & > input,
  & > select {
    min-width: 0;
    height: 2rem;
    padding-inline: .5em;
    color: rgba($color: $color-black, $alpha: .7);
    border: 1px solid rgba($color: $color-black, $alpha: .5);
    border-radius: 5px;    
    &:focus-visible {
      outline: 3px solid rgb(var(--accent));
      outline-offset: 2px;
    }
  }
}
```

---

## 16. DramaListへ検索結果を渡す

`DramaList`へ渡す配列を、`visibleDramas`へ変更します。

```jsx
<DramaList
  dramas={visibleDramas}
  onSelect={handleSelectDrama}
/>
```

検索結果が0件の場合も表示します。

```jsx
// @/components/contents/DramaList/index.jsx

import DramaCard from "@/components/contents/DramaCard";
import styles from "./DramaList.module.scss";

export default function DramaList({ dramas, onSelect, searchText, selectedGenre }) {
  // console.log(dramas.length);
  // console.log(searchText, selectedGenre);
  return (
    <section id="dramas">
      <h2 className={styles.heading2}>Dramas</h2>

      {
        searchText.trim() !== "" || selectedGenre !== "all"
          ? dramas.length !== 0
            ? <p>{dramas.length}件の作品が該当しました。</p>
            : <p>該当する作品はありません。</p>
          : null
      }

      <ul className={styles.list}>
        {dramas.map((drama, index) => (
          <li
            key={drama.id}
            className={styles.item}
          >
            <DramaCard
              drama={drama}
              order={index + 1}
              onSelect={onSelect}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
```

検索結果の件数も、`dramas.length`から表示しています。

ただ、このままでは、特集の記事が検索結果に反映されません。
以下で対応します。

```jsx
// @/components/contents/DramaArchive/index.jsx

  const otherDramas = visibleDramas.filter((drama) => {
    // console.log(!drama.featured);
    return searchText !== "" || selectedGenre !== "all"
      ? true
      : !drama.featured
  }).sort((a, b) => {
    return Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  });
```

---

## 18. データの流れを確認する

全文検索の流れは次のとおりです。

```text
検索欄へ文字を入力する
↓
searchTextが変わる
↓
作品ごとにsearchTargetを作る
↓
入力文字を含む作品だけを残す
↓
DramaListが検索結果をmap()する
```

ジャンル検索の流れは次のとおりです。

```text
ジャンルを選択する
↓
selectedGenreが変わる
↓
そのジャンルを持つ作品だけを残す
↓
DramaListが検索結果をmap()する
```

両方が指定されている場合は、二つの条件に合う作品だけを表示します。

DOMを直接削除・追加していません。

データとstateから、その時点で必要な作品一覧をReactに作ってもらっています。

---

## 19. 並べ替えは発展課題にする

この章では、全文検索とジャンル検索までを実装します。

評価順や公開年順の並べ替えは、発展課題とします。

```text
今回作る
→ 全文検索
→ ジャンル検索

発展課題
→ 評価が高い順
→ 公開年が新しい順
→ 登録順へ戻す
```

並べ替えを追加する場合も、考え方は同じです。

```text
検索して絞り込んだ配列
↓
配列を複製する
↓
sort()で並べ替える
↓
DramaListへ渡す
```

検索の基本を理解したあと、関心があれば自分で機能を追加してください。

---

## 20. 公開後の更新を確認する

GitHub Pagesを一度設定すると、その後の更新も同じ流れです。

```text
作業用branchで修正する
↓
lintとbuildを確認する
↓
Pull Requestで確認する
↓
mainへ統合する
↓
GitHub Actionsが自動で公開する
```

検索機能を完成させて`main`へ統合すると、公開済みのサイトにも検索機能が反映されます。

---

## 今日の確認

- [ ] 全文検索用の`searchText`をstateで管理した
- [ ] ジャンル検索用の`selectedGenre`をstateで管理した
- [ ] 作品データからジャンルの選択肢を作った
- [ ] `flatMap()`でジャンルの配列を一つにまとめた
- [ ] `Set`を使って重複したジャンルを取り除いた
- [ ] 作品データから全文検索の対象文字列を作った
- [ ] 検索文字の前後の空白を取り除いた
- [ ] 大文字と小文字を区別せず検索できた
- [ ] 全文検索とジャンル検索を組み合わせた
- [ ] 検索条件を`DramaSearch`から`DramaArchive`へ渡した
- [ ] 検索結果を`DramaList`へ渡した
- [ ] 検索結果の件数を表示した
- [ ] 該当作品が0件の場合の表示を用意した
- [ ] 検索時は特集作品も検索結果へ含めた
- [ ] `visibleDramas`を新しいstateにせず、既存のデータとstateから計算した
- [ ] 検索条件が変わると作品一覧が再表示される流れを確認した

## Git

```bash
git add .
git commit -m "Add full-text and genre search"
git push
```