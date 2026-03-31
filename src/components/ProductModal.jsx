// src/components/ProductModal.jsx
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const COLOR_MAP = [
  { name: "Pale Pink", hex: "hsl(337, 27%, 83%)" },
  { name: "White", hex: "#f0f0f0" },
  { name: "Black", hex: "rgb(34, 34, 34)" },
  { name: "Azul denim", hex: "#7eb0d4" },
  { name: "Light Brown", hex: "rgba(65, 47, 37, 0.86)" },
];

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [mainImgIdx, setMainImgIdx] = useState(0); 

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  if (!product) return null; 

  const stock = parseInt(product.stock, 10);
  const isOutOfStock = isNaN(stock) || stock <= 0;
  
  const salePrice = product.salePrice || product.sale_price;
  const normalPrice = product.price || 0;
  const effPrice = salePrice || normalPrice;

  let images = [];
  if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
    images = product.image_urls;
  } else if (product.image_url) {
    images = [product.image_url];
  } else if (product.imageUrl) {
    images = [product.imageUrl];
  }

  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  const colors = Array.isArray(product.colors) ? product.colors : [];

  const handleAdd = () => {
    if (sizes.length > 0 && !selectedSize) return alert("Por favor, selecciona una talla.");
    if (colors.length > 0 && !selectedColor) return alert("Por favor, selecciona un color.");
    addToCart(product, 1, selectedSize, selectedColor);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 900, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: window.innerWidth < 768 ? "column" : "row", position: "relative" }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{ position: "absolute", top: 15, right: 15, background: "rgba(255,255,255,0.9)", color: "var(--dark)", border: "none", width: 36, height: 36, borderRadius: "50%", fontSize: "1.2rem", cursor: "pointer", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          ✕
        </button>

        {/* ================= GALERÍA DE FOTOS ================= */}
        <div style={{ flex: window.innerWidth < 768 ? "0 0 350px" : "1 1 50%", background: "var(--pink-light)", position: "relative", display: "flex", flexDirection: "column" }}>
          
          <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>
            {images.length > 0 ? (
               <img src={images[mainImgIdx]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : product.emoji || "👗"}
            
            {isOutOfStock && (
               <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                 <span style={{ background: "var(--dark)", color: "white", padding: "8px 20px", borderRadius: 999, fontSize: "1.1rem", fontWeight: 600, letterSpacing: 1 }}>AGOTADO</span>
               </div>
            )}
          </div>
          
          {images.length > 1 && (
            <div style={{ display: "flex", gap: 10, padding: 12, background: "white", overflowX: "auto", borderTop: "1px solid var(--border)" }}>
               {images.map((img, i) => (
                 <div key={i} onClick={() => setMainImgIdx(i)} style={{ width: 65, height: 65, borderRadius: 8, overflow: "hidden", cursor: "pointer", flexShrink: 0, border: mainImgIdx === i ? "2px solid var(--dark)" : "1px solid var(--border)", opacity: mainImgIdx === i ? 1 : 0.6, transition: "all .2s" }}>
                   <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* ================= INFORMACIÓN ================= */}
        <div style={{ flex: "1 1 50%", padding: window.innerWidth < 768 ? "1.5rem" : "2.5rem", overflowY: "auto", display: "flex", flexDirection: "column", background: "white" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--gray)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{product.cat}</div>
          <h2 className="serif" style={{ fontSize: "2.2rem", margin: "0 0 0.5rem 0", lineHeight: 1.1 }}>{product.name}</h2>
          
          <div style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem" }}>
            {salePrice ? (
              <>
                <span style={{ textDecoration: "line-through", color: "var(--gray)", fontSize: "1rem", marginRight: 10 }}>S/ {Number(normalPrice).toFixed(2)}</span>
                <span style={{ color: "var(--danger)" }}>S/ {Number(salePrice).toFixed(2)}</span>
              </>
            ) : `S/ ${Number(effPrice).toFixed(2)}`}
          </div>

          <p style={{ color: "var(--gray)", lineHeight: 1.6, marginBottom: "2rem" }}>
            {product.description || "Un diseño exclusivo para resaltar tu estilo único. Cómodo, versátil y perfecto para cualquier ocasión."}
          </p>

          {/* Selector de Tallas */}
          {sizes.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 10 }}>Talla: {selectedSize || <span style={{color: "var(--danger)"}}>(Requerido)</span>}</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} style={{ minWidth: 42, padding: "0 12px", height: 42, borderRadius: 8, border: selectedSize === s ? "2px solid var(--dark)" : "1px solid var(--border)", background: selectedSize === s ? "var(--dark)" : "white", color: selectedSize === s ? "white" : "var(--dark)", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", transition: "all .2s" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de Colores */}
          {colors.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 10 }}>Color: {selectedColor || <span style={{color: "var(--danger)"}}>(Requerido)</span>}</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {colors.map(c => {
                  const colorObj = COLOR_MAP.find(opt => opt.name === c) || { hex: "#ccc" };
                  return (
                    <div key={c} onClick={() => setSelectedColor(c)} style={{ width: 38, height: 38, borderRadius: "50%", background: colorObj.hex, cursor: "pointer", border: selectedColor === c ? "2px solid var(--dark)" : "1px solid var(--border)", boxShadow: selectedColor === c ? "0 0 0 4px white inset" : "none", transition: "all .2s" }} title={c} />
                  )
                })}
              </div>
            </div>
          )}

          <div style={{ marginTop: "auto", paddingTop: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 10, fontWeight: 500 }}>
              <span style={{ color: isOutOfStock ? "var(--danger)" : "var(--success)" }}>
                {isOutOfStock ? "● Producto agotado" : "● En stock"}
              </span>
              {!isOutOfStock && <span style={{ color: "var(--gray)" }}>{stock} unidades disponibles</span>}
            </div>
            
            <button onClick={handleAdd} disabled={isOutOfStock} style={{ width: "100%", padding: "16px", background: isOutOfStock ? "var(--border)" : "var(--dark)", color: isOutOfStock ? "var(--gray)" : "white", border: "none", borderRadius: 12, fontSize: "1.05rem", fontWeight: 600, cursor: isOutOfStock ? "not-allowed" : "pointer", transition: "all .2s" }}>
              {isOutOfStock ? "Agotado" : "Agregar al carrito"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}