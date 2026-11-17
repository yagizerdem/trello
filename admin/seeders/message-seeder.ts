import supabase from "../supabase";
import { readSeedFile } from "./seed-data";

const messages = readSeedFile("messages");

const { data, error } = await supabase
  .from("messages")
  .insert(messages)
  .select("id, message");

if (error) {
  throw new Error(`Failed to seed messages: ${error.message}`);
}

console.log(`Inserted ${data.length} messages`);
