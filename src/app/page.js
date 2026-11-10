// @/app/page.js

import DramaArchive from "@/components/contents/DramaArchive";

export default function Home() {
  return (
    <main className="inner">
      <DramaArchive />
      <div id="about">
        {/* 12章　GSAPで動かしてみる */}
        {/* <h2 data-reveal-test>About</h2> */}
        {/* 12章　複数の要素に設定する */}
        <h2 data-reveal>About</h2>
        <p>
          このサイトはいしざきが今まで観た海外ドラマの（独断と偏見に満ちた）レビューをまとめたものです。
        </p>
      </div>
    </main>
  );
}