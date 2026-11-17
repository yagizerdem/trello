import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

const MAX_SIZE = 2 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/jpg"];

export default function AvatarUpload() {
  const { user, profile } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();

  // Free the object URL when it is replaced or the panel closes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!user || !profile) return null;

  const name =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    (user.email ?? "");
  const initials = name.slice(0, 2).toUpperCase();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset so picking the same file again still fires onChange
    event.target.value = "";

    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please choose a PNG, JPG, WEBP or JPEG image");
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("The image must be 2 MB or smaller");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-16">
        <AvatarImage
          src={previewUrl ?? profile.avatar_url ?? undefined}
          alt={name}
        />
        <AvatarFallback className="text-lg">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={handleChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          <Camera />
          Change photo
        </Button>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, WEBP or GIF, up to 2 MB.
        </p>
      </div>
    </div>
  );
}
