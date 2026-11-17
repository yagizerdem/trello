import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

export default function CallToAction() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return null;

  return (
    <section className="py-12 lg:py-20">
      <div className="flex flex-col items-center gap-6 rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground">
        <h2 className="max-w-xl text-3xl font-bold tracking-tight text-balance">
          Ready to bring your team's work together?
        </h2>
        <p className="max-w-md text-primary-foreground/80">
          Create your first board in less than a minute. It's free to get
          started.
        </p>
        <Button asChild size="lg" variant="secondary">
          <Link to="/sign-up">
            Sign up for free
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
