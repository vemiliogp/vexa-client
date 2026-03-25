import { useState } from "react";
import { Link } from "react-router";
import { Mic } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversations } from "./useConversations";
import { CreateConversationDialog } from "./CreateConversationDialog";

import "./Conversations.css";

const modelLabel: Record<string, string> = {
  "deepseek/r1": "DeepSeek R1",
  "openai/gpt-5": "GPT-5",
  "openai/gpt-oss": "GPT OSS",
};

const modelAccent: Record<string, string> = {
  "deepseek/r1": "conv-accent-deepseek",
  "openai/gpt-5": "conv-accent-gpt5",
  "openai/gpt-oss": "conv-accent-gptoss",
};

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora mismo";
  if (mins < 60) return `Hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `Hace ${days}d`;
  return new Date(dateString).toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
}

export function ConversationsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { conversations, isLoading } = useConversations();

  const sorted = [...conversations].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const modelsUsed = [...new Set(conversations.map((c) => c.model))].length;
  const lastActive = sorted[0]
    ? timeAgo(sorted[0].created_at)
    : null;

  return (
    <>
      <div className={`conv-page ${!isLoading && sorted.length === 0 ? "conv-page-empty" : ""}`}>
        {/* Hero */}
        <div className="conv-hero">
          <div className="conv-orb">
            <div className="conv-orb-ring conv-orb-ring-1" />
            <div className="conv-orb-ring conv-orb-ring-2" />
            <div className="conv-orb-ring conv-orb-ring-3" />
            <div className="conv-orb-core" />
          </div>
          <div className="conv-hero-text">
            <h1>Tu analista de datos, en voz.</h1>
            <p>Haz preguntas en lenguaje natural y el agente consultará tu base de datos al instante, sin SQL ni código.</p>
          </div>
          <Button size="lg" className="conv-hero-btn" onClick={() => { setDialogOpen(true); }}>
            <Mic className="size-4" />
            Iniciar consulta
          </Button>

          {!isLoading && conversations.length > 0 && (
            <div className="conv-stats">
              <div className="conv-stat">
                <span className="conv-stat-value">{conversations.length}</span>
                <span className="conv-stat-label">{conversations.length === 1 ? "consulta" : "consultas"}</span>
              </div>
              <div className="conv-stat-divider" />
              <div className="conv-stat">
                <span className="conv-stat-value">{modelsUsed}</span>
                <span className="conv-stat-label">{modelsUsed === 1 ? "modelo" : "modelos"}</span>
              </div>
              {lastActive && (
                <>
                  <div className="conv-stat-divider" />
                  <div className="conv-stat">
                    <span className="conv-stat-value">{lastActive}</span>
                    <span className="conv-stat-label">última consulta</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* History */}
        {isLoading ? (
          <div className="conv-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="conv-card">
                <Skeleton className="h-[13px] w-16 mb-3" />
                <Skeleton className="h-[16px] w-40 mb-2" />
                <Skeleton className="h-[13px] w-full" />
                <div className="conv-card-footer">
                  <Skeleton className="h-[11px] w-14" />
                </div>
              </div>
            ))}
          </div>
        ) : sorted.length > 0 && (
          <>
            <p className="conv-history-label">Historial</p>
            <div className="conv-grid">
              {sorted.map((conv) => (
                <Link key={conv.id} to={`/conversations/${conv.id}`} className="conv-card">
                  <span className={`conv-model-badge ${modelAccent[conv.model] ?? ""}`}>
                    {modelLabel[conv.model] ?? conv.model}
                  </span>
                  <h3>{conv.title ?? "Consulta sin título"}</h3>
                  {conv.context && <p>{conv.context}</p>}
                  <div className="conv-card-footer">
                    <span>{timeAgo(conv.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <CreateConversationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
