import { useRef, useState } from "react";
import {
  VirtualizedCatalog,
  type SortOrder,
  type VirtualizedCatalogHandle,
} from "../components/VirtualizedCatalog";
import { BUFALIEN_TOTAL, bufalienImageUrl, formatUsd, PLACEHOLDER_PRICE_CENTS } from "../config/commerce";
import { useCart } from "../context/CartContext";

export function Shop() {
  const { add } = useCart();
  const catalogRef = useRef<VirtualizedCatalogHandle | null>(null);
  const [sort, setSort] = useState<SortOrder>("asc");
  const [goToInput, setGoToInput] = useState("");
  const [detailId, setDetailId] = useState<number | null>(null);

  const jumpToId = () => {
    const n = Number.parseInt(goToInput, 10);
    if (!Number.isFinite(n)) return;
    const id = Math.min(BUFALIEN_TOTAL, Math.max(1, Math.floor(n)));
    catalogRef.current?.scrollToId(id);
    setGoToInput(String(id));
  };

  const randomSpotlight = () => {
    const id = 1 + Math.floor(Math.random() * BUFALIEN_TOTAL);
    catalogRef.current?.scrollToId(id);
    setDetailId(id);
  };

  return (
    <div className="shop">
      <header className="shop-toolbar">
        <div className="shop-toolbar-row">
          <h1 className="shop-title">Catalogue · {BUFALIEN_TOTAL.toLocaleString()} Bufaliens</h1>
          <p className="shop-sub">
            Virtualized grid for smooth scrolling. Each citizen is a unique PNG on disk.
          </p>
        </div>
        <div className="shop-controls">
          <label className="field-inline">
            <span className="field-label">Sort</span>
            <select
              className="input"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOrder)}
              aria-label="Sort by token id"
            >
              <option value="asc">ID ascending</option>
              <option value="desc">ID descending</option>
            </select>
          </label>
          <div className="field-inline field-grow">
            <span className="field-label">Go to ID</span>
            <input
              className="input"
              inputMode="numeric"
              placeholder={`1–${BUFALIEN_TOTAL.toLocaleString()}`}
              value={goToInput}
              onChange={(e) => setGoToInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && jumpToId()}
              aria-label="Bufalien id to scroll to"
            />
            <button type="button" className="btn btn-secondary" onClick={jumpToId}>
              Jump
            </button>
          </div>
          <button type="button" className="btn btn-ghost" onClick={randomSpotlight}>
            Random spotlight
          </button>
        </div>
      </header>

      <VirtualizedCatalog
        key={sort}
        sort={sort}
        onOpenDetail={setDetailId}
        catalogRef={catalogRef}
      />

      {detailId !== null ? (
        <dialog className="modal" open aria-modal>
          <div className="modal-backdrop" onClick={() => setDetailId(null)} aria-hidden />
          <div className="modal-panel" role="document">
            <button type="button" className="modal-close" onClick={() => setDetailId(null)}>
              Close
            </button>
            <div className="modal-body">
              <img
                className="modal-img"
                src={bufalienImageUrl(detailId)}
                alt={`Bufalien ${detailId}`}
                width={480}
                height={480}
              />
              <div className="modal-side">
                <h2 className="modal-title">Bufalien #{detailId}</h2>
                <p className="modal-price">{formatUsd(PLACEHOLDER_PRICE_CENTS)}</p>
                <p className="modal-copy">
                  Guest checkout — no accounts. Stripe will process payment when connected.
                </p>
                <div className="modal-actions">
                  <button type="button" className="btn btn-primary" onClick={() => add(detailId, 1)}>
                    Add to cart
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setDetailId(null)}>
                    Keep browsing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </dialog>
      ) : null}
    </div>
  );
}
