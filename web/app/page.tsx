import { products, categories } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const sorted = [...products].sort((a, b) => b.id - a.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Items</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sorted.map((p) => (
          <Link key={p.id} href={`/products/${p.id}`} className="border p-2 hover:shadow">
            {p.images?.[0] && (
              <Image
                src={p.images[0]}
                alt={p.title}
                width={300}
                height={300}
                className="w-full h-auto"
              />
            )}
            <p className="mt-2 text-sm">{p.title}</p>
            <p className="price-two-line">
              <span className="ex">{p.price_ex_tax.toLocaleString()}円</span>
              <span className="inc">（税込 {p.price_incl_tax.toLocaleString()}円）</span>
            </p>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-10 mb-4">Category</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.id}`}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}