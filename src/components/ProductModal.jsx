// src/components/ProductModal.jsx
import React, { useState, useEffect } from "react";
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

  // Bloquea el scroll del fondo cuando el modal está abierto
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

  // Extraer array de imágenes
  let images = [];
  if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
    images = product.image_urls;
  } else if (product.image_url) {
    images = [product.image_url];
  } else if (product.imageUrl) {
    images = [product.imageUrl];
  }

  // Sanitizar tallas y colores
  const sizes = Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === 'string' ? product.sizes.split(',') : []);
  const colors = Array.isArray(product.colors) ? product.colors : (typeof product.colors === 'string' ? product.colors.split(',') : []);

  const handleAdd = () => {
    if (sizes.length > 0 && !selectedSize) return alert("Por favor, selecciona una talla.");
    if (colors.length > 0 && !selectedColor) return alert("Por favor, selecciona un color.");
    addToCart(product, 1, selectedSize, selectedColor);
    onClose();
  };

  // Estilos comunes para los botones de selección
  const getSelectorOptionStyle = (isSelected, isColor = false, colorHex = '') => ({
    minWidth: isColor ? "40px" : "45px",
    height: isColor ? "40px" : "45px",
    padding: isColor ? "0" : "0 15px",
    borderRadius: isColor ? "50%" : "8px",
    border: isSelected ? "2px solid var(--dark)" : "1px solid var(--border)",
    background: isColor ? colorHex : (isSelected ? "var(--dark)" : "white"),
    color: isColor ? "transparent" : (isSelected ? "white" : "var(--dark)"),
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all .2s",
    boxShadow: (isColor && isSelected) ? "0 0 0 3px white inset" : "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none"
  });

  return (
    <div className="overlay" onClick={onClose} style={{ zIndex: 9999, padding: "1rem" }}>
      <div 
        className="card" 
        onClick={e => e.stopPropagation()} 
        style={{
          width: "100%", 
          maxWidth: "850px", 
          maxHeight: "90vh", 
          overflowY: "auto", 
          padding: "2.5rem",
          display: "flex", 
          flexWrap: "wrap", /* CLAVE PARA RESPONSIVE: Apila en móvil */
          gap: "2rem", /* Espaciado entre columnas */
          position: "relative",
          borderRadius: "16px",
          border: "none",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          alignItems: "flex-start" /* CLAVE PARA PC: Alinea el contenido arriba */
        }}
      >
        {/* Botón de cerrar elegante */}
        <button 
          onClick={onClose} 
          style={{ 
            position: "absolute", top: "1.2rem", right: "1.2rem", 
            background: "none", border: "none", fontSize: "1.5rem", 
            cursor: "pointer", color: "var(--gray)", zIndex: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "36px", height: "36px", borderRadius: "50%",
            transition: "background 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--gray-light)"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          ✕
        </button>

        {/* ================= COLUMNA IZQUIERDA: GALERÍA ================= */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ width: "100%", aspectRatio: "3/4", borderRadius: "12px", overflow: "hidden", background: "var(--gray-light)", position: "relative" }}>
            {images.length > 0 ? (
               <img src={images[mainImgIdx]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
               <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>
                 {product.emoji || "👗"}
               </div>
            )}
            
            {/* Badges compactos */}
            <div style={{ position: "absolute", top: 15, left: 15, display: "flex", gap: "8px" }}>
                {isOutOfStock && (
                    <span className="badge-status badge-cancelado" style={{ padding: "6px 12px", fontSize: "0.75rem", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase" }}>AGOTADO</span>
                )}
                {salePrice && !isOutOfStock && (
                    <span className="badge-status badge-sale" style={{ padding: "6px 12px", fontSize: "0.75rem", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase" }}>OFERTA</span>
                )}
            </div>
          </div>
          
          {/* Miniaturas compactas */}
          {images.length > 1 && (
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "5px" }}>
               {images.map((img, i) => (
                 <div 
                   key={i} 
                   onClick={() => setMainImgIdx(i)} 
                   style={{ 
                     width: "60px", height: "60px", borderRadius: "8px", overflow: "hidden", 
                     cursor: "pointer", flexShrink: 0, 
                     border: mainImgIdx === i ? "2px solid var(--dark)" : "1px solid var(--border)", 
                     opacity: mainImgIdx === i ? 1 : 0.6, 
                     transition: "all .2s" 
                   }}
                 >
                   <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* ================= COLUMNA DERECHA: INFORMACIÓN (COMPACTA) ================= */}
        <div style={{ flex: "1 1 350px", display: "flex", flexDirection: "column", gap: "1.5rem" /* Espaciado compacto entre secciones */ }}>
          
          {/* Sección 1: Cabecera y Precios */}
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--gray)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "0.5rem" }}>
                {product.cat}
            </div>
            <h2 className="serif" style={{ fontSize: "2.2rem", margin: "0 0 1rem 0", lineHeight: 1.1, color: "var(--dark)" }}>
                {product.name}
            </h2>
            <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--dark)" }}>
                {salePrice ? (
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                    <span style={{ color: "var(--danger)" }}>
                    S/ {Number(salePrice).toFixed(2)}
                    </span>
                    <span style={{ textDecoration: "line-through", color: "var(--gray)", fontSize: "1rem", fontWeight: 500 }}>
                    S/ {Number(normalPrice).toFixed(2)}
                    </span>
                </div>
                ) : (
                <span>S/ {Number(effPrice).toFixed(2)}</span>
                )}
            </div>
          </div>

          {/* Sección 2: Descripción */}
          <p style={{ color: "var(--gray)", lineHeight: 1.6, margin: 0, fontSize: "0.95rem" }}>
            {product.description || "Un diseño exclusivo para resaltar tu estilo único. Cómodo, versátil y perfecto para cualquier ocasión."}
          </p>

          {/* Sección 3: Selectores */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {/* Tallas */}
            {sizes.length > 0 && (
                <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: "var(--dark)" }}>
                    Talla: {selectedSize || <span style={{color: "var(--gray)", fontWeight: 400}}>(Selecciona)</span>}
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {sizes.map(s => (
                    <button 
                        key={s} 
                        onClick={() => setSelectedSize(s)} 
                        style={getSelectorOptionStyle(selectedSize === s)}
                    >
                        {s}
                    </button>
                    ))}
                </div>
                </div>
            )}

            {/* Colores */}
            {colors.length > 0 && (
                <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: "var(--dark)" }}>
                    Color: {selectedColor || <span style={{color: "var(--gray)", fontWeight: 400}}>(Selecciona)</span>}
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {colors.map(c => {
                    const colorObj = COLOR_MAP.find(opt => opt.name === c) || { hex: c.startsWith('#') || c.startsWith('rgb') || c.startsWith('hsl') ? c : "#ccc" };
                    return (
                        <div 
                        key={c} 
                        onClick={() => setSelectedColor(c)} 
                        style={getSelectorOptionStyle(selectedColor === c, true, colorObj.hex)}
                        title={c} 
                        />
                    )
                    })}
                </div>
                </div>
            )}
          </div>

          {/* Sección 4: Stock y Botón (Alineados abajo pero compactos) */}
          <div style={{ marginTop: "1rem" /* Pequeña separación */ }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "10px", fontWeight: 500 }}>
              <span style={{ color: isOutOfStock ? "var(--danger)" : "var(--success)", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "currentColor", display: "inline-block" }}></span>
                {isOutOfStock ? "Producto agotado" : "En stock"}
              </span>
              {!isOutOfStock && <span style={{ color: "var(--gray)" }}>{stock} unidades disponibles</span>}
            </div>
            
            <button 
              className={`btn btn-dark btn-full`}
              onClick={handleAdd} 
              disabled={isOutOfStock} 
              style={{ 
                padding: "16px", borderRadius: "12px", fontSize: "1rem", 
                letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700,
                opacity: isOutOfStock ? 0.6 : 1, cursor: isOutOfStock ? "not-allowed" : "pointer",
                transition: "all .2s", border: "none"
              }}
            >
              {isOutOfStock ? "Agotado" : "AGREGAR A MI PEDIDO"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}