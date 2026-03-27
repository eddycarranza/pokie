// src/pages/Home.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import CartSidebar from "../components/CartSidebar";
import { useProducts, useOrders } from "../hooks/useSupabase";
import Logo from "../components/Logo";

const CATS = ["Todos", "Tops", "Pantalones", "Vestidos", "Conjuntos", "Accesorios"];

export default function Home() {
  const { products, loading } = useProducts();
  const [cat, setCat] = useState("Todos");
  const [selected, setSelected] = useState(null);

  const filtered = cat === "Todos" ? products : products.filter(p => p.cat === cat);

  return (
    <>
      <Navbar activecat={cat} onCatChange={setCat} />
      <CartSidebar />

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #fce8f1 0%, #fdf8f4 55%, #f2e8ff 100%)",
        padding: "5rem 2rem", textAlign: "center", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, background: "radial-gradient(circle, #f2a7c355 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ display: "inline-block", background: "var(--pink-light)", color: "var(--pink-dark)", fontSize: "0.78rem", letterSpacing: ".1em", textTransform: "uppercase", padding: "6px 18px", borderRadius: 999, marginBottom: "1.2rem" }}>
          ✦ Nueva colección disponible
        </div>
        <h1 className="serif" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.1, marginBottom: "1rem" }}>
          Moda que <em style={{ color: "var(--pink-dark)" }}>te abraza</em><br />con estilo
        </h1>
        <p style={{ color: "var(--gray)", fontSize: "1.05rem", maxWidth: 460, margin: "0 auto 2rem" }}>
          Ropa femenina con personalidad. Calidad peruana, envíos a todo el país.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn btn-dark" onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}>
            Ver catálogo
          </button>
          <button className="btn btn-outline" onClick={() => { setCat("Vestidos"); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}>
            Vestidos ✦
          </button>
        </div>
      </div>

      {/* Categories pills */}
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
              fontSize: "0.88rem", cursor: "pointer", transition: "all .2s"
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Products grid */}
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
