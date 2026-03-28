import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ERPLayout } from "@/components/ERPLayout";
import { ClientLayout } from "@/components/ClientLayout";
import Dashboard from "./pages/Dashboard";
import RH from "./pages/RH";
import Departements from "./pages/Departements";
import Taches from "./pages/Taches";
import Clients from "./pages/Clients";
import Voyages from "./pages/Voyages";
import Reunions from "./pages/Reunions";
import Objectifs from "./pages/Objectifs";
import Finance from "./pages/Finance";
import Rapports from "./pages/Rapports";
import Notifications from "./pages/Notifications";
import Parametres from "./pages/Parametres";
import NotFound from "./pages/NotFound";
import ClientLogin from "./pages/ClientLogin";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientDossiers from "./pages/client/ClientDossiers";
import ClientCosting from "./pages/client/ClientCosting";
import ClientDocuments from "./pages/client/ClientDocuments";
import ClientDevis from "./pages/client/ClientDevis";
import ClientTaches from "./pages/client/ClientTaches";
import ClientObjectifs from "./pages/client/ClientObjectifs";
import ClientReunions from "./pages/client/ClientReunions";
import ClientPointage from "./pages/client/ClientPointage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin ERP */}
          <Route element={<ERPLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rh" element={<RH />} />
            <Route path="/departements" element={<Departements />} />
            <Route path="/taches" element={<Taches />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/voyages" element={<Voyages />} />
            <Route path="/reunions" element={<Reunions />} />
            <Route path="/objectifs" element={<Objectifs />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/rapports" element={<Rapports />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/parametres" element={<Parametres />} />
          </Route>
          {/* Client Portal */}
          <Route path="/client/login" element={<ClientLogin />} />
          <Route element={<ClientLayout />}>
            <Route path="/client" element={<ClientDashboard />} />
            <Route path="/client/dossiers" element={<ClientDossiers />} />
            <Route path="/client/costing" element={<ClientCosting />} />
            <Route path="/client/documents" element={<ClientDocuments />} />
            <Route path="/client/devis" element={<ClientDevis />} />
            <Route path="/client/taches" element={<ClientTaches />} />
            <Route path="/client/objectifs" element={<ClientObjectifs />} />
            <Route path="/client/reunions" element={<ClientReunions />} />
            <Route path="/client/pointage" element={<ClientPointage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
