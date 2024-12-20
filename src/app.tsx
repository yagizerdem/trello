import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { onMount, Suspense } from "solid-js";
import "./styles/output.css";
import "./vendor/bootstrap/css/bootstrap.min.css";
import { AuthProvider } from "./context/authContext";
import { AppProvider } from "./context/appContext";
import { overrideLocalStorageBehaviour } from "./overrides";

export default function App() {
  // change default behaviour of local storge
  onMount(() => overrideLocalStorageBehaviour());
  return (
    <AuthProvider>
      <AppProvider>
        <Router
          root={(props) => (
            <>
              <Suspense>{props.children}</Suspense>
            </>
          )}
        >
          <FileRoutes />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}
