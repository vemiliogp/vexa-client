import { Icon } from "lucide-react";
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
  const engineKey = connection.engine.toLowerCase();
  const engineName = engineNames[engineKey] ?? connection.engine;

  return (
    <div className="connection-card group">
      <div className="connection-card-header">
        <div className="connection-badge">
          <Icon iconNode={elephant} />
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
