// src/components/ProductCard.jsx
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, onClick }) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (product.sizes?.length) { onClick(product); return; }
    addToCart(product, 1, "", "");
  };

  const effPrice = product.salePrice || product.price;

  return (
    <div onClick={() => onClick(product)} style={{
      background: "white", borderRadius: 16, overflow: "hidden",
      border: "1px solid var(--border)", cursor: "pointer",
      transition: "transform .2s, box-shadow .2s"
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Image */}
      <div style={{
        width: "100%", aspectRatio: "3/4", background: "var(--pink-light)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", fontSize: "4.5rem"
      }}>
        {/* CORRECCIÓN AQUÍ: Soporta image_url (Supabase) o imageUrl */}
        {product.image_url || product.imageUrl
          ? <img src={product.image_url || product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : product.emoji || "👗"}
        {product.badge && (
          <span className={`badge-${product.badge}`} style={{
            position: "absolute", top: 10, left: 10,
            padding: "4px 10px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 500
          }}>
            {product.badge === "new" ? "Nuevo" : "Oferta"}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "0.9rem" }}>
        <div style={{ fontSize: "0.95rem", fontWeight: 500 }}>{product.name}</div>
        <div style={{ fontSize: "0.78rem", color: "var(--gray)", margin: "2px 0 8px" }}>{product.cat}</div>
        <div style={{ fontSize: "1rem", fontWeight: 500 }}>
          {product.salePrice ? (
            <>
              <span style={{ textDecoration: "line-through", color: "var(--gray)", fontSize: "0.82rem", marginRight: 6 }}>
                S/ {product.price?.toFixed(2)}
              </span>
              <span style={{ color: "var(--danger)" }}>S/ {product.salePrice.toFixed(2)}</span>
            </>
          ) : `S/ ${effPrice?.toFixed(2)}`}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.6rem 0.9rem 0.9rem", borderTop: "1px solid var(--border)"
      }}>
        <div style={{ display: "flex", gap: 4 }}>
          {(product.sizes || []).slice(0, 3).map(s => (
            <div key={s} style={{
              width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--border)",
              fontSize: "0.68rem", display: "flex", alignItems: "center", justifyContent: "center"
            }}>{s}</div>
          ))}
          {product.sizes?.length > 3 && (
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--border)", fontSize: "0.68rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              +{product.sizes.length - 3}
            </div>
          )}
        </div>
        <button onClick={handleQuickAdd} style={{
          background: "var(--dark)", color: "white", border: "none",
          width: 34, height: 34, borderRadius: "50%", fontSize: "1.2rem",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background .2s"
        }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--pink-dark)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--dark)"}
        >+</button>
      </div>
    </div>
  );
}