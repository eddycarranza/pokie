// src/components/CartSidebar.jsx
import { useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "../context/CartContext";

export default function CartSidebar() {
  const { cart, removeFromCart, total, count, isOpen, setIsOpen, saveOrder, sendToWhatsApp, clearCart } = useCart();
  const [step, setStep] = useState("cart");
  const [form, setForm] = useState({ name: "", dni: "", phone: "", address: "", payment: "Yape / Plin", shipping: "Agencia Shalom" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // --- NUEVA VALIDACIÓN ESTRICTA ---
  const validate = () => {
    const e = {};
    
    // Validar Nombre: Requerido y SOLO letras (incluye tildes y la ñ)
    if (!form.name.trim()) {
      e.name = "Requerido";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.name.trim())) {
      e.name = "Solo debe contener letras";
    }

    // Validar DNI: Requerido y EXACTAMENTE 8 números
    if (!form.dni.trim()) {
      e.dni = "Requerido";
    } else if (!/^\d{8}$/.test(form.dni.trim())) {
      e.dni = "Debe tener exactamente 8 números";
    }

    // Validar Teléfono: Requerido y EXACTAMENTE 9 números (formato Perú)
    if (!form.phone.trim()) {
      e.phone = "Requerido";
    } else if (!/^\d{9}$/.test(form.phone.trim())) {
      e.phone = "Debe tener 9 números (Ej: 987654321)";
    }

    // Validar Dirección: Requerido
    if (!form.address.trim()) {
      e.address = "Requerido";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };
  // ---------------------------------

  const handleOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    await saveOrder(form);
    sendToWhatsApp(form);
    clearCart();
    setIsOpen(false);
    setStep("cart");
    setForm({ name: "", dni: "", phone: "", address: "", payment: "Yape / Plin", shipping: "Agencia Shalom" });
    setLoading(false);
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        onClick={() => { setIsOpen(false); setStep("cart"); }}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 9998 }}
      />

      <div style={{
        position: "fixed", right: 0, top: 0, bottom: 0, width: 400, maxWidth: "100vw",
        background: "white", zIndex: 9999, display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 40px rgba(0,0,0,.15)"
      }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 className="serif" style={{ fontSize: "1.25rem" }}>
            {step === "cart" ? `Mi carrito (${count})` : "Datos de envío"}
          </h3>
          <button onClick={() => { setIsOpen(false); setStep("cart"); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--gray)", lineHeight: 1 }}>✕</button>
        </div>

        {step === "cart" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--gray)" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🐱</div>
                  <p style={{ fontWeight: 500 }}>Tu carrito está vacío</p>
                  <p style={{ fontSize: "0.82rem", marginTop: 4 }}>¡Agrega algo bonito!</p>
                </div>
              ) : cart.map(item => (
                <div key={item.key} style={{ display: "flex", gap: 12, padding: 12, border: "1px solid var(--border)", borderRadius: 12 }}>
                  <div style={{ width: 58, height: 68, background: "var(--pink-light)", borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", flexShrink: 0 }}>
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : item.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: "0.77rem", color: "var(--gray)", margin: "2px 0" }}>
                      {[item.size, item.color].filter(Boolean).join(" · ")} · x{item.qty}
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>S/ {(item.price * item.qty).toFixed(2)}</div>
                  </div>
                  <button onClick={() => removeFromCart(item.key)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray)", fontSize: "1rem", alignSelf: "flex-start", lineHeight: 1 }}>✕</button>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: 500, marginBottom: "1rem" }}>
                  <span>Total</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
                <button className="btn btn-dark btn-full" onClick={() => setStep("form")}>Continuar →</button>
              </div>
            )}
          </>
        )}

        {step === "form" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "var(--pink-light)", borderRadius: 10, padding: "10px 14px", fontSize: "0.85rem", color: "var(--pink-dark)" }}>
                📱 Al confirmar, te redirigiremos a WhatsApp para coordinar tu pedido
              </div>
              
              <div className="form-group">
                <label className="form-label">Nombre completo *</label>
                <input className="form-input" placeholder="Tu nombre" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                {errors.name && <span style={{ color: "var(--danger)", fontSize: "0.78rem" }}>⚠ {errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">DNI / CE *</label>
                <input className="form-input" placeholder="Número de documento" value={form.dni} onChange={e => setForm(p => ({ ...p, dni: e.target.value }))} />
                {errors.dni && <span style={{ color: "var(--danger)", fontSize: "0.78rem" }}>⚠ {errors.dni}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono / WhatsApp *</label>
                <input className="form-input" placeholder="9XXXXXXXX" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                {errors.phone && <span style={{ color: "var(--danger)", fontSize: "0.78rem" }}>⚠ {errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Método de envío</label>
                <select className="form-input" value={form.shipping} onChange={e => setForm(p => ({ ...p, shipping: e.target.value }))}>
                  <option value="Agencia Shalom">Agencia Shalom</option>
                  <option value="Agencia Olva">Agencia Olva</option>
                  <option value="Olva Domicilio">Olva Courier (A domicilio)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {form.shipping.includes("Agencia") ? "Agencia de destino *" : "Dirección de entrega *"}
                </label>
                <input 
                  className="form-input" 
                  placeholder={form.shipping.includes("Agencia") ? "Ej: Agencia Centro, Los Olivos..." : "Calle, número, distrito, referencia..."} 
                  value={form.address} 
                  onChange={e => setForm(p => ({ ...p, address: e.target.value }))} 
                />
                {errors.address && <span style={{ color: "var(--danger)", fontSize: "0.78rem" }}>⚠ {errors.address}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Método de pago</label>
                <select className="form-input" value={form.payment} onChange={e => setForm(p => ({ ...p, payment: e.target.value }))}>
                  <option>Yape / Plin</option>
                  <option>Transferencia bancaria</option>
                </select>
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 500 }}>
                  <span>Total ({count} items)</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={handleOrder} disabled={loading} style={{ background: "#25D366", color: "white", border: "none", borderRadius: 999, padding: 13, fontSize: "0.95rem", cursor: loading ? "default" : "pointer", fontFamily: "'Courier New', Courier, monospace", fontWeight: 500 }}>
                {loading ? "Guardando..." : "📲 Enviar pedido por WhatsApp"}
              </button>
              <button className="btn btn-outline btn-full" onClick={() => setStep("cart")}>← Volver al carrito</button>
            </div>
          </>
        )}
      </div>
    </>,
    document.body
  );
}