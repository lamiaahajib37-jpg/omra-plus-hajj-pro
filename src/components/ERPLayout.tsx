import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ERPSidebar } from "./ERPSidebar";
import { ERPTopbar } from "./ERPTopbar";

export function ERPLayout() {
  const isMobile = () => window.innerWidth < 768;
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile());
  const location = useLocation();

  useEffect(() => {
    if (isMobile()) setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onResize = () => {
      if (!isMobile()) setSidebarOpen(true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && isMobile() && (
        <div
          className="fixed inset-0 z-20 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <ERPSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isMobile={isMobile()}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <ERPTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 fade-in" key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}