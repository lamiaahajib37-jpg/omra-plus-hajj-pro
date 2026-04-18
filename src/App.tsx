// ════════════════════════════════════════════════════════════════════════
// App.tsx — Version finale: Admin + Manager + Employé + Client portal
// /client/* = espace client complètement isolé de l'ERP
// ════════════════════════════════════════════════════════════════════════
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ERPLayout } from "@/components/ERPLayout";

// ── Pages ERP ─────────────────────────────────────────────────────────
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import RH from "./pages/RH";
import Departements from "@/pages/departements/Departements";
import Taches from "./pages/Taches";
import Pointage from "./pages/Pointage";
import Dossiers from "./pages/crm/Dossiers";
import Voyages from "./pages/Voyages";
import Reunions from "./pages/Reunions";
import Objectifs from "./pages/Objectifs";
import Finance from "./pages/Finance";
import Rapports from "./pages/Rapports";
import Notifications from "./pages/Notifications";
import Parametres from "./pages/Parametres";
import Leads from "./pages/crm/Leads";
import LeadDetail from "./pages/crm/LeadDetail";
import Clients from "./pages/crm/Clients";
import ClientDetail from "./pages/crm/ClientDetail";
import DossierDetail from "./pages/crm/DossierDetail";
import DossierPresentation from "./pages/crm/DossierPresentation";
import DossierCosting from "./pages/crm/DossierCosting";
import DossierPaiements from "./pages/crm/DossierPaiements";
import Pipeline from "./pages/crm/Pipeline";
import Rappels from "./pages/crm/Rappels";

// ── Pages Client Portal (isolées) ─────────────────────────────────────
import ClientLogin from "./pages/client/ClientLogin";
import ClientPortal from "./pages/client/ClientPortal";
import CongesModule from "./pages/CongesModule";
// ─────────────────────────────────────────────────────────────────────

const queryClient = new QueryClient();

// ─── Guard: routes ERP (redirige clients vers leur portal) ────────────
function ERPRoutes() {
  const { user, isAdmin, isManager, isEmployee, isClient } = useAuth();

  // Client qui arrive sur /: renvoyer vers son portal
  if (isClient) return <Navigate to="/client/portal" replace />;

  // Non connecté: login ERP
  if (!user) return <Login />;

  return (
    <Routes>
      <Route element={<ERPLayout />}>

        {/* Dashboard selon rôle */}
        <Route path="/" element={
          isAdmin ? <Dashboard />
          : isManager ? <ManagerDashboard />
          : <EmployeeDashboard />
        } />

        {/* Communes */}
        <Route path="/taches" element={<Taches />} />
        <Route path="/pointage" element={<Pointage />} />
        <Route path="/reunions" element={<Reunions />} />
        <Route path="/notifications" element={<Notifications />} />
         <Route path="/conges" element={<CongesModule />} />
                     <Route path="/objectifs" element={<Objectifs />} />


        {/* Dossiers: tous rôles (filtrage interne par role) */}
        <Route path="/dossiers" element={<Dossiers />} />
        <Route path="/dossiers/:id" element={<DossierDetail />} />
        <Route path="/dossiers/:id/presentation" element={<DossierPresentation />} />
        <Route path="/dossiers/:id/costing" element={<DossierCosting />} />
        <Route path="/dossiers/:id/paiements" element={<DossierPaiements />} />

        {/* Admin + Manager */}
        {(isAdmin || isManager) && (
          <>
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/voyages" element={<Voyages />} />
          </>
        )}

        {/* Admin seulement */}
        {isAdmin && (
          <>
            <Route path="/rh" element={<RH />} />
            <Route path="/departements" element={<Departements />} />
           
            <Route path="/finance" element={<Finance />} />
            <Route path="/rapports" element={<Rapports />} />
            <Route path="/parametres" element={<Parametres />} />
            <Route path="/parametres/rappels" element={<Rappels />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/:id" element={<LeadDetail />} />
            <Route path="/pipeline" element={<Pipeline />} />
          </>
        )}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

// ─── Guard: routes Client Portal (isole complètement du ERP) ─────────
function ClientRoutes() {
  const { user, isClient } = useAuth();

  return (
    <Routes>
      {/* /client → login */}
      <Route path="/" element={
        isClient
          ? <Navigate to="/client/portal" replace />
          : <ClientLogin />
      } />

      {/* /client/portal → portal (protégé) */}
      <Route path="/portal" element={
        isClient
          ? <ClientPortal />
          : <Navigate to="/client" replace />
      } />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/client" replace />} />
    </Routes>
  );
}

// ─── Root Router ──────────────────────────────────────────────────────
function AppRouter() {
  return (
    <Routes>
      {/* /client/* → espace client isolé */}
      <Route path="/client/*" element={<ClientRoutes />} />

      {/* /* → ERP (admin/manager/employé) */}
      <Route path="/*" element={<ERPRoutes />} />
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
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;