// @/components/contents/SampleMap/index.jsx

"use client";

export default function SampleMap() {

  // Mapとset
  // 空のMapを作る。
  const actionMap = new Map();

  const cardName = "カード1";

  const showCard = () => {
    console.log("カード1を表示します");
  };

  // カード名と関数を一組にして保存する。
  actionMap.set(cardName, showCard);

  const execute = () => {
    // カード名を使って、保存した関数を取り出す。
    const action = actionMap.get(cardName);

    // 取り出した関数を実行する。
    action();
  };

  // Set
  // 値を重複せずに保存できる。
  const names = new Set();
  names.add("カード1");
  names.add("カード2");
  names.add("カード1");
  console.log(names);

  names.forEach((name) => {
    console.log(name);
  });

  return (
    <button
      type="button"
      onClick={execute}
    >
      Mapから関数を取り出して実行する
    </button>
  );
}