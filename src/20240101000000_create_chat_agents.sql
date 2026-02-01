-- Create chat_agents table to store AI consultant configurations
-- Core Agent Table (V2 Canonical Design)
CREATE TABLE public.chat_agents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Identity
    name text NOT NULL,
    company_name text,

    -- Agent Brain
    style text,
    system_prompt text,

    -- Structured Memory (JSONB for scalability)
    profile jsonb NOT NULL DEFAULT '{}',        -- Who am I
    listings jsonb NOT NULL DEFAULT '[]',       -- Inventory / Assets
    tools jsonb NOT NULL DEFAULT '[]',          -- Enabled tools
    contact jsonb NOT NULL DEFAULT '{}',        -- Phone / Email / Links
    constraints jsonb NOT NULL DEFAULT '{}',    -- Rules / Boundaries
    file_urls text[] DEFAULT '{}',

    -- Lifecycle
    state text CHECK (state IN ('draft','configured','active','paused','archived')) NOT NULL DEFAULT 'draft',
    version int DEFAULT 1,

    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),

    UNIQUE (user_id, name)
);

-- Enable Row Level Security
alter table public.chat_agents enable row level security;

-- Create policies to ensure users can only access their own agent data
create policy "Users can view their own chat agent"
    on public.chat_agents for select
    using (auth.uid() = user_id);

CREATE POLICY "agent_owner_access"
ON public.chat_agents
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Conversation Log Table
CREATE TABLE public.agent_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id uuid NOT NULL REFERENCES public.chat_agents(id) ON DELETE CASCADE,
    role text CHECK (role IN ('system','user','assistant','tool')),
    content jsonb NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_by_owner"
ON public.agent_messages
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.chat_agents a
    WHERE a.id = agent_messages.agent_id
    AND a.user_id = auth.uid()
  )
);

-- 4. Message Governor: Prevent infinite growth
-- Automatically delete messages older than 30 days
CREATE OR REPLACE FUNCTION public.cleanup_old_agent_messages()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM public.agent_messages 
  WHERE created_at < now() - interval '30 days';
$$;

-- Schedule message cleanup daily
SELECT cron.schedule('cleanup-messages', '0 0 * * *', 'SELECT public.cleanup_old_agent_messages()');

-- Create a function to handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create the trigger
create trigger set_updated_at
    before update on public.chat_agents
    for each row
    execute function public.handle_updated_at();

-- Enable real-time for the chat_agents table
alter publication supabase_realtime add table public.chat_agents;

-- Secure Realtime Broadcast Setup
-- 1. Allow authenticated users to receive broadcasts for their own agent topic
CREATE POLICY "Users can receive their own agent broadcasts" ON realtime.messages
  FOR SELECT TO authenticated
  USING ( realtime.topic() = 'agent:' || auth.uid()::text );

-- 2. Trigger function to broadcast changes for public.chat_agents
CREATE OR REPLACE FUNCTION public.broadcast_agent_change()
RETURNS trigger
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  target_user uuid;
BEGIN
  target_user := COALESCE(NEW.user_id, OLD.user_id);

  -- Optimization: Skip no-op updates to reduce client churn
  IF TG_OP = 'UPDATE' AND NEW IS NOT DISTINCT FROM OLD THEN
    RETURN NULL;
  END IF;

  IF target_user IS NULL THEN
    RETURN NULL;
  END IF;

  PERFORM realtime.broadcast_changes(
    'agent:' || target_user::text,
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );

  RETURN NULL;
END;
$$;

-- 3. Trigger
CREATE TRIGGER agent_change_broadcast
AFTER INSERT OR UPDATE OR DELETE ON public.chat_agents
FOR EACH ROW EXECUTE FUNCTION public.broadcast_agent_change();

-- 5. Agent Version Snapshots
CREATE TABLE public.agent_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id uuid NOT NULL REFERENCES public.chat_agents(id) ON DELETE CASCADE,
    version int NOT NULL,
    system_prompt text,
    profile jsonb,
    listings jsonb,
    constraints jsonb,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.agent_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "version_owner_access" ON public.agent_versions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.chat_agents a WHERE a.id = agent_versions.agent_id AND a.user_id = auth.uid())
);

CREATE OR REPLACE FUNCTION public.snapshot_agent_version()
RETURNS trigger AS $$
BEGIN
    IF (TG_OP = 'INSERT') OR (NEW.system_prompt IS DISTINCT FROM OLD.system_prompt OR NEW.profile IS DISTINCT FROM OLD.profile) THEN
        INSERT INTO public.agent_versions (agent_id, version, system_prompt, profile, listings, constraints)
        VALUES (NEW.id, NEW.version, NEW.system_prompt, NEW.profile, NEW.listings, NEW.constraints);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER agent_snapshot_trigger
AFTER INSERT OR UPDATE ON public.chat_agents
FOR EACH ROW EXECUTE FUNCTION public.snapshot_agent_version();

-- 4. Versioning Teeth: Increment version on system_prompt change
CREATE OR REPLACE FUNCTION public.increment_agent_version()
RETURNS trigger
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.system_prompt IS DISTINCT FROM OLD.system_prompt THEN
    NEW.version := OLD.version + 1;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER agent_version_increment
BEFORE UPDATE ON public.chat_agents
FOR EACH ROW EXECUTE FUNCTION public.increment_agent_version();

-- Custom Login Tokens table for one-click login bypass
CREATE TABLE public.login_tokens (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    ip_address text,
    user_agent text,
    clicked_at timestamptz,
    expires_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.login_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "token_owner"
ON public.login_tokens
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX login_tokens_valid
ON public.login_tokens (token)
WHERE expires_at > now();

-- Cleanup Job (Requires pg_cron extension enabled in Supabase)
CREATE OR REPLACE FUNCTION public.cleanup_expired_login_tokens()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM public.login_tokens WHERE expires_at < now();
$$;

-- Schedule the cleanup every hour
SELECT cron.schedule('cleanup-tokens', '0 * * * *', 'SELECT public.cleanup_expired_login_tokens()');