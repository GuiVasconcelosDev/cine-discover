import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// ... outras importações ...
import { HashRouter } from 'react-router-dom'; // ✅ Nova Importação

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter> {/* ✅ Novo Componente */}
      <App />
    </HashRouter>
  </React.StrictMode>,
);