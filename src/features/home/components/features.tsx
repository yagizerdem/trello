import { Bell, Kanban, Users, Zap } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Kanban,
    title: "Visual boards",
    description:
      "See every project at a glance with boards, lists and cards you can move around.",
  },
  {
    icon: Users,
    title: "Built for teams",
    description:
      "Invite members to a workflow, assign cards and work on the same board together.",
  },
  {
    icon: Bell,
    title: "Stay in the loop",
    description:
      "Comments and updates keep everyone on the same page without endless meetings.",
  },
  {
    icon: Zap,
    title: "Fast and simple",
    description:
      "No setup needed. Create a board in seconds and start moving work forward.",
  },
];

export default function Features() {
  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Everything you need to move work forward
        </h2>
        <p className="mt-3 text-muted-foreground">
          Simple tools that adapt to how your team works.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
