"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CartProvider, useCart } from "../../cartStore";
import { products, Product } from "../../products";

function DescriptionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product: Product | undefined = products.find((p: Product) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-xl font-bold mb-2">Product not found</p>
          <Link href="/protected/market" className="text-amber-400">
            ← Back to Market
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      add({
        id: product.id,
        name: product.name,
        artisan: product.artisan,
        price: product.price,
        image: product.image,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAdd();
    router.push("/protected/market/cart");
  };

  const related: Product[] = products
    .filter((p: Product) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Breadcrumb */}
      <div className="border-b border-white/10 px-6 py-4 text-sm flex items-center gap-2 text-neutral-400">
        <Link href="/protected/market" className="hover:text-amber-400">
          Market
        </Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span className="text-white">{product.name}</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-square bg-neutral-800">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                {product.badge}
              </span>
            )}
            {discount && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-sm text-neutral-400 mb-2">
              {product.country} · {product.artisan}
            </p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_: unknown, i: number) => (
                  <span
                    key={i}
                    className={`text-sm ${i < product.rating ? "text-amber-400" : "text-neutral-600"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-neutral-400">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 bg-neutral-900 rounded-xl p-4 border border-white/10 mb-4">
              <span className="text-3xl font-bold">₹{product.price.toLocaleString()}</span>
              {product.oldPrice && (
                <div>
                  <p className="text-sm text-neutral-500 line-through">
                    ₹{product.oldPrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-400">
                    Save ₹{(product.oldPrice - product.price).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Stock */}
            <p className={`text-sm mb-4 ${product.inStock ? "text-green-400" : "text-red-400"}`}>
              {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
            </p>

            {/* Quantity */}
            {product.inStock && (
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm text-neutral-400">Qty:</span>
                <div className="flex items-center gap-3 bg-neutral-800 rounded-xl px-4 py-2 border border-white/10">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="text-white text-lg w-5 text-center"
                  >
                    −
                  </button>
                  <span className="text-white w-4 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="text-white text-lg w-5 text-center"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mb-5">
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                  !product.inStock
                    ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                    : added
                    ? "bg-green-600 text-white"
                    : "bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10"
                }`}
              >
                {added ? "✓ Added!" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
                  product.inStock
                    ? "bg-amber-500 hover:bg-amber-400 text-black"
                    : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 text-xs text-neutral-500">
              <span>🛡️ Verified Artisan</span>
              <span>🚚 Free Shipping</span>
              <span>↩️ 7-Day Returns</span>
              <span>🌐 Vertex AI Translated</span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-4">More {product.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r: Product) => (
                <Link
                  key={r.id}
                  href={`/protected/market/description/${r.id}`}
                  className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/40 transition-all group"
                >
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={r.image}
                      alt={r.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm text-white">{r.name}</p>
                    <p className="text-xs text-neutral-400">{r.artisan}</p>
                    <p className="text-amber-400 font-bold mt-1">
                      ₹{r.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <CartProvider>
      <DescriptionPage />
    </CartProvider>
  );
}