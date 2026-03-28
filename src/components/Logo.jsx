// src/components/Logo.jsx

export default function Logo({ size = 30 }) {
  // Pega tu link de Supabase aquí adentro:
  const linkSupabase = "https://dsxtauxcbyeumkdbhtxj.supabase.co/storage/v1/object/public/products/pokie.jpg";

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%", 
      overflow: "hidden", 
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "white", 
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
    }}>
      <img
        src={linkSupabase} 
        alt="PookieCat Logo"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    </div>
  );
}