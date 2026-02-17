import type { ReactNode } from "react";

export default function MarketLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {children}
    </div>
  );
}