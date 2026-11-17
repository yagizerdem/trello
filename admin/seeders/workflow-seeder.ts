import supabase from "../supabase";
import { readSeedFile } from "./seed-data";

// Run after user-seeder: workflows are matched to existing users by email
const workflows = readSeedFile("workflows");

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

const missing = workflows.filter((w) => !userIdsByEmail.has(w.admin_email));

if (missing.length > 0) {
  const emails = [...new Set(missing.map((w) => w.admin_email))];
  throw new Error(
    `No user found for ${emails.join(", ")}, run user-seeder.ts first`,
  );
}

const { data, error } = await supabase
  .from("workflow")
  .insert(
    workflows.map((workflow) => ({
      name: workflow.name,
      admin_user_id: userIdsByEmail.get(workflow.admin_email),
    })),
  )
  .select("id");

if (error) {
  throw new Error(`Failed to seed workflows: ${error.message}`);
}

console.log(`Inserted ${data.length} workflows`);
