import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import EmailField from "@/features/auth/components/email-field";
import PasswordField from "@/features/auth/components/password-field";

export default function SignUpForm() {
  const [passwordError, setPasswordError] = useState<string>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (formData.get("password") !== formData.get("confirmPassword")) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError(undefined);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <EmailField />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="new-password"
        />
        <PasswordField
          id="confirmPassword"
          label="Password again"
          autoComplete="new-password"
          error={passwordError}
        />
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </FieldGroup>
    </form>
  );
}
