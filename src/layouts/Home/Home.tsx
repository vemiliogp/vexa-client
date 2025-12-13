import { Link, Outlet } from "react-router";
import { LogOut, Cable, MessageSquare, Settings, User } from "lucide-react";

import { Button } from "@/components/ui/button";

import "./Home.css";

function FloatingMenu() {
  return (
    <nav className="floating-menu">
      <Link to="/connections">
        <Button variant="ghost" size="icon" className="floating-menu-item">
          <Cable className="size-5" />
        </Button>
      </Link>
      <Link to="/conversations">
        <Button variant="ghost" size="icon" className="floating-menu-item">
          <MessageSquare className="size-5" />
        </Button>
      </Link>
      <Link to="/settings">
        <Button variant="ghost" size="icon" className="floating-menu-item">
          <Settings className="size-5" />
        </Button>
      </Link>
      <Link to="/profile">
        <Button variant="ghost" size="icon" className="floating-menu-item">
          <User className="size-5" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="floating-menu-item text-destructive"
      >
        <LogOut className="size-5" />
      </Button>
    </nav>
  );
}

export function HomeLayout() {
  return (
    <div className="home-layout">
      <main className="home-main">
        <Outlet />
      </main>
      <FloatingMenu />
    </div>
  );
}
