// src/context/CartContext.jsx
import { createContext, useContext, useState } from "react";

const CartContext = createContext();
const WA_NUMBER = "51948761303"; // Peru code + number

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (product, qty = 1, size = "", color = "") => {
    const key = `${product.id}-${size}-${color}`;
    setCart(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { key, id: product.id, name: product.name, price: product.salePrice || product.price, emoji: product.emoji || "👗", size, color, qty }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (key) => setCart(prev => prev.filter(i => i.key !== key));

  const clearCart = () => setCart([]);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const sendToWhatsApp = (customerData) => {
    const lines = [
      `🐱 *Nuevo pedido PookieCat*`,
      ``,
      `👤 *Cliente:* ${customerData.name}`,
      `📍 *Dirección:* ${customerData.address}`,
      `💳 *Pago:* ${customerData.payment}`,
      ``,
      `🛍 *Productos:*`,
      ...cart.map(i => `  • ${i.name}${i.size ? ` (${i.size})` : ""}${i.color ? ` - ${i.color}` : ""} x${i.qty} → S/ ${(i.price * i.qty).toFixed(2)}`),
      ``,
      `💰 *Total: S/ ${total.toFixed(2)}*`,
    ];
    const msg = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total, count, isOpen, setIsOpen, sendToWhatsApp }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
