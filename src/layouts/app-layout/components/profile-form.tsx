import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/providers/auth-provider";
import { getProfileSchema } from "@shared/validators/profile-validators";

type ProfileErrors = Partial<Record<"first_name" | "last_name", string>>;

type ProfileFormProps = {
  onSaved: () => void;
};

export default function ProfileForm({ onSaved }: ProfileFormProps) {
  const { user, profile, setProfile } = useAuth();
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!user || !profile) {
    return (
      <p className="text-sm text-muted-foreground">Loading your profile…</p>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const result = getProfileSchema().safeParse(Object.fromEntries(formData));

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);

      setErrors({
        first_name: fieldErrors.first_name?.[0],
        last_name: fieldErrors.last_name?.[0],
      });
      toast.error("Please check the form");
      return;
    }

    setErrors({});

    try {
      setIsLoading(true);

      const updatedAt = new Date();
      const { error } = await supabase
        .from("profile")
        .update({
          first_name: result.data.first_name,
          last_name: result.data.last_name,
          updated_at: updatedAt.toISOString(),
        })
        .eq("user_id", user.id)
        .select("id")
        .single();

      if (error) {
        toast.error(error.message, { duration: 5000 });
        return;
      }

      setProfile({
        ...profile,
        first_name: result.data.first_name,
        last_name: result.data.last_name,
        updatedAt,
      });
      toast.success("Profile updated");
      onSaved();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.first_name}>
            <FieldLabel htmlFor="first_name">First name</FieldLabel>
            <Input
              id="first_name"
              name="first_name"
              autoComplete="given-name"
              defaultValue={profile.first_name ?? ""}
              aria-invalid={!!errors.first_name}
            />
            {errors.first_name && <FieldError>{errors.first_name}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.last_name}>
            <FieldLabel htmlFor="last_name">Last name</FieldLabel>
            <Input
              id="last_name"
              name="last_name"
              autoComplete="family-name"
              defaultValue={profile.last_name ?? ""}
              aria-invalid={!!errors.last_name}
            />
            {errors.last_name && <FieldError>{errors.last_name}</FieldError>}
          </Field>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
