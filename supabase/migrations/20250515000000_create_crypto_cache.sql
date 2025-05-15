
-- Create table for caching cryptocurrency data
CREATE TABLE IF NOT EXISTS public.crypto_data_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coin_id TEXT NOT NULL,
  days TEXT NOT NULL,
  currency TEXT NOT NULL,
  data_source TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_crypto_data_cache_lookup
ON public.crypto_data_cache (coin_id, days, currency);

-- Create index on updated_at for cleanup operations
CREATE INDEX IF NOT EXISTS idx_crypto_data_cache_updated_at
ON public.crypto_data_cache (updated_at);

-- Enable row-level security
ALTER TABLE public.crypto_data_cache ENABLE ROW LEVEL SECURITY;

-- Create public access policy (read-only for everyone)
CREATE POLICY "Allow public read access"
  ON public.crypto_data_cache
  FOR SELECT
  TO public
  USING (true);

-- Function that cleans up old cache entries (keep last 24 hours only)
CREATE OR REPLACE FUNCTION public.clean_crypto_cache() RETURNS void AS $$
BEGIN
  DELETE FROM public.crypto_data_cache 
  WHERE updated_at < (now() - INTERVAL '24 hours');
END;
$$ LANGUAGE plpgsql;

-- Create table for broadcast messages to enable realtime updates
CREATE TABLE IF NOT EXISTS public.broadcast_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL,
  event TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row-level security
ALTER TABLE public.broadcast_messages ENABLE ROW LEVEL SECURITY;

-- Create public access policy (read-only for everyone)
CREATE POLICY "Allow public read access"
  ON public.broadcast_messages
  FOR SELECT
  TO public
  USING (true);

-- Enable the tables for realtime
BEGIN;
  -- Enable the realtime extension
  CREATE EXTENSION IF NOT EXISTS pg_net;
  
  -- Enable REPLICA IDENTITY FULL for all needed tables
  ALTER TABLE public.crypto_data_cache REPLICA IDENTITY FULL;
  ALTER TABLE public.broadcast_messages REPLICA IDENTITY FULL;
  
  -- Add tables to the realtime publication
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.crypto_data_cache, public.broadcast_messages;
COMMIT;
