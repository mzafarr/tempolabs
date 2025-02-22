-- Create a function to delete all user data
create or replace function public.delete_user_data()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  auth_user_id uuid;
begin
  -- Get the ID of the authenticated user
  auth_user_id := auth.uid();
  
  -- Delete user's swipes
  delete from public.swipes
  where swiper_id = auth_user_id
     or swiped_id = auth_user_id;

  -- Delete user's matches
  delete from public.matches
  where user1_id = auth_user_id
     or user2_id = auth_user_id;

  -- Delete user's profile
  delete from public.profiles
  where id = auth_user_id;

  -- Note: The actual auth.users record will be deleted through the auth.users API call
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.delete_user_data to authenticated;

-- Add RLS policies for deletion
alter table public.profiles enable row level security;
alter table public.swipes enable row level security;
alter table public.matches enable row level security;

-- Profiles deletion policy
create policy "Users can delete their own profile"
on public.profiles for delete
to authenticated
using (id = auth.uid());
