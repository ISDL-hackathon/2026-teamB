# isdl-bulletin-api

Cloudflare Dashboardで新しいWorker `isdl-bulletin-api` を作り、`src/index.js` を貼り付ける。

Bindingsから既存D1を次の名前で接続する。

```text
Variable name: DB
Database: 既存のisdl-apiと同じD1
```

デプロイ後、フロントのProduction環境変数へ追加する。

```text
VITE_BULLETIN_API_BASE_URL=https://isdl-bulletin-api.<subdomain>.workers.dev
```

その後フロントを再ビルド・再デプロイする。
