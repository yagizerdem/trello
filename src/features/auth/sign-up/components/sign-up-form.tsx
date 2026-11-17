import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import EmailField from "@/features/auth/components/email-field";
import PasswordField from "@/features/auth/components/password-field";
import { getSignUpSchema } from "@shared/validators/auth-validators";
import { supabase } from "@/lib/supabase-client";
import { useNavigate } from "react-router";

type SignUpErrors = Partial<
  Record<"email" | "password" | "confirmPassword", string>
>;

export default function SignUpForm() {
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsLoading(true);
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const result = getSignUpSchema().safeParse(Object.fromEntries(formData));

      if (!result.success) {
        const { fieldErrors } = z.flattenError(result.error);

        setErrors({
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
          confirmPassword: fieldErrors.confirmPassword?.[0],
        });
        toast.error("Please check the form");
        return;
      }

      if (result.data.password !== result.data.confirmPassword) {
        setErrors({ confirmPassword: "Passwords do not match" });
        toast.error("Please check the form");
        return;
      }

      setErrors({});

      const { error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
      });

      if (error) {
        toast.error(error.message, {
          duration: 5000,
        });
        return;
      }
      toast.success("Sign up successful! Please check your email to confirm.", {
        duration: 3000,
      });

      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <EmailField error={errors.email} />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="new-password"
          error={errors.password}
        />
        <PasswordField
          id="confirmPassword"
          label="Password again"
          autoComplete="new-password"
          error={errors.confirmPassword}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          Sign up
        </Button>
      </FieldGroup>
    </form>
  );
}
