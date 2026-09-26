# 3. Tasks — 都道府県名打ちタスクの追加

完了したら `- [x]` に消し込む。**全部終わってもファイルは削除せず残す。**

作業中に思いついたスコープ外のことはここに足さない。
`docs/backlog.md` か `docs/known-issues.md` に送る。

- [x] `src/tasks/prefecture/index.ts` を作成する
      - 47都道府県の `{ name: 漢字, kana: ひらがな読み }` データを持つ
      - `generate()` で47件から重複なく5件をランダム抽選する
      - 抽選した5件それぞれを `kanaToUnits(kana)` で `ChallengeUnit[]` に変換し、そのまま連結する
        （区切りキーは不要。スペースを打たなくても続けて打てる）
      - `displayText` は選ばれた5件の漢字名を区切り文字でつないだ文字列にする
      - `TypingTask` として `register()` する
- [x] `src/tasks/index.ts` に `import './prefecture/index.ts'` を1行追記する
- [x] `src/tasks/prefecture/index.test.ts` を作成する
      - 47件登録されていること／5件抽選されること／単語間の区切り入力が不要なこと／
        `kanaToUnits` 連携でromaji変換されることを確認する最小限のテスト
- [x] `npm run dev` を起動し、実際のブラウザ操作で確認する
      - セレクトボックスに「都道府県名打ち」が表示され、選択できる
      - 出題された漢字の都道府県名どおりに、ローマ字を続けて最後まで打てる（スペース不要）
      - リトライ・再選択で出題される5件の組み合わせが変わることを確認する
- [x] ラップアップ（`/wrapup` を実行する）

## 品質チェック

- [x] テスト（`npm run test`）
- [x] 型チェック（`npm run typecheck`）
- [x] lint（`npm run lint`）
