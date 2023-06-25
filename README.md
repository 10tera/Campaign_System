# キャンペーンシステム
## フロントエンド
フロントエンド用コマンドは必ず
```
cd frontend
```
をしてfrontendディレクトリ以下に移動してから実行してください。
### 開発環境用
```
npm run build:dev
```
frontend/docs/index.htmlをchromeなどのブラウザで開いていただけるとwebページを開けます。
### 本番環境用
```
npm run build:prod
```
これは本番環境用です。

## バックエンド
バックエンド用コマンドは必ず
```
cd backend
```
をしてbackendディレクトリ以下に移動してから実行してください。
### 起動
```
npm run start
```

## MySql(DB)
### ログイン
```
mysql --user=USER_NAME --password
```
実行後パスワード入力をしてください。
### データベースの指定
```
use campaign_system;
```