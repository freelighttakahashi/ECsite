# FREELIGHT ECサイト移行プロジェクト

作業フォルダ: `~/Desktop/ECsite`（macOS。旧環境は Windows の `C:\Users\britz\Desktop\ECsite`）

## 公開前 Blocker（2026-11-23 レビュー）

公開前に、以下の6項目を必ず解消してください。詳細な根拠・該当ファイルは `進捗.md` の「8. 公開前 Blocker」を参照してください。

1. **注文の信頼性**: FormSubmit の通知メール1通に依存している。顧客への自動確認メール・注文データの保存・バックアップ手段を決める。
2. **スパム対策**: `_captcha: "false"` と空の `_honey` では実質無防備。実際の hidden honeypot、reCAPTCHA、Turnstile などを導入する。
3. **画像配信**: `r2.dev` は本番非対応（レート制限あり）。R2 のカスタムドメインまたは Worker プロキシに変更する。
4. **法務ページ**: 特商法の住所・電話・責任者・メール、送料表示、プライバシーの委託先・越境移転、お問い合わせを整備する。
5. **商品コンテンツ**: YouTube iframe 4件の破損、`W01.jpg` の404、画像なし2件、旧ショップリンク34商品を修正する。
6. **カート・注文フォーム**: 空カート注文、商品データ取得失敗時のフリーズ、二重送信、ラベル不足を修正する。

## 参考: ColorMe から商品データをエクスポート（実施済み）

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
│   ├── raw/          # エクスポートデータ (CSV/JSON) / R2移行マッピング
│   └── images/       # 現在は未使用（画像はCloudflare R2で配信）
├── docs/             # 特商法・プライバシー等の文面（supabase-schema.sql は参考・不採用）
├── scripts/          # 収集・変換スクリプト
└── web/              # Next.js プロジェクト（Cloudflare Pages デプロイ対象）
```

## 次のアクション（現行）

公開前は、上記「公開前 Blocker」の6項目を最優先で解消してください。

- 注文フローの信頼性確保（FormSubmit の通知1通依存を解消）
- スパム対策（hidden honeypot / reCAPTCHA / Turnstile）
- R2 の本番配信への切り替え（カスタムドメインまたは Worker）
- 法務ページの実文・送料表示・お問い合わせの整備
- 商品コンテンツの修復（iframe・W01.jpg・画像なし商品・旧ショップリンク）
- カート・注文フォームのバグ修正
- FormSubmit の最終テスト注文（受信・返信・完了画面・エラー表示）
- Cloudflare Pages へのデプロイ（`NODE_VERSION`・カスタムドメイン）
- スマホ実機での表示・操作確認
- ColorMe データの退避と並行運用、閉店処理

> 詳細は `進捗.md` を参照。アーキテクチャは DB レス・静的構成（Supabase 不採用、メール送信は FormSubmit）。