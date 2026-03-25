import { useState } from "react";
import { Cable, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useConnections } from "./useConnections";
import { CreateConnectionDialog } from "./CreateConnectionDialog";
import { ConnectionCard } from "./ConnectionCard";
import { RecentConversations } from "@/pages/Conversations/RecentConversations";
import { useConversations } from "@/pages/Conversations/useConversations";
import { useAuthStore } from "@/store/auth";

export function ConnectionsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { connections, isLoading } = useConnections();
  const { conversations } = useConversations();
  const userName = useAuthStore((s) => s.userName);
  const firstName = userName?.split(" ")[0] ?? null;

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="page-header-content">
          {firstName && <Skeleton className="h-8 w-36 mb-24" />}
          <div className="page-header">
            <div>
              <Skeleton className="h-[18px] w-28 mb-[4px]" />
              <Skeleton className="h-[14px] w-56" />
            </div>
            <Skeleton className="h-9 w-36" />
          </div>
        </div>
        <div className="connections-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="connection-card">
              <div className="connection-card-header">
                <Skeleton className="h-[26px] w-9" />
              </div>
              <div className="connection-card-body">
                <Skeleton className="h-[16px] w-32 mb-[8px]" />
                <Skeleton className="h-[13px] w-full mb-1" />
                <Skeleton className="h-[13px] w-3/4 mb-[16px]" />
              </div>
              <div className="connection-card-footer">
                <Skeleton className="h-[11px] w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <>
        <div className="w-full">
          {firstName && (
            <h3 className="text-3xl font-semibold mb-24">
              Hola, {firstName} 👋
            </h3>
          )}
          <div className="empty-state">
            <div className="empty-state-visual">
              <div className="empty-nodes">
                <div className="empty-node empty-node-center"><Cable className="size-5" /></div>
                <div className="empty-node empty-node-1" />
                <div className="empty-node empty-node-2" />
                <div className="empty-node empty-node-3" />
                <div className="empty-line empty-line-1" />
                <div className="empty-line empty-line-2" />
                <div className="empty-line empty-line-3" />
              </div>
            </div>
            <div className="empty-state-text">
              <h2>Sin fuentes de datos</h2>
              <p>Conecta tu primera base de datos para empezar. Sin una conexión activa, las consultas por voz y el análisis de hallazgos no están disponibles.</p>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="size-4" />
              Nueva conexión
            </Button>
          </div>
        </div>
        <CreateConnectionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </>
    );
  }

  return (
    <>
      <div className="w-full">
        <div className="page-header-content">
          {firstName && (
            <h3 className="text-3xl font-semibold mb-24">
              Hola, {firstName} 👋
            </h3>
          )}
          <div className="page-header">
            <div>
              <h1>Conexiones</h1>
              <p>Bases de datos disponibles para el agente.</p>
            </div>
            <Button onClick={() => { setDialogOpen(true); }}>
              <Plus className="size-4" />
              Nueva conexión
            </Button>
          </div>
        </div>

        <div className="connections-grid">
          {connections.map((connection) => (
            <ConnectionCard key={connection.id} connection={connection} />
          ))}
        </div>

        <RecentConversations conversations={conversations} />
      </div>
      <CreateConnectionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
