import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ERPLayout } from "@/components/ERPLayout";
import Dashboard from "./pages/Dashboard";
import RH from "./pages/RH";
import Departements from "./pages/Departements";
import Taches from "./pages/Taches";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
