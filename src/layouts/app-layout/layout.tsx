import { Outlet } from "react-router";
import AppHeader from "@/layouts/app-layout/components/app-header";
import AppFooter from "@/layouts/app-layout/components/app-footer";

export default function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
