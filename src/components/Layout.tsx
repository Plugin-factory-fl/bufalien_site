import { NavLink, Outlet } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function Layout() {
  const { itemCount } = useCart();

  return (
    <div className="layout">
      <header className="site-header">
        <NavLink to="/" className="brand" end>
          Bufaliens
        </NavLink>
        <nav className="site-nav">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            end
          >
            Home
          </NavLink>
          <NavLink to="/shop" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            Shop
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) => `nav-link nav-cart${isActive ? " active" : ""}`}
          >
            Cart
            {itemCount > 0 ? <span className="cart-badge">{itemCount}</span> : null}
          </NavLink>
        </nav>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>Bufalien civilization outreach · Payments powered by Stripe (coming soon)</p>
      </footer>
    </div>
  );
}
