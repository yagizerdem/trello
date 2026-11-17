import { LayoutGrid } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ThemeToggle from "./theme-toggle";
import UserMenu from "./user-menu";
import WorkflowMenu from "./workflow-menu";
import { useAuth } from "@/providers/auth-provider";

export default function AppHeader() {
  const { user, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutGrid className="size-4" />
            </span>
            <span className="tracking-tight">Trello</span>
          </Link>
          {user && <WorkflowMenu />}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isLoading ? (
            <Skeleton className="size-8 rounded-full" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/sign-up">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
