import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ERPSidebar } from "./ERPSidebar";
import { ERPTopbar } from "./ERPTopbar";

export function ERPLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      <ERPSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ERPTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6 fade-in" key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
