import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[hsl(220,30%,96%)] via-[hsl(240,25%,94%)] to-[hsl(200,30%,93%)] dark:from-[hsl(230,28%,8%)] dark:via-[hsl(250,25%,10%)] dark:to-[hsl(220,28%,8%)]">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-auto p-5">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
