import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { pulseScrollActivity } from "./lib/scrollRgbPulse";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ThankYou } from "./pages/ThankYou";

function attachWindowScrollRgb() {
  const onScroll = () => pulseScrollActivity();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", onScroll);
    document.body.classList.remove("is-scrolling");
  };
}

export default function App() {
  useEffect(() => attachWindowScrollRgb(), []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="thank-you" element={<ThankYou />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
