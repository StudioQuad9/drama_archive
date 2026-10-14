# 第9章　カードのModalを作る ― 共通Modalの応用

## 目的

第8章で作成した共通Modalを再利用し、選択した作品のレビューを表示します。

今回作る動きは次のとおりです。

```text
特集作品または通常の作品カードを選択する
↓
どの作品が選択されたかを保存する
↓
共通Modalを開く
↓
選択した作品のレビューを表示する
```

動画部分は、次のように動かします。

```text
開く
↓
DramaDetailとiframeを生成する
↓
iframeの読み込み後、動画をフェードインする

閉じる
↓
DramaDetailとiframeを削除する
↓
YouTubeの再生と音声を止める
```

新しいModalを作る章ではありません。

第5章から第8章までに作った、次の仕組みを組み合わせます。

```text
作品データ
props
useState
イベント処理
children
共通Modal
createPortal
```

---

## 1. 元のHTMLの動きを確認する

元のHTMLでは、作品カードに`open-modal`クラスと`data-modal`属性が書かれていました。

```html
<article
  class="drama open-modal"
  data-modal="modal-stranger-things"
>
  <!-- カードの内容 -->
</article>
```

カードをクリックすると、`data-modal`に書かれたIDと同じModalを探して表示していました。

```html
<section
  id="modal-stranger-things"
  class="modal"
>
  <div class="modal-content">
    <!-- Stranger Thingsのレビュー -->
  </div>
</section>
```

つまり、元のHTMLの動きは次のとおりです。

```text
作品カード全体をクリックする
↓
その作品に対応するModalを探す
↓
作品レビューを表示する
```

---

## 2. HTML版とReact版の違いを考える

HTML版では、作品ごとにModalが用意されていました。

```text
Stranger Thingsのカード
Stranger ThingsのModal

Mindhunterのカード
MindhunterのModal

Mandalorianのカード
MandalorianのModal
```

Reactでは、作品データがすでに`dramas`配列へまとまっています。

そのため、作品ごとにModalを作る必要はありません。

```text
選択された作品データ
↓
一つの共通Modal
↓
DramaDetailの内容を入れ替える
```

特集作品と通常の作品カードも、同じModalを利用できます。

---

## 3. コンポーネント全体の構造を考える

特集作品と通常作品の両方を管理しているコンポーネントは、`DramaArchive`です。

そのため、共通Modalも`DramaArchive`へ一つだけ置きます。

```jsx
<FeaturedDrama />

<DramaList />

<Modal>
  <DramaDetail />
</Modal>
```

コンポーネントの関係は次のようになります。

```text
DramaArchive
├ FeaturedDrama
├ DramaList
│  └ DramaCard × 作品数
└ Modal
   └ DramaDetail
```

Reactのコード上では、Modalは`DramaArchive`の中にあります。

しかし、第8章で実装した`createPortal`によって、実際のDOMでは`body`の最後へ表示されます。

```text
React上の位置

DramaArchive
└ Modal
   └ DramaDetail

        ↓ createPortal

実際のDOM

body
├ header
├ main
├ footer
└ Modal
   └ DramaDetail
```

そのため、特集作品から開いても通常カードから開いても、同じModalをページ全体へ表示できます。

---

## 4. Modalに必要な情報を考える

作品レビューを表示するModalには、次の情報が必要です。

```text
どの作品を表示するか
Modalを開いているか
Modalを閉じるときに何をするか
Modalの中へ何を表示するか
```

それぞれ、次の値で管理します。

```text
selectedDrama
→ 選択された作品

isDramaModalOpen
→ Modalを開いているか

handleCloseDrama
→ Modalを閉じる関数

DramaDetail
→ Modalの中へ表示する内容
```

---

## 5. DramaArchiveをClient Componentにする

`DramaArchive`で`useState`を使用するため、ファイルの先頭へ`"use client"`を書きます。

```jsx
// @/components/contents/DramaArchive/index.jsx

"use client";

import { useState } from "react";
```

第6章の`DramaArchive`は、作品を表示するだけでした。

```text
作品データを読み込む
↓
作品を分ける
↓
表示する
```

今回は、利用者がどの作品を選択したかをstateで管理します。

```text
利用者が作品を選択する
↓
stateが変わる
↓
Modalの表示内容が変わる
```

そのため、`DramaArchive`をClient Componentへ変更します。

---

## 6. 選択作品と開閉状態を作る

`DramaArchive`に二つのstateを作ります。

```jsx
const [selectedDrama, setSelectedDrama] =
  useState(null);

const [isDramaModalOpen, setIsDramaModalOpen] =
  useState(false);
```

役割は異なります。

```text
selectedDrama
→ Modalへ何を表示するか

isDramaModalOpen
→ Modalを表示するか隠すか
```

初期状態は次のとおりです。

```text
selectedDrama
→ null
→ まだ作品を選択していない

isDramaModalOpen
→ false
→ Modalは閉じている
```

### 第8章のModalをそのまま再利用する

第8章では、Modalの中へ常に同じ`MobileMenu`を入れていました。

```jsx
<Modal>
  <MobileMenu />
</Modal>
```

Modalの中身は常に`MobileMenu`だったため、必要だったのは開閉状態だけです。

```text
isMenuOpen
→ MobileMenuを表示するか隠すか
```

第9章でも、Modalの仕組みは変わりません。

第8章で作った次の機能を、そのまま使用します。

```text
createPortalでbody直下へ表示する
背景クリックで閉じる
Escapeキーで閉じる
背景スクロールを止める
開閉アニメーションを実行する
childrenを受け取る
```

新しいModalを作るわけでも、Modalの内部を書き換えるわけでもありません。

異なるのは、Modalへ入れる内容です。

```text
第8章
→ 常にMobileMenuを表示する

第9章
→ 選択された作品のDramaDetailを表示する
```

そこで第9章では、開閉状態に加えて「どの作品を表示するか」も覚える必要があります。

```text
isDramaModalOpen
→ Modalを開閉する

selectedDrama
→ Modalへ表示する作品を切り替える
```

### なぜstateを二つ使うのか

作品レビューでは、次の二つを別々に管理します。

```text
selectedDrama
→ どの作品を表示するか

isDramaModalOpen
→ Modalを開くか閉じるか
```

作品を選択すると、`selectedDrama`へ作品データを保存し、`isDramaModalOpen`を`true`にします。

```text
作品を選択する
↓
selectedDramaへ作品データを保存する
↓
isDramaModalOpenをtrueにする
↓
一枚のModalへDramaDetailを表示する
```

作品数が増えても、作品ごとのModalは作りません。一枚のModalを再利用し、`selectedDrama`によって中身だけを入れ替えます。

閉じるときは、`isDramaModalOpen`だけを`false`にします。

```text
isDramaModalOpenがfalseになる
↓
Modal本体はDOMへ残り、CSSで閉じる
↓
DramaDetailとiframeは削除する
↓
YouTubeの再生と音声が止まる
```

`children`とpropsを変更するだけで、同じModalを別の用途へ再利用します。

```jsx
// 第8章
<Modal>
  <MobileMenu />
</Modal>
```

```jsx
// 第9章
<Modal>
  <DramaDetail drama={selectedDrama} />
</Modal>
```

二つのstateは同じ情報を重複しているのではありません。

```text
何を表示するか
開いているか
```

という、別々の役割を担当しています。

---

## 7. 作品を選択する関数を作る

作品が選択されたときに実行する関数を作ります。

```jsx
// @/components/contents/DramaArchive/index.jsx

const handleSelectDrama = (drama) => {
  setSelectedDrama(drama);
  setIsDramaModalOpen(true);
};
```

処理の流れは次のとおりです。

```text
作品カードを選択する
↓
選択された作品データを受け取る
↓
selectedDramaへ保存する
↓
isDramaModalOpenをtrueにする
↓
Modalが開く
```

例えば、Stranger Thingsのカードが選択された場合は、次のようになります。

```jsx
handleSelectDrama(strangerThingsのデータ);
```

結果は次のとおりです。

```text
selectedDrama
→ Stranger Thingsの作品データ

isDramaModalOpen
→ true
```

---

## 8. Modalを閉じる関数を作る

Modalを閉じる関数を作ります。

```jsx
// @/components/contents/DramaArchive/index.jsx

const handleCloseDrama = () => {
  setIsDramaModalOpen(false);
};
```

この関数が変更するのは、Modalの開閉状態だけです。

```text
isDramaModalOpen
→ falseになる
→ Modalを閉じる
```

選択した作品が入っている`selectedDrama`は、ここでは変更しません。

```text
selectedDrama
→ 選択した作品データを保持したまま
```

このあとに記述していく`DramaDetail`は次の条件で表示させます。

```jsx
isDramaModalOpen &&
selectedDrama &&
  <DramaDetail drama={selectedDrama} />
```

Modalを閉じると、`isDramaModalOpen`が`false`になるため、この条件が成立しなくなります。

```text
Modalを閉じる
↓
isDramaModalOpenがfalseになる
↓
表示条件が成立しなくなる
↓
DramaDetailがDOMから削除される
↓
DramaDetail内のiframeも削除される
↓
YouTubeの再生と音声が止まる
```

ここで重要なのは、作品データと画面上の要素は別だということです。

```text
selectedDrama
→ Reactのstateに作品データとして残る

DramaDetailとiframe
→ DOMから削除される
```

`selectedDrama`が残っていても、`DramaDetail`が生成されていないため、動画は表示も再生もされません。

第8章で作ったModal本体はDOMへ残ります。そのため、Modal本体ではCSSによる閉じるアニメーションを実行できます。

```text
Modal本体
→ DOMへ残してCSSで閉じる

DramaDetailとiframe
→ DOMから削除して動画を止める
```

次に別の作品を選択すると、`selectedDrama`は新しく選択した作品データへ置き換わります。

そのため、今回の実装では、Modalを閉じるときに`selectedDrama`を`null`へ戻さなくても問題ありません。

---

## 9. DramaArchiveへModalを置く

`FeaturedDrama`と`DramaList`のあとへ、共通Modalを置きます。

```jsx
// @/components/contents/DramaArchive/index.jsx

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
```

Modalへ渡しているpropsを確認します。

```text
isOpen
→ isDramaModalOpenのtrue・false

onClose
→ handleCloseDrama関数

ariaLabel
→ 選択作品のレビューであることを伝える

children
→ DramaDetail
```

`DramaDetail`を表示する条件は二つあります。

```jsx
isDramaModalOpen && selectedDrama
```

```text
isDramaModalOpenがtrue
かつ
selectedDramaに作品データがある
↓
DramaDetailを生成する
```

まだ作品が選択されていないとき、`selectedDrama`は`null`です。そのため、`DramaDetail`は生成されません。

Modalを閉じると、`isDramaModalOpen`が`false`になります。

```text
isDramaModalOpenがfalse
↓
条件が成立しない
↓
DramaDetailを削除する
↓
中にあるiframeも削除される
↓
YouTubeの再生と音声が止まる
```

Modal本体は削除しません。第8章で作った仕組みをそのまま利用し、CSSによる閉じるアニメーションを実行します。

---

## 10. 選択用の関数を子へ渡す

ここまでで、`DramaArchive`に二つのstateと、それらを変更する関数を作りました。

```text
selectedDrama
→ 選択した作品データを保存する

isDramaModalOpen
→ Modalの開閉状態を保存する

handleSelectDrama
→ 作品を保存してModalを開く
```

ただし、関数を作っただけでは、まだ何も起こりません。

実際に利用者がクリックするのは、`DramaArchive`ではなく、画面に表示されている特集作品や通常の作品カードです。

```text
特集作品をクリックする
または
通常の作品カードをクリックする
↓
クリックした作品のデータを取得する
↓
selectedDramaへ保存する
↓
isDramaModalOpenをtrueにする
↓
Modalを開く
```

この処理を行う関数が、先ほど作った`handleSelectDrama`です。

```jsx
const handleSelectDrama = (drama) => {
  setSelectedDrama(drama);
  setIsDramaModalOpen(true);
};
```

この関数へ作品データを渡して実行すれば、選択作品が保存され、Modalが開きます。

```jsx
handleSelectDrama(drama);
```

しかし、`handleSelectDrama`は親である`DramaArchive`にあり、実際にクリックされる要素は子である`FeaturedDrama`と`DramaCard`にあります。

そこで、クリックされた場所から関数を実行できるよう、`handleSelectDrama`をpropsで子へ渡します。

```jsx
// @/components/contents/DramaArchive/index.jsx

<FeaturedDrama
  drama={featuredDrama}
  onSelect={handleSelectDrama}
/>

<DramaList
  dramas={otherDramas}
  onSelect={handleSelectDrama}
/>
```

ここでは、子へ渡すときに、props名を`onSelect`としています。

```text
handleSelectDrama
→ 親で宣言した関数名

onSelect
→ 子へ渡すprops名
```

`onSelect`には、`handleSelectDrama`関数そのものが入っています。

```text
DramaArchive
│
├ featuredDrama
│  ↓
│ FeaturedDrama
│
├ otherDramas
│  ↓
│ DramaList
│
└ handleSelectDrama
   ↓ onSelectという名前で渡す
   FeaturedDramaとDramaList
```

この段階では、関数を渡す通路を作っただけです。

次に、`FeaturedDrama`と`DramaCard`のクリック処理から`onSelect(drama)`を実行します。

```text
親が関数を作る
↓
propsで子へ渡す
↓
子のクリック処理で関数を実行する
↓
クリックした作品データが親へ届く
↓
親のstateが変わる
↓
Modalが開く
```

`DramaArchive`が選択状態を管理し、子コンポーネントは「自分の作品が選択された」と親へ伝えます。

---

## 11. DramaListは関数をDramaCardへ渡す

`DramaList`は、通常作品の配列を受け取り、`map()`で`DramaCard`を作っています。

ここへ`onSelect`を追加します。

```jsx
// @/components/contents/DramaList/index.jsx

import DramaCard from "@/components/contents/DramaCard";
import styles from "./DramaList.module.scss";

export default function DramaList({
  dramas,
  onSelect,
}) {
  return (
    <section id="dramas">
      <h2 className={styles.heading2}>
        Dramas
      </h2>

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

`DramaList`自身は、Modalを開きません。

親から受け取った`onSelect`を、それぞれの`DramaCard`へ渡します。

```text
DramaArchive
↓ onSelect

DramaList
↓ onSelect

DramaCard
```

関数もpropsとして、親から子へ渡せます。

---

## 12. DramaCard全体を選択できるようにする

`DramaCard`で`onSelect`を受け取ります。

```jsx
// @/components/contents/DramaCard/index.jsx

export default function DramaCard({
  drama,
  order,
  onSelect,
}) {
```

カードがクリックされたとき、そのカードが持っている`drama`を渡します。

```jsx
<article
  className={styles.card}
  onClick={() => onSelect(drama)}
>
```

これまでは、クリック時に実行する関数へ引数を渡す必要がなかったため、関数名をそのまま書いていました。

```jsx
onClick={handleToggleMenu}
onClick={onClose}
```

今回は、どの作品が選択されたのかを親へ伝える必要があります。

そのため、クリックされたカードが持っている`drama`を、`onSelect`の引数として渡します。

```jsx
onSelect(drama)
```

ただし、次のようには書けません。

```jsx
onClick={onSelect(drama)}
```

この書き方では、クリックを待たず、コンポーネントが表示される処理中に`onSelect(drama)`が実行されます。

そこで、無名関数で包みます。

```jsx
onClick={() => onSelect(drama)}
```

処理の流れは次のとおりです。

```text
コンポーネントを表示する
↓
無名関数をonClickへ渡す
↓
この時点ではonSelectを実行しない
↓
カードがクリックされる
↓
無名関数が実行される
↓
onSelect(drama)が実行される
↓
クリックした作品データが親へ渡る
```

引数が不要な場合は、関数をそのまま渡せます。

```jsx
onClick={onClose}
```

引数を指定してクリック時に実行したい場合は、無名関数で包む書き方が一般的です。

```jsx
onClick={() => onSelect(drama)}
```

「無名関数にラップして、クリック時まで実行を待たせる」という理解で正しいです。
この処理によって、それぞれのカードから異なる作品データが渡されます。

```text
Stranger Thingsを選択
→ onSelect(Stranger Thingsのデータ)

Mindhunterを選択
→ onSelect(Mindhunterのデータ)

Boschを選択
→ onSelect(Boschのデータ)
```

### DramaCardの完成形

```jsx
// @/components/contents/DramaCard/index.jsx

import Image from "next/image";
import styles from "./DramaCard.module.scss";

export default function DramaCard({
  drama,
  order,
  onSelect,
}) {
  const displayOrder =
    String(order).padStart(2, "0");

  return (
    <article
      className={styles.card}
      onClick={() => onSelect(drama)}
    >
      <div className="img-wrapper">
        <Image
          src={drama.image}
          alt={`${drama.title}のサムネール`}
          width={1920}
          height={1076}
        />
      </div>

      <div className={styles.score}>
        {drama.score}/10
      </div>

      <div className={styles.body}>
        <div className={styles.heading}>
          <span className={styles.order}>
            {displayOrder}
          </span>

          <h3 className={styles.title}>
            {drama.title}
          </h3>
        </div>

        <p className={styles.information}>
          {drama.seasons} seasons /{" "}
          {drama.genres.join(" ∙ ")}
          <br />
          {drama.year} /{" "}
          {drama.platforms.join(" ∙ ")}
        </p>
      </div>
    </article>
  );
}
```

カードが操作できることが分かるよう、SCSSへ次の設定を追加します。

```scss
// @/components/contents/DramaCard/DramaCard.module.scss

.card {
  cursor: pointer;
}
```

既存の`.card`がある場合は、その中へ追加します。

---

## 13. 元のHTMLからDramaDetailを作る

ここまでで、作品を選択し、Modalを開くためのデータの流れができました。

次に、Modalの中へ表示する`DramaDetail`を作ります。

```text
src/components/contents/DramaDetail/
├ index.jsx
└ DramaDetail.module.scss
```

元のHTMLでは、レビュー部分が次の構造になっていました。

```html
<div class="modal-content">
  <h4>Stranger Things</h4>

  <div class="youtube">
    <iframe></iframe>
  </div>

  <h5>
    三つ星レストランのジャンル全盛り丼
  </h5>

  <p class="review">
    レビュー本文
  </p>
</div>
```

この構造を、作品データから表示できるJSXへ変更します。

```jsx
// @/components/contents/DramaDetail/index.jsx

"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./DramaDetail.module.scss";

export default function DramaDetail({ drama }) {
  const [isVideoLoaded, setIsVideoLoaded] =
    useState(false);

  return (
    <article className={styles.detail}>
      <h2 className={styles.title}>
        {drama.title}
      </h2>

      <div className={styles.youtube}>
        <iframe
          className={
            isVideoLoaded
              ? styles.isLoaded
              : ""
          }
          src={`https://www.youtube-nocookie.com/embed/${drama.youtubeId}`}
          title={`${drama.title}の動画`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsVideoLoaded(true)}
        />
      </div>

      <h3 className={styles.reviewTitle}>
        {drama.reviewTitle}
      </h3>

      <div className={styles.review}>
        <ReactMarkdown
          components={{
            a: ({ children, href, title }) => (
              <a
                href={href}
                title={title}
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
      </div>
    </article>
  );
}
```

`DramaDetail`は、作品の選択やModalの開閉を管理しません。

```text
どの作品を選択したか
→ DramaArchiveが管理する

Modalを開くか閉じるか
→ DramaArchiveが管理する

iframeの読み込みが終わったか
→ DramaDetailが管理する
```

`DramaDetail`が管理するのは、動画をフェードインするための小さな状態だけです。

---

## 14. 動画を読み込み後に表示する

Modalを開くと、先にModalやレビュー本文が表示され、そのあとからYouTubeのiframeが読み込まれます。

何も対策しない場合、動画だけが少し遅れて急に現れるため、画面が引っ掛かるように見えます。

そこで、iframeの読み込み状態を管理します。

```jsx
const [isVideoLoaded, setIsVideoLoaded] =
  useState(false);
```

初期値は`false`です。

```text
isVideoLoaded
→ false
→ iframeはまだ読み込み中
```

iframeの`onLoad`へ更新処理を書きます。

```jsx
onLoad={() => setIsVideoLoaded(true)}
```

YouTubeのiframeが読み込まれると、`isVideoLoaded`が`true`になります。

```text
iframeの読み込みが完了する
↓
onLoadが実行される
↓
setIsVideoLoaded(true)を実行する
↓
isVideoLoadedがtrueになる
```

読み込み状態に応じて、iframeへクラスを追加します。

```jsx
className={
  isVideoLoaded
    ? styles.isLoaded
    : ""
}
```

```text
isVideoLoadedがfalse
→ クラスを付けない
→ opacity: 0

isVideoLoadedがtrue
→ isLoadedクラスを付ける
→ opacity: 1
```

これにより、iframeの読み込みが終わってから動画をふわっと表示できます。

なお、`onLoad`が表すのは、YouTubeのiframeが読み込まれたことです。動画の再生データがすべて読み込まれた、という意味ではありません。

全体の流れは次のとおりです。

```text
作品カードを選択する
↓
selectedDramaへ作品データを保存する
↓
isDramaModalOpenをtrueにする
↓
DramaDetailとiframeを生成する
↓
isVideoLoadedはfalseから始まる
↓
iframeの読み込みが完了する
↓
isVideoLoadedをtrueにする
↓
isLoadedクラスが付く
↓
動画がフェードインする
```

閉じる場合は、次のように動きます。

```text
閉じるボタンまたは背景をクリックする
↓
isDramaModalOpenをfalseにする
↓
DramaDetailを削除する
↓
iframeも削除する
↓
YouTubeの再生と音声が止まる
```

Modalの開閉機能は、第8章で作ったものをそのまま使用しています。

追加したのは、次の二点です。

```text
DramaDetailを、Modalが開いている間だけ生成する

iframeの読み込み後にisLoadedクラスを付ける
```

---

## 15. DramaDetailのSCSSを書く

元のHTMLの`.modal-content`に書かれていた役割を、`DramaDetail`へ移します。

```scss
// @/components/contents/DramaDetail/DramaDetail.module.scss

@use "@/styles/shared" as *;

.detail {
  @include content-width (
    $max-width: 800px,
    $width: 90%
  );
  max-height: 100vh;
  padding: 0 20px 20px;
  background-color: rgba($color: $color-black-dark, $alpha: .9);
  overflow-y: auto;
}

.title {
  margin-bottom: 16px;
  color: rgb(var(--accent));
}

.youtube {
  width: 100%;
  margin-inline: auto;
  background-color: $color-black-dark;

  & > iframe {
    display: block;
    width: 100%;
    border: 0;
    aspect-ratio: 16 / 9;
    opacity: 0;
    transition: opacity .2s ease-in-out;
    &.isLoaded {
      opacity: 1;
    }
  }
}

.reviewTitle {
  margin-top: 20px;
  color: $color-white;
}

.review {
  margin: 20px 0 0;
  color: $color-white;
  line-height: 1.6;

  & p {
    text-align: justify;
    white-space: pre-line;
  }

  & a {
    color: rgb(var(--accent));
  }
}
```

iframeは最初、`opacity: 0`で見えない状態です。

```scss
opacity: 0;
transition: opacity .2s ease-in-out;
```

読み込みが完了して`isLoaded`クラスが付くと、`opacity: 1`へ変わります。

```scss
&.isLoaded {
  opacity: 1;
}
```

`transition`によって、動画が急に現れず、ゆっくり表示されます。

`review`は、改行を含む一つの文字列として`dramas.js`へ保存されています。

```jsx
review: `
1行目のレビュー。
2行目のレビュー。
3行目のレビュー。
`.trim(),
```

`white-space: pre-line`を指定することで、データ内の改行を画面上でも表示できます。

Markdownで書いたリンクは、`ReactMarkdown`によって`a`要素へ変換されます。

---

## 16. ここまでのDramaArchive

これまでの処理を`DramaArchive`へまとめます。

```jsx
// @/components/contents/DramaArchive/index.jsx

"use client";

import { useState } from "react";
import FeaturedDrama from "@/components/contents/FeaturedDrama";
import DramaList from "@/components/contents/DramaList";
import DramaDetail from "@/components/contents/DramaDetail";
import Modal from "@/components/ui/Modal";
import { dramas } from "@/data/dramas";
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

  const featuredDrama = dramas.find((drama) => {
    return drama.featured;
  });

  const otherDramas = dramas.filter((drama) => {
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


---

## 17. 完成した動作を確認する

最後に、作品を開いてから閉じるまでの流れを確認します。

```text
作品カードをクリックする
↓
クリックした作品をselectedDramaへ保存する
↓
isDramaModalOpenをtrueにする
↓
共通Modalが開く
↓
DramaDetailとiframeを生成する
↓
iframeの読み込みが完了する
↓
動画がフェードインする
```

閉じる場合は、次のとおりです。

```text
閉じるボタン、背景、またはEscapeキーで閉じる
↓
isDramaModalOpenをfalseにする
↓
共通ModalはCSSで閉じる
↓
DramaDetailとiframeを削除する
↓
YouTubeの再生と音声が止まる
```

第8章で作った共通Modalの仕組みは変更していません。

```text
第8章で作ったModal
＋
選択した作品を管理するstate
＋
動画の読み込み状態
```

この組み合わせによって、一枚の共通Modalで、作品ごとに異なるレビューと動画を表示できます。

---

## 18. FeaturedDramaをやってみる

特集作品も、通常作品と同じModalを使用します。

`FeaturedDrama`で`onSelect`を受け取ります。

```jsx
export default function FeaturedDrama({
  drama,
  onSelect,
}) {
```

通常カードと同じように、クリック処理を追加します。

```jsx
// @/components/contents/FeaturedDrama/index.jsx

import Image from "next/image";
import styles from "./FeaturedDrama.module.scss";

export default function FeaturedDrama({
  drama,
  onSelect,
}) {
  if (!drama) return null;
  
  return (
    <section id="featured">
      <h2>Featured</h2>

      <article
        className={styles.featured}
        onClick={() => onSelect(drama)}
      >
        <div className={styles.visual}>
          <div className="img-wrapper">
            <Image
              src={drama.image}
              alt={`${drama.title}のサムネール`}
              width={1920}
              height={1534}
              sizes="(min-width: 900px) 900px, 100vw"
              priority
            />
          </div>

          <p className={styles.quote}>
            {drama.quote}
            <br />
            —{drama.quoteBy}
          </p>

          <h3 className={styles.title}>
            {drama.title}
          </h3>

          <div className={styles.score}>
            {drama.score}/10
          </div>
        </div>

        <p className={styles.information}>
          {drama.seasons} seasons /{" "}
          {drama.genres.join(" ∙ ")}
          <br />
          {drama.year} /{" "}
          {drama.platforms.join(" ∙ ")}
        </p>
      </article>
    </section>
  );
}
```

SCSSにも、操作できることを示す設定を追加します。

```scss
// FeaturedDrama.module.scss

.featured {
  cursor: pointer;
}
```

---

## 19. 今回作った構造

最終的なコンポーネント構造は次のとおりです。

```text
DramaArchive
│
├ selectedDrama
├ isDramaModalOpen
├ handleSelectDrama
├ handleCloseDrama
│
├ FeaturedDrama
│  └ onSelect(drama)
│
├ DramaList
│  └ DramaCard
│     └ onSelect(drama)
│
└ Modal
   └ DramaDetail
      └ selectedDrama
```

一つの共通Modalを、特集作品と通常作品の両方から利用しています。

---

## 今日の確認

- [ ] 元のHTMLではカード全体を選択していたと説明できる
- [ ] Modalを作品ごとに作らない理由を説明できる
- [ ] Modalを`DramaArchive`へ一つだけ置いた
- [ ] 選択作品と開閉状態を別々に管理した
- [ ] 閉じるときも作品データを残す理由を説明できる
- [ ] 関数をpropsで子へ渡した
- [ ] 子から作品データを親へ伝えた
- [ ] 特集作品と通常作品で同じModalを使用した
- [ ] 元のHTMLから`DramaDetail`を作った
- [ ] `ReactMarkdown`でレビューを表示した
- [ ] 第8章のModalを変更せず再利用した
- [ ] `createPortal`によってbody直下へ表示されることを説明できる

---

## Git

動作を確認したら、履歴へ記録します。

```bash
git add .
git commit -m "Add drama review modal"
```