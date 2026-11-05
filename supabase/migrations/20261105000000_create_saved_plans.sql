create table if not exists public.saved_plans (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
    name text not null check (char_length(btrim(name)) between 1 and 100),
    data jsonb not null check (jsonb_typeof(data) = 'object'),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists saved_plans_user_updated_at_idx
    on public.saved_plans (user_id, updated_at desc);

alter table public.saved_plans enable row level security;

revoke all on public.saved_plans from anon, public;
grant select, insert, update, delete on public.saved_plans to authenticated;

drop policy if exists "Users can read their own plans" on public.saved_plans;
create policy "Users can read their own plans"
    on public.saved_plans for select to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own plans" on public.saved_plans;
create policy "Users can create their own plans"
    on public.saved_plans for insert to authenticated
    with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own plans" on public.saved_plans;
create policy "Users can update their own plans"
    on public.saved_plans for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own plans" on public.saved_plans;
create policy "Users can delete their own plans"
    on public.saved_plans for delete to authenticated
    using ((select auth.uid()) = user_id);
