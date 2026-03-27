// src/components/ProductModal.jsx
import { useState } from "react";
import { useCart } from "../context/CartContext";

const COLOR_MAP = {
  Rosa: "#f2a7c3", Blanco: "#f5f5f5", Negro: "#1a1a1a", Beige: "#d4c5a9",
  Lila: "#c9b1e8", Verde: "#a8d5a2", "Azul denim": "#7eb0d4", Rojo: "#e05252",
  Nude: "#e8c9b0", Celeste: "#a8d8ea", Mostaza: "#e8b84b", Naranja: "#f0a060"
};

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  if (!product) return null;

  const handleAdd = () => {
    if (product.sizes?.length && !size) { setError("Selecciona una talla"); return; }
    addToCart(product, qty, size, color);
    onClose();
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()} style={{ zIndex: 300 }}>
      <div style={{
        background: "white", borderRadius: 20, maxWidth: 780, width: "100%",
        maxHeight: "90vh", overflow: "auto",
        display: "grid", gridTemplateColumns: "1fr 1fr"
      }}>
        {/* Image */}
        <div style={{
          background: "var(--pink-light)", borderRadius: "20px 0 0 20px",
          minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "7rem", position: "relative"
        }}>
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px 0 0 20px" }} />
            : product.emoji || "👗"}
          <button onClick={onClose} style={{
            position: "absolute", top: 12, right: 12,
            background: "white", border: "none", width: 34, height: 34,
            borderRadius: "50%", cursor: "pointer", fontSize: "1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,.15)", display: "flex", alignItems: "center", justifyContent: "center"
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          {product.badge && (
            <span className={`badge-${product.badge}`} style={{ display: "inline-block", padding: "4px 12px", borderRadius: 999, fontSize: "0.75rem", width: "fit-content" }}>
              {product.badge === "new" ? "Nuevo" : "Oferta"}
            </span>
          )}
          <div>
            <h2 className="serif" style={{ fontSize: "1.6rem" }}>{product.name}</h2>
            <div style={{ fontSize: "1.3rem", fontWeight: 500, marginTop: 6 }}>
              {product.salePrice ? (
                <>
                  <span style={{ textDecoration: "line-through", color: "var(--gray)", fontSize: "0.95rem", marginRight: 8 }}>S/ {product.price?.toFixed(2)}</span>
                  <span style={{ color: "var(--danger)" }}>S/ {product.salePrice.toFixed(2)}</span>
                </>
              ) : `S/ ${(product.salePrice || product.price)?.toFixed(2)}`}
            </div>
          </div>

          <div style={{ color: "var(--gray)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            {(product.description || product.desc || "Producto de calidad PookieCat.").split("\n").map((line, idx) =>
              line.trim() === ""
                ? <br key={idx} />
                : <span key={idx} style={{ display: "block", marginBottom: 4 }}>{line}</span>
            )}
          </div>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--gray)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".05em" }}>Talla</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => { setSize(s); setError(""); }} style={{
                    padding: "8px 16px", border: `1.5px solid ${size === s ? "var(--dark)" : "var(--border)"}`,
                    borderRadius: 8, cursor: "pointer", background: size === s ? "var(--dark)" : "white",
                    color: size === s ? "white" : "var(--dark)", transition: "all .15s", fontSize: "0.88rem"
                  }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--gray)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".05em" }}>Color {color && `— ${color}`}</div>
              <div style={{ display: "flex", gap: 8 }}>
                {product.colors.map(c => (
                  <div key={c} onClick={() => setColor(c)} title={c} style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: COLOR_MAP[c] || "#888",
                    border: `3px solid ${color === c ? "var(--dark)" : "transparent"}`,
                    cursor: "pointer", transition: "border-color .15s",
                    outline: `2px solid ${COLOR_MAP[c] || "#888"}`, outlineOffset: 1
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--gray)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".05em" }}>Cantidad</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--border)", background: "none", cursor: "pointer", fontSize: "1.1rem" }}>−</button>
              <span style={{ fontSize: "1rem", fontWeight: 500, minWidth: 20, textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--border)", background: "none", cursor: "pointer", fontSize: "1.1rem" }}>+</button>
            </div>
          </div>

          {error && <p style={{ color: "var(--danger)", fontSize: "0.85rem" }}>⚠ {error}</p>}

          <button className="btn btn-dark btn-full" onClick={handleAdd} style={{ marginTop: "auto" }}>
            🛍 Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
