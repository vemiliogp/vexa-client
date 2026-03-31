import { useState } from "react";
import { Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useConnections } from "@/pages/Connections/useConnections";
import { useGenerateInsights } from "./useGenerateInsights";

const COUNTS = [1, 2, 3];

type GenerateInsightsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerating: (count: number) => void;
  onDone: () => void;
};

export function GenerateInsightsDialog({
  open,
  onOpenChange,
  onGenerating,
  onDone,
}: GenerateInsightsDialogProps) {
  const [count, setCount] = useState(1);
  const [connectionId, setConnectionId] = useState<number | undefined>();
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "in_app">("in_app");
  const [model, setModel] = useState("openai/gpt-oss");
  const { connections } = useConnections();
  const { generate, isPending, errorMessage } = useGenerateInsights();

  const handleSubmit = async () => {
    onGenerating(count);
    onOpenChange(false);
    await generate({ count, connection_id: connectionId, delivery_method: deliveryMethod, model });
    onDone();
  };

  const handleOpenChange = (value: boolean) => {
    if (!isPending) {
      setCount(1);
      setConnectionId(undefined);
      setDeliveryMethod("in_app");
      setModel("openai/gpt-oss");
      onOpenChange(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Analizar datos</DialogTitle>
          <DialogDescription>
            El agente escaneará la base de datos seleccionada en busca de hallazgos relevantes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">
          <div className="space-y-2">
            <p className="text-sm font-medium">Número de hallazgos</p>
            <div className="flex gap-2 justify-center">
              {COUNTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(n)}
                  className={`w-10 h-10 rounded-md border text-sm font-medium transition-colors ${
                    count === n
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Conexión</p>
            <select
              className="field"
              value={connectionId ?? ""}
              disabled={connections.length === 0}
              onChange={(e) =>
                setConnectionId(e.target.value ? Number(e.target.value) : undefined)
              }
            >
              <option value="">Selecciona una conexión</option>
              {connections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {connections.length === 0 && (
              <p className="text-sm text-amber-600">
                No tienes conexiones configuradas. Añade una base de datos primero.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Modelo</p>
            <select
              className="field"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="openai/gpt-5">OpenAI GPT-5</option>
              <option value="openai/gpt-oss">OpenAI GPT OSS</option>
              <option value="deepseek/r1">DeepSeek R1</option>
              <option value="ollama/deepseek-r1:14b">Ollama DeepSeek R1 14B</option>
            </select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Recibir resultados</p>
            <div className="flex gap-2">
              {(["in_app", "email"] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setDeliveryMethod(method)}
                  className={`flex-1 h-10 rounded-md border text-sm font-medium transition-colors ${
                    deliveryMethod === method
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {method === "in_app" ? "En la app" : "Email"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-md bg-muted p-3">
            <Clock className="size-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              El análisis puede tardar varios minutos. Puedes seguir usando la app mientras tanto.
            </p>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={() => void handleSubmit()} disabled={!connectionId}>
            Analizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
