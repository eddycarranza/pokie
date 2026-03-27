// src/pages/AdminLogin.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Esto ahora llamará a Supabase gracias a tu nuevo AuthContext
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Credenciales incorrectas. Verifica tu email y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fdf8fa" }}>
      <div style={{ background: "white", padding: "3rem 2.5rem", borderRadius: 24, width: "100%", maxWidth: 400, boxShadow: "0 10px 40px rgba(0,0,0,.05)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Logo size={48} />
          <h1 className="serif" style={{ fontSize: "2rem", marginTop: 16 }}>Panel Admin</h1>
          <p style={{ color: "var(--gray)", fontSize: "0.9rem", marginTop: 8 }}>PookieCat — Acceso restringido</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" required className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input type="password" required className="form-input" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          {error && <div style={{ color: "var(--danger)", fontSize: "0.85rem", textAlign: "center" }}>⚠ {error}</div>}

          <button type="submit" disabled={loading} className="btn btn-dark btn-full" style={{ marginTop: "0.5rem" }}>
            {loading ? "Verificando..." : "Ingresar →"}
          </button>
        </form>
      </div>
    </div>
  );
}