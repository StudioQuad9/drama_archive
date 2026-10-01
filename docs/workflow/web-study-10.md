# 第10章　現在のサイトを公開する

## 目的

第9章までで、元のHTML版にあった主な構造と機能をNext.jsへ移植しました。

この章では、ここまでの状態を一度完成地点として確認し、GitHub Pagesへ公開します。

そのあと、元のHTML版にはなかった機能を追加します。

```text
第9章までの移植内容を確認する
↓
グローバルメニューの移動を滑らかにする
↓
現在の完成状態をGitHub Pagesへ公開する
↓
全文検索とジャンル検索を実装する
```

ここからは、元のサイトを再現する段階から、ReactとNext.jsを使ってサイトを発展させる段階へ進みます。

---

## 1. 第9章までの到達点を確認する

第9章までに、元のHTML版にあった主な内容をNext.jsへ移しました。

```text
HTML
→ JSXとコンポーネントへ分割した

作品情報
→ dramas.jsへまとめた

作品カード
→ map()で生成した

モバイルメニュー
→ useStateで開閉した

Modal
→ 共通コンポーネントにした

作品レビュー
→ 選択した作品データから表示した

YouTube
→ Modalを閉じるとiframeを削除して停止した
```

まず、次の動作を確認します。

- 特集作品と通常作品が表示される
- モバイルメニューを開閉できる
- 作品カードを選択するとレビューが表示される
- 別の作品を選択すると内容が変わる
- Modalを閉じるとYouTubeの音声が止まる
- PC表示とスマートフォン表示が崩れていない
- コンソールにエラーが出ていない

ここまで動作すれば、元のHTML版のNext.jsへの移植は完了です。

---

## 2. グローバルメニューの移動を滑らかにする

現在のグローバルメニューは、ページ内リンクを使用しています。

```jsx
<a href="#featured">Featured</a>
<a href="#dramas">Dramas</a>
<a href="#about">About</a>
```

リンクを選択すると目的の場所へ移動しますが、初期状態では一瞬で位置が変わります。

今回は、ページ全体を管理している`_base.scss`へ次の指定を追加します。

```scss
// @/styles/_base.scss

html {
  scroll-behavior: smooth;
}
```

これだけで、同じページ内のリンクを選択したとき、目的の位置まで滑らかに移動します。

```text
グローバルメニューを選択する
↓
hrefに書かれたidを探す
↓
目的の位置まで滑らかにスクロールする
```

JavaScriptでスクロール位置を計算しているわけではありません。ページ内リンクの移動方法をCSSで変更しています。

動きを減らすOS設定を利用している場合は、一瞬で移動する状態へ戻します。

```scss
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

PC用メニューとモバイルメニューの両方から、目的の場所へ移動できることを確認します。

---

## 3. 現在の状態をGitHub Pagesへ公開する

第9章までの移植と、ページ内リンクの調整が完了しました。

ここで一度、現在の状態をGitHub Pagesへ公開します。

```text
自分のPCで変更する
↓
GitHubへpushする
↓
GitHub Actionsがbuildする
↓
GitHub Pagesへ公開する
```

公開後も、同じ流れでサイトを更新できます。

今回はNext.jsのサイトを静的ファイルとして書き出します。

```text
Next.jsのプロジェクト
↓
npm run build
↓
HTML・CSS・JavaScriptをoutへ書き出す
↓
GitHub Pagesがoutの内容を公開する
```

`output: "export"`を使用した静的出力では、実行時にNext.jsのサーバーを必要とする機能は利用できません。

現在のDrama Archiveは、作品データをプロジェクト内に持ち、ブラウザ上で操作する構成なので、静的出力できます。

---

## 4. 公開URLとbasePath

GitHubのリポジトリ名が`drama_archive`の場合、公開URLは次の形になります。

```text
https://GitHubユーザー名.github.io/drama_archive/
```

GitHub Pagesでは、サイトが`/`ではなく`/drama_archive`の下に置かれます。

```text
通常のサイト
/

GitHub Pages
/drama_archive/
```

この`/drama_archive`を`basePath`としてNext.jsへ伝えます。

リポジトリ名が異なる場合は、以降の`drama_archive`を実際のリポジトリ名へ置き換えてください。

---

## 5. next.config.mjsを設定する

```js
// next.config.mjs

const repositoryName = "drama_archive";
const isProduction =
  process.env.NODE_ENV === "production";

const basePath = isProduction
  ? `/${repositoryName}`
  : "";

const nextConfig = {
  output: "export",
  basePath,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
```

それぞれの役割を確認します。

```text
output: "export"
→ HTML、CSS、JavaScriptとして書き出す

basePath
→ GitHub Pagesのリポジトリ名を含むURLへ対応する

images.unoptimized
→ 画像最適化サーバーを使わず、画像を静的出力する

NEXT_PUBLIC_BASE_PATH
→ コンポーネントやデータからbasePathを利用できるようにする
```

開発中は`basePath`が空になるため、これまでどおり次のURLで確認できます。

```text
http://localhost:3000
```

---

## 6. public内のファイルへbasePathを付ける

`basePath`を設定しても、JavaScriptの文字列として書いた`/pict/...`へ、リポジトリ名が自動で追加されるわけではありません。

画像パスを作る小さな関数を用意します。

```text
src/
└── lib/
    └── assetPath.js
```

```js
// @/lib/assetPath.js

const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path) {
  return `${basePath}${path}`;
}
```

作品データで読み込みます。

```js
// @/data/dramas.js

import { assetPath } from "@/lib/assetPath";

export const dramas = [
  {
    id: "true-detective",
    image: assetPath(
      "/pict/truedetective.avif",
    ),
    // ほかのデータ
  },
];
```

ほかの作品画像も、同じ方法へ変更します。

```js
image: assetPath("/pict/strangerthings.avif"),
image: assetPath("/pict/mindhunter.avif"),
```

Headerのロゴも変更します。

```jsx
// @/components/contents/Header/index.jsx

import { assetPath } from "@/lib/assetPath";

<Image
  src={assetPath("/pict/logo.svg")}
  alt=""
  width={230}
  height={35}
/>
```

`public`内を参照しているほかの画像やファイルも、同じ方法へ揃えます。

次の値には`assetPath()`を使用しません。

```text
https://から始まる外部URL
#featuredなどのページ内リンク
YouTubeのURL
```

---

## 7. ローカルで公開用buildを確認する

公開前に、ローカルでエラーがないことを確認します。

```bash
npm run lint
npm run lint:styles
npm run build
```

プロジェクトに`lint:styles`が登録されていない場合は、そのコマンドを省略します。

buildに成功すると、プロジェクト直下へ`out`フォルダが作成されます。

```text
drama_archive/
└── out/
    ├── index.html
    ├── _next/
    └── pict/
```

`out`はbuildのたびに作り直せるため、Gitへ登録しません。

`.gitignore`へ次の指定があることを確認します。

```text
/out/
```

---

## 8. GitHub Actionsを作る

次のファイルを作ります。

```text
.github/
└── workflows/
    └── deploy.yml
```

```yaml
# .github/workflows/deploy.yml

name: Deploy Next.js site to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Setup Node
        uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

主な処理は次のとおりです。

```text
Checkout
→ GitHub上のファイルを取得する

Setup Node
→ buildに使用するNode.jsを用意する

Install dependencies
→ package-lock.jsonをもとに依存関係をインストールする

Build
→ Next.jsを静的ファイルとしてoutへ書き出す

Upload artifact
→ outを公開用データとして渡す

Deploy
→ GitHub Pagesへ公開する
```

`main`へpushされたとき、インストール、build、公開が自動で実行されます。

---

## 9. GitHub Pagesを有効にする

GitHubのリポジトリを開き、次の順番で設定します。

```text
Settings
↓
Pages
↓
Build and deployment
↓
Source: GitHub Actions
```

設定ファイルをGitへ記録します。

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push
```

GitHubの`Actions`タブで処理を確認します。

```text
黄色
→ 実行中

緑色
→ 成功

赤色
→ エラー
```

緑色のチェックが付いたら、Pagesに表示されたURLを開きます。

---

## 10. 公開したサイトを確認する

ローカルで動いていても、公開先ではパスやファイル名の大文字・小文字によって問題が出る場合があります。

次の内容を確認します。

- トップページが表示される
- ロゴと作品画像が表示される
- CSSが適用されている
- PC用メニューが動く
- モバイルメニューを開閉できる
- メニューから滑らかに移動できる
- 特集作品のModalを開閉できる
- 通常作品のModalを開閉できる
- YouTubeの動画を再生できる
- Modalを閉じると動画の音声が止まる
- ブラウザを再読み込みしても表示される
- コンソールにエラーが出ていない

ここで確認するのは、第9章までに作った機能と、この章で追加した滑らかなスクロールです。

絞り込み、ScrollReveal、Swiperはまだ作っていないため、この時点の確認項目には含めません。

公開できたら、元のHTML版をNext.jsへ移植する作業は一区切りです。

## 今日の確認

- [ ] 第9章までに作った機能が正常に動作する
- [ ] ページ内リンクで滑らかにスクロールする
- [ ] 動きを減らすOS設定では、滑らかなスクロールを無効にした
- [ ] `output: "export"`を設定した
- [ ] GitHub Pages用の`basePath`を設定した
- [ ] `assetPath()`を使って画像のパスを調整した
- [ ] `npm run build`が成功した
- [ ] GitHub Actionsによる公開処理が成功した
- [ ] 公開したサイトで画像とCSSが正しく表示された
- [ ] 公開したサイトでメニューとModalが正常に動作した
- [ ] Modalを閉じるとYouTubeの音声が停止した
- [ ] コンソールにエラーが出ていない

## Git

```bash
git add .
git commit -m "Publish Drama Archive with GitHub Pages"
git push
```

作業用branchを使用している場合は、Pull Requestを作成して`main`へ統合します。

`main`へ統合されるとGitHub Actionsが実行され、GitHub Pagesのサイトが更新されます。