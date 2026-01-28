import { Lightbulb } from "lucide-react";

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useInsights } from "./useInsights";
import "./Insights.css";

export function InsightsPage() {
  const { insights, isLoading } = useInsights();

  if (isLoading) {
    return (
      <div className="insights-page">
        <div className="page-header">
          <div className="page-header-content">
            <Skeleton className="h-8 w-32 mb-2" />
          </div>
        </div>
        <div className="insights-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="insight-card">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="insights-page">
        <Empty className="border border-solid">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Lightbulb className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No hay insights disponibles</EmptyTitle>
            <EmptyDescription>
              Aún no se han generado insights. Los insights se crean
              automáticamente a partir del análisis de tus datos.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="insights-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>Insights</h1>
        </div>
      </div>

      <div className="insights-grid">
        {insights.map((insight) => (
          <article key={insight.id} className="insight-card">
            <h3>{insight.title}</h3>
            <p>{insight.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
