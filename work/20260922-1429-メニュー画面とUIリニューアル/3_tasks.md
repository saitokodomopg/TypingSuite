# 3. Tasks — メニュー画面追加とUIリニューアル（案B）

完了したら `- [x]` に消し込む。**全部終わってもファイルは削除せず残す。**

作業中に思いついたスコープ外のことはここに足さない。
`docs/backlog.md` か `docs/known-issues.md` に送る。

- [x] `react-router-dom` を導入する
      - `package.json` の `dependencies` に追加する
      - `docs/architecture.md` で採用済みの技術のため、新規の技術決定としての承認は不要

- [x] ルーティングを組み込む
      - `src/main.tsx` に `BrowserRouter` を追加する
      - `src/App.tsx` に `Routes` を定義する（`/` → `MenuScreen`、`/practice/:taskId` → `PracticeScreen`）
      - `App.tsx` の「疎通確認のため一時的に描画」コメントを削除する

- [x] デザイントークンとフォントを追加する
      - `src/index.css` に `2_design.md` のCSS変数（`--bg` `--ink` `--muted` `--accent` `--accent-soft`
        `--warn` `--warn-soft` `--border` `--card-bg`）を追加する
      - `index.html` の `<head>` に Google Fonts（Zen Maru Gothic / JetBrains Mono）の `<link>` を追加する

- [x] `src/shared/ui/` に共通部品を作成する
      - `icons.tsx`：チェック・リフレッシュ・キーボード・スター・フレイム・雷・的（ターゲット）・
        マスコット（笑顔）のインラインSVGアイコンをまとめる
      - `Card.tsx`：白背景・角丸・影のカード
      - `PillButton.tsx`：選択状態（`aria-pressed`）を持つピル型ボタン
      - `ProgressRing.tsx`：`value`（0〜1）を円グラフで表示
      - `KeyHintRow.tsx`：固定8キー（A S D F ... J K L ;）を描画し、渡された1文字が
        含まれる場合だけ該当キーをハイライトする。含まれない場合は何も描画しない
      - `AppHeader.tsx`：ロゴマーク＋タイトル＋タグライン。`backToMenu` のような
        propで「← メニューへ」リンクの表示有無を切り替えられるようにする

- [x] `MenuScreen` を新規作成する（`src/features/menu/MenuScreen.tsx`）
      - `core/registry` の `list()` で登録課題を取得し、`Card` で一覧表示する
      - カードクリックで `/practice/${task.id}` へ `navigate` する
      - `MenuScreen.test.tsx`：課題一覧が表示されること／クリックで該当URLへ遷移することを確認する

- [x] `PracticeScreen` をルーティング対応・UI刷新する
      - `useParams<{ taskId: string }>()` から `taskId` を取得する形に変更し、
        内部での `taskId` の `useState` 管理をやめる
      - 課題切り替えボタン（`PillButton`）のクリックで `navigate(`/practice/${id}`)` するように変更する
      - `AppHeader`（「← メニューへ」リンク付き）を追加する
      - `ChallengeCard` / `TypingCard`（`ProgressRing` ＋ 入力表示 ＋ `KeyHintRow`）/
        `ResultCard` を `2_design.md` の構成どおりに実装する
      - 入力済み／次の1文字の色分けなど、既存の判定・表示ロジック（`judge` / `score`）自体は変更しない
      - `taskId` に対応する課題がない場合の「課題が見つかりません」表示は現状を維持する
      - `PracticeScreen.test.tsx` を `MemoryRouter` 配下でのレンダーに書き換え、
        存在しない `taskId` のケースと課題切り替えボタンでのURL遷移のテストを追加する

- [x] `docs/known-issues.md` No.1 の対応（あわせて実施）
      - `src/tasks/touch-type-dk/` を削除する
      - `src/tasks/index.ts` の該当import行を削除する
      - `docs/known-issues.md` No.1 の「なおした日」を記入する

- [x] `App.test.tsx` を確認する
      - `/` アクセス時に `AppHeader` の見出し `TypingSuite` が表示される前提のまま
        テストが通ることを確認する。通らない場合のみ、ルーティングに合わせて最小限修正する

- [x] `npm run dev` を起動し、実際のブラウザ操作で確認する
      - `/` でメニューが表示され、課題カードから練習画面に遷移できる
      - `/practice/:taskId` に直接アクセスして、その課題単体が開けることを確認する
      - 存在しない `taskId` でアクセスし、「課題が見つかりません」と表示されることを確認する
      - 練習画面の「← メニューへ」リンクでメニューに戻れることを確認する
      - 画面内の課題切り替えボタンで別の課題のURLに遷移し、練習が続けられることを確認する
      - メニュー・練習画面ともに、案Bの見た目（カード・色分け・進捗リング・アイコン等）になっていることを確認する

- [x] PR を作成し `main` にマージする
- [ ] `main` への反映後、Cloudflare Pages の自動デプロイ完了を本番URLで確認する
      - 本番確認で `/practice/:taskId` への直リンクが404になる不具合を発見（Cloudflare Workers
        Static AssetsにSPAフォールバック設定がなかったため）。`wrangler.jsonc` に
        `not_found_handling: "single-page-application"` を追加して修正、別PRで対応中

- [ ] ラップアップ（`/wrapup` を実行する）

## 品質チェック

- [x] テスト（`npm run test`）
- [x] 型チェック（`npm run typecheck`）
- [x] lint（`npm run lint`）
