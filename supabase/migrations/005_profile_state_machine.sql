create or replace function public.validate_profile_transition()
returns trigger
language plpgsql
security invoker
as $$
begin

  /*
   * owner_id can never be changed by normal UPDATE.
   */
  if new.owner_id <> old.owner_id then
    raise exception 'Profile ownership cannot be changed';
  end if;

  /*
   * Draft can only become pending.
   */
  if old.status = 'draft'
     and new.status not in ('draft', 'pending') then
    raise exception 'Invalid draft profile transition';
  end if;

  /*
   * Pending can return to draft after rejection,
   * or become active after approval.
   */
  if old.status = 'pending'
     and new.status not in ('pending', 'draft', 'active') then
    raise exception 'Invalid pending profile transition';
  end if;

  /*
   * Active remains active or can expire.
   * Renewal should NOT turn active into pending.
   */
  if old.status = 'active'
     and new.status not in ('active', 'expired') then
    raise exception 'Invalid active profile transition';
  end if;

  /*
   * Expired can be renewed back to active,
   * otherwise remain expired.
   */
  if old.status = 'expired'
     and new.status not in ('expired', 'active') then
    raise exception 'Invalid expired profile transition';
  end if;

  return new;
end;
$$;

drop trigger if exists profile_state_transition_guard
on public.profiles;

create trigger profile_state_transition_guard
before update
on public.profiles
for each row
execute function public.validate_profile_transition();