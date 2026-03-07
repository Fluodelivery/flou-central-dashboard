// ===== PEDIDOS SIN ASIGNAR =====
export interface PendingOrder {
  id: string;
  origin: string;
  destination: string;
  packageType: string;
  timeAgo: string;
  minutesWaiting: number;
  clientName: string;
  priority: "normal" | "urgent";
}

export const pendingOrders: PendingOrder[] = [
  { id: "ORD-1041", origin: "Starbucks Ánimas", destination: "Col. Progreso #42", packageType: "📄 Sobre", timeAgo: "2 min", minutesWaiting: 2, clientName: "Starbucks", priority: "urgent" },
  { id: "ORD-1042", origin: "Farmacia Guadalajara Centro", destination: "Fracc. Jardines #18", packageType: "📦 Caja pequeña", timeAgo: "5 min", minutesWaiting: 5, clientName: "Farmacias GDL", priority: "normal" },
  { id: "ORD-1043", origin: "Pastelería La Parroquia", destination: "Col. Revolución #7", packageType: "🎂 Frágil", timeAgo: "8 min", minutesWaiting: 8, clientName: "La Parroquia", priority: "normal" },
  { id: "ORD-1044", origin: "Notaría Pública #5", destination: "Palacio Municipal", packageType: "📄 Documentos", timeAgo: "12 min", minutesWaiting: 12, clientName: "Notaría Méndez", priority: "urgent" },
  { id: "ORD-1045", origin: "Veterinaria PetLove", destination: "Col. Tamborrel #33", packageType: "💊 Medicamento", timeAgo: "15 min", minutesWaiting: 15, clientName: "PetLove", priority: "normal" },
];

// ===== REPARTIDORES =====
export interface Rider {
  id: string;
  name: string;
  phone: string;
  status: "available" | "on_route" | "paused" | "offline";
  rating: number;
  avatar: string;
  currentOrder?: string;
  vehicleId: string;
  idleMinutes?: number;
  lastKnownLocation?: string;
}

export const riders: Rider[] = [
  { id: "R-001", name: "Carlos Méndez", phone: "228-112-3344", status: "available", rating: 4.8, avatar: "CM", vehicleId: "V-001" },
  { id: "R-002", name: "Luis Hernández", phone: "228-223-4455", status: "on_route", rating: 4.5, avatar: "LH", currentOrder: "ORD-1038", vehicleId: "V-002", idleMinutes: 14, lastKnownLocation: "Av. Camacho esq. Calle 3" },
  { id: "R-003", name: "Ana Torres", phone: "228-334-5566", status: "available", rating: 4.9, avatar: "AT", vehicleId: "V-003" },
  { id: "R-004", name: "Miguel Ruiz", phone: "228-445-6677", status: "on_route", rating: 4.2, avatar: "MR", currentOrder: "ORD-1039", vehicleId: "V-004" },
  { id: "R-005", name: "Fernanda López", phone: "228-556-7788", status: "paused", rating: 4.7, avatar: "FL", vehicleId: "V-005" },
  { id: "R-006", name: "Jorge Castillo", phone: "228-667-8899", status: "available", rating: 4.6, avatar: "JC", vehicleId: "V-006" },
  { id: "R-007", name: "Diana Vargas", phone: "228-778-9900", status: "on_route", rating: 4.4, avatar: "DV", currentOrder: "ORD-1040", vehicleId: "V-007" },
];

// ===== ALERTAS =====
export interface Alert {
  id: string;
  type: "sos" | "exception" | "delay" | "stalled_order" | "idle_rider";
  riderId: string;
  riderName: string;
  riderPhone: string;
  clientPhone: string;
  orderId: string;
  message: string;
  location: string;
  timestamp: string;
  resolved: boolean;
}

export const alerts: Alert[] = [
  { id: "ALT-001", type: "sos", riderId: "R-002", riderName: "Luis Hernández", riderPhone: "228-223-4455", clientPhone: "228-100-2000", orderId: "ORD-1038", message: "Accidente menor en Av. Camacho. Necesito asistencia.", location: "Av. Camacho y Calle 5", timestamp: "Hace 3 min", resolved: false },
  { id: "ALT-002", type: "exception", riderId: "R-004", riderName: "Miguel Ruiz", riderPhone: "228-445-6677", clientPhone: "228-300-4000", orderId: "ORD-1039", message: "Local cerrado. No hay nadie para recibir el paquete.", location: "Col. Centro #14", timestamp: "Hace 8 min", resolved: false },
  { id: "ALT-003", type: "delay", riderId: "R-007", riderName: "Diana Vargas", riderPhone: "228-778-9900", clientPhone: "228-500-6000", orderId: "ORD-1040", message: "Tráfico intenso en zona de Ánimas. Retraso de ~15 min.", location: "Blvd. Ánimas", timestamp: "Hace 12 min", resolved: false },
  { id: "ALT-004", type: "exception", riderId: "R-002", riderName: "Luis Hernández", riderPhone: "228-223-4455", clientPhone: "228-200-3000", orderId: "ORD-1035", message: "Dirección incorrecta. El cliente no se ubica.", location: "Col. Progreso #99", timestamp: "Hace 25 min", resolved: true },
  { id: "ALT-005", type: "stalled_order", riderId: "", riderName: "Sin asignar", riderPhone: "", clientPhone: "228-400-5000", orderId: "ORD-1044", message: "Pedido ORD-1044 lleva 12 min sin ser aceptado. Requiere asignación urgente.", location: "Notaría Pública #5", timestamp: "Hace 1 min", resolved: false },
  { id: "ALT-006", type: "idle_rider", riderId: "R-002", riderName: "Luis Hernández", riderPhone: "228-223-4455", clientPhone: "", orderId: "ORD-1038", message: "Repartidor detenido 14 min en Av. Camacho esq. Calle 3. No es punto de entrega/recogida. Posible problema mecánico.", location: "Av. Camacho esq. Calle 3", timestamp: "Hace 2 min", resolved: false },
];

// ===== VEHÍCULOS =====
export interface Vehicle {
  id: string;
  plates: string;
  model: string;
  year: number;
  km: number;
  nextMaintenance: string;
  status: "active" | "maintenance" | "inactive";
}

export const vehicles: Vehicle[] = [
  { id: "V-001", plates: "XAL-1234", model: "Italika FT150", year: 2023, km: 12400, nextMaintenance: "2026-03-15", status: "active" },
  { id: "V-002", plates: "XAL-2345", model: "Vento Rebellian 150", year: 2022, km: 28700, nextMaintenance: "2026-03-01", status: "active" },
  { id: "V-003", plates: "XAL-3456", model: "Italika DM150", year: 2024, km: 5200, nextMaintenance: "2026-04-20", status: "active" },
  { id: "V-004", plates: "XAL-4567", model: "Honda Cargo 150", year: 2021, km: 45100, nextMaintenance: "2026-02-28", status: "maintenance" },
  { id: "V-005", plates: "XAL-5678", model: "Italika FT125", year: 2023, km: 18300, nextMaintenance: "2026-05-10", status: "active" },
  { id: "V-006", plates: "XAL-6789", model: "Vento Crossmax 200", year: 2024, km: 3100, nextMaintenance: "2026-06-01", status: "active" },
  { id: "V-007", plates: "XAL-7890", model: "Italika DT150 Sport", year: 2022, km: 31200, nextMaintenance: "2026-03-10", status: "active" },
];

// ===== CLIENTES B2B =====
export interface CorporateClient {
  id: string;
  name: string;
  contact: string;
  contactPhone: string;
  email: string;
  monthlyVolume: number;
  rate: number;
  status: "active" | "suspended" | "pending";
  since: string;
}

export const corporateClients: CorporateClient[] = [
  { id: "C-001", name: "Starbucks Xalapa", contact: "Mariana Delgado", contactPhone: "228-100-2000", email: "m.delgado@starbucks.mx", monthlyVolume: 320, rate: 45, status: "active", since: "2025-01-15" },
  { id: "C-002", name: "Farmacias Guadalajara", contact: "Roberto Sánchez", contactPhone: "228-200-3000", email: "r.sanchez@fguadalajara.mx", monthlyVolume: 580, rate: 38, status: "active", since: "2024-11-01" },
  { id: "C-003", name: "La Parroquia de Veracruz", contact: "Elena Martínez", contactPhone: "228-300-4000", email: "e.martinez@parroquia.mx", monthlyVolume: 150, rate: 50, status: "active", since: "2025-03-20" },
  { id: "C-004", name: "Notaría Méndez & Asoc.", contact: "Lic. Méndez", contactPhone: "228-400-5000", email: "notaria5@mendez.mx", monthlyVolume: 85, rate: 55, status: "active", since: "2025-06-10" },
  { id: "C-005", name: "PetLove Veterinaria", contact: "Dr. Campos", contactPhone: "228-500-6000", email: "contacto@petlove.mx", monthlyVolume: 42, rate: 60, status: "pending", since: "2026-01-05" },
];

// ===== HISTORIAL DE PEDIDOS =====
export interface HistoricalOrder {
  id: string;
  date: string;
  client: string;
  rider: string;
  origin: string;
  destination: string;
  status: "completed" | "cancelled" | "returned";
  pickupTime: string;
  deliveryTime: string;
  amount: number;
  paymentMethod: "cash" | "credit" | "transfer";
  hasPhoto: boolean;
  hasPin: boolean;
}

export const historicalOrders: HistoricalOrder[] = [
  { id: "ORD-1030", date: "2026-02-24", client: "Starbucks", rider: "Carlos Méndez", origin: "Starbucks Ánimas", destination: "Col. Progreso #42", status: "completed", pickupTime: "09:15", deliveryTime: "09:42", amount: 45, paymentMethod: "credit", hasPhoto: true, hasPin: true },
  { id: "ORD-1031", date: "2026-02-24", client: "Farmacias GDL", rider: "Ana Torres", origin: "Farmacia Centro", destination: "Fracc. Jardines #18", status: "completed", pickupTime: "09:30", deliveryTime: "10:05", amount: 38, paymentMethod: "cash", hasPhoto: true, hasPin: false },
  { id: "ORD-1032", date: "2026-02-24", client: "La Parroquia", rider: "Luis Hernández", origin: "Parroquia Ánimas", destination: "Col. Revolución #7", status: "cancelled", pickupTime: "10:00", deliveryTime: "-", amount: 0, paymentMethod: "credit", hasPhoto: false, hasPin: false },
  { id: "ORD-1033", date: "2026-02-23", client: "Notaría Méndez", rider: "Miguel Ruiz", origin: "Notaría #5 Centro", destination: "Palacio Municipal", status: "completed", pickupTime: "11:20", deliveryTime: "11:45", amount: 55, paymentMethod: "transfer", hasPhoto: true, hasPin: true },
  { id: "ORD-1034", date: "2026-02-23", client: "PetLove", rider: "Fernanda López", origin: "PetLove Ánimas", destination: "Col. Tamborrel #33", status: "returned", pickupTime: "14:00", deliveryTime: "-", amount: 0, paymentMethod: "cash", hasPhoto: false, hasPin: false },
  { id: "ORD-1035", date: "2026-02-23", client: "Starbucks", rider: "Jorge Castillo", origin: "Starbucks Centro", destination: "Col. Indeco #5", status: "completed", pickupTime: "15:30", deliveryTime: "15:55", amount: 45, paymentMethod: "cash", hasPhoto: true, hasPin: true },
  { id: "ORD-1036", date: "2026-02-22", client: "Farmacias GDL", rider: "Diana Vargas", origin: "Farmacia Ánimas", destination: "Fracc. Monte Magno #12", status: "completed", pickupTime: "08:45", deliveryTime: "09:20", amount: 38, paymentMethod: "credit", hasPhoto: true, hasPin: true },
  { id: "ORD-1037", date: "2026-02-22", client: "La Parroquia", rider: "Carlos Méndez", origin: "Parroquia Centro", destination: "Col. Ruiz Cortines #28", status: "completed", pickupTime: "10:10", deliveryTime: "10:38", amount: 50, paymentMethod: "transfer", hasPhoto: true, hasPin: false },
];

// ===== FINANZAS =====

// --- Desglose completo de repartidores ---
export interface RiderFinance {
  riderId: string;
  riderName: string;
  shift: string;
  totalDeliveries: number;
  cashOrders: number;
  cashAmount: number;
  cardOrders: number;
  cardAmount: number;
  transferOrders: number;
  transferAmount: number;
  totalCollected: number;
  walletBalance: number;
  commissionRate: number;
  commissionAmount: number;
  bonuses: number;
  grossEarnings: number;
  ivaWithheld: number;
  isrWithheld: number;
  netPayout: number;
  owedToCompany: number;
  cashoutStatus: "pending" | "settled";
}

export const riderFinances: RiderFinance[] = [
  { riderId: "R-001", riderName: "Carlos Méndez", shift: "Matutino", totalDeliveries: 12, cashOrders: 5, cashAmount: 225, cardOrders: 5, cardAmount: 225, transferOrders: 2, transferAmount: 90, totalCollected: 540, walletBalance: 315, commissionRate: 0.20, commissionAmount: 108, bonuses: 50, grossEarnings: 158, ivaWithheld: 25.28, isrWithheld: 15.80, netPayout: 116.92, owedToCompany: 225, cashoutStatus: "pending" },
  { riderId: "R-002", riderName: "Luis Hernández", shift: "Matutino", totalDeliveries: 8, cashOrders: 3, cashAmount: 114, cardOrders: 3, cardAmount: 152, transferOrders: 2, transferAmount: 114, totalCollected: 380, walletBalance: 266, commissionRate: 0.20, commissionAmount: 76, bonuses: 0, grossEarnings: 76, ivaWithheld: 12.16, isrWithheld: 7.60, netPayout: 56.24, owedToCompany: 114, cashoutStatus: "pending" },
  { riderId: "R-003", riderName: "Ana Torres", shift: "Matutino", totalDeliveries: 15, cashOrders: 7, cashAmount: 342, cardOrders: 5, cardAmount: 228, transferOrders: 3, transferAmount: 150, totalCollected: 720, walletBalance: 378, commissionRate: 0.22, commissionAmount: 158.40, bonuses: 80, grossEarnings: 238.40, ivaWithheld: 38.14, isrWithheld: 23.84, netPayout: 176.42, owedToCompany: 342, cashoutStatus: "settled" },
  { riderId: "R-004", riderName: "Miguel Ruiz", shift: "Vespertino", totalDeliveries: 6, cashOrders: 4, cashAmount: 180, cardOrders: 1, cardAmount: 55, transferOrders: 1, transferAmount: 55, totalCollected: 290, walletBalance: 110, commissionRate: 0.20, commissionAmount: 58, bonuses: 0, grossEarnings: 58, ivaWithheld: 9.28, isrWithheld: 5.80, netPayout: 42.92, owedToCompany: 180, cashoutStatus: "pending" },
  { riderId: "R-005", riderName: "Fernanda López", shift: "Vespertino", totalDeliveries: 10, cashOrders: 2, cashAmount: 96, cardOrders: 5, cardAmount: 204, transferOrders: 3, transferAmount: 150, totalCollected: 450, walletBalance: 354, commissionRate: 0.20, commissionAmount: 90, bonuses: 30, grossEarnings: 120, ivaWithheld: 19.20, isrWithheld: 12.00, netPayout: 88.80, owedToCompany: 96, cashoutStatus: "settled" },
  { riderId: "R-006", riderName: "Jorge Castillo", shift: "Matutino", totalDeliveries: 9, cashOrders: 4, cashAmount: 198, cardOrders: 3, cardAmount: 135, transferOrders: 2, transferAmount: 90, totalCollected: 423, walletBalance: 225, commissionRate: 0.20, commissionAmount: 84.60, bonuses: 20, grossEarnings: 104.60, ivaWithheld: 16.74, isrWithheld: 10.46, netPayout: 77.40, owedToCompany: 198, cashoutStatus: "pending" },
  { riderId: "R-007", riderName: "Diana Vargas", shift: "Vespertino", totalDeliveries: 11, cashOrders: 3, cashAmount: 165, cardOrders: 5, cardAmount: 275, transferOrders: 3, transferAmount: 165, totalCollected: 605, walletBalance: 440, commissionRate: 0.22, commissionAmount: 133.10, bonuses: 40, grossEarnings: 173.10, ivaWithheld: 27.70, isrWithheld: 17.31, netPayout: 128.09, owedToCompany: 165, cashoutStatus: "pending" },
];

// Legacy exports for backward compatibility
export type RiderCashout = RiderFinance;
export const riderCashouts = riderFinances;

// --- Saldos de clientes B2B con suscripción y extras ---
export interface ClientBalance {
  clientId: string;
  clientName: string;
  period: string;
  totalOrders: number;
  deliveryTotal: number;
  subscriptionPlan: string;
  subscriptionFee: number;
  extraTools: { name: string; amount: number }[];
  extrasTotal: number;
  subtotal: number;
  iva: number;
  totalAmount: number;
  paid: number;
  balance: number;
  status: "paid" | "partial" | "pending";
  dueDate: string;
  paymentMethod: string;
  lastPaymentDate: string | null;
}

export const clientBalances: ClientBalance[] = [
  { clientId: "C-001", clientName: "Starbucks Xalapa", period: "Feb 2026", totalOrders: 320, deliveryTotal: 12160, subscriptionPlan: "Premium", subscriptionFee: 1500, extraTools: [{ name: "API Integración", amount: 500 }, { name: "Reportes Avanzados", amount: 300 }], extrasTotal: 800, subtotal: 14460, iva: 2313.60, totalAmount: 16773.60, paid: 16773.60, balance: 0, status: "paid", dueDate: "2026-03-05", paymentMethod: "Transferencia", lastPaymentDate: "2026-03-02" },
  { clientId: "C-002", clientName: "Farmacias Guadalajara", period: "Feb 2026", totalOrders: 580, deliveryTotal: 18560, subscriptionPlan: "Enterprise", subscriptionFee: 2500, extraTools: [{ name: "API Integración", amount: 500 }, { name: "Soporte Prioritario", amount: 800 }, { name: "Multi-sucursal", amount: 600 }], extrasTotal: 1900, subtotal: 22960, iva: 3673.60, totalAmount: 26633.60, paid: 13316.80, balance: 13316.80, status: "partial", dueDate: "2026-03-05", paymentMethod: "Factura 30 días", lastPaymentDate: "2026-02-20" },
  { clientId: "C-003", clientName: "La Parroquia de Veracruz", period: "Feb 2026", totalOrders: 150, deliveryTotal: 6000, subscriptionPlan: "Básico", subscriptionFee: 800, extraTools: [], extrasTotal: 0, subtotal: 6800, iva: 1088, totalAmount: 7888, paid: 0, balance: 7888, status: "pending", dueDate: "2026-03-05", paymentMethod: "Efectivo", lastPaymentDate: null },
  { clientId: "C-004", clientName: "Notaría Méndez & Asoc.", period: "Feb 2026", totalOrders: 85, deliveryTotal: 3825, subscriptionPlan: "Básico", subscriptionFee: 800, extraTools: [{ name: "Reportes Avanzados", amount: 300 }], extrasTotal: 300, subtotal: 4925, iva: 788, totalAmount: 5713, paid: 5713, balance: 0, status: "paid", dueDate: "2026-03-05", paymentMethod: "Transferencia", lastPaymentDate: "2026-03-01" },
  { clientId: "C-005", clientName: "PetLove Veterinaria", period: "Feb 2026", totalOrders: 42, deliveryTotal: 2100, subscriptionPlan: "Básico", subscriptionFee: 800, extraTools: [], extrasTotal: 0, subtotal: 2900, iva: 464, totalAmount: 3364, paid: 0, balance: 3364, status: "pending", dueDate: "2026-03-05", paymentMethod: "Transferencia", lastPaymentDate: null },
];

// ===== TARIFAS DINÁMICAS =====
export interface DynamicRate {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  active: boolean;
  icon: string;
}

export const dynamicRates: DynamicRate[] = [
  { id: "DR-001", name: "Lluvia", description: "Multiplicador por condiciones climáticas adversas", multiplier: 1.5, active: false, icon: "🌧️" },
  { id: "DR-002", name: "Alta Demanda", description: "Más de 20 pedidos pendientes simultáneos", multiplier: 1.3, active: true, icon: "🔥" },
  { id: "DR-003", name: "Zona Riesgo", description: "Entregas en colonias con alto índice delictivo", multiplier: 1.8, active: false, icon: "⚠️" },
  { id: "DR-004", name: "Horario Nocturno", description: "Entregas después de las 21:00 hrs", multiplier: 1.4, active: false, icon: "🌙" },
];

// ===== LOGS DE AUDITORÍA =====
export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  category: "order" | "client" | "rider" | "finance" | "system";
}

export const auditLogs: AuditLog[] = [
  { id: "LOG-001", timestamp: "2026-02-27 09:45:12", user: "Operador Central", action: "Asignó pedido", entity: "Pedido", entityId: "ORD-1041", details: "Asignado a Carlos Méndez (R-001)", category: "order" },
  { id: "LOG-002", timestamp: "2026-02-27 09:30:08", user: "Operador Central", action: "Resolvió alerta", entity: "Alerta", entityId: "ALT-004", details: "Alerta de dirección incorrecta marcada como resuelta", category: "order" },
  { id: "LOG-003", timestamp: "2026-02-27 09:15:44", user: "Admin", action: "Suspendió conductor", entity: "Repartidor", entityId: "R-005", details: "Fernanda López suspendida por revisión vehicular", category: "rider" },
  { id: "LOG-004", timestamp: "2026-02-27 08:50:22", user: "Admin", action: "Actualizó tarifa", entity: "Cliente", entityId: "C-003", details: "Tarifa de La Parroquia cambiada de $45 a $50", category: "client" },
  { id: "LOG-005", timestamp: "2026-02-27 08:30:10", user: "Sistema", action: "Alerta automática", entity: "Pedido", entityId: "ORD-1044", details: "Pedido estancado >10 min sin asignar", category: "system" },
  { id: "LOG-006", timestamp: "2026-02-26 18:20:33", user: "Operador Vespertino", action: "Liquidó caja", entity: "Finanzas", entityId: "R-003", details: "Ana Torres entregó $342 en efectivo", category: "finance" },
  { id: "LOG-007", timestamp: "2026-02-26 17:45:11", user: "Admin", action: "Registró cliente", entity: "Cliente", entityId: "C-005", details: "PetLove Veterinaria registrado con tarifa $60", category: "client" },
  { id: "LOG-008", timestamp: "2026-02-26 16:10:05", user: "Sistema", action: "Alerta automática", entity: "Repartidor", entityId: "R-002", details: "Repartidor detenido 14 min en ubicación no registrada", category: "system" },
  { id: "LOG-009", timestamp: "2026-02-26 14:30:00", user: "Operador Central", action: "Canceló pedido", entity: "Pedido", entityId: "ORD-1032", details: "Cancelado por solicitud del cliente La Parroquia", category: "order" },
  { id: "LOG-010", timestamp: "2026-02-26 12:00:18", user: "Admin", action: "Activó tarifa dinámica", entity: "Sistema", entityId: "DR-002", details: "Multiplicador Alta Demanda x1.3 activado", category: "system" },
];

// ===== HEATMAP DATA =====
export interface HeatmapZone {
  id: string;
  name: string;
  orders: number;
  intensity: "low" | "medium" | "high" | "critical";
  lat: number;
  lng: number;
}

export const heatmapZones: HeatmapZone[] = [
  { id: "HZ-001", name: "Zona Ánimas", orders: 28, intensity: "critical", lat: 19.53, lng: -96.91 },
  { id: "HZ-002", name: "Centro Histórico", orders: 22, intensity: "high", lat: 19.52, lng: -96.92 },
  { id: "HZ-003", name: "Col. Progreso", orders: 15, intensity: "medium", lat: 19.54, lng: -96.90 },
  { id: "HZ-004", name: "Fracc. Jardines", orders: 8, intensity: "low", lat: 19.55, lng: -96.93 },
  { id: "HZ-005", name: "Col. Revolución", orders: 18, intensity: "high", lat: 19.51, lng: -96.89 },
  { id: "HZ-006", name: "Monte Magno", orders: 5, intensity: "low", lat: 19.56, lng: -96.88 },
];
