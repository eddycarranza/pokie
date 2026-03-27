import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // ¡Conectando al nuevo motor!

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (supabase.auth && supabase.auth.getSession) {
        const { data } = await supabase.auth.getSession();
        setUser(data?.session?.user || null);
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    // Llama a la función de login manual que agregamos a supabase.js
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error || !data.access_token) {
      throw new Error("Credenciales incorrectas");
    }
    
    // Guardamos un usuario temporal en el estado
    setUser({ email }); 
    return data;
  };

  const logout = async () => {
    if (supabase.auth && supabase.auth.signOut) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);