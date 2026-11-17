import fs from "node:fs";
import path from "node:path";

// Seed data lives in JSON so every seed run inserts the same rows.
// generate-seed-data.ts writes these files once, the seeders only read them.
const dataDir = path.resolve(import.meta.dirname, "data");

export type SeedUser = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

export type SeedWorkflow = {
  name: string;
  // Users are matched by email because their ids only exist after seeding
  admin_email: string;
};

export type SeedWorkflowMember = {
  // A workflow is identified by its name and admin, both set in workflows.json
  workflow_name: string;
  workflow_admin_email: string;
  member_email: string;
};

export type SeedMessage = {
  message: string;
};

type SeedFiles = {
  users: SeedUser[];
  workflows: SeedWorkflow[];
  workflow_members: SeedWorkflowMember[];
  messages: SeedMessage[];
};

const filePath = (name: keyof SeedFiles) => path.join(dataDir, `${name}.json`);

export function seedFileExists(name: keyof SeedFiles) {
  return fs.existsSync(filePath(name));
}

export function readSeedFile<K extends keyof SeedFiles>(name: K): SeedFiles[K] {
  const file = filePath(name);

  if (!fs.existsSync(file)) {
    throw new Error(
      `${file} not found, run admin/seeders/generate-seed-data.ts first`,
    );
  }

  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function writeSeedFile<K extends keyof SeedFiles>(
  name: K,
  rows: SeedFiles[K],
) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(filePath(name), `${JSON.stringify(rows, null, 2)}\n`);
}
