"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CompleteContent() {
  const sp = useSearchParams();
  const order = sp.get("order");
  const total = sp.get("total");

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-4">ご注文ありがとうございます</h1>
      <p>注文番号: <strong>{order}</strong></p>
      <p>お支払い金額（税込）: <strong>{Number(total).toLocaleString()}円</strong></p>

      <div className="mt-6 border p-4 bg-gray-50">
        <h2 className="font-bold mb-2">今後の流れ</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>担当者より振込先・送料をメールでご案内します</li>
          <li>ご案内メールに記載の口座へお振込みください</li>
          <li>入金確認後、商品を発送いたします</li>
        </ol>
      </div>

      <p className="mt-6 text-sm text-gray-600">
        ご注文確認のメールが届かない場合は、迷惑メールフォルダをご確認ください。
        それでも届かない場合はお問い合わせください。
      </p>
      <a href="/" className="inline-block mt-6 underline">トップページへ戻る</a>
    </div>
  );
}

export default function OrderCompletePage() {
  return (
    <Suspense fallback={<p>読み込み中...</p>}>
      <CompleteContent />
    </Suspense>
  );
}