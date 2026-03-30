// src/lib/supabase.js

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log de depuración: aparecerá en la consola del navegador (F12)
console.log("Conexión activa a:", SUPABASE_URL ? "URL detectada" : "URL NO DETECTADA");

export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }) => {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { 
          apikey: SUPABASE_ANON_KEY, 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: data };
      return { data, error: null };
    },
    getSession: async () => {
      return { data: { session: null } };
    },
    signOut: async () => {}
  },
  from: (table) => ({
    select: async (cols = "*") => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${cols}&order=created_at.desc`, {
        headers: { 
          apikey: SUPABASE_ANON_KEY, 
          Authorization: `Bearer ${SUPABASE_ANON_KEY}` 
        }
      });
      const data = await res.json();
      return { data, error: res.ok ? null : data };
    },
    insert: async (body) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: "POST",
        headers: { 
          apikey: SUPABASE_ANON_KEY, 
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 
          "Content-Type": "application/json", 
          Prefer: "return=representation" 
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      return { data, error: res.ok ? null : data };
    },
    update: async (body, matchCol, matchVal) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${matchCol}=eq.${matchVal}`, {
        method: "PATCH",
        headers: { 
          apikey: SUPABASE_ANON_KEY, 
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 
          "Content-Type": "application/json", 
          Prefer: "return=representation" 
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      return { data, error: res.ok ? null : data };
    },
    delete: async (matchCol, matchVal) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${matchCol}=eq.${matchVal}`, {
        method: "DELETE",
        headers: { 
          apikey: SUPABASE_ANON_KEY, 
          Authorization: `Bearer ${SUPABASE_ANON_KEY}` 
        }
      });
      const errorData = res.ok ? null : await res.json();
      return { error: errorData };
    }
  }),
  storage: {
    upload: async (bucket, file) => {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${fileName}`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 
          "Content-Type": file.type, 
          "x-upsert": "true" 
        },
        body: file,
      });
      if (!res.ok) { 
        const err = await res.json(); 
        throw new Error(err.message || "Error subiendo imagen"); 
      }
      return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
    }
  }
};