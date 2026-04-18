import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, Search, Menu, X, Moon, Sun,
  ChevronDown, Calendar, FileText, Users
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Notif {
  id: number;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: "info" | "warn" | "success";
}

const MOCK_NOTIFS: Notif[] = [
  { id: 1, title: "Nouveau dossier assigné", desc: "Dossier #D-2024 — Benali Karim", time: "Il y a 5 min", read: false, type: "info" },
  { id: 2, title: "Réunion dans 30 min", desc: "Standup équipe CRM", time: "Il y a 12 min", read: false, type: "warn" },
  { id: 3, title: "Lead converti", desc: "Sentissi Rim → Client", time: "Il y a 1h", read: false, type: "success" },
  { id: 4, title: "Congé approuvé", desc: "Votre demande du 20/04 validée", time: "Il y a 2h", read: true, type: "success" },
];

const QUICK_ACTIONS = [
  { icon: FileText, label: "Nouveau dossier", path: "/dossiers" },
  { icon: Users,    label: "Ajouter lead",    path: "/leads"    },
  { icon: Calendar, label: "Réunion",          path: "/reunions" },
];

const NOTIF_DOT: Record<Notif["type"], string> = {
  info:    "bg-blue-400",
  warn:    "bg-amber-400",
  success: "bg-emerald-400",
};

interface Props {
  onToggleSidebar: () => void;
  dark?: boolean;
  onToggleDark?: () => void;
}

export function ERPTopbar({ onToggleSidebar, dark, onToggleDark }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate(); 
  const [notifs, setNotifs]         = useState<Notif[]>(MOCK_NOTIFS);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal]   = useState("");
  const notifRef  = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const unread = notifs.filter(n => !n.read).length;

  // Fermer notifs si click dehors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search input quand ouvert sur mobile
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const markAllRead = () => setNotifs(p => p.map(n => ({ ...n, read: true })));

  return (
    <header className="h-14 md:h-16 bg-card border-b border-border flex items-center px-3 md:px-6 gap-2 shrink-0 relative z-10">

      {/* ── Hamburger (toujours visible) ── */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
      >
        <Menu size={20} />
      </button>

      {/* ── Search desktop ── */}
      <div className="hidden md:flex relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={15} />
        <input
          placeholder="Rechercher..."
          className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted border-0 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-background border border-border rounded px-1.5 py-0.5 font-mono hidden lg:block">
          ⌘K
        </kbd>
      </div>

      {/* ── Search mobile toggle ── */}
      <button
        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        onClick={() => setSearchOpen(v => !v)}
      >
        {searchOpen ? <X size={18} /> : <Search size={18} />}
      </button>

      {/* ── Search overlay mobile ── */}
      {searchOpen && (
        <div className="md:hidden absolute left-0 top-full w-full bg-card border-b border-border px-3 py-2 z-50 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
            <input
              ref={searchRef}
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Rechercher employés, dossiers..."
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted border-0 text-sm outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      )}

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── Quick actions (desktop) ── */}
      <div className="hidden lg:flex items-center gap-1 mr-1">
{QUICK_ACTIONS.map(({ icon: Icon, label, path }) => (
  <button
    key={label}
    onClick={() => navigate(path)}
    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
  >
    <Icon size={13} />
    {label}
  </button>
))}
      </div>

      {/* ── Dark mode ── */}
      <button
        onClick={onToggleDark}
        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
        title={dark ? "Mode clair" : "Mode sombre"}
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* ── Notifications ── */}
      <div className="relative shrink-0" ref={notifRef}>
        <button
          onClick={() => setNotifOpen(v => !v)}
          className="p-2 rounded-lg hover:bg-muted transition-colors relative text-muted-foreground hover:text-foreground"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold">
              {unread}
            </span>
          )}
        </button>

        {/* Dropdown notifs */}
        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">Notifications</span>
                {unread > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    {unread} nouvelles
                  </span>
                )}
              </div>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                  Tout lire
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-border">
              {notifs.map(n => (
                <div
                  key={n.id}
                  onClick={() => setNotifs(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))}
                  className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50 ${!n.read ? "bg-primary/5" : ""}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${NOTIF_DOT[n.type]} ${n.read ? "opacity-30" : ""}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${n.read ? "text-muted-foreground" : "text-foreground"}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{n.desc}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-2.5 border-t border-border">
              <button className="w-full text-xs text-center text-primary hover:underline">
                Voir toutes les notifications
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── User avatar ── */}
      <button className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-muted transition-colors shrink-0">
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[11px] font-bold">
          {user?.initials ?? "U"}
        </div>
        <span className="text-xs font-medium text-foreground hidden md:block">{user?.name?.split(" ")[0]}</span>
        <ChevronDown size={12} className="text-muted-foreground hidden md:block" />
      </button>

    </header>
  );
}