import * as z from "zod";

export function getSignInSchema() {
  const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });
  return signInSchema;
}

export function getSignUpSchema() {
  const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  });

  return signUpSchema;
}

type SignInSchema = ReturnType<typeof getSignInSchema>;
type SignUpSchema = ReturnType<typeof getSignUpSchema>;

export type { SignInSchema, SignUpSchema };
