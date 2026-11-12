# 4. 本番と共通の記事プレビュー

## 現在の構成

「記事をプレビュー」を押すと、入力中の内容を既存の汎用Modalで開く。
公開サイトと同じDramaDetailコンポーネント・DramaDetail.module.scssを使う。
管理画面専用に記事レイアウトを複製しない。
保存前の入力値を既存の変換処理でDramaDetailが受け取れる形式にする。
表示は開いた時点の入力内容。閉じれば編集に戻れる。保存・公開はしない。
05の公開・更新・非公開の処理はそのまま残す。

## 表示する内容

タイトル直下に年・シーズン数・ジャンル・配信先・評価を小さい白文字で中央配置。
区切りは | 。詳細モーダルは作品情報の下にYouTube動画、レビュー見出し、Markdown本文を表示。
メイン画像はカードに、メイン＋サブ画像はFeaturedのスライダーに使う。
引用文・引用者もFeatured側の情報とし、詳細モーダルには配置しない。
YouTube未入力なら動画欄を出さない。本文の生HTMLは描画しない。
Featured指定はトップページ側の配置指定なので記事本文には表示しない。
画像表示部品は管理画面のアップロード確認で使用する。非公開Storage画像は認証済みの管理者が
期限付きURLで確認する。公開画像の匿名配信は後の段階で接続する。

## ファイル

- src/app/admin/ArticlePreview.jsx：入力値の変換とモーダルの開閉。
- src/app/admin/DraftWorkspace.jsx：プレビューボタンの配置。
- src/components/contents/DramaDetail/index.jsx：本番と共通の記事表示。
- src/components/contents/DramaDetail/DramaDetail.module.scss：共通スタイル。
- src/components/contents/DramaDetail/ArticleImage.jsx：共通の画像表示。
- src/app/admin/ImageUpload.jsx：画像表示を共通部品へ切り出して再利用。

初期版のpreview.module.scssは現在の表示では使用しない。

## 確認

/adminで原稿を選び「記事をプレビュー」を押す。
タイトル・作品情報・YouTube・見出し・本文がモーダル内で表示されることを確認する。
カード用・スライダー用の画像はモーダルに出ないことを確認する。
閉じるボタン、背景、Escで編集へ戻れることを確認する。
公開サイトの既存記事にも同じ詳細レイアウトが反映される。
DBの内容やrevisionはプレビュー操作では変わらない。

## 記事幅と上下の余白

DramaDetailの横幅は本文量によらず最大800px、画面幅から左右40pxを引いた幅。
高さは画面いっぱいを上限とし、長文では上下の外余白を設けず、記事内でスクロールする。
本番・プレビューとも同じ指定を使用する。汎用Modalのスタイルは変えない。
