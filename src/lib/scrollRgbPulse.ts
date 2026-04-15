let idleTimer: ReturnType<typeof setTimeout> | null = null;

/** Shared pulse for WebKit scrollbar “active” width — use from window and nested scrollers. */
export function pulseScrollActivity(): void {
  document.body.classList.add("is-scrolling");
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    document.body.classList.remove("is-scrolling");
    idleTimer = null;
  }, 280);
}
