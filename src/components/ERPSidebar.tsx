import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, ClipboardList, UserCircle, FolderOpen,
  Plane, CalendarDays, Target, Bell, DollarSign, BarChart3, Settings,
  ChevronLeft, ChevronRight, LogOut, Briefcase, UserPlus, Package, PieChart
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const adminMenu = [
  { label: "Tableau de bord", icon: LayoutDashboard, path: "/" },
  { label: "Ressources Humaines", icon: Users, path: "/rh" },
  { label: "Départements", icon: Building2, path: "/departements" },
  { label: "Gestion des Tâches", icon: ClipboardList, path: "/taches" },
  { label: "Clients & Dossiers", icon: UserCircle, path: "/clients" },
  { label: "Gestion Dossiers", icon: FolderOpen, path: "/dossiers" },
  { label: "Opérations Voyages", icon: Plane, path: "/voyages" },
  { label: "Réunions", icon: CalendarDays, path: "/reunions" },
  { label: "Objectifs & Performance", icon: Target, path: "/objectifs" },
  { label: "Finance & Facturation", icon: DollarSign, path: "/finance" },
  { label: "Rapports & Statistiques", icon: BarChart3, path: "/rapports" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Paramètres", icon: Settings, path: "/parametres" },
  { type: "separator", label: "CRM" },
  { label: "CRM Dashboard", icon: PieChart, path: "/crm" },
  { label: "Leads", icon: UserPlus, path: "/crm/leads" },
  { label: "Pipeline", icon: Briefcase, path: "/crm/pipeline" },
  { label: "Services & Prix", icon: Package, path: "/crm/services" },
];

const employeeMenu = [
  { label: "Mon Espace", icon: LayoutDashboard, path: "/" },
  { label: "Mes Dossiers", icon: FolderOpen, path: "/dossiers" },
  { label: "Mes Tâches", icon: ClipboardList, path: "/taches" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
];

interface Props {
  open: boolean;
  onToggle: () => void;
}

export function ERPSidebar({ open, onToggle }: Props) {
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const menuItems = isAdmin ? adminMenu : employeeMenu;

  return (
    <aside
      className={`bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ${
        open ? "w-64" : "w-16"
      } shrink-0`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-3 border-b border-sidebar-border">
        {open && (
          <img src={logo} alt="Access Morocco" className="h-8 brightness-0 invert" />
        )}
        <button onClick={onToggle} className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors">
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-sidebar-accent text-sidebar-foreground"
              }`}
              title={!open ? item.label : undefined}
            >
              <item.icon size={20} className={active ? "text-primary-foreground" : "text-primary"} />
              {open && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User chip */}
      <div className="p-3 border-t border-sidebar-border">
        {open ? (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              {user?.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-sidebar-accent-foreground">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground truncate">{user?.email}</p>
            </div>
            <button onClick={logout} className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors" title="Déconnexion">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button onClick={logout} className="w-full flex justify-center p-1.5 rounded-md hover:bg-sidebar-accent transition-colors" title="Déconnexion">
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
