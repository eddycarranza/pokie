// src/components/Logo.jsx
export default function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="18" fill="#fce8f1"/>
      <ellipse cx="18" cy="20" rx="10" ry="9" fill="#f2a7c3"/>
      <ellipse cx="18" cy="19" rx="8" ry="7" fill="#fce8f1"/>
      <circle cx="15" cy="18" r="1.5" fill="#1a1a1a"/>
      <circle cx="21" cy="18" r="1.5" fill="#1a1a1a"/>
      <path d="M15 21.5 Q18 23.5 21 21.5" stroke="#c9607f" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <polygon points="12,10 14,15 10,15" fill="#f2a7c3"/>
      <polygon points="24,10 26,15 22,15" fill="#f2a7c3"/>
      <circle cx="18" cy="22" r="1" fill="#c9607f" opacity=".5"/>
      <path d="M11 17 L8 17" stroke="#c9607f" strokeWidth="1" strokeLinecap="round"/>
      <path d="M25 17 L28 17" stroke="#c9607f" strokeWidth="1" strokeLinecap="round"/>
      <path d="M18 26 L17 28 L18 27.5 L19 28 Z" fill="#f2a7c3"/>
      <polygon points="18,13 18.5,14.5 20,14.5 18.9,15.4 19.3,16.9 18,16 16.7,16.9 17.1,15.4 16,14.5 17.5,14.5" fill="#c9607f" opacity=".7"/>
    </svg>
  );
}
