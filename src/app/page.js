// @/app/page.js

import DramaArchive from "@/components/contents/DramaArchive";

export default function Home() {
  return (
    <main className="inner">
      <DramaArchive />


      {/* <section id="modal-true-detective" className="modal">
        <div className="modal-content">
          <h4>True Detective</h4>
          <div className="youtube">
            <iframe
              src="https://www.youtube.com/embed/jdu3hAAmFtk?si=wXd8WIX98FLWJIYQ"
              title="True Detective"
              allowFullScreen
              >
            </iframe>
          </div>
          <h5>マスターピース</h5>
          <p className="review">
            1シーズン完結型。シーズンごとに内容が大きく異なる。
            <br />
            シーズン1はルイジアナ州で起きた儀式殺人を2人の刑事が追うサイコ・サスペンス。シーズン2はロサンゼルス近郊の街で役人が殺された事件をきっかけに腐敗した権力機構に飲み込まれる者たちのノワール群像劇。シーズン3は、2人の子どもの失踪事件を3つの時間軸で描く。シーズン4は未鑑賞。
            <br />
            どのシーズンも素晴らしいのだが、やはりシーズン1が別格。これを観るためだけにHBOに加入してもいいレベル。
            <br />
            マシュー・マコノヒーがニヒリスティックでとても癖の強いラスト・コール刑事を凄まじい演技力で「完璧に」演じ切っている。対する相棒のマーティン・ハートも、ラスト刑事に比べると平凡な刑事という役柄だが、彼の正義感や欲望・失敗をウディ・ハレルソンが巧みに演じ、非常に奥行きのあるキャラクターを表現している。
            <br />
            もちろん物語の核となる脚本も1話からエンジンが全開で、終演まで一切だれることなく進んでいく。
            <br />
            シーズン2はシーズン1とはジャンルも全く違うので、1にハマった人に安易に勧められないのだが、主人公の一人レイ・ヴェルコロ刑事演じるコリン・ファレルが本当に素晴らしいので、できたら観てほしい。レイという人物の今までの人生を感じさせるほどの演技は胸に迫るものがある。
            <br />
            これは個人的なジンクスなのだが、オープニングがかっこいいドラマは外さないの好例。スタジオは数々の賞を取っている
            <a
              href="https://antibody.tv/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Antibody
            </a>
            。って言っときながら、サイトを確認したら1話で切ったラヴクラフト・カントリーとアメリカン・ゴッドのオープニングもあったので、ジンクスの信頼度は低いかもしれない。でもかっこいい。
          </p>
        </div>
      </section> */}

      <div id="about">
        <h2>About</h2>
        <p>
          このサイトはいしざきが今まで観た海外ドラマの（独断と偏見に満ちた）レビューをまとめたものです。
        </p>
      </div>
    </main>
  );
}