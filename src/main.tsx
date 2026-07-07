
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";

  if (!import.meta.env.DEV) {
    console.log = () => {};
  }

  createRoot(document.getElementById("root")!).render(<App />);
  