# 第5章　コンポーネントへ分ける

## 目的

長い`page.js`を、役割ごとのファイルへ分けます。

## 1. 分ける基準

次のいずれかに当てはまるものを、コンポーネントの候補にします。

- 名前を付けられる
- 同じ形を繰り返す
- 別のページでも使う可能性がある
- 独立した動きを持つ
- ファイルを分けると親の役割が読みやすくなる

細かく分けること自体が目的ではありません。

## 2. HeaderとFooter

```jsx
// src/components/layout/Header.jsx
import Image from "next/image";

const navigationItems = [
  { href: "#featured", label: "Featured" },
  { href: "#dramas", label: "Dramas" },
  { href: "#about", label: "About" },
];

export default function Header() {
  return (
    <header className="header">
      <div className="header__inner inner">
        <a href="#featured" className="header__logo" aria-label="Drama Archive トップへ">
          <Image src="/pict/logo.svg" alt="Drama Archive" width={180} height={35} />
        </a>

        <nav className="header__nav" aria-label="メインナビゲーション">
          <ul>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}

          </ul>
        </nav>
      </div>
    </header>
  );
}
```

PC用とスマートフォン用に同じリンクを二度書かず、一つの配列から生成します。

```jsx
// src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="footer">
      <p>© Yasuyuki Ishizaki</p>
    </footer>
  );
}
```

## 3. pageを目次のようにする

```jsx
// src/app/page.js
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DramaArchive from "@/components/drama/DramaArchive";

export default function Home() {
  return (
    <>
      <Header />
      <main className="inner">
        <DramaArchive />
      </main>
      <Footer />
    </>
  );
}
```

親ファイルを読むと、ページの構成が短時間で分かる状態を目指します。

## 今日の確認

- [ ] コンポーネントを分ける理由を説明できる
- [ ] importとexportの対応を確認できる
- [ ] `page.js`がページ構成を示す形になった
- [ ] 分割前と同じ見た目を保った

## Git

```bash
git add .
git commit -m "Split page into reusable components"
```