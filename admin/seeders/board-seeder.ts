import supabase from "../supabase";
import { readSeedFile } from "./seed-data";

// Run after workflow-seeder: boards are matched to existing workflows by
// name and admin email
const boards = readSeedFile("boards");

const userIdsByEmail = new Map<string, string>();

// listUsers is paginated, walk every page
for (let page = 1; ; page++) {
  const { data, error } = await supabase.auth.admin.listUsers({
    page,
    perPage: 1000,
  });

  if (error) {
    throw new Error(`Failed to list users: ${error.message}`);
  }

  for (const user of data.users) {
    if (user.email) userIdsByEmail.set(user.email, user.id);
  }

  if (!data.nextPage) break;
}

const workflowKey = (name: string, adminUserId: string) =>
  `${adminUserId}:${name}`;

const { data: workflows, error: workflowError } = await supabase
  .from("workflow")
  .select("id, name, admin_user_id");

if (workflowError) {
  throw new Error(`Failed to list workflows: ${workflowError.message}`);
}

const workflowIdsByKey = new Map<string, string>();

for (const workflow of workflows) {
  if (workflow.admin_user_id) {
    workflowIdsByKey.set(
      workflowKey(workflow.name, workflow.admin_user_id),
      workflow.id,
    );
  }
}

const rows = boards.map((board) => {
  const adminUserId = userIdsByEmail.get(board.workflow_admin_email);

  if (!adminUserId) {
    throw new Error(
      `No user found for ${board.workflow_admin_email}, run user-seeder.ts first`,
    );
  }

  const workflowId = workflowIdsByKey.get(
    workflowKey(board.workflow_name, adminUserId),
  );

  if (!workflowId) {
    throw new Error(
      `No workflow "${board.workflow_name}" for ${board.workflow_admin_email}, run workflow-seeder.ts first`,
    );
  }

  return { workflow_id: workflowId, name: board.name };
});

const { data, error } = await supabase.from("board").insert(rows).select("id");

if (error) {
  throw new Error(`Failed to seed boards: ${error.message}`);
}

console.log(`Inserted ${data.length} boards`);
