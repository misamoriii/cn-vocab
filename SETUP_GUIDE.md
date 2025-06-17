# Googleスプレッドシート連携セットアップガイド

## 1. Googleスプレッドシートの作成

### 手順1: 新しいスプレッドシートを作成
1. [Google Sheets](https://sheets.google.com/)にアクセス
2. 「空白のスプレッドシート」をクリック
3. ファイル名を「CN-Vocab-HSK」に変更

### 手順2: データを入力

#### オプション1: 包括的単語データ（推奨）
```bash
# 223個の単語（HSK1-6全レベル）を作成
npm run create-vocab
```
`comprehensive-vocabulary.csv`ファイルをGoogleスプレッドシートにインポート

#### オプション2: 基本テンプレート
```bash
# 50個のサンプル単語を作成
npm run create-template
```
`vocabulary-template.csv`ファイルをGoogleスプレッドシートにインポート

#### オプション3: カスタムデータ
```bash
# 対話式で独自の単語データを作成
npm run vocab-manager
```

#### データ形式
```
A1: 日本語
B1: 中国語  
C1: 拼音
D1: 例文
E1: 例文拼音
F1: HSKレベル
```

### 手順3: スプレッドシートを共有設定
1. 右上の「共有」ボタンをクリック
2. 「リンクを知っている全員が閲覧できる」に設定
3. 「完了」をクリック

### 手順4: スプレッドシートIDを取得
スプレッドシートのURLから、以下の部分がスプレッドシートIDです：
```
https://docs.google.com/spreadsheets/d/[ここがスプレッドシートID]/edit
```
例：`1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## 2. Google Cloud Console設定

### 手順1: プロジェクト作成
1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. プロジェクト名: 「CN-Vocab-App」

### 手順2: Google Sheets API有効化
1. 左メニューから「APIとサービス」→「ライブラリ」
2. 「Google Sheets API」を検索
3. 「有効にする」をクリック

### 手順3: 認証情報（APIキー）作成
1. 左メニューから「APIとサービス」→「認証情報」
2. 「認証情報を作成」→「APIキー」
3. 作成されたAPIキーをコピー
4. （任意）「キーを制限」でHTTPリファラーやAPIを制限

## 3. 環境変数設定

プロジェクトルートに `.env.local` ファイルを作成：

```env
# Google Sheets API Key（手順2-3で取得）
GOOGLE_SHEETS_API_KEY=your_api_key_here

# Spreadsheet ID（手順1-4で取得）
NEXT_PUBLIC_SPREADSHEET_ID=your_spreadsheet_id_here
```

## 4. テスト用コマンド

接続テストを実行：

```bash
# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:3000 にアクセス
# 単語データが読み込まれることを確認
```

## 5. トラブルシューティング

### エラー: "単語データが見つかりません"
- `.env.local` ファイルが正しく設定されているか確認
- スプレッドシートの共有設定が「リンクを知っている全員が閲覧できる」になっているか確認

### エラー: "Google Sheets API error: 403"
- APIキーが正しく設定されているか確認
- Google Sheets APIが有効化されているか確認

### エラー: "Google Sheets API error: 400"
- スプレッドシートIDが正しいか確認
- スプレッドシートのURL形式を確認

## 6. データ追加方法

スプレッドシートに新しい単語を追加するには：

1. 最下行に新しい行を追加
2. 各列に以下の形式でデータを入力：
   - A列: 日本語の意味
   - B列: 中国語（簡体字）
   - C列: 拼音（声調記号付き）
   - D列: 例文（中国語）
   - E列: 例文の拼音
   - F列: HSKレベル（1-6の数字）

3. アプリを再読み込みすると新しいデータが反映されます

## 7. セキュリティ注意事項

- APIキーは公開リポジトリにコミットしないでください
- `.env.local` は `.gitignore` に含まれています
- 本番環境では適切なAPIキー制限を設定してください