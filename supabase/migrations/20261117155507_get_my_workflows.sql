-- Postgres does not index foreign keys on its own; both are used to look up
-- a workflow's members and a user's memberships.
create index if not exists workflow_member_workflow_id_idx on public.workflow_member (workflow_id);
create index if not exists workflow_member_user_id_idx on public.workflow_member (user_id);
create index if not exists workflow_admin_user_id_idx on public.workflow (admin_user_id);


-- Workflows the current user administers or is a member of, with the admin's
-- email and name and the number of members. Security definer because the
-- admin's email lives in auth.users and profile RLS only exposes your own row.
create or replace function public.get_my_workflows()
returns table (
    id uuid,
    name text,
    created_at timestamp with time zone,
    admin_user_id uuid,
    admin_email text,
    admin_first_name text,
    admin_last_name text,
    member_count bigint
)
language sql
stable
security definer
set search_path = ''
as $$
    select
        w.id,
        w.name,
        w.created_at,
        w.admin_user_id,
        u.email::text,
        p.first_name,
        p.last_name,
        (select count(*) from public.workflow_member m where m.workflow_id = w.id)
    from public.workflow w
    left join auth.users u on u.id = w.admin_user_id
    left join public.profile p on p.user_id = w.admin_user_id
    where w.admin_user_id = (select auth.uid())
       or exists (
           select 1
           from public.workflow_member m
           where m.workflow_id = w.id
             and m.user_id = (select auth.uid())
       )
    order by w.created_at desc;
$$;

revoke execute on function public.get_my_workflows() from public, anon;
grant execute on function public.get_my_workflows() to authenticated;
