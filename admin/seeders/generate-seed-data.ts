import { faker } from "@faker-js/faker";
import {
  seedFileExists,
  writeSeedFile,
  type SeedMessage,
  type SeedUser,
  type SeedWorkflow,
} from "./seed-data";

// Writes random seed data to admin/seeders/data/*.json. Existing files are
// kept so seeds stay the same between runs; pass --force to regenerate them.
const USER_COUNT = 10;
const WORKFLOWS_PER_USER = 2;
const MESSAGE_COUNT = 10;
// Shared so seeded users can sign in from the app
const PASSWORD = "password123";

const force = process.argv.includes("--force");

const files = ["users", "workflows", "messages"] as const;
const existing = files.filter(seedFileExists);

if (existing.length > 0 && !force) {
  throw new Error(
    `Seed data already exists (${existing.join(", ")}), pass --force to overwrite`,
  );
}

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

const users = [...usersByEmail.values()];

const workflows: SeedWorkflow[] = users.flatMap((user) =>
  Array.from({ length: WORKFLOWS_PER_USER }, () => ({
    name: faker.company.catchPhrase(),
    admin_email: user.email,
  })),
);

const messages: SeedMessage[] = Array.from({ length: MESSAGE_COUNT }, () => ({
  message: faker.lorem.sentence(),
}));

writeSeedFile("users", users);
writeSeedFile("workflows", workflows);
writeSeedFile("messages", messages);

console.log(
  `Wrote ${users.length} users, ${workflows.length} workflows and ${messages.length} messages`,
);
