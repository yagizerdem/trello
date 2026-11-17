import { faker } from "@faker-js/faker";
import supabase from "../supabase";

const COUNT = 10;
// Shared so seeded users can sign in from the app
const PASSWORD = "password123";

for (let i = 0; i < COUNT; i++) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet
    .email({ firstName, lastName, provider: "example.com" })
    .toLowerCase();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: `${firstName} ${lastName}` },
  });

  if (error) {
    throw new Error(`Failed to create user ${email}: ${error.message}`);
  }

  // The create_profile trigger inserts an empty profile row, fill it in
  const { error: profileError } = await supabase
    .from("profile")
    .update({ first_name: firstName, last_name: lastName })
    .eq("user_id", data.user.id);

  if (profileError) {
    throw new Error(
      `Failed to update profile for ${email}: ${profileError.message}`,
    );
  }

  console.log(`Created ${email}`);
}

console.log(`Inserted ${COUNT} users with password "${PASSWORD}"`);
