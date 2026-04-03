export const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const getAuthHeaders = () => {
  const token = localStorage.getItem("admin_token");
  return token 
    ? { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` }
    : { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` };
};

export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }) => {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: data };
      return { data, error: null };
    }
  },
  from: (table) => ({
    select: async (cols = "*") => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${cols}&order=created_at.desc`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      return { data, error: res.ok ? null : data };
    },
    insert: async (body) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      return { data, error: res.ok ? null : data };
    },
    update: async (body, matchCol, matchVal) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${matchCol}=eq.${matchVal}`, {
        method: "PATCH",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      return { data, error: res.ok ? null : data };
    },
    delete: async (matchCol, matchVal) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${matchCol}=eq.${matchVal}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      return { error: res.ok ? null : await res.json() };
    }
  }),
  storage: {
    upload: async (bucket, file) => {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${fileName}`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": file.type, "x-upsert": "true" },
        body: file,
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Error subiendo imagen"); }
      return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
    }
  }
};