import RouteGuard from "~/components/RouteGuard";

export default function Home() {
  return (
    <RouteGuard>
      <div>home page</div>
    </RouteGuard>
  );
}
