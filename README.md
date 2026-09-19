# <プロジェクト名>

> このファイルはひな型です。プロジェクト開始時に `/kickoff` を実行し、
> 内容を実際のものに置き換えてください。
> **ひな型としての説明（下部「ひな型の使い方」）も、置き換え時に削除します。**

## これは何か

（`/kickoff` 完了後に記入。`docs/concept.md` の要約を1〜2段落で）

## 動かし方

（`docs/architecture.md` 確定後に記入）

```bash
# セットアップ

# 起動

# テスト
```

## ドキュメント

| 知りたいこと | 読むファイル |
|--------------|--------------|
| 開発ルール | [CLAUDE.md](CLAUDE.md) |
| 何を作っているか | [docs/concept.md](docs/concept.md) |
| 技術スタック・構造 | [docs/architecture.md](docs/architecture.md) |
| コード規約 | [docs/conventions.md](docs/conventions.md) |
| 技術決定の履歴 | [docs/decisions/](docs/decisions/) |
| 未対応の課題 | [docs/known-issues.md](docs/known-issues.md) |
| やりたいことリスト | [docs/backlog.md](docs/backlog.md) |

---

# ひな型の使い方

> **このセクションは、実プロジェクトになったら削除してください。**

Claude Code での開発を前提にしたリポジトリのひな型です。

## 1. コピーする

このリポジトリをコピーして新しいプロジェクトを作ります。
git 履歴を引き継ぎたくない場合は `.git/` を削除して `git init` し直してください。

## 2. 名前を置き換える

- このファイルの見出し `# <プロジェクト名>` を実際の名前に変更
- このセクション（「ひな型の使い方」以下）を削除

## 3. `/kickoff` を実行する

Claude Code で `/kickoff` と入力すると、ヒアリングが始まります。

- **フェーズ1** — 誰の何を解決するか → `docs/concept.md` を作成
- **フェーズ2** — どう作るか → `docs/architecture.md` を作成

`docs/concept.md` が存在しない状態が「まだ方向性が決まっていない」の目印なので、
先回りして手動で作らないでください。

## 4. 掃除する

技術スタックが決まって実装が始まったら、不要なものを削除します。

| 対象 | いつ削除するか |
|------|----------------|
| `src/.gitkeep` `tests/.gitkeep` など | 各ディレクトリに実ファイルが入ったら |
| `import/` | 外部資料を使わないと決まったら |
| `scripts/` | 補助スクリプトが不要と決まったら |
| このセクション | プロジェクト開始時 |

`work/_template/` は毎回の作業でコピー元として使うので**残します**。

## 5. 日々の開発

| 場面 | すること |
|------|----------|
| 作業を始める | `work/YYYYMMDD-HHMM-タイトル/` を作り、`work/_template/` をコピー |
| 実装する | `3_tasks.md` を消し込みながら進める |
| 作業を終える | `/wrapup` を実行して締め処理 |

課題は寿命によって書く場所が変わります（詳細は [CLAUDE.md](CLAUDE.md)）。

| 見つけたもの | 書く場所 |
|--------------|----------|
| 今回やる作業 | `work/.../3_tasks.md` |
| あとでやりたいこと | `docs/backlog.md` |
| 不具合・技術的負債 | `docs/known-issues.md` |

## 含まれるもの

```
├── CLAUDE.md              # Claude への最上位ルール
├── .claude/
│   ├── settings.json      # 権限設定（読み取り系を許可・破壊的操作を拒否）
│   └── commands/          # /kickoff, /wrapup
├── docs/                  # 永続ドキュメント（承認が必要）
├── work/                  # 作業メモ（作業単位）
├── .editorconfig          # インデント・改行コードの統一
├── .gitattributes         # 改行コードを LF に統一
├── .gitignore             # .env・node_modules などを除外
└── .env.example           # 環境変数のテンプレート
```
