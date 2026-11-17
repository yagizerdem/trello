
create table messages (
    id uuid primary key default gen_random_uuid(),
    message text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);