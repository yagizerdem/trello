const steps = [
  {
    title: "Create a workflow",
    description: "Start a new board for a project, a team or a personal goal.",
  },
  {
    title: "Add lists and cards",
    description: "Split the work into stages and turn every task into a card.",
  },
  {
    title: "Move work to done",
    description:
      "Move cards across lists as work progresses and invite others to help.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
        <p className="mt-3 text-muted-foreground">
          Get from idea to done in three steps.
        </p>
      </div>

      <ol className="grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="flex flex-col items-center text-center"
          >
            <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
              {index + 1}
            </span>
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 max-w-xs text-muted-foreground">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
