import {
  Radio,
  AlertTriangle,
  Bike,
  Building2,
  Package,
  DollarSign,
  Settings,
  FileText,
  BarChart3,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import fluoLogo from "@/assets/logo-fluo.png";

const mainNav = [
  { title: "Dispatch", url: "/", icon: Radio, label: "Torre de Control" },
  { title: "Alertas SOS", url: "/alerts", icon: AlertTriangle, label: "Centro de Alertas" },
  { title: "Flota", url: "/fleet", icon: Bike, label: "Gestión de Flota" },
  { title: "Clientes B2B", url: "/clients", icon: Building2, label: "Clientes Corporativos" },
  { title: "Pedidos", url: "/orders", icon: Package, label: "Historial" },
  { title: "Finanzas", url: "/finance", icon: DollarSign, label: "Liquidaciones" },
];

const toolsNav = [
  { title: "Métricas", url: "/metrics", icon: BarChart3, label: "Métricas de Flota" },
  { title: "Auditoría", url: "/audit", icon: FileText, label: "Logs de Auditoría" },
  { title: "Tarifas", url: "/settings", icon: Settings, label: "Configuración de Tarifas" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const renderNavItems = (items: typeof mainNav) =>
    items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild tooltip={item.label}>
          <NavLink
            to={item.url}
            end={item.url === "/"}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeClassName="bg-sidebar-accent text-primary font-semibold"
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span className="text-sm truncate">{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
        <img src={fluoLogo} alt="Fluo" className="h-8 w-8 rounded-lg object-contain shrink-0" />
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sidebar-accent-foreground font-bold text-base leading-tight truncate">Fluo Central</h1>
            <p className="text-[10px] text-sidebar-foreground leading-tight">Logística B2B</p>
          </div>
        )}
      </div>

      <SidebarContent className="mt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderNavItems(mainNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-wider px-3">Herramientas</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{renderNavItems(toolsNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && (
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-xs font-medium text-sidebar-accent-foreground">OP</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">Operador Central</p>
              <p className="text-[10px] text-sidebar-foreground truncate">Turno Matutino</p>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
