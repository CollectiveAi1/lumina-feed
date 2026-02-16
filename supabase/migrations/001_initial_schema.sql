-- ============================================================================
-- Lumina Social Learning Platform - Initial Schema Migration
-- ============================================================================
-- This migration creates the complete database schema including:
--   - All tables with constraints and foreign keys
--   - Row Level Security (RLS) policies
--   - Database functions (update_streak, get_brain_count)
--   - Performance indexes
-- ============================================================================

-- Enable required extensions
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. PROFILES
-- Extended user profile linked to Supabase Auth
-- ============================================================================

create table profiles (
  id                   uuid primary key references auth.users on delete cascade,
  username             text unique not null,
  display_name         text,
  avatar_url           text,
  bio                  text check (char_length(bio) <= 280),
  role                 text not null default 'learner'
                         check (role in ('learner', 'creator', 'admin')),
  current_streak       integer not null default 0,
  best_streak          integer not null default 0,
  consecutive_weeks    integer not null default 0,
  last_active_date     date,
  focus_mode_enabled   boolean not null default false,
  focus_session_minutes integer not null default 15,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table profiles enable row level security;

-- Anyone can read profiles
create policy "profiles_select_all"
  on profiles for select
  using (true);

-- Users can only update their own profile
create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users can insert their own profile (on sign-up)
create policy "profiles_insert_own"
  on profiles for insert
  with check (auth.uid() = id);


-- ============================================================================
-- 2. POSTS (Sparks)
-- ============================================================================

create table posts (
  id                uuid primary key default gen_random_uuid(),
  author_id         uuid not null references profiles(id) on delete cascade,
  title             text not null,
  slug              text unique not null,
  content           jsonb,
  excerpt           text check (char_length(excerpt) <= 200),
  cover_image       text,
  category          text not null,
  read_time_minutes integer,
  status            text not null default 'draft'
                      check (status in ('draft', 'published', 'archived')),
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table posts enable row level security;

-- Published posts are readable by everyone
create policy "posts_select_published"
  on posts for select
  using (status = 'published' or auth.uid() = author_id);

-- Authors can insert their own posts
create policy "posts_insert_own"
  on posts for insert
  with check (auth.uid() = author_id);

-- Authors can update their own posts
create policy "posts_update_own"
  on posts for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

-- Authors can delete their own posts
create policy "posts_delete_own"
  on posts for delete
  using (auth.uid() = author_id);


-- ============================================================================
-- 3. STACKS (Collaborative collections)
-- ============================================================================

create table stacks (
  id                uuid primary key default gen_random_uuid(),
  owner_id          uuid not null references profiles(id) on delete cascade,
  title             text not null,
  description       text check (char_length(description) <= 500),
  cover_image       text,
  is_collaborative  boolean not null default false,
  is_public         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table stacks enable row level security;

-- Public stacks are readable by everyone; private stacks by owner/collaborators
create policy "stacks_select_public"
  on stacks for select
  using (
    is_public = true
    or auth.uid() = owner_id
    or exists (
      select 1 from stack_collaborators sc
      where sc.stack_id = id and sc.user_id = auth.uid()
    )
  );

-- Owners can insert stacks
create policy "stacks_insert_own"
  on stacks for insert
  with check (auth.uid() = owner_id);

-- Owners can update their stacks
create policy "stacks_update_own"
  on stacks for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Owners can delete their stacks
create policy "stacks_delete_own"
  on stacks for delete
  using (auth.uid() = owner_id);


-- ============================================================================
-- 4. STACK_COLLABORATORS (Join table)
-- ============================================================================

create table stack_collaborators (
  stack_id   uuid not null references stacks(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  role       text not null default 'editor'
               check (role in ('editor', 'viewer')),
  added_at   timestamptz not null default now(),
  primary key (stack_id, user_id)
);

alter table stack_collaborators enable row level security;

-- Collaborators and stack owners can see collaborator entries
create policy "stack_collaborators_select"
  on stack_collaborators for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from stacks s
      where s.id = stack_id and s.owner_id = auth.uid()
    )
  );

-- Only stack owners can add collaborators
create policy "stack_collaborators_insert"
  on stack_collaborators for insert
  with check (
    exists (
      select 1 from stacks s
      where s.id = stack_id and s.owner_id = auth.uid()
    )
  );

-- Only stack owners can remove collaborators
create policy "stack_collaborators_delete"
  on stack_collaborators for delete
  using (
    exists (
      select 1 from stacks s
      where s.id = stack_id and s.owner_id = auth.uid()
    )
  );


-- ============================================================================
-- 5. STACK_ITEMS (Posts saved into a Stack)
-- ============================================================================

create table stack_items (
  id         uuid primary key default gen_random_uuid(),
  stack_id   uuid not null references stacks(id) on delete cascade,
  post_id    uuid not null references posts(id) on delete cascade,
  added_by   uuid not null references profiles(id) on delete cascade,
  position   integer,
  added_at   timestamptz not null default now(),
  unique (stack_id, post_id)
);

alter table stack_items enable row level security;

-- Viewable if the parent stack is viewable (public, owner, or collaborator)
create policy "stack_items_select"
  on stack_items for select
  using (
    exists (
      select 1 from stacks s
      where s.id = stack_id
        and (
          s.is_public = true
          or s.owner_id = auth.uid()
          or exists (
            select 1 from stack_collaborators sc
            where sc.stack_id = s.id and sc.user_id = auth.uid()
          )
        )
    )
  );

-- Owners and editor-collaborators can add items
create policy "stack_items_insert"
  on stack_items for insert
  with check (
    auth.uid() = added_by
    and exists (
      select 1 from stacks s
      where s.id = stack_id
        and (
          s.owner_id = auth.uid()
          or exists (
            select 1 from stack_collaborators sc
            where sc.stack_id = s.id
              and sc.user_id = auth.uid()
              and sc.role = 'editor'
          )
        )
    )
  );

-- Owners and editor-collaborators can remove items
create policy "stack_items_delete"
  on stack_items for delete
  using (
    exists (
      select 1 from stacks s
      where s.id = stack_id
        and (
          s.owner_id = auth.uid()
          or exists (
            select 1 from stack_collaborators sc
            where sc.stack_id = s.id
              and sc.user_id = auth.uid()
              and sc.role = 'editor'
          )
        )
    )
  );

-- Owners and editor-collaborators can reorder items
create policy "stack_items_update"
  on stack_items for update
  using (
    exists (
      select 1 from stacks s
      where s.id = stack_id
        and (
          s.owner_id = auth.uid()
          or exists (
            select 1 from stack_collaborators sc
            where sc.stack_id = s.id
              and sc.user_id = auth.uid()
              and sc.role = 'editor'
          )
        )
    )
  );


-- ============================================================================
-- 6. REACTIONS (Brain reactions)
-- ============================================================================

create table reactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  post_id     uuid not null references posts(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, post_id)
);

alter table reactions enable row level security;

-- Reactions are publicly readable (for counts)
create policy "reactions_select_all"
  on reactions for select
  using (true);

-- Users can create their own reactions
create policy "reactions_insert_own"
  on reactions for insert
  with check (auth.uid() = user_id);

-- Users can remove their own reactions
create policy "reactions_delete_own"
  on reactions for delete
  using (auth.uid() = user_id);


-- ============================================================================
-- 7. NOTES (Personal reflections)
-- ============================================================================

create table notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  post_id     uuid not null references posts(id) on delete cascade,
  content     text check (char_length(content) <= 1000),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table notes enable row level security;

-- Strictly private: users can only see their own notes
create policy "notes_select_own"
  on notes for select
  using (auth.uid() = user_id);

create policy "notes_insert_own"
  on notes for insert
  with check (auth.uid() = user_id);

create policy "notes_update_own"
  on notes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "notes_delete_own"
  on notes for delete
  using (auth.uid() = user_id);


-- ============================================================================
-- 8. STREAK_LOG (Daily activity tracking)
-- ============================================================================

create table streak_log (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references profiles(id) on delete cascade,
  active_date      date not null,
  sparks_read      integer not null default 1,
  session_minutes  integer not null default 0,
  unique (user_id, active_date)
);

alter table streak_log enable row level security;

-- Users can only see their own streak logs
create policy "streak_log_select_own"
  on streak_log for select
  using (auth.uid() = user_id);

create policy "streak_log_insert_own"
  on streak_log for insert
  with check (auth.uid() = user_id);

create policy "streak_log_update_own"
  on streak_log for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ============================================================================
-- 9. FOLLOWS (User-to-user)
-- ============================================================================

create table follows (
  follower_id   uuid not null references profiles(id) on delete cascade,
  following_id  uuid not null references profiles(id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id != following_id)
);

alter table follows enable row level security;

-- Follow relationships are publicly readable
create policy "follows_select_all"
  on follows for select
  using (true);

-- Users can create their own follow relationships
create policy "follows_insert_own"
  on follows for insert
  with check (auth.uid() = follower_id);

-- Users can remove their own follow relationships
create policy "follows_delete_own"
  on follows for delete
  using (auth.uid() = follower_id);


-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- get_brain_count: Returns the total number of brain reactions for a post
create or replace function get_brain_count(target_post_id uuid)
returns integer
language sql
stable
as $$
  select count(*)::integer
  from reactions
  where post_id = target_post_id;
$$;

-- update_streak: Recalculates streak data for a user based on their streak_log.
-- Call this after inserting a new streak_log entry.
create or replace function update_streak(target_user_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_current_streak  integer := 0;
  v_best_streak     integer := 0;
  v_temp_streak     integer := 0;
  v_prev_date       date;
  v_row             record;
begin
  -- Walk through the user's activity dates in descending order
  -- to compute the current streak (consecutive days ending today or yesterday)
  for v_row in
    select active_date
    from streak_log
    where user_id = target_user_id
    order by active_date desc
  loop
    if v_prev_date is null then
      -- First row: check if it is today or yesterday to start current streak
      if v_row.active_date >= current_date - interval '1 day' then
        v_current_streak := 1;
      end if;
      v_temp_streak := 1;
    else
      if v_prev_date - v_row.active_date = 1 then
        -- Consecutive day
        v_temp_streak := v_temp_streak + 1;
        if v_current_streak > 0 then
          v_current_streak := v_temp_streak;
        end if;
      else
        -- Streak broken
        if v_temp_streak > v_best_streak then
          v_best_streak := v_temp_streak;
        end if;
        v_temp_streak := 1;
        -- Once current streak is broken, stop extending it
        if v_current_streak > 0 and v_current_streak < v_temp_streak then
          v_current_streak := v_current_streak; -- no-op, already set
        end if;
      end if;
    end if;
    v_prev_date := v_row.active_date;
  end loop;

  -- Final comparison for best streak
  if v_temp_streak > v_best_streak then
    v_best_streak := v_temp_streak;
  end if;

  -- If current_streak was never started (oldest entry is not recent), keep 0
  if v_current_streak > v_best_streak then
    v_best_streak := v_current_streak;
  end if;

  -- Calculate consecutive weeks (full 7-day windows in current streak)
  update profiles
  set
    current_streak    = v_current_streak,
    best_streak       = v_best_streak,
    consecutive_weeks = v_current_streak / 7,
    last_active_date  = current_date,
    updated_at        = now()
  where id = target_user_id;
end;
$$;


-- ============================================================================
-- INDEXES
-- ============================================================================

-- Profiles
create index idx_profiles_username on profiles (username);

-- Posts
create index idx_posts_author_id on posts (author_id);
create index idx_posts_status on posts (status);
create index idx_posts_category on posts (category);
create index idx_posts_slug on posts (slug);
create index idx_posts_published_at on posts (published_at desc nulls last);
create index idx_posts_status_published_at on posts (status, published_at desc nulls last)
  where status = 'published';

-- Stacks
create index idx_stacks_owner_id on stacks (owner_id);
create index idx_stacks_is_public on stacks (is_public) where is_public = true;

-- Stack collaborators
create index idx_stack_collaborators_user_id on stack_collaborators (user_id);

-- Stack items
create index idx_stack_items_stack_id on stack_items (stack_id);
create index idx_stack_items_post_id on stack_items (post_id);
create index idx_stack_items_position on stack_items (stack_id, position);

-- Reactions
create index idx_reactions_post_id on reactions (post_id);
create index idx_reactions_user_id on reactions (user_id);

-- Notes
create index idx_notes_user_id on notes (user_id);
create index idx_notes_post_id on notes (post_id);
create index idx_notes_user_post on notes (user_id, post_id);

-- Streak log
create index idx_streak_log_user_id on streak_log (user_id);
create index idx_streak_log_user_date on streak_log (user_id, active_date desc);

-- Follows
create index idx_follows_follower_id on follows (follower_id);
create index idx_follows_following_id on follows (following_id);


-- ============================================================================
-- TRIGGERS: auto-update updated_at timestamps
-- ============================================================================

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create trigger trg_posts_updated_at
  before update on posts
  for each row execute function set_updated_at();

create trigger trg_stacks_updated_at
  before update on stacks
  for each row execute function set_updated_at();

create trigger trg_notes_updated_at
  before update on notes
  for each row execute function set_updated_at();
