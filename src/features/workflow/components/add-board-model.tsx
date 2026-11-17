import AnimatedPanel from "@/components/animated-panel";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface AddBoardModalProps {
  onOpenChange: (open: boolean) => void;
}

export default function AddBoardModal({ onOpenChange }: AddBoardModalProps) {
  return (
    <AnimatedPanel onOpenChange={onOpenChange} open={true} label="Add board">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <Field>
          <FieldLabel htmlFor="board-name">Name</FieldLabel>
          <Input
            id="board-name"
            name="name"
            placeholder="e.g. To do"
            autoComplete="off"
            autoFocus
            required
          />
        </Field>
        <Button type="submit" className="self-end">
          Add board
        </Button>
      </form>
    </AnimatedPanel>
  );
}
