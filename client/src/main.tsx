import { createRoot } from "react-dom/client";
import "./index.css";

const renderApp = async () => {
  const { default: App } = await import("./App");
  createRoot(document.getElementById("root")!).render(<App />);
};

renderApp();
