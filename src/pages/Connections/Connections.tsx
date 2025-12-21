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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useConnections } from "./useConnections";
import { CreateConnectionDialog } from "./CreateConnectionDialog";

export function ConnectionsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { connections, isLoading } = useConnections();

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Motor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                <TableCell><Skeleton className="h-5 w-64" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Conexiones</h1>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            Nueva conexión
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Motor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections.map((connection) => (
              <TableRow key={connection.id}>
                <TableCell className="font-medium">{connection.name}</TableCell>
                <TableCell>{connection.description}</TableCell>
                <TableCell>{connection.engine}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CreateConnectionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
