# 3. Tasks — 課題3「ことわざ・四字熟語打ち」

## 実装

- [ ] `src/tasks/kotowaza-yojijukugo/index.ts` を作成する
  - 候補データ（漢字表記＋読み）を6件用意する（ことわざ3・四字熟語3、`1_requirements.md` の表のとおり）
  - `generate()` で候補からランダムに1件選び、`displayText` に漢字表記、
    `units` に `kanaToUnits(読み)` の結果を入れて返す
  - `id: 'kotowaza-yojijukugo'` で `register()` する
- [ ] `src/tasks/index.ts` に `import './kotowaza-yojijukugo/index.ts'` を1行追加する

## 確認

- [ ] `npm run test` / `npm run typecheck` / `npm run lint` を実行しエラーがないことを確認する
- [ ] `npm run dev` を起動し、セレクトボックスに「ことわざ・四字熟語打ち」が表示されることを確認する
- [ ] ユーザー自身がブラウザで複数回リトライし、6パターンのうち数パターンを実際に打って
      最後まで完了できることを確認する（「し」等の複数ローマ字表記の許容も含む）
- [ ] ラップアップ（`/wrapup` を実行する）
