import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InlineAddFormProps {
  label: string;
  placeholder: string;
  submitLabel: string;
  onAdd: (value: string) => void;
  className?: string;
}

// A button that turns into a one-field form; stays open after submit so
// several items can be added in a row
export default function InlineAddForm({
  label,
  placeholder,
  submitLabel,
  onAdd,
  className,
}: InlineAddFormProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  function close() {
    setOpen(false);
    setValue("");
  }

  if (!open) {
    return (
      <Button
        variant="ghost"
        className={cn("justify-start text-muted-foreground", className)}
        onClick={() => setOpen(true)}
      >
        <Plus />
        {label}
      </Button>
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-2", className)}
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) return;
        onAdd(trimmed);
        setValue("");
      }}
    >
      <Input
        autoFocus
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") close();
        }}
      />
      <div className="flex items-center gap-1">
        <Button type="submit" size="sm" disabled={!value.trim()}>
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Cancel"
          onClick={close}
        >
          <X />
        </Button>
      </div>
    </form>
  );
}
