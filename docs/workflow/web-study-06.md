# 第6章　mapとpropsでカードを生成する

## 目的

作品ごとに繰り返していたHTMLを、一つのDramaCardから生成します。

## 1. DramaCard

```jsx
// src/components/DramaCard.jsx

export default function DramaCard({ drama, number, onSelect }) {
  const genres = drama.genre.join(" · ");

  return (
    <article className={`drama-card ${drama.large ? "drama-card--large" : ""}`}>
      <button
        className="drama-card__button"
        type="button"
        onClick={() => onSelect(drama)}
        aria-haspopup="dialog"
      >
        <div className="drama-card__image">
          <img src={drama.image} alt="" />
        </div>

        <div className="drama-card__heading">
          <h3>
            <span className="drama-card__number">{String(number).padStart(2, "0")}</span>
            {drama.title}
          </h3>
          <span className="score">{drama.score}/10</span>
        </div>

        <p className="information">
          {drama.seasons} seasons / {genres}
          <br />
          {drama.year} / {drama.platform}
        </p>
      </button>
    </article>
  );
}
```

カード全体を押せるようにする場合、クリック可能な`article`ではなく、中に`button`を置きます。これでTabキーとEnter・Spaceキーでも操作できます。

## 2. 一覧を生成する

```jsx
// src/components/DramaList.jsx
import DramaCard from "./DramaCard";

export default function DramaList({ dramas, onSelect }) {
  return (
    <section id="dramas" aria-labelledby="dramas-title">
      <h2 id="dramas-title" className="section-title">Dramas</h2>

      <div className="drama-list">
        {dramas.map((drama, index) => (
          <DramaCard
            key={drama.id}
            drama={drama}
            number={index + 1}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
```

`key`は画面には表示されません。Reactが各要素を区別するために使います。配列の順番が変わる可能性があるため、`index`ではなく`drama.id`を使います。

## 今日の確認

- [ ] 作品を追加するときHTMLを複製する必要がない
- [ ] `map()`、`key`、propsの役割を説明できる
- [ ] カードをTabキーで選択できる
- [ ] 表示順をデータの順番で変更できる

## Git

```bash
git add .
git commit -m "Render drama cards from data"
```
