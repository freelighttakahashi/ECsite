import { getProduct } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  if (!product) notFound();

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        {product.images?.[0] && (
          <Image
            src={product.images[0]}
            alt={product.title}
            width={600}
            height={600}
            className="w-full h-auto border"
          />
        )}
        <div className="flex gap-2 mt-2 flex-wrap">
          {product.images?.slice(1).map((img: string, i: number) => (
            <Image key={i} src={img} alt="" width={80} height={80} className="border" />
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="mt-2 text-sm text-gray-500">Category: {product.category}</p>
        <div className="mt-4 price-two-line">
          <span className="ex">{product.price_ex_tax.toLocaleString()}円</span>
          <span className="inc">（税込 {product.price_incl_tax.toLocaleString()}円）</span>
        </div>
        <div
          className="mt-6 prose prose-sm"
          dangerouslySetInnerHTML={{ __html: product.description_html ?? "" }}
        />
        <form action="/cart" method="get" className="mt-6">
          <input type="hidden" name="add" value={product.id} />
          <label className="block mb-2">
            数量:
            <input
              type="number"
              name="qty"
              defaultValue={1}
              min={1}
              className="border ml-2 w-20 px-2 py-1"
            />
          </label>
          <button type="submit" className="bg-black text-white px-6 py-2">
            カートに入れる
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-500">
          <Link href="/legal" className="underline">特定商取引法に基づく表記</Link>
        </p>
      </div>
    </div>
  );
}