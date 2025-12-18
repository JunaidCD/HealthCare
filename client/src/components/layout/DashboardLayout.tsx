import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Activity,
  Server,
  LogOut,
  Settings,
  FileText,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const getNavItems = (): SidebarItem[] => {
    switch (user.role) {
      case "patient":
        return [
          { icon: LayoutDashboard, label: "Overview", href: "/dashboard/patient" },
          { icon: Calendar, label: "Book Appointment", href: "/dashboard/patient/book" },
          { icon: FileText, label: "My History", href: "/dashboard/patient/history" },
          { icon: FileText, label: "Payments", href: "/dashboard/patient/payments" },
        ];
      case "doctor":
        return [
          { icon: LayoutDashboard, label: "Overview", href: "/dashboard/doctor" },
          { icon: Calendar, label: "Schedule", href: "/dashboard/doctor/schedule" },
          { icon: Users, label: "Patients", href: "/dashboard/doctor/patients" },
          { icon: FileText, label: "Prescriptions", href: "/dashboard/doctor/prescriptions" },
        ];
      case "admin":
        return [
          { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
          { icon: Users, label: "User Management", href: "/dashboard/admin/users" },
          { icon: Calendar, label: "Slot Management", href: "/dashboard/admin/slots" },
        ];
      case "manager":
        return [
          { icon: Activity, label: "Performance", href: "/dashboard/manager" },
          { icon: Users, label: "Feedback", href: "/dashboard/manager/feedback" },
          { icon: ShieldAlert, label: "Bug Reports", href: "/dashboard/manager/bugs" },
          { icon: Users, label: "Doctor Quality", href: "/dashboard/manager/quality" },
        ];
      case "it":
        return [
          { icon: Server, label: "System Logs", href: "/dashboard/it" },
          { icon: ShieldAlert, label: "Issues", href: "/dashboard/it/issues" },
          { icon: Activity, label: "Health", href: "/dashboard/it/health" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col fixed h-full z-10 transition-all duration-300">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            MediCare+
          </h1>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
            {user.role} Portal
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {getNavItems().map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 cursor-pointer group",
                  location === item.href
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-4 px-2">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/30"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen transition-all duration-300">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold capitalize">
             Dashboard
          </h2>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
