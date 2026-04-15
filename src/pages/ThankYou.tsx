import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ORDER_SESSION_KEY } from "../constants";
import { formatUsd } from "../config/commerce";

type OrderSnapshot = {
  orderId: string;
  sessionId: string;
  email: string;
  lines: { id: number; qty: number }[];
  totalCents: number;
  createdAt: string;
};

function readOrder(orderId: string | null): OrderSnapshot | null {
  if (!orderId) return null;
  try {
    const raw = sessionStorage.getItem(ORDER_SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as OrderSnapshot;
    if (!data || data.orderId !== orderId) return null;
    return data;
  } catch {
    return null;
  }
}

export function ThankYou() {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const order = useMemo(() => readOrder(orderId), [orderId]);

  if (!orderId || !order) {
    return (
      <div className="page-narrow">
        <h1>Thanks?</h1>
        <p className="muted">No order found in this browser session. If you refreshed, start a new checkout.</p>
        <Link className="btn btn-primary" to="/shop">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="page-narrow thank-you">
      <p className="eyebrow">Order placed (demo)</p>
      <h1>Thank you, Earth ally</h1>
      <p className="home-lead">
        Your Bufalien delegation is noted. This confirmation is generated locally — when Stripe is
        connected, you will receive a payment receipt and fulfillment instructions by email.
      </p>
      <dl className="order-dl">
        <div>
          <dt>Order ID</dt>
          <dd>
            <code>{order.orderId}</code>
          </dd>
        </div>
        <div>
          <dt>Stripe session (placeholder)</dt>
          <dd>
            <code>{order.sessionId}</code>
          </dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{order.email}</dd>
        </div>
        <div>
          <dt>Total (placeholder)</dt>
          <dd>{formatUsd(order.totalCents)}</dd>
        </div>
        <div>
          <dt>Bufaliens</dt>
          <dd>
            {order.lines.map((l) => (
              <span key={l.id} className="tag">
                #{l.id} ×{l.qty}
              </span>
            ))}
          </dd>
        </div>
      </dl>
      <p className="muted small">Recorded at {new Date(order.createdAt).toLocaleString()}</p>
      <div className="home-cta">
        <Link className="btn btn-primary" to="/shop">
          Adopt another Bufalien
        </Link>
        <Link className="btn btn-ghost" to="/">
          Return home
        </Link>
      </div>
    </div>
  );
}
