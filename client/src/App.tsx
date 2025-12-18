import { Switch, Route, useLocation } from "wouter";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LandingPage } from "@/pages/Landing";
import { LoginPage } from "@/pages/auth/Login";
import { PatientOverview, PatientBook, PatientHistory, PatientPayments } from "@/pages/dashboard/Patient";
import { DoctorOverview, DoctorSchedule, DoctorPatients, DoctorPrescriptions } from "@/pages/dashboard/Doctor";
import { AdminOverview, AdminUsers, AdminSlots } from "@/pages/dashboard/Admin";
import { ManagerOverview, ManagerFeedback, ManagerBugs, ManagerQuality } from "@/pages/dashboard/Manager";
import { ITOverview, ITIssues, ITHealth } from "@/pages/dashboard/IT";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

function ProtectedRoute({
  component: Component,
  allowedRole,
}: {
  component: React.ComponentType;
  allowedRole: string;
}) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = require("wouter").useLocation();

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

import { useLocation } from "wouter";

function RealtimeUpdatesManager() {
  useRealtimeUpdates();
  return null;
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

      {/* Patient Routes */}
      <Route path="/dashboard/patient">
        <ProtectedRoute component={PatientOverview} allowedRole="patient" />
      </Route>
      <Route path="/dashboard/patient/book">
        <ProtectedRoute component={PatientBook} allowedRole="patient" />
      </Route>
      <Route path="/dashboard/patient/history">
        <ProtectedRoute component={PatientHistory} allowedRole="patient" />
      </Route>
      <Route path="/dashboard/patient/payments">
        <ProtectedRoute component={PatientPayments} allowedRole="patient" />
      </Route>

      {/* Doctor Routes */}
      <Route path="/dashboard/doctor">
        <ProtectedRoute component={DoctorOverview} allowedRole="doctor" />
      </Route>
      <Route path="/dashboard/doctor/schedule">
        <ProtectedRoute component={DoctorSchedule} allowedRole="doctor" />
      </Route>
      <Route path="/dashboard/doctor/patients">
        <ProtectedRoute component={DoctorPatients} allowedRole="doctor" />
      </Route>
      <Route path="/dashboard/doctor/prescriptions">
        <ProtectedRoute component={DoctorPrescriptions} allowedRole="doctor" />
      </Route>

      {/* Admin Routes */}
      <Route path="/dashboard/admin">
        <ProtectedRoute component={AdminOverview} allowedRole="admin" />
      </Route>
      <Route path="/dashboard/admin/users">
        <ProtectedRoute component={AdminUsers} allowedRole="admin" />
      </Route>
      <Route path="/dashboard/admin/slots">
        <ProtectedRoute component={AdminSlots} allowedRole="admin" />
      </Route>

      {/* Manager Routes */}
      <Route path="/dashboard/manager">
        <ProtectedRoute component={ManagerOverview} allowedRole="manager" />
      </Route>
      <Route path="/dashboard/manager/feedback">
        <ProtectedRoute component={ManagerFeedback} allowedRole="manager" />
      </Route>
      <Route path="/dashboard/manager/bugs">
        <ProtectedRoute component={ManagerBugs} allowedRole="manager" />
      </Route>
      <Route path="/dashboard/manager/quality">
        <ProtectedRoute component={ManagerQuality} allowedRole="manager" />
      </Route>

      {/* IT Routes */}
      <Route path="/dashboard/it">
        <ProtectedRoute component={ITOverview} allowedRole="it" />
      </Route>
      <Route path="/dashboard/it/issues">
        <ProtectedRoute component={ITIssues} allowedRole="it" />
      </Route>
      <Route path="/dashboard/it/health">
        <ProtectedRoute component={ITHealth} allowedRole="it" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <RealtimeUpdatesManager />
        <Router />
      </DataProvider>
    </AuthProvider>
  );
}
