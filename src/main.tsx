import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

window.addEventListener("resize", () => {
  document.documentElement.style.setProperty("--vh", window.innerHeight + "px");
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
