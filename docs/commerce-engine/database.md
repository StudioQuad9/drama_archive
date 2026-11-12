# 記事DBの準備

## 状態

SQLをローカルに用意した段階。会社Supabaseへの適用、GitHubへのpushは未実施。
既存画面はまだ src/data/dramas.js を使う。

## 今回追加するもの

| 保存先 | 内容 | アクセス |
| --- | --- | --- |
| article_admins | 許可した管理者のユーザーID | 自分の登録有無のみ読み取り可。アプリから追加・変更不可 |
| articles | 作業中の原稿、所有者、版番号 | 管理者が自分の原稿だけ作成・閲覧・編集 |
| article_publications | 公開操作でコピーした原稿 | 誰でも閲覧可。直接の書き込みは不可 |

本文の形式は前段階の変換処理と同じ content / metadata。
DBでは published_at、アプリ側の形式では publishedAt を使うため、
DB読み込みの実装時に変換する。下書きは空のタイトル・本文も保存できる。
公開時は両方必須。画像などの入力検証は編集画面と次のDB変更で追加する。

## 公開と非公開

publish_article(記事ID, 確認した版番号) だけが公開版を更新する。
管理者かつその原稿の所有者であることをDB内で確認する。
保存で版番号が増え、確認時と異なる版なら公開を止める。
公開版は原稿のコピーなので、以降の下書き保存では変化しない。
再公開しても初回公開日時は維持し、更新日時だけを変更する。
公開URLの重複は不可。公開済みURLは一旦非公開にするまで変更不可。
unpublish_article(記事ID) は公開版だけを削除し、下書きを残す。
最初は所有者本人だけが編集できる。管理者間の共同編集、記事削除、
公開履歴、自動保存の競合解決はこの段階の対象外。

## 適用

対象は会社の commerce_engine プロジェクトだけ。
GitHub連携は StudioQuad9/drama_archive / feature/blog、Working directory は .。
追加SQLは supabase/migrations/20261112010000_create_articles.sql。
同じ変更をSQL EditorとGitHub自動適用の両方から実行しない。
今回はGitHubのマイグレーションとして適用し、結果を確認する想定。

適用後、Table Editorに3テーブルがあり、RLSが有効であることを確認する。
管理者はまだ0人なので、ログインできても記事の作成はできない。
認証ユーザーを用意してから、DB所有者がSQL Editorで管理者登録する。
パスワード、接続用秘密キーをリポジトリへ入れる必要はない。

## 検証

PGliteによる一時的なPostgreSQL環境でSQLを実行し、22項目を確認した。
Supabaseの anon / authenticated と auth.uid() を模した検証であり、
実際のSupabase Auth・Data API・GitHub自動適用の動作は別途確認が必要。
検証コードは supabase/tests/check-articles.mjs。
@electric-sql/pglite を導入した一時フォルダへ supabase/ をコピーし、
そのフォルダ内で node supabase/tests/check-articles.mjs を実行できる。
本番用の依存パッケージには追加しない。

確認内容：訪問者の下書き閲覧拒否、一般利用者の作成・公開拒否、
管理者の自己昇格拒否、他の管理者の原稿へのアクセス拒否、所有者変更拒否、
公開版への直接書き込み拒否、公開後の下書き分離、古い版の公開拒否、
空原稿の公開拒否、URL重複拒否、URL変更制限、非公開後の下書き保持。
