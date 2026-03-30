import { createClient } from '@supabase/supabase-js'

// Vite lee estas variables desde Vercel o tu archivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validación rápida para que sepas si falta algo
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Error: Faltan las variables de entorno de Supabase.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)