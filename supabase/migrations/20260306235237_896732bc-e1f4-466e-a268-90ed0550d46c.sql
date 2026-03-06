
-- Riders table
CREATE TABLE public.riders (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text DEFAULT '',
  phone text DEFAULT '',
  avatar text DEFAULT '',
  status text NOT NULL DEFAULT 'available',
  rating numeric(2,1) NOT NULL DEFAULT 5.0,
  vehicle_id text DEFAULT '',
  vehicle_model text DEFAULT '',
  vehicle_plates text DEFAULT '',
  vehicle_year integer DEFAULT 2024,
  circulation_card text DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Rider documents table
CREATE TABLE public.rider_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id text NOT NULL REFERENCES public.riders(id) ON DELETE CASCADE,
  doc_type text NOT NULL, -- ine_front, ine_back, license_front, license_back, circulation_card
  file_url text NOT NULL,
  file_name text DEFAULT '',
  uploaded_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rider_documents ENABLE ROW LEVEL SECURITY;

-- Public policies (matching existing pattern)
CREATE POLICY "Anyone can read riders" ON public.riders FOR SELECT USING (true);
CREATE POLICY "Anyone can insert riders" ON public.riders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update riders" ON public.riders FOR UPDATE USING (true);

CREATE POLICY "Anyone can read rider_documents" ON public.rider_documents FOR SELECT USING (true);
CREATE POLICY "Anyone can insert rider_documents" ON public.rider_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update rider_documents" ON public.rider_documents FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete rider_documents" ON public.rider_documents FOR DELETE USING (true);

-- Storage bucket for rider documents
INSERT INTO storage.buckets (id, name, public) VALUES ('rider-documents', 'rider-documents', true);

-- Storage policies
CREATE POLICY "Anyone can upload rider docs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'rider-documents');
CREATE POLICY "Anyone can view rider docs" ON storage.objects FOR SELECT USING (bucket_id = 'rider-documents');
CREATE POLICY "Anyone can delete rider docs" ON storage.objects FOR DELETE USING (bucket_id = 'rider-documents');

-- Seed with existing mock data
INSERT INTO public.riders (id, name, email, phone, avatar, status, rating, vehicle_id, vehicle_model, vehicle_plates, vehicle_year, circulation_card) VALUES
  ('R-001', 'Carlos Méndez', 'carlos.mendez@flou.mx', '228-112-3344', 'CM', 'available', 4.8, 'V-001', 'Italika FT150', 'XAL-1234', 2023, 'TC-001234'),
  ('R-002', 'Luis Hernández', 'luis.hernandez@flou.mx', '228-223-4455', 'LH', 'on_route', 4.5, 'V-002', 'Vento Rebellian 150', 'XAL-2345', 2022, 'TC-002345'),
  ('R-003', 'Ana Torres', 'ana.torres@flou.mx', '228-334-5566', 'AT', 'available', 4.9, 'V-003', 'Italika DM150', 'XAL-3456', 2024, 'TC-003456'),
  ('R-004', 'Miguel Ruiz', 'miguel.ruiz@flou.mx', '228-445-6677', 'MR', 'on_route', 4.2, 'V-004', 'Honda Cargo 150', 'XAL-4567', 2021, 'TC-004567'),
  ('R-005', 'Fernanda López', 'fernanda.lopez@flou.mx', '228-556-7788', 'FL', 'paused', 4.7, 'V-005', 'Italika FT125', 'XAL-5678', 2023, 'TC-005678'),
  ('R-006', 'Jorge Castillo', 'jorge.castillo@flou.mx', '228-667-8899', 'JC', 'available', 4.6, 'V-006', 'Vento Crossmax 200', 'XAL-6789', 2024, 'TC-006789'),
  ('R-007', 'Diana Vargas', 'diana.vargas@flou.mx', '228-778-9900', 'DV', 'on_route', 4.4, 'V-007', 'Italika DT150 Sport', 'XAL-7890', 2022, 'TC-007890');
