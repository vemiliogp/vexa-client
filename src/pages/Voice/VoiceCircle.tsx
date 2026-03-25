import { useMemo } from "react";

interface VoiceCircleProps {
  volume: number;
  isListening: boolean;
}

export function VoiceCircle({ volume, isListening }: VoiceCircleProps) {
  const rings = useMemo(() => {
    const v = isListening ? volume : 0;
    return [
      { scale: 1 + v * 0.55, opacity: 0.06 + v * 0.06 },
      { scale: 1 + v * 0.38, opacity: 0.10 + v * 0.08 },
      { scale: 1 + v * 0.22, opacity: 0.16 + v * 0.10 },
    ];
  }, [volume, isListening]);

  const coreScale = isListening ? 1 + volume * 0.18 : 1;

  return (
    <div className="voice-circle-container">
      {rings.map((ring, i) => (
        <div
          key={i}
          className={`voice-ring ${isListening ? "voice-ring-active" : ""}`}
          style={{
            transform: `scale(${ring.scale})`,
            opacity: ring.opacity,
            transitionDuration: `${120 - i * 25}ms`,
          }}
        />
      ))}

      <div className={`voice-static-ring voice-static-ring-outer ${isListening ? "voice-ring-glow" : ""}`} />
      <div className="voice-static-ring voice-static-ring-inner" />

      <div
        className={`voice-core ${isListening ? "voice-core-active" : "voice-core-idle"}`}
        style={{ transform: `scale(${coreScale})` }}
      />
    </div>
  );
}
