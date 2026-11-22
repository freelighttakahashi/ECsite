"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  customer_name: z.string().min(1, "お名前を入力してください"),
  email: z.string().email("メールアドレスを正しく入力してください"),
  phone: z.string().optional(),
  address: z.string().min(1, "住所を入力してください"),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Product = { id: number; title: string; price_ex_tax: number; price_incl_tax: number };
type CartItem = { id: string; qty: number };

export default function CheckoutPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    // 商品データを取得
    const res = await fetch("/data/products.json");
    const products: Product[] = await res.json();

    let totalEx = 0;
    let totalIn = 0;
    const lines: string[] = [];
    cart.forEach((c) => {
      const p = products.find((x) => String(x.id) === String(c.id));
      const ex = (p?.price_ex_tax ?? 0) * c.qty;
      const inc = (p?.price_incl_tax ?? 0) * c.qty;
      totalEx += ex;
      totalIn += inc;
      lines.push(`- ${p?.title ?? c.id} × ${c.qty}  (税込 ${inc.toLocaleString()}円)`);
    });

    const orderNumber = "FL-" + Date.now();
    const message = [
      `注文番号: ${orderNumber}`,
      `お名前: ${values.customer_name}`,
      `メール: ${values.email}`,
      `電話: ${values.phone || "-"}`,
      `住所: ${values.address}`,
      `備考: ${values.note || "-"}`,
      "",
      "【注文商品】",
      ...lines,
      "",
      `合計（税抜）: ${totalEx.toLocaleString()}円`,
      `合計（税込）: ${totalIn.toLocaleString()}円`,
    ].join("\n");

    try {
      const r = await fetch("https://formsubmit.co/ajax/britzjp@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `【FREELIGHT】新規注文 ${orderNumber}`,
          _template: "table",
          _captcha: "false",
          _honey: "",
          _next: `${window.location.origin}/order/complete?order=${orderNumber}&total=${totalIn}`,
          name: values.customer_name,
          email: values.email,
          phone: values.phone || "-",
          address: values.address,
          note: values.note || "-",
          message,
        }),
      });
      const data = await r.json();
      if (data.success !== "true" && data.success !== true) {
        throw new Error(data.message || "送信に失敗しました");
      }
    } catch (e) {
      setSubmitting(false);
      alert("注文送信に失敗しました: " + (e as Error).message);
      return;
    }

    localStorage.removeItem("cart");
    setSubmitting(false);
    router.push(`/order/complete?order=${orderNumber}&total=${totalIn}`);
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">ご注文情報</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm">お名前 *</label>
          <input {...register("customer_name")} className="border w-full px-3 py-2" />
          {errors.customer_name && <p className="text-red-500 text-xs">{errors.customer_name.message}</p>}
        </div>
        <div>
          <label className="block text-sm">メールアドレス *</label>
          <input {...register("email")} className="border w-full px-3 py-2" />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm">電話番号</label>
          <input {...register("phone")} className="border w-full px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm">ご住所 *</label>
          <textarea {...register("address")} className="border w-full px-3 py-2" rows={3} />
          {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
        </div>
        <div>
          <label className="block text-sm">備考</label>
          <textarea {...register("note")} className="border w-full px-3 py-2" rows={2} />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white px-6 py-2 disabled:opacity-50"
        >
          {submitting ? "送信中..." : "注文を確定する"}
        </button>
      </form>
      <p className="mt-4 text-xs text-gray-500">
        ※ ご注文後、担当者より振込先・送料をご案内いたします。
      </p>
    </div>
  );
}