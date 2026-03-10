-- Training Sessions Table
create table if not exists public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  day_of_week text not null, -- e.g., 'Monday', 'Tuesday'
  start_time time not null,
  end_time time not null,
  location text default 'Atlas Arena, Casablanca',
  category text default 'Team Practice', -- e.g., 'Team Practice', 'Youth Academy', 'Individual Skills'
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.training_sessions enable row level security;

-- Policies
create policy "Public can view public training sessions" on public.training_sessions
  for select using (is_public = true);

create policy "Admins can manage training sessions" on public.training_sessions
  for all using (auth.role() = 'authenticated');

-- Insert Sample Data
insert into public.training_sessions (title, day_of_week, start_time, end_time, category)
values 
('Pro Team Intensity', 'Monday', '18:00', '20:00', 'Team Practice'),
('Shooting Clinic', 'Wednesday', '17:00', '19:00', 'Individual Skills'),
('Youth Academy Drills', 'Saturday', '09:00', '11:00', 'Youth Academy');
