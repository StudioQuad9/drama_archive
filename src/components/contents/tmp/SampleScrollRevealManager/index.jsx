// @/components/contents/SampleScrollRevealManager/index.jsx

// ブラウザから届く監視結果を再現した仮のデータ
const sampleEntries = [
  {
    id: "card-3",
    isIntersecting: true,
    top: 100,
    left: 600,
  },
  {
    id: "card-1",
    isIntersecting: true,
    top: 100,
    left: 0,
  },
  {
    id: "card-4",
    isIntersecting: false,
    top: 300,
    left: 0,
  },
  {
    id: "card-2",
    isIntersecting: true,
    top: 100,
    left: 300,
  },
];

export default function SampleScrollRevealManager() {
  return (
    <ScrollRevealManager entries={sampleEntries} />
  );
}

function ScrollRevealManager({ entries }) {
  // 1. 画面内に入ったカードだけを集める。
  const group = entries
    .filter((entry) => {
      return entry.isIntersecting;
    })

    // 2. 左から右の順番へ並べる
    .sort((a, b) => {
      return a.left - b.left;
    });
  
  console.log("ブラウザから届いた監視結果：", entries);
  console.log("Managerが作った組み", group);

  group.forEach((entry, index) => {
    console.log(
      entry.id, `${index * 150}ms後に表示させる`
    );
  });

  return (
    <div>
      <h4>今回、画面に入ったカードの組</h4>

      <ul>
        {
          group.map((entry) => (
            <li key={entry.id}>
              {entry.id}
            </li>
          ))
        }
      </ul>
    </div>
  );
}