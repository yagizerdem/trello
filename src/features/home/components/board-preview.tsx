import { CheckCircle2, MessageSquare, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PreviewCard = {
  title: string;
  label?: { text: string; className: string };
  comments?: number;
  attachments?: number;
  done?: boolean;
};

type PreviewColumn = {
  title: string;
  cards: PreviewCard[];
};

const columns: PreviewColumn[] = [
  {
    title: "To do",
    cards: [
      {
        title: "Write the launch plan",
        label: {
          text: "Planning",
          className: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
        },
        comments: 3,
      },
      { title: "Collect feedback from the team", attachments: 2 },
    ],
  },
  {
    title: "In progress",
    cards: [
      {
        title: "Design the new onboarding",
        label: {
          text: "Design",
          className: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
        },
        comments: 5,
        attachments: 1,
      },
    ],
  },
  {
    title: "Done",
    cards: [
      { title: "Set up the project board", done: true },
      {
        title: "Kickoff meeting",
        label: {
          text: "Team",
          className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
        },
        done: true,
      },
    ],
  },
];

// Decorative mock board for the hero, not real data
export default function BoardPreview() {
  return (
    <div className="relative" aria-hidden="true">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-linear-to-br from-primary/10 via-sky-500/10 to-violet-500/10 blur-2xl" />
      <div className="rounded-2xl border bg-muted/40 p-4 shadow-xl">
        <div className="mb-4 flex items-center gap-2">
          <span className="size-3 rounded-full bg-red-400" />
          <span className="size-3 rounded-full bg-amber-400" />
          <span className="size-3 rounded-full bg-emerald-400" />
          <span className="ml-2 text-sm font-medium">Product launch</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {columns.map((column) => (
            <div
              key={column.title}
              className="flex flex-col gap-2 rounded-xl bg-background/70 p-2"
            >
              <div className="flex items-center justify-between px-1 text-xs font-semibold text-muted-foreground">
                {column.title}
                <span>{column.cards.length}</span>
              </div>

              {column.cards.map((card) => (
                <div
                  key={card.title}
                  className="flex flex-col gap-2 rounded-lg border bg-card p-2.5 text-xs shadow-xs"
                >
                  {card.label && (
                    <Badge
                      className={cn("w-fit border-0", card.label.className)}
                    >
                      {card.label.text}
                    </Badge>
                  )}
                  <p
                    className={
                      card.done
                        ? "text-muted-foreground line-through"
                        : "font-medium"
                    }
                  >
                    {card.title}
                  </p>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    {card.done && (
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                    )}
                    {card.comments && (
                      <span className="flex items-center gap-1">
                        <MessageSquare className="size-3.5" />
                        {card.comments}
                      </span>
                    )}
                    {card.attachments && (
                      <span className="flex items-center gap-1">
                        <Paperclip className="size-3.5" />
                        {card.attachments}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
