// // 01

// // スクロールの監視機能が実行される様子

// //   1. @/components/contents/DramaList/index.jsx で、    
// //      <h2 ref={observerRef}> として、
// //      管理する要素をマーク
// //   2. DramaList関数が実行される
// //   3. useScrollReveal()が呼ばれる
// //   4. useRef(null)が実行される
// //      observerRefは{ current: null }
// //   5. useEffectが登録される
// //      この時点では中身をまだ実行しない
// //   6. useScrollRevealがobserverRefをDramaListへ返す
// //   7. DramaListがJSXを読み込む
// //   8. Reactがh2を実際のDOMへ反映する
// //   9. Reactがh2をobserverRef.currentへ入れる
// //   10. DOMへの反映後、useEffectの中を実行する
// //   11. IntersectionObserverを作る
// //   12. observer.observe(element)でh2の監視を始める
// //   13. ブラウザが監視結果をコールバック関数へ渡す


// // 依存配列に値を設置してない...

// // 前提知識として、
// // 依存配列は、
// //   state
// //   props
// //   変数
// //   object
// //   array
// //   関数
// // これらを値としてとる。
  
// // その中で、注意するのは、
// //   object
// //   array
// //   関数
// // これらはコンポーネントが再実行されるたびに
// // 新しく作られるため、
// // 人間には中身が同じに見えても
// // Reactには「変わった」と判断されます。

// // 今回の場合、依存配列に値がないということは、
// // 最初にuseEffectを実行したら、
// // 要素への監視は続けるということになる。


// // @/hooks/useScrollReveal.js

// "use client";

// import { useEffect, useRef } from "react";

// export default function useScrollReveal() {
//   // 監視する実際の要素を保持する。
//   const observerRef = useRef(null);

//   useEffect(() => {
//     const element = observerRef.current;
//     if (!element) return;

//     const observer = new IntersectionObserver(([entry]) => {
//       console.log(
//         entry.isIntersecting
//           ? "画面内に入りました。"
//           : "画面外です。"
//       );
//     });

//     observer.observe(element);

//     return () => {
//       observer.disconnect();
//     };
//   }, []);

//   // このrefを監視したい要素へ渡す。
//   return observerRef;
// }


// // 02

// // 監視結果を`state`へ入れて確認

// // @/hooks/useScrollReveal.js

// "use client";

// import { useState, useEffect, useRef } from "react";

// export default function useScrollReveal() {
//   const [isInView, setIsInView] = useState(false);
  
//   const observerRef = useRef(null);

//   useEffect(() => {
//     const element = observerRef.current;
//     if (!element) return;

//     const observer = new IntersectionObserver(([entry]) => {
//       // console.log(
//       //   entry.isIntersecting
//       //     ? "画面内に入りました。"
//       //     : "画面外です。"
//       // );
//       setIsInView(entry.isIntersecting);
//     });

//     observer.observe(element);

//     return () => {
//       observer.disconnect();
//     };
//   }, []);

//   // return observerRef;
//   return { observerRef, isInView };
// }


// // 03

// // @/hooks/useScrollReveal.js

// "use client";

// import { useState, useEffect, useRef } from "react";

// export default function useScrollReveal() {
//   const [isInView, setIsInView] = useState(false);
  
//   const observerRef = useRef(null);

//   useEffect(() => {
//     const element = observerRef.current;
//     if (!element) return;

//     const observer = new IntersectionObserver(([entry]) => {
//       // console.log(
//       //   entry.isIntersecting
//       //     ? "画面内に入りました。"
//       //     : "画面外です。"
//       // );
//       setIsInView(entry.isIntersecting);
//     });

//     observer.observe(element);

//     return () => {
//       observer.disconnect();
//     };
//   }, []);

//   // return observerRef;
//   return { observerRef, isInView };
// }