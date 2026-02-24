// ===== PEDIDOS SIN ASIGNAR =====
export interface PendingOrder {
  id: string;
  origin: string;
  destination: string;
  packageType: string;
  timeAgo: string;
  clientName: string;
  priority: "normal" | "urgent";
}

export const pendingOrders: PendingOrder[] = [
  { id: "ORD-1041", origin: "Starbucks Ánimas", destination: "Col. Progreso #42", packageType: "📄 Sobre", timeAgo: "2 min", clientName: "Starbucks", priority: "urgent" },
  { id: "ORD-1042", origin: "Farmacia Guadalajara Centro", destination: "Fracc. Jardines #18", packageType: "📦 Caja pequeña", timeAgo: "5 min", clientName: "Farmacias GDL", priority: "normal" },
  { id: "ORD-1043", origin: "Pastelería La Parroquia", destination: "Col. Revolución #7", packageType: "🎂 Frágil", timeAgo: "8 min", clientName: "La Parroquia", priority: "normal" },
  { id: "ORD-1044", origin: "Notaría Pública #5", destination: "Palacio Municipal", packageType: "📄 Documentos", timeAgo: "12 min", clientName: "Notaría Méndez", priority: "urgent" },
  { id: "ORD-1045", origin: "Veterinaria PetLove", destination: "Col. Tamborrel #33", packageType: "💊 Medicamento", timeAgo: "15 min", clientName: "PetLove", priority: "normal" },
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
}

export const riders: Rider[] = [
  { id: "R-001", name: "Carlos Méndez", phone: "228-112-3344", status: "available", rating: 4.8, avatar: "CM", vehicleId: "V-001" },
  { id: "R-002", name: "Luis Hernández", phone: "228-223-4455", status: "on_route", rating: 4.5, avatar: "LH", currentOrder: "ORD-1038", vehicleId: "V-002" },
  { id: "R-003", name: "Ana Torres", phone: "228-334-5566", status: "available", rating: 4.9, avatar: "AT", vehicleId: "V-003" },
  { id: "R-004", name: "Miguel Ruiz", phone: "228-445-6677", status: "on_route", rating: 4.2, avatar: "MR", currentOrder: "ORD-1039", vehicleId: "V-004" },
  { id: "R-005", name: "Fernanda López", phone: "228-556-7788", status: "paused", rating: 4.7, avatar: "FL", vehicleId: "V-005" },
  { id: "R-006", name: "Jorge Castillo", phone: "228-667-8899", status: "available", rating: 4.6, avatar: "JC", vehicleId: "V-006" },
  { id: "R-007", name: "Diana Vargas", phone: "228-778-9900", status: "on_route", rating: 4.4, avatar: "DV", currentOrder: "ORD-1040", vehicleId: "V-007" },
];

// ===== ALERTAS =====
export interface Alert {
  id: string;
  type: "sos" | "exception" | "delay";
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
export interface RiderCashout {
  riderId: string;
  riderName: string;
  totalCollected: number;
  totalDeliveries: number;
  cashOrders: number;
  cashAmount: number;
  owedToCompany: number;
  status: "pending" | "settled";
  shift: string;
}

export const riderCashouts: RiderCashout[] = [
  { riderId: "R-001", riderName: "Carlos Méndez", totalCollected: 540, totalDeliveries: 12, cashOrders: 5, cashAmount: 225, owedToCompany: 225, status: "pending", shift: "Matutino" },
  { riderId: "R-002", riderName: "Luis Hernández", totalCollected: 380, totalDeliveries: 8, cashOrders: 3, cashAmount: 114, owedToCompany: 114, status: "pending", shift: "Matutino" },
  { riderId: "R-003", riderName: "Ana Torres", totalCollected: 720, totalDeliveries: 15, cashOrders: 7, cashAmount: 342, owedToCompany: 342, status: "settled", shift: "Matutino" },
  { riderId: "R-004", riderName: "Miguel Ruiz", totalCollected: 290, totalDeliveries: 6, cashOrders: 4, cashAmount: 180, owedToCompany: 180, status: "pending", shift: "Vespertino" },
  { riderId: "R-005", riderName: "Fernanda López", totalCollected: 450, totalDeliveries: 10, cashOrders: 2, cashAmount: 96, owedToCompany: 96, status: "settled", shift: "Vespertino" },
];

export interface ClientBalance {
  clientId: string;
  clientName: string;
  period: string;
  totalOrders: number;
  totalAmount: number;
  paid: number;
  balance: number;
  status: "paid" | "partial" | "pending";
  dueDate: string;
}

export const clientBalances: ClientBalance[] = [
  { clientId: "C-001", clientName: "Starbucks Xalapa", period: "Feb 2026", totalOrders: 320, totalAmount: 14400, paid: 14400, balance: 0, status: "paid", dueDate: "2026-03-05" },
  { clientId: "C-002", clientName: "Farmacias Guadalajara", period: "Feb 2026", totalOrders: 580, totalAmount: 22040, paid: 11020, balance: 11020, status: "partial", dueDate: "2026-03-05" },
  { clientId: "C-003", clientName: "La Parroquia de Veracruz", period: "Feb 2026", totalOrders: 150, totalAmount: 7500, paid: 0, balance: 7500, status: "pending", dueDate: "2026-03-05" },
  { clientId: "C-004", clientName: "Notaría Méndez & Asoc.", period: "Feb 2026", totalOrders: 85, totalAmount: 4675, paid: 4675, balance: 0, status: "paid", dueDate: "2026-03-05" },
  { clientId: "C-005", clientName: "PetLove Veterinaria", period: "Feb 2026", totalOrders: 42, totalAmount: 2520, paid: 0, balance: 2520, status: "pending", dueDate: "2026-03-05" },
];
