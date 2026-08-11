import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface MorphingBoxProps {
  fromWidth?: string | number;
  toWidth?: string | number;
  fromHeight?: string | number;
  toHeight?: string | number;
  fromBorderRadius?: number;
  toBorderRadius?: number;
  fromBgColor?: string;
  toBgColor?: string;
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
  children?: React.ReactNode;
}

export const MorphingBox: React.FC<MorphingBoxProps> = ({
  fromWidth = "80%",
  toWidth = "90%",
  fromHeight = 200,
  toHeight = 260,
  fromBorderRadius = 16,
  toBorderRadius = 40,
  fromBgColor = "#eab308", // Yellow
  toBgColor = "#3b82f6",   // Blue
  fromX = 0,
  toX = 0,
  fromY = 50,
  toY = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring physics matching stiffness: 120, damping: 14
  const progress = spring({
    frame,
    fps,
    config: {
      stiffness: 120,
      damping: 14,
    },
  });

  const borderRadius = interpolate(progress, [0, 1], [fromBorderRadius, toBorderRadius]);
  const translateX = interpolate(progress, [0, 1], [fromX, toX]);
  const translateY = interpolate(progress, [0, 1], [fromY, toY]);

  // Numerical interpolation helper for px/rem/percentages
  const currentWidth = typeof fromWidth === "number" && typeof toWidth === "number"
    ? `${interpolate(progress, [0, 1], [fromWidth, toWidth])}px`
    : progress < 0.5 ? fromWidth : toWidth;

  const currentHeight = typeof fromHeight === "number" && typeof toHeight === "number"
    ? `${interpolate(progress, [0, 1], [fromHeight, toHeight])}px`
    : progress < 0.5 ? fromHeight : toHeight;

  return (
    <div
      style={{
        width: currentWidth,
        height: currentHeight,
        borderRadius: `${borderRadius}px`,
        transform: `translate(${translateX}px, ${translateY}px)`,
        backgroundColor: progress > 0.5 ? toBgColor : fromBgColor,
        transition: "background-color 0.2s ease-in-out",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};
