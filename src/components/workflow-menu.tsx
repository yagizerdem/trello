import AnimatedPanel from "@/components/animated-panel";
import { Spinner } from "@/components/ui/spinner";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { useQuery } from "@tanstack/react-query";
import { UsersIcon } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/providers/auth-provider";

interface WorkflowMenuProps {
  onOpenChange: (open: boolean) => void;
}

interface Workflow {
  id: string;
  name: string;
  created_at: string;
  admin_user_id: string | null;
  admin_email: string | null;
  admin_first_name: string | null;
  admin_last_name: string | null;
  member_count: number;
}

// Workflows the signed-in user administers or is a member of.
async function getWorkflows() {
  const { data, error } = await supabase.rpc("get_my_workflows");

  if (error) throw error;

  return data as Workflow[];
}

function adminName(workflow: Workflow) {
  const fullName = [workflow.admin_first_name, workflow.admin_last_name]
    .filter(Boolean)
    .join(" ");

  return fullName || workflow.admin_email || "Unknown admin";
}

// member_count only counts workflow_member rows; the admin is a member too.
function memberCount(workflow: Workflow) {
  return workflow.member_count + 1;
}

export default function WorkflowMenu({ onOpenChange }: WorkflowMenuProps) {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["workflows", user?.id],
    queryFn: getWorkflows,
    enabled: !!user?.id,
  });

  return (
    <>
      <AnimatedPanel
        open={true}
        onOpenChange={onOpenChange}
        label="Workflows"
        className="min-h-80"
      >
        {query.isLoading ? (
          <div className="flex min-h-60 items-center justify-center">
            <Spinner className="size-6 text-muted-foreground" />
          </div>
        ) : query.data?.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No workflows yet.
          </p>
        ) : (
          <ItemGroup className="gap-2">
            {query.data?.map((workflow) => (
              <Item key={workflow.id} variant="outline" role="listitem">
                <ItemContent className="min-w-0">
                  <ItemTitle className="truncate">{workflow.name}</ItemTitle>
                  <ItemDescription className="truncate">
                    {adminName(workflow)}
                    {workflow.admin_email && (
                      <> · {workflow.admin_email}</>
                    )}
                  </ItemDescription>
                </ItemContent>
                <ItemActions
                  className="text-muted-foreground"
                  aria-label={`${memberCount(workflow)} members`}
                >
                  <UsersIcon className="size-4" />
                  <span className="tabular-nums">{memberCount(workflow)}</span>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </AnimatedPanel>
    </>
  );
}
