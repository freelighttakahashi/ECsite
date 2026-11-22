export default function TermsPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6 border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
        ※ このページの内容は ColorMe から文面を転記しました。必要に応じて修正してください。
      </div>

      <h1 className="text-2xl font-bold mb-6">利用規約</h1>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold mb-2">1. 適用</h2>
          <p>
            本規約は、当店が提供する商品の購入に関する一切の関係に適用されます。
            お客様は、本規約に同意の上、当店の商品をご購入いただくものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">2. 注文方法</h2>
          <p>
            お客様は、当サイトの注文フォームに必要事項を入力し、送信することで注文が完了します。
            注文完了後、当店より注文確認メールをお送りします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">3. 支払方法</h2>
          <p>
            お支払いは銀行振込のみとさせていただきます。
            注文確認メールに記載の口座へ、指定の期限までにお振込みください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">4. 配送</h2>
          <p>
            入金確認後、通常 3〜7 営業日以内に商品を発送いたします。
            配送業者・送料は個別にご案内いたします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">5. 返品・交換</h2>
          <p>
            商品の品質には万全を期しておりますが、万一不良品・破損品が届いた場合は、
            商品到着後 7 日以内にご連絡ください。良品と交換いたします。
            お客様のご都合による返品・交換はお受けできません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">6. 禁止事項</h2>
          <p>お客様は、以下の行為を行ってはなりません:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>虚偽の情報を登録する行為</li>
            <li>当店の運営を妨害する行為</li>
            <li>その他、当店が不適切と判断する行為</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">7. 免責事項</h2>
          <p>
            当店は、商品の使用によって生じた損害について、当店に故意または重過失がある場合を除き、
            責任を負わないものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">8. 規約の変更</h2>
          <p>
            本規約の内容は、必要に応じて変更することがあります。
            変更後の規約は、当サイトに掲載した時点から効力を生じるものとします。
          </p>
        </section>
      </div>

      <p className="mt-6 text-xs text-gray-500">
        ※ 上記の内容は ColorMe ショップの文面を転記したものです。必要に応じて修正してください。
      </p>
    </div>
  );
}