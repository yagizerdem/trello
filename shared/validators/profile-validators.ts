import * as z from "zod";

export function getProfileSchema() {
  const profileSchema = z.object({
    first_name: z.string().trim().min(1).max(50),
    last_name: z.string().trim().min(1).max(50),
  });

  return profileSchema;
}

type ProfileSchema = ReturnType<typeof getProfileSchema>;

export type { ProfileSchema };
