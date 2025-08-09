## Dify Tool Cloudflare Worker API

Cloudflare Workers 上で提供する Dify 連携用ツールAPIです。[Hono](https://hono.dev/) + [Cloudflare D1](https://developers.cloudflare.com/d1/) + [Drizzle ORM](https://orm.drizzle.team/) 構成で、顧客・予約・チャット履歴のCRUDを提供し、[Chanfana](https://github.com/drizzle-team/chanfana) によって OpenAPI を自動生成します。

### 主な機能
- **顧客管理**: 登録/取得/更新/削除
- **予約管理**: 登録/取得/更新/顧客別取得
- **チャット履歴**: 保存/一覧/顧客別取得
- **APIドキュメント**: ルート(`/`)にSwagger UI、`pnpm schema`で `schema.json` を生成（OpenAPI 3.0.3互換に変換*Difyに登録じに発生するエラーを回避）

### 使用技術
- **フレームワーク**: Hono
- **DB**: Cloudflare D1（SQLite）
- **ORM**: Drizzle ORM
- **実行環境**: Cloudflare Workers
- **パッケージ管理**: pnpm
- **テスト**: Vitest（Workers プール）

---

## セットアップ（ローカル）

前提:
- Node.js (LTS) / pnpm がインストール済み
- Cloudflare アカウント、`wrangler` CLI にログイン済み（`pnpm dlx wrangler login`）

1) 依存関係インストール
```bash
pnpm install
```

2) ローカル用APIキーの設定
- `/.dev.vars` に `APIKEY` を設定します（wrangler dev が自動読込）。
  - 例: `APIKEY="<開発用のランダム文字列>"`
  - 注意: 機密のため、実キーはGitにコミットしないでください。

3) D1 データベースの準備（必要に応じて）
- 既存のDBを使わない場合は新規作成し、`wrangler.jsonc` の `d1_databases` に反映します。
```bash
pnpm dlx wrangler d1 create dify-tool
# 出力された database_id を wrangler.jsonc の d1_databases に設定
```

4) マイグレーション適用（ローカル）
```bash
pnpm run seedLocalDb
```

5) 開発サーバ起動
```bash
pnpm run dev
```
- `http://127.0.0.1:8787/` でSwagger UIが表示されます。

---

## デプロイ（本番）

1) 本番用APIキーをWorkersシークレットに登録
```bash
pnpm dlx wrangler secret put APIKEY
```

2) 本番D1へマイグレーション適用 + デプロイ
```bash
# predeploy が自動で --remote マイグレーションを実行
pnpm run deploy
```

3) 稼働確認
- デプロイ先URL（例: `https://<your-worker>.<account>.workers.dev/`）へアクセスし、Swagger UIの表示/エンドポイントの疎通を確認します。

---

## 環境変数 / 認証

- 認証方式: Bearer トークン
  - すべてのAPI（`/customers/*`, `/chat/*`, `/reservations/*`）は `Authorization: Bearer <APIKEY>` が必要
  - 実装: `src/middleware/auth.ts`
- ローカル: `/.dev.vars` に `APIKEY` を設定
- 本番: `wrangler secret put APIKEY` で登録

---

## APIエンドポイント概要

- `GET /customers`（ページング: `page`, `per_page`）/ `POST /customers`
- `GET /customers/{id}` / `PUT /customers/{id}` / `DELETE /customers/{id}`
- `GET /reservations` / `POST /reservations`
- `GET /reservations/customer/{customerId}` / `PUT /reservations/{id}`
- `GET /chat` / `POST /chat`
- `GET /chat/customer/{customerId}`

共通仕様:
- **ページング**: `page`>=1、`per_page`<=100、デフォルト `per_page=20`
- **エラー形式**: `{ success: false, errors: [{ code, message, path? }] }`
  - 例: 入力検証エラー(7001), Not Found(7002), Unauthorized(4010)

Swagger UI（`/`）で全仕様を参照できます。

---

## OpenAPI スキーマ生成と Dify 登録手順

1) スキーマ生成（OpenAPI 3.1 → 3.0.3 に変換）
```bash
pnpm run schema
# 出力: ./schema.json
```
  - 生成ロジック: `chanfana` で出力 → `scripts/convert-openapi-31-to-30.mjs` で Dify 互換に調整（nullable など）

2) Dify にツールとして登録
- Dify Studio → ツール → 新規追加 → OpenAPI で登録
- 入力方式: 「スキーマ貼り付け」を選び、`schema.json` の中身を貼り付け
- Base URL: スキーマ内 `servers[0].url` は `src/index.ts` の設定値です。自身のデプロイURLに合わせて必要に応じて修正・再生成してください。
- 認証: 「API Key 認証（ヘッダー）」を選択
  - Header 名: `Authorization`
  - 値: `Bearer {{APIKEY}}`（Dify側のシークレット/変数に保存したキーを参照）
- 登録後、Dify のツールテスターから疎通確認

Tips:
- スキーマに 3.1 要素が残って弾かれる場合は、必ず `pnpm run schema` を実行し直してください。

---

## データモデル（D1 / Drizzle）

- `customers`:
  - `id`, `name`, `email(Unique)`, `phone?`, `created_at`, `updated_at`
- `chat_history`:
  - `id`, `customer_id(FK→customers, cascade)`, `user_name`, `message`, `response`, `created_at`
- `reservations`:
  - `id`, `customer_id(FK→customers, cascade)`, `customer_name`, `service_name`, `reservation_date`, `status=pending`, `notes?`, `created_at`, `updated_at`
- `tasks`（サンプル）

マイグレーション: `./migrations/*.sql`

---

## セキュリティ / 運用の注意

- 機密情報（APIKEY 等）は必ず Workers Secrets や `.dev.vars` で管理し、Git にコミットしない
- Bearer トークンは完全一致検証のため、`Authorization` ヘッダーの前後空白や大文字小文字に注意
- Cloudflare 側の IP 制限や追加のレート制御を必要に応じて導入

---

## 制限・上限（参考）

本プロジェクト自体のアプリ制約に加え、Cloudflare のプラットフォーム制限の影響を受けます。

- **Cloudflare Workers のリソース上限**: 実行時間/メモリ/リクエストサイズ等はプランに依存します。
  - 公式: `https://developers.cloudflare.com/workers/platform/limits/`
- **Cloudflare D1 の上限/制約**: データベースサイズ/同時接続/SQL 機能制約など最新仕様を参照ください。
  - 公式: `https://developers.cloudflare.com/d1/`

上限値は随時更新されるため、README では数値を固定せず、常に公式ドキュメントを参照してください。

---

## テスト

```bash
pnpm run test
```
- デプロイのドライラン（`wrangler deploy --dry-run`）実行後、Vitest を実行
- `tests/apply-migrations.ts` がテスト用に D1 マイグレーションを適用

---

## よくあるトラブルと対処

- 401 Unauthorized になる
  - `Authorization: Bearer <APIKEY>` が正しいか（余分な空白/改行なし）
  - ローカル: `.dev.vars` が wrangler dev に読み込まれているか
  - 本番: `wrangler secret put APIKEY` で設定済みか

- Dify にスキーマが取り込めない
  - `pnpm run schema` を再実行して 3.0.3 に変換されているか
  - `servers.url` がデプロイURLと一致しているか

- 本番でテーブルがない/古い
  - `pnpm run deploy`（predeployで `--remote` マイグレーション）を通す
  - もしくは手動で `wrangler d1 migrations apply DB --remote`

---

## スクリプト一覧（主要）

- `pnpm dev`: ローカルDBにマイグレーション後、`wrangler dev`
- `pnpm deploy`: 本番DBへマイグレーション後、`wrangler deploy`
- `pnpm seedLocalDb`: ローカルDBにマイグレーション適用
- `pnpm schema`: OpenAPI 生成 → Dify 互換へ変換（`schema.json`）
- `pnpm test`: Workers ドライラン → Vitest 実行

---

## Dify での使い方（Agent/Workflow）

1) 「ツール」から本APIを追加（上記登録手順）
2) エージェント/ワークフローでツールを有効化
3) ツールの入力に応じて、顧客・予約・チャット履歴の操作を実行

補足:
- スキーマ上の `required` などに合わせて、Dify 側のパラメータ設定/バリデーションを行ってください。

---

## メンテナンス

- DB スキーマ変更時
  - `migrations/` にSQLを追加
  - `src/db/schema.ts` を更新
  - `pnpm seedLocalDb` / `pnpm deploy` を実行

- OpenAPI 説明やタイトル、`servers` の更新
  - `src/index.ts` の OpenAPI 設定を更新し、`pnpm schema` を再実行

---

## ライセンス

プロジェクト内の各依存ライブラリのライセンスを尊重してください。