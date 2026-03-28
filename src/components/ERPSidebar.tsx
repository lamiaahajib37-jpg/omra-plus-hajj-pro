import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, ClipboardList, UserCircle,
  Plane, CalendarDays, Target, Bell, DollarSign, BarChart3, Settings,
  ChevronLeft, ChevronRight
} from "lucide-react";
import logo from "@/assets/logo.png";

const menuItems = [
  { label: "Tableau de bord", icon: LayoutDashboard, path: "/" },
  { label: "Ressources Humaines", icon: Users, path: "/rh" },
  { label: "Départements", icon: Building2, path: "/departements" },
  { label: "Gestion des Tâches", icon: ClipboardList, path: "/taches" },
  { label: "Clients & Dossiers", icon: UserCircle, path: "/clients" },
  { label: "Opérations Voyages", icon: Plane, path: "/voyages" },
  { label: "Réunions", icon: CalendarDays, path: "/reunions" },
  { label: "Objectifs & Performance", icon: Target, path: "/objectifs" },
  { label: "Finance & Facturation", icon: DollarSign, path: "/finance" },
  { label: "Rapports & Statistiques", icon: BarChart3, path: "/rapports" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Paramètres", icon: Settings, path: "/parametres" },
];

interface Props {
  open: boolean;
  onToggle: () => void;
}

export function ERPSidebar({ open, onToggle }: Props) {
  const location = useLocation();

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
      {open && (
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-sidebar-accent-foreground">Admin Manager</p>
              <p className="text-xs text-sidebar-foreground truncate">admin@accessmorocco.ma</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
