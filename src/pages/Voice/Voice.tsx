import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { Mic, MicOff, PhoneOff, MessageSquare, X, Loader2, Copy, Check, Info, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useVoiceSession } from "./useVoiceSession";
import { VoiceCircle } from "./VoiceCircle";
import { getConversationMessages, sendTextMessage, type Message } from "@/services/conversations";
import { useConversations } from "@/pages/Conversations/useConversations";

import "./Voice.css";

export function VoicePage() {
  const navigate = useNavigate();
  const { id: conversationId } = useParams<{ id: string }>();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [textMessage, setTextMessage] = useState("");
  const [isSendingText, setIsSendingText] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { conversations } = useConversations();
  const conversation = conversations.find((c) => String(c.id) === conversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isPanelOpen || messages.length > 0) {
      const timeoutId = setTimeout(scrollToBottom, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, isPanelOpen]);

  const loadMessages = useCallback(() => {
    if (!conversationId) return;

    setIsLoadingMessages(true);
    getConversationMessages(conversationId)
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Error loading messages:", error);
      })
      .finally(() => {
        setIsLoadingMessages(false);
      });
  }, [conversationId]);

  const {
    isListening,
    isRecording,
    isSending,
    isPlaying,
    volume,
    startSession,
    stopSession,
    startRecording,
    stopRecording,
  } = useVoiceSession({
    conversationId,
    onMessageSent: loadMessages,
  });

  useEffect(() => {
    startSession();
    return () => stopSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textMessage.trim() || !conversationId || isSendingText) return;
    const text = textMessage.trim();
    setTextMessage("");

    const optimisticMessage: Message = {
      id: Date.now(),
      content: { role: "user", content: text },
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    setIsSendingText(true);
    try {
      await sendTextMessage(conversationId, text);
      loadMessages();
    } catch (error) {
      console.error("Error sending text message:", error);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
    } finally {
      setIsSendingText(false);
    }
  };

  const handleCopy = (message: Message) => {
    navigator.clipboard.writeText(message.content.content);
    setCopiedId(message.id);
    setTimeout(() => { setCopiedId(null); }, 2000);
  };

  const handleEndSession = () => {
    stopSession();
    navigate("/connections");
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getStatusText = () => {
    if (isSending) return "Procesando consulta...";
    if (isPlaying) return "Respondiendo...";
    if (isRecording) return "Escuchando...";
    return "Listo para escuchar";
  };

  return (
    <div className="voice-page">
      {/* Info Panel */}
      <div className={`messages-panel ${isInfoOpen ? "messages-panel-open" : ""}`}>
        <div className="messages-panel-header">
          <h3>Información</h3>
          <Button
            variant="ghost"
            size="icon"
            className="messages-panel-close"
            onClick={() => { setIsInfoOpen(false); }}
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="messages-panel-content">
          {conversation ? (
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Modelo</span>
                <span className="info-value">{conversation.model}</span>
              </div>
              {conversation.title && (
                <div className="info-item">
                  <span className="info-label">Título</span>
                  <span className="info-value">{conversation.title}</span>
                </div>
              )}
              {conversation.context && (
                <div className="info-item">
                  <span className="info-label">Contexto</span>
                  <span className="info-value">{conversation.context}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">Creada</span>
                <span className="info-value">
                  {new Date(conversation.created_at).toLocaleString("es-MX", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ) : (
            <div className="messages-empty">Sin información</div>
          )}
        </div>
      </div>

      {/* Messages Panel */}
      <div className={`messages-panel ${isPanelOpen ? "messages-panel-open" : ""}`}>
        <div className="messages-panel-header">
          <h3>Transcripción</h3>
          <Button
            variant="ghost"
            size="icon"
            className="messages-panel-close"
            onClick={togglePanel}
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="messages-panel-content">
          {isLoadingMessages ? (
            <div className="messages-loading">Cargando mensajes...</div>
          ) : messages.length === 0 ? (
            <div className="messages-empty">Aún no hay consultas en esta sesión</div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`message-row message-row-${message.content.role}`}>
                <div className={`message-item message-${message.content.role}`}>
                  <div className="message-meta">
                    <span className="message-role">
                      {message.content.role === "user" ? "Tú" : "Agente"}
                    </span>
                    <span className="message-time">
                      {new Date(message.created_at).toLocaleTimeString("es-MX", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="message-content">{message.content.content}</div>
                </div>
                {message.content.role === "assistant" && (
                  <button
                    className="message-copy"
                    onClick={() => { handleCopy(message); }}
                    title="Copiar"
                  >
                    {copiedId === message.id
                      ? <Check className="size-3" />
                      : <Copy className="size-3" />}
                  </button>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form className="message-input-form" onSubmit={(e) => { void handleSendText(e); }}>
          <div className="message-input-wrapper">
            <input
              className="message-input"
              type="text"
              placeholder="Escribe una consulta..."
              value={textMessage}
              onChange={(e) => { setTextMessage(e.target.value); }}
              disabled={isSendingText}
            />
            <button
              className="message-send-btn"
              type="submit"
              disabled={!textMessage.trim() || isSendingText}
            >
              {isSendingText ? <Loader2 className="size-3 animate-spin" /> : <Send className="size-3" />}
            </button>
          </div>
        </form>
      </div>

      <div className="voice-status-group">
        {conversation?.title && (
          <h2 className="voice-conversation-title">{conversation.title}</h2>
        )}
        <div className="voice-status">
          <span className={`voice-status-dot ${isSending || isPlaying ? "voice-status-dot-processing" : ""}`} />
          <span className="voice-status-text">
            {isListening ? "AGENTE ACTIVO" : "CONECTANDO"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`voice-info-btn ${isInfoOpen ? "voice-control-active" : ""}`}
          onClick={() => { setIsInfoOpen(!isInfoOpen); }}
        >
          <Info className="size-4" />
        </Button>
      </div>

      <div className="voice-main">
        <VoiceCircle volume={volume} isListening={isRecording} />

        <div className="voice-text">
          <h2>{getStatusText()}</h2>
          <p>
            {isRecording
              ? "Suelta para enviar tu consulta"
              : isSending
                ? "El agente está procesando..."
                : isPlaying
                  ? "Escucha la respuesta del agente"
                  : "Presiona el micrófono para hablar"}
          </p>
        </div>
      </div>

      <div className="voice-controls">
        <Button
          variant="ghost"
          size="icon"
          className={`voice-control-btn ${isRecording ? "voice-control-recording" : ""}`}
          onClick={handleMicClick}
          disabled={isSending || isPlaying}
        >
          {isSending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : isRecording ? (
            <Mic className="size-5" />
          ) : (
            <MicOff className="size-5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="voice-control-btn voice-control-end"
          onClick={handleEndSession}
        >
          <PhoneOff className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`voice-control-btn ${isPanelOpen ? "voice-control-active" : ""}`}
          onClick={togglePanel}
        >
          <MessageSquare className="size-5" />
        </Button>

      </div>
    </div>
  );
}
