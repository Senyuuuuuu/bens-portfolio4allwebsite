import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface ManualPainProps {
  accentColor?: string;
  greenColor?: string;
  bgColor?: string;
  headline?: string;
}

export const ManualPainSequence: React.FC<ManualPainProps> = ({
  accentColor = "#EF4444",
  greenColor = "#10B981",
  bgColor = "#06080E",
  headline = "MANUAL SYNC IN PROGRESS",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Rapidly accelerating pulse speed
  const speedMultiplier = interpolate(frame, [0, 480], [1, 3.5]);

  // Split second freeze at frame 450, then cut to black
  const isFreeze = frame >= 440 && frame < 460;
  const isBlackout = frame >= 460;

  // Kinetic Typography words: COPY -> PASTE -> UPDATE -> REPEAT
  const wordIdx = Math.floor((frame * speedMultiplier) / 25) % 4;
  const words = ["COPY", "PASTE", "UPDATE", "REPEAT"];

  // Software interactions list
  const interactions = [
    { title: "NEW LEAD ARRIVED", detail: "John Doe • enterprise.com", icon: "👤" },
    { title: "COPYING DATA", detail: "Cmd + C -> Clipboard", icon: "📋" },
    { title: "PASTING TO CRM", detail: "Cmd + V -> Field #4082", icon: "📈" },
    { title: "UPDATE SPREADSHEET", detail: "Row 142 -> Processing", icon: "📊" },
    { title: "OPENING EMAIL", detail: "Drafting follow-up...", icon: "✉️" },
    { title: "TYPING RESPONSE", detail: "Sending to client...", icon: "⌨️" },
    { title: "CREATING TASK", detail: "Due: Tomorrow 9:00 AM", icon: "☑️" },
    { title: "SEND NOTIFICATION", detail: "Slack Alert -> #sales-leads", icon: "🔔" },
  ];

  const activeInter = interactions[Math.floor(frame / 20) % interactions.length];

  // Chaotic window stacks around frame
  const stackCount = Math.min(7, Math.floor(frame / 45));

  const wordSpring = spring({
    fps,
    frame: (frame % 25),
    config: { damping: 10, stiffness: 120 },
  });

  if (isBlackout) {
    return <AbsoluteFill style={{ backgroundColor: "#000000" }} />;
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <Audio src={staticFile("n8n-final-master-audio.wav")} volume={0.45} />

      {/* Grid Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(239, 68, 68, 0.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Stacking Chaotic Windows */}
      <div style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: stackCount }).map((_, idx) => {
          const offsetX = Math.sin(idx * 7) * 280 + 200;
          const offsetY = Math.cos(idx * 5) * 180 + 150;
          const item = interactions[idx % interactions.length];

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: 300 + offsetX,
                top: 100 + offsetY,
                width: 480,
                padding: "20px 24px",
                borderRadius: 16,
                background: "rgba(18, 22, 30, 0.85)",
                backdropFilter: "blur(16px)",
                border: `1px solid ${accentColor}40`,
                boxShadow: "0 20px 40px rgba(0,0,0,0.7)",
                transform: `rotate(${Math.sin(idx) * 8}deg) scale(${
                  isFreeze ? 1.05 : 1
                })`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 12,
                  fontWeight: 800,
                  color: accentColor,
                  letterSpacing: 1.5,
                }}
              >
                <span>{item.icon}</span> {item.title}
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}
              >
                {item.detail}
              </div>
            </div>
          );
        })}
      </div>

      {/* Center Main Close-Up Interaction UI Card */}
      <div
        style={{
          zIndex: 10,
          width: 860,
          borderRadius: 24,
          background: "rgba(22, 27, 34, 0.9)",
          backdropFilter: "blur(24px)",
          border: `1.5px solid ${accentColor}60`,
          padding: 36,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          boxShadow: "0 30px 70px rgba(0,0,0,0.8)",
          transform: isFreeze ? "scale(1.02)" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: accentColor,
              }}
            />
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#F59E0B",
              }}
            />
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: greenColor,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: accentColor,
              letterSpacing: 2,
            }}
          >
            {headline}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "rgba(239, 68, 68, 0.15)",
              border: `1px solid ${accentColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            {activeInter.icon}
          </div>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#9CA3AF",
                letterSpacing: 1.5,
              }}
            >
              CURRENT ACTION
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: "#FFFFFF",
                marginTop: 2,
              }}
            >
              {activeInter.title}
            </div>
            <div
              style={{
                fontSize: 16,
                color: accentColor,
                fontWeight: 700,
                marginTop: 2,
              }}
            >
              {activeInter.detail}
            </div>
          </div>
        </div>
      </div>

      {/* Kinetic Typography Badge */}
      <div
        style={{
          zIndex: 20,
          marginTop: 48,
          padding: "16px 56px",
          borderRadius: 100,
          background: "rgba(239, 68, 68, 0.15)",
          border: `2px solid ${accentColor}`,
          boxShadow: `0 0 40px ${accentColor}60`,
          transform: `scale(${wordSpring})`,
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontWeight: 900,
            letterSpacing: "0.25em",
            color: "#F87171",
          }}
        >
          {words[wordIdx]}
        </span>
      </div>
    </AbsoluteFill>
  );
};
