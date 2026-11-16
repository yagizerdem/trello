import { faker } from "@faker-js/faker";
import supabase from "../supabase";

const COUNT = 10;

const messages = Array.from({ length: COUNT }, () => ({
  message: faker.lorem.sentence(),
}));

const { data, error } = await supabase
  .from("messages")
  .insert(messages)
  .select("id, message");

if (error) {
  throw new Error(`Failed to seed messages: ${error.message}`);
}

console.log(`Inserted ${data.length} messages`);
