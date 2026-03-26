import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Pega aquí el bloque que copiaste de la consola de Firebase
const firebaseConfig = {
  apiKey: "AIzaSy...", 
  authDomain: "pookiecat-xxx.firebaseapp.com",
  projectId: "pookiecat-xxx",
  storageBucket: "pookiecat-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios para usarlos en el resto de la app
export const db = getFirestore(app);
export const auth = getAuth(app);