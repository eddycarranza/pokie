// src/pages/AdminDashboard.jsx
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProducts, useOrders, useExpenses } from "../hooks/useSupabase";
import { supabase } from "../lib/supabase"; 
import Logo from "../components/Logo";

// ============ SUPABASE CONFIG ============
const SUPABASE_URL = "https://dsxtauxcbyeumkdbhtxj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeHRhdXhjYnlldW1rZGJodHhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjMxNzgsImV4cCI6MjA5MDEzOTE3OH0.CZPiBgf5Gmrsuq3TTzIphI5stuEVy-w4TqAIfo-QsO4";
const BUCKET = "products";
// =========================================

const CATS = ["Tops", "Pantalones", "Vestidos", "Accesorios", "Zapatos"];
const STATUSES = ["pendiente", "enviado", "entregado", "cancelado"];
const COLOR_OPTIONS = [
  { name: "Pale Pink", hex: "hsl(337, 27%, 83%)" },
  { name: "White", hex: "#f0f0f0" },
  { name: "Black", hex: "rgb(34, 34, 34)" },
  { name: "Azul denim", hex: "#7eb0d4" },
  { name: "Light Brown", hex: "rgba(65, 47, 37, 0.86)" },
];

async function uploadToSupabase(file, onProgress) {
  const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
  onProgress(30);
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fileName}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": file.type,
      "x-upsert": "true",
    },
    body: file,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al subir imagen");
  }
  onProgress(100);
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;
}

function TagInput({ tags, onChange, placeholder }) {
  const [val, setVal] = useState("");
  const handleAdd = (e) => {
    if (e) e.preventDefault();
    const newTag = val.trim().replace(/,$/, ''); 
    if (newTag && !tags.includes(newTag)) { onChange([...tags, newTag]); }
    setVal(""); 
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); handleAdd(); }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: 8, border: "1.5px solid var(--border)", borderRadius: 10, minHeight: 44, background: "white", alignItems: "center" }}>
      {tags.map((t, i) => (
        <span key={i} style={{ background: "var(--dark)", color: "white", padding: "3px 10px", borderRadius: 999, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 4 }}>
          {t}
          <button type="button" onClick={() => onChange(tags.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "rgba(255,255,255,.7)", cursor: "pointer", fontSize: "0.85rem", padding: 0 }}>x</button>
        </span>
      ))}
      <input 
        value={val} onChange={e => setVal(e.target.value)} onKeyDown={handleKeyDown} placeholder={tags.length ? "" : placeholder}
        style={{ border: "none", outline: "none", fontSize: "0.85rem", flex: 1, minWidth: 80, fontFamily: "'Courier New', Courier, monospace", background: "transparent" }} 
      />
      {val.trim() && (
        <button type="button" onClick={handleAdd} style={{ background: "var(--pink-dark)", color: "white", border: "none", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: "1.2rem", lineHeight: 1 }}>+</button>
      )}
    </div>
  );
}

function ImageUploader({ onUploaded }) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("La imagen debe ser menor a 5MB"); return; }
    setError(""); setUploading(true); setProgress(10);
    try {
      const url = await uploadToSupabase(file, setProgress);
      onUploaded(url);
    } catch (err) { setError(`Error: ${err.message}`); } 
    finally { setUploading(false); setProgress(0); e.target.value = null; }
  };

  return (
    <div>
      <div onClick={() => !uploading && inputRef.current.click()} style={{
        border: "2px dashed var(--border)", borderRadius: 12, padding: "1rem",
        textAlign: "center", cursor: uploading ? "default" : "pointer",
        background: "var(--pink-light)", minHeight: 120, display: "flex", flexDirection: "column", justifyContent: "center"
      }}
        onMouseEnter={e => { if (!uploading) e.currentTarget.style.borderColor = "var(--pink-dark)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
      >
        {uploading ? (
          <div>
            <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>subiendo</div>
            <div style={{ fontSize: "0.85rem", color: "var(--gray)", marginBottom: 8 }}>Subiendo... {progress}%</div>
            <div style={{ height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "var(--pink-dark)", transition: "width .3s", borderRadius: 3 }} />
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "2rem", marginBottom: 6 }}>+</div>
            <div style={{ fontSize: "0.85rem", color: "var(--gray)" }}>Clic para subir nueva imagen</div>
            <div style={{ fontSize: "0.75rem", color: "var(--gray)", marginTop: 2 }}>JPG, PNG - max 5MB</div>
          </div>
        )}
      </div>
      {error && <p style={{ color: "var(--danger)", fontSize: "0.82rem", marginTop: 6 }}>{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
    </div>
  );
}

function ProductForm({ initial, onSave, onCancel, isMobile }) {
  const [form, setForm] = useState(() => {
    if (!initial) {
      return { name: "", cat: "", price: "", salePrice: "", stock: 0, description: "", emoji: "", badge: "", sizes: [], colors: [], imageUrls: [] };
    }
    
    let urls = [];
    if (initial.image_urls && initial.image_urls.length > 0) {
      urls = initial.image_urls;
    } else if (initial.image_url || initial.imageUrl) {
      urls = [initial.image_url || initial.imageUrl];
    }

    const initialStock = parseInt(initial.stock, 10);

    return { 
      ...initial, 
      imageUrls: urls, 
      stock: isNaN(initialStock) ? 0 : initialStock,
      sizes: initial.sizes || [],
      colors: initial.colors || []
    };
  });

  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const toggleColor = (colorName) => {
    set("colors", form.colors.includes(colorName) ? form.colors.filter(c => c !== colorName) : [...form.colors, colorName]);
  };

  const handleSave = async () => {
    if (!form.name || !form.cat || !form.price) return alert("Nombre, categoría y precio son obligatorios");
    setSaving(true);
    
    const parsedStock = parseInt(form.stock, 10);
    
    await onSave({ 
      ...form, 
      price: parseFloat(form.price), 
      salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
      stock: isNaN(parsedStock) ? 0 : parsedStock 
    });
    setSaving(false);
  };

  return (
    <div className="card">
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
        
        <div className="form-group" style={{ gridColumn: "1/-1" }}>
          <label className="form-label">Imágenes del producto (Puedes subir varias)</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
            {(form.imageUrls || []).map((img, i) => (
              <div key={i} style={{ position: 'relative', width: 100, height: 120 }}>
                <img src={img} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />
                <button type="button" onClick={() => setForm(p => ({...p, imageUrls: p.imageUrls.filter((_, index) => index !== i)}))} 
                  style={{ position: 'absolute', top: -8, right: -8, background: 'var(--danger)', color: 'white', borderRadius: '50%', width: 24, height: 24, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                  ✕
                </button>
              </div>
            ))}
          </div>
          <ImageUploader onUploaded={url => set("imageUrls", [...(form.imageUrls || []), url])} />
        </div>

        <div className="form-group" style={{ gridColumn: "1/-1" }}>
          <label className="form-label">Nombre del producto *</label>
          <input className="form-input" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ej: Vestido Floral Rosa" />
        </div>
        <div className="form-group">
          <label className="form-label">Categoria *</label>
          <select className="form-input" value={form.cat} onChange={e => set("cat", e.target.value)}>
            <option value="">Seleccionar...</option>
            {CATS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Stock disponible *</label>
          <input className="form-input" type="number" min="0" value={form.stock} onChange={e => set("stock", e.target.value)} placeholder="0" />
        </div>

        <div className="form-group">
          <label className="form-label">Precio (S/) *</label>
          <input className="form-input" type="number" step="0.01" value={form.price} onChange={e => set("price", e.target.value)} placeholder="89.90" />
        </div>
        <div className="form-group">
          <label className="form-label">Precio con oferta (S/)</label>
          <input className="form-input" type="number" step="0.01" value={form.salePrice || ""} onChange={e => set("salePrice", e.target.value)} placeholder="Dejar vacio si no hay" />
        </div>
        
        <div className="form-group" style={{ gridColumn: "1/-1" }}>
          <label className="form-label">Descripcion</label>
          <textarea className="form-input" value={form.description || ""} onChange={e => set("description", e.target.value)} rows={3} placeholder="Material, cuidados, detalles..." style={{ resize: "vertical" }} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Tallas (Enter para agregar)</label>
          <TagInput tags={form.sizes || []} onChange={v => set("sizes", v)} placeholder="XS, S, M, 38, 39..." />
        </div>
        <div className="form-group">
          <label className="form-label">Etiqueta</label>
          <select className="form-input" value={form.badge || ""} onChange={e => set("badge", e.target.value)}>
            <option value="">Sin etiqueta</option>
            <option value="new">Nuevo</option>
            <option value="sale">Oferta</option>
          </select>
        </div>
        
        <div className="form-group" style={{ gridColumn: "1/-1" }}>
          <label className="form-label">Colores disponibles - clic para seleccionar</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, padding: "14px", background: "var(--gray-light)", borderRadius: 10 }}>
            {COLOR_OPTIONS.map(c => (
              <div key={c.name} onClick={() => toggleColor(c.name)} title={c.name} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer",
                opacity: form.colors.includes(c.name) ? 1 : 0.38,
                transform: form.colors.includes(c.name) ? "scale(1.12)" : "scale(1)", transition: "all .15s"
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", background: c.hex,
                  border: form.colors.includes(c.name) ? "3px solid var(--dark)" : "2px solid rgba(0,0,0,.12)",
                  boxShadow: form.colors.includes(c.name) ? "0 0 0 2px white, 0 0 0 4px var(--dark)" : "none", transition: "all .15s"
                }} />
                <span style={{ fontSize: "0.66rem", color: "var(--gray)", whiteSpace: "nowrap" }}>{c.name}</span>
              </div>
            ))}
          </div>
          {form.colors.length > 0 && (
            <div style={{ marginTop: 8, fontSize: "0.82rem", color: "var(--gray)" }}>
              Seleccionados: <strong>{form.colors.join(", ")}</strong>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "0.75rem", marginTop: "1.5rem" }}>
        <button className="btn btn-dark" onClick={handleSave} disabled={saving} style={{ width: isMobile ? "100%" : "auto" }}>{saving ? "Guardando..." : "Guardar producto"}</button>
        <button className="btn btn-outline" onClick={onCancel} style={{ width: isMobile ? "100%" : "auto" }}>Cancelar</button>
      </div>
    </div>
  );
}

// NUEVO COMPONENTE: Formulario para crear pedidos manuales
function OrderForm({ products, onSave, onCancel, isMobile }) {
  const [form, setForm] = useState({ client: "", phone: "", address: "", payment: "Yape / Plin", items: [], total: 0 });

  const addItem = (prod) => {
    const newItem = { id: prod.id, name: prod.name, price: prod.price, qty: 1 };
    setForm(p => ({ ...p, items: [...p.items, newItem], total: p.total + prod.price }));
  };

  const handleSave = () => {
    if (!form.client || !form.phone || form.items.length === 0) return alert("Completa cliente, teléfono e incluye productos");
    onSave(form);
  };

  return (
    <div className="card" style={{ border: "2px solid var(--pink-dark)", marginBottom: "1.5rem" }}>
      <h3 className="serif">Registrar Pedido Manual</h3>
      <div style={{ display: "grid", gap: "10px", marginTop: "10px" }}>
        <input className="form-input" placeholder="Nombre del Cliente" value={form.client} onChange={e => setForm({...form, client: e.target.value})} />
        <input className="form-input" placeholder="Teléfono" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        <input className="form-input" placeholder="Dirección" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
        
        <label className="form-label">Seleccionar Productos:</label>
        <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 10 }}>
          {products.map(p => (
            <button key={p.id} onClick={() => addItem(p)} className="btn btn-outline btn-sm" style={{ whiteSpace: "nowrap" }}>+ {p.name}</button>
          ))}
        </div>

        <div style={{ background: "var(--pink-light)", padding: 10, borderRadius: 8 }}>
          {form.items.map((it, i) => <div key={i} style={{ fontSize: "0.8rem" }}>{it.name} x{it.qty} - S/ {it.price.toFixed(2)}</div>)}
          <div style={{ fontWeight: "bold", marginTop: 5 }}>Total: S/ {form.total.toFixed(2)}</div>
        </div>

        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 10 }}>
          <button className="btn btn-dark" onClick={handleSave}>Guardar Pedido</button>
          <button className="btn btn-outline" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const nav = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, updateOrder, addOrder, deleteOrder } = useOrders(); // Desestructuración de nuevas funciones
  const { expenses, addExpense, deleteExpense } = useExpenses();
  const [panel, setPanel] = useState("dashboard");
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");
  const [chartPeriod, setChartPeriod] = useState("semana"); 
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expForm, setExpForm] = useState({ description: "", amount: "", category: "Operativo" });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const handleLogout = async () => { await logout(); nav("/admin"); };

  const realRevenue = orders.filter(o => o.status === "entregado").reduce((s, o) => s + (o.total || 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const netProfit = realRevenue - totalExpenses;
  const pending = orders.filter(o => o.status === "pendiente").length;

  const getChartData = () => {
    const now = new Date();
    const delivered = orders.filter(o => o.status === "entregado" && o.created_at);
    if (chartPeriod === "dia") {
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now); d.setDate(d.getDate() - (6 - i));
        const label = d.toLocaleDateString("es-PE", { weekday: "short" });
        const total = delivered.filter(o => new Date(o.created_at).toDateString() === d.toDateString()).reduce((s, o) => s + (o.total || 0), 0);
        return { label, total };
      });
    } else if (chartPeriod === "semana") {
      return Array.from({ length: 4 }, (_, i) => {
        const weekStart = new Date(now); weekStart.setDate(weekStart.getDate() - (3 - i) * 7 - weekStart.getDay());
        const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate() + 6);
        const label = `Sem ${i + 1}`;
        const total = delivered.filter(o => {
          const od = new Date(o.created_at); return od >= weekStart && od <= weekEnd;
        }).reduce((s, o) => s + (o.total || 0), 0);
        return { label, total };
      });
    } else {
      return Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now); d.setMonth(d.getMonth() - (5 - i));
        const label = d.toLocaleDateString("es-PE", { month: "short" });
        const total = delivered.filter(o => {
          const od = new Date(o.created_at); return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
        }).reduce((s, o) => s + (o.total || 0), 0);
        return { label, total };
      });
    }
  };

  const topProducts = () => {
    const counts = {};
    orders.filter(o => o.status !== "cancelado").forEach(o => {
      (o.items || []).forEach(item => { counts[item.name] = (counts[item.name] || 0) + (item.qty || 1); });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  };

  const handleAddExpense = async () => {
    if (!expForm.description || !expForm.amount) return showToast("Completa descripción y monto");
    await addExpense({ description: expForm.description, amount: parseFloat(expForm.amount), category: expForm.category });
    setExpForm({ description: "", amount: "", category: "Operativo" });
    setShowExpenseForm(false);
    showToast("Egreso registrado ✓");
  };

  const handleSaveProduct = async (data) => {
    const supabaseData = {
      name: data.name, cat: data.cat, price: data.price, sale_price: data.salePrice || null,
      description: data.description || "", emoji: data.emoji || "", badge: data.badge || null,
      sizes: data.sizes || [], colors: data.colors || [], 
      image_urls: data.imageUrls || [], stock: data.stock || 0
    };
    if (editing && editing !== "new") { await updateProduct(editing.id, supabaseData); showToast("Producto actualizado ✓"); }
    else { await addProduct(supabaseData); showToast("Producto agregado ✓"); }
    setEditing(null); setPanel("productos");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Eliminar este producto?")) return;
    await deleteProduct(id); showToast("Producto eliminado");
  };

  const handleStatusChange = async (order, newStatus) => {
    await updateOrder(order.id, { status: newStatus }); 
    
    if (newStatus === "entregado" && order.status !== "entregado") {
      for (const item of order.items) {
         const { data: pData } = await supabase.from('products').select('stock, ventas_totales').eq('id', item.id).single();
         if (pData) {
            await supabase.from('products').update({
               ventas_totales: (pData.ventas_totales || 0) + item.qty,
               stock: Math.max((pData.stock || 0) - item.qty, 0)
            }, 'id', item.id);
         }
      }
      showToast(`Pedido entregado. Inventario actualizado ✓`);
    } else {
      showToast(`Pedido actualizado a ${newStatus}`);
    }
  };

  // NUEVA LÓGICA: Eliminar pedido
  const handleDeleteOrder = async (id) => {
    if (!window.confirm("¿Eliminar este pedido permanentemente?")) return;
    await deleteOrder(id);
    showToast("Pedido eliminado ✓");
  };

  return (
    <div style={{ display: isMobile ? "flex" : "grid", flexDirection: isMobile ? "column" : "row", gridTemplateColumns: isMobile ? "none" : "220px 1fr", minHeight: "100vh" }}>
      
      {isMobile && (
        <div style={{ background: "var(--dark)", color: "white", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 1000 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo size={24} />
            <span className="serif" style={{ fontSize: "1.1rem" }}>pookiecat admin</span>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer", lineHeight: 1 }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      )}

      <aside style={{ 
        background: "var(--dark)", color: "white", padding: "1.5rem", 
        display: isMobile ? (menuOpen ? "flex" : "none") : "flex", 
        flexDirection: "column", gap: "0.4rem",
        position: isMobile ? "fixed" : "sticky", top: isMobile ? 64 : 0, left: 0, bottom: 0, 
        width: isMobile ? "250px" : "auto", height: isMobile ? "calc(100vh - 64px)" : "100vh", 
        zIndex: 999, boxShadow: isMobile && menuOpen ? "4px 0 20px rgba(0,0,0,0.5)" : "none"
      }}>
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "2rem" }}>
            <Logo size={30} />
            <span className="serif" style={{ fontSize: "1.1rem" }}>pookiecat</span>
          </div>
        )}
        {[{ key: "dashboard", icon: "📊", label: "Dashboard" }, { key: "productos", icon: "👗", label: "Productos" }, { key: "pedidos", icon: "📦", label: "Pedidos" }, { key: "egresos", icon: "💸", label: "Egresos" }].map(item => (
          <button key={item.key} onClick={() => { setPanel(item.key); setEditing(null); if(isMobile) setMenuOpen(false); }} style={{
            display: "flex", alignItems: "center", gap: 10, background: panel === item.key ? "rgba(255,255,255,.12)" : "none",
            border: "none", color: panel === item.key ? "white" : "rgba(255,255,255,.55)",
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontSize: "0.88rem", width: "100%", textAlign: "left"
          }}>{item.icon} {item.label}</button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => nav("/")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", color: "rgba(255,255,255,.55)", padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontSize: "0.88rem", width: "100%", textAlign: "left" }}>
          🏠 Ver tienda
        </button>
        <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", color: "rgba(255,255,255,.4)", padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem", width: "100%", textAlign: "left" }}>
          Cerrar sesion
        </button>
      </aside>

      {isMobile && menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, top: 64, background: "rgba(0,0,0,0.5)", zIndex: 998 }} />
      )}

      <main style={{ padding: isMobile ? "1rem" : "2rem", background: "#f8f6f3", flex: 1, overflowY: "auto", minWidth: 0 }}>
        {panel === "dashboard" && (() => {
          const chartData = getChartData();
          const maxVal = Math.max(...chartData.map(d => d.total), 1);
          const top = topProducts();
          return (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: 10 }}>
              <h2 className="serif" style={{ fontSize: "1.7rem", margin: 0 }}>Dashboard</h2>
              <span style={{ fontSize: "0.82rem", color: "var(--gray)" }}>{new Date().toLocaleDateString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { label: "Productos", value: products.length, sub: "en catálogo", color: "var(--dark)" },
                { label: "Pedidos totales", value: orders.length, sub: "registrados", color: "var(--dark)" },
                { label: "Pendientes", value: pending, sub: "por atender", color: pending > 0 ? "var(--warning)" : "var(--dark)" },
                { label: "Ingresos reales", value: `S/ ${realRevenue.toFixed(2)}`, sub: "solo entregados", color: "var(--success)" },
                { label: "Egresos", value: `S/ ${totalExpenses.toFixed(2)}`, sub: "gastos", color: "var(--danger)" },
                { label: "Ganancia neta", value: `S/ ${netProfit.toFixed(2)}`, sub: "ingresos - egresos", color: netProfit >= 0 ? "var(--success)" : "var(--danger)" },
              ].map(s => (
                <div key={s.label} style={{ background: "white", borderRadius: 12, padding: "1.1rem", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--gray)", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--gray)", marginTop: 2 }}>↑ {s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Ventas (entregados)</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {["dia", "semana", "mes"].map(p => (
                      <button key={p} onClick={() => setChartPeriod(p)} style={{
                        padding: "4px 10px", borderRadius: 999, border: "1px solid var(--border)",
                        background: chartPeriod === p ? "var(--dark)" : "white",
                        color: chartPeriod === p ? "white" : "var(--gray)", fontSize: "0.72rem", cursor: "pointer", fontFamily: "'Courier New', Courier, monospace",
                      }}>{p}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140 }}>
                  {chartData.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
                      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                        <div style={{ width: "100%", height: `${maxVal > 0 ? (d.total / maxVal) * 100 : 0}%`, minHeight: d.total > 0 ? 4 : 0, background: d.total > 0 ? "var(--pink-dark)" : "var(--border)", borderRadius: "4px 4px 0 0", transition: "height .3s ease", position: "relative" }}>
                          {d.total > 0 && ( <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", fontSize: "0.62rem", color: "var(--gray)", whiteSpace: "nowrap" }}>S/{d.total.toFixed(0)}</div> )}
                        </div>
                      </div>
                      <span style={{ fontSize: "0.68rem", color: "var(--gray)" }}>{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: "1.25rem" }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "1rem" }}>Ingresos vs Egresos</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[{ label: "Ingresos reales", value: realRevenue, color: "var(--success)" }, { label: "Egresos", value: totalExpenses, color: "var(--danger)" }, { label: "Ganancia neta", value: netProfit, color: netProfit >= 0 ? "var(--success)" : "var(--danger)" }].map(item => (
                    <div key={item.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--gray)" }}>{item.label}</span>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: item.color }}>S/ {item.value.toFixed(2)}</span>
                      </div>
                      <div style={{ height: 8, background: "var(--border)", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 999, background: item.color, width: `${realRevenue > 0 ? Math.min(Math.abs(item.value) / Math.max(realRevenue, totalExpenses) * 100, 100) : 0}%`, transition: "width .5s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "1.25rem", padding: "0.75rem", background: netProfit >= 0 ? "#d1e7dd" : "#f8d7da", borderRadius: 8 }}>
                  <div style={{ fontSize: "0.75rem", color: netProfit >= 0 ? "var(--success)" : "var(--danger)", fontWeight: 600 }}>
                    {netProfit >= 0 ? "✓ En positivo" : "⚠ En negativo"} — Margen: {realRevenue > 0 ? ((netProfit / realRevenue) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.5rem" }}>
              <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: "1.25rem" }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "1rem" }}>Productos más vendidos</div>
                {top.length === 0 ? (<p style={{ color: "var(--gray)", fontSize: "0.85rem" }}>Sin datos aún</p>) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {top.map(([name, qty], i) => (
                      <div key={name}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: "0.82rem", fontWeight: i === 0 ? 600 : 400 }}>{i === 0 ? "🏆 " : `${i + 1}. `}{name}</span>
                          <span style={{ fontSize: "0.78rem", color: "var(--gray)" }}>{qty} uds</span>
                        </div>
                        <div style={{ height: 6, background: "var(--border)", borderRadius: 999, overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: 999, background: i === 0 ? "var(--pink-dark)" : "var(--border)", width: `${(qty / top[0][1]) * 100}%`, transition: "width .4s ease", backgroundImage: i === 0 ? "none" : "linear-gradient(90deg, var(--pink-dark) 0%, var(--pink) 100%)", backgroundColor: i === 0 ? "var(--pink-dark)" : "var(--pink-light)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: "0.9rem" }}>Últimos pedidos</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "400px" }}>
                    <thead><tr>{["Pedido", "Cliente", "Total", "Estado"].map(h => (<th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "0.7rem", textTransform: "uppercase", color: "var(--gray)", background: "#f8f6f3", borderBottom: "1px solid var(--border)" }}>{h}</th>))}</tr></thead>
                    <tbody>
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "9px 12px", fontSize: "0.82rem", fontWeight: 500 }}>#{o.id?.slice(-6)}</td>
                          <td style={{ padding: "9px 12px", fontSize: "0.82rem" }}>{o.client}</td>
                          <td style={{ padding: "9px 12px", fontSize: "0.82rem" }}>S/ {o.total?.toFixed(2)}</td>
                          <td style={{ padding: "9px 12px" }}><span className={`badge-status badge-${o.status}`}>{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
          );
        })()}

        {panel === "productos" && !editing && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: 10 }}>
              <h2 className="serif" style={{ fontSize: "1.7rem", margin: 0 }}>Productos</h2>
              <button className="btn btn-dark btn-sm" onClick={() => setEditing("new")}>+ Nuevo producto</button>
            </div>
            <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "750px" }}>
                <thead><tr>{["Producto", "Categoria", "Stock", "Precio", "Tallas", "Etiqueta", "Acciones"].map(h => (<th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gray)", background: "#f8f6f3", borderBottom: "1px solid var(--border)" }}>{h}</th>))}</tr></thead>
                <tbody>
                  {products.map(p => {
                    const firstImage = p.image_urls?.[0] || p.image_url || p.imageUrl;
                    
                    const rawStock = parseInt(p.stock, 10);
                    const safeStock = isNaN(rawStock) ? 0 : rawStock;

                    return (
                    <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 42, height: 48, background: "var(--pink-light)", borderRadius: 6, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>
                            {firstImage ? <img src={firstImage} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : p.emoji || "👗"}
                          </div>
                          <span style={{ fontSize: "0.88rem", fontWeight: 500 }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: "0.88rem" }}>{p.cat}</td>
                      <td style={{ padding: "11px 14px", fontSize: "0.88rem", color: safeStock <= 0 ? "var(--danger)" : "var(--dark)", fontWeight: safeStock <= 0 ? "bold" : "normal" }}>
                        {safeStock}
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: "0.88rem" }}>S/ {p.price?.toFixed(2)}{p.sale_price && <div style={{ color: "var(--danger)", fontSize: "0.78rem" }}>→ S/ {p.sale_price.toFixed(2)}</div>}</td>
                      <td style={{ padding: "11px 14px", fontSize: "0.82rem", color: "var(--gray)" }}>{p.sizes?.join(", ") || "-"}</td>
                      <td style={{ padding: "11px 14px" }}>{p.badge ? <span className={`badge-status badge-${p.badge}`}>{p.badge}</span> : "-"}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-outline btn-sm" onClick={() => setEditing(p)}>Editar</button>
                          <button className="btn btn-sm" style={{ border: "1px solid var(--danger)", color: "var(--danger)", background: "none", borderRadius: 999, padding: "5px 12px", fontSize: "0.82rem" }} onClick={() => handleDelete(p.id)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
              {products.length === 0 && <div style={{ textAlign: "center", padding: "3rem", color: "var(--gray)" }}>No hay productos aun.</div>}
            </div>
          </>
        )}

        {panel === "productos" && editing && editing !== "new_order" && (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 className="serif" style={{ fontSize: "1.7rem", margin: 0 }}>{editing === "new" ? "Nuevo Producto" : "Editar Producto"}</h2>
            </div>
            <ProductForm initial={editing !== "new" ? editing : undefined} onSave={handleSaveProduct} onCancel={() => setEditing(null)} isMobile={isMobile} />
          </>
        )}

        {panel === "pedidos" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 className="serif" style={{ fontSize: "1.7rem", margin: 0 }}>Pedidos</h2>
              {/* BOTÓN PARA ABRIR FORMULARIO DE NUEVO PEDIDO */}
              <button className="btn btn-dark btn-sm" onClick={() => setEditing(editing === "new_order" ? null : "new_order")}>
                {editing === "new_order" ? "✕ Cancelar" : "+ Crear Pedido Manual"}
              </button>
            </div>

            {/* RENDERIZADO DEL FORMULARIO DE PEDIDO */}
            {editing === "new_order" ? (
              <OrderForm 
                products={products} 
                onCancel={() => setEditing(null)} 
                onSave={async (data) => {
                  await addOrder({ ...data, status: "pendiente", created_at: new Date().toISOString() });
                  setEditing(null);
                  showToast("Pedido registrado ✓");
                }} 
                isMobile={isMobile}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {orders.length === 0 && <div style={{ textAlign: "center", padding: "3rem", color: "var(--gray)", background: "white", borderRadius: 12, border: "1px solid var(--border)" }}>No hay pedidos aun.</div>}
                {orders.map(o => (
                  <div key={o.id} style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: "0.95rem" }}>#{o.id?.slice(-6)} - {o.client}</div>
                        <div style={{ fontSize: "0.82rem", color: "var(--gray)", marginTop: 2 }}>Tel: {o.phone} | Dir: {o.address}</div>
                        <div style={{ fontSize: "0.82rem", color: "var(--gray)" }}>Pago: {o.payment}</div>
                      </div>
                      <div style={{ textAlign: isMobile ? "left" : "right" }}>
                        <div style={{ fontWeight: 600, fontSize: "1.05rem" }}>S/ {o.total?.toFixed(2)}</div>
                        <span className={`badge-status badge-${o.status}`} style={{ marginTop: 4, display: "inline-block" }}>{o.status}</span>
                        {/* BOTÓN PARA ELIMINAR PEDIDO */}
                        <div style={{ marginTop: 8 }}>
                          <button 
                            onClick={() => handleDeleteOrder(o.id)}
                            style={{ background: "none", border: "1px solid var(--danger)", color: "var(--danger)", padding: "2px 8px", borderRadius: 5, fontSize: "0.7rem", cursor: "pointer" }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div style={{ fontSize: "0.82rem", color: "var(--gray)" }}>
                        {o.items?.map((i, idx) => (<span key={idx}>{i.name}{i.size ? ` (${i.size})` : ""} x{i.qty}{idx < o.items.length - 1 ? " · " : ""}</span>))}
                      </div>
                      <select className="form-input" style={{ width: isMobile ? "100%" : "auto", padding: "6px 12px", fontSize: "0.82rem" }} value={o.status} onChange={e => handleStatusChange(o, e.target.value)}>
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {panel === "egresos" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: 10 }}>
              <h2 className="serif" style={{ fontSize: "1.7rem", margin: 0 }}>Egresos</h2>
              <button className="btn btn-dark btn-sm" onClick={() => setShowExpenseForm(p => !p)}>
                {showExpenseForm ? "✕ Cancelar" : "+ Registrar egreso"}
              </button>
            </div>

            {showExpenseForm && (
              <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: "1.25rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
                  <div className="form-group">
                    <label className="form-label">Descripción *</label>
                    <input className="form-input" placeholder="Ej: Compra de telas" value={expForm.description} onChange={e => setExpForm(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Monto (S/) *</label>
                    <input className="form-input" type="number" step="0.01" placeholder="0.00" value={expForm.amount} onChange={e => setExpForm(p => ({ ...p, amount: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Categoría</label>
                    <select className="form-input" value={expForm.category} onChange={e => setExpForm(p => ({ ...p, category: e.target.value }))}>
                      <option>Operativo</option><option>Insumos</option><option>Transporte</option><option>Marketing</option><option>Servicios</option><option>Otro</option>
                    </select>
                  </div>
                  <button className="btn btn-dark" onClick={handleAddExpense} style={{ height: 42, width: isMobile ? "100%" : "auto" }}>Guardar</button>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "white", borderRadius: 12, padding: "1.1rem", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.78rem", color: "var(--gray)", marginBottom: 4 }}>Total egresos</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--danger)" }}>S/ {expenses.reduce((s, e) => s + (e.amount || 0), 0).toFixed(2)}</div>
              </div>
              <div style={{ background: "white", borderRadius: 12, padding: "1.1rem", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.78rem", color: "var(--gray)", marginBottom: 4 }}>Ingresos reales</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--success)" }}>S/ {realRevenue.toFixed(2)}</div>
              </div>
              <div style={{ background: "white", borderRadius: 12, padding: "1.1rem", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.78rem", color: "var(--gray)", marginBottom: 4 }}>Ganancia neta</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: netProfit >= 0 ? "var(--success)" : "var(--danger)" }}>S/ {netProfit.toFixed(2)}</div>
              </div>
            </div>

            <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                <thead><tr>{["Descripción", "Categoría", "Monto", "Fecha", ""].map(h => (<th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.72rem", textTransform: "uppercase", color: "var(--gray)", background: "#f8f6f3", borderBottom: "1px solid var(--border)" }}>{h}</th>))}</tr></thead>
                <tbody>
                  {expenses.length === 0 && (<tr><td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "var(--gray)" }}>No hay egresos registrados aún.</td></tr>)}
                  {expenses.map(e => (
                    <tr key={e.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "11px 14px", fontSize: "0.88rem", fontWeight: 500 }}>{e.description}</td>
                      <td style={{ padding: "11px 14px" }}><span style={{ background: "var(--gray-light)", padding: "3px 10px", borderRadius: 999, fontSize: "0.75rem" }}>{e.category}</span></td>
                      <td style={{ padding: "11px 14px", fontSize: "0.88rem", color: "var(--danger)", fontWeight: 600 }}>S/ {e.amount?.toFixed(2)}</td>
                      <td style={{ padding: "11px 14px", fontSize: "0.82rem", color: "var(--gray)" }}>{e.created_at ? new Date(e.created_at).toLocaleDateString("es-PE") : "—"}</td>
                      <td style={{ padding: "11px 14px" }}><button onClick={() => { if(window.confirm("¿Eliminar este egreso?")) { deleteExpense(e.id); showToast("Egreso eliminado"); } }} style={{ background: "none", border: "1px solid var(--danger)", color: "var(--danger)", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: "0.75rem" }}>Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {toast && (
        <div style={{ position: "fixed", bottom: "2rem", right: "2rem", background: "var(--dark)", color: "white", padding: "12px 20px", borderRadius: 12, zIndex: 9999, fontSize: "0.88rem" }}>
          {toast}
        </div>
      )}
    </div>
  );
}