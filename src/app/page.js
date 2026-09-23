// @/app/page.js

import DramaArchive from "@/components/contents/DramaArchive";

export default function Home() {
  return (
    <main className="inner">
      <DramaArchive />
      <div id="about">
        <h2>About</h2>
        <p>
          このサイトはいしざきが今まで観た海外ドラマの（独断と偏見に満ちた）レビューをまとめたものです。
        </p>
      </div>
    </main>
  );
}