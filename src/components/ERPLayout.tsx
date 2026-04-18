import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ERPSidebar } from "./ERPSidebar";
import { ERPTopbar } from "./ERPTopbar";
import {
  LayoutDashboard, FolderOpen, ClipboardList, Clock, Bell
} from "lucide-react";
import { Link } from "react-router-dom";

// ── Dark mode hook ─────────────────────────────────────────────────────
function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("erp-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("erp-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("erp-theme", "light");
    }
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

// ── Mobile bottom nav items ────────────────────────────────────────────
const BOTTOM_NAV = [
  { label: "Accueil",  icon: LayoutDashboard, path: "/" },
  { label: "Dossiers", icon: FolderOpen,       path: "/dossiers" },
  { label: "Tâches",   icon: ClipboardList,    path: "/taches" },
  { label: "Pointage", icon: Clock,            path: "/pointage" },
  { label: "Alertes",  icon: Bell,             path: "/notifications" },
];



// ── Layout ─────────────────────────────────────────────────────────────
export function ERPLayout() {
  const isMobile = useCallback(() => window.innerWidth < 768, []);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile());
  const [mobile, setMobile] = useState(isMobile());
  const { dark, toggle: toggleDark } = useDarkMode();
  const location = useLocation();

  // Fermer sidebar après navigation mobile
  useEffect(() => {
    if (mobile) setSidebarOpen(false);
  }, [location.pathname, mobile]);

  // Resize listener
  useEffect(() => {
    const onResize = () => {
      const m = window.innerWidth < 768;
      setMobile(m);
      if (!m) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ── Overlay mobile ── */}
      <div
        className={`
          fixed inset-0 z-20 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${sidebarOpen && mobile ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Sidebar ── */}
      <ERPSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        isMobile={mobile}
        dark={dark}
        onToggleDark={toggleDark}
      />

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <ERPTopbar
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          dark={dark}
          onToggleDark={toggleDark}
        />

        {/* Page content */}
        <main
          className={`
            flex-1 overflow-y-auto fade-in
            p-4 md:p-6
            ${mobile ? "pb-20" : ""}
          `}
          key={location.pathname}
        >
          <Outlet />
        </main>
      </div>

      {/* ── Bottom nav (mobile only) ── */}
      {mobile && (
        <nav className="
          fixed bottom-0 left-0 right-0 z-30
          bg-sidebar border-t border-sidebar-border
          flex items-center justify-around
          h-16 px-2
          safe-area-inset-bottom
        ">
          {BOTTOM_NAV.map((item) => {
            const active =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center justify-center gap-1
                  flex-1 h-full rounded-xl mx-0.5
                  transition-all duration-200
                  ${active
                    ? "text-primary"
                    : "text-sidebar-foreground/50 hover:text-sidebar-foreground"}
                `}
              >
                <div className={`
                  p-1.5 rounded-lg transition-all duration-200
                  ${active ? "bg-primary/15 scale-110" : ""}
                `}>
                  <item.icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                </div>
                <span className={`
                  text-[10px] font-medium tracking-wide leading-none
                  ${active ? "font-semibold" : ""}
                `}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}


