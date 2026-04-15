import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ORDER_SESSION_KEY } from "../constants";
import { formatUsd } from "../config/commerce";
import { useCart } from "../context/CartContext";
import {
  cartToStripeLineItems,
  createCheckoutSessionPlaceholder,
  describeLineItemsForReview,
  validateCartIds,
  type StripePlaceholderSessionRequest,
} from "../lib/stripePlaceholder";

type Step = 0 | 1 | 2 | 3;

type CheckoutForm = {
  email: string;
  fullName: string;
  address1: string;
  address2: string;
  city: string;
  region: string;
  postal: string;
  country: string;
  agreeTerms: boolean;
};

const initialForm: CheckoutForm = {
  email: "",
  fullName: "",
  address1: "",
  address2: "",
  city: "",
  region: "",
  postal: "",
  country: "US",
  agreeTerms: false,
};

export function Checkout() {
  const navigate = useNavigate();
  const { lines, subtotalCents, clear } = useCart();
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const stripePreview = useMemo(() => cartToStripeLineItems(lines), [lines]);

  if (lines.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const canStep0 = form.email.includes("@");
  const canStep1 =
    form.fullName.trim().length > 1 &&
    form.address1.trim().length > 1 &&
    form.city.trim().length > 0 &&
    form.postal.trim().length > 0;

  const goNext = () => setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  const goBack = () => setStep((s) => (s > 0 ? ((s - 1) as Step) : s));

  const placeOrder = async () => {
    if (!form.agreeTerms || !validateCartIds(lines)) return;
    setSubmitting(true);
    const orderId = crypto.randomUUID();
    const req: StripePlaceholderSessionRequest = {
      mode: "payment",
      line_items: stripePreview,
      customer_email: form.email,
      metadata: {
        order_id: orderId,
        fulfillment: "placeholder",
      },
    };
    const session = await createCheckoutSessionPlaceholder(req);
    const snapshot = {
      orderId,
      sessionId: session.sessionId,
      email: form.email,
      lines,
      totalCents: subtotalCents,
      createdAt: new Date().toISOString(),
      shipping: {
        fullName: form.fullName,
        address1: form.address1,
        address2: form.address2,
        city: form.city,
        region: form.region,
        postal: form.postal,
        country: form.country,
      },
    };
    sessionStorage.setItem(ORDER_SESSION_KEY, JSON.stringify(snapshot));
    clear();
    setSubmitting(false);
    navigate(`/thank-you?order=${encodeURIComponent(orderId)}`);
  };

  return (
    <div className="checkout-page">
      <h1>Guest checkout</h1>
      <p className="muted">No account required. Stripe will be connected later — card fields are disabled placeholders.</p>

      <ol className="stepper" aria-label="Checkout progress">
        {["Contact", "Shipping", "Payment", "Review"].map((label, i) => (
          <li key={label} className={`stepper-item ${step === i ? "is-active" : ""} ${step > i ? "is-done" : ""}`}>
            <span className="stepper-index">{i + 1}</span>
            {label}
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <section className="checkout-panel">
          <h2>Contact</h2>
          <label className="field">
            <span className="field-label">Email</span>
            <input
              className="input"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </label>
          <p className="muted small">Receipt and fulfillment updates will go here once Stripe + email are wired.</p>
          <div className="checkout-actions">
            <Link className="btn btn-ghost" to="/cart">
              Back to cart
            </Link>
            <button type="button" className="btn btn-primary" disabled={!canStep0} onClick={goNext}>
              Continue
            </button>
          </div>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="checkout-panel">
          <h2>Shipping / fulfillment</h2>
          <p className="muted small">
            Placeholder address fields for a classic checkout shape. For NFT-only flows you can swap
            this block for wallet / email delivery later.
          </p>
          <label className="field">
            <span className="field-label">Full name</span>
            <input
              className="input"
              autoComplete="name"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            />
          </label>
          <label className="field">
            <span className="field-label">Address line 1</span>
            <input
              className="input"
              autoComplete="address-line1"
              value={form.address1}
              onChange={(e) => setForm((f) => ({ ...f, address1: e.target.value }))}
            />
          </label>
          <label className="field">
            <span className="field-label">Address line 2 (optional)</span>
            <input
              className="input"
              autoComplete="address-line2"
              value={form.address2}
              onChange={(e) => setForm((f) => ({ ...f, address2: e.target.value }))}
            />
          </label>
          <div className="field-row">
            <label className="field">
              <span className="field-label">City</span>
              <input
                className="input"
                autoComplete="address-level2"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              />
            </label>
            <label className="field">
              <span className="field-label">State / region</span>
              <input
                className="input"
                autoComplete="address-level1"
                value={form.region}
                onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
              />
            </label>
          </div>
          <div className="field-row">
            <label className="field">
              <span className="field-label">Postal code</span>
              <input
                className="input"
                autoComplete="postal-code"
                value={form.postal}
                onChange={(e) => setForm((f) => ({ ...f, postal: e.target.value }))}
              />
            </label>
            <label className="field">
              <span className="field-label">Country</span>
              <input
                className="input"
                autoComplete="country"
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              />
            </label>
          </div>
          <div className="checkout-actions">
            <button type="button" className="btn btn-ghost" onClick={goBack}>
              Back
            </button>
            <button type="button" className="btn btn-primary" disabled={!canStep1} onClick={goNext}>
              Continue
            </button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="checkout-panel">
          <h2>Payment</h2>
          <p className="muted small">
            Stripe Checkout or the Payment Element will mount here. These inputs are visual placeholders
            only.
          </p>
          <label className="field">
            <span className="field-label">Card number</span>
            <input className="input" disabled placeholder="4242 4242 4242 4242" />
          </label>
          <div className="field-row">
            <label className="field">
              <span className="field-label">Expiry</span>
              <input className="input" disabled placeholder="MM / YY" />
            </label>
            <label className="field">
              <span className="field-label">CVC</span>
              <input className="input" disabled placeholder="123" />
            </label>
          </div>
          <div className="checkout-actions">
            <button type="button" className="btn btn-ghost" onClick={goBack}>
              Back
            </button>
            <button type="button" className="btn btn-primary" onClick={goNext}>
              Review order
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="checkout-panel">
          <h2>Review</h2>
          <div className="review-block">
            <h3>Contact</h3>
            <p>{form.email}</p>
          </div>
          <div className="review-block">
            <h3>Ship to</h3>
            <p>
              {form.fullName}
              <br />
              {form.address1}
              {form.address2 ? (
                <>
                  <br />
                  {form.address2}
                </>
              ) : null}
              <br />
              {form.city}, {form.region} {form.postal}
              <br />
              {form.country}
            </p>
          </div>
          <div className="review-block">
            <h3>Items</h3>
            <p className="review-lines">{describeLineItemsForReview(lines)}</p>
            <p className="review-total">
              <strong>Total due (placeholder)</strong> {formatUsd(subtotalCents)}
            </p>
          </div>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.agreeTerms}
              onChange={(e) => setForm((f) => ({ ...f, agreeTerms: e.target.checked }))}
            />
            <span>I agree to placeholder terms — replace with real checkout disclosures before launch.</span>
          </label>
          <div className="checkout-actions">
            <button type="button" className="btn btn-ghost" onClick={goBack}>
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!form.agreeTerms || submitting}
              onClick={() => void placeOrder()}
            >
              {submitting ? "Placing…" : "Place order (demo)"}
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
