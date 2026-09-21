# 3. Tasks — 土台（core）構築

完了したら `- [x]` に消し込む。**全部終わってもファイルは削除せず残す。**

作業中に思いついたスコープ外のことはここに足さない。
`docs/backlog.md` か `docs/known-issues.md` に送る。

- [x] `src/core/types/challenge.ts` — `ChallengeUnit` / `Challenge` の型定義
- [x] `src/core/types/task.ts` — `TypingTask` の型定義（architecture.md記載のものを実装）
- [x] `src/core/types/session.ts` — `Session` / `KeyMiss` の型定義
- [x] `src/core/engine/romaji.ts` — かな→ローマ字（複数表記）の変換、ユニットテスト
- [x] `src/core/engine/judge.ts` — 前方一致による打鍵判定（継続/確定/ミス）、ユニットテスト
- [x] `src/core/engine/score.ts` — 速度・正確さの計算、ユニットテスト
- [x] `src/core/registry/registry.ts` — `register` / `get` / `list`、ダミー課題での登録・取得テスト

## 品質チェック

- [x] テスト
- [x] 型チェック
- [x] lint
