-- Row level security: a user can only read and update their own profile.
-- Inserts come from the create_profile trigger (security definer), so no
-- insert policy is needed.
alter table public.profile enable row level security;

create policy "Users can view their own profile"
on public.profile
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can update their own profile"
on public.profile
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);


-- Keep updated_at in sync on every update, whatever the client sends.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger set_profile_updated_at
before update on public.profile
for each row
execute function public.set_updated_at();
