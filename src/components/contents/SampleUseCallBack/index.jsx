// @/components/contents/SampleUseCallBack/index.jsx

"use client";

// useCallbackは、
// コンポーネントが再実行されても、同じ関数を使い続けたいときに使う。

// 一言
// 同じとは？

// これらは人間の目には同じに見えますが、Reactは違うものとして捉えます。
// console.log({ name: "hoge" } === { name: "hoge" });
// => false

// console.log(
//   (() => console.log("hoge")) === (() => console.log("hoge"))
// );
// // false


// 状態を更新させてSample()関数全体を再実行させる。

import { useState, useEffect, useCallback } from "react";

export default function SampleUseCallBack() {
  const [count, setCount] = useState(0);
  const countUp = () => {
    setCount((prev) => prev + 1);
  };

  // 状態を更新するとSampleコンポーネントは再実行されます。
  // コンポーネント内で定義した関数は、新しく作り直される。
  // useCallbackを使わない場合、コンソールの出力が、
  //    → 再実行で新しい関数になる
  //    → 依存配列が変わる
  //    → 古い関数を捨てる
  //    → 新しい関数を読み直す
  // となる。人間には同じにしか見えないが、設定した『関数』は更新される。
  // 確認のため『useEffectの処理の流れをもう一度おさらい』を読むこと。
  const showMessage = () => {
    console.log("こんにちは");
  };

  // // useCallbackの引数にして定義すると更新しないことを確認できる。
  // //    → 前の関数を再利用する
  // //    → 依存配列は変わらない
  // //    → 解除・再開始しない
  // const showMessage = useCallback(() => {
  //   console.log("こんにちは");
  // }, []);

  // // 『useEffectの処理の流れをもう一度おさらい』
  // //  ・useEffectは、Reactが、JSXを読み込んでDOMへの反映後に処理を始める
  // //  ・依存する値が変わったら処理をやり直す
  // //  ・やり直す前には以前の処理を後片付けする
  // //  ・コンポーネントが消えるときにも後片付けする（モーダルとかがそうです。）

  // // 『依存する値が変わったら』とは？
  // // 依存配列には、stateだけでなく、変数や関数も指定できる。
  // //
  // // 文字列・数値などは、前回と今回の値が同じなら
  // // 変化したとは判断されない。
  // //
  // // オブジェクト・配列・関数は、コンポーネントが再実行されると
  // // 新しく作られるため、中身が同じでも別物だと判断される。

  useEffect(() => {
    console.log("useEffectの処理を開始しました。");

    return () => {
      console.log("useEffectの処理を後片付けしました。");
    };
  }, [showMessage]);

  return (
    <>
      <div>現在のカウント：{count}</div>
      <button 
        type="button"
        onClick={countUp}
      >
        カウントアップ
      </button>

      <button 
        type="button"
        onClick={showMessage}
      >
        メッセージを表示
      </button>
    </>
  );
}