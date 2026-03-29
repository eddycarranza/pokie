// src/components/ProductModal.jsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCart } from "../context/CartContext";

const COLOR_MAP = {
  "Rosa": "#f2a7c3", "Blanco": "#f0f0f0", "Negro": "#1a1a1a",
  "Azul denim": "#7eb0d4", "Marrón": "#8d6748",
  "Pale Pink": "hsl(337, 27%, 83%)", "White": "#f0f0f0",
  "Black": "rgb(34, 34, 34)", "Light Brown": "rgba(65, 47, 37, 0.86)",
};

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handle);
    // Bloquear scroll del body principal
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

  // Componente del botón para reutilizarlo en PC y Móvil
  const AddToCartBtn = () => (
    <button onClick={handleAdd} style={{
      marginTop: isMobile ? 0 : "auto", width: "100%",
      background: "var(--dark)", color: "white", border: "none",
      padding: "16px", borderRadius: 999, cursor: "pointer",
      fontSize: "0.95rem", fontFamily: "'Courier New', Courier, monospace",
      fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase",
      transition: "background .2s",
    }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--pink-dark)"}
      onMouseLeave={e => e.currentTarget.style.background = "var(--dark)"}
    >
      🛍 Agregar al carrito
    </button>
  );

  return createPortal(
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,.6)",
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
        height: isMobile ? "92vh" : "auto", 
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
          height: isMobile ? "45vh" : "auto", 
          minHeight: isMobile ? "auto" : 480,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "6rem", position: "relative", flexShrink: 0,
          borderRight: isMobile ? "none" : "1px solid var(--border)",
        }}>
          {product.image_url || product.imageUrl
            ? <img
                src={product.image_url || product.imageUrl}
                alt={product.name}
                // REGRESAMOS A CONTAIN CON PADDING PARA QUE SE VEA COMPLETA
                style={{ width: "100%", height: "100%", objectFit: "contain", padding: isMobile ? "1rem" : "1.5rem" }} 
              />
            : product.emoji || "👗"}
          <button onClick={onClose} style={{
            position: "absolute", top: 12, right: 12,
            background: "white", border: "none", width: 34, height: 34,
            borderRadius: "50%", cursor: "pointer", fontSize: "1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "inherit", zIndex: 10
          }}>✕</button>
        </div>

        {/* ---- CUERPO Y SCROLL ---- */}
        <div style={{
          flex: 1, 
          display: "flex", 
          flexDirection: "column",
          overflow: "hidden" 
        }}>
          
          <div style={{
            flex: 1, overflowY: "auto",
            padding: isMobile ? "1.5rem 1.5rem 2rem" : "2rem",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", minHeight: "100%" }}>

              {/* Nombre + precio */}
              <div>
                {product.badge && (
                  <span style={{
                    display: "inline-block", padding: "4px 12px", borderRadius: 999,
                    fontSize: "0.72rem", fontWeight: 600, width: "fit-content",
                    background: product.badge === "new" ? "var(--dark)" : "var(--danger)",
                    color: "white", marginBottom: 8
                  }}>
                    {product.badge === "new" ? "Nuevo" : "Oferta"}
                  </span>
                )}
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

              {/* Descripción (De vuelta arriba, debajo del precio) */}
              <div style={{
                color: "var(--gray)", fontSize: "0.85rem", lineHeight: 1.6,
                fontFamily: "'Courier New', Courier, monospace",
                paddingBottom: "1rem", borderBottom: "1px solid var(--border)"
              }}>
                {(product.description || product.desc || "Producto de calidad PookieCat.").split("\n").map((line, idx) =>
                  line.trim() === ""
                    ? <br key={idx} />
                    : <span key={idx} style={{ display: "block", marginBottom: 3 }}>{line}</span>
                )}
              </div>

              {/* Colores */}
              {product.colors?.length > 0 && (
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--dark)", marginBottom: 10, fontFamily: "'Courier New', Courier, monospace" }}>
                    Color: <span style={{color: "var(--gray)", fontWeight: 400}}>{color || "Selecciona un color"}</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {product.colors.map(c => (
                      <div key={c} onClick={() => setColor(c)} title={c} style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: COLOR_MAP[c] || "#888",
                        cursor: "pointer", transition: "all .15s",
                        border: `1px solid ${COLOR_MAP[c] === "#f0f0f0" || COLOR_MAP[c] === "#ffffff" ? "#ddd" : "transparent"}`,
                        outline: `2px solid ${color === c ? "var(--dark)" : "transparent"}`,
                        outlineOffset: 2,
                      }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Tallas */}
              {product.sizes?.length > 0 && (
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--dark)", marginBottom: 10, fontFamily: "'Courier New', Courier, monospace" }}>
                    Talla: <span style={{color: "var(--gray)", fontWeight: 400}}>{size || "Selecciona una talla"}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {product.sizes.map(s => (
                      <button key={s} onClick={() => { setSize(s); setError(""); }} style={{
                        padding: "10px 16px", minWidth: "3.5rem",
                        border: `1px solid ${size === s ? "var(--dark)" : "var(--border)"}`,
                        borderRadius: 4, cursor: "pointer",
                        background: size === s ? "var(--dark)" : "white",
                        color: size === s ? "white" : "var(--dark)",
                        transition: "all .15s", fontSize: "0.9rem",
                        fontFamily: "'Courier New', Courier, monospace",
                      }}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cantidad */}
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--dark)", marginBottom: 10, fontFamily: "'Courier New', Courier, monospace" }}>
                  Cantidad:
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
                    width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--border)",
                    background: "none", cursor: "pointer", fontSize: "1.2rem", fontFamily: "inherit",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>−</button>
                  <span style={{ fontSize: "1.1rem", fontWeight: 600, minWidth: 20, textAlign: "center" }}>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} style={{
                    width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--border)",
                    background: "none", cursor: "pointer", fontSize: "1.2rem", fontFamily: "inherit",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>+</button>
                </div>
              </div>

              {error && <p style={{ color: "var(--danger)", fontSize: "0.85rem", fontWeight: 600 }}>⚠ {error}</p>}
              
              {/* Botón PC (se oculta en móvil porque el móvil usa el footer fijo) */}
              {!isMobile && <div style={{marginTop: "auto", paddingTop: "1rem"}}><AddToCartBtn /></div>}

            </div>
          </div>

          {/* ========================================================
              STICKY FOOTER (Solo para celular)
              ======================================================== */}
          {isMobile && (
            <div style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid var(--border)",
              background: "white",
              paddingBottom: "max(1rem, env(safe-area-inset-bottom))"
            }}>
              <AddToCartBtn />
            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
}