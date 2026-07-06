# ISDL Hackathon 2026 Team B

研究室に来たくなることを目的とした，ポイント機能付きWebアプリです．
フロントエンドは React + Vite，バックエンドは Python + FastAPI，データベースは SQLite を使用しています．

## ディレクトリ構成

```text
isdl_hackathon/
├── backend/
│   ├── main.py
│   └── database.py
├── frontend/
│   ├── package.json
│   ├── index.html
│   └── src/
└── README.md
```

## 実行方法

### 1. リポジトリを取得

```bash
git clone https://github.com/ISDL-hackathon/2026-teamB.git
cd 2026-teamB
```

### 2. バックエンドの起動

```bash
cd backend
pip install fastapi uvicorn passlib bcrypt
uvicorn main:app --reload
```

バックエンドは以下のURLで起動します．

```text
http://127.0.0.1:8000
```

### 3. フロントエンドの起動

別のターミナルを開き，プロジェクト直下から以下を実行します．

```bash
cd frontend
npm install
npm run dev
```

フロントエンドは以下のURLで起動します．

```text
http://localhost:5173
```

## GitHubへの反映方法

変更したファイルを確認します．

```bash
git status
```

変更を追加します．

```bash
git add .
```

コミットします．

```bash
git commit -m "変更内容"
```

GitHubへpushします．

```bash
git push
```

## 注意事項

以下のファイルやフォルダはGitHubに上げません．

```text
node_modules/
__pycache__/
*.db
.env
```

これらは `.gitignore` に追加しています．
