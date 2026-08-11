import React from "react";
import { spring, interpolate, Easing } from "remotion";
import { evolvePath, getPointAtLength, getLength } from "@remotion/paths";

// ─── Exact Master Prompt SVG Path Definitions ────────────────────────────────
// viewBox="0 0 600 300", Origin M 50 250
export const CHART_PATH_DATA = [
  {
    id: "google",
    name: "Google Ads",
    color: "#00B578",
    path: "M 50 250 Q 150 80 500 80",
    startFrameRel: 29, // Absolute frame 450 (421 + 29)
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "#2F80ED",
    path: "M 50 250 Q 150 140 400 140",
    startFrameRel: 34, // Absolute frame 455 (421 + 34)
  },
  {
    id: "tiktok",
    name: "TikTok",
    color: "#8B5CF6",
    path: "M 50 250 Q 120 180 320 180",
    startFrameRel: 39, // Absolute frame 460 (421 + 39)
  },
  {
    id: "bing",
    name: "Bing",
    color: "#F2994A",
    path: "M 50 250 Q 100 210 250 210",
    startFrameRel: 44, // Absolute frame 465 (421 + 44)
  },
  {
    id: "reddit",
    name: "Reddit",
    color: "#EB5757",
    path: "M 50 250 Q 80 230 180 230",
    startFrameRel: 49, // Absolute frame 470 (421 + 49)
  },
];

// ─── Main Export: <ChartLines/> ────────────────────────────────────────────────
export const ChartLines: React.FC<{
  currentFrame: number;
  fps: number;
}> = ({ currentFrame, fps }) => {
  return (
    <svg
      width={600}
      height={300}
      viewBox="0 0 600 300"
      style={{ overflow: "visible" }}
    >
      {/* Grid lines */}
      {[50, 100, 150, 200, 250].map((y) => (
        <line
          key={y}
          x1={50}
          y1={y}
          x2={550}
          y2={y}
          stroke="rgba(226,232,240,0.5)"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
      ))}
      {[50, 150, 250, 350, 450, 550].map((x) => (
        <line
          key={x}
          x1={x}
          y1={50}
          x2={x}
          y2={250}
          stroke="rgba(226,232,240,0.3)"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
      ))}

      {/* Render each curve */}
      {CHART_PATH_DATA.map((item) => {
        const frameOffset = Math.max(0, currentFrame - item.startFrameRel);

        // Spring draw progress over 90 frames with damping: 14 as per prompt
        const rawProgress = spring({
          frame: frameOffset,
          fps,
          config: { damping: 14, stiffness: 60, mass: 1 },
        });

        const progress = Math.min(1, Math.max(0, rawProgress));

        // Use evolvePath from @remotion/paths
        const { strokeDasharray, strokeDashoffset } = evolvePath(progress, item.path);

        // Calculate leading dot position using getPointAtLength
        const totalLen = getLength(item.path);
        const currentLen = totalLen * Math.min(0.999, Math.max(0.001, progress));
        const point = getPointAtLength(item.path, currentLen);

        return (
          <g key={item.id}>
            {/* Evolved stroke */}
            <path
              d={item.path}
              stroke={item.color}
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />

            {/* Subtle underglow path */}
            <path
              d={`${item.path} L 550 250 L 50 250 Z`}
              fill={item.color}
              opacity={progress * 0.05}
            />

            {/* Leading dot at exact getPointAtLength coordinates */}
            {progress > 0.01 && (
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill={item.color}
                style={{ filter: `drop-shadow(0 0 6px ${item.color})` }}
              />
            )}
          </g>
        );
      })}

      {/* Saturation threshold indicator */}
      {currentFrame > 90 && (
        <g opacity={interpolate(currentFrame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <line
            x1={400}
            y1={50}
            x2={400}
            y2={250}
            stroke="rgba(239,68,68,0.5)"
            strokeWidth="1.5"
            strokeDasharray="6,3"
          />
          <text x={406} y={65} fontSize="10" fill="#EF4444" fontFamily="Inter, sans-serif" fontWeight="600">
            Saturation Threshold
          </text>
        </g>
      )}
    </svg>
  );
};
