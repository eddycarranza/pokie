// src/context/CartContext.jsx
import { createContext, useContext, useState } from "react";
import { supabase } from "../lib/supabase";

const CartContext = createContext();
// Cambia esto por tu número real si no lo has hecho
const WA_NUMBER = "51948761303"; 

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Función para agregar al carrito (modificada levemente para consistencia)
  const addToCart = (product, qty = 1, size = "", color = "") => {
    const key = `${product.id}-${size}-${color}`;
    setCart(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, {
        key, id: product.id, name: product.name,
        price: product.sale_price || product.price,
        emoji: product.emoji || "🛍️", imageUrl: product.image_url || product.imageUrl || null, size, color, qty
      }];
    });
    setIsOpen(true);
  };

  // --- NUEVA FUNCIÓN PARA ACTUALIZAR CANTIDAD (+/-) ---
  const updateQuantity = (key, newQty) => {
    if (newQty < 1) return; // No permitir cantidad menor a 1
    setCart(prev => prev.map(i => i.key === key ? { ...i, qty: newQty } : i));
  };
  // ----------------------------------------------------

  const removeFromCart = (key) => setCart(prev => prev.filter(i => i.key !== key));
  const clearCart = () => setCart([]);
  
  // Cálculos
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0); // Total de items físicos

  // Guardar en Supabase
  const saveOrder = async (customerData) => {
    try {
      await supabase.from("orders").insert({
        client: customerData.name,
        phone: customerData.phone,
        address: customerData.address,
        payment: customerData.payment,
        items: cart, // Guardamos el estado actual del carrito
        total,
        status: "pendiente",
      });
    } catch (e) { console.warn("Error guardando pedido:", e); }
  };

  // Formato para WhatsApp (El que definimos anteriormente)
  const sendToWhatsApp = (customerData) => {
    const itemLines = cart.map(i => {
      const details = [];
      if (i.size) details.push(`talla ${i.size}`);
      if (i.color) details.push(`color ${i.color}`);
      const detailsStr = details.length > 0 ? ` [${details.join(", ")}]` : "";
      return `- ${i.name}${detailsStr} x${i.qty} ...s/.${(i.price * i.qty).toFixed(2)}`;
    });

    const lines = [
      `Nuevo pedido 𝜗ৎ`,
      ``,
      `⋆ Cliente: ${customerData.name}`,
      `⋆ Dni: ${customerData.dni}`,
      `⋆ Telf: ${customerData.phone}`,
      `⋆ Medio de envío: ${customerData.shipping}`,
      `⋆ Direccion/Nombre agencia: ${customerData.address}`,
      `⋆ Referencia: ${customerData.reference || ''}`,
      ``,
      `Método de pago: ${customerData.payment.toLowerCase()}`,
      ``,
      `Producto(s):`,
      ...itemLines,
      ``,
      `Total: S/.${total.toFixed(2)}`,
      ``,
      `El pago del envío es adicional y a calcular`
    ];
    
    const msg = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    // Agregamos 'updateQuantity' al Provider
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, total, count, isOpen, setIsOpen, saveOrder, sendToWhatsApp }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);