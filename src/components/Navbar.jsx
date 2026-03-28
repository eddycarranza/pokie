// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Logo from "./Logo";

const CATS = ["Todos", "Tops", "Pantalones", "Vestidos", "Accesorios"];

const IconInstagram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const IconTiktok = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
  </svg>
);

export default function Navbar({ activecat, onCatChange }) {
  const { count, setIsOpen } = useCart();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleCat = (cat) => {
    onCatChange?.(cat);
    setDropOpen(false);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav style={{
      background: "white", borderBottom: "1px solid var(--border)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{
        padding: "0 2rem", display: "flex",
        alignItems: "center", justifyContent: "space-between", height: 62,
        maxWidth: 1300, margin: "0 auto", width: "100%",
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <Logo size={30} />
          <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--dark)", fontFamily: "'Courier New', Courier, monospace" }}>
            PookieCat
          </span>
        </Link>

        {/* Centro: INICIO + PRODUCTOS dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>

          {/* INICIO */}
          <Link to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "0.82rem", fontWeight: 600, letterSpacing: ".08em",
              color: "var(--dark)", textDecoration: "none",
              textTransform: "uppercase", transition: "color .2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--pink-dark)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--dark)"}
          >
            Inicio
          </Link>

          {/* PRODUCTOS dropdown */}
          <div ref={dropRef} style={{ position: "relative" }}>
            <button onClick={() => setDropOpen(p => !p)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "0.82rem", fontWeight: 600, letterSpacing: ".08em",
              color: dropOpen ? "var(--pink-dark)" : "var(--dark)", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 5, padding: 0,
              transition: "color .2s",
            }}>
              Productos
              <span style={{
                display: "inline-block",
                transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform .2s", fontSize: "0.7rem",
              }}>▾</span>
            </button>

            {/* Dropdown menu */}
            {dropOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 12px)", left: "50%",
                transform: "translateX(-50%)",
                background: "white", border: "1px solid var(--border)",
                borderRadius: 12, padding: "8px 0", minWidth: 160,
                boxShadow: "0 8px 30px rgba(0,0,0,.1)",
                zIndex: 200,
              }}>
                {/* Triángulo */}
                <div style={{
                  position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)",
                  width: 12, height: 12, background: "white",
                  border: "1px solid var(--border)", borderBottom: "none", borderRight: "none",
                  rotate: "45deg",
                }} />
                {CATS.map(cat => (
                  <button key={cat} onClick={() => handleCat(cat)} style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "9px 20px", background: "none", border: "none",
                    cursor: "pointer", fontFamily: "'Courier New', Courier, monospace",
                    fontSize: "0.85rem", color: cat === activecat ? "var(--pink-dark)" : "var(--dark)",
                    fontWeight: cat === activecat ? 600 : 400,
                    transition: "background .15s, color .15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--pink-light)"; e.currentTarget.style.color = "var(--pink-dark)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = cat === activecat ? "var(--pink-dark)" : "var(--dark)"; }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Derecha: redes + carrito */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a href="https://www.instagram.com/pookiecat.pe/" target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--dark)", display: "flex", alignItems: "center", padding: 6, borderRadius: "50%", textDecoration: "none", transition: "color .2s, background .2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#c9607f"; e.currentTarget.style.background = "var(--pink-light)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--dark)"; e.currentTarget.style.background = "transparent"; }}
          ><IconInstagram /></a>

          <a href="https://www.tiktok.com/@pookiecat.pe" target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--dark)", display: "flex", alignItems: "center", padding: 6, borderRadius: "50%", textDecoration: "none", transition: "color .2s, background .2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#c9607f"; e.currentTarget.style.background = "var(--pink-light)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--dark)"; e.currentTarget.style.background = "transparent"; }}
          ><IconTiktok /></a>

          <button onClick={() => setIsOpen(true)} style={{
            background: "var(--dark)", color: "white", border: "none",
            padding: "7px 16px", borderRadius: 999, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem",
            fontFamily: "'Courier New', Courier, monospace", fontWeight: 600,
            transition: "background .2s", marginLeft: 4,
          }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--pink-dark)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--dark)"}
          >
            🛍 {count}
          </button>
        </div>
      </div>
    </nav>
  );
}
