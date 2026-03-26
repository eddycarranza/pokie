// src/pages/AdminLogin.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function AdminLogin() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(email, pass);
      nav("/admin/dashboard");
    } catch {
      setError("Credenciales incorrectas. Verifica tu email y contraseña.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "white", borderRadius: 20, border: "1px solid var(--border)", padding: "2.5rem", width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Logo size={52} />
          <h1 className="serif" style={{ fontSize: "1.6rem", marginTop: 12 }}>Panel Admin</h1>
          <p style={{ color: "var(--gray)", fontSize: "0.88rem", marginTop: 4 }}>PookieCat — Acceso restringido</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="admin@pookiecat.pe" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input className="form-input" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} required />
          </div>
          {error && <p style={{ color: "var(--danger)", fontSize: "0.85rem", textAlign: "center" }}>⚠ {error}</p>}
          <button type="submit" className="btn btn-dark btn-full" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "Ingresando..." : "Ingresar →"}
          </button>
        </form>
      </div>
    </div>
  );
}
