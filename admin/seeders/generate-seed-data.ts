import { faker } from "@faker-js/faker";
import {
  readSeedFile,
  seedFileExists,
  writeSeedFile,
  type SeedBoard,
  type SeedMessage,
  type SeedTask,
  type SeedUser,
  type SeedWorkflow,
  type SeedWorkflowMember,
} from "./seed-data";

// Writes random seed data to admin/seeders/data/*.json. Existing files are
// kept so seeds stay the same between runs, only missing files are written;
// pass --force to regenerate them all.
const USER_COUNT = 10;
const WORKFLOWS_PER_USER = 2;
const MAX_MEMBERS_PER_WORKFLOW = 3;
const BOARD_NAMES = ["To do", "In progress", "Review", "Done"];
const MIN_BOARDS_PER_WORKFLOW = 2;
const MAX_TASKS_PER_BOARD = 5;
const MESSAGE_COUNT = 10;
// Shared so seeded users can sign in from the app
const PASSWORD = "password123";

const force = process.argv.includes("--force");
const written: string[] = [];

function generateUsers(): SeedUser[] {
  // Keyed by email: auth rejects duplicate emails
  const usersByEmail = new Map<string, SeedUser>();

  while (usersByEmail.size < USER_COUNT) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet
      .email({ firstName, lastName, provider: "example.com" })
      .toLowerCase();

    usersByEmail.set(email, {
      email,
      password: PASSWORD,
      first_name: firstName,
      last_name: lastName,
    });
  }

  return [...usersByEmail.values()];
}

function generateWorkflows(users: SeedUser[]): SeedWorkflow[] {
  return users.flatMap((user) =>
    Array.from({ length: WORKFLOWS_PER_USER }, () => ({
      name: faker.company.catchPhrase(),
      admin_email: user.email,
    })),
  );
}

// The admin is never added as a member, the app counts them separately
function generateWorkflowMembers(
  users: SeedUser[],
  workflows: SeedWorkflow[],
): SeedWorkflowMember[] {
  return workflows.flatMap((workflow) => {
    const candidates = users.filter((u) => u.email !== workflow.admin_email);
    const members = faker.helpers.arrayElements(candidates, {
      min: 0,
      max: MAX_MEMBERS_PER_WORKFLOW,
    });

    return members.map((member) => ({
      workflow_name: workflow.name,
      workflow_admin_email: workflow.admin_email,
      member_email: member.email,
    }));
  });
}

// Each workflow gets the first few BOARD_NAMES, so names stay unique and in
// order within a workflow
function generateBoards(workflows: SeedWorkflow[]): SeedBoard[] {
  return workflows.flatMap((workflow) => {
    const count = faker.number.int({
      min: MIN_BOARDS_PER_WORKFLOW,
      max: BOARD_NAMES.length,
    });

    return BOARD_NAMES.slice(0, count).map((name) => ({
      workflow_name: workflow.name,
      workflow_admin_email: workflow.admin_email,
      name,
    }));
  });
}

function generateTasks(boards: SeedBoard[]): SeedTask[] {
  return boards.flatMap((board) =>
    Array.from(
      { length: faker.number.int({ min: 0, max: MAX_TASKS_PER_BOARD }) },
      () => ({
        workflow_name: board.workflow_name,
        workflow_admin_email: board.workflow_admin_email,
        board_name: board.name,
        title: faker.hacker.phrase(),
        description: faker.datatype.boolean() ? faker.lorem.sentences(2) : null,
      }),
    ),
  );
}

function generateMessages(): SeedMessage[] {
  return Array.from({ length: MESSAGE_COUNT }, () => ({
    message: faker.lorem.sentence(),
  }));
}

// A file is regenerated when it is missing, on --force, or when a file it
// was built from was regenerated
const writeUsers = force || !seedFileExists("users");
const users = writeUsers ? generateUsers() : readSeedFile("users");
if (writeUsers) {
  writeSeedFile("users", users);
  written.push(`${users.length} users`);
}

const writeWorkflows = writeUsers || !seedFileExists("workflows");
const workflows = writeWorkflows
  ? generateWorkflows(users)
  : readSeedFile("workflows");
if (writeWorkflows) {
  writeSeedFile("workflows", workflows);
  written.push(`${workflows.length} workflows`);
}

if (writeWorkflows || !seedFileExists("workflow_members")) {
  const workflowMembers = generateWorkflowMembers(users, workflows);
  writeSeedFile("workflow_members", workflowMembers);
  written.push(`${workflowMembers.length} workflow members`);
}

const writeBoards = writeWorkflows || !seedFileExists("boards");
const boards = writeBoards ? generateBoards(workflows) : readSeedFile("boards");
if (writeBoards) {
  writeSeedFile("boards", boards);
  written.push(`${boards.length} boards`);
}

if (writeBoards || !seedFileExists("tasks")) {
  const tasks = generateTasks(boards);
  writeSeedFile("tasks", tasks);
  written.push(`${tasks.length} tasks`);
}

if (force || !seedFileExists("messages")) {
  const messages = generateMessages();
  writeSeedFile("messages", messages);
  written.push(`${messages.length} messages`);
}

console.log(
  written.length > 0
    ? `Wrote ${written.join(", ")}`
    : "Seed data already exists, pass --force to regenerate it",
);
