import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BUFALIEN_TOTAL, PLACEHOLDER_PRICE_CENTS } from "../config/commerce";

export type CartLine = { id: number; qty: number };

const STORAGE_KEY = "bufalien_cart_v1";

function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: CartLine[] = [];
    for (const row of parsed) {
      if (!row || typeof row !== "object") continue;
      const id = Number((row as { id?: unknown }).id);
      const qty = Number((row as { qty?: unknown }).qty);
      if (!Number.isInteger(id) || id < 1 || id > BUFALIEN_TOTAL) continue;
      if (!Number.isInteger(qty) || qty < 1) continue;
      out.push({ id, qty });
    }
    return mergeLines(out);
  } catch {
    return [];
  }
}

function mergeLines(lines: CartLine[]): CartLine[] {
  const map = new Map<number, number>();
  for (const { id, qty } of lines) {
    map.set(id, (map.get(id) ?? 0) + qty);
  }
  return [...map.entries()]
    .map(([id, qty]) => ({ id, qty }))
    .sort((a, b) => a.id - b.id);
}

function saveCart(lines: CartLine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
}

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotalCents: number;
  add: (id: number, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() =>
    typeof window === "undefined" ? [] : loadCart(),
  );

  useEffect(() => {
    saveCart(lines);
  }, [lines]);

  const add = useCallback((id: number, qty = 1) => {
    if (!Number.isInteger(id) || id < 1 || id > BUFALIEN_TOTAL) return;
    const q = Number.isInteger(qty) && qty > 0 ? qty : 1;
    setLines((prev) => mergeLines([...prev, { id, qty: q }]));
  }, []);

  const setQty = useCallback((id: number, qty: number) => {
    if (!Number.isInteger(id) || id < 1 || id > BUFALIEN_TOTAL) return;
    if (!Number.isInteger(qty) || qty < 1) {
      setLines((prev) => prev.filter((l) => l.id !== id));
      return;
    }
    setLines((prev) => mergeLines(prev.map((l) => (l.id === id ? { ...l, qty } : l))));
  }, []);

  const remove = useCallback((id: number) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((n, l) => n + l.qty, 0);
    const subtotalCents = lines.reduce((n, l) => n + PLACEHOLDER_PRICE_CENTS * l.qty, 0);
    return { lines, itemCount, subtotalCents, add, setQty, remove, clear };
  }, [lines, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
