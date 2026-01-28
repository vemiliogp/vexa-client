import { useState, useRef, useCallback, useEffect } from "react";
import { sendAudioMessage } from "@/services/conversations";

interface UseVoiceSessionOptions {
  conversationId?: string;
  onMessageSent?: () => void;
}

interface UseVoiceSessionReturn {
  isListening: boolean;
  isRecording: boolean;
  isSending: boolean;
  isPlaying: boolean;
  volume: number;
  startSession: () => void;
  stopSession: () => void;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

export function useVoiceSession(options: UseVoiceSessionOptions = {}): UseVoiceSessionReturn {
  const { conversationId, onMessageSent } = options;

  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const isRecordingRef = useRef(false);
  const conversationIdRef = useRef(conversationId);
  const onMessageSentRef = useRef(onMessageSent);

  // Keep refs updated
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    onMessageSentRef.current = onMessageSent;
  }, [onMessageSent]);

  const analyzeVolume = useCallback(() => {
    if (!analyserRef.current || !isRecordingRef.current) {
      setVolume(0);
      animationFrameRef.current = requestAnimationFrame(analyzeVolume);
      return;
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const normalizedVolume = Math.min(average / 128, 1);

    setVolume(normalizedVolume);
    animationFrameRef.current = requestAnimationFrame(analyzeVolume);
  }, []);

  const playResponseAudio = useCallback((url: string) => {
    setIsPlaying(true);

    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }

    const audio = new Audio(url);
    audioElementRef.current = audio;

    audio.onended = () => {
      setIsPlaying(false);
    };

    audio.onerror = () => {
      console.error("Error playing audio");
      setIsPlaying(false);
    };

    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    });
  }, []);

  const sendAudio = useCallback(async (audioBlob: Blob) => {
    const currentConversationId = conversationIdRef.current;
    if (!currentConversationId) {
      console.error("No conversation ID provided");
      return;
    }

    setIsSending(true);
    try {
      const response = await sendAudioMessage(currentConversationId, audioBlob);
      onMessageSentRef.current?.();
      playResponseAudio(response.url);
    } catch (error) {
      console.error("Error sending audio:", error);
    } finally {
      setIsSending(false);
    }
  }, [playResponseAudio]);

  const startSession = useCallback(async () => {
    setIsListening(true);
  }, []);

  const startRecording = useCallback(async () => {
    if (isRecordingRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4",
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType
        });
        audioChunksRef.current = [];

        // Stop and release the media stream
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }

        if (audioBlob.size > 0) {
          sendAudio(audioBlob);
        }
      };

      // Start recording
      mediaRecorder.start();
      isRecordingRef.current = true;
      setIsRecording(true);
      analyzeVolume();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }, [analyzeVolume, sendAudio]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      isRecordingRef.current = false;
      setIsRecording(false);
      setVolume(0);
    }
  }, []);

  const stopSession = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }

    analyserRef.current = null;
    isRecordingRef.current = false;
    setIsListening(false);
    setIsRecording(false);
    setIsPlaying(false);
    setVolume(0);
  }, []);

  return {
    isListening,
    isRecording,
    isSending,
    isPlaying,
    volume,
    startSession,
    stopSession,
    startRecording,
    stopRecording,
  };
}
