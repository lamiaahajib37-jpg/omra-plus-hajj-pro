import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ERPLayout } from "@/components/ERPLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import RH from "./pages/RH";
import Departements from "@/pages/departements/Departements";
import Taches from "./pages/Taches";
import Pointage from "./pages/Pointage";
import Clients from "./pages/Clients";
import Dossiers from "./pages/Dossiers";
import DossierDetail from "./pages/DossierDetail";
import Voyages from "./pages/Voyages";
import Reunions from "./pages/Reunions";
import Objectifs from "./pages/Objectifs";
import Finance from "./pages/Finance";
import Rapports from "./pages/Rapports";
import Notifications from "./pages/Notifications";
import Parametres from "./pages/Parametres";
import NotFound from "./pages/NotFound";
import CRMDashboard from "./pages/crm/CRMDashboard";
import CRMLeads from "./pages/crm/Leads";
import CRMPipeline from "./pages/crm/Pipeline";
import CRMServices from "./pages/crm/Services";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, isAdmin, isEmployee } = useAuth();

  if (!user) return <Login />;

  return (
    <Routes>
      <Route element={<ERPLayout />}>
        <Route path="/" element={isAdmin ? <Dashboard /> : <EmployeeDashboard />} />

<<<<<<< HEAD
        {/* Shared pages — accessible by admin AND employee */}
=======
>>>>>>> 147e2a2ba561b9cd0e95962090147e0cdada6777
        <Route path="/dossiers" element={<Dossiers />} />
        <Route path="/dossiers/:id" element={<DossierDetail />} />
        <Route path="/taches" element={<Taches />} />
        <Route path="/pointage" element={<Pointage />} />
        <Route path="/reunions" element={<Reunions />} />
        <Route path="/notifications" element={<Notifications />} />

        {isAdmin && (
          <>
            <Route path="/rh" element={<RH />} />
            <Route path="/departements" element={<Departements />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/voyages" element={<Voyages />} />
            <Route path="/objectifs" element={<Objectifs />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/rapports" element={<Rapports />} />
            <Route path="/parametres" element={<Parametres />} />
            <Route path="/crm" element={<CRMDashboard />} />
            <Route path="/crm/leads" element={<CRMLeads />} />
            <Route path="/crm/pipeline" element={<CRMPipeline />} />
            <Route path="/crm/services" element={<CRMServices />} />
          </>
        )}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;