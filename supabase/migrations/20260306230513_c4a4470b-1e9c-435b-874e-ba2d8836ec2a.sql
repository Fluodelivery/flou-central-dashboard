-- Table to store real-time rider GPS locations
CREATE TABLE public.rider_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rider_id TEXT NOT NULL UNIQUE,
  rider_name TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  heading DOUBLE PRECISION DEFAULT 0,
  speed DOUBLE PRECISION DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rider_locations ENABLE ROW LEVEL SECURITY;

-- Central can read all rider locations
CREATE POLICY "Anyone can read rider locations"
  ON public.rider_locations FOR SELECT
  TO authenticated
  USING (true);

-- Riders can upsert their own location (from the app)
CREATE POLICY "Anyone can insert rider locations"
  ON public.rider_locations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update rider locations"
  ON public.rider_locations FOR UPDATE
  TO authenticated
  USING (true);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.rider_locations;

-- Index for fast lookups
CREATE INDEX idx_rider_locations_rider_id ON public.rider_locations (rider_id);
CREATE INDEX idx_rider_locations_updated_at ON public.rider_locations (updated_at DESC);