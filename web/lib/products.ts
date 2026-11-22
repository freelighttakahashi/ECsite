import raw from "@/data/products.json";

export type Product = {
  id: number;
  title: string;
  description_html: string;
  category_id: number;
  category: string;
  price_ex_tax: number;
  price_incl_tax: number;
  is_new: boolean;
  images: string[];
};

function toNumber(v: string | number): number {
  if (typeof v === "number") return v;
  return parseInt(String(v).replace(/,/g, ""), 10) || 0;
}

export const products: Product[] = (raw as any[]).map((p) => ({
  id: Number(p.id),
  title: p.title,
  description_html: p.description_html ?? "",
  category_id: Number(p.category_id),
  category: p.category_display ?? p.category ?? "",
  price_ex_tax: toNumber(p.price_ex_tax),
  price_incl_tax: toNumber(p.price_incl_tax),
  is_new: Boolean(p.is_new),
  images: typeof p.images === "string"
    ? p.images.split(";").map((s: string) => s.trim()).filter(Boolean)
    : Array.isArray(p.images) ? p.images : [],
}));

export function getProduct(id: string | number) {
  return products.find((p) => String(p.id) === String(id));
}

export function getProductsByCategory(categoryId: string | number) {
  return products.filter((p) => String(p.category_id) === String(categoryId));
}

export const categories = [
  { id: "933900", name: "バックパック" },
  { id: "1266661", name: "サコッシュ" },
  { id: "936209", name: "ハイキングポール" },
  { id: "934964", name: "ストーブ＆カトラリー" },
  { id: "1254977", name: "スリーピンググッズ" },
  { id: "1474197", name: "タープ&シェルター" },
  { id: "936210", name: "アクセサリー" },
  { id: "938945", name: "マテリアル" },
];