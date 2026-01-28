import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { Mic, MicOff, PhoneOff, MessageSquare, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useVoiceSession } from "./useVoiceSession";
import { VoiceCircle } from "./VoiceCircle";
import { getConversationMessages, type Message } from "@/services/conversations";

import "./Voice.css";

export function VoicePage() {
  const navigate = useNavigate();
  const { id: conversationId } = useParams<{ id: string }>();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isPanelOpen || messages.length > 0) {
      // Small timeout to allow the panel transition or rendering to complete
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
    if (isSending) return "Enviando...";
    if (isPlaying) return "Reproduciendo respuesta...";
    if (isRecording) return "Escuchando...";
    return "Listo";
  };

  return (
    <div className="voice-page">
      {/* Messages Panel */}
      <div className={`messages-panel ${isPanelOpen ? "messages-panel-open" : ""}`}>
        <div className="messages-panel-header">
          <h3>Mensajes</h3>
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
            <div className="messages-empty">No hay mensajes</div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`message-item message-${message.content.role}`}
              >
                <div className="message-role">
                  {message.content.role === "user" ? "Tú" : "Asistente"}
                </div>
                <div className="message-content">{message.content.content}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="voice-status">
        <span className={`voice-status-dot ${isSending || isPlaying ? "voice-status-dot-processing" : ""}`} />
        <span className="voice-status-text">
          {isListening ? "SESIÓN DE VOZ ACTIVA" : "INICIANDO SESIÓN"}
        </span>
      </div>

      <div className="voice-main">
        <VoiceCircle volume={volume} isListening={isRecording} />

        <div className="voice-text">
          <h2>{getStatusText()}</h2>
          <p>
            {isRecording
              ? "Presiona el micrófono para enviar"
              : isSending
                ? "Procesando tu mensaje..."
                : isPlaying
                  ? "Escucha la respuesta"
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
