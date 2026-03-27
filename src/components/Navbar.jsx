// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Logo from "./Logo";

const CATS = ["Todos", "Tops", "Pantalones", "Vestidos", "Accesorios"];

export default function Navbar({ activecat, onCatChange }) {
  const { count, setIsOpen } = useCart();

  return (
    <nav style={{
      background: "white", borderBottom: "1px solid var(--border)",
      padding: "0 2rem", position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between", height: 64
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <Logo size={36} />
        <span className="serif" style={{ fontSize: "1.35rem", color: "var(--dark)" }}>PookieCat</span>
      </Link>

      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }} className="hide-mobile">
        {CATS.map(c => (
          <button key={c} onClick={() => onCatChange?.(c)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "0.88rem", fontWeight: c === activecat ? 500 : 400,
            color: c === activecat ? "var(--dark)" : "var(--gray)",
            borderBottom: c === activecat ? "2px solid var(--pink-dark)" : "2px solid transparent",
            paddingBottom: 2, transition: "all .2s", fontFamily: "'DM Sans', sans-serif"
          }}>{c}</button>
        ))}
      </div>

      <button onClick={() => setIsOpen(true)} style={{
        background: "var(--dark)", color: "white", border: "none",
        padding: "8px 20px", borderRadius: 999, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem",
        transition: "background .2s", fontFamily: "'DM Sans', sans-serif"
      }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--pink-dark)"}
        onMouseLeave={e => e.currentTarget.style.background = "var(--dark)"}
      >
        🛍 <span style={{ fontWeight: 600 }}>{count}</span>
      </button>
    </nav>
  );
}
