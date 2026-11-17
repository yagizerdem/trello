import { Fragment, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import BoardPreview from "./board-preview";
import WorkflowMenu from "@/components/workflow-menu";

export default function Hero() {
  const { isAuthenticated } = useAuth();
  const [showWorkflow, setShowWorkflow] = useState<boolean>(false);

  return (
    <Fragment>
      <section className="grid items-center gap-12 py-12 lg:grid-cols-2 lg:py-20">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="secondary">Boards, lists and cards</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Organize your work and get it done, together.
          </h1>
          <p className="max-w-lg text-lg text-pretty text-muted-foreground">
            Plan projects on visual boards, break work into cards and move them
            from to do to done. Invite your team and stay in sync.
          </p>
          <div className="flex flex-wrap gap-3">
            {isAuthenticated ? (
              <Button
                asChild
                size="lg"
                onMouseUp={() => setShowWorkflow(true)}
                className="bg-primary cursor-pointer"
              >
                <Link to="#">
                  <span> Go to your workflows</span>
                  <ArrowRight />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link to="/sign-up">
                    Get started for free
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/sign-in">Sign in</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <BoardPreview />
      </section>
      {showWorkflow && (
        <WorkflowMenu onOpenChange={() => setShowWorkflow(false)} />
      )}
    </Fragment>
  );
}
