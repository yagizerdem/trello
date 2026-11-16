import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import EmailField from "@/features/auth/components/email-field";
import PasswordField from "@/features/auth/components/password-field";

export default function SignInForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <EmailField />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
        />
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </FieldGroup>
    </form>
  );
}
