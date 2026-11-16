import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type EmailFieldProps = {
  error?: string;
};

export default function EmailField({ error }: EmailFieldProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        aria-invalid={!!error}
        required
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
