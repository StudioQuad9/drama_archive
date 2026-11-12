# 6-2. 特集記事からモーダルを開く・引用文を前面に出す

## この指示書の対象

利用者本人が行った2つの修正を、現在のコードに合わせて記録する。
DB接続やアップロード処理の変更は、この指示書の対象ではない。

## 1. 特集記事の画像・タイトルから詳細モーダルを開く

### 問題と原因

通常カードからは記事を読めたが、特集をクリックしてもモーダルが開かなかった。
親のDramaArchiveはonSelectを渡していたが、FeaturedDramaは受け取っておらず、
スライダーにも記事を開く処理がつながっていなかった。

### 手順1：FeaturedDramaでonSelectを受け取る

対象：src/components/contents/FeaturedDrama/index.jsx

```jsx
export default function FeaturedDrama({ drama, onSelect }) {
```

親から渡された関数を、特集側でも使えるようにする。
ImageSliderへ、現在の特集記事を選択する関数を渡す。

```jsx
<ImageSlider
  title={drama.title}
  images={images}
  onSelect={() => onSelect(drama)}
/>
```

タイトルもボタンにする。画像だけでなくタイトルからも開け、
キーボードでも操作できるようにする。

```jsx
<h3 className={styles.title}>
  <button type="button" onClick={() => onSelect(drama)}>
    {drama.title}
  </button>
</h3>
```

`onSelect(drama)` はクリックしたときに実行する。
`onClick={onSelect(drama)}` と書くと描画時に実行されるので、関数で包んで渡す。

### 手順2：ImageSliderで画像のクリックを受ける

対象：src/components/ui/ImageSlider/index.jsx

```jsx
export default function ImageSlider({ title, images, onSelect }) {
```

Swiperの属性に追加する。

```jsx
onClick={(swiper, event) => {
  if (swiper.allowClick && event.target.closest(".swiper-slide")) {
    onSelect?.();
  }
}}
```

- `swiper.allowClick`：スワイプを画像クリックとして扱わないために確認する。
- `event.target.closest(".swiper-slide")`：クリック先がスライドの中か調べる。
- 矢印・ページ送りはスライドの外にあるため、記事を開かず画像を切り替える。
- `onSelect?.()`：関数が渡されている場合だけ呼び出す。記事表示のない場所でも使える。

クラス名は **swiper-slide**。swiper-sliderではない。
SwiperSlideが作るスライド要素のクラス名に合わせる。

### 手順3：タイトルのボタンを既存の見た目になじませる

対象：src/components/contents/FeaturedDrama/FeaturedDrama.module.scss

```scss
.title button {
  display: block;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.quote,
.score {
  pointer-events: none;
}
```

タイトルの色・書体は親から引き継ぐ。
画像に重なる引用文と評価はクリックを遮らず、背後の画像へ通す。

### 処理のつながり

画像クリック → ImageSliderのonSelect → FeaturedDramaのonSelect(drama)
→ DramaArchiveで記事を選択 → 既存のModalにDramaDetailを表示。

タイトルのボタンはFeaturedDramaから同じ処理を直接呼ぶ。
特集専用のモーダルを新しく作る必要はない。

## 2. 引用文をスライダーより前面に出す

### 問題

引用文と引用者のデータ・表示要素はあるが、スライダー画像の背後に隠れていた。

### 修正

同じFeaturedDrama.module.scssの既存の.quoteへz-indexを追加する。

```scss
.quote {
  position: absolute;
  top: 20px;
  right: 16px;
  z-index: 2;

  // 色・書体など、既存の指定は残す。
}
```

position:absoluteはすでにあるので、JSXの記述位置を移す必要はない。
今回の構造では、z-indexでスライダーより前面へ重ねる。
画像は切り替わっても、引用文・引用者は特集全体の上に固定表示する。

## 確認方法

1. 特集画像をクリックし、対応する記事のモーダルが開くこと。
2. 特集タイトルからも同じモーダルが開くこと。
3. 複数画像がある状態で、矢印・ページ送り・スワイプでは記事が開かないこと。
4. 引用文がある記事で、画像右上に引用文・引用者が見えること。
5. 画像切り替え中も引用文が残ること。

利用者本人から修正後のOKを受けた。06時点では非公開Storage画像は準備中表示のため、
実画像を複数枚表示したときのスライダー操作は07でも確認する。

## 変更したファイル

- src/components/contents/FeaturedDrama/index.jsx
- src/components/ui/ImageSlider/index.jsx
- src/components/contents/FeaturedDrama/FeaturedDrama.module.scss
