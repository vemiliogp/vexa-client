import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useCreateConversation } from "./useCreateConversation";
import { useConnections } from "@/pages/Connections/useConnections";

const conversationSchema = z.object({
  model: z.enum(["deepseek/r1", "openai/gpt-5", "openai/gpt-oss"]),
  connection_id: z.string().min(1, { message: "Selecciona una conexión" }),
  title: z.string().max(50).optional(),
  context: z.string().optional(),
});

type ConversationValues = z.infer<typeof conversationSchema>;

type CreateConversationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateConversationDialog({
  open,
  onOpenChange,
}: CreateConversationDialogProps) {
  const form = useForm<ConversationValues>({
    resolver: zodResolver(conversationSchema),
    defaultValues: {
      model: "openai/gpt-5",
      connection_id: "",
      title: "",
      context: "",
    },
  });

  const { createConversation, errorMessage, isPending } = useCreateConversation();
  const { connections } = useConnections();

  const onSubmit = async (values: ConversationValues) => {
    const payload = {
      model: values.model,
      connection_id: Number(values.connection_id),
      ...(values.title ? { title: values.title } : {}),
      ...(values.context ? { context: values.context } : {}),
    };
    await createConversation(payload);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) form.reset();
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva consulta</DialogTitle>
          <DialogDescription>
            Elige el modelo y la base de datos que el agente usará para responder tus preguntas.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <select {...field} className="field">
                      <option value="openai/gpt-5">OpenAI GPT-5</option>
                      <option value="openai/gpt-oss">OpenAI GPT OSS</option>
                      <option value="deepseek/r1">DeepSeek R1</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="connection_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conexión</FormLabel>
                  <FormControl>
                    <select {...field} className="field" disabled={connections.length === 0}>
                      <option value="">Selecciona una conexión</option>
                      {connections.map((c) => (
                        <option key={c.id} value={String(c.id)}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  {connections.length === 0 && (
                    <p className="text-sm text-amber-600">
                      No tienes conexiones configuradas. Añade una base de datos primero.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título (opcional)</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="Análisis de ventas Q1"
                      className="field"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contexto (opcional)</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Ej: Enfócate en las tablas de ventas y clientes..."
                      className="field"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorMessage && (
              <p className="text-sm text-red-600" role="alert">
                {errorMessage}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending || connections.length === 0}>
                {isPending ? "Conectando..." : "Consultar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
