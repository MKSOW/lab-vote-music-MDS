import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css"; 
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/AuthProvider"; // <-- nouveau

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
