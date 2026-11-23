# 作業履歴（アーカイブ）

このファイルは過去の作業と決定の記録です。**追記のみ**行い、現在の状況・次のアクション・Blocker は [`README.md`](../README.md) に書きます。

---

## 2026-11-22

### プロジェクト開始・移行元データの収集

- ColorMe Shop（`freelight.shop-pro.jp`）から商品データを収集
- `scripts/scrape-freelight.ps1` を作成・実行
- 89 商品（タイトル・価格・説明HTML・画像URL）と 287 枚の商品画像を取得
- 出力: `data/raw/products.json` / `data/raw/products.csv` / `data/raw/categories.json` / `data/images/products/<商品ID>/`

### Supabase 設計（後に不採用）

- `docs/supabase-schema.sql` と `scripts/import-to-supabase.ps1` を作成
- **決定: Supabase は使用しない（DB レス・静的構成を採用）**
- 上記2ファイルは参考用として残置

### Next.js プロジェクト初期化

- `web/` に Next.js 15 + TypeScript + Tailwind をスキャフォールド
- `npm install` 完了、`npm run dev` で `http://localhost:3000` の表示を確認

### メール送信方式の決定（FormSubmit）

- Web3Forms から **FormSubmit（案B）** に変更
- Resend 不使用・`/api/order` 不要・アカウント作成不要
- `web/app/checkout/page.tsx` を FormSubmit POST（`https://formsubmit.co/ajax/<email>`）に変更
- `web/app/order/complete/page.tsx` は「注文受付・担当者より連絡」を表示し、振込先・送料・期限は手動返信で案内する運用に統一
- 送信先は `britzjp@gmail.com`（ユーザー確認済み）
- FormSubmit の初回確認メールのリンククリック・テスト送信を実施した記録があるが、**完了/未完了の記載が文書内で矛盾**していた（後日「要確認」として引き継ぎ）

### 商品データの静的化

- `data/raw/products.json` を `web/data/products.json`（サーバー import 用）と `web/public/data/products.json`（クライアント fetch 用）にコピー
- `web/lib/products.ts` を作成し、トップ・商品詳細・カテゴリ一覧を静的データ参照に変更
- `web/lib/supabase.ts` を削除
- `@supabase/supabase-js` / `resend` を `web/package.json` から削除

### カート・カテゴリの改善（Phase 0）

- `cart/page.tsx` で URL パラメータ（`add`, `qty`）を読み取り localStorage に追加
- 商品名・単価・小計・合計（税抜/税込）の表示、数量変更・削除を実装
- カテゴリ名を日本語化
- `.env.local.example` を FormSubmit 用（環境変数不要）に更新
- コミット: `a5ce03f`

### 静的エクスポート対応

- `web/next.config.ts` に `output: 'export'` / `images.unoptimized: true` を追加
- `app/products/[id]` / `app/categories/[slug]` に `generateStaticParams` を追加
- Next.js 15 の `params` Promise 対応（async/await）
- `npm run build` で 89 商品 + 8 カテゴリのプリレンダリングに成功

### 法務ページの作成

- `web/app/legal/page.tsx`（特定商取引法に基づく表記）
- `web/app/privacy/page.tsx`（プライバシーポリシー）
- `web/app/terms/page.tsx`（利用規約）
- `layout.tsx` のフッターにリンクを追加
- 各ページは ColorMe 転記前のプレースホルダー状態（黄色い注意書き付き）

### Git セットアップ

- `git init` と `.gitignore`（`node_modules/`, `.next/`, `.env.local`, `data/images/` 等を除外）
- 初回コミット: `07c800a`
- `core.quotepath false` を設定し、日本語ファイル名を正しく表示

### 並行運用方針

- 新サイト完成後も数か月 ColorMe と並行運用し、問題がないことを確認してから閉店処理を行う
- `description_html` 内の ColorMe CDN 画像は並行運用中に R2 へ移行（閉店前に完了必須）

### Phase 1: 画像の Cloudflare R2 移行

- R2 バケット `essiteimages` を作成・公開アクセスを有効化
- R2 API トークンを発行
- `scripts/migrate-images-to-r2.py` を実行し 289/290 枚を移行（1 枚は 403 でスキップ）
- 3つの `products.json` の画像 URL を R2 URL に更新
- `web/next.config.ts` の `remotePatterns` に R2 ドメインを追加
- ビルド成功を確認
- コミット: `3ef3dae`

---

## 2026-11-23

### 公開前レビューと Blocker の整理

- プロジェクト全体をレビューし、公開前に解消すべき **6 件の Blocker** を特定
- Blocker 1〜6 を `README.md`（当時は `進捗.md`）に記載
- 主な指摘:
  - 注文通知が FormSubmit のメール1通のみに依存（顧客への自動確認・データ保存なし）
  - スパム対策が実質ゼロ（`_captcha: "false"`、`_honey` が機能していない）
  - 画像が `r2.dev` のままで本番非推奨
  - 法務ページがプレースホルダーのまま
  - YouTube iframe の R2 置換、`W01.jpg` の 404、旧ショップリンクなど商品ページの破損
  - 空カートでの注文送信、`fetch` の `try` 外配置などカート・注文フォームのバグ
- コミット: `54eec2c`

### ドキュメント構成の変更（B案）

- `README.md` を「現在の唯一の情報源」に再構成（現状・公開前 Blocker・次のアクション・構成・セットアップ・デプロイ・運用）
- 詳細な履歴はこの `docs/history.md` に移行
- `進捗.md` は互換性のための案内ファイル（ポインタ）に変更
- 方針: 現在のタスクは README、履歴はこのファイルへ追記のみ
