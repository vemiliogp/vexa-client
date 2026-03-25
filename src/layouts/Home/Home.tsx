import { Link, Navigate, Outlet, useLocation } from "react-router";
import { LogOut, Network, Sparkles, Zap, AudioLines } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLogout } from "./useLogout";
import { useAuthStore } from "@/store/auth";

import "./Home.css";

const navItems = [
  { to: "/connections", icon: Network, label: "Conexiones" },
  { to: "/conversations", icon: AudioLines, label: "Conversaciones" },
  { to: "/insights", icon: Sparkles, label: "Insights" },
];

function Sidebar() {
  const location = useLocation();
  const { logout, isPending } = useLogout();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Zap className="size-5" />
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to ||
            (item.to === "/conversations" && location.pathname.startsWith("/conversations"));
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
          onClick={() => { logout(); }}
          disabled={isPending}
        >
          <LogOut className="size-5" />
        </Button>
      </div>
    </aside>
  );
}

export function HomeLayout() {
  const isAuth = useAuthStore((s) => s.isAuth);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="home-layout">
      <Sidebar />
      <main className="home-main">
        <Outlet />
      </main>
    </div>
  );
}
