# 3. Tasks — 環境構築とデプロイ確認

完了したら `- [x]` に消し込む。**全部終わったらこのファイルを削除する。**

作業中に思いついたスコープ外のことはここに足さない。
`docs/backlog.md` か `docs/known-issues.md` に送る。

## プロジェクト雛形

- [x] Vite + React + TypeScript の雛形を作成する
- [x] ESLint + Prettier を設定する
- [x] Vitest を設定し、サンプルテストを1つ用意する
- [x] architecture.md 記載の npm スクリプト（dev / test / typecheck / lint / build）を揃える

## タイトル画面

- [x] タイトルだけの最小画面を作る（1画面のみ）

## Supabase

- [x] Supabase プロジェクト作成の手順を案内する（ユーザーが実施）
- [x] `lib/supabase.ts` でクライアントを初期化する
- [x] 環境変数の読み込み（`.env` / `.env.example` のキー定義）を用意する
      → `.env.example` は権限上 Claude から編集できないため、ユーザーに追記を依頼済み
- [x] 簡単な呼び出し（`npm run check:supabase`）で疎通確認する（要 Supabase プロジェクト作成）

## Cloudflare Pages

- [ ] Cloudflare Pages プロジェクト作成・GitHub リポジトリ連携の手順を案内する（ユーザーが実施）
- [ ] `main` ブランチへの push で自動デプロイされることを確認する
- [ ] 公開 URL でタイトル画面が表示されることを確認する

## 品質チェック

- [x] テスト
- [x] 型チェック
- [x] lint
