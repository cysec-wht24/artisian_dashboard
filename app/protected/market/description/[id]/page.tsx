"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../cartStore";
import { products, Product } from "../../products";

function DescriptionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product: Product | undefined = products.find(
    (p: Product) => p.id === id
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            Product not found
          </p>
          <button
            onClick={() => router.push("/protected/market")}
            className="text-amber-500 hover:text-amber-400"
          >
            ← Back to Market
          </button>
        </div>
      </div>
    );
  }

  const discount = product.oldPrice
    ? Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100
      )
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
    .filter(
      (p: Product) => p.category === product.category && p.id !== product.id
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white">

      {/* Breadcrumb / Back bar */}
      <div className="border-b px-6 py-4 text-sm flex items-center gap-2
        bg-white dark:bg-neutral-900
        border-neutral-200 dark:border-neutral-700 shadow-sm">
        <button
          onClick={() => router.push("/protected/market")}
          className="text-neutral-400 hover:text-amber-500 transition-colors"
        >
          ← Market
        </button>
        <span className="text-neutral-300 dark:text-neutral-600">/</span>
        <span className="text-neutral-500 dark:text-neutral-400">
          {product.category}
        </span>
        <span className="text-neutral-300 dark:text-neutral-600">/</span>
        <span className="text-neutral-900 dark:text-white font-medium truncate">
          {product.name}
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">

          {/* Image — wrapped in div, NOT anchor, to prevent zoom */}
          <div className="relative rounded-2xl overflow-hidden aspect-square shadow-md
            bg-neutral-100 dark:bg-neutral-800">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              draggable={false}
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

          {/* Info Panel */}
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
                    className={`text-sm ${
                      i < product.rating
                        ? "text-amber-400"
                        : "text-neutral-300 dark:text-neutral-600"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-neutral-400">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price Box */}
            <div className="flex items-end gap-3 rounded-xl p-4 border mb-4
              bg-white dark:bg-neutral-900
              border-neutral-200 dark:border-neutral-700 shadow-sm">
              <span className="text-3xl font-bold">
                ₹{product.price.toLocaleString()}
              </span>
              {product.oldPrice && (
                <div>
                  <p className="text-sm text-neutral-400 line-through">
                    ₹{product.oldPrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-500">
                    Save ₹{(product.oldPrice - product.price).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Stock */}
            <p
              className={`text-sm mb-4 font-medium ${
                product.inStock ? "text-green-500" : "text-red-400"
              }`}
            >
              {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
            </p>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Qty:
                </span>
                <div className="flex items-center gap-3 rounded-xl px-4 py-2 border
                  bg-white dark:bg-neutral-800
                  border-neutral-200 dark:border-neutral-700">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="text-neutral-600 dark:text-white text-lg w-5 text-center"
                  >
                    −
                  </button>
                  <span className="w-4 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="text-neutral-600 dark:text-white text-lg w-5 text-center"
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
                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                    : added
                    ? "bg-green-500 text-white"
                    : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-white border border-neutral-200 dark:border-neutral-600"
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
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 text-xs text-neutral-400">
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
                <div
                  key={r.id}
                  onClick={() =>
                    router.push(`/protected/market/description/${r.id}`)
                  }
                  className="cursor-pointer rounded-xl overflow-hidden border transition-all group
                    bg-white dark:bg-neutral-900
                    border-neutral-200 dark:border-neutral-700
                    hover:border-amber-400 dark:hover:border-amber-500
                    hover:shadow-md"
                >
                  <div className="aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      draggable={false}
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-xs text-neutral-400">{r.artisan}</p>
                    <p className="text-amber-600 font-bold mt-1">
                      ₹{r.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return <DescriptionPage />;
}