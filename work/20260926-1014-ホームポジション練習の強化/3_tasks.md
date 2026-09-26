# 3. Tasks — ホームポジション練習の強化

完了したら `- [x]` に消し込む。**全部終わってもファイルは削除せず残す。**

作業中に思いついたスコープ外のことはここに足さない。
`docs/backlog.md` か `docs/known-issues.md` に送る。

### 作業前

- [x] `main` から作業ブランチ `feature/home-position-endless` を切る

### core（土台・追加のみ）

- [x] `src/core/types/task.ts` に `Stage` `EndlessPlan` を追加し、`TypingTask` に省略可能な `endless` を足す
- [x] `src/core/keyboard/layout.ts` を新規作成（下3段＋スペースの並び、`fingerOf` `fingerLabel`）
- [x] `src/core/keyboard/layout.test.ts` を新規作成
- [x] `src/core/engine/judge.ts` に `mergeJudgeStates` を追加し、`judge.test.ts` にテストを**追加のみ**
- [x] `src/core/registry/registry.test.ts` に「`endless` なしの課題が登録・取得できる」テストを**追加のみ**
- [x] 変更前からある `core/` のテストが、テスト側を書き換えずに通ることを確認する

### 課題（出題づくり）

- [x] `src/tasks/home-position-basic/index.ts` を作り直す
      （段階表・3種類のかたまり・英単語リスト・`LINES_PER_STAGE = 4`・`endless.next`・`generate`・新しい `label`）
- [x] `src/tasks/home-position-basic/index.test.ts` を新規作成
      （段階ごとの使用キー／数字の段が出ない／3連続なし／同じ指のかたまりを含む／4行ごとに段階が上がる／段階11で止まる）

### キー表示

- [x] `src/shared/ui/KeyHintRow.tsx` を3段＋スペース・指の色・指ラベル・`availableKeys` に対応させる
- [x] `src/index.css` にキー表示の3段・指の色のスタイルを追加する

### 練習画面

- [x] `src/features/practice/ResultCard.tsx` に結果カードを切り出し、`PracticeScreen` から使う
- [x] `PracticeScreen` にスペースの `preventDefault`・`␣` 表示・`white-space: pre-wrap` を入れる
- [x] `src/features/practice/EndlessPractice.tsx` を新規作成
      （時間選択・カウントダウン・次の行・段階のお知らせ・結果・リトライ）
- [x] `PracticeScreen` で `task.endless` の有無により出し分ける
- [x] `src/index.css` に時間選択・残り時間・段階のお知らせのスタイルを追加する
- [x] `PracticeScreen.test.tsx` の課題名を直し、時間制のテストを追加する（fake timers）

### 確認

- [x] 品質チェック（下記）がすべて通る
- [x] `npm run dev` を起動し、ユーザーにブラウザで操作してもらう
      （1分で最後まで打つ・スペース表示とスクロール・段階の上がる速さ・`touch-type-fj` が今までどおり）
- [x] ラップアップ（`/wrapup` を実行する）

## 品質チェック

- [x] テスト（`npm run test`）
- [x] 型チェック（`npm run typecheck`）
- [x] lint（`npm run lint`）
