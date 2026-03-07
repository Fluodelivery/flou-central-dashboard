
-- Corporate clients table
CREATE TABLE public.corporate_clients (
  id text PRIMARY KEY,
  name text NOT NULL,
  contact_name text NOT NULL DEFAULT '',
  contact_phone text DEFAULT '',
  contact_email text DEFAULT '',
  address text DEFAULT '',
  lat double precision DEFAULT 19.5438,
  lng double precision DEFAULT -96.9102,
  monthly_volume integer DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  since date NOT NULL DEFAULT CURRENT_DATE,
  notes text DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.corporate_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read corporate_clients" ON public.corporate_clients FOR SELECT USING (true);
CREATE POLICY "Anyone can insert corporate_clients" ON public.corporate_clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update corporate_clients" ON public.corporate_clients FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete corporate_clients" ON public.corporate_clients FOR DELETE USING (true);

-- Client documents table (facade photos, logo, promo material)
CREATE TABLE public.client_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL REFERENCES public.corporate_clients(id) ON DELETE CASCADE,
  doc_type text NOT NULL, -- 'facade', 'logo', 'promo'
  file_url text NOT NULL,
  file_name text DEFAULT '',
  uploaded_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read client_documents" ON public.client_documents FOR SELECT USING (true);
CREATE POLICY "Anyone can insert client_documents" ON public.client_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update client_documents" ON public.client_documents FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete client_documents" ON public.client_documents FOR DELETE USING (true);

-- Storage bucket for client media
INSERT INTO storage.buckets (id, name, public) VALUES ('client-media', 'client-media', true);

CREATE POLICY "Anyone can upload client media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'client-media');
CREATE POLICY "Anyone can read client media" ON storage.objects FOR SELECT USING (bucket_id = 'client-media');
CREATE POLICY "Anyone can delete client media" ON storage.objects FOR DELETE USING (bucket_id = 'client-media');

-- Seed initial data from mock
INSERT INTO public.corporate_clients (id, name, contact_name, contact_phone, contact_email, monthly_volume, status, since, address, lat, lng) VALUES
  ('C-001', 'Starbucks Xalapa', 'Mariana Delgado', '228-100-2000', 'm.delgado@starbucks.mx', 320, 'active', '2025-01-15', 'Av. Ávila Camacho 32, Centro, Xalapa', 19.5300, -96.9220),
  ('C-002', 'Farmacias Guadalajara', 'Roberto Sánchez', '228-200-3000', 'r.sanchez@fguadalajara.mx', 580, 'active', '2024-11-01', 'Av. 20 de Noviembre 15, Centro, Xalapa', 19.5280, -96.9180),
  ('C-003', 'La Parroquia de Veracruz', 'Elena Martínez', '228-300-4000', 'e.martinez@parroquia.mx', 150, 'active', '2025-03-20', 'Calle Enríquez 108, Centro, Xalapa', 19.5320, -96.9200),
  ('C-004', 'Notaría Méndez & Asoc.', 'Lic. Méndez', '228-400-5000', 'notaria5@mendez.mx', 85, 'active', '2025-06-10', 'Av. Xalapa 305, Unidad del Bosque, Xalapa', 19.5400, -96.9100),
  ('C-005', 'PetLove Veterinaria', 'Dr. Campos', '228-500-6000', 'contacto@petlove.mx', 42, 'pending', '2026-01-05', 'Calle Clavijero 78, Centro, Xalapa', 19.5290, -96.9210);
