# Conventions

コードの書き方の約束。プロジェクト開始後、実態に合わせて記入する。
**変更には承認が必要。**

## 命名

| 対象 | 規則 | 例 |
|------|------|-----|
| ファイル | 相対importは拡張子（`.ts` / `.tsx`）を明示する | `import { supabase } from './lib/supabase.ts'` |
| 変数・関数 |  |  |
| 型・クラス | `interface` でなく `type` を使う | `export type TypingTask = { ... }` |
| 定数 |  |  |

## ディレクトリの分け方

`docs/architecture.md` の「ディレクトリ構成」に従う。`src/core/` は土台、`tasks/` `games/` は担当者ごとに分ける。

## コメント

書く基準。原則として「何をしているか」ではなく「なぜそうしたか」を書く。

## エラーハンドリング

方針。握りつぶさない、ログの出し方など。

## テスト

- 対象ファイルと同じディレクトリに `対象ファイル名.test.ts` として置く（例: `judge.ts` → `judge.test.ts`）
- Vitest を使用。`describe` / `it` で記述する

## 状態を持つロジックの書き方

打鍵判定など状態遷移を伴うロジックは、クラスでなく**純粋関数＋不変な state オブジェクト**で表現する
（`src/core/engine/judge.ts` を参照）。理由：入力と出力だけでテストでき、Reactの `useReducer` などと相性がよいため。
