
create table messages (
    id bigint primary key generated always as identity,
    message text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);