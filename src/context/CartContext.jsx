// src/context/CartContext.jsx
import { createContext, useContext, useState } from "react";
import { supabase } from "../lib/supabase";

const CartContext = createContext();
const WA_NUMBER = "51948761303";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (product, qty = 1, size = "", color = "") => {
    const key = `${product.id}-${size}-${color}`;
    setCart(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, {
        key, id: product.id, name: product.name,
        price: product.sale_price || product.price,
        emoji: product.emoji || "👗", imageUrl: product.image_url || product.imageUrl || null, size, color, qty
      }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (key) => setCart(prev => prev.filter(i => i.key !== key));
  const clearCart = () => setCart([]);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const saveOrder = async (customerData) => {
    try {
      await supabase.from("orders").insert({
        client: customerData.name,
        phone: customerData.phone,
        address: customerData.address,
        payment: customerData.payment,
        items: cart,
        total,
        status: "pendiente",
      });
    } catch (e) { console.warn("Error guardando pedido:", e); }
  };

  const sendToWhatsApp = (customerData) => {
    const itemLines = cart.map(i =>
      `  • ${i.name}${i.size ? ` | Talla: ${i.size}` : ""}${i.color ? ` | Color: ${i.color}` : ""}\n    Cantidad: ${i.qty} — S/ ${(i.price * i.qty).toFixed(2)}`
    );
    const lines = [
      `🐱 *NUEVO PEDIDO — PookieCat*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `👤 *Cliente:* ${customerData.name}`,
      `📱 *Teléfono:* ${customerData.phone}`,
      `📍 *Dirección:* ${customerData.address}`,
      `💳 *Método de pago:* ${customerData.payment}`,
      ``,
      `🛍 *Productos:*`,
      ...itemLines,
      ``,
      `━━━━━━━━━━━━━━━━━━━━`,
      `💰 *TOTAL: S/ ${total.toFixed(2)}*`,
      `━━━━━━━━━━━━━━━━━━━━`,
    ];
    const msg = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total, count, isOpen, setIsOpen, saveOrder, sendToWhatsApp }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
