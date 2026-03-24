import { useState } from "react";
import { Lightbulb, Plus, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useInsights } from "./useInsights";
import { GenerateInsightsDialog } from "./GenerateInsightsDialog";
import { useInsightsStore } from "@/store/insights";
import "./Insights.css";

function InsightSkeleton() {
  return (
    <div className="insight-card">
      <Skeleton className="h-[16px] w-3/4 mb-[12px]" />
      <Skeleton className="h-[14px] w-full mb-[6px]" />
      <Skeleton className="h-[14px] w-full mb-[6px]" />
      <Skeleton className="h-[14px] w-2/3" />
      <div className="insight-footer">
        <Skeleton className="h-[13px] w-14" />
      </div>
    </div>
  );
}

export function InsightsPage() {
  const { insights, isLoading } = useInsights();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { generatingCount, setGeneratingCount } = useInsightsStore();

  if (isLoading) {
    return (
      <div className="insights-page">
        <div className="page-header-content mb-8">
          <Skeleton className="h-[18px] w-24 mb-[4px]" />
          <Skeleton className="h-[14px] w-72" />
          <div className="flex justify-end mt-4">
            <Skeleton className="h-9 w-36" />
          </div>
        </div>
        <div className="insights-grid">
          {[1, 2, 3].map((i) => <InsightSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (insights.length === 0 && generatingCount === 0) {
    return (
      <div className="insights-page">
        <Empty className="border border-solid">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Lightbulb className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No hay insights disponibles</EmptyTitle>
            <EmptyDescription>
              Genera tu primer insight a partir del análisis de tus datos.
            </EmptyDescription>
          </EmptyHeader>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            Generar insights
          </Button>
        </Empty>
        <GenerateInsightsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onGenerating={setGeneratingCount}
          onDone={() => setGeneratingCount(0)}
        />
      </div>
    );
  }

  return (
    <div className="insights-page">
      <div className="page-header-content mb-8">
        <h1>Insights</h1>
        <p>Hallazgos generados automáticamente a partir de tus datos.</p>
        <div className="flex justify-end mt-12">
          <Button
            onClick={() => setDialogOpen(true)}
            disabled={generatingCount > 0}
          >
            <Plus className="size-4" />
            Generar insights
          </Button>
        </div>
      </div>

      {generatingCount === 0 && insights.length > 0 && (
        <div className="insight-notice">
          <Clock className="size-4 shrink-0" />
          <p>Si generaste insights recientemente, aparecerán aquí en cuanto el proceso termine.</p>
        </div>
      )}

      <div className="insights-grid">
        {Array.from({ length: generatingCount }).map((_, i) => (
          <InsightSkeleton key={i} />
        ))}
        {insights.map((insight) => (
          <article key={insight.id} className="insight-card">
            <h3>{insight.title}</h3>
            <p>{insight.description}</p>
            {insight.created_at && (
              <div className="insight-footer">
                <span className="insight-time">
                  {new Date(insight.created_at).toLocaleTimeString("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </article>
        ))}
      </div>

      <GenerateInsightsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onGenerating={setGeneratingCount}
        onDone={() => setGeneratingCount(0)}
      />
    </div>
  );
}
