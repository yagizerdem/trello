

create table board (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  workflow_id uuid not null references workflow(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);


create table task (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  board_id uuid not null references board(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Keep updated_at in sync on every update, using the shared set_updated_at()
-- function from the profile migration.
create trigger set_board_updated_at
before update on public.board
for each row
execute function public.set_updated_at();

create trigger set_task_updated_at
before update on public.task
for each row
execute function public.set_updated_at();
