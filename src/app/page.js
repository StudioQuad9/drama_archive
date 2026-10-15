// @/app/page.js

import DramaArchive from "@/components/contents/DramaArchive";

export default function Home() {
  const items = [
    { id: "one", value: 1 },
    { id: "two", value: 2 },
    { id: "three", value: 3 },
  ];

  return (
    <main className="inner">
      {
        items.map((item) => (
          <p key={item.id}>
          {/* <p> */}
            {item.value}
          </p>
        ))
      }
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