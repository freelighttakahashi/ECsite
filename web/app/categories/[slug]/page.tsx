import { getProductsByCategory, categories } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.id }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((c) => c.id === slug);
  const products = getProductsByCategory(slug);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{category?.name ?? "カテゴリ"}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <Link key={p.id} href={`/products/${p.id}`} className="border p-2 hover:shadow">
            {p.images?.[0] && (
              <Image src={p.images[0]} alt={p.title} width={300} height={300} className="w-full h-auto" />
            )}
            <p className="mt-2 text-sm">{p.title}</p>
            <p className="price-two-line">
              <span className="ex">{p.price_ex_tax.toLocaleString()}円</span>
              <span className="inc">（税込 {p.price_incl_tax.toLocaleString()}円）</span>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}