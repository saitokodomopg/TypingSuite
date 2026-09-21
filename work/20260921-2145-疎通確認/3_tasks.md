# 3. Tasks — 疎通確認（練習画面の縦切り）

完了したら `- [x]` に消し込む。**全部終わってもファイルは削除せず残す。**

作業中に思いついたスコープ外のことはここに足さない。
`docs/backlog.md` か `docs/known-issues.md` に送る。

- [x] `src/tasks/touch-type/index.ts` — ダミーの `TypingTask` を実装し registry に登録する
      （例: `fjfj` のような固定文字列を `ChallengeUnit[]` にした最小の課題）
- [x] `src/features/practice/PracticeScreen.tsx` — 練習画面を実装する
      - `registry.get()` で課題を取得し `generate()` で出題
      - `createJudgeState()` で判定状態を初期化
      - キー入力ごとに `judgeKey()` を呼び、`outcome`（progress/unitComplete/challengeComplete/miss）に応じて表示を更新
      - 最初のキー入力時刻を記録し、`challengeComplete` になったら経過時間とともに `calculateSession()` を呼ぶ
      - 結果（速度・正確さ・ミスしたキー）を画面に表示する
- [x] `src/App.tsx` を一時的に `PracticeScreen` を描画するように変更する
      （ルーティングは未導入のためスコープ外。正式な画面遷移は別work）
- [x] `src/features/practice/PracticeScreen.test.tsx` — 最低限のテスト
      （課題文が表示される／1ユニット分キー入力すると次のユニットに進む、程度）
- [x] `npm run dev` で実際に手打ちして動作確認する
      （課題文を最後まで打てる／ミスキーでバッファが進まない／結果が表示される）
      → Playwright で headless Chromium を操作して確認（手元にブラウザがない実行環境のため）

## 品質チェック

- [x] テスト
- [x] 型チェック
- [x] lint
