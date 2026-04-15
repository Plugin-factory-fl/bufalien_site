/** Single placeholder price until real pricing is wired. */
export const PLACEHOLDER_PRICE_CENTS = 4200;

/** Must match PNG files in `public/bufaliens` / `assets/bufaliens` (currently `1.png` … `{n}.png`). */
export const BUFALIEN_TOTAL = 499;

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function bufalienImageUrl(id: number): string {
  return `${import.meta.env.BASE_URL}bufaliens/${id}.png`;
}

/** Static marketing image from `public/site` (symlinked to `assets/site`). */
export function siteHeroImageUrl(): string {
  return `${import.meta.env.BASE_URL}site/hero.png`;
}
