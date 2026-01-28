import { useState, useRef, useEffect } from "react";
import { MoreVertical, Icon, Trash2 } from "lucide-react";
import { elephant } from '@lucide/lab';
import type { Connection } from "@/services/connections";

interface ConnectionCardProps {
  connection: Connection;
}

const engineNames: Record<string, string> = {
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
};

export function ConnectionCard({ connection }: ConnectionCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const engineKey = connection.engine.toLowerCase();
  const engineName = engineNames[engineKey] ?? connection.engine;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="connection-card group">
      <div className="connection-card-header">
        <div className="connection-badge">
          <Icon iconNode={elephant} />
        </div>
        <div className="connection-card-actions" ref={menuRef}>
          <button
            className="connection-menu-btn"
            type="button"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical className="size-4" />
          </button>

          {showMenu && (
            <div className="connection-action-menu">
              <button
                className="menu-item delete"
                type="button"
                onClick={() => {
                  console.log("Eliminar", connection.id);
                  setShowMenu(false);
                }}
              >
                <Trash2 className="size-4" />
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="connection-card-body">
        <h3>{connection.name}</h3>
        <p>{connection.description}</p>
      </div>

      <div className="connection-card-footer">
        <span className="connection-engine">{engineName}</span>
      </div>
    </div>
  );
}
