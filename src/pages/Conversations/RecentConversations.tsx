import { Link } from "react-router";
import { MessageSquare } from "lucide-react";

import { type Conversation } from "@/services/conversations";

interface RecentConversationsProps {
  conversations: Conversation[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RecentConversations({ conversations }: RecentConversationsProps) {
  if (conversations.length === 0) {
    return null;
  }

  return (
    <section className="section">
      <div className="section-header">
        <h2>Conversaciones Recientes</h2>
      </div>

      <div className="conversation-list">
        {conversations.map((conversation) => (
          <Link
            key={conversation.id}
            to={`/conversations/${conversation.id}`}
            className="conversation-item"
          >
            <div className="conversation-icon">
              <MessageSquare />
            </div>
            <div className="conversation-content">
              <h4>{conversation.title ?? "Sin título"}</h4>
              <p>{conversation.context}</p>
            </div>
            <p className="conversation-model font-semibold">{formatDate(conversation.created_at)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
