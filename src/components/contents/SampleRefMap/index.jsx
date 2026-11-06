// @/components/contents/SampleRefMap/index.jsx

"use client";

import {
  useRef,
  useState,
} from "react";

export default function SampleRefMap() {
  const [count, setCount] = useState(0);

  // 再実行されても同じMapを保持する。
  const mapRef = useRef(new Map());

  const addMap = () => {
    console.log(
      "保存前：",
      mapRef.current.size,
    );

    const number = count + 1;

    mapRef.current.set(
      `card${number}`,
      `reveal${number}`,
    );

    console.log(
      "保存後：",
      mapRef.current.size,
    );

    setCount((prev) => prev + 1);
  };

  return (
    <>
      <p>再実行した回数：{count}</p>

      <button
        type="button"
        onClick={addMap}
      >
        Mapへ保存して再実行する
      </button>
    </>
  );
}


// `useRef()`はDOM要素だけでなく、値を再実行後も保持するためにも使えます。

// まず普通に`Map`を作った場合です。

// ```jsx
// export default function Sample() {
//   const targetMap = new Map();
// }
// ```

// コンポーネントが再実行されると、新しい空の`Map`が作られます。

// ```text
// 1回目
// → Map A

// 再実行
// → Map B

// 再実行
// → Map C
// ```

// 前のMapへ保存した内容を引き継げません。

// `useRef()`へ入れると、同じMapを保持できます。

// ```jsx
// const targetRef = useRef(new Map());
// ```

// ```text
// 1回目
// → targetRef.currentにMap Aを保存

// 再実行
// → Map Aを再利用

// 再実行
// → Map Aを再利用
// ```

// ## 動作確認用サンプル

// 最初の表示です。

// ```text
// 普通のMap：0
// useRefのMap：0
// ```

// ボタンを押します。

// ```text
// Mapへ値を保存
// ↓
// stateを更新
// ↓
// コンポーネントを再実行
// ```

// 再実行後の結果です。

// ```text
// 普通のMap：0
// useRefのMap：1
// ```

// 普通のMapは、新しく作り直されたため空です。

// ```jsx
// const normalMap = new Map();
// ```

// `useRef`のMapは、前回と同じものなので内容が残っています。

// ```jsx
// const mapRef = useRef(new Map());
// ```

// 値を扱うときは`current`を使います。

// ```jsx
// mapRef.current.set(key, value);
// mapRef.current.get(key);
// mapRef.current.delete(key);
// ```

// 完成コードでは、監視対象の登録内容を再実行後も残す必要があります。

// ```jsx
// const targetRef = useRef(new Map());
// ```

// さらに、Mapの内容を変更しても画面を再表示する必要はありません。そのため、stateではなく`useRef()`が適しています。