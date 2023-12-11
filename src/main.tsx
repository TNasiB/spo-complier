import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "primereact/resources/themes/viva-dark/theme.css";
import { PrimeReactProvider } from "primereact/api";
import "./global.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>
);
