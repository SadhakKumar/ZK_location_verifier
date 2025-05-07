import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Providers } from "./context/Providers.jsx";
import "@coinbase/onchainkit/styles.css";

createRoot(document.getElementById("root")).render(
  <Providers>
    <App />
  </Providers>
);
