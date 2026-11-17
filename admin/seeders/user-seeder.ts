import supabase from "../supabase";
import { readSeedFile } from "./seed-data";

const users = readSeedFile("users");

for (const user of users) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
    user_metadata: { full_name: `${user.first_name} ${user.last_name}` },
  });

  if (error) {
    throw new Error(`Failed to create user ${user.email}: ${error.message}`);
  }

  // The create_profile trigger inserts an empty profile row, fill it in
  const { error: profileError } = await supabase
    .from("profile")
    .update({ first_name: user.first_name, last_name: user.last_name })
    .eq("user_id", data.user.id);

  if (profileError) {
    throw new Error(
      `Failed to update profile for ${user.email}: ${profileError.message}`,
    );
  }

  console.log(`Created ${user.email}`);
}

console.log(`Inserted ${users.length} users`);
