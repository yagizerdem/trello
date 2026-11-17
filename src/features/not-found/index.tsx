import { ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 py-20 text-center">
      <p
        aria-hidden="true"
        className="text-8xl font-bold tracking-tighter text-muted-foreground/30 tabular-nums sm:text-9xl"
      >
        404
      </p>
      <div className="flex max-w-md flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          Page not found
        </h1>
        <p className="text-muted-foreground text-pretty">
          The page you're looking for doesn't exist or has been moved. Check the
          address, or head back to where you were.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft />
          Go back
        </Button>
        <Button asChild>
          <Link to="/">
            <Home />
            Back to home
          </Link>
        </Button>
      </div>
    </section>
  );
}
