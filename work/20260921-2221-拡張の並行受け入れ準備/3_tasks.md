# 3. Tasks — 拡張の並行受け入れ準備

完了したら `- [x]` に消し込む。**全部終わってもファイルは削除せず残す。**

作業中に思いついたスコープ外のことはここに足さない。
`docs/backlog.md` か `docs/known-issues.md` に送る。

- [x] `src/tasks/index.ts` を新設し、`touch-type` の登録importをここに集約する
- [x] 確認用のダミー課題をもう1つ追加する（例：ホームポジションの別キー組）
      `src/tasks/{フォルダ名}/index.ts` に `TypingTask` を作り、`src/tasks/index.ts` に追記する
      → `src/tasks/touch-type-dk/index.ts`（id: `touch-type-dk`）として追加
- [x] `src/features/practice/PracticeScreen.tsx` を修正する
      - `'../../tasks/touch-type/index.ts'` への直接importをやめ、`'../../tasks/index.ts'` を import する
      - ハードコードされた `TASK_ID` をやめ、`registry.list()` の結果から選べるセレクトボックスを追加する
      - 選択中の課題が変わったら出題をやり直す（判定状態をリセットする）
- [x] 複数課題が衝突なく登録されることを確認するテストを足す
      → `registry.test.ts` は既存テストで多重登録を既にカバーしていたため、
      実際の統合ポイントである `src/tasks/index.test.ts` を新設して確認した
- [x] `src/features/practice/PracticeScreen.test.tsx` に、セレクトボックスで課題を切り替えられることの
      最低限のテストを足す
- [x] `src/tasks/README.md` を作成する（2部構成）
      1. 課題メニュー — 前回チャットで確定した9項目（数字・記号／プログラミング用語／
         ことわざ・四字熟語／英文／都道府県名／慣用句・早口言葉／好きなジャンル語句／
         記号多めのコード風／オリジナル課題）をそのまま掲載する。
         各項目末尾に共通の達成基準として
         「ブランチをpushし、プレビューURLでブラウザから動作確認できれば完成
         （mainへのマージは含まない）」を明記する
      2. 追加の手順 — `touch-type` をテンプレとして、以下をコピペ可能なコード例つきで書く
         - フォルダを作る → `TypingTask` を書く → `src/tasks/index.ts` に1行追記する
         - `git checkout -b` でブランチを切る → コミット → `git push` する
         - push後にCloudflare Pagesが発行するプレビューURLの見つけ方
           （PRを開いたときのコメント、またはCloudflareダッシュボード）
- [x] `docs/backlog.md` の「次にやりたい」に、ゲーム候補（タイムアタック／落ちてくる単語／
      RPG風／コンボスコア）を追記する
- [x] `npm run dev` で実際に動作確認する
      - 2つの課題がセレクトボックスに出る／切り替えて両方最後まで打てる
      → 前回同様、手元にブラウザがない環境のためPlaywrightのheadless Chromiumで確認する
      → セレクトボックスに2課題表示／切り替え後の表示（dkdk）／両方で結果表示までを確認済み

## 品質チェック

- [x] テスト
- [x] 型チェック
- [x] lint

- [x] ラップアップ（`/wrapup` を実行する）
