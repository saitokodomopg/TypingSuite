# 2. Design — ホームポジション練習の強化

## 実装アプローチ

### 全体の方針

- 「時間制で出題し続ける課題」を、`TypingTask` に**省略可能な項目 `endless`** を足して表す
- `endless` を持つ課題だけ、練習画面が時間制の動きになる。持たない課題は今までどおり1問で終わる
- 出題を作るのは課題側（`tasks/home-position-basic/`）、時間・行の切り替え・集計は画面側（`features/practice/`）
- どのキーをどの指で打つかは、課題（出題づくり）と画面（ガイド表示）の両方が使うため `core/keyboard/` に置く
  （`tasks/` → `shared/` の依存を作らないため）

### 1. `core/types/task.ts` の拡張（下位互換あり）

```ts
// 段階の情報。画面の「段階が上がった」表示・キーの薄表示・結果表示に使う
export type Stage = {
  level: number        // 1 始まり
  totalLevels: number
  keys: string[]       // この段階までに出てくるキー（スペースは含めない）
  newKeys: string[]    // この段階で増えたキー（増えない段階は空）
}

// 時間制で出題し続ける課題の出題方法
export type EndlessPlan = {
  // これまでに打ち終えた行数から、次の1行と今の段階を返す
  next(progress: { clearedLines: number }): { challenge: Challenge; stage: Stage }
}

export type TypingTask = {
  id: string
  label: string
  generate(): Challenge
  endless?: EndlessPlan  // ★追加。省略した課題は今までどおり1問で終わる
}
```

**この形にした理由**

- 追加は省略可能な1項目だけ。既存の課題・`registry`・`src/tasks/README.md` のテンプレは書き換え不要
- `next` は「何行打ち終えたか」だけを受け取る純粋な関数（乱数を除く）にした。
  段階が上がるルールを課題の中に閉じ込められ、画面を動かさずにテストできる
- `generate()` は必須のまま残す。`endless` を持つ課題でも、段階1の1行を返すように実装する
  （`generate()` だけを呼ぶ既存の仕組みがあっても壊れない）

**見送った案**

| 案 | 見送った理由 |
|----|-------------|
| `generate(level)` のように引数を足す | 既存の課題は引数を無視するので動くが、「引数を受け取るのが正しい書き方」に見えてテンプレの意味が変わる。段階情報も返せない |
| 課題が状態を持つ（`createRun()` で出題器を作る） | テストで「N行目は段階いくつか」を確かめにくい。`next(clearedLines)` の純粋関数で足りる |
| 時間の選択肢（1/3/5/10分）を課題側に持たせる | 今回は1課題だけ。選択肢は画面側の定数にする（要件どおり他の値は受け付けない） |

### 2. `core/keyboard/layout.ts`（新規）

下3段とスペースの並び、キーごとの手・指を持つ。

```ts
export type Hand = 'left' | 'right'
export type Finger = 'pinky' | 'ring' | 'middle' | 'index' | 'thumb'

export const KEYBOARD_ROWS: string[][]   // 上段・中段・下段（小文字）
export function fingerOf(key: string): { hand: Hand; finger: Finger } | undefined
export function fingerLabel(key: string): string | undefined   // 例：「左手・中指」、スペースは「親指」
```

| 指 | 左手 | 右手 |
|----|------|------|
| 小指 | q a z | p ; / |
| 薬指 | w s x | o l . |
| 中指 | e d c | i k , |
| 人さし指 | r f v t g b | u j m y h n |
| 親指 | スペース | |

大文字で渡されても引けるように、中で小文字にそろえる。

### 3. `core/engine/judge.ts` に集計用の関数を追加

時間制では1行ごとに判定状態を作り直すため、行をまたいだ合計が必要になる。

```ts
// 2つの判定状態の打鍵数・正打数・完了ユニット数・ミスを足し合わせる
export function mergeJudgeStates(a: JudgeState, b: JudgeState): JudgeState
```

時間切れのときは「打ち終えた行の合計」＋「途中の行」を足して、既存の `calculateSession` に渡す。
所要時間は選んだ制限時間（ミリ秒）をそのまま使う。既存の関数は変えない。

### 4. 出題づくり（`tasks/home-position-basic/`）

**1行の形**：3〜5文字のかたまりを**5個**、スペースで区切る（約20〜25打鍵）。

**段階が上がる条件**：**4行**打ち終えるごとに1段階上がる（定数 `LINES_PER_STAGE = 4`）。

- 1段階あたり約100打鍵。1分に60文字打つ生徒で約1分40秒、150文字なら約40秒
- 10分で、ゆっくりの生徒は段階6〜7、速い生徒は最後の段階11まで届く見込み
- 実際に打ってみて合わなければ定数を変えるだけで調整できる

**段階の表**（要件どおり）

| 段階 | 増えるキー |
|------|-----------|
| 1 | f j |
| 2 | d k |
| 3 | s l |
| 4 | a ; |
| 5 | g h |
| 6 | r u v m |
| 7 | e i c , |
| 8 | w o x . |
| 9 | q p z / |
| 10 | t y b n |
| 11 | （増えない・英単語） |

**かたまりの作り方**（段階1〜10）

同じ指で打つキーをまとめる。3種類を混ぜる。

| 種類 | 作り方 | 例 |
|------|--------|-----|
| ホームに戻る | ホーム → 同じ指のキー → ホーム | `frf` `ded` `fgf` `;p;` |
| 縦に通す | 同じ指の上・中・下を順か逆に | `edc` `cde` `qaz` `/;p` |
| まぜる | 今の段階までのキーから、別々の指を3〜5文字 | `fjdk` `slak` |

- 1〜5段階（中段だけ）は「ホームに戻る」と「まぜる」だけ（例：`fjf` `dkd` `fgf` `jhj`）
- 段階が上がってから最初の2行は、5個のかたまりのうち**4個以上を新しいキーを含む同じ指のかたまり**にする
- 残りの2行は、新しいキーを含むかたまり2個以上＋それまでの指のかたまり・まぜるかたまり
- 同じキーが3回続くかたまりは作り直す。かたまりの間にはスペースが入るので、かたまりの中だけ見ればよい

**段階11（英単語）**：`a`〜`z` と `; , . /` だけで書ける小文字の英単語を40語ほど用意し、5語を選んで1行にする
（例：`hello water black`）。単語リストはファイル内の定数。3回続く文字を含む語は入れない。

**名前**：`label` を「ホームポジション練習（時間制）」に変える。`id` は `home-position-basic` のまま。

### 5. 練習画面（`features/practice/`）

`PracticeScreenBody` の中で、`task.endless` があれば新しい `EndlessPractice` を、なければ今の中身を表示する。
今の中身は変えない（`touch-type-fj` の動きを守るため）。

**`EndlessPractice.tsx`（新規）の状態の流れ**

```
待機（時間を選べる） ──最初のキー──▶ 練習中（残り時間を表示） ──0秒──▶ 結果
   ▲                                                                    │
   └──────────────────── リトライ ／ 時間を選び直す ──────────────────────┘
```

- 時間の選択：ピル型ボタンで 1分 / 3分 / 5分 / 10分（はじめは1分を選んだ状態）。練習中は押せない
- 残り時間：`mm:ss` で表示。1秒ごとに更新（`setInterval`）。0秒になったら入力を受け付けない
- 1行打ち終えたら（`challengeComplete`）、打ち終えた行数を1増やして `endless.next()` で次の行を出す
- 段階が上がったら、増えたキーを指ごとにまとめて知らせる
  （例：「R・V が増えたよ（左手・人さし指）／U・M が増えたよ（右手・人さし指）」）。次の段階が上がるまで出しておく
- 進捗リング：残り時間の割合を表示する（1行の進み具合ではなく）
- 結果：速度・正確さ・ミスしたキー（今の表示と同じ）＋打ち終えた行数＋たどり着いた段階（「段階 7 / 11」）

**結果表示の共通化**：今の結果カードを `ResultCard.tsx` に切り出し、両方から使う。
行数・段階は `EndlessPractice` 側から追加の行として渡す。

**スペース**

- 次の文字がスペースのときは `␣` を表示する（`current-text` 内の表示だけ。判定は `' '` のまま）
- 打ち終えた部分のスペースが詰まらないよう、`.typing-text` に `white-space: pre-wrap` を足す
- 練習エリアで `' '` を受けたら `event.preventDefault()` する（スクロール防止）。
  1問で終わる今の画面にも同じ1行を入れる（害がなく、今後スペースを含む課題が来たときに困らない）

### 6. キー表示（`shared/ui/KeyHintRow.tsx`）

- 表示を下3段＋スペースに広げる。行は少しずつ右にずらして実物のキーボードに近づける
- 指ごとに色を分ける（左右で同じ指は同じ色。CSS 変数で8色＋親指）
- 次に打つキーを強調し、下に「左手・中指」のように表示する
- 省略可能な `availableKeys` を受け取り、含まれないキーを薄くする。渡さなければ全部ふつうに表示
- `char` が下3段・スペースのどれでもないときは、今までどおり何も出さない

`touch-type-fj` でも3段のキー表示が出るようになる（今は中段8キーのみ）。見た目が変わるだけで動きは変わらない。

## 変更するファイル

| ファイル | 変更内容 |
|----------|----------|
| `src/core/types/task.ts` | `Stage` `EndlessPlan` を追加。`TypingTask` に省略可能な `endless` を追加 |
| `src/core/keyboard/layout.ts` | 新規。キーの並びと手・指の対応 |
| `src/core/keyboard/layout.test.ts` | 新規。全キーに指が割り当たっていること、ラベルの表記 |
| `src/core/engine/judge.ts` | `mergeJudgeStates` を追加（既存関数は変えない） |
| `src/core/engine/judge.test.ts` | `mergeJudgeStates` のテストを**追加のみ**（既存のテストは書き換えない） |
| `src/core/registry/registry.test.ts` | `endless` なしの課題が登録・取得できるテストを**追加のみ** |
| `src/tasks/home-position-basic/index.ts` | 作り直し。段階表・かたまりの生成・英単語リスト・`endless.next` |
| `src/tasks/home-position-basic/index.test.ts` | 新規。受け入れ条件のうち「テストで確認」の項目 |
| `src/features/practice/PracticeScreen.tsx` | `endless` の有無で出し分け。結果カードを切り出し。スペースの `preventDefault` と `␣` 表示 |
| `src/features/practice/EndlessPractice.tsx` | 新規。時間制の練習 |
| `src/features/practice/ResultCard.tsx` | 新規。結果カード（今の表示を切り出したもの＋追加の行） |
| `src/features/practice/PracticeScreen.test.tsx` | 課題名が変わるテストの修正。時間制のテストを追加（fake timers を使う） |
| `src/shared/ui/KeyHintRow.tsx` | 3段＋スペース・指の色・指ラベル・`availableKeys` |
| `src/index.css` | キー表示の3段・指の色・時間選択・段階のお知らせ・`white-space: pre-wrap` |
| `src/tasks/index.test.ts` | 変更なし（id が変わらないため） |

`src/tasks/README.md` は変えない（テンプレの書き方は変わらないため）。

## 影響範囲

| 壊れるかもしれないもの | 対策 |
|------------------------|------|
| 既存の課題（`touch-type-fj`、今後生徒が作る課題） | `endless` は省略可能。省略時は今の画面の中身をそのまま使う。既存テストで確認 |
| 1問で終わる画面の見た目 | キー表示が3段になる・結果カードの切り出し。既存の画面テストがすべて通ることで確認 |
| 課題切り替えボタンのテスト | 課題名が変わるため、テスト中の名前を新しい名前に直す（`core/` のテストではない） |
| `core/` を使う他の生徒の作業 | 追加のみで既存の型・関数は変えない。wrapup 時に `docs/architecture.md`「拡張の仕組み」への追記を提案し、全員に共有する |

## 確認方法

- **自動テスト**
  - 出題：段階ごとの使用キー、数字の段が出ないこと、同じキーの3連続がないこと、
    同じ指のかたまりが含まれること、4行ごとに段階が上がること、段階11で止まること
    （乱数を含むため、各段階で数百行作って確かめる）
  - 下位互換：`endless` なしの課題の登録、既存の `core/` テストが書き換えなしで通ること
  - 画面：時間を選べる／最初のキーでカウントが始まる／0秒で結果が出て入力が止まる／
    1行打ち終えると次の行が出る（fake timers で時間を進める）
- **品質チェック**：`npm run test` / `npm run typecheck` / `npm run lint`
- **手での確認**：`npm run dev` でユーザーに操作してもらう
  - 1分で最後まで打ち、結果の数字がおかしくないか
  - スペースが見えるか、押してもスクロールしないか
  - 段階の上がり方の速さが体感で合っているか（合わなければ `LINES_PER_STAGE` を調整）
