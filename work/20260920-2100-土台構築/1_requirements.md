# 1. Requirements — 土台（core）構築

## 目的

architecture.md の方針「土台を先に作ってから、課題の種類とゲームを分担する」に従い、
打鍵判定・型定義・registry の土台を作る。
まだソースコードが一切存在しないため、土台を動かして確認できる最小限の
プロジェクトセットアップもあわせて行う。

## やること

- プロジェクトの雛形セットアップ（Vite + React + TypeScript / ESLint + Prettier / Vitest）
- `src/core/types/` — 課題（TypingTask）・出題（Challenge）・結果（Session/KeyMiss）の型定義
- `src/core/engine/` — 打鍵判定・スコア計算（速度・正確さ）・ローマ字変換
- `src/core/registry/` — 課題・ゲームの登録場所（後から `tasks/` `games/` を足せる形）
- 上記に対する最低限のユニットテスト

## 受け入れ条件

- [ ] `npm install` / `npm run dev` が動く
- [ ] `npm run test` / `npm run typecheck` / `npm run lint` がすべて通る
- [ ] architecture.md 記載の `TypingTask` インターフェースを実装し、
      ダミーの課題を1つ registry に登録して呼び出せる
- [ ] ローマ字変換で「し」を `si` でも `shi` でも正解と判定できる（concept.md の要件）
- [ ] 1回分の打鍵結果（速度・正確さ・所要時間・キーごとのミス回数）を
      オブジェクトとして返せる（Supabase への保存はこの作業に含めない）

## やらないこと（スコープ外）

- Supabase 接続・認証・DB 保存（`lib/`）
- 画面（UI）の実装（`features/`）
- 実際の課題コンテンツ（`tasks/` `games/` の中身）— 土台完成後に分担する

## 関連

- `docs/backlog.md` の項目：なし
- `docs/known-issues.md` の No：なし
