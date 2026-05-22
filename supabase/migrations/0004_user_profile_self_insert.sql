drop policy if exists "users create own basic profile" on public.user_profiles;
create policy "users create own basic profile"
on public.user_profiles for insert
with check (
  id = auth.uid()
  and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  and role = 'admin_clinica'::public.app_role
  and tenant_id is null
);

