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
