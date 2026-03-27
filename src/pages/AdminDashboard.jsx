// src/pages/AdminDashboard.jsx
import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProducts, useOrders } from "../hooks/useFirestore";
import Logo from "../components/Logo";

// ============ SUPABASE CONFIG ============
const SUPABASE_URL = "https://dsxtauxcbyeumkdbhtxj.supabase.co";           // ej: https://dsxtauxcbyeumkdbhtxj.supabase.co
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeHRhdXhjYnlldW1rZGJodHhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjMxNzgsImV4cCI6MjA5MDEzOTE3OH0.CZPiBgf5Gmrsuq3TTzIphI5stuEVy-w4TqAIfo-QsO4"; // la Clave anónima larga
const BUCKET = "products";
// =========================================

const CATS = ["Tops", "Pantalones", "Vestidos", "Conjuntos", "Accesorios", "Calzado"];
const STATUSES = ["pendiente", "enviado", "entregado", "cancelado"];
const COLOR_OPTIONS = [
  { name: "Rosa", hex: "#f2a7c3" }, { name: "Blanco", hex: "#f0f0f0" },
  { name: "Negro", hex: "#1a1a1a" }, { name: "Beige", hex: "#d4c5a9" },
  { name: "Lila", hex: "#c9b1e8" }, { name: "Verde", hex: "#a8d5a2" },
  { name: "Azul denim", hex: "#7eb0d4" }, { name: "Rojo", hex: "#e05252" },
  { name: "Nude", hex: "#e8c9b0" }, { name: "Celeste", hex: "#a8d8ea" },
  { name: "Mostaza", hex: "#e8b84b" }, { name: "Naranja", hex: "#f0a060" },
  { name: "Gris", hex: "#9e9e9e" }, { name: "Marrón", hex: "#8d6748" },
  { name: "Plateado", hex: "#c0c0c0" }, { name: "Dorado", hex: "#d4a843" },
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
  const add = (e) => {
    if (e.key === "Enter" && val.trim()) { e.preventDefault(); onChange([...tags, val.trim()]); setVal(""); }
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: 8, border: "1.5px solid var(--border)", borderRadius: 10, minHeight: 44, background: "white" }}>
      {tags.map((t, i) => (
        <span key={i} style={{ background: "var(--dark)", color: "white", padding: "3px 10px", borderRadius: 999, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 4 }}>
          {t}
          <button onClick={() => onChange(tags.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "rgba(255,255,255,.7)", cursor: "pointer", fontSize: "0.85rem" }}>x</button>
        </span>
      ))}
      <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={add}
        placeholder={tags.length ? "" : placeholder}
        style={{ border: "none", outline: "none", fontSize: "0.85rem", flex: 1, minWidth: 80, fontFamily: "'DM Sans',sans-serif" }} />
    </div>
  );
}

function ImageUploader({ imageUrl, onUploaded }) {
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
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally { setUploading(false); setProgress(0); }
  };

  return (
    <div>
      <div onClick={() => !uploading && inputRef.current.click()} style={{
        border: "2px dashed var(--border)", borderRadius: 12, padding: "1rem",
        textAlign: "center", cursor: uploading ? "default" : "pointer",
        background: imageUrl ? "white" : "var(--pink-light)", minHeight: 120,
      }}
        onMouseEnter={e => { if (!uploading) e.currentTarget.style.borderColor = "var(--pink-dark)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
      >
        {imageUrl ? (
          <div>
            <img src={imageUrl} alt="preview" style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 8, display: "block" }} />
            <div style={{ marginTop: 8, fontSize: "0.78rem", color: "var(--gray)" }}>Clic para cambiar imagen</div>
          </div>
        ) : uploading ? (
          <div>
            <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>subiendo</div>
            <div style={{ fontSize: "0.85rem", color: "var(--gray)", marginBottom: 8 }}>Subiendo... {progress}%</div>
            <div style={{ height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "var(--pink-dark)", transition: "width .3s", borderRadius: 3 }} />
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "2rem", marginBottom: 6 }}>foto</div>
            <div style={{ fontSize: "0.85rem", color: "var(--gray)" }}>Clic para subir imagen</div>
            <div style={{ fontSize: "0.75rem", color: "var(--gray)", marginTop: 2 }}>JPG, PNG - max 5MB</div>
          </div>
        )}
      </div>
      {error && <p style={{ color: "var(--danger)", fontSize: "0.82rem", marginTop: 6 }}>{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
    </div>
  );
}

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: "", cat: "", price: "", salePrice: "", desc: "", emoji: "", badge: "", sizes: [], colors: [], imageUrl: "" });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const toggleColor = (colorName) => {
    set("colors", form.colors.includes(colorName) ? form.colors.filter(c => c !== colorName) : [...form.colors, colorName]);
  };

  const handleSave = async () => {
    if (!form.name || !form.cat || !form.price) return alert("Nombre, categoria y precio son obligatorios");
    setSaving(true);
    await onSave({ ...form, price: parseFloat(form.price), salePrice: form.salePrice ? parseFloat(form.salePrice) : null });
    setSaving(false);
  };

  return (
    <div className="card">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="form-group" style={{ gridColumn: "1/-1" }}>
          <label className="form-label">Imagen del producto</label>
          <ImageUploader imageUrl={form.imageUrl} onUploaded={url => set("imageUrl", url)} />
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
          <label className="form-label">Emoji / icono (opcional)</label>
          <input className="form-input" value={form.emoji} onChange={e => set("emoji", e.target.value)} placeholder="👗 🩱 👚 👜 👟" />
        </div>
        <div className="form-group">
          <label className="form-label">Precio (S/) *</label>
          <input className="form-input" type="number" step="0.01" value={form.price} onChange={e => set("price", e.target.value)} placeholder="89.90" />
        </div>
        <div className="form-group">
          <label className="form-label">Precio con oferta (S/)</label>
          <input className="form-input" type="number" step="0.01" value={form.salePrice} onChange={e => set("salePrice", e.target.value)} placeholder="Dejar vacio si no hay" />
        </div>
        <div className="form-group" style={{ gridColumn: "1/-1" }}>
          <label className="form-label">Descripcion</label>
          <textarea className="form-input" value={form.desc} onChange={e => set("desc", e.target.value)} rows={3} placeholder="Material, cuidados, detalles..." style={{ resize: "vertical" }} />
        </div>
        <div className="form-group">
          <label className="form-label">Tallas (Enter para agregar)</label>
          <TagInput tags={form.sizes} onChange={v => set("sizes", v)} placeholder="XS, S, M, 38, 39..." />
        </div>
        <div className="form-group">
          <label className="form-label">Etiqueta</label>
          <select className="form-input" value={form.badge} onChange={e => set("badge", e.target.value)}>
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
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
        <button className="btn btn-dark" onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar producto"}</button>
        <button className="btn btn-outline" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const nav = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, updateOrder } = useOrders();
  const [panel, setPanel] = useState("dashboard");
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const handleLogout = async () => { await logout(); nav("/admin"); };
  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pending = orders.filter(o => o.status === "pendiente").length;

  const handleSaveProduct = async (data) => {
    if (editing && editing !== "new") { await updateProduct(editing.id, data); showToast("Producto actualizado"); }
    else { await addProduct(data); showToast("Producto agregado"); }
    setEditing(null); setPanel("productos");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Eliminar este producto?")) return;
    await deleteProduct(id); showToast("Producto eliminado");
  };

  const handleStatusChange = async (id, status) => {
    await updateOrder(id, { status }); showToast(`Pedido actualizado a ${status}`);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      <aside style={{ background: "var(--dark)", color: "white", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "2rem" }}>
          <Logo size={30} />
          <span className="serif" style={{ fontSize: "1.1rem" }}>PookieCat</span>
        </div>
        {[{ key: "dashboard", icon: "📊", label: "Dashboard" }, { key: "productos", icon: "👗", label: "Productos" }, { key: "pedidos", icon: "📦", label: "Pedidos" }].map(item => (
          <button key={item.key} onClick={() => { setPanel(item.key); setEditing(null); }} style={{
            display: "flex", alignItems: "center", gap: 10,
            background: panel === item.key ? "rgba(255,255,255,.12)" : "none",
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

      <main style={{ padding: "2rem", background: "#f8f6f3", overflowY: "auto" }}>
        {panel === "dashboard" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 className="serif" style={{ fontSize: "1.7rem" }}>Dashboard</h2>
              <span style={{ fontSize: "0.82rem", color: "var(--gray)" }}>{new Date().toLocaleDateString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {[{ label: "Productos", value: products.length, sub: "en catalogo" }, { label: "Pedidos", value: orders.length, sub: "total" }, { label: "Pendientes", value: pending, sub: "por atender", color: pending > 0 ? "var(--warning)" : undefined }, { label: "Ingresos", value: `S/ ${revenue.toFixed(2)}`, sub: "estimado" }].map(s => (
                <div key={s.label} style={{ background: "white", borderRadius: 12, padding: "1.1rem", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--gray)", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: "1.7rem", fontWeight: 500, color: s.color || "var(--dark)" }}>{s.value}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--success)", marginTop: 2 }}>↑ {s.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", fontWeight: 500 }}>Ultimos pedidos</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Pedido", "Cliente", "Total", "Estado"].map(h => (<th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gray)", background: "#f8f6f3", borderBottom: "1px solid var(--border)" }}>{h}</th>))}</tr></thead>
                <tbody>
                  {orders.slice(0, 6).map(o => (
                    <tr key={o.id}>
                      <td style={{ padding: "11px 14px", fontSize: "0.88rem", fontWeight: 500 }}>#{o.id?.slice(-6)}</td>
                      <td style={{ padding: "11px 14px", fontSize: "0.88rem" }}>{o.client}</td>
                      <td style={{ padding: "11px 14px", fontSize: "0.88rem" }}>S/ {o.total?.toFixed(2)}</td>
                      <td style={{ padding: "11px 14px" }}><span className={`badge-status badge-${o.status}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {panel === "productos" && !editing && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 className="serif" style={{ fontSize: "1.7rem" }}>Productos</h2>
              <button className="btn btn-dark btn-sm" onClick={() => setEditing("new")}>+ Nuevo producto</button>
            </div>
            <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Producto", "Categoria", "Precio", "Tallas", "Etiqueta", "Acciones"].map(h => (<th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gray)", background: "#f8f6f3", borderBottom: "1px solid var(--border)" }}>{h}</th>))}</tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 42, height: 48, background: "var(--pink-light)", borderRadius: 6, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>
                            {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : p.emoji || "👗"}
                          </div>
                          <span style={{ fontSize: "0.88rem", fontWeight: 500 }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: "0.88rem" }}>{p.cat}</td>
                      <td style={{ padding: "11px 14px", fontSize: "0.88rem" }}>S/ {p.price?.toFixed(2)}{p.salePrice && <div style={{ color: "var(--danger)", fontSize: "0.78rem" }}>S/ {p.salePrice.toFixed(2)}</div>}</td>
                      <td style={{ padding: "11px 14px", fontSize: "0.82rem", color: "var(--gray)" }}>{p.sizes?.join(", ") || "-"}</td>
                      <td style={{ padding: "11px 14px" }}>{p.badge ? <span className={`badge-status badge-${p.badge}`}>{p.badge}</span> : "-"}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-outline btn-sm" onClick={() => setEditing(p)}>Editar</button>
                          <button className="btn btn-sm" style={{ border: "1px solid var(--danger)", color: "var(--danger)", background: "none", borderRadius: 999, padding: "5px 12px", fontSize: "0.82rem" }} onClick={() => handleDelete(p.id)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && <div style={{ textAlign: "center", padding: "3rem", color: "var(--gray)" }}>No hay productos aun.</div>}
            </div>
          </>
        )}

        {panel === "productos" && editing && (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 className="serif" style={{ fontSize: "1.7rem" }}>{editing === "new" ? "Nuevo Producto" : "Editar Producto"}</h2>
            </div>
            <ProductForm initial={editing !== "new" ? editing : undefined} onSave={handleSaveProduct} onCancel={() => setEditing(null)} />
          </>
        )}

        {panel === "pedidos" && (
          <>
            <div style={{ marginBottom: "1.5rem" }}><h2 className="serif" style={{ fontSize: "1.7rem" }}>Pedidos</h2></div>
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
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 600, fontSize: "1.05rem" }}>S/ {o.total?.toFixed(2)}</div>
                      <span className={`badge-status badge-${o.status}`} style={{ marginTop: 4, display: "inline-block" }}>{o.status}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div style={{ fontSize: "0.82rem", color: "var(--gray)" }}>
                      {o.items?.map((i, idx) => (<span key={idx}>{i.name}{i.size ? ` (${i.size})` : ""} x{i.qty}{idx < o.items.length - 1 ? " · " : ""}</span>))}
                    </div>
                    <select className="form-input" style={{ width: "auto", padding: "6px 12px", fontSize: "0.82rem" }} value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)}>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ))}
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
