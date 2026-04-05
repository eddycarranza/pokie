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
  const [qty, setQty] = useState(1);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  if (!product) return null;

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const baseSizes = Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === "string" ? product.sizes.split(",") : []);
  const baseColors = Array.isArray(product.colors) ? product.colors : (typeof product.colors === "string" ? product.colors.split(",") : []);
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
    addToCart(product, qty, selectedSize, selectedColor);
    onClose();
  };

  const generateWspLink = () => {
    const phoneNumber = "51927112114";
    let message = `Hola! Quisiera consultar disponibilidad de: *${product.name}*`;
    if (selectedSize) message += `\n- Talla: ${selectedSize}`;
    if (selectedColor) message += `\n- Color: ${selectedColor}`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.55)",
        overflowY: "auto",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "0",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "1100px",
          minHeight: "100vh",
          background: "white",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Top bar / breadcrumb */}
        <div className="product-modal-breadcrumb" style={{
          padding: "0.9rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky", top: 0, background: "white", zIndex: 10,
        }}>
          <div style={{ fontSize: "0.82rem", color: "#888", fontFamily: "'Courier New', Courier, monospace", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={onClose}>Inicio</span>
            <span>/</span>
            <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={onClose}>{product.cat || "Productos"}</span>
            <span>/</span>
            <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{product.name}</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "1px solid #e5e5e5", fontSize: "1.1rem",
              cursor: "pointer", color: "#888", borderRadius: "50%",
              width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f5f5f5"; e.currentTarget.style.color = "#1a1a1a"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#888"; }}
          >&#x2715;</button>
        </div>

        {/* Main content: 2 columns */}
        <div className="product-modal-inner" style={{ display: "flex", flexWrap: "wrap", flex: 1 }}>

          {/* LEFT: Image Gallery */}
          <div className="product-modal-left" style={{ flex: "1 1 420px", padding: "1rem 2rem 2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{
              width: "100%", aspectRatio: "3/4", borderRadius: "8px",
              overflow: "hidden", background: "#f5f5f5", position: "relative",
            }}>
              {images.length > 0 ? (
                <img src={images[mainImgIdx]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>
                  {product.emoji || "👗"}
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={() => setMainImgIdx(i => (i - 1 + images.length) % images.length)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: "1.3rem", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>&#x2039;</button>
                  <button onClick={() => setMainImgIdx(i => (i + 1) % images.length)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: "1.3rem", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>&#x203a;</button>
                </>
              )}
              <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
                {isOutOfStock && <span style={{ background: "#e00", color: "white", padding: "5px 10px", borderRadius: 4, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>AGOTADO</span>}
                {salePrice && !isOutOfStock && <span style={{ background: "#1a1a1a", color: "white", padding: "5px 10px", borderRadius: 4, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>OFERTA</span>}
              </div>
              {images.length > 1 && (
                <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setMainImgIdx(i)} style={{ width: i === mainImgIdx ? 20 : 8, height: 8, borderRadius: 999, border: "none", cursor: "pointer", padding: 0, background: i === mainImgIdx ? "#1a1a1a" : "rgba(255,255,255,0.7)", transition: "all .3s" }} />
                  ))}
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {images.map((img, i) => (
                  <div key={i} onClick={() => setMainImgIdx(i)} style={{ width: 72, height: 72, borderRadius: 8, overflow: "hidden", cursor: "pointer", border: mainImgIdx === i ? "2px solid #1a1a1a" : "1px solid #e5e5e5", opacity: mainImgIdx === i ? 1 : 0.65, transition: "all .2s" }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}

            {product.description && (
              <div style={{ marginTop: "0.5rem" }}>
                <p style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: "0.88rem", lineHeight: 1.8, color: "#444", margin: 0, whiteSpace: "pre-line" }}>
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="product-modal-right" style={{ flex: "1 1 360px", padding: "1rem 2rem 2rem", display: "flex", flexDirection: "column", gap: "1.4rem" }}>

            {/* Category + Name + Price */}
            <div>
              <div style={{ fontSize: "0.75rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6, fontFamily: "'Courier New', Courier, monospace" }}>
                {product.cat}
              </div>
              <h1 style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: "1.8rem", fontWeight: 700, margin: "0 0 1rem 0", lineHeight: 1.1, color: "#1a1a1a" }}>
                {product.name}
              </h1>
              <div style={{ fontSize: "1.7rem", fontWeight: 700, color: "#1a1a1a" }}>
                {salePrice ? (
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ color: "#e00" }}>S/ {Number(salePrice).toFixed(2)}</span>
                    <span style={{ textDecoration: "line-through", color: "#aaa", fontSize: "1rem", fontWeight: 400 }}>S/ {Number(normalPrice).toFixed(2)}</span>
                  </div>
                ) : (
                  <span>S/ {Number(effPrice).toFixed(2)}</span>
                )}
              </div>
            </div>

            {/* Sizes */}
            {availableSizes.length > 0 && (
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 8, color: "#1a1a1a", fontFamily: "'Courier New', Courier, monospace" }}>Talle</div>
                <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d5d5d5", fontSize: "0.95rem", fontFamily: "'Courier New', Courier, monospace", background: "white", cursor: "pointer", outline: "none" }}>
                  <option value="">Seleccionar talle</option>
                  {availableSizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            {/* Colors */}
            {availableColors.length > 0 && (
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 8, color: "#1a1a1a", fontFamily: "'Courier New', Courier, monospace" }}>
                  Color: {selectedColor ? <span style={{ fontWeight: 400, color: "#555" }}>{selectedColor}</span> : <span style={{ fontWeight: 400, color: "#aaa" }}>(Selecciona)</span>}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {availableColors.map(c => {
                    const colorObj = COLOR_MAP.find(opt => opt.name === c) || { hex: c.startsWith("#") || c.startsWith("rgb") || c.startsWith("hsl") ? c : "#ccc" };
                    return <div key={c} onClick={() => setSelectedColor(c)} title={c} style={{ width: 36, height: 36, borderRadius: "50%", background: colorObj.hex, border: selectedColor === c ? "3px solid #1a1a1a" : "2px solid #e5e5e5", cursor: "pointer", boxShadow: selectedColor === c ? "0 0 0 2px white inset" : "none", transition: "all .2s" }} />;
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 8, color: "#1a1a1a", fontFamily: "'Courier New', Courier, monospace" }}>Cantidad</div>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #d5d5d5", borderRadius: 8, overflow: "hidden", width: "fit-content" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 42, border: "none", background: "#f5f5f5", cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={e => e.currentTarget.style.background="#ebebeb"} onMouseLeave={e => e.currentTarget.style.background="#f5f5f5"}>&#x2212;</button>
                <input type="number" value={qty} min={1} max={currentStock} onChange={e => setQty(Math.min(currentStock, Math.max(1, parseInt(e.target.value) || 1)))} style={{ width: 52, height: 42, border: "none", textAlign: "center", fontSize: "1rem", fontFamily: "'Courier New', Courier, monospace", outline: "none" }} />
                <button onClick={() => setQty(q => Math.min(currentStock, q + 1))} disabled={qty >= currentStock} style={{ width: 40, height: 42, border: "none", background: qty >= currentStock ? "#f0f0f0" : "#f5f5f5", cursor: qty >= currentStock ? "not-allowed" : "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", opacity: qty >= currentStock ? 0.4 : 1 }} onMouseEnter={e => { if(qty < currentStock) e.currentTarget.style.background="#ebebeb"; }} onMouseLeave={e => { e.currentTarget.style.background = qty >= currentStock ? "#f0f0f0" : "#f5f5f5"; }}>&#x2b;</button>
              </div>
            </div>

            {/* Stock */}
            <div style={{ fontSize: "0.85rem", color: isOutOfStock ? "#e00" : "#2a7a2a", display: "flex", justifyContent: "space-between" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "currentColor", display: "inline-block" }}></span>
                {isOutOfStock ? "A pedido" : "En stock"}
              </span>
              {!isOutOfStock && <span style={{ color: "#aaa" }}>{currentStock} unidades disponibles</span>}
            </div>

            {/* Button */}
            {isOutOfStock ? (
              <a href={generateWspLink()} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "15px", borderRadius: 10, fontSize: "0.9rem", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 700, background: "#25D366", color: "white", textDecoration: "none", fontFamily: "'Courier New', Courier, monospace" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                CONSULTAR POR WHATSAPP
              </a>
            ) : (
              <button onClick={handleAdd} style={{ padding: "15px", borderRadius: 10, fontSize: "0.9rem", width: "100%", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 700, background: "#1a1a1a", color: "white", border: "none", cursor: "pointer", fontFamily: "'Courier New', Courier, monospace", transition: "all .2s" }} onMouseEnter={e => e.currentTarget.style.background="#333"} onMouseLeave={e => e.currentTarget.style.background="#1a1a1a"}>
                AGREGAR AL CARRITO
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
