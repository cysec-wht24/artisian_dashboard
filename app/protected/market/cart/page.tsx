"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CartProvider, useCart, CartItem } from "../cartStore";

function CartPage() {
  const { items, remove, setQty, total, clear } = useCart();
  const [step, setStep] = useState<"cart" | "address" | "payment" | "done">("cart");

  if (step === "done") {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
          <p className="text-neutral-400 mb-6">Thank you for supporting global artisans.</p>
          <Link
            href="/protected/market"
            onClick={clear}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link href="/protected/market" className="text-neutral-400 hover:text-white">
          ← Market
        </Link>
        <h1 className="font-bold text-lg">Checkout</h1>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 text-sm">
        {(["cart", "address", "payment"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s ? "bg-amber-500 text-black" : "bg-neutral-800 text-neutral-400"
              }`}
            >
              {i + 1}
            </span>
            <span className={step === s ? "text-white" : "text-neutral-500"}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            {i < 2 && <span className="text-neutral-700 ml-1">→</span>}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">

          {/* Step 1 – Cart */}
          {step === "cart" && (
            <div>
              <h2 className="font-bold text-lg mb-4">Your Items</h2>
              {items.length === 0 ? (
                <div className="text-center py-16 text-neutral-500">
                  <div className="text-4xl mb-3">🛒</div>
                  <p>Cart is empty.</p>
                  <Link href="/protected/market" className="text-amber-400 mt-3 inline-block">
                    Browse products →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item: CartItem) => (
                    <div
                      key={item.id}
                      className="flex gap-4 bg-neutral-900 border border-white/10 rounded-xl p-4"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-sm text-neutral-400">{item.artisan}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-3 py-1 text-sm">
                            <button
                              onClick={() => setQty(item.id, item.qty - 1)}
                              className="text-white"
                            >
                              −
                            </button>
                            <span className="w-4 text-center text-white">{item.qty}</span>
                            <button
                              onClick={() => setQty(item.id, item.qty + 1)}
                              className="text-white"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-amber-400 font-bold">
                              ₹{(item.price * item.qty).toLocaleString()}
                            </span>
                            <button
                              onClick={() => remove(item.id)}
                              className="text-neutral-600 hover:text-red-400 text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setStep("address")}
                    className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-colors"
                  >
                    Continue →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2 – Address */}
          {step === "address" && (
            <div>
              <h2 className="font-bold text-lg mb-4">Delivery Address</h2>
              <div className="bg-neutral-900 border border-white/10 rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" />
                  <Field label="Last Name" />
                </div>
                <Field label="Street Address" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="City" />
                  <Field label="PIN Code" />
                </div>
                <Field label="Phone Number" type="tel" />
              </div>
              <button
                onClick={() => setStep("payment")}
                className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-colors"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 3 – Payment */}
          {step === "payment" && (
            <div>
              <h2 className="font-bold text-lg mb-4">Payment</h2>
              <div className="bg-neutral-900 border border-white/10 rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {["💳 Card", "📱 UPI", "🏦 Netbanking", "💰 Wallet"].map((m: string) => (
                    <button
                      key={m}
                      className="bg-neutral-800 hover:bg-neutral-700 border border-white/10 rounded-xl py-2.5 text-sm text-white transition-colors"
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <Field label="Card Number" placeholder="1234 5678 9012 3456" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Expiry" placeholder="MM/YY" />
                  <Field label="CVV" placeholder="•••" />
                </div>
              </div>
              <button
                onClick={() => setStep("done")}
                className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-colors"
              >
                🔒 Pay ₹{total.toLocaleString()}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-neutral-900 border border-white/10 rounded-xl p-5 sticky top-6">
            <h3 className="font-bold text-white mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm text-neutral-400 mb-4">
              {items.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between">
                  <span className="truncate mr-2">
                    {item.name} ×{item.qty}
                  </span>
                  <span>₹{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-neutral-400">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span className="text-white">Total</span>
                <span className="text-amber-400">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  placeholder = "",
}: {
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-neutral-400 block mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
      />
    </div>
  );
}

export default function Page() {
  return (
    <CartProvider>
      <CartPage />
    </CartProvider>
  );
}