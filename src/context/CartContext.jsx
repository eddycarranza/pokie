// src/context/CartContext.jsx
import { createContext, useContext, useState } from "react";
import { supabase } from "../lib/supabase";

const CartContext = createContext();
// NUEVO NÚMERO DE WHATSAPP APLICADO
const WA_NUMBER = "51927112114"; 

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (product, qty = 1, size = "", color = "") => {
    // Validar stock antes de agregar
    if (product.stock <= 0) {
      alert("Este producto está agotado.");
      return;
    }
    
    const key = `${product.id}-${size}-${color}`;
    setCart(prev => {
      const existing = prev.find(i => i.key === key);
      // Validar que no exceda el stock
      if (existing && existing.qty + qty > product.stock) {
        alert(`Solo quedan ${product.stock} unidades en stock.`);
        return prev;
      }
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      
      return [...prev, {
        key, id: product.id, name: product.name,
        price: product.sale_price || product.price,
        emoji: product.emoji || "🛍️", 
        imageUrl: product.image_urls?.[0] || product.image_url || null, 
        size, color, qty, stock: product.stock
      }];
    });
    setIsOpen(true);
  };

  const updateQuantity = (key, newQty) => {
    if (newQty < 1) return; 
    setCart(prev => prev.map(i => {
      if (i.key === key) {
        if (newQty > i.stock) {
          alert(`Solo quedan ${i.stock} unidades disponibles.`);
          return i;
        }
        return { ...i, qty: newQty };
      }
      return i;
    }));
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
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, total, count, isOpen, setIsOpen, saveOrder, sendToWhatsApp }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);