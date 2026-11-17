import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabase-client";
import NotFoundPage from "@/features/not-found";
import BoardColumn from "./components/board-column";
import InlineAddForm from "./components/inline-add-form";
import type { Board } from "./types";

async function getWorkflow(id: string) {
  const { data, error } = await supabase
    .from("workflow")
    .select("id, name")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

// Boards and tasks only live in local state until they have tables
const initialBoards: Board[] = [
  { id: crypto.randomUUID(), name: "To do", tasks: [] },
  { id: crypto.randomUUID(), name: "In progress", tasks: [] },
  { id: crypto.randomUUID(), name: "Done", tasks: [] },
];

export default function WorkflowPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const query = useQuery({
    queryKey: ["workflow", id],
    queryFn: () => getWorkflow(id!),
    enabled: !!id,
  });

  const [boards, setBoards] = useState<Board[]>(initialBoards);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const boardCount = useRef(boards.length);

  // Bring a newly added board into view at the right edge
  useEffect(() => {
    if (boards.length > boardCount.current) {
      scrollerRef.current?.scrollTo({
        left: scrollerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
    boardCount.current = boards.length;
  }, [boards.length]);

  function addBoard(name: string) {
    setBoards((current) => [
      ...current,
      { id: crypto.randomUUID(), name, tasks: [] },
    ]);
  }

  function addTask(boardId: string, title: string) {
    setBoards((current) =>
      current.map((board) =>
        board.id === boardId
          ? {
              ...board,
              tasks: [...board.tasks, { id: crypto.randomUUID(), title }],
            }
          : board,
      ),
    );
  }

  if (!id || (query.isSuccess && !query.data) || query.isError) {
    return <NotFoundPage />;
  }

  if (query.isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Workflow</p>
          <h1 className="truncate text-2xl font-bold tracking-tight">
            {query.data?.name}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground tabular-nums">
          {boards.length} {boards.length === 1 ? "board" : "boards"}
        </p>
      </header>

      {/* Scrolls sideways as boards are added; bleeds to the main padding */}
      <div
        ref={scrollerRef}
        className="-mx-4 overflow-x-auto overscroll-x-contain px-4 pb-4 sm:-mx-6 sm:px-6"
      >
        <div className="flex w-max items-start gap-3">
          {boards.map((board) => (
            <BoardColumn key={board.id} board={board} onAddTask={addTask} />
          ))}

          <div className="w-72 shrink-0 rounded-xl border border-dashed p-2">
            <InlineAddForm
              label="Add a board"
              placeholder="Board name"
              submitLabel="Add board"
              onAdd={addBoard}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
