import AnimatedPanel from "@/components/animated-panel";

interface WorkflowMenuProps {
  onOpenChange: (open: boolean) => void;
}

export default function WorkflowMenu({ onOpenChange }: WorkflowMenuProps) {
  return (
    <>
      <AnimatedPanel
        open={true}
        onOpenChange={onOpenChange}
        label="Workflows"
        className="min-h-80"
      />
    </>
  );
}
