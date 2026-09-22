# 1. Requirements — 課題9「オリジナル課題：ホームポジション基本モード」

## 目的

`src/tasks/README.md` の課題メニューのうち「9. オリジナル課題（自由に決める）」として、
指を置いたまま打てる**ホームポジションの8キーだけ**を出題する超基本モードを実装する。

既存の `touch-type-fj`（F/Jのみ）は土台確認・テンプレ用のサンプルであり、
ホームポジション全体をカバーしていない。今回はその全体版として、
「最初に指を置いているキー（A S D F / J K L ;）」だけが出題される、
一番易しい練習モードを追加する。

## やること

- `src/tasks/home-position-basic/index.ts` に `TypingTask` を1つ実装する
  - 出題対象はホームポジション8キーのみ：`a s d f j k l ;`
  - 出題パターンは3つ以上
    1. 左手のみ：`asdf`
    2. 右手のみ：`jkl;`
    3. 両手通し：`asdfjkl;`
  - `touch-type-fj` と同様、1キー＝1ユニット（`display`と`accepted`が同じ1文字）で構成する
- `src/tasks/index.ts` に登録用の import を1行追加する
- ローカルで `npm run dev` を起動し、セレクトボックスから選んで最後まで打てることを確認する

## 受け入れ条件

- [x] `src/tasks/home-position-basic/index.ts` が3パターン以上の出題を返す
- [x] 出題される文字がホームポジション8キー（`a s d f j k l ;`）のみで構成されている
- [x] `src/tasks/index.ts` に登録され、`npm run dev` のセレクトボックスに表示される
- [x] 練習画面で3パターンとも最後まで打てることを目視確認する
- [x] `npm run test` / `npm run typecheck` / `npm run lint` がエラーなしで通る
- [x] ユーザー自身がブラウザ（`npm run dev`）で実際に操作し、動作を確認する

## やらないこと（スコープ外）

- ブランチ push・PR作成・プレビューURLでの確認（README記載の最終手順）は、
  ローカル確認と品質チェックが完了した後、別途ユーザーの指示を得てから行う
  （CLAUDE.md の git 運用ルールにより、push はユーザー指示があった場合のみ）
- ダミー課題 `touch-type-dk` の削除（`known-issues.md` No.1 は実課題2件目が揃ってから判断）
- 他の課題メニュー項目（1〜8）の実装
- ホームポジション以外のキー（上段・下段など）を含む発展的な出題

## 関連

- `docs/backlog.md` の項目：なし（該当なし）
- `docs/known-issues.md` の No：1（touch-type-dk 削除の前提条件に、本作業で1件目の実課題が揃う）
