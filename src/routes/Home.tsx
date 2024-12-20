import { createEffect } from "solid-js";
import AppNavBar from "~/components/AppNavBar";
import RouteGuard from "~/components/RouteGuard";
import { useAuth } from "~/context/authContext";

export default function Home() {
  const auth = useAuth();

  return (
    <RouteGuard>
      <AppNavBar />
      <div>home page</div>
    </RouteGuard>
  );
}
