# 第11章　スクロールに合わせて要素を表示する

## IntersectionObserverを段階的に理解する

要素のスクロールを監視する、IntersectionObserverを使って、次の動作を確認します

```text
下へスクロールする
↓
監視する要素が画面内へ入る
↓
コンソールへhelloと表示する
```

まずは、この基本動作を確認したあと、監視する要素を増やします。

最後に、理解した仕組みを`ScrollReveal`コンポーネントへと育てます。

---

## 段階1　一つの要素を監視する

最初は、一つの要素だけを監視します。

```jsx
// @/components/ui/ScrollReveal/index.jsx

"use client";

import { useEffect, useRef } from "react";

export default function ScrollReveal() {
  // useRef()は、初期値nullを持つインスタンスを生成する。
  // 中身はオブジェクトで、{ current: null }。
  const observedElm = useRef(null);
  console.log("observedElm:", observedElm);

  useEffect(() => {
    console.log("observedElm:", observedElm);
    
    // IntersectionObserver関数で管理人を定義する。
    const observer = new IntersectionObserver((entries) => {
        console.log(entries);
        const entry = entries[0];
        !entry.isIntersecting && console.log("要素はスクリーンの外にある")
        entry.isIntersecting && console.log("要素がスクリーンに現れる")
      },
    );
    // ※3 ブラウザは、まとめた結果をentriesへ送る。
    //    IntersectionObserverEntryという名称、
    //    中身は、
    //      {
    //        target: 監視したdiv,
    //        isIntersecting: false,
    //        intersectionRatio: 0,
    //        boundingClientRect: divの位置と大きさ,
    //        intersectionRect: 重なっている範囲,
    //        rootBounds: 表示範囲の位置と大きさ,
    //        time: 判定した時刻
    //      }
    // というのが、スクロール監視の基本的な全体の流れです。
    
    // 監視対象の要素をobserve()関数を使って登録する。
    observer.observe(observedElm.current);
    // ※1
    // observedElm.currentの値がdivに更新されると、
    // observerに対して、引数にdivを持ち、observe()関数を実行する。=> ※2

    return () => {
      observer.disconnect();
    };
  }, []);

  // ReactがJSXをDOM要素へ反映させる。
  return (
    // ※2 ブラウザは、divと表示範囲の重なりを判定する。
    //    判定結果をオブジェクトにして、配列としてまとめる。=> ※3
    <>
      <div
        style={{
          display: "grid",
          placeContent: "center",
          height: "100vh",
          color: "white",
          backgroundColor: "red",
        }}
      >
        下へスクロールする
      </div>

      {/* 
        ReactがJSXをDOMへ反映させるときに、
        ref={observedElm}を見つける。
        Reactは、{ current: div }と値を入れる。=> ※1
      */}
      <div
        ref={observedElm}
        style={{
          display: "grid",
          placeContent: "center",
          height: "100vh",
          color: "white",
          backgroundColor: "blue",
        }}
      >
        監視する要素
      </div>
    </>
  );
}
```

コードのわかりやすさを優先してインラインスタイルを使用しています。

---

## 段階2　複数の要素を監視する

一つの要素を監視できたので、次は三つの要素を監視します。

今回は仕組みを確認するため、それぞれにrefを用意します。

```jsx
const observedElm1 = useRef(null);
const observedElm2 = useRef(null);
const observedElm3 = useRef(null);
```

完成コードは次のとおりです。

```jsx
// @/components/ui/ScrollReveal/index.jsx

"use client";

import { useEffect, useRef } from "react";

export default function ScrollReveal() {
  // 3つの監視対象の要素を用意します。
  const observedElm1 = useRef(null);
  const observedElm2 = useRef(null);
  const observedElm3 = useRef(null);

  useEffect(() => {
    // コードの動きを見る。
    console.log("1：Observerを定義する"); // => ※1 Observerを定義する => ※2

    // ↓ ここから、ブラウザが持っているクラスをJavaScriptで動かしているんです。
    //   もちろん、ブラウザが定義しているメソッドもしれっと動かしています。
    //   WebAPIを使えるJavaScriptの大きな利点です。

    //   そして、こういうふうにコードは動いています。
      
    //     ブラウザのIntersectionObserverクラスに対して、
    //     引数のcallbackを覚えておいてください。
  
    //     observe()で登録した要素について、
    //     画面との交差状態が変化したら、
    //     監視結果を配列にまとめ、
    //     その配列を引数としてcallbackを呼んでください。

    //   ということをどこに定義も書いてないのにやってくれている。
    //   これはIntersectionObserverクラスの仕様として、
    // 　ブラウザ側に最初から実装されている約束だからです。
    const observer = new IntersectionObserver((entries) => {
      // ※3 ブラウザは、まとめた結果をentriesへ送る。
      console.log("5：監視結果が届いた", entries);
      // ※4 最初の読み込みでは、3つのオブジェクトがあったが、以降は、
      //    変更のあった要素の情報が入っていく。

      // entriesそれぞれの中身と状態を確認
      entries.forEach((entry) => {
        console.log(
          "6：監視結果",
          entry.target.textContent.trim(),
          entry.isIntersecting,
        );

        entry.isIntersecting && 
          console.log(`7：スクリーンに現れる要素 ${entry.target.textContent.trim()}`);
      });
    });

    console.log("2：#1を登録"); // => ※2 要素を登録する => ※3
    observer.observe(observedElm1.current);

    console.log("3：#2を登録"); // => ※2 要素を登録する => ※3
    observer.observe(observedElm2.current);

    console.log("4：#3を登録"); // => ※2 要素を登録する => ※3
    observer.observe(observedElm3.current);
    // observe()で監視対象を順番に登録。

    // ↑ ここまで
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // => ※3 ReactがJSXをDOMへ反映させるときに、
  //       ref={observedElm}を見つける。
  //       Reactは、{ current: div }と値を入れる。
  //       ブラウザが監視結果をまとめてentriesに格納する。

  // なぜ、ブラウザが監視結果をまとめるのか？
  // observer.observe(observedElm1.current);として
  // 登録処理が行なわれる。
  // 以降、ブラウザは、監視して表示状態に変更があると、
  // その都度、新しい監視結果の配列をコールバック関数のentriesへと渡す。=> ※4
  return (
    <>
      <div
        style={{
          display: "grid",
          placeContent: "center",
          height: "100vh",
          color: "white",
          backgroundColor: "red",
        }}
      >
        下へスクロールする
      </div>

      <div
        ref={observedElm1}
        style={{
          display: "grid",
          placeContent: "center",
          height: "100vh",
          color: "white",
          backgroundColor: "blue",
        }}
      >
        #1 監視する要素
      </div>

      <div
        ref={observedElm2}
        style={{
          display: "grid",
          placeContent: "center",
          height: "100vh",
          color: "white",
          backgroundColor: "green",
        }}
      >
        #2 監視する要素
      </div>

      <div
        ref={observedElm3}
        style={{
          display: "grid",
          placeContent: "center",
          height: "100vh",
          color: "white",
          backgroundColor: "purple",
        }}
      >
        #3 監視する要素
      </div>
    </>
  );
}
```

---

## 段階3　再利用できるScrollRevealへ変更する

段階2では、三つの要素を一つのコンポーネントへ直接書きました。

```jsx
observer.observe(observedElm1.current);
observer.observe(observedElm2.current);
observer.observe(observedElm3.current);
```

作品カードが増えるたびにrefと`observe()`を追加する方法では、実際のアプリで再利用できません。

ここで、考え方を変えます。

```text
一つのScrollRevealで
三つの要素を監視する
```

のではなく、

```text
一つのScrollRevealが
一つの要素を監視する

必要な数だけ
ScrollRevealを使用する
```

という構造へ変更します。

### childrenを受け取る

`ScrollReveal`の中に表示する内容を、外から受け取ります。

```jsx
export default function ScrollReveal({
  children,
}) {
```

受け取った内容を、監視する`div`の中へ置きます。

```jsx
return (
  <div ref={observedElm}>
    {children}
  </div>
);
```

これにより、監視する内容を外から指定できます。

```jsx
<ScrollReveal>
  <DramaCard />
</ScrollReveal>
```

### stateで表示状態を管理する

画面内へ入ったかどうかをstateへ保存します。

```jsx
const [isInView, setIsInView] =
  useState(false);
```

初期状態では、まだ画面内へ入っていません。

```text
isInView
→ false
```

監視対象が画面内へ入ったら、`true`へ変更します。

```jsx
if (entry.isIntersecting) {
  setIsInView(true);
}
```

stateに応じてCSS Moduleのクラスを追加します。

```jsx
className={`
  ${styles.reveal}
  ${isInView ? styles.inView : ""}
`}
```

### ScrollRevealの完成コード

```jsx
// # 03-1

// @/components/ui/ScrollReveal/index.jsx

"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ScrollReveal.module.scss";

// // 分割代入とスプレッド演算子を理解する
// const arr = [1, 2, 3];
// const [one] = arr;
// console.log(one);
// const [first, ...others] = arr;
// console.log(first);
// console.log(others)

// const person = { firstName: "nobuyuki", lastName: "takahiro", age: 61 };
// const { firstName, lastName } = person;
// console.log(`${firstName} ${lastName}`);
// const { age, ...rest } = person;
// console.log(age);
// console.log(rest);

export default function ScrollReveal({ children }) {
  const observedElm = useRef(null);

  // 状態の変化によってクラスを付け替える。※1
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // 配列の分割代入を使ってコードを簡略する。
    // const observer = new IntersectionObserver((entries) => {
    //     const entry = entries[0];
    
    // そして、#2までではコンソールに出力していた箇所を変えます。
    // 更新用関数を発火させるコードに。※2
    const observer = new IntersectionObserver(([entry]) => {
        entry.isIntersecting && setIsInView(true);
      },
    );

    observer.observe(observedElm.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={observedElm}
      className={`
        ${styles.reveal}
        ${isInView ? styles.inView : ""}
      `}
    >
      {/* 後は、効果を適用させるchildrenを指示する。※3 */}
      {children}
      {/* そして、DramaListへ行ってカードをこのコンポーネントで包むだけ。※4 */}
    </div>
  );
}
```

### SCSSを作る

```scss
// @/components/ui/ScrollReveal/ScrollReveal.module.scss

.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity .8s ease,
    transform .8s ease;
}

.inView {
  opacity: 1;
  transform: translateY(0);
}
```

初期状態では、透明にして下へずらしています。

```text
isInViewがfalse

.reveal
→ opacity: 0
→ translateY(30px)
```

画面内へ入ると、`.inView`が追加されます。

```text
isInViewがtrue

.reveal + .inView
→ opacity: 1
→ translateY(0)
```

`transition`によって、要素が滑らかに表示されます。

### DramaCardへ使用する

`DramaList`で`ScrollReveal`を読み込みます。

```jsx
import ScrollReveal from "@/components/ui/ScrollReveal";
```

それぞれの`DramaCard`を`ScrollReveal`で包みます。

```jsx
<ul className={styles.list}>
  {dramas.map((drama, index) => (
    <li
      key={drama.id}
      className={styles.item}
    >
      <ScrollReveal>
        <DramaCard
          drama={drama}
          order={index + 1}
          onSelect={onSelect}
        />
      </ScrollReveal>
    </li>
  ))}
</ul>
```

`map()`によって、作品数と同じ数の`ScrollReveal`が作られます。
<!-- 
## 3. ScrollRevealを作る

```jsx
// src/components/ui/ScrollReveal/index.jsx
"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./ScrollReveal.module.scss";

const directionClasses = {
  up: styles.up,
  down: styles.down,
  left: styles.left,
  right: styles.right,
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  once = true,
  className = "",
}) {
  const elementRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);

          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -10%",
        threshold: 0.1,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [once]);

  const classes = [
    styles.reveal,
    directionClasses[direction] ?? directionClasses.up,
    isInView ? styles.inView : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={elementRef}
      className={classes}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </div>
  );
}
```

`directionClasses`によって、外から受け取った`up`などの値をCSS Modulesのクラスへ対応させています。

---

## 4. SCSSを作る

```scss
// src/components/ui/ScrollReveal/ScrollReveal.module.scss
.reveal {
  opacity: 0;
  transition:
    opacity 0.8s ease,
    transform 0.8s ease;
  transition-delay: var(--reveal-delay, 0ms);
  will-change: opacity, transform;
}

.up {
  transform: translateY(24px);
}

.down {
  transform: translateY(-24px);
}

.left {
  transform: translateX(40px);
}

.right {
  transform: translateX(-40px);
}

.inView {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

動きを減らすOS設定を利用している場合は、アニメーションなしで最初から表示します。

---

## 5. DramaListへ適用する

`DramaList.jsx`で読み込みます。

```jsx
import ScrollReveal from "@/components/ui/ScrollReveal";
```

`map()`の中を次のように変更します。

```jsx
{dramas.map((drama, index) => (
  <ScrollReveal
    key={drama.id}
    direction="up"
    delay={(index % 3) * 100}
    className={styles.item}
  >
    <DramaCard
      drama={drama}
      number={index + 1}
      onSelect={onSelect}
    />
  </ScrollReveal>
))}
```

`key`は、`map()`が直接返す一番外側のScrollRevealへ移します。

`DramaList.module.scss`へ追加します。

```scss
.item {
  min-width: 0;
}
```

---

## 6. delayを増やし続けない

次の書き方では、作品数が多いほど待ち時間が増えます。

```jsx
delay={index * 100}
```

今回は3列の表示を想定し、列ごとに遅延を戻します。

```jsx
delay={(index % 3) * 100}
```

```text
1列目 → 0ms
2列目 → 100ms
3列目 → 200ms
4列目 → 0ms
```

演出のために、後ろの情報が長時間読めなくなる状態を避けます。

---

## 7. Effectとcleanupを確認する

```text
コンポーネントを表示
↓
observer.observe(element)

コンポーネントを外す
↓
observer.disconnect()
```

Modalではイベント監視を解除しました。ScrollRevealではObserverを解除します。

対象は違いますが、外部の仕組みと同期し、最後に片付ける考え方は同じです。

--- -->

## 今日の確認

- [ ] ScrollRevealが自分の要素をrefで参照している
- [ ] 要素が表示範囲へ入るとstateが変わる
- [ ] CSS Modulesのクラスによって表示が変わる
- [ ] 一度表示した要素を監視から外した
- [ ] コンポーネント終了時にObserverを解除した
- [ ] `key`をmap直下の要素へ付けた
- [ ] `prefers-reduced-motion`へ対応した
- [ ] 遅延が増え続けないことを確認した

## Git

```bash
git add .
git commit -m "Add reusable scroll reveal animation"
```
