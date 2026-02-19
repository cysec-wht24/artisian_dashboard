"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, CartItem } from "./cartStore";
import { products, categories, Product } from "./products";

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { items, remove, setQty, total, clear } = useCart();

  const handleCheckout = () => {
    onClose();
    router.push("/protected/market/cart");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-80 z-50 flex flex-col shadow-2xl transition-transform duration-300
          bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-700
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="font-bold text-neutral-900 dark:text-white">
            Cart ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 && (
            <p className="text-center text-neutral-400 mt-20 text-sm">
              Your cart is empty
            </p>
          )}
          {items.map((item: CartItem) => (
            <div
              key={item.id}
              className="flex gap-3 rounded-xl p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                  {item.name}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {item.artisan}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg px-2 py-1 text-sm">
                    <button
                      onClick={() => setQty(item.id, item.qty - 1)}
                      className="text-neutral-700 dark:text-white w-4 text-center"
                    >
                      −
                    </button>
                    <span className="text-neutral-900 dark:text-white w-4 text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => setQty(item.id, item.qty + 1)}
                      className="text-neutral-700 dark:text-white w-4 text-center"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-amber-600 font-semibold text-sm">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => remove(item.id)}
                className="text-neutral-300 hover:text-red-400 text-sm self-start pt-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 space-y-3">
            <div className="flex justify-between font-bold">
              <span className="text-neutral-900 dark:text-white">Total</span>
              <span className="text-amber-600">₹{total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="block w-full text-center bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-xl transition-colors"
            >
              Checkout
            </button>
            <button
              onClick={clear}
              className="block w-full text-center text-sm text-neutral-400 hover:text-red-400 transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { add, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = items.some((i: CartItem) => i.id === product.id);

  const discount = product.oldPrice
    ? Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100
      )
    : null;

  // Navigate to description page
  const goToProduct = () => {
    router.push(`/protected/market/description/${product.id}`);
  };

  // Add to cart without navigating
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    add({
      id: product.id,
      name: product.name,
      artisan: product.artisan,
      price: product.price,
      image: product.image,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  // Buy now without navigating to image
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    add({
      id: product.id,
      name: product.name,
      artisan: product.artisan,
      price: product.price,
      image: product.image,
    });
    router.push("/protected/market/cart");
  };

  return (
    <div
      onClick={goToProduct}
      className="cursor-pointer group rounded-2xl overflow-hidden border transition-all duration-300
        bg-white dark:bg-neutral-900
        border-neutral-200 dark:border-neutral-700
        hover:border-amber-400 dark:hover:border-amber-500
        hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full bg-amber-500 text-black">
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full bg-red-500 text-white">
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 dark:bg-black/60 flex items-center justify-center">
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-600">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-neutral-400 mb-1">
          {product.country} · {product.artisan}
        </p>
        <h3 className="font-semibold text-sm mb-2 line-clamp-1 text-neutral-900 dark:text-white">
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-3">
          {Array.from({ length: 5 }).map((_: unknown, i: number) => (
            <span
              key={i}
              className={`text-xs ${i < product.rating ? "text-amber-400" : "text-neutral-300 dark:text-neutral-600"}`}
            >
              ★
            </span>
          ))}
          <span className="text-xs text-neutral-400 ml-1">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-lg text-neutral-900 dark:text-white">
            ₹{product.price.toLocaleString()}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-neutral-400 line-through">
              ₹{product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Buttons — stopPropagation so card click doesn't fire */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-colors ${
              !product.inStock
                ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                : justAdded || inCart
                ? "bg-green-500 text-white"
                : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-white border border-neutral-200 dark:border-neutral-600"
            }`}
          >
            {!product.inStock
              ? "Unavailable"
              : justAdded
              ? "✓ Added"
              : inCart
              ? "In Cart"
              : "Add to Cart"}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!product.inStock}
            className={`flex-1 text-xs font-bold py-2 rounded-lg transition-colors ${
              product.inStock
                ? "bg-amber-500 hover:bg-amber-400 text-black"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Market Page ─────────────────────────────────────────────────────────

function MarketContent() {
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const { count } = useCart();

  const filtered: Product[] =
    activeCategory === "All"
      ? products
      : products.filter((p: Product) => p.category === activeCategory);

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white">

      {/* Navbar */}
      <div className="sticky top-0 z-30 backdrop-blur border-b px-6 py-4 flex items-center justify-between
        bg-white/90 dark:bg-neutral-900/90 border-neutral-200 dark:border-neutral-700 shadow-sm">
        <div>
          <h1 className="text-xl font-bold">🎨 Artisan Market</h1>
          <p className="text-xs text-neutral-400">Handcrafted art from global artisans</p>
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="relative bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          🛒 Cart
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 px-6 py-4 overflow-x-auto border-b
        bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
        {categories.map((cat: string) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-amber-500 text-black"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="px-6 py-6">
        <p className="text-neutral-400 text-sm mb-4">{filtered.length} items</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default function Page() {
  return <MarketContent />;
}