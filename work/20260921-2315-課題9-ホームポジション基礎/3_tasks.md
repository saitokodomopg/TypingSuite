# 3. Tasks — 課題9「オリジナル課題：ホームポジション基本モード」

完了したら `- [x]` に消し込む。**全部終わってもファイルは削除せず残す。**

作業中に思いついたスコープ外のことはここに足さない。
`docs/backlog.md` か `docs/known-issues.md` に送る。

- [x] `src/tasks/home-position-basic/index.ts` を作成し、`TypingTask` を実装する
      （出題：`asdf` / `jkl;` / `asdfjkl;` の3パターン）
- [x] `src/tasks/index.ts` に登録用の import を1行追加する
- [x] `npm run dev` を起動し、セレクトボックスに表示され3パターンとも最後まで打てることを確認する
      （ユーザーがブラウザで確認済み）
- [x] ラップアップ（`/wrapup` を実行する）

## 品質チェック

- [x] テスト（`npm run test` — 24 passed）
- [x] 型チェック（`npm run typecheck` — エラーなし）
- [x] lint（`npm run lint` — エラーなし）
