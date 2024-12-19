import AppNavBar from "~/components/AppNavBar";
import RouteGuard from "~/components/RouteGuard";

export default function Home() {
  return (
    <RouteGuard>
      <AppNavBar />
      <div>home page</div>
    </RouteGuard>
  );
}
