// Runs every seeder in order. Each seeder runs its work at import time, so
// they are imported one by one: static imports with top-level await could run
// in parallel, and workflow-seeder needs the users to exist first.
const seeders = [
  "./user-seeder.ts",
  "./workflow-seeder.ts",
  "./workflow-member-seeder.ts",
  "./message-seeder.ts",
];

for (const seeder of seeders) {
  console.log(`\n▶ ${seeder}`);
  await import(seeder);
}

console.log("\nAll seeders finished");
