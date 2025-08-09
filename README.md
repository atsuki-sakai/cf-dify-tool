# Dify Tool Cloudflare Worker API

このプロジェクトは、[Dify](https://dify.ai/) と連携するためのツールAPIを Cloudflare Workers 上に構築するものです。
[Hono](https://hono.dev/) フレームワークを使用し、データベースには Cloudflare D1 を利用しています。

顧客管理、予約管理、チャット履歴の保存など、DifyのAgentやWorkflowから利用されることを想定した基本的なCRUD機能を提供します。

## 主な機能

*   **顧客管理:** 顧客情報の登録、取得、更新、削除
*   **予約管理:** 予約情報の登録、取得、更新
*   **チャット履歴:** Dify上での会話履歴の保存、顧客ごとの履歴取得
*   **APIドキュメント:** [Chanfana](https://github.com/drizzle-team/chanfana) を利用したOpenAPI仕様の自動生成とSwagger UIの提供 
*** scriptsでDifyの許容するスキーマに書き換えている。登録時はschema.jsonを貼り付ければ登録できます。 ***

## 使用技術

*   **フレームワーク:** [Hono](https://hono.dev/)
*   **データベース:** [Cloudflare D1](https://developers.cloudflare.com/d1/)
*   **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
*   **デプロイ環境:** [Cloudflare Workers](https://workers.cloudflare.com/)
*   **パッケージ管理:** [pnpm](https://pnpm.io/)
*   **テスト:** [Vitest](https://vitest.dev/)

## APIエンドポイント

このアプリケーションをデプロイすると、ルート (`/`) にてSwagger UIがホストされ、利用可能なすべてのAPIエンドポイントの仕様を確認し、直接試すことができます。

主なエンドポイントは以下の通りです。

*   `/customers`: 顧客情報の操作
*   `/reservations`: 予約情報の操作
*   `/chat`: チャット履歴の操作

各エンドポイントはBearerトークンによる認証で保護されています。

## セットアップと開発

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. データベースのマイグレーション

ローカルのD1データベースにテーブルを作成します。

```bash
pnpm run seedLocalDb
```

### 3. 開発サーバーの起動

```bash
pnpm run dev
```

開発サーバーが起動し、ローカルでAPIの動作確認ができます。

## デプロイ

Cloudflareにデプロイするには、以下のコマンドを実行します。
このコマンドは、デプロイの前に本番のD1データベースへマイグレーションを自動的に適用します。

```bash
pnpm run deploy
```

## テスト

以下のコマンドでインテグレーションテストを実行します。

```bash
pnpm run test
```