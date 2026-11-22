"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { products } from "@/lib/products";

type CartItem = { id: string; qty: number };

function CartContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    let cart: CartItem[] = raw ? JSON.parse(raw) : [];

    const add = sp.get("add");
    const qty = Math.max(1, parseInt(sp.get("qty") || "1", 10) || 1);
    if (add) {
      const idx = cart.findIndex((i) => i.id === add);
      if (idx >= 0) cart[idx].qty += qty;
      else cart.push({ id: add, qty });
      localStorage.setItem("cart", JSON.stringify(cart));
      router.replace("/cart");
    }
    setItems(cart);
  }, [sp, router]);

  const remove = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const updateQty = (id: string, qty: number) => {
    const next = items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
    setItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const totalEx = items.reduce((sum, i) => {
    const p = products.find((x) => String(x.id) === i.id);
    return sum + (p?.price_ex_tax ?? 0) * i.qty;
  }, 0);
  const totalIn = items.reduce((sum, i) => {
    const p = products.find((x) => String(x.id) === i.id);
    return sum + (p?.price_incl_tax ?? 0) * i.qty;
  }, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">カート</h1>
      {items.length === 0 ? (
        <p>カートは空です。</p>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map((i) => {
              const p = products.find((x) => String(x.id) === i.id);
              const lineEx = (p?.price_ex_tax ?? 0) * i.qty;
              const lineIn = (p?.price_incl_tax ?? 0) * i.qty;
              return (
                <li key={i.id} className="border p-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{p?.title ?? `商品ID: ${i.id}`}</p>
                    <p className="text-sm text-gray-500">
                      単価（税込）: {(p?.price_incl_tax ?? 0).toLocaleString()}円 ×
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={i.qty}
                      onChange={(e) => updateQty(i.id, parseInt(e.target.value, 10) || 1)}
                      className="border w-16 px-2 py-1"
                    />
                    <span className="text-sm whitespace-nowrap">
                      小計（税込）: {lineIn.toLocaleString()}円
                    </span>
                    <button onClick={() => remove(i.id)} className="text-red-500 text-sm">
                      削除
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 md:hidden">
                    税抜小計: {lineEx.toLocaleString()}円
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 border-t pt-4 text-right space-y-1">
            <p>合計（税抜）: {totalEx.toLocaleString()}円</p>
            <p className="font-bold">合計（税込）: {totalIn.toLocaleString()}円</p>
          </div>
        </>
      )}
      <div className="mt-6">
        <Link href="/checkout" className="bg-black text-white px-6 py-2 inline-block">
          レジに進む
        </Link>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<p>読み込み中...</p>}>
      <CartContent />
    </Suspense>
  );
}