// src/components/ProductCard.jsx
import React from "react";

export default function ProductCard({ product, onClick }) {
  // Sanitización de datos
  const stock = parseInt(product.stock, 10);
  const isOutOfStock = isNaN(stock) || stock <= 0;
  
  const salePrice = product.salePrice || product.sale_price;
  const normalPrice = product.price || 0;
  const effPrice = salePrice || normalPrice;

  // Extraer la imagen principal
  let image = "";
  if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
    image = product.image_urls[0];
  } else if (product.image_url) {
    image = product.image_url;
  } else if (product.imageUrl) {
    image = product.imageUrl;
  }

  return (
    <div 
      className="card" 
      onClick={() => onClick(product)}
      style={{ 
        cursor: "pointer", 
        padding: 0, 
        overflow: "hidden", 
        display: "flex", 
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        height: "100%"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Contenedor de la Imagen */}
      <div style={{ width: "100%", height: "220px", background: "var(--pink-light)", position: "relative" }}>
        {image ? (
           <img src={image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
           <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>
             {product.emoji || "👗"}
           </div>
        )}
        
        {isOutOfStock && (
           <div style={{ position: "absolute", top: 10, left: 10 }}>
             <span className="badge-status badge-cancelado" style={{ padding: "4px 8px", fontSize: "0.7rem", fontWeight: "bold" }}>AGOTADO</span>
           </div>
        )}
        {salePrice && !isOutOfStock && (
           <div style={{ position: "absolute", top: 10, right: 10 }}>
             <span className="badge-status badge-sale" style={{ padding: "4px 8px", fontSize: "0.7rem", fontWeight: "bold" }}>OFERTA</span>
           </div>
        )}
      </div>

      {/* Información del Producto */}
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ fontSize: "0.75rem", color: "var(--gray)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>
          {product.cat}
        </div>
        <h3 className="serif" style={{ fontSize: "1.1rem", margin: "0 0 8px 0", lineHeight: 1.2 }}>
          {product.name}
        </h3>
        
        <div style={{ marginTop: "auto", fontWeight: 600, fontSize: "1rem" }}>
          {salePrice ? (
            <>
              <span style={{ textDecoration: "line-through", color: "var(--gray)", fontSize: "0.85rem", marginRight: "8px" }}>S/ {Number(normalPrice).toFixed(2)}</span>
              <span style={{ color: "var(--danger)" }}>S/ {Number(salePrice).toFixed(2)}</span>
            </>
          ) : `S/ ${Number(effPrice).toFixed(2)}`}
        </div>
      </div>
    </div>
  );
}