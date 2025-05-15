
-- Create crypto cache table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.crypto_data_cache (
  id BIGSERIAL PRIMARY KEY,
  coin_id TEXT NOT NULL,
  days TEXT NOT NULL,
  currency TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_crypto_cache_lookup 
ON public.crypto_data_cache(coin_id, days, currency);

-- Index for cleanup by date
CREATE INDEX IF NOT EXISTS idx_crypto_cache_created_at 
ON public.crypto_data_cache(created_at);

-- Create a function to create the table if it doesn't exist
-- This is used by the edge function
CREATE OR REPLACE FUNCTION public.create_crypto_cache_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the table exists, if not create it
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'crypto_data_cache'
  ) THEN
    -- Create the table
    CREATE TABLE public.crypto_data_cache (
      id BIGSERIAL PRIMARY KEY,
      coin_id TEXT NOT NULL,
      days TEXT NOT NULL,
      currency TEXT NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );

    -- Create indexes
    CREATE INDEX idx_crypto_cache_lookup 
    ON public.crypto_data_cache(coin_id, days, currency);
    
    CREATE INDEX idx_crypto_cache_created_at 
    ON public.crypto_data_cache(created_at);
  END IF;
END;
$$;

-- Create the broadcasts table for realtime updates if it doesn't exist
CREATE TABLE IF NOT EXISTS public.realtime_broadcasts (
    id BIGSERIAL PRIMARY KEY,
    channel TEXT NOT NULL,
    event TEXT NOT NULL,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable realtime on the broadcasts table
ALTER PUBLICATION supabase_realtime ADD TABLE realtime_broadcasts;

-- Create a trigger function for cleanup
CREATE OR REPLACE FUNCTION cleanup_old_broadcasts() RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM realtime_broadcasts 
  WHERE created_at < NOW() - INTERVAL '1 day';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create the cleanup trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_cleanup_broadcasts'
  ) THEN
    CREATE TRIGGER trigger_cleanup_broadcasts
    AFTER INSERT ON realtime_broadcasts
    FOR EACH STATEMENT
    EXECUTE PROCEDURE cleanup_old_broadcasts();
  END IF;
END;
$$;
