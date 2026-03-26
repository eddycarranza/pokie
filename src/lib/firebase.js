import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// AQUÍ PEGA TUS DATOS REALES DE LA CONSOLA
const firebaseConfig = {
  apiKey: "AIzaSy..." , // Tu clave real empieza con AIza...
  authDomain: "pookiecat-36221.firebaseapp.com", // El número que viste en tu captura anterior
  projectId: "pookiecat-36221",
  storageBucket: "pookiecat-36221.appspot.com",
  messagingSenderId: "9876543210",
  appId: "1:9876543210:web:abcdef..."
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);