"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";

export function CartBadge() {
  const { count } = useCart();

  return (
    <Link href="/carrinho" className="relative text-ink/70 hover:text-primary transition-colors">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
        <path d="M2.5 3h2l2.2 11.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20.5 7H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-court text-white text-[10px] font-mono rounded-full w-4 h-4 flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
