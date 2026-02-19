"use client";

import { CartProvider } from "./cartStore";
import { ReactNode } from "react";

export default function MarketLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}