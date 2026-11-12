// @/components/contents/SampleContext/index.jsx

"use client";

import { useState, createContext, useContext } from "react";

// createContext()関数を使ってpropsを渡す専用の通路を作る。
// なお、どこからでも読み出せるようにグローバルな場所で定義しておく。
const MessageContext = createContext(null);

export default function SampleContext() {
  // 渡すStateを定義する。
  const [message, setMessage] = useState("まだボタンは押されていません。");
  // Stateを更新する関数を定義する。
  // この場合だと、
  // ボタンがクリックされたら、
  // 仕込んであるchangeMessage名を呼び出して、
  // changeMessage関数を実行する。
  const changeMessage = () => {
    setMessage("離れた子コンポーネントのボタンから変更されました。");
  };

  return (
    <>
      <p>{message}</p>

      {/* 階層が離れたコンポーネントに届くよう、 */}
      {/* 親から見て一番上の階層にあるコンポーネントを囲い込む。 */}
      {/* 渡したいpropsをvalue属性に設定。 */}
      <MessageContext.Provider value={changeMessage}>
        <Middle />
      </MessageContext.Provider>
    </>
  );
}

// SampleContextコンポーネントに読み込む『子』コンポーネントを定義する。
// 効果を確認するため、propsは渡していない。
function Middle() {
  return (
    <div>
      <p>途中にあるMiddleコンポーネント</p>
      {/* 『孫』コンポーネントを呼び込む */}
      <MessageButton />
    </div>
  );
}

// Middleコンポーネントに読み込む『孫』コンポーネントを定義する。
function MessageButton() {
  // グローバルな場所で定義していた通路『MessageContext』を引数に、
  // useContext関数でpropsを受け取る。
  const receiveFn = useContext(MessageContext);
  // 中身を確認する。
  // changeMessage関数で定義されたものが入っている。
  // console.log(receiveFn);

  return (
    <button
      type="button"
      //　ボタンがクリックされると関数を呼び出す。
      onClick={receiveFn}
      style={{
        marginTop: "2rem",
        padding: "20px",
        color: "white",
        backgroundColor: "#333",
      }}      
    >
      親のメッセージを変更する
    </button>
  );
}