import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Center, Text3D } from "@react-three/drei";
import { z } from "zod";

// Zod Schema for inputProps validation
export const dynamic3DTextSchema = z.object({
  text: z.string().default("OHMnibus 3D"),
  fontUrl: z
    .string()
    .default(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    ),
  color: z.string().default("#A855F7"),
  bevelEnabled: z.boolean().default(true),
  bevelSize: z.number().default(0.03),
  bevelThickness: z.number().default(0.08),
  height: z.number().default(0.2), // Extrusion depth
});

export type Dynamic3DTextProps = z.infer<typeof dynamic3DTextSchema>;

/**
 * Inner 3D Scene Component rendered inside ThreeCanvas WebGL context
 */
const TextScene: React.FC<Dynamic3DTextProps> = ({
  text,
  fontUrl,
  color,
  bevelEnabled,
  bevelSize,
  bevelThickness,
  height,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // =========================================================================
  // 1. ENTRANCE SPRING ANIMATION (stiffness: 120, damping: 14)
  // Scales text geometry up smoothly from 0 to 1 upon scene load
  // =========================================================================
  const scaleSpring = spring({
    frame,
    fps,
    config: {
      stiffness: 120,
      damping: 14,
    },
  });

  // =========================================================================
  // 2. CONTINUOUS ROTATION MATHEMATICS
  // Rotates text slowly along Y-axis to reveal 3D depth, extrusions, and bevel reflections.
  // Formula: rotationY = (frame / fps) * rotationSpeedRadiansPerSec
  // =========================================================================
  const rotationSpeed = 0.25; // Radians per second
  const rotationY = (frame / fps) * rotationSpeed;
  const rotationX = Math.sin((frame / fps) * 0.5) * 0.05; // Subtle pitch wobble

  return (
    <group
      scale={[scaleSpring, scaleSpring, scaleSpring]}
      rotation={[rotationX, rotationY, 0]}
    >
      {/* Center component guarantees 3D text is centered on origin */}
      <Center>
        <Text3D
          font={fontUrl}
          size={1.5}
          height={height}
          curveSegments={16}
          bevelEnabled={bevelEnabled}
          bevelThickness={bevelThickness}
          bevelSize={bevelSize}
          bevelOffset={0}
          bevelSegments={5}
        >
          {text}
          <meshStandardMaterial
            color={color}
            metalness={0.45}
            roughness={0.2}
          />
        </Text3D>
      </Center>
    </group>
  );
};

/**
 * Main Dynamic3DText Remotion Component
 * Establishes WebGL canvas, camera positioning, and cinematic 3-point lighting setup.
 */
export const Dynamic3DText: React.FC<Dynamic3DTextProps> = (props) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B1021",
      }}
    >
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 0, 8], fov: 45 }}
      >
        {/* 1. Base Ambient Light for uniform shadow visibility */}
        <ambientLight intensity={0.6} />

        {/* 2. Primary Directional Light casting key highlights across bevel edges */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.8}
          color="#ffffff"
        />

        {/* 3. Cyan Rim / Fill Light for high-tech aesthetic */}
        <pointLight position={[-6, -4, 4]} intensity={2.5} color="#06B6D4" />

        {/* 4. Purple Accent Rim Light */}
        <pointLight position={[6, 4, 3]} intensity={2.0} color="#A855F7" />

        {/* 5. Render 3D Text Mesh */}
        <TextScene {...props} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
