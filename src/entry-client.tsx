// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import { AuthProvider } from "./context/authContext";

mount(() => <StartClient />, document.getElementById("app")!);
