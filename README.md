# ISDL Hackathon 2026 Team B

研究室に来たくなることを目指した、ログイン機能付きのWebアプリです。
フロントエンドは React + Vite、バックエンドは Python + FastAPI、データベースは SQLite を使っています。

## ディレクトリ構成

```text
2026-teamB/
├─ backend/
│  ├─ main.py        # FastAPI のエンドポイント
│  ├─ schemas.py     # API リクエストの型定義
│  ├─ messages.py    # API のメッセージ定義
│  └─ database.py    # SQLite 操作
├─ frontend/
│  ├─ package.json
│  ├─ index.html
│  └─ src/
└─ README.md
```

## ローカル起動

### 1. リポジトリを取得

```bash
git clone https://github.com/ISDL-hackathon/2026-teamB.git
cd 2026-teamB
```

### 2. バックエンドを起動

```bash
cd backend
pip install fastapi uvicorn passlib bcrypt
uvicorn main:app --reload
```

バックエンドは以下のURLで起動します。

```text
http://127.0.0.1:8000
```

### 3. フロントエンドを起動

別のターミナルで実行します。

```bash
cd frontend
npm install
npm run dev
```

フロントエンドは以下のURLで起動します。

```text
http://localhost:5173
```

## Cloudflare Tunnel で動かす

Cloudflare Tunnel で公開するときは、フロントエンド用とバックエンド用の2つの tunnel を用意します。

### 1. バックエンド用 tunnel

ターミナル1でバックエンドを起動します。

```bash
cd backend
uvicorn main:app --reload
```

ターミナル2でバックエンドを tunnel に公開します。

```bash
cloudflared tunnel --url http://127.0.0.1:8000
```

表示された `https://xxxxx.trycloudflare.com` を、フロントエンドの API URL として使います。

### 2. フロントエンドの API URL を設定

`frontend/.env.tunnel` を作成して、バックエンド用 tunnel のURLを書きます。

```env
VITE_API_BASE_URL=https://xxxxx.trycloudflare.com
```

### 3. フロントエンド用 tunnel

ターミナル3でフロントエンドを起動します。

```bash
cd frontend
npm install
npm run dev:tunnel
```

ターミナル4でフロントエンドを tunnel に公開します。

```bash
cloudflared tunnel --url http://127.0.0.1:5173
```

フロントエンド用 tunnel のURLからアプリにアクセスできます。

## GitHub への反映

```bash
git status
git add .
git commit -m "変更内容"
git push
```

## GitHub に上げないもの

以下のファイルやフォルダは GitHub に上げません。

```text
node_modules/
__pycache__/
*.db
.env
.env.local
.env.tunnel
```
