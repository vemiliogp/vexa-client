import { Link } from "react-router";
import { MessageSquare } from "lucide-react";

import { type Conversation } from "@/services/conversations";

interface RecentConversationsProps {
  conversations: Conversation[];
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-MX", {
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
        <Link to="/conversations">Ver todas</Link>
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
            <p className="conversation-model">{formatTime(conversation.created_at)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
