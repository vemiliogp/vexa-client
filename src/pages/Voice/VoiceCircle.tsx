import { useMemo } from "react";

interface VoiceCircleProps {
  volume: number;
  isListening: boolean;
}

export function VoiceCircle({ volume, isListening }: VoiceCircleProps) {
  const rings = useMemo(() => {
    const baseScale = 1;
    const volumeMultiplier = isListening ? volume * 0.4 : 0;

    return [
      { scale: baseScale + volumeMultiplier * 3, opacity: 0.03 },
      { scale: baseScale + volumeMultiplier * 2, opacity: 0.05 },
      { scale: baseScale + volumeMultiplier * 1, opacity: 0.08 },
    ];
  }, [volume, isListening]);

  const coreScale = isListening ? 1 + volume * 0.2 : 1;

  return (
    <div className="voice-circle-container">
      {rings.map((ring, index) => (
        <div
          key={index}
          className="voice-ring"
          style={{
            transform: `scale(${ring.scale})`,
            opacity: ring.opacity,
            transitionDuration: `${150 - index * 30}ms`,
          }}
        />
      ))}

      <div className="voice-static-ring voice-static-ring-outer" />
      <div className="voice-static-ring voice-static-ring-inner" />

      <div
        className="voice-core"
        style={{
          transform: `scale(${coreScale})`,
        }}
      />
    </div>
  );
}
