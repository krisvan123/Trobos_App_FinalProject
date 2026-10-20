-- TROBOS academic prototype. Apply in Supabase SQL Editor after enabling Auth.
-- Auth users are managed by Supabase; no passwords or payment credentials in this table.
CREATE TABLE IF NOT EXISTS public.trobos_trips (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id text NOT NULL CHECK (length(trip_id) BETWEEN 7 AND 36),
  trip_data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, trip_id)
);

ALTER TABLE public.trobos_trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own demo trips" ON public.trobos_trips;
CREATE POLICY "Users can read their own demo trips" ON public.trobos_trips
FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own demo trips" ON public.trobos_trips;
CREATE POLICY "Users can insert their own demo trips" ON public.trobos_trips
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own demo trips" ON public.trobos_trips;
CREATE POLICY "Users can update their own demo trips" ON public.trobos_trips
FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE ON public.trobos_trips TO authenticated;
