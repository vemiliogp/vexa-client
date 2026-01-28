import { useState } from "react";
import { Cable, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useConnections } from "./useConnections";
import { CreateConnectionDialog } from "./CreateConnectionDialog";
import { ConnectionCard } from "./ConnectionCard";
import { RecentConversations } from "@/pages/Conversations/RecentConversations";
import { useConversations } from "@/pages/Conversations/useConversations";

export function ConnectionsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { connections, isLoading } = useConnections();
  const { conversations } = useConversations();

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="page-header">
          <div className="page-header-content">
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="connections-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="connection-card">
              <div className="connection-card-header">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <>
        <Empty className="border border-solid">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Cable className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No hay conexiones</EmptyTitle>
            <EmptyDescription>
              Aún no tienes ninguna conexión de base de datos configurada. Crea tu
              primera conexión para comenzar a conversar con tus datos.
            </EmptyDescription>
          </EmptyHeader>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            Nueva conexión
          </Button>
        </Empty>
        <CreateConnectionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </>
    );
  }

  return (
    <>
      <div className="w-full">
        <div className="page-header">
          <div className="page-header-content">
            <h1>Conexiones</h1>
            <p>Gestiona tus fuentes de datos distribuidas.</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            Nueva conexión
          </Button>
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
