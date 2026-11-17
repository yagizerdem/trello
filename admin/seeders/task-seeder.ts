import supabase from "../supabase";
import { readSeedFile } from "./seed-data";

// Run after board-seeder: tasks are matched to existing boards by board name
// and the board's workflow (name and admin email)
const tasks = readSeedFile("tasks");

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

const boardKey = (
  workflowName: string,
  adminUserId: string,
  boardName: string,
) => `${adminUserId}:${workflowName}:${boardName}`;

const { data: boards, error: boardError } = await supabase
  .from("board")
  .select("id, name, workflow(name, admin_user_id)");

if (boardError) {
  throw new Error(`Failed to list boards: ${boardError.message}`);
}

const boardIdsByKey = new Map<string, string>();

for (const board of boards) {
  // board.workflow_id is not null, so the embedded workflow is a single row
  const workflow = board.workflow as unknown as {
    name: string;
    admin_user_id: string | null;
  };

  if (workflow.admin_user_id) {
    boardIdsByKey.set(
      boardKey(workflow.name, workflow.admin_user_id, board.name),
      board.id,
    );
  }
}

const rows = tasks.map((task) => {
  const adminUserId = userIdsByEmail.get(task.workflow_admin_email);

  if (!adminUserId) {
    throw new Error(
      `No user found for ${task.workflow_admin_email}, run user-seeder.ts first`,
    );
  }

  const boardId = boardIdsByKey.get(
    boardKey(task.workflow_name, adminUserId, task.board_name),
  );

  if (!boardId) {
    throw new Error(
      `No board "${task.board_name}" in workflow "${task.workflow_name}", run board-seeder.ts first`,
    );
  }

  return {
    board_id: boardId,
    title: task.title,
    description: task.description,
  };
});

const { data, error } = await supabase.from("task").insert(rows).select("id");

if (error) {
  throw new Error(`Failed to seed tasks: ${error.message}`);
}

console.log(`Inserted ${data.length} tasks`);
