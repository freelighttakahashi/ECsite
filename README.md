# FREELIGHT ECサイト移行プロジェクト

作業フォルダ: `C:\Users\britz\Desktop\ECsite`

## 次のアクション1: ColorMe から商品データをエクスポート

### A. ColorMe 管理画面からの正規エクスポート（推奨）
1. ColorMe 管理画面にログイン
2. **商品管理 → 商品一覧 → CSVエクスポート** を実行
3. エクスポートした CSV を `data/raw/colorme_products.csv` に保存
4. **画像** は商品画像を一括ダウンロードし `data/images/products/` に配置
5. NEWS・特商法・プライバシー文面は `docs/` にコピー

### B. 公開ページからの自動収集（補助）
ColorMe 管理画面にアクセスできない場合、公開ページから商品データを収集できます。

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\scrape-freelight.ps1
```

実行結果:
- `data/raw/products.json` … 商品詳細（説明HTML含む）
- `data/raw/products.csv` … 商品一覧（Excelで開けます）
- `data/raw/categories.json` … カテゴリ一覧
- `data/images/products/<商品ID>/` … 商品画像

> 注意: 公開ページには在庫数・会員情報・注文履歴は含まれません。これらは ColorMe 管理画面からのエクスポートが必須です。

## フォルダ構成
```
ECsite/
├── README.md
├── 進捗.md
├── data/
│   ├── raw/          # エクスポートデータ (CSV/JSON)
│   └── images/
│       └── products/ # 商品画像
├── docs/             # 特商法・プライバシー等の文面（supabase-schema.sql は参考・不採用）
├── scripts/          # 収集・変換スクリプト
└── web/              # Next.js プロジェクト（Cloudflare Pages デプロイ対象）
```

## 次のアクション（現行）
- Web3Forms アクセスキーの取得・設定・動作確認
- 画像（287 枚）の Cloudflare R2 移行と `products.json` の画像 URL 更新
- 法務ページの作成（`/legal`, `/privacy`, 利用規約）
- Cloudflare Pages へのデプロイ（静的エクスポート設定・環境変数・カスタムドメイン）
- ColorMe データの退避と閉店処理

> 詳細は `進捗.md` を参照。アーキテクチャは DB レス・静的構成（Supabase 不採用）。