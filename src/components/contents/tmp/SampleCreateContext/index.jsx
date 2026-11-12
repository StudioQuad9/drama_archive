// @/components/contents/SampleCreateContext/index.jsx

"use client";

// createContext, useContextをインポートして
import { useState, createContext, useContext } from "react";

// createContextのインスタンスを作成、Contextオブジェクトが生成される。
// 使い方はコンポーネントのように使える。
const ActionContext = createContext(null);
// // インスタンスを見てみる
console.log(ActionContext);

// コンソールを見たらわかる。
// こういうこと、
//   const ActionContext = {
//     Provider: Providerコンポーネント,
//     Consumer: Consumerコンポーネント,
//     // Reactが内部で使う情報など
//   };

// つまり、
//   <ActionContext.Provider value={showMessage}>
//     ...
//   </ActionContext.Provider>
// これはProviderキーを使って、プロバイダーコンポーネントを
// 呼び出しているということです。

// あとは見たまま。
// 状態を生成させ、更新用関数を定義した親で
// Provider（提供者）コンポーネントで子を囲み、
// value属性へ共有したい関数を渡す。

// 使いたいコンポーネントで、
// useContext(コンポーネント名)で受け渡し完了。

export default function SampleCreateContext() {
  const [message, setMessage] = useState("まだボタンは押されていません。");
  const showMessage = () => {
    setMessage("離れた子のボタンから実行されました。");
  };

  return (
    <>
      <p>{message}</p>
      <ActionContext.Provider value={showMessage}>
        <Middle />
      </ActionContext.Provider>
    </>
  );
}

function Middle() {
  return (
    <div>
      <p>間にあるコンポーネント</p>
      <p>ボタンのコンポーネントを差し込んでる</p>
      <ActionButton />
    </div>
  );
}

function ActionButton() {
  const showMessage = useContext(ActionContext);

  return (
    <button
      type="button"
      onClick={showMessage}
      style={{
        marginTop: "5px",
        padding: "10px",
        border: "1px solid black", 
        borderRadius: "5px"
      }}
    >
      親の関数を実行するボタン
    </button>
  );
}