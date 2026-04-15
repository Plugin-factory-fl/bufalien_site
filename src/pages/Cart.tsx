import { Link } from "react-router-dom";
import { bufalienImageUrl, formatUsd, PLACEHOLDER_PRICE_CENTS } from "../config/commerce";
import { useCart } from "../context/CartContext";

export function Cart() {
  const { lines, subtotalCents, setQty, remove } = useCart();

  if (lines.length === 0) {
    return (
      <div className="page-narrow">
        <h1>Your cart</h1>
        <p className="muted">No Bufaliens yet. The catalogue is waiting.</p>
        <Link className="btn btn-primary" to="/shop">
          Browse shop
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your cart</h1>
      <p className="muted">Guest cart — stored on this device only.</p>
      <ul className="cart-list">
        {lines.map((line) => (
          <li key={line.id} className="cart-row">
            <img
              className="cart-thumb"
              src={bufalienImageUrl(line.id)}
              alt=""
              width={96}
              height={96}
              loading="lazy"
            />
            <div className="cart-row-main">
              <div className="cart-row-title">Bufalien #{line.id}</div>
              <div className="cart-row-meta">{formatUsd(PLACEHOLDER_PRICE_CENTS)} each</div>
            </div>
            <label className="cart-qty">
              <span className="sr-only">Quantity</span>
              <input
                className="input input-narrow"
                type="number"
                min={1}
                value={line.qty}
                onChange={(e) => setQty(line.id, Number.parseInt(e.target.value, 10) || 1)}
              />
            </label>
            <div className="cart-line-total">{formatUsd(PLACEHOLDER_PRICE_CENTS * line.qty)}</div>
            <button type="button" className="btn btn-ghost btn-small" onClick={() => remove(line.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <strong>{formatUsd(subtotalCents)}</strong>
        </div>
        <p className="muted small">
          Shipping, taxes, and Stripe fees will be calculated at payment time (placeholders for now).
        </p>
        <Link className="btn btn-primary cart-checkout-btn" to="/checkout">
          Checkout
        </Link>
      </div>
    </div>
  );
}
