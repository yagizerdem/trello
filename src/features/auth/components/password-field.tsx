import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type PasswordFieldProps = {
  id: string;
  label: string;
  autoComplete: "current-password" | "new-password";
  error?: string;
};

export default function PasswordField({
  id,
  label,
  autoComplete,
  error,
}: PasswordFieldProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        name={id}
        type="password"
        autoComplete={autoComplete}
        aria-invalid={!!error}
        required
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
