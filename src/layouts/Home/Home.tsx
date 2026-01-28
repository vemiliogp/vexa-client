import { Link, Outlet, useLocation } from "react-router";
import { LogOut, Network, Sparkles, Zap, AudioLines } from "lucide-react";

import { Button } from "@/components/ui/button";

import "./Home.css";

const navItems = [
  { to: "/connections", icon: Network, label: "Conexiones" },
  { to: "/conversations", icon: AudioLines, label: "Conversaciones" },
  { to: "/insights", icon: Sparkles, label: "Insights" }
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Zap className="size-5" />
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to}>
              <Button
                variant="ghost"
                size="icon"
                className={`sidebar-item ${isActive ? "sidebar-item-active" : ""}`}
                title={item.label}
              >
                <item.icon className="size-5" />
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Button
          variant="ghost"
          size="icon"
          className="sidebar-item sidebar-item-logout"
          title="Cerrar sesión"
        >
          <LogOut className="size-5" />
        </Button>
      </div>
    </aside>
  );
}

export function HomeLayout() {
  return (
    <div className="home-layout">
      <Sidebar />
      <main className="home-main">
        <Outlet />
      </main>
    </div>
  );
}
