export default function LegalPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6 border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
        ※ このページの内容は ColorMe から文面を転記しました。必要に応じて修正してください。
      </div>

      <h1 className="text-2xl font-bold mb-6">特定商取引法に基づく表記</h1>

      <table className="w-full border-collapse text-sm">
        <tbody>
          <tr className="border-b">
            <th className="bg-gray-50 px-4 py-3 text-left w-1/3">販売業者</th>
            <td className="px-4 py-3">FREELIGHT（フリーライト）</td>
          </tr>
          <tr className="border-b">
            <th className="bg-gray-50 px-4 py-3 text-left">運営統括責任者</th>
            <td className="px-4 py-3">（転記予定）</td>
          </tr>
          <tr className="border-b">
            <th className="bg-gray-50 px-4 py-3 text-left">所在地</th>
            <td className="px-4 py-3">（転記予定）</td>
          </tr>
          <tr className="border-b">
            <th className="bg-gray-50 px-4 py-3 text-left">電話番号</th>
            <td className="px-4 py-3">（転記予定）</td>
          </tr>
          <tr className="border-b">
            <th className="bg-gray-50 px-4 py-3 text-left">メールアドレス</th>
            <td className="px-4 py-3">（転記予定）</td>
          </tr>
          <tr className="border-b">
            <th className="bg-gray-50 px-4 py-3 text-left">販売価格</th>
            <td className="px-4 py-3">各商品ページに表示された価格（税抜・税込）</td>
          </tr>
          <tr className="border-b">
            <th className="bg-gray-50 px-4 py-3 text-left">商品代金以外の必要料金</th>
            <td className="px-4 py-3">送料（個別にご案内いたします）</td>
          </tr>
          <tr className="border-b">
            <th className="bg-gray-50 px-4 py-3 text-left">支払方法</th>
            <td className="px-4 py-3">銀行振込</td>
          </tr>
          <tr className="border-b">
            <th className="bg-gray-50 px-4 py-3 text-left">支払時期</th>
            <td className="px-4 py-3">ご注文確認メールに記載の期限までにお振込みください</td>
          </tr>
          <tr className="border-b">
            <th className="bg-gray-50 px-4 py-3 text-left">商品の引き渡し時期</th>
            <td className="px-4 py-3">入金確認後、通常 3〜7 営業日以内に発送いたします</td>
          </tr>
          <tr className="border-b">
            <th className="bg-gray-50 px-4 py-3 text-left">返品・交換について</th>
            <td className="px-4 py-3">
              商品の品質には万全を期しておりますが、万一不良品・破損品が届いた場合は、
              商品到着後 7 日以内にご連絡ください。良品と交換いたします。
              お客様のご都合による返品・交換はお受けできません。
            </td>
          </tr>
        </tbody>
      </table>

      <p className="mt-6 text-xs text-gray-500">
        ※ 上記の内容は ColorMe ショップの表記を転記したものです。必要に応じて修正してください。
      </p>
    </div>
  );
}