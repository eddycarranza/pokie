// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Logo from "./Logo";

const CATS = ["Todos", "Tops", "Pantalones", "Vestidos", "Accesorios"];

// Iconos SVG simples
const IconInstagram = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
);
const IconTiktok = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>
);
const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);
const IconClose = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

export default function Navbar({ activecat, onCatChange }) {
  const { count, setIsOpen } = useCart();
  const [dropOpen, setDropOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // Threshold más alto para tabletas
  const dropRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cerrar menú móvil si se redimensiona a escritorio
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

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
    setMenuOpen(false);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  // ESTILOS COMUNES
  const linkBaseStyle = {
    fontFamily: "'Courier New', Courier, monospace", fontSize: "0.8rem",
    fontWeight: 600, letterSpacing: ".1em", color: "var(--dark)",
    textDecoration: "none", textTransform: "uppercase", transition: "color .2s",
    padding: "0 10px", height: "100%", display: "flex", alignItems: "center"
  };

  const menuButtonStyle = {
    background: "none", border: "none", cursor: "pointer", color: "var(--dark)",
    padding: 10, display: "flex", alignItems: "center", justifyContent: "center"
  };

  return (
    <nav style={{ background: "white", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 1000 }}>
      {/* CONTENEDOR PRINCIPAL */}
      <div style={{
        padding: isMobile ? "0 0.5rem" : "0 1.5rem",
        display: "flex", alignItems: "center",
        height: isMobile ? 64 : 80, // Un poco más alto para escritorio, estándar para móvil
        maxWidth: 1440, margin: "0 auto",
        position: "relative"
      }}>
        
        {/* ========================================================
           VERSION MÓVIL/TABLET ()
           ======================================================== */}
        {isMobile ? (
          <>
            {/* 1. IZQUIERDA: Menú Hamburguesa */}
            <div style={{ flex: '0 0 60px', display: 'flex', justifyContent: 'flex-start' }}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={menuButtonStyle} aria-label="Menú">
                {menuOpen ? <IconClose /> : <IconMenu />}
              </button>
            </div>

            {/* 2. CENTRO: Logo y Nombre */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Link to="/" onClick={() => window.scrollTo(0,0)} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                <Logo size={28} />
                <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--dark)", fontFamily: "'Courier New', Courier, monospace" }}>
                  PookieCat
                </span>
              </Link>
            </div>

            {/* 3. DERECHA: Carrito */}
            <div style={{ flex: '0 0 60px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setIsOpen(true)} style={menuButtonStyle} aria-label="Carrito">
                <div style={{ position: 'relative' }}>
                  🛍️
                  {count > 0 && (
                    <span style={{
                      position: 'absolute', top: -10, right: -12,
                      background: 'var(--pink-dark)', color: 'white',
                      fontSize: '0.65rem', fontWeight: 700,
                      width: 18, height: 18, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {count}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </>
        ) : (
          /* ========================================================
             VERSION ESCRITORIO (Antigua, optimizada para 3 columnas)
             ======================================================== */
          <>
            {/* COL 1: Enlaces */}
            <div style={{ flex: 1, display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 10, height: "100%" }}>
              <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={linkBaseStyle}
                onMouseEnter={e => e.currentTarget.style.color = "var(--pink-dark)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--dark)"}>
                Inicio
              </Link>
              
              <div ref={dropRef} style={{ position: "relative", height: "100%" }}>
                <button onClick={() => setDropOpen(p => !p)} style={{
                  ...linkBaseStyle, background: "none", border: "none", cursor: "pointer",
                  color: dropOpen ? "var(--pink-dark)" : "var(--dark)",
                  padding: "0 10px", gap: 6, width: "auto"
                }}>
                  Productos
                  <span style={{ fontSize: "0.7rem", transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}>▾</span>
                </button>
                {dropOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% - 15px)", left: "0",
                    background: "white", border: "1px solid var(--border)", borderRadius: 12,
                    padding: "10px 0", minWidth: 200, boxShadow: "0 10px 40px rgba(0,0,0,.1)", zIndex: 1100,
                  }}>
                    {CATS.map(cat => (
                      <button key={cat} onClick={() => handleCat(cat)} style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "11px 20px", background: "none", border: "none", cursor: "pointer",
                        fontFamily: "'Courier New', Courier, monospace", fontSize: "0.85rem",
                        color: cat === activecat ? "var(--pink-dark)" : "var(--dark)",
                        fontWeight: cat === activecat ? 600 : 400, transition: "background .15s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--pink-light)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
                      >{cat}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* COL 2: Logo */}
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <Link to="/" onClick={() => window.scrollTo(0,0)} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                <Logo size={36} />
                <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--dark)", fontFamily: "'Courier New', Courier, monospace", letterSpacing: '-0.5px' }}>
                  PookieCat
                </span>
              </Link>
            </div>

            {/* COL 3: Redes y Carrito */}
            <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
              <a href="https://www.instagram.com/pookiecat.pe/" target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--dark)", padding: 10, borderRadius: "50%", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#c9607f"; e.currentTarget.style.background = "#fdf0f4"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--dark)"; e.currentTarget.style.background = "none"; }}
              ><IconInstagram /></a>
              <a href="https://www.tiktok.com/@pookiecat.pe" target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--dark)", padding: 10, borderRadius: "50%", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#c9607f"; e.currentTarget.style.background = "#fdf0f4"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--dark)"; e.currentTarget.style.background = "none"; }}
              ><IconTiktok /></a>
              <button onClick={() => setIsOpen(true)} style={{
                background: "var(--dark)", color: "white", border: "none",
                padding: "10px 20px", borderRadius: 999, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem",
                fontFamily: "'Courier New', Courier, monospace", fontWeight: 600,
                transition: "all .2s", marginLeft: 10
              }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--pink-dark)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--dark)"}
              >🛍️ <span style={{opacity: 0.7}}>Carrito:</span> {count}</button>
            </div>
          </>
        )}
      </div>

      {/* ========================================================
         MÓVIL: Panel del Menú Desplegable
         ======================================================== */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'absolute', top: 64, left: 0, width: '100%',
          height: 'calc(100vh - 64px)', background: 'white',
          borderTop: "1px solid var(--border)",
          overflowY: 'auto', zIndex: 999, display: 'flex', flexDirection: 'column'
        }}>
          {/* 1. Enlaces Principales */}
          <div style={{ padding: "1rem 0" }}>
            <button onClick={() => { window.scrollTo(0,0); setMenuOpen(false); }} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "16px 2rem", background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Courier New', Courier, monospace", fontSize: "1rem", fontWeight: 600,
              color: "var(--dark)", textTransform: "uppercase", letterSpacing: ".1em",
            }}>Inicio</button>
          </div>

          {/* 2. Categorías de Productos */}
          <div style={{ padding: "0 2rem 2rem", flex: 1 }}>
            <div style={{ fontSize: "0.75rem", color: "var(--gray)", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 16, fontWeight: 700 }}>Categorías</div>
            <div style={{ display: "flex", flexDirection: 'column', gap: 10 }}>
              {CATS.map(cat => (
                <button key={cat} onClick={() => handleCat(cat)} style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: "14px 20px", borderRadius: 12, cursor: "pointer",
                  border: `1px solid ${cat === activecat ? "var(--dark)" : "var(--border)"}`,
                  background: cat === activecat ? "var(--dark)" : "white",
                  color: cat === activecat ? "white" : "var(--dark)",
                  fontFamily: "'Courier New', Courier, monospace", fontSize: "0.85rem",
                }}>{cat}</button>
              ))}
            </div>
          </div>

          {/* 3. Footer del Menú (Redes Sociales — para mantener la barra principal limpia como HM/Mascota) */}
          <div style={{
            padding: '1.5rem 2rem', borderTop: '1px solid var(--border)',
            background: '#fafafa', display: 'flex', justifyContent: 'center', gap: '2rem'
          }}>
             <a href="https://www.instagram.com/pookiecat.pe/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--dark)", opacity: 0.7 }}><IconInstagram /></a>
             <a href="https://www.tiktok.com/@pookiecat.pe" target="_blank" rel="noopener noreferrer" style={{ color: "var(--dark)", opacity: 0.7 }}><IconTiktok /></a>
          </div>
        </div>
      )}
    </nav>
  );
}