export default function PrivacyPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6 border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
        ※ このページの内容は ColorMe から文面を転記しました。必要に応じて修正してください。
      </div>

      <h1 className="text-2xl font-bold mb-6">プライバシーポリシー</h1>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold mb-2">1. 個人情報の収集について</h2>
          <p>
            当店では、ご注文・お問い合わせの際に、お名前・ご住所・電話番号・メールアドレス等の
            個人情報をご提供いただいております。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">2. 個人情報の利用目的</h2>
          <p>収集した個人情報は、以下の目的で利用いたします:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>ご注文の処理・発送</li>
            <li>お問い合わせへの回答</li>
            <li>商品・サービスに関するご案内</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">3. 個人情報の第三者提供</h2>
          <p>
            当店は、法令に基づく場合を除き、お客様の同意なく個人情報を第三者に提供することはありません。
            ただし、配送業者への配送情報の提供はこの限りではありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">4. 個人情報の管理</h2>
          <p>
            当店は、個人情報の漏洩・滅失・毀損を防ぐため、適切な安全管理措置を講じます。
            個人情報は、利用目的の達成に必要な期間のみ保管し、不要となった場合は速やかに削除いたします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">5. Cookie について</h2>
          <p>
            当サイトでは、カート機能のためにブラウザの localStorage を使用しています。
            個人を特定する Cookie は使用しておりません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">6. プライバシーポリシーの変更</h2>
          <p>
            本ポリシーの内容は、必要に応じて変更することがあります。
            変更後のポリシーは、当サイトに掲載した時点から効力を生じるものとします。
          </p>
        </section>
      </div>

      <p className="mt-6 text-xs text-gray-500">
        ※ 上記の内容は ColorMe ショップの文面を転記したものです。必要に応じて修正してください。
      </p>
    </div>
  );
}