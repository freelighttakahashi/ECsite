import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FREELIGHT ONLINE STORE",
  description: "FREELIGHT - Simple is the best - アウトドアギア",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="border-b">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">FREELIGHT ONLINE STORE</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/">HOME</Link>
              <Link href="/cart">CART</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t mt-12 py-6 text-center text-xs text-gray-500">
          copyright (c)2011 freelight All rights reserved.
        </footer>
      </body>
    </html>
  );
}