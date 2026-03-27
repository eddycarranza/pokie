import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // 👈 ¡ESTA LÍNEA ES LA QUE MANDA TODO EL DISEÑO A LA DERECHA!

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);