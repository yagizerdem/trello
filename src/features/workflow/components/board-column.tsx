import InlineAddForm from "./inline-add-form";
import type { Board } from "../types";

interface BoardColumnProps {
  board: Board;
  onAddTask: (boardId: string, title: string) => void;
}

export default function BoardColumn({ board, onAddTask }: BoardColumnProps) {
  return (
    <section
      aria-label={board.name}
      className="flex max-h-full w-72 shrink-0 flex-col gap-2 rounded-xl bg-muted/60 p-2"
    >
      <header className="flex items-center justify-between gap-2 px-2 pt-1">
        <h2 className="truncate text-sm font-semibold">{board.name}</h2>
        <span className="rounded-full bg-background px-2 text-xs text-muted-foreground tabular-nums">
          {board.tasks.length}
        </span>
      </header>

      {board.tasks.length > 0 ? (
        <ul className="flex flex-col gap-2 overflow-y-auto">
          {board.tasks.map((task) => (
            <li
              key={task.id}
              className="rounded-lg border bg-card p-3 text-sm font-medium wrap-break-word shadow-xs"
            >
              {task.title}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
          No tasks yet
        </p>
      )}

      <InlineAddForm
        label="Add a task"
        placeholder="Task title"
        submitLabel="Add task"
        onAdd={(title) => onAddTask(board.id, title)}
      />
    </section>
  );
}
