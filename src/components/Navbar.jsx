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
      {/* 1. Logo y Nombre */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <Logo size={36} />
        <span className="serif" style={{ fontSize: "1.35rem", color: "var(--dark)" }}>PookieCat</span>
      </Link>

      {/* 2. Categorías (Centro) */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }} className="hide-mobile">
        {CATS.map(c => (
          <button key={c} onClick={() => onCatChange?.(c)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "0.88rem", fontWeight: c === activecat ? 500 : 400,
            color: c === activecat ? "var(--dark)" : "var(--gray)",
            borderBottom: c === activecat ? "2px solid var(--pink-dark)" : "2px solid transparent",
            paddingBottom: 2, transition: "all .2s", fontFamily: "'Courier New', Courier, monospace"
          }}>{c}</button>
        ))}
      </div>

      {/* 3. Iconos Sociales y Carrito (Derecha) */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        
        {/* Instagram */}
        <a href="https://www.instagram.com/pookiecat.pe/" target="_blank" rel="noreferrer" 
          style={{ color: "var(--dark)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", opacity: 0.6, transition: "opacity 0.2s" }} 
          onMouseEnter={e => e.currentTarget.style.opacity = 1} 
          onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
          title="Síguenos en Instagram"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span style={{ fontSize: "0.85rem", fontWeight: 500, fontFamily: "'Courier New', Courier, monospace" }} className="hide-mobile">
            ig: pookiecat.pe
          </span>
        </a>
        
        {/* TikTok */}
        <a href="https://www.tiktok.com/@pookiecat.pe?lang=es-419" target="_blank" rel="noreferrer" 
          style={{ color: "var(--dark)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", opacity: 0.6, transition: "opacity 0.2s" }} 
          onMouseEnter={e => e.currentTarget.style.opacity = 1} 
          onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
          title="Síguenos en TikTok"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
          </svg>
          <span style={{ fontSize: "0.85rem", fontWeight: 500, fontFamily: "'Courier New', Courier, monospace" }} className="hide-mobile">
            tiktok: pookiecat.pe
          </span>
        </a>

        {/* Botón del Carrito */}
        <button onClick={() => setIsOpen(true)} style={{
          background: "var(--dark)", color: "white", border: "none",
          padding: "8px 20px", borderRadius: 999, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem",
          transition: "background .2s", fontFamily: "'Courier New', Courier, monospace"
        }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--pink-dark)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--dark)"}
        >
          🛍 <span style={{ fontWeight: 600 }}>{count}</span>
        </button>
      </div>
    </nav>
  );
}