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

  // =========================================================
  // 🧠 CEREBRO DE INVENTARIO: LECTURA DEL JSONB (VARIANTES)
  // =========================================================
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  const baseSizes = Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === 'string' ? product.sizes.split(',') : []);
  const baseColors = Array.isArray(product.colors) ? product.colors : (typeof product.colors === 'string' ? product.colors.split(',') : []);

  const availableSizes = hasVariants ? [...new Set(product.variants.map(v => v.size))] : baseSizes;
  const availableColors = hasVariants ? [...new Set(product.variants.map(v => v.color))] : baseColors;

  let currentStock = 0;

  if (hasVariants) {
    if (selectedSize && selectedColor) {
      const variant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
      currentStock = variant ? parseInt(variant.stock, 10) : 0;
    } else {
      currentStock = product.variants.reduce((acc, v) => acc + (parseInt(v.stock, 10) || 0), 0);
    }
  } else {
    currentStock = parseInt(product.stock, 10) || 0;
  }

  const isOutOfStock = isNaN(currentStock) || currentStock <= 0;
  // =========================================================

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

  const handleAdd = () => {
    if (availableSizes.length > 0 && !selectedSize) return alert("Por favor, selecciona una talla.");
    if (availableColors.length > 0 && !selectedColor) return alert("Por favor, selecciona un color.");
    if (isOutOfStock) return; 

    addToCart(product, 1, selectedSize, selectedColor);
    onClose();
  };

  // Generador inteligente del mensaje de WhatsApp
  const generateWspLink = () => {
    const phoneNumber = "51927112114"; // El número de Pookiecat
    let message = `Hola! Quisiera consultar disponibilidad de: *${product.name}*`;
    if (selectedSize) message += `\n- Talla: ${selectedSize}`;
    if (selectedColor) message += `\n- Color: ${selectedColor}`;
    
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

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
          width: "100%", maxWidth: "850px", maxHeight: "90vh", overflowY: "auto", 
          padding: "2.5rem", display: "flex", flexWrap: "wrap", gap: "2rem",
          position: "relative", borderRadius: "16px", border: "none",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", alignItems: "flex-start"
        }}
      >
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
            
            <div style={{ position: "absolute", top: 15, left: 15, display: "flex", gap: "8px" }}>
                {isOutOfStock && (
                    <span className="badge-status badge-cancelado" style={{ padding: "6px 12px", fontSize: "0.75rem", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase", background: "var(--danger)", color: "white", borderRadius: "4px" }}>AGOTADO</span>
                )}
                {salePrice && !isOutOfStock && (
                    <span className="badge-status badge-sale" style={{ padding: "6px 12px", fontSize: "0.75rem", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase", background: "var(--dark)", color: "white", borderRadius: "4px" }}>OFERTA</span>
                )}
            </div>
          </div>
          
          {images.length > 1 && (
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "5px" }}>
               {images.map((img, i) => (
                 <div 
                   key={i} 
                   onClick={() => setMainImgIdx(i)} 
                   style={{ 
                     width: "60px", height: "60px", borderRadius: "8px", overflow: "hidden", cursor: "pointer", flexShrink: 0, 
                     border: mainImgIdx === i ? "2px solid var(--dark)" : "1px solid var(--border)", 
                     opacity: mainImgIdx === i ? 1 : 0.6, transition: "all .2s" 
                   }}
                 >
                   <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* ================= COLUMNA DERECHA: INFORMACIÓN ================= */}
        <div style={{ flex: "1 1 350px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
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
                    <span style={{ color: "var(--danger)" }}>S/ {Number(salePrice).toFixed(2)}</span>
                    <span style={{ textDecoration: "line-through", color: "var(--gray)", fontSize: "1rem", fontWeight: 500 }}>S/ {Number(normalPrice).toFixed(2)}</span>
                </div>
                ) : (
                <span>S/ {Number(effPrice).toFixed(2)}</span>
                )}
            </div>
          </div>

          <p style={{ color: "var(--gray)", lineHeight: 1.6, margin: 0, fontSize: "0.95rem" }}>
            {product.description || "Un diseño exclusivo para resaltar tu estilo único. Cómodo, versátil y perfecto para cualquier ocasión."}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {availableSizes.length > 0 && (
                <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: "var(--dark)" }}>
                    Talla: {selectedSize || <span style={{color: "var(--gray)", fontWeight: 400}}>(Selecciona)</span>}
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {availableSizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)} style={getSelectorOptionStyle(selectedSize === s)}>
                        {s}
                    </button>
                    ))}
                </div>
                </div>
            )}

            {availableColors.length > 0 && (
                <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: "var(--dark)" }}>
                    Color: {selectedColor || <span style={{color: "var(--gray)", fontWeight: 400}}>(Selecciona)</span>}
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {availableColors.map(c => {
                    const colorObj = COLOR_MAP.find(opt => opt.name === c) || { hex: c.startsWith('#') || c.startsWith('rgb') || c.startsWith('hsl') ? c : "#ccc" };
                    return (
                        <div key={c} onClick={() => setSelectedColor(c)} style={getSelectorOptionStyle(selectedColor === c, true, colorObj.hex)} title={c} />
                    )
                    })}
                </div>
                </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* SECCIÓN 4: STOCK Y BOTONES DINÁMICOS (WSP O AGREGAR) */}
          {/* ======================================================= */}
          <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "10px", fontWeight: 500 }}>
              <span style={{ color: isOutOfStock ? "var(--danger)" : "var(--success)", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "currentColor", display: "inline-block" }}></span>
                {isOutOfStock ? "A pedido" : "En stock"}
              </span>
              {!isOutOfStock && <span style={{ color: "var(--gray)" }}>{currentStock} unidades disponibles</span>}
            </div>
            
            {isOutOfStock ? (
              <a 
                href={generateWspLink()}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  padding: "16px", borderRadius: "12px", fontSize: "1rem", width: "100%",
                  letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700,
                  transition: "all .2s", border: "none", background: "#25D366", color: "white",
                  textDecoration: "none"
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                CONSULTAR POR WHATSAPP
              </a>
            ) : (
              <button 
                className={`btn btn-dark btn-full`}
                onClick={handleAdd} 
                style={{ 
                  padding: "16px", borderRadius: "12px", fontSize: "1rem", width: "100%",
                  letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700,
                  transition: "all .2s", border: "none", background: "var(--dark)", color: "white", cursor: "pointer"
                }}
              >
                AGREGAR A MI PEDIDO
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}