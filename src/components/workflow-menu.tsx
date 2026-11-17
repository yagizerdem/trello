import AnimatedPanel from "@/components/animated-panel";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/providers/auth-provider";

interface WorkflowMenuProps {
  onOpenChange: (open: boolean) => void;
}

async function getWorkflows(userId: string) {
  const { data } = await supabase
    .from("workflow")
    .select("*")
    .select(`*`)
    .eq("admin_user_id", userId);

  return data;
}

export default function WorkflowMenu({ onOpenChange }: WorkflowMenuProps) {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["workflows"],
    queryFn: () => getWorkflows(user?.id ?? ""),
    enabled: !!user?.id,
  });

  console.log(query.data);

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
