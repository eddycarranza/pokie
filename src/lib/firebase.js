import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; 
// Tus credenciales reales de PookieCat
const firebaseConfig = {
  apiKey: "AIzaSyBg_0QETwcQm33oJNqR-ivR3TtZpcvRfvI",
  authDomain: "pookiecat-a8e42.firebaseapp.com",
  projectId: "pookiecat-a8e42",
  storageBucket: "pookiecat-a8e42.firebasestorage.app",
  messagingSenderId: "362217978198",
  appId: "1:362217978198:web:e94bafc7b927fb358afef7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); 