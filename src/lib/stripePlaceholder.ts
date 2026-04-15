/**
 * Shapes and helpers that mirror a future Stripe Checkout Session payload.
 * Replace `createCheckoutSessionPlaceholder` with a server call when ready.
 */

import { BUFALIEN_TOTAL, PLACEHOLDER_PRICE_CENTS, formatUsd } from "../config/commerce";

export type StripePlaceholderLineItem = {
  quantity: number;
  price_data: {
    currency: "usd";
    unit_amount: number;
    product_data: {
      name: string;
      description?: string;
      metadata?: Record<string, string>;
    };
  };
};

export type StripePlaceholderSessionRequest = {
  mode: "payment";
  line_items: StripePlaceholderLineItem[];
  customer_email?: string;
  success_url?: string;
  cancel_url?: string;
  metadata?: Record<string, string>;
};

export function cartToStripeLineItems(
  lines: { id: number; qty: number }[],
): StripePlaceholderLineItem[] {
  return lines.map((line) => ({
    quantity: line.qty,
    price_data: {
      currency: "usd",
      unit_amount: PLACEHOLDER_PRICE_CENTS,
      product_data: {
        name: `Bufalien #${line.id}`,
        description: "Digital collectible (placeholder)",
        metadata: { token_id: String(line.id) },
      },
    },
  }));
}

export type PlaceholderCheckoutResult = {
  sessionId: string;
  url: null;
};

/**
 * Today: resolves immediately with a fake session id.
 * Later: `fetch('/api/create-checkout-session', { method: 'POST', body: JSON.stringify(req) })`
 */
export async function createCheckoutSessionPlaceholder(
  req: StripePlaceholderSessionRequest,
): Promise<PlaceholderCheckoutResult> {
  void req;
  await Promise.resolve();
  const sessionId = `cs_placeholder_${crypto.randomUUID().replaceAll("-", "").slice(0, 24)}`;
  return { sessionId, url: null };
}

export function validateCartIds(lines: { id: number; qty: number }[]): boolean {
  return lines.every(
    (l) =>
      Number.isInteger(l.id) &&
      l.id >= 1 &&
      l.id <= BUFALIEN_TOTAL &&
      Number.isInteger(l.qty) &&
      l.qty >= 1,
  );
}

export function describeLineItemsForReview(lines: { id: number; qty: number }[]): string {
  const parts = lines.map(
    (l) => `#${l.id} × ${l.qty} (${formatUsd(PLACEHOLDER_PRICE_CENTS * l.qty)})`,
  );
  return parts.join(", ");
}
