

create table profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);


CREATE OR REPLACE FUNCTION public.create_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profile (
        user_id,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NOW(),
        NOW()
    );

    RETURN NEW;
END;
$$;

CREATE TRIGGER create_profile_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile();