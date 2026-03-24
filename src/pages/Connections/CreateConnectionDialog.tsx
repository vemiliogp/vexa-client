import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateConnection } from "./useCreateConnection";
import { checkConnection } from "@/services/connections";

const connectionSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  description: z.string().min(1, { message: "La descripción es requerida" }),
  engine: z.string().min(1, { message: "El motor es requerido" }),
  url: z.string().url({ message: "Ingresa una URL válida" }),
});

type ConnectionValues = z.infer<typeof connectionSchema>;

type CreateConnectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateConnectionDialog({
  open,
  onOpenChange,
}: CreateConnectionDialogProps) {
  const form = useForm<ConnectionValues>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      name: "",
      description: "",
      engine: "postgres",
      url: "",
    },
  });

  const { createConnection, errorMessage, isPending } = useCreateConnection();
  const [checkStatus, setCheckStatus] = useState<"idle" | "ok" | "error">("idle");

  const urlValue = useWatch({ control: form.control, name: "url" });

  const checkMutation = useMutation({
    mutationFn: checkConnection,
    onSuccess: (data) => setCheckStatus(data.success ? "ok" : "error"),
    onError: () => setCheckStatus("error"),
  });

  const handleCheck = () => {
    setCheckStatus("idle");
    checkMutation.reset();
    checkMutation.mutate({ url: urlValue });
  };

  const handleUrlChange = () => {
    if (checkStatus !== "idle") setCheckStatus("idle");
  };

  const onSubmit = async (values: ConnectionValues) => {
    const result = await createConnection(values);
    if (result) {
      form.reset();
      setCheckStatus("idle");
      onOpenChange(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setCheckStatus("idle");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva conexión</DialogTitle>
          <DialogDescription>
            Configura los datos de tu conexión a base de datos.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="Mi conexión"
                      className="field"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="Base de datos de clientes"
                      className="field"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="engine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motor</FormLabel>
                  <FormControl>
                    <select {...field} className="field">
                      <option value="postgres">PostgreSQL</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de conexión</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="postgresql://user:password@host:5432/database"
                      className="field"
                      onChange={(e) => {
                        field.onChange(e);
                        handleUrlChange();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={!urlValue || checkMutation.isPending}
                onClick={handleCheck}
              >
                {checkMutation.isPending ? "Probando..." : "Probar conexión"}
              </Button>
              {checkStatus === "ok" && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="size-4" /> Conexión exitosa
                </span>
              )}
              {checkStatus === "error" && (
                <span className="flex items-center gap-1 text-sm text-red-600">
                  <XCircle className="size-4" /> No se pudo conectar
                </span>
              )}
            </div>

            {errorMessage ? (
              <p className="text-sm text-red-600" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending || checkStatus !== "ok"}>
                {isPending ? "Creando..." : "Crear conexión"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
