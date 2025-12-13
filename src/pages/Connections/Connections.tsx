import { Cable, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

export function ConnectionsPage() {
  return (
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
      <Button>
        <Plus className="size-4" />
        Nueva conexión
      </Button>
    </Empty>
  );
}
