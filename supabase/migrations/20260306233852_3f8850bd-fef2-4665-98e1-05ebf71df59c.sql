
-- Create alerts table
CREATE TABLE public.alerts (
  id text PRIMARY KEY,
  type text NOT NULL DEFAULT 'exception',
  rider_id text NOT NULL DEFAULT '',
  rider_name text NOT NULL DEFAULT 'Sin asignar',
  rider_phone text DEFAULT '',
  client_phone text DEFAULT '',
  order_id text DEFAULT '',
  message text NOT NULL,
  location text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  resolved boolean NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Permissive policies for public read/write (no auth required, like rider_locations)
CREATE POLICY "Anyone can read alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert alerts" ON public.alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update alerts" ON public.alerts FOR UPDATE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;

-- Seed with existing mock data
INSERT INTO public.alerts (id, type, rider_id, rider_name, rider_phone, client_phone, order_id, message, location, created_at, resolved) VALUES
  ('ALT-001', 'sos', 'R-002', 'Luis Hernández', '228-223-4455', '228-100-2000', 'ORD-1038', 'Accidente menor en Av. Camacho. Necesito asistencia.', 'Av. Camacho y Calle 5', now() - interval '3 minutes', false),
  ('ALT-002', 'exception', 'R-004', 'Miguel Ruiz', '228-445-6677', '228-300-4000', 'ORD-1039', 'Local cerrado. No hay nadie para recibir el paquete.', 'Col. Centro #14', now() - interval '8 minutes', false),
  ('ALT-003', 'delay', 'R-007', 'Diana Vargas', '228-778-9900', '228-500-6000', 'ORD-1040', 'Tráfico intenso en zona de Ánimas. Retraso de ~15 min.', 'Blvd. Ánimas', now() - interval '12 minutes', false),
  ('ALT-004', 'exception', 'R-002', 'Luis Hernández', '228-223-4455', '228-200-3000', 'ORD-1035', 'Dirección incorrecta. El cliente no se ubica.', 'Col. Progreso #99', now() - interval '25 minutes', true),
  ('ALT-005', 'stalled_order', '', 'Sin asignar', '', '228-400-5000', 'ORD-1044', 'Pedido ORD-1044 lleva 12 min sin ser aceptado. Requiere asignación urgente.', 'Notaría Pública #5', now() - interval '1 minute', false),
  ('ALT-006', 'idle_rider', 'R-002', 'Luis Hernández', '228-223-4455', '', 'ORD-1038', 'Repartidor detenido 14 min en Av. Camacho esq. Calle 3. No es punto de entrega/recogida. Posible problema mecánico.', 'Av. Camacho esq. Calle 3', now() - interval '2 minutes', false);
