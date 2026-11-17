import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabase-client";
import BoardColumn from "@/features/workflow/components/board-column";
import type { Board } from "@shared/domain/workflow";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddBoardModal from "@/features/workflow/components/add-board-model";

async function getWorkflow(id: string) {
  const { data, error } = await supabase
    .from("workflow")
    .select("id, name")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export default function WorkflowPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const query = useQuery({
    queryKey: ["workflow", id],
    queryFn: () => getWorkflow(id!),
    enabled: !!id,
  });

  const [boards, setBoards] = useState<Board[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const boardCount = useRef(boards.length);
  const [showAddBoard, setShowAddBoard] = useState<boolean>(false);

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

          <Button
            variant="ghost"
            className="cursor-pointer group/add h-auto w-72 shrink-0 flex-col gap-2 rounded-xl border border-dashed border-border py-6 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
            onMouseUp={() => setShowAddBoard(true)}
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-muted transition-colors group-hover/add:bg-primary group-hover/add:text-primary-foreground">
              <Plus className="size-4" />
            </span>
            Add board
          </Button>
        </div>
      </div>

      {showAddBoard && (
        <AddBoardModal onOpenChange={() => setShowAddBoard(false)} />
      )}
    </div>
  );
}
