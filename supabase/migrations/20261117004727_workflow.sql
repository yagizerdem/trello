create table workflow(
    id uuid primary key default gen_random_uuid(),
    name text not null,
    admin_user_id uuid references auth.users(id),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create table workflow_member(
    id uuid primary key default gen_random_uuid(),
    workflow_id uuid references workflow(id),
    user_id uuid references auth.users(id),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);
