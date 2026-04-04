// src/pages/Home.jsx
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import CartSidebar from "../components/CartSidebar";
import { useProducts } from "../hooks/useSupabase";

const CATS = ["Todos", "Tops", "Pantalones", "Faldas", "Accesorios"];

// ============ HERO BANNER ============
const SLIDES = [
  {
    bg: "#1a1a1a",
    tag: "Nueva colección",
    title: "Moda porque estamos en tendencia",
    sub: "con estilo",
    cta: "Ver colección",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80",
    accent: "#f2a7c3",
    light: true,
  },
  {
    bg: "#f5f0eb",
    tag: "Tops & Vestidos",
    title: "Ropa femenina",
    sub: "con personalidad",
    cta: "Ver catálogo",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=80",
    accent: "#c9607f",
    light: false,
  },
  {
    bg: "#1a1a1a",
    tag: "Envíos a todo el Perú",
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
      {slide.img && (
        <img src={slide.img} alt="" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center top",
          opacity: animating ? 0 : 1,
          transition: "opacity .5s ease",
        }} />
      )}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)",
      }} />
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

// ============ BANNER DE PAGOS Y ENVÍOS (CON IMÁGENES ESTÉTICAS) ============
function TrustBanner() {
  const cardStyle = {
    background: "white", padding: "2.5rem 2rem", borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", alignItems: "center"
  };

  const titleStyle = {
    fontSize: "1.05rem", letterSpacing: "1px", textTransform: "uppercase",
    marginBottom: "2rem", color: "var(--dark)", fontWeight: 700, textAlign: "center"
  };

  const imgContainerStyle = {
    display: "flex", justifyContent: "center", gap: "2.5rem", flexWrap: "wrap", alignItems: "center"
  };

  const logoStyle = {
    height: "40px",
    objectFit: "contain",
    filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.05))",
    transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    cursor: "pointer"
  };

  return (
    <div style={{ background: "#fdf8fa", padding: "4.5rem 1rem", borderTop: "1px solid #fce8f0" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem" }}>

        {/* Tarjeta Métodos de Pago */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>Métodos de Pago</h3>
          <div style={imgContainerStyle}>
            {/* Logo Yape */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Yape_text_logo.png"
              alt="Yape"
              style={{ ...logoStyle, height: "35px" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            />
            {/* Logo Plin */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Plin_logo.png/320px-Plin_logo.png"
              alt="Plin"
              style={{ ...logoStyle, height: "42px" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            />
            {/* Ícono Transferencia */}
            <div
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontWeight: 600, color: "#555", fontSize: "0.85rem", cursor: "pointer", transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
              Transferencia
            </div>
          </div>
        </div>

        {/* Tarjeta Métodos de Envío */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>Métodos de Envío</h3>
          <div style={imgContainerStyle}>
            {/* Logo Olva */}
            <img
              src="https://www.olvacourier.com/wp-content/uploads/2021/10/logo-olva.png"
              alt="Olva Courier"
              style={{ ...logoStyle, height: "48px" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
            />
            <div style={{ display: 'none', background: "#FFD100", color: "#002D74", padding: "8px 20px", borderRadius: 8, fontWeight: 900, fontStyle: "italic", fontSize: "1.2rem", cursor: "pointer" }}>OLVA</div>

            {/* Logo Shalom */}
            <img
              src="https://shalom.pe/wp-content/uploads/2021/10/logo-shalom.png"
              alt="Shalom"
              style={{ ...logoStyle, height: "40px" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
            />
            <div style={{ display: 'none', background: "#E3000F", color: "white", padding: "8px 20px", borderRadius: 8, fontWeight: 900, fontStyle: "italic", fontSize: "1.2rem", letterSpacing: "1px", cursor: "pointer" }}>SHALOM</div>
          </div>
        </div>

      </div>
    </div>
  );
}
// =====================================

export default function Home() {
  const { products, loading } = useProducts();
  const [cat, setCat] = useState("Todos");
  const [selected, setSelected] = useState(null);
  const [showWsp, setShowWsp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) { setShowWsp(true); } 
      else { setShowWsp(false); }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const safeProducts = Array.isArray(products) ? products : [];
  const filtered = cat === "Todos" ? safeProducts : safeProducts.filter(p => p.cat === cat);
  
  const bestItems = safeProducts.length > 0 
    ? [...safeProducts].filter(p => p.stock > 0).sort((a, b) => (b.ventas_totales || 0) - (a.ventas_totales || 0)).slice(0, 4) 
    : [];

  const newInItems = safeProducts.length > 0
    ? [...safeProducts].filter(p => p.stock > 0).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 4)
    : [];

  return (
    <>
      <Navbar activecat={cat} onCatChange={setCat} />
      <CartSidebar />

      {/* Hero Carrusel */}
      <HeroBanner onShop={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })} />

      {/* SECCIÓN "BEST ITEMS" */}
      {!loading && bestItems.length > 0 && (
        <div style={{ maxWidth: 1200, margin: "4rem auto 2rem", padding: "0 1rem" }}>
          <h2 className="serif" style={{ fontSize: "2rem", textAlign: "center", marginBottom: "2.5rem", fontWeight: 600 }}>
            Best items
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "2rem 1.5rem" }}>
            {bestItems.map(p => <ProductCard key={p.id} product={p} onClick={setSelected} />)}
          </div>
        </div>
      )}

      {/* SECCIÓN "NEW IN" */}
      {!loading && newInItems.length > 0 && (
        <div style={{ maxWidth: 1200, margin: "4rem auto 2rem", padding: "0 1rem" }}>
          <h2 className="serif" style={{ fontSize: "2rem", textAlign: "center", marginBottom: "2.5rem", fontWeight: 600 }}>
            New in
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "2rem 1.5rem" }}>
            {newInItems.map(p => <ProductCard key={p.id} product={p} onClick={setSelected} />)}
          </div>
        </div>
      )}

      {/* Catálogo Completo */}
      <div id="catalog" style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 1rem 0" }}>
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

      {/* Grid productos del catálogo */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1rem 4rem" }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "2rem 1.5rem" }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} onClick={setSelected} />)}
          </div>
        )}
      </div>

      {/* BANNER DE CONFIANZA (PAGOS Y ENVÍOS REDISEÑADOS CON IMÁGENES) */}
      <TrustBanner />

      {/* Footer */}
      <footer style={{ background: "var(--dark)", color: "white", textAlign: "center", padding: "2rem 1rem" }}>
        <p style={{ fontSize: "0.85rem", opacity: 0.8, fontFamily: "'Courier New', Courier, monospace" }}>
          Envíos a todo el Perú · WhatsApp: 927 112 114 · pookiecat.pe
        </p>
      </footer>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}

      {/* Botón flotante WhatsApp animado */}
      <a
        href="https://wa.me/51927112114?text=Hola!%20Quisiera%20consultar%20sobre%20un%20producto%20"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed", bottom: "2rem", right: "2rem", zIndex: 9000,
          width: 58, height: 58, borderRadius: "50%",
          background: "#25D366", color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          textDecoration: "none", 
          opacity: showWsp ? 1 : 0,
          visibility: showWsp ? "visible" : "hidden",
          transform: showWsp ? "translateY(0) scale(1)" : "translateY(20px) scale(0.8)",
          boxShadow: showWsp ? "0 4px 20px rgba(37,211,102,.45)" : "none",
          transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s",
        }}
        onMouseEnter={e => { 
          if(showWsp) {
            e.currentTarget.style.transform = "translateY(0) scale(1.1)"; 
            e.currentTarget.style.boxShadow = "0 6px 28px rgba(37,211,102,.6)"; 
          }
        }}
        onMouseLeave={e => { 
          if(showWsp) {
            e.currentTarget.style.transform = "translateY(0) scale(1)"; 
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,211,102,.45)"; 
          }
        }}
        title="Consultas por WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
}