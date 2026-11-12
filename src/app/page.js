// @/app/page.js

import DramaArchive from "@/components/contents/DramaArchive";
import { getPublishedDramas } from "@/lib/articles/publications";

export const dynamic = "force-dynamic";

export default async function Home() {
  let dramas;
  try {
    dramas = await getPublishedDramas();
  } catch {
    return <main className="inner"><h1>Drama Archive</h1><p role="alert">公開記事を読み込めませんでした。時間をおいてページを再読み込みしてください。</p></main>;
  }
  return (
    <main className="inner">
      <DramaArchive dramas={dramas} />
      <div id="about">
        <h2 data-reveal>About</h2>
        <p>
          このサイトはいしざきが今まで観た海外ドラマの（独断と偏見に満ちた）レビューをまとめたものです。
        </p>
      </div>
    </main>
  );
}