import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/user";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppDataSource = new DataSource({
  type: "sqlite", // Use SQLite
  database: path.join(__dirname, "database.sqlite"), // Name of the SQLite file
  synchronize: true, // Auto-create tables (use with caution in production)
  logging: true, // Logs SQL queries to console
  subscribers: [],
  entities: [User],
});
