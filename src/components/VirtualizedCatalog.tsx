import { useVirtualizer } from "@tanstack/react-virtual";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import {
  BUFALIEN_TOTAL,
  bufalienImageUrl,
  formatUsd,
  PLACEHOLDER_PRICE_CENTS,
} from "../config/commerce";
import { useCart } from "../context/CartContext";
import { pulseScrollActivity } from "../lib/scrollRgbPulse";

const MIN_COLS = 2;
const MAX_COLS = 8;
const GAP = 12;
const CARD_MIN = 150;
const ROW_HEIGHT = 268;

export type SortOrder = "asc" | "desc";

function columnsForWidth(width: number): number {
  const inner = Math.max(0, width - 24);
  const c = Math.floor((inner + GAP) / (CARD_MIN + GAP));
  return Math.min(MAX_COLS, Math.max(MIN_COLS, c));
}

function idAtIndex(index: number, sort: SortOrder): number {
  return sort === "asc" ? index + 1 : BUFALIEN_TOTAL - index;
}

export type VirtualizedCatalogHandle = {
  scrollToId: (id: number) => void;
};

type Props = {
  sort: SortOrder;
  onOpenDetail: (id: number) => void;
  catalogRef: MutableRefObject<VirtualizedCatalogHandle | null>;
};

export function VirtualizedCatalog({ sort, onOpenDetail, catalogRef }: Props) {
  const { add } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? el.clientWidth;
      setWidth(w);
    });
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => pulseScrollActivity();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const columnCount = useMemo(() => columnsForWidth(width), [width]);
  const rowCount = Math.ceil(BUFALIEN_TOTAL / columnCount);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 6,
  });

  const scrollToId = useCallback(
    (id: number) => {
      if (!Number.isInteger(id) || id < 1 || id > BUFALIEN_TOTAL) return;
      const index = sort === "asc" ? id - 1 : BUFALIEN_TOTAL - id;
      const rowIndex = Math.floor(index / columnCount);
      virtualizer.scrollToIndex(rowIndex, { align: "center" });
    },
    [columnCount, sort, virtualizer],
  );

  useEffect(() => {
    catalogRef.current = { scrollToId };
    return () => {
      catalogRef.current = null;
    };
  }, [catalogRef, scrollToId]);

  const items = virtualizer.getVirtualItems();

  return (
    <div ref={scrollRef} className="catalog-scroll">
      <div
        className="catalog-inner"
        style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}
      >
        {items.map((row) => {
          const rowIndex = row.index;
          const top = row.start;
          return (
            <div
              key={row.key}
              className="catalog-row"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${top}px)`,
              }}
            >
              {Array.from({ length: columnCount }, (_, col) => {
                const flatIndex = rowIndex * columnCount + col;
                if (flatIndex >= BUFALIEN_TOTAL) {
                  return <div key={`empty-${col}`} className="catalog-cell catalog-cell--empty" />;
                }
                const id = idAtIndex(flatIndex, sort);
                return (
                  <div key={id} className="catalog-cell">
                    <article className="product-card">
                      <button
                        type="button"
                        className="product-thumb"
                        onClick={() => onOpenDetail(id)}
                        aria-label={`View Bufalien ${id}`}
                      >
                        <img
                          src={bufalienImageUrl(id)}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          width={160}
                          height={160}
                        />
                      </button>
                      <div className="product-meta">
                        <span className="product-id">#{id}</span>
                        <span className="product-price">{formatUsd(PLACEHOLDER_PRICE_CENTS)}</span>
                      </div>
                      <div className="product-actions">
                        <button type="button" className="btn btn-small" onClick={() => add(id, 1)}>
                          Add
                        </button>
                        <button
                          type="button"
                          className="btn btn-small btn-ghost"
                          onClick={() => onOpenDetail(id)}
                        >
                          View
                        </button>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
