-- Create form_config table
create table if not exists public.form_config (
    id bigint primary key generated always as identity,
    config jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.form_config enable row level security;

-- Create form_submissions table
create table if not exists public.form_submissions (
    id uuid primary key default gen_random_uuid(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    form_config_id bigint references public.form_config(id),
    user_info jsonb not null default '{}'::jsonb,
    status text not null default 'pending'
);

-- Enable RLS
alter table public.form_submissions enable row level security;

-- Create RLS policies for form_config
create policy "Enable read access for authenticated users"
    on public.form_config
    for select
    to authenticated
    using (true);

create policy "Enable write access for authenticated admin users"
    on public.form_config
    for all
    to authenticated
    using (
        exists (
            select 1 from public.user_roles
            where user_id = auth.uid()
            and role = 'admin'
        )
    );

-- Create RLS policies for form_submissions
create policy "Enable read access for authenticated users"
    on public.form_submissions
    for select
    to authenticated
    using (true);

create policy "Enable insert for all users"
    on public.form_submissions
    for insert
    to authenticated
    with check (true);

-- Create function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for form_config
create trigger handle_updated_at
    before update on public.form_config
    for each row
    execute procedure public.handle_updated_at();