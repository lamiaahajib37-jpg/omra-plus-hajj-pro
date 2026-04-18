// ════════════════════════════════════════════════════════════════════════
// ERPSidebar.tsx — Version avec menu Manager séparé
// ════════════════════════════════════════════════════════════════════════
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, ClipboardList, FolderOpen,
  CalendarDays, Target, Bell, BarChart3, Settings, Clock,
  ChevronLeft, ChevronRight, LogOut, UserPlus, TrendingUp,
  Briefcase, Plane, RefreshCw, Kanban, UserCheck,CalendarOff
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logoAccess from "@/assets/Access_.png";
const SEP = (label: string) => ({ type: "separator" as const, label, path: undefined, icon: undefined });

// ── Admin: accès complet ──────────────────────────────────────────────
const adminMenu = [
  { label: "Tableau de bord",         icon: LayoutDashboard, path: "/" },

  SEP("CRM"),
  { label: "Pipeline Leads",          icon: Kanban,          path: "/leads" },
  { label: "Clients",                 icon: Briefcase,       path: "/clients" },
  { label: "Dossiers",                icon: FolderOpen,      path: "/dossiers" },
  { label: "Voyages & Programmes",    icon: Plane,           path: "/voyages" },
  { label: "Vue Pipeline",            icon: TrendingUp,      path: "/pipeline" },

  SEP("Gestion interne"),
  { label: "Ressources Humaines",     icon: Users,           path: "/rh" },
  { label: "Départements",            icon: Building2,       path: "/departements" },
  { label: "Pointage",                icon: Clock,           path: "/pointage" },
  { label: "Gestion des Tâches",      icon: ClipboardList,   path: "/taches" },
  { label: "Réunions",                icon: CalendarDays,    path: "/reunions" },
  { label: "Objectifs & KPIs",        icon: Target,          path: "/objectifs" },
  { label: "Congés", icon: CalendarOff, path: "/conges" },

  SEP("Pilotage"),
  { label: "Finance",                 icon: TrendingUp,      path: "/finance" },
  { label: "Rapports",                icon: BarChart3,       path: "/rapports" },
  { label: "Notifications",           icon: Bell,            path: "/notifications" },
  { label: "Rappels Auto",            icon: RefreshCw,       path: "/parametres/rappels" },
  { label: "Paramètres",              icon: Settings,        path: "/parametres" },
];

// ── Manager: assignment + dossiers dept + clients ────────────────────
const managerMenu = [
  { label: "Mon Tableau de bord",     icon: LayoutDashboard, path: "/" },

  SEP("Dossiers"),
  { label: "Dossiers à assigner",     icon: UserCheck,       path: "/" },     // dashboard = assignment
  { label: "Tous les dossiers",       icon: FolderOpen,      path: "/dossiers" },
  { label: "Clients",                 icon: Briefcase,       path: "/clients" },
  { label: "Voyages & Programmes",    icon: Plane,           path: "/voyages" },

  SEP("Équipe"),
  { label: "Mes Tâches",              icon: ClipboardList,   path: "/taches" },
  { label: "Réunions",                icon: CalendarDays,    path: "/reunions" },
  { label: "Congés", icon: CalendarOff, path: "/conges" },
   { label: "Objectifs",        icon: Target,          path: "/objectifs" },
  { label: "Pointage",                icon: Clock,           path: "/pointage" },
  { label: "Notifications",           icon: Bell,            path: "/notifications" },
];

// ── Employé: espace perso ────────────────────────────────────────────
const employeeMenu = [
  { label: "Mon Espace",              icon: LayoutDashboard, path: "/" },
  { label: "Mes Dossiers",            icon: FolderOpen,      path: "/dossiers" },
  { label: "Mes Tâches",              icon: ClipboardList,   path: "/taches" },
  { label: "Mon Pointage",            icon: Clock,           path: "/pointage" },
  { label: "Mes Réunions",            icon: CalendarDays,    path: "/reunions" },
  { label: "Congés", icon: CalendarOff, path: "/conges" },
   { label: "Objectifs",        icon: Target,          path: "/objectifs" },
  { label: "Notifications",           icon: Bell,            path: "/notifications" },
];

interface Props { open: boolean; onToggle: () => void; isMobile?: boolean; }
export function ERPSidebar({ open, onToggle, isMobile = false }: Props) {
    const location = useLocation();
  const { user, isAdmin, isManager, logout } = useAuth();

  const menuItems = isAdmin
    ? adminMenu
    : isManager
    ? managerMenu
    : employeeMenu;

  // Badge rôle dans le user chip
  const roleBadge = isAdmin ? "Admin" : isManager ? `Mgr ${user?.departement || ""}` : "Employé";
  const roleBadgeBg = isAdmin ? "bg-primary/20 text-primary" : isManager ? "bg-amber-100 text-amber-700" : "bg-secondary text-muted-foreground";

  return (
    <aside className={[
  "bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300",
  isMobile
    ? `fixed left-0 top-0 h-full z-30 w-64 ${open ? "translate-x-0" : "-translate-x-full"}`
    : `${open ? "w-64" : "w-16"} shrink-0`
].join(" ")}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-3 border-b border-sidebar-border">
        {open && (
          <div className="flex items-center px-2">
<img src={logoAccess} alt="Access Morocco" className="h-8 w-auto" />
          </div>
        )}
        <button onClick={onToggle} className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors ml-auto">
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Role indicator (open only) */}
      {open && isManager && (
        <div className="mx-3 mt-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-xs font-medium text-amber-700">
            Manager — Département {user?.departement}
          </p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {menuItems.map((item, idx) => {
          if (item.type === "separator") {
            return open ? (
              <div key={`sep-${idx}`} className="pt-4 pb-1 px-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">{item.label}</p>
              </div>
            ) : <div key={`sep-${idx}`} className="border-t border-sidebar-border my-2" />;
          }

          const active = location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path!));

          return (
            <Link
              key={`${item.path}-${idx}`}
              to={item.path!}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-sidebar-accent text-sidebar-foreground"
              }`}
              title={!open ? item.label : undefined}
            >
              {item.icon && <item.icon size={20} className={active ? "text-primary-foreground" : "text-primary"} />}
              {open && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User chip */}
      <div className="p-3 border-t border-sidebar-border">
        {open ? (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
              {user?.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium truncate text-sidebar-accent-foreground">{user?.name}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${roleBadgeBg}`}>{roleBadge}</span>
              </div>
              <p className="text-xs text-sidebar-foreground truncate">{user?.email}</p>
            </div>
            <button onClick={logout} className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors shrink-0" title="Déconnexion">
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