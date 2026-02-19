"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CartProvider, useCart, CartItem } from "./cartStore";
import { products, categories, Product } from "./products";

// ─── Cart Drawer ────────────────────────────────────────────────────────────

function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, remove, setQty, total, clear } = useCart();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-80 bg-neutral-900 border-l border-white/10 z-50 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="font-bold text-white">Cart ({items.length})</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 && (
            <p className="text-center text-neutral-500 mt-16">Your cart is empty</p>
          )}
          {items.map((item: CartItem) => (
            <div key={item.id} className="flex gap-3 bg-neutral-800 rounded-xl p-3">
              <Image src={item.image} alt={item.name} width={56} height={56} className="w-14 h-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.name}</p>
                <p className="text-xs text-neutral-400">{item.artisan}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 bg-neutral-700 rounded-lg px-2 py-1 text-sm">
                    <button onClick={() => setQty(item.id, item.qty - 1)} className="text-white w-4 text-center">−</button>
                    <span className="text-white w-4 text-center">{item.qty}</span>
                    <button onClick={() => setQty(item.id, item.qty + 1)} className="text-white w-4 text-center">+</button>
                  </div>
                  <span className="text-amber-400 font-semibold text-sm">₹{(item.price * item.qty).toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => remove(item.id)} className="text-neutral-600 hover:text-red-400 text-sm self-start">✕</button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-white/10 space-y-3">
            <div className="flex justify-between font-bold text-white">
              <span>Total</span>
              <span className="text-amber-400">₹{total.toLocaleString()}</span>
            </div>
            <Link href="/protected/market/cart" onClick={onClose} className="block w-full text-center bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-xl transition-colors">
              Checkout
            </Link>
            <button onClick={clear} className="block w-full text-center text-sm text-neutral-500 hover:text-red-400 transition-colors">
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Product Card ────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: (typeof products)[0] }) {
  const { add, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = items.some((i: CartItem) => i.id === product.id);

  const handleAdd = () => {
    add({ id: product.id, name: product.name, artisan: product.artisan, price: product.price, image: product.image });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all group">
      
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-800">
        <Image src={product.image} alt={product.name} fill className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-sm font-semibold bg-neutral-800 px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-neutral-400 mb-1">{product.country} · {product.artisan}</p>
        <h3 className="font-semibold text-white text-sm mb-2 line-clamp-1">{product.name}</h3>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          {"★".repeat(product.rating).split("").map((_, i) => (
            <span key={i} className="text-amber-400 text-xs">★</span>
          ))}
          {"☆".repeat(5 - product.rating).split("").map((_, i) => (
            <span key={i} className="text-neutral-600 text-xs">★</span>
          ))}
          <span className="text-xs text-neutral-500 ml-1">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-white text-lg">₹{product.price.toLocaleString()}</span>
          {product.oldPrice && (
            <span className="text-sm text-neutral-500 line-through">₹{product.oldPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-colors ${
              !product.inStock ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
              : justAdded || inCart ? "bg-green-600 text-white"
              : "bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10"
            }`}
          >
            {!product.inStock ? "Unavailable" : justAdded ? "✓ Added" : inCart ? "In Cart" : "Add to Cart"}
          </button>
          <Link
            href={`/protected/market/description/${product.id}`}
            className="flex-1 text-xs font-bold py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-center transition-colors"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

function MarketPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const { count } = useCart();

  const filtered = activeCategory === "All" ? products : products.filter((p: Product) => p.category === activeCategory);

  return (
    <div className="w-full min-h-screen bg-neutral-950 text-white">

      {/* Navbar */}
      <div className="sticky top-0 z-30 bg-neutral-900/90 backdrop-blur border-b border-white/10 px-6 py-4 flex items-center justify-between">
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
      <div className="flex gap-2 px-6 py-4 overflow-x-auto border-b border-white/10">
        {categories.map((cat: string) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat ? "bg-amber-500 text-black" : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="px-6 py-6">
        <p className="text-neutral-500 text-sm mb-4">{filtered.length} items</p>
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
  return (
    <CartProvider>
      <MarketPage />
    </CartProvider>
  );
}