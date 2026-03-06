
-- Drop restrictive policies (they block access since no permissive ones exist)
DROP POLICY IF EXISTS "Anyone can read rider locations" ON public.rider_locations;
DROP POLICY IF EXISTS "Anyone can insert rider locations" ON public.rider_locations;
DROP POLICY IF EXISTS "Anyone can update rider locations" ON public.rider_locations;

-- Create PERMISSIVE policies
CREATE POLICY "Anyone can read rider locations"
  ON public.rider_locations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert rider locations"
  ON public.rider_locations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update rider locations"
  ON public.rider_locations FOR UPDATE
  USING (true);
