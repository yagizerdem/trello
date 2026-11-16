import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/index.css";
import App from "@/App.tsx";
import { BaseProvider } from "@/providers/base-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BaseProvider>
      <App />
    </BaseProvider>
  </StrictMode>,
);
