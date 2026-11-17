import supabase from "../supabase";
import { readSeedFile } from "./seed-data";

// Run after workflow-seeder: members are matched to existing users by email
// and to existing workflows by name and admin
const workflowMembers = readSeedFile("workflow_members");

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

const rows = workflowMembers.map((member) => {
  const userId = userIdsByEmail.get(member.member_email);
  const adminUserId = userIdsByEmail.get(member.workflow_admin_email);

  if (!userId || !adminUserId) {
    throw new Error(
      `No user found for ${userId ? member.workflow_admin_email : member.member_email}, run user-seeder.ts first`,
    );
  }

  const workflowId = workflowIdsByKey.get(
    workflowKey(member.workflow_name, adminUserId),
  );

  if (!workflowId) {
    throw new Error(
      `No workflow "${member.workflow_name}" for ${member.workflow_admin_email}, run workflow-seeder.ts first`,
    );
  }

  return { workflow_id: workflowId, user_id: userId };
});

const { data, error } = await supabase
  .from("workflow_member")
  .insert(rows)
  .select("id");

if (error) {
  throw new Error(`Failed to seed workflow members: ${error.message}`);
}

console.log(`Inserted ${data.length} workflow members`);
