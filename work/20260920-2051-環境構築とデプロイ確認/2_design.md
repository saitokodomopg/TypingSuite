# 2. Design — 環境構築とデプロイ確認

プロジェクト雛形・タイトル画面・Supabase クライアントの実装はコードで完結するため
設計判断は不要。一方、Supabase / Cloudflare Pages は手動でのブラウザ操作になり
設定ミスが起きやすいため、設定すべき項目をここに残す。

## Supabase の設定

| 項目 | 設定値 | 理由 |
|------|--------|------|
| Organization 名 | デフォルトの `saitokodomopg's Org` のままでよい | Organization 名はプロジェクト名と一致させる必要のない管理上のラベル。プロジェクト自体は `typing-suite` という名前で作るため区別は付く。今後 TypingSuite 以外のプロジェクトもこのアカウントで管理する可能性を考えると、個人・チームの包括的な名前のままにしておく方が自然 |
| Organization Type | `Educational` | プログラミング教室向けの教材アプリという実態に合っている。単なる分類ラベルで規約上の制約はなく、Organization Settings からいつでも変更できる（下記「将来の商用転用について」参照） |
| プロジェクト名 | `typing-suite` | リポジトリ名と揃え、後から見て分かるようにする |
| リージョン | Tokyo（ap-northeast-1） | 教室（国内）から使うため、最も近いリージョンでレイテンシを抑える |
| プラン | Free | architecture.md の判断通り、50名規模なら無料枠で足りる |
| DB パスワード | Supabase が自動生成するものでよい | アプリは Direct connection（Postgres への直接接続）を使わないため、通常は控えておく必要がない。忘れても Supabase 側でリセットできる。もし直接接続が必要になった場合も、`.env`・ドキュメント・チャットには書かず、パスワードマネージャーに保存する |

### 将来の商用転用について

現時点では商用化していないが、将来的な商用転用も想定している。
Organization Type（`Educational` など）は Supabase の利用規約や料金プランを縛るものではなく、
表示・分類用のラベルにすぎないため、商用化のタイミングで `Company` 等に変更すればよい。
Plan（Free/Pro など）も規模拡大に応じてそのタイミングで見直す。

### プロジェクトホーム「Connect」または Project Settings > API から取得する値

Supabase の API キー体系が新形式（`sb_publishable_...` / `sb_secret_...`）に更新されている。
旧来の「anon key」「service_role key」という呼び方に代わり、ダッシュボード上は
「Publishable key」「Secret key」と表示される。役割は同じ（Publishable = クライアントで
安全に使える公開鍵、Secret = サーバー専用の管理者権限キー）。

| 値 | 用途 |
|----|------|
| Project URL | `.env` の `VITE_SUPABASE_URL` |
| Publishable key（`sb_publishable_...`） | `.env` の `VITE_SUPABASE_PUBLISHABLE_KEY` |
| Secret key（`sb_secret_...`、旧 service_role） | **今回は使わない**。クライアントから直接使うと RLS を迂回できてしまうため、`VITE_` を付けてブラウザ側のコードに渡さない |
| Direct connection string（DB パスワードを含む） | 今回は使わない。アプリは Supabase JS SDK 経由で接続し、直接 Postgres には繋がない |

## Cloudflare Pages の設定

| 項目 | 設定値 | 理由 |
|------|--------|------|
| アカウント | 既存のものがあればそれを使う | 専用アカウントを分ける必要は今のところない |
| プロジェクト名 | `typing-suite` | リポジトリ名と揃える |
| 連携リポジトリ | `saitokodomopg/TypingSuite`（GitHub） | 既に origin として設定済み |
| Production branch | `main` | architecture.md：main への push で自動デプロイ |
| Framework preset | Vite | |
| Build command | `npm run build` | |
| Build output directory | `dist` | Vite のデフォルト出力先 |
| Root directory | `/`（リポジトリ直下） | モノレポではない |
| Node version | 20 以上を明示（環境変数 `NODE_VERSION=20` 等） | Cloudflare 側のデフォルトが architecture.md の要件より古い場合があるため、明示して事故を防ぐ |
| 環境変数（Production） | `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` | 本番用 Supabase プロジェクトの値 |
| 環境変数（Preview） | 同上（同じ Supabase プロジェクトを使う） | ステージング環境は今回作らない。ブランチプレビューは「担当者が自分の変更を見せる」用途（architecture.md）であり、本番データと混ざる心配は小さいため共用でよい |

## 変更するファイル

外部サービスの設定作業が中心のため、コード変更はなし。
`.env.example` へのキー名追記のみユーザー側の作業として発生する（Claude はこのファイルを
権限上編集できないため）。

## 影響範囲

新規構築のため、既存機能への影響はない。

## 確認方法

- `npm run check:supabase` で Supabase への疎通を確認する
- Cloudflare Pages の公開 URL でタイトル画面が表示されることを確認する
- 別ブランチへの push でプレビュー URL が発行されることを確認する（任意）
