"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = { id: string; qty: number };

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    setItems(raw ? JSON.parse(raw) : []);
  }, []);

  const remove = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">カート</h1>
      {items.length === 0 ? (
        <p>カートは空です。</p>
      ) : (
        <ul className="space-y-2">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between border p-2">
              <span>商品ID: {i.id} × {i.qty}</span>
              <button onClick={() => remove(i.id)} className="text-red-500 text-sm">
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        <Link href="/checkout" className="bg-black text-white px-6 py-2">
          レジに進む
        </Link>
      </div>
    </div>
  );
}