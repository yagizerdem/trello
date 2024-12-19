import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./styles/output.css";
import "./vendor/bootstrap/css/bootstrap.min.css";
import { AuthProvider } from "./context/authContext";

export default function App() {
  return (
    <AuthProvider>
      <Router
        root={(props) => (
          <>
            <Suspense>{props.children}</Suspense>
          </>
        )}
      >
        <FileRoutes />
      </Router>
    </AuthProvider>
  );
}
