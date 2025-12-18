import { Switch, Route, useLocation } from "wouter";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LandingPage } from "@/pages/Landing";
import { LoginPage } from "@/pages/auth/Login";
import { PatientDashboard } from "@/pages/dashboard/Patient";
import { DoctorDashboard } from "@/pages/dashboard/Doctor";
import { AdminDashboard } from "@/pages/dashboard/Admin";
import { ManagerDashboard } from "@/pages/dashboard/Manager";
import { ITDashboard } from "@/pages/dashboard/IT";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";

function ProtectedRoute({
  component: Component,
  allowedRole,
}: {
  component: React.ComponentType;
  allowedRole: string;
}) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  // Redirect happens outside of render
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== allowedRole) {
    if (!user) {
      setTimeout(() => setLocation(`/login/${allowedRole}`), 0);
    }
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground gap-4">
        <h1 className="text-4xl font-bold">403 Forbidden</h1>
        <p className="text-muted-foreground">You do not have permission to access this page.</p>
        <button
          onClick={() => setLocation("/")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />

      {/* Login Routes */}
      <Route path="/login/patient">
        <LoginPage role="patient" />
      </Route>
      <Route path="/login/doctor">
        <LoginPage role="doctor" />
      </Route>
      <Route path="/login/admin">
        <LoginPage role="admin" />
      </Route>
      <Route path="/login/manager">
        <LoginPage role="manager" />
      </Route>
      <Route path="/login/it">
        <LoginPage role="it" />
      </Route>

      {/* Dashboard Routes */}
      <Route path="/dashboard/patient*">
        <ProtectedRoute component={PatientDashboard} allowedRole="patient" />
      </Route>
      <Route path="/dashboard/doctor*">
        <ProtectedRoute component={DoctorDashboard} allowedRole="doctor" />
      </Route>
      <Route path="/dashboard/admin*">
        <ProtectedRoute component={AdminDashboard} allowedRole="admin" />
      </Route>
      <Route path="/dashboard/manager*">
        <ProtectedRoute component={ManagerDashboard} allowedRole="manager" />
      </Route>
      <Route path="/dashboard/it*">
        <ProtectedRoute component={ITDashboard} allowedRole="it" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router />
      </DataProvider>
    </AuthProvider>
  );
}
