# 🐱 PookieCat — Guía de Configuración Completa

## Stack usado
- **React** — Interfaz de usuario
- **Firebase** (Firestore + Auth) — Base de datos + login admin
- **Netlify** — Hosting gratuito, proyectos ilimitados
- **WhatsApp** — Recepción de pedidos automática

---

## PASO 1 — Crear proyecto Firebase

1. Ve a **https://console.firebase.google.com**
2. Clic en **"Agregar proyecto"**
3. Nombre: `pookiecat` → Continuar
4. Deshabilita Google Analytics (no lo necesitas) → Crear proyecto

### 1.1 Activar Firestore
1. En el menú izquierdo → **Firestore Database**
2. Clic **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de prueba"** (luego cambiaremos las reglas)
4. Elige la región: `us-east1` → Habilitar

### 1.2 Activar Authentication
1. En el menú izquierdo → **Authentication**
2. Clic **"Comenzar"**
3. En la pestaña **"Sign-in method"** → Habilitar **"Correo electrónico/contraseña"**
4. Guardar

### 1.3 Crear tu cuenta de admin
1. En Authentication → pestaña **"Users"**
2. Clic **"Agregar usuario"**
3. Email: `admin@pookiecat.pe` (o el que quieras)
4. Contraseña: la que prefieras (mínimo 6 caracteres)
5. Guardar — ¡estas son tus credenciales para entrar al panel!

### 1.4 Obtener credenciales Firebase
1. En **Configuración del proyecto** (ícono ⚙ arriba a la izquierda)
2. Baja hasta **"Tus apps"** → Clic **"</>"** (Web)
3. Nombre de la app: `pookiecat-web` → Registrar app
4. Copia el objeto `firebaseConfig` que aparece

---

## PASO 2 — Configurar el proyecto

Abre el archivo `src/lib/firebase.js` y reemplaza los valores:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",           // ← tu valor
  authDomain: "pookiecat-xxx.firebaseapp.com",
  projectId: "pookiecat-xxx",
  storageBucket: "pookiecat-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

---

## PASO 3 — Reglas de seguridad Firestore

En Firebase Console → Firestore → pestaña **"Reglas"**, pega esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Productos: cualquiera puede leer, solo admin autenticado puede escribir
    match /products/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Pedidos: cualquiera puede crear (el cliente hace el pedido),
    // solo admin autenticado puede leer/actualizar
    match /orders/{id} {
      allow create: if true;
      allow read, update: if request.auth != null;
    }
  }
}
```

Clic **"Publicar"**

---

## PASO 4 — Correr el proyecto localmente

Necesitas tener **Node.js** instalado (https://nodejs.org).

```bash
# 1. Entra a la carpeta del proyecto
cd pookiecat

# 2. Instala dependencias
npm install

# 3. Inicia el servidor local
npm start
```

Se abrirá en **http://localhost:3000**

- Tienda pública → `http://localhost:3000/`
- Panel admin → `http://localhost:3000/admin`

---

## PASO 5 — Deploy en Netlify (gratis, proyectos ilimitados)

### Opción A — Drag & Drop (más fácil, sin Git)

```bash
# Genera la carpeta de producción
npm run build
```

1. Ve a **https://app.netlify.com**
2. Inicia sesión (con Google o GitHub)
3. En la pantalla principal → **"Add new site"** → **"Deploy manually"**
4. Arrastra la carpeta **`build/`** que se generó
5. ¡Listo! Te dará una URL tipo `https://pookiecat-abc123.netlify.app`

### Opción B — Con GitHub (recomendado para actualizaciones fáciles)

1. Sube el proyecto a GitHub
2. En Netlify → **"Import from Git"** → conecta tu repo
3. Build command: `npm run build`
4. Publish directory: `build`
5. Deploy

**Cada vez que hagas cambios y los subas a GitHub, Netlify actualiza el sitio automáticamente.**

---

## PASO 6 — Dominio personalizado (opcional)

Si tienes `pookiecat.pe`:
1. En Netlify → tu sitio → **"Domain management"**
2. **"Add a domain"** → escribe `pookiecat.pe`
3. Sigue las instrucciones para apuntar los DNS

---

## Cómo funciona el flujo de pedidos

```
Cliente agrega productos al carrito
        ↓
Llena sus datos (nombre, dirección, pago)
        ↓
Clic "Enviar pedido por WhatsApp"
        ↓
Se guarda el pedido en Firestore (Firebase)
        ↓
Se abre WhatsApp con mensaje pre-armado → 948761303
        ↓
Tú ves el pedido en el panel /admin/dashboard
        ↓
Actualizas el estado: pendiente → enviado → entregado
```

---

## Estructura del proyecto

```
pookiecat/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          ← Barra de navegación
│   │   ├── Logo.jsx            ← Logo gatito SVG
│   │   ├── ProductCard.jsx     ← Tarjeta de producto
│   │   ├── ProductModal.jsx    ← Modal de detalle
│   │   ├── CartSidebar.jsx     ← Carrito lateral + WhatsApp
│   │   └── ProtectedRoute.jsx  ← Protege el /admin
│   ├── context/
│   │   ├── CartContext.jsx     ← Estado del carrito
│   │   └── AuthContext.jsx     ← Login admin
│   ├── hooks/
│   │   └── useFirestore.js     ← Productos y pedidos en Firebase
│   ├── lib/
│   │   └── firebase.js         ← ⚠️ Aquí van tus credenciales
│   ├── pages/
│   │   ├── Home.jsx            ← Tienda pública
│   │   ├── AdminLogin.jsx      ← Login /admin
│   │   └── AdminDashboard.jsx  ← Panel de gestión
│   ├── App.jsx                 ← Rutas principales
│   ├── index.css               ← Estilos globales
│   └── index.js                ← Entrada de React
├── netlify.toml                ← Config Netlify (SPA routing)
└── package.json
```

---

## Agregar productos

1. Ve a `tu-sitio.netlify.app/admin`
2. Ingresa con tu email y contraseña de Firebase Auth
3. Panel → **"Productos"** → **"+ Nuevo producto"**
4. Llena: nombre, categoría, precio, emoji, tallas, colores
5. Guardar → aparece al instante en la tienda pública

---

## Preguntas frecuentes

**¿El admin se ve en la tienda?**
No. La ruta `/admin` no aparece en ningún menú de la tienda. Solo quien sepa la URL puede acceder, y necesita usuario + contraseña de Firebase.

**¿Es gratis para siempre?**
- Firebase: gratuito hasta ~50,000 lecturas/día (más que suficiente para empezar)
- Netlify: proyectos ilimitados gratis, 100GB de bandwidth/mes

**¿Cómo cambio el número de WhatsApp?**
En `src/context/CartContext.jsx`, línea 4:
```js
const WA_NUMBER = "51948761303"; // cambia aquí
```

**¿Puedo agregar imágenes reales a los productos?**
Sí. En Firebase → Storage, sube la imagen, copia la URL pública y en el admin agrega el campo `imageUrl`. Los componentes ya soportan imágenes.
