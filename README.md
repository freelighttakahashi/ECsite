# FREELIGHT ECサイト移行プロジェクト

最終更新: 2026-11-23  
作業フォルダ: `~/Desktop/ECsite`（macOS。旧環境は Windows の `C:\Users\britz\Desktop\ECsite`）

## 概要

| 項目 | 内容 |
|---|---|
| 移行元 | ColorMe Shop（freelight.shop-pro.jp） |
| 移行先 | 自前ECサイト（Next.js 15 + Cloudflare Pages） |
| 優先目的 | コスト削減（なるべく無料） |
| 商品数 | 89 点 |
| カテゴリ数 | 8 |
| 月間注文数 | 50〜200 件 |
| 会員機能 | なし（ゲスト注文のみ） |
| 在庫管理 | なし |
| データベース | なし（静的構成） |
| メール送信 | FormSubmit（AJAX） |
| 公開状況 | 未デプロイ |

---

## 現在の状態

| 項目 | 状態 | 補足 |
|---|---|---|
| 商品データの静的化 | 完了 | `web/data/products.json` / `web/public/data/products.json` |
| 商品画像のR2移行 | ほぼ完了 | 289/290枚。`W01.jpg` は404、画像なし商品2件 |
| トップ / 商品詳細 / カテゴリ | 完了 | 89商品 + 8カテゴリを静的生成 |
| カート | 完了 | 追加・数量変更・削除・合計表示。空カートのガードなし |
| 注文フォーム | 実装済み | FormSubmit。Blocker 1 / 2 / 6 の対応が必要 |
| 注文完了ページ | 実装済み | 振込先・送料は手動メール案内 |
| 法務ページ | プレースホルダー | 特商法の住所・電話等が未記入。公開不可 |
| 静的ビルド | 成功 | `npm run build` で `web/out` を生成 |
| Cloudflare Pages | 未実施 | デプロイ・カスタムドメイン未設定 |
| FormSubmit 最終テスト | 要確認 | 文書内で完了/未完了の記載が矛盾していた |
| ColorMe との並行運用 | 未開始 | 公開後に数か月並行運用する予定 |

---

## 公開前 Blocker（必須）

公開前に、以下の6項目を必ず解消してください。

### Blocker 1: 注文データがメール1通に依存している

- [ ] 注文通知が FormSubmit のメール1通のみで、顧客への自動確認メール・注文データの保存がない
- [ ] `web/app/checkout/page.tsx` はショップ宛のみ送信。`email` フィールドが Reply-To になるため、手動返信は可能
- [ ] FormSubmit の `_autoresponse` は「AJAX送信 + reCAPTCHA無効」では使えない
- [ ] `_cc` で別アドレスにも送る、FormSubmit のアーカイブを定期退避する、または Cloudflare Worker + D1 で注文を保存・自動返信する
- [ ] 注文メールに商品ID・単価・数量・小計を含める
- [ ] 完了画面の「注文確認メール」文言を実態に合わせる
- [ ] FormSubmit の初回確認・テスト注文の状態を事実確認して統一する

### Blocker 2: スパム対策が実質ゼロ

- [ ] `_captcha: "false"` をやめる、または Cloudflare Turnstile 等を導入する
- [ ] `_honey` を実際の hidden 入力フィールドとして設置する（現在は空文字を送っているだけ）
- [ ] FormSubmit の Invisible emails（ランダム文字列エンドポイント）でメールアドレスを隠す
- [ ] 必要に応じて `_blacklist` を設定する
- [ ] メールアドレスがクライアントJS・公開GitHubリポジトリに出ていることを踏まえ、専用アドレス／エイリアスを検討する

### Blocker 3: 画像が `r2.dev` のまま

- [ ] Cloudflare 公式は `r2.dev` を「非本番・レート制限あり」と明記している
- [ ] R2 にカスタムドメインを接続する、または Worker でプロキシする
- [ ] 画像に `Cache-Control` を設定する
- [ ] URL変更後、`data/raw/products.json` / `web/data/products.json` / `web/public/data/products.json` / `next.config.ts` を更新する
- [ ] 変更後に全商品ページの画像表示を確認する

### Blocker 4: 法務ページが公開できる状態ではない

- [ ] 特商法の「運営統括責任者・所在地・電話番号・メールアドレス」を実文に置換する
- [ ] 送料を注文前に認識できる形で表示する（サイズ別表など）。「個別案内」だけにしない
- [ ] プライバシーポリシーに委託先（FormSubmit / Cloudflare / R2）、越境移転、保存期間、問い合わせ窓口を追記する
- [ ] `legal` / `privacy` / `terms` の黄色い注意書きを削除する
- [ ] お問い合わせページを追加し、フッター・注文完了画面・エラー表示からリンクする
- [ ] インボイス登録事業者なら登録番号を追記する
- [ ] 必要に応じて専門家に確認する

### Blocker 5: 商品ページのコンテンツが壊れている

- [ ] YouTube iframe が4商品（`111096933` / `106429984` / `108522310` / `104803216`）で R2 の `/embed/...` に置換され、動画が表示されない。`data/raw/r2-url-mapping.json` から元URLを復元する
- [ ] `W01.jpg`（商品 `102131754`）が 404。再アップロードまたは差し替える
- [ ] 画像なし商品 `161541779` / `183664654` の扱いを確認する（補完またはプレースホルダー）
- [ ] 旧 `freelight.shop-pro.jp` リンクが34商品・約62箇所。内部リンク化または削除する
- [ ] `111096933` の壊れた `<br </strong>` を修正する（React #418 の原因候補）
- [ ] 「年内の発送」など旧運用の文言を削除する
- [ ] サムネイルの縦横比・スマホでの iframe はみ出しを修正する（`object-contain` / `max-width:100%`）

### Blocker 6: カート・注文フォームのバグ

- [ ] 空カートでも「レジに進む」から0円注文を送信できる。空カート時はボタンを非表示/無効化し、checkout 側でもガードする
- [ ] `checkout/page.tsx` の `fetch("/data/products.json")` が `try` の外にある。失敗時に「送信中...」で固まるため、`try/finally` に移動する
- [ ] 二重送信ガードを追加する
- [ ] `email` を `type="email"`、`phone` を `type="tel"` にし、`autoComplete` を設定する
- [ ] ラベルと入力の関連付け（`htmlFor` / `id`）を追加する（Lighthouse Accessibility 93）
- [ ] `alert` だけでなく、画面内エラー表示と問い合わせ先を用意する

### 完了条件

- [ ] 上記6項目のチェックがすべて完了している
- [ ] `npm run build` が成功し、89商品 + 8カテゴリが生成される
- [ ] スマホ実機でホーム・商品詳細・カート・checkout・完了画面を確認する
- [ ] FormSubmit の最終テスト注文で、受信・返信・完了画面・エラー表示を確認する
- [ ] 法務ページにプレースホルダーや黄色い注意書きが残っていない

---

## 次のアクション

**公開前は「公開前 Blocker」の6項目を最優先で解消する。**

1. 注文フローの信頼性確保（Blocker 1）
2. スパム対策（Blocker 2）
3. R2 の本番配信への切り替え（Blocker 3）
4. 法務ページの実文・送料表示・お問い合わせの整備（Blocker 4）
5. 商品コンテンツの修復（Blocker 5）
6. カート・注文フォームのバグ修正（Blocker 6）
7. FormSubmit の最終テスト注文（受信・返信・完了画面・エラー表示）
8. Cloudflare Pages へのデプロイ（接続・ビルド設定・カスタムドメイン）
9. スマホ実機での表示・操作確認
10. ColorMe データの退避（顧客データ・注文履歴・NEWS）と並行運用
11. ColorMe の閉店処理

---

## アーキテクチャ / 注文フロー

```text
Next.js (Cloudflare Pages / 静的エクスポート)
├── 商品データ: data/products.json（静的）
├── 注文送信: FormSubmit API へ直接 POST（/api/order 不要）
│   └── ショップへ: 注文通知メール
└── 注文完了ページ: 「注文受付・担当者より連絡」を表示
    → 振込先・送料・振込期限は手動でメール返信
```

- **顧客への自動確認メール**: 現状なし（Blocker 1）
- **注文データの保存**: 現状なし。FormSubmit のアーカイブは30日・API 5回/日
- **手動返信フロー**: 受注 → 振込案内 → 入金確認 → 発送
- **送料**: 一律ではなく個別に案内（特商法の表示方法は要確認）
- **振込期限**: 返信時に設定（目安は7日後）

---

## 決定事項

| 項目 | 決定 |
|---|---|
| ホスティング | Cloudflare Pages（無料・商用可） |
| データベース | なし（静的構成）／Supabase は不採用 |
| メール送信 | FormSubmit（Resend 不使用・アカウント作成不要） |
| 会員機能 | 不要（ゲスト注文のみ） |
| 在庫管理 | 不要 |
| 送料 | 個別連絡で決定（一律送料なし） |
| 価格表示 | 税抜＋税込の二段表示 |
| SEO/リダイレクト | 不要 |
| コンテンツ | 外部リンク（note） |
| レスポンシブ | 必須 |

---

## セットアップ

```bash
cd web
npm install
npm run dev
# http://localhost:3000
```

- Node.js: 22 推奨（Cloudflare Pages の `NODE_VERSION` に合わせる）
- `.env.local` は不要（FormSubmit の送信先はコード内に記載）
- 本番ビルド:

```bash
cd web
npm run build
# web/out に静的ファイルを出力
npx serve out
```

> `npm start` は `output: "export"` では動作しません。静的サーバーで `out` を配信してください。

---

## デプロイ（Cloudflare Pages）

| 設定 | 値 |
|---|---|
| リポジトリ | `github.com/freelighttakahashi/ECsite` |
| Root directory | `web` |
| Build command | `npm run build` |
| Output directory | `out` |
| Node version | `22`（`NODE_VERSION`） |

- カスタムドメインを設定する
- R2 はカスタムドメインまたは Worker 経由で配信する（`r2.dev` は本番非対応）
- `public/_headers` でセキュリティヘッダーを設定する（未作成）
- 商品画像の URL を変更した場合は、3つの `products.json` と `next.config.ts` を更新する

---

## データ更新

商品データは現在、次の3箇所に同じ内容を置いています。

- `data/raw/products.json` … 元データ
- `web/data/products.json` … ビルド時の import 用
- `web/public/data/products.json` … checkout の fetch 用

更新時は3つを同期してください。将来的には1箇所を正として自動コピーする仕組みが安全です。

- 商品画像は Cloudflare R2 で配信
- 画像 URL を変更する場合は3つの JSON と `next.config.ts` を更新
- カテゴリ一覧は `web/lib/products.ts` に直書き（`data/raw/categories.json` と二重管理）
- `data/raw/products.csv` は R2 移行前の古い URL のまま。必要に応じて再生成
- JSON は UTF-8 BOM 付き。ツールによっては `utf-8-sig` が必要

---

## 運用ルール

- **注文対応**: FormSubmit の通知メールを確認 → 振込先・送料・期限を手動返信
- **注文バックアップ**: `_cc` で別アドレスに送る、FormSubmit のアーカイブを定期退避する
- **送料**: 個別見積もり。特商法の表示義務を満たす方法を公開前に確定する
- **法務**: 特商法・プライバシーポリシー・利用規約の実文を公開前に確定する
- **画像**: ColorMe 閉店前に `W01.jpg` と旧ショップリンクを解消する
- **並行運用**: 新サイト完成後も数か月 ColorMe と併用し、問題がないことを確認してから閉店する
- **個人情報**: 公開リポジトリにメールアドレスを載せない。FormSubmit の Invisible emails や専用アドレスを検討する
- **Git**: `.env.local`、`node_modules/`、`.next/`、`web/out/`、`data/images/` はコミットしない

---

## フォルダ構成

```text
ECsite/
├── README.md              # 現在の状況・セットアップ・運用（このファイル）
├── 進捗.md                # docs/history.md への案内
├── docs/
│   ├── history.md         # 作業履歴（アーカイブ）
│   └── supabase-schema.sql # 参考・不採用
├── data/
│   ├── raw/               # products.json / csv / categories.json / r2-url-mapping.json
│   └── images/            # 現在は未使用（画像はR2で配信）
├── scripts/
│   ├── scrape-freelight.ps1
│   ├── migrate-images-to-r2.py
│   └── import-to-supabase.ps1 # 参考・不採用
└── web/                   # Next.js プロジェクト（Cloudflare Pages デプロイ対象）
    ├── app/
    ├── lib/
    ├── data/products.json
    ├── public/data/products.json
    └── package.json
```

---

## 履歴

過去の作業履歴・決定の経緯は [`docs/history.md`](docs/history.md) を参照してください。

**運用ルール**: 現在の状況・次のアクション・Blocker はこの README に集約し、`docs/history.md` には現在のタスクを書きません（履歴の追記のみ）。
