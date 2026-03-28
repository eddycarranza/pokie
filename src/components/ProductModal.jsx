// src/components/ProductModal.jsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCart } from "../context/CartContext";

const COLOR_MAP = {
  // Español
  "Rosa": "#f2a7c3",
  "Blanco": "#f0f0f0",
  "Negro": "#1a1a1a",
  "Azul denim": "#7eb0d4",
  "Marrón": "#8d6748",
  // Inglés (los que tienes en el admin)
  "Pale Pink": "hsl(337, 27%, 83%)",
  "White": "#f0f0f0",
  "Black": "rgb(34, 34, 34)",
  "Light Brown": "rgba(65, 47, 37, 0.86)",
};

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handle);
    // Bloquear scroll del body
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("resize", handle);
      document.body.style.overflow = "";
    };
  }, []);

  if (!product) return null;

  const handleAdd = () => {
    if (product.sizes?.length && !size) { setError("Selecciona una talla"); return; }
    addToCart(product, qty, size, color);
    onClose();
  };

  const effPrice = product.sale_price || product.salePrice || product.price;
  const origPrice = product.price;
  const hasDiscount = (product.sale_price || product.salePrice) && effPrice < origPrice;

  return createPortal(
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,.55)",
        display: "flex", alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        padding: isMobile ? 0 : "1rem",
      }}
    >
      <div style={{
        background: "white",
        borderRadius: isMobile ? "20px 20px 0 0" : 20,
        width: "100%",
        maxWidth: isMobile ? "100%" : 780,
        maxHeight: isMobile ? "92vh" : "90vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
      }}>

        {/* ---- IMAGEN ---- */}
        <div style={{
          background: "#fafafa",
          borderRadius: isMobile ? "20px 20px 0 0" : "20px 0 0 20px",
          width: isMobile ? "100%" : "45%",
          height: isMobile ? 280 : "auto",
          minHeight: isMobile ? 280 : 480,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "6rem", position: "relative", flexShrink: 0,
          overflow: "hidden",
          borderRight: isMobile ? "none" : "1px solid var(--border)",
        }}>
          {product.image_url || product.imageUrl
            ? <img
                src={product.image_url || product.imageUrl}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "contain", padding: isMobile ? "0.75rem" : "1.5rem" }}
              />
            : product.emoji || "👗"}
          <button onClick={onClose} style={{
            position: "absolute", top: 12, right: 12,
            background: "white", border: "none", width: 34, height: 34,
            borderRadius: "50%", cursor: "pointer", fontSize: "1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "inherit",
          }}>✕</button>
        </div>

        {/* ---- CUERPO ---- */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: isMobile ? "1.25rem 1.25rem 2rem" : "2rem",
          display: "flex", flexDirection: "column", gap: "1rem",
        }}>

          {/* Badge */}
          {product.badge && (
            <span style={{
              display: "inline-block", padding: "4px 12px", borderRadius: 999,
              fontSize: "0.72rem", fontWeight: 600, width: "fit-content",
              background: product.badge === "new" ? "var(--dark)" : "var(--danger)",
              color: "white",
            }}>
              {product.badge === "new" ? "Nuevo" : "Oferta"}
            </span>
          )}

          {/* Nombre + precio */}
          <div>
            <h2 style={{
              fontSize: isMobile ? "1.3rem" : "1.6rem",
              fontWeight: 700, marginBottom: 6,
              fontFamily: "'Courier New', Courier, monospace",
            }}>{product.name}</h2>
            <div style={{ fontSize: isMobile ? "1.1rem" : "1.25rem", fontWeight: 600 }}>
              {hasDiscount ? (
                <>
                  <span style={{ textDecoration: "line-through", color: "var(--gray)", fontSize: "0.9rem", marginRight: 8 }}>
                    S/ {origPrice?.toFixed(2)}
                  </span>
                  <span style={{ color: "var(--danger)" }}>S/ {effPrice?.toFixed(2)}</span>
                </>
              ) : `S/ ${effPrice?.toFixed(2)}`}
            </div>
          </div>

          {/* Descripción */}
          <div style={{
            color: "#2a2a2a", fontSize: "0.85rem", lineHeight: 1.7,
            fontFamily: "'Courier New', Courier, monospace",
          }}>
            {(product.description || product.desc || "Producto de calidad PookieCat.").split("\n").map((line, idx) =>
              line.trim() === ""
                ? <br key={idx} />
                : <span key={idx} style={{ display: "block", marginBottom: 3 }}>{line}</span>
            )}
          </div>

          {/* Tallas */}
          {product.sizes?.length > 0 && (
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--gray)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em" }}>Talla</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => { setSize(s); setError(""); }} style={{
                    padding: "8px 14px",
                    border: `1.5px solid ${size === s ? "var(--dark)" : "var(--border)"}`,
                    borderRadius: 8, cursor: "pointer",
                    background: size === s ? "var(--dark)" : "white",
                    color: size === s ? "white" : "var(--dark)",
                    transition: "all .15s", fontSize: "0.85rem",
                    fontFamily: "'Courier New', Courier, monospace",
                  }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Colores */}
          {product.colors?.length > 0 && (
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--gray)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em" }}>
                Color {color && `— ${color}`}
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {product.colors.map(c => (
                  <div key={c} onClick={() => setColor(c)} title={c} style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: COLOR_MAP[c] || "#888",
                    border: `3px solid ${color === c ? "var(--dark)" : "transparent"}`,
                    cursor: "pointer", transition: "all .15s",
                    outline: `2px solid ${COLOR_MAP[c] || "#888"}`,
                    outlineOffset: 2,
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--gray)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em" }}>Cantidad</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
                width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border)",
                background: "none", cursor: "pointer", fontSize: "1.1rem", fontFamily: "inherit",
              }}>−</button>
              <span style={{ fontSize: "1rem", fontWeight: 600, minWidth: 20, textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{
                width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border)",
                background: "none", cursor: "pointer", fontSize: "1.1rem", fontFamily: "inherit",
              }}>+</button>
            </div>
          </div>

          {error && <p style={{ color: "var(--danger)", fontSize: "0.82rem" }}>⚠ {error}</p>}

          {/* Botón agregar */}
          <button onClick={handleAdd} style={{
            marginTop: "auto", width: "100%",
            background: "var(--dark)", color: "white", border: "none",
            padding: "14px", borderRadius: 999, cursor: "pointer",
            fontSize: "0.92rem", fontFamily: "'Courier New', Courier, monospace",
            fontWeight: 600, letterSpacing: ".03em",
            transition: "background .2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--pink-dark)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--dark)"}
          >
            🛍 Agregar al carrito
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
