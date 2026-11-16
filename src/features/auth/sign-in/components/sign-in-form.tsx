import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import EmailField from "@/features/auth/components/email-field";
import PasswordField from "@/features/auth/components/password-field";
import { getSignInSchema } from "@shared/validators/auth-validators";

type SignInErrors = Partial<Record<"email" | "password", string>>;

export default function SignInForm() {
  const [errors, setErrors] = useState<SignInErrors>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const result = getSignInSchema().safeParse(Object.fromEntries(formData));

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);

      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      toast.error("Please check the form");
      return;
    }

    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <EmailField error={errors.email} />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          error={errors.password}
        />
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </FieldGroup>
    </form>
  );
}
