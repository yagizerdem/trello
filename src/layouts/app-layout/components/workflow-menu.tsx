import { useState } from "react";
import { Kanban } from "lucide-react";
import AnimatedPanel from "@/components/animated-panel";
import { Button } from "@/components/ui/button";

export default function WorkflowMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5"
        onClick={() => setIsOpen(true)}
      >
        <Kanban />
        Workflows
      </Button>
      <AnimatedPanel
        open={isOpen}
        onOpenChange={setIsOpen}
        label="Workflows"
        className="min-h-80"
      />
    </>
  );
}
