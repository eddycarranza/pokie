// src/components/CartSidebar.jsx
import { useState } from "react";
import { createPortal } from "react-dom";
// Importamos 'updateQuantity' del contexto
import { useCart } from "../context/CartContext";

export default function CartSidebar() {
  const { cart, updateQuantity, removeFromCart, total, count, isOpen, setIsOpen, saveOrder, sendToWhatsApp, clearCart } = useCart();
  const [step, setStep] = useState("cart");
  const [form, setForm] = useState({ name: "", dni: "", phone: "", address: "", reference: "", payment: "Yape / Plin", shipping: "Agencia Shalom" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // --- Validación Estricta ---
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Requerido";
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.name.trim())) e.name = "Solo letras";

    if (!form.dni.trim()) e.dni = "Requerido";
    else if (!/^\d{8}$/.test(form.dni.trim())) e.dni = "8 números";

    if (!form.phone.trim()) e.phone = "Requerido";
    else if (!/^\d{9}$/.test(form.phone.trim())) e.phone = "9 números";

    if (!form.address.trim()) e.address = "Requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // --- Manejo del Pedido ---
  const handleOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    await saveOrder(form); // Guarda en Supabase
    sendToWhatsApp(form); // Abre WhatsApp
    clearCart(); // Limpia carrito
    setIsOpen(false);
    setStep("cart");
    // Resetea formulario
    setForm({ name: "", dni: "", phone: "", address: "", reference: "", payment: "Yape / Plin", shipping: "Agencia Shalom" });
    setLoading(false);
  };

  // Función auxiliar para cerrar y resetear
  const closeSidebar = () => {
    setIsOpen(false);
    setStep("cart");
  };

  if (!isOpen) return null;

  // --- Estilos Compartidos y Limpios ---
  const sidebarStyles = {
    position: "fixed", right: 0, top: 0, bottom: 0, width: 380, maxWidth: "100vw",
    background: "white", zIndex: 9999, display: "flex", flexDirection: "column",
    boxShadow: "-2px 0 20px rgba(0,0,0,.1)",
    fontFamily: "var(--font-sans, sans-serif)", // Asegura usar sans-serif
    color: "#333"
  };

  const headerStyles = {
    padding: "1rem 1.5rem", borderBottom: "1px solid #eee",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, fontSize: "0.9rem"
  };

  const closeBtnStyles = {
    background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem",
    color: "#999", lineHeight: 1, padding: 0
  };

  const footerStyles = {
    padding: "1.5rem", borderTop: "1px solid #eee", background: "white"
  };

  // Estilos específicos para los items del carrito rediseñados
  const itemRowStyles = {
    display: "flex", gap: 15, padding: "1rem 0", borderBottom: "1px solid #f5f5f5",
    alignItems: "center", position: "relative"
  };

  const qtyContainerStyles = {
    display: "flex", alignItems: "center", border: "1px solid #ddd",
    borderRadius: 4, overflow: "hidden", width: "fit-content", marginTop: 8
  };

  const qtyBtnStyles = {
    background: "none", border: "none", cursor: "pointer", padding: "4px 10px",
    fontSize: "1rem", color: "#666"
  };

  return createPortal(
    <>
      {/* Overlay */}
      <div onClick={closeSidebar} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 9998 }} />

      <div style={sidebarStyles}>
        {/* HEADER LIMPIO --- Basado en imagen reference */}
        <div style={headerStyles}>
          <span>MI BOLSA ({count} {count === 1 ? 'ARTÍCULO' : 'ARTÍCULOS'})</span>
          <button onClick={closeSidebar} style={closeBtnStyles}>✕</button>
        </div>

        {/* STEP 1: EL CARRITO (VISTA SIMPLIFICADA) */}
        {step === "cart" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "0 1.5rem" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#999" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛍️</div>
                  <p style={{ fontWeight: 500, color: "#666" }}>Tu bolsa está vacía</p>
                  <p style={{ fontSize: "0.85rem", marginTop: 5 }}>¡Agrega algo bonito para empezar!</p>
                </div>
              ) : cart.map(item => (
                // --- ITEM REDISEÑADO ---
                <div key={item.key} style={itemRowStyles}>
                  {/* Imagen */}
                  <div style={{ width: 70, height: 85, background: "#f9f9f9", borderRadius: 4, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", flexShrink: 0, border: "1px solid #f0f0f0" }}>
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : item.emoji}
                  </div>
                  
                  {/* Detalles y Precio */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#222", marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#777", textTransform: "capitalize" }}>
                      {[item.size, item.color].filter(Boolean).join(" | ")}
                    </div>
                    
                    {/* SELECTOR DE CANTIDAD (+/-) --- Nuevo */}
                    <div style={qtyContainerStyles}>
                      <button onClick={() => updateQuantity(item.key, item.qty - 1)} style={qtyBtnStyles}>-</button>
                      <span style={{ padding: "0 8px", fontSize: "0.9rem", fontWeight: 500, minWidth: 25, textAlign: "center" }}>{item.qty}</span>
                      <button onClick={() => updateQuantity(item.key, item.qty + 1)} style={qtyBtnStyles}>+</button>
                    </div>
                  </div>

                  {/* Precio Total Item y Botón Eliminar */}
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 20 }}>
                     <button onClick={() => removeFromCart(item.key)} style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: "1.1rem", padding: 0, lineHeight: 1 }}>✕</button>
                     <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#222" }}>S/ {(item.price * item.qty).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER DEL CARRITO --- Basado en imagen reference */}
            {cart.length > 0 && (
              <div style={footerStyles}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                  <span>Total</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
                <button className="btn btn-dark btn-full" style={{textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600}} onClick={() => setStep("form")}>PAGAR →</button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: EL FORMULARIO (Se mantiene igual pero con estilo limpio) */}
        {step === "form" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "#fdf2f8", borderRadius: 8, padding: "12px", fontSize: "0.85rem", color: "#c2185b", border: "1px solid #fbcfe8" }}>
                📱 Al confirmar, te redirigiremos a WhatsApp para coordinar el pago y envío.
              </div>
              
              <div className="form-group">
                <label className="form-label">Nombre completo *</label>
                <input className="form-input" placeholder="Ej: Juan Perez" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                {errors.name && <span className="form-error">⚠ {errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">DNI / CE *</label>
                <input className="form-input" placeholder="8 números" value={form.dni} onChange={e => setForm(p => ({ ...p, dni: e.target.value }))} />
                {errors.dni && <span className="form-error">⚠ {errors.dni}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono / WhatsApp *</label>
                <input className="form-input" placeholder="9XXXXXXXX" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                {errors.phone && <span className="form-error">⚠ {errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Método de envío</label>
                <select className="form-input" value={form.shipping} onChange={e => setForm(p => ({ ...p, shipping: e.target.value }))}>
                  <option value="Agencia Shalom">Agencia Shalom</option>
                  <option value="Agencia Olva Courier">Agencia Olva Courier</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Agencia de destino *</label>
                <input className="form-input" placeholder="Ej: Agencia Centro, Piura..." value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
                {errors.address && <span className="form-error">⚠ {errors.address}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Referencia (Opcional)</label>
                <input className="form-input" placeholder="Frente a la plaza, puerta azul..." value={form.reference} onChange={e => setForm(p => ({ ...p, reference: e.target.value }))} />
              </div>

              <div className="form-group">
                <label className="form-label">Método de pago</label>
                <select className="form-input" value={form.payment} onChange={e => setForm(p => ({ ...p, payment: e.target.value }))}>
                  <option>Yape / Plin</option>
                  <option>Transferencia bancaria</option>
                </select>
              </div>
            </div>
            
            <div style={footerStyles}>
               <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, marginBottom: "1rem", fontSize: "0.95rem" }}>
                  <span>Total</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
              <button onClick={handleOrder} disabled={loading} style={{ background: "#25D366", color: "white", border: "none", borderRadius: 8, padding: 14, fontSize: "0.95rem", cursor: loading ? "default" : "pointer", fontWeight: 600, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading ? "Procesando..." : "📲 CONFIRMAR POR WHATSAPP"}
              </button>
              <button className="btn btn-outline btn-full" style={{marginTop: 10, border: "none", color: "#777"}} onClick={() => setStep("cart")}>← Volver a la bolsa</button>
            </div>
          </>
        )}
      </div>
    </>,
    document.body
  );
}