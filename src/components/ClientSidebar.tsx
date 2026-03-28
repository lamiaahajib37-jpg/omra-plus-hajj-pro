import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, FolderOpen, Calculator, FileUp, FileText,
  ClipboardList, Target, CalendarDays, Clock,
  ChevronLeft, ChevronRight, LogOut
} from "lucide-react";
import logo from "@/assets/logo.png";

const menuItems = [
  { label: "Mon Espace", icon: LayoutDashboard, path: "/client" },
  { label: "Mes Dossiers", icon: FolderOpen, path: "/client/dossiers" },
  { label: "Costing & Devis", icon: Calculator, path: "/client/costing" },
  { label: "Mes Documents", icon: FileUp, path: "/client/documents" },
  { label: "Demande de Devis", icon: FileText, path: "/client/devis" },
  { label: "Mes Tâches", icon: ClipboardList, path: "/client/taches" },
  { label: "Objectifs", icon: Target, path: "/client/objectifs" },
  { label: "Réunions", icon: CalendarDays, path: "/client/reunions" },
  { label: "Mon Pointage", icon: Clock, path: "/client/pointage" },
];

interface Props {
  open: boolean;
  onToggle: () => void;
}

export function ClientSidebar({ open, onToggle }: Props) {
  const location = useLocation();

  return (
    <aside
      className={`bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ${
        open ? "w-64" : "w-16"
      } shrink-0`}
    >
      <div className="h-16 flex items-center justify-between px-3 border-b border-sidebar-border">
        {open && (
          <img src={logo} alt="Access Morocco" className="h-8 brightness-0 invert" />
        )}
        <button onClick={onToggle} className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors">
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

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

      {open && (
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              MA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-sidebar-accent-foreground">Mohammed Alaoui</p>
              <p className="text-xs text-sidebar-foreground truncate">m.alaoui@gmail.com</p>
            </div>
          </div>
          <Link
            to="/client/login"
            className="flex items-center gap-2 mt-2 px-2 py-1.5 text-xs text-sidebar-foreground hover:text-primary transition-colors"
          >
            <LogOut size={14} /> Déconnexion
          </Link>
        </div>
      )}
    </aside>
  );
}
