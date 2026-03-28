// src/pages/Home.jsx
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import CartSidebar from "../components/CartSidebar";
import { useProducts } from "../hooks/useSupabase";
import Logo from "../components/Logo";

const CATS = ["Todos", "Tops", "Pantalones", "Faldas", "Accesorios"];


// ============ HERO BANNER ============
const SLIDES = [
  {
    bg: "#1a1a1a",
    tag: "✦ Nueva colección",
    title: "Moda porque estamos en tendencia",
    sub: "con estilo",
    cta: "Ver colección",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80",
    accent: "#f2a7c3",
    light: true,
  },
  {
    bg: "#f5f0eb",
    tag: "✦ Tops & Vestidos",
    title: "Ropa femenina",
    sub: "con personalidad",
    cta: "Ver catálogo",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=80",
    accent: "#c9607f",
    light: false,
  },
  {
    bg: "#1a1a1a",
    tag: "✦ Envíos a todo el Perú",
    title: "Calidad peruana",
    sub: "al mejor precio",
    cta: "Comprar ahora",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80",
    accent: "#f2a7c3",
    light: true,
  },
];

function HeroBanner({ onShop }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(p => (p + 1) % SLIDES.length);
        setAnimating(false);
      }, 400);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const goTo = (i) => {
    if (i === current) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(i); setAnimating(false); }, 400);
  };

  const slide = SLIDES[current];

  return (
    <div style={{
      position: "relative", width: "100%", height: "94vh", minHeight: 560,
      background: slide.bg, overflow: "hidden",
      display: "flex", alignItems: "flex-end",
    }}>
      {/* Imagen de fondo */}
      {slide.img && (
        <img src={slide.img} alt="" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center top",
          opacity: animating ? 0 : 1,
          transition: "opacity .5s ease",
        }} />
      )}

      {/* Overlay gradiente bottom */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)",
      }} />

      {/* Contenido abajo izquierda */}
      <div style={{
        position: "relative", zIndex: 2,
        padding: "0 4rem 4rem",
        opacity: animating ? 0 : 1,
        transform: animating ? "translateY(20px)" : "translateY(0)",
        transition: "opacity .45s ease, transform .45s ease",
        maxWidth: 680,
      }}>
        <div style={{
          display: "inline-block",
          color: slide.accent, fontSize: "0.72rem",
          letterSpacing: ".15em", textTransform: "uppercase",
          marginBottom: "1rem",
          fontFamily: "'Courier New', Courier, monospace",
          borderBottom: `1px solid ${slide.accent}`,
          paddingBottom: 4,
        }}>
          {slide.tag}
        </div>

        <h1 style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "clamp(2.6rem, 5.5vw, 4.8rem)",
          fontWeight: 700, lineHeight: 1.0,
          color: "white", marginBottom: "0.3rem",
          textShadow: "0 2px 20px rgba(0,0,0,0.3)",
        }}>
          {slide.title}
        </h1>
        <h2 style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
          fontWeight: 400, lineHeight: 1.1,
          color: slide.accent, marginBottom: "2rem",
          fontStyle: "italic",
        }}>
          {slide.sub}
        </h2>

        <button onClick={onShop} style={{
          background: "white", color: "#1a1a1a", border: "none",
          padding: "13px 30px", borderRadius: 999, cursor: "pointer",
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "0.88rem", letterSpacing: ".05em", fontWeight: 600,
          transition: "all .2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = slide.accent; e.currentTarget.style.color = "white"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#1a1a1a"; }}
        >
          {slide.cta} →
        </button>
      </div>

      {/* Dots abajo derecha */}
      <div style={{
        position: "absolute", bottom: "2.2rem", right: "3rem",
        display: "flex", gap: 8, zIndex: 3, alignItems: "center",
      }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === current ? 28 : 8, height: 8,
            borderRadius: 999, border: "none", cursor: "pointer",
            background: i === current ? "white" : "rgba(255,255,255,0.4)",
            transition: "all .35s ease", padding: 0,
          }} />
        ))}
      </div>

      {/* Número del slide */}
      <div style={{
        position: "absolute", right: "3rem", top: "50%", transform: "translateY(-50%)",
        color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", letterSpacing: ".1em",
        fontFamily: "'Courier New', Courier, monospace", zIndex: 3,
        writingMode: "vertical-rl",
      }}>
        {String(current + 1).padStart(2,"0")} / {String(SLIDES.length).padStart(2,"0")}
      </div>
    </div>
  );
}
// =====================================

export default function Home() {
  const { products, loading } = useProducts();
  const [cat, setCat] = useState("Todos");
  const [selected, setSelected] = useState(null);

  const filtered = cat === "Todos" ? products : products.filter(p => p.cat === cat);

  return (
    <>
      <Navbar activecat={cat} onCatChange={setCat} />
      <CartSidebar />

      {/* Hero Carrusel */}
      <HeroBanner onShop={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })} />

      {/* Catálogo */}
      <div id="catalog" style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 2rem 0" }}>
        <h2 className="serif" style={{ fontSize: "1.8rem", marginBottom: 4 }}>Catálogo</h2>
        <p style={{ color: "var(--gray)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
          {cat === "Todos" ? "Todos los productos" : cat} — {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "2rem" }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: "8px 20px", borderRadius: 999,
              border: `1px solid ${c === cat ? "var(--dark)" : "var(--border)"}`,
              background: c === cat ? "var(--dark)" : "white",
              color: c === cat ? "white" : "var(--dark)",
              fontSize: "0.88rem", cursor: "pointer", transition: "all .2s",
              fontFamily: "'Courier New', Courier, monospace"
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Grid productos */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem 3rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--gray)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🐱</div>
            Cargando productos...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--gray)" }}>
            <p>No hay productos en esta categoría aún.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "1.5rem" }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} onClick={setSelected} />)}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: "var(--dark)", color: "white", textAlign: "center", padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 6 }}>
          <Logo size={28} />
          <span className="serif" style={{ fontSize: "1.2rem" }}>PookieCat</span>
        </div>
        <p style={{ fontSize: "0.8rem", opacity: 0.5 }}>
          Envíos a todo el Perú · WhatsApp: 948761303 · pookiecat.pe
        </p>
      </footer>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
