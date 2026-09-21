# 1. Requirements — 環境構築とデプロイ確認

## 目的

「土台（core）構築」の本実装に入る前に、開発環境・外部サービス・デプロイの
疎通を確認し、迷わず開発を始められる状態を作る。
エンジン（打鍵判定など）は含めず、タイトルだけの画面で確認する。

## やること

- プロジェクト雛形セットアップ（Vite + React + TypeScript / ESLint + Prettier / Vitest）
  architecture.md 記載の npm スクリプト（dev / test / typecheck / lint / build）が揃った状態にする
- タイトルだけの最小画面（1画面のみ。ルーティング・複数画面は作らない）
- Supabase プロジェクトの新規作成（ユーザー側の作業。手順を案内する）
- Supabase クライアントの疎通確認
  接続情報を `.env`（git 管理外）に設定し、クライアント初期化 → 簡単な呼び出しが
  エラーなく通ることを確認する（テーブル・認証はまだ作らない）
- Cloudflare Pages プロジェクトの新規作成・GitHub リポジトリ連携（ユーザー側の作業。手順を案内する）
- `main` ブランチへの push で自動デプロイされることを確認する

## 受け入れ条件

- [ ] `npm run dev` でタイトル画面が表示される
- [ ] `npm run build` / `npm run test` / `npm run typecheck` / `npm run lint` がすべて通る
- [ ] Cloudflare Pages の公開 URL でタイトル画面が見られる
- [ ] Supabase クライアントが初期化でき、簡単な呼び出し（例：空のテーブルへの SELECT）が
      エラーなく返ることを確認できる
- [ ] Supabase の接続情報が `.env`（git 管理外）に置かれ、リポジトリにコミットされていない

## やらないこと（スコープ外）

- `core/engine` `core/types` `core/registry` の実装（次の作業「土台構築」で行う）
- 認証機能・テーブルスキーマ（`students` `sessions` 等）の実装
- 複数画面・画面遷移

## 進め方の注意

- Supabase / Cloudflare Pages のアカウント作成・プロジェクト作成は
  ブラウザでの手作業になるため、Claude が手順を案内し、ユーザーが実施する
- 発行された接続情報（URL・API Key）はユーザーから `.env` に貼ってもらう形にし、
  Claude がチャット上でその値を扱わない

## 関連

- `docs/backlog.md` の項目：なし
- `docs/known-issues.md` の No：なし
