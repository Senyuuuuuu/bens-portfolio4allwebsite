import React, { useRef } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── App icon definitions ───────────────────────────────────────────────────
const APP_ICONS = [
  { label: "IG",  color: "#E1306C", emoji: "📸", orbitRadius: 220, orbitSpeed: 0.012, startAngle: 0,           yOffset: 30  },
  { label: "SP",  color: "#1DB954", emoji: "🎵", orbitRadius: 260, orbitSpeed: 0.009, startAngle: Math.PI * 0.4, yOffset: -20 },
  { label: "WA",  color: "#25D366", emoji: "💬", orbitRadius: 200, orbitSpeed: 0.014, startAngle: Math.PI * 0.8, yOffset: 50  },
  { label: "MM",  color: "#F6851B", emoji: "🦊", orbitRadius: 240, orbitSpeed: 0.010, startAngle: Math.PI * 1.2, yOffset: -40 },
  { label: "CB",  color: "#0052FF", emoji: "🔵", orbitRadius: 220, orbitSpeed: 0.011, startAngle: Math.PI * 1.6, yOffset: 20  },
  { label: "BN",  color: "#F0B90B", emoji: "🟡", orbitRadius: 260, orbitSpeed: 0.008, startAngle: Math.PI * 1.9, yOffset: -55 },
  { label: "YT",  color: "#FF0000", emoji: "▶️", orbitRadius: 200, orbitSpeed: 0.013, startAngle: Math.PI * 0.2, yOffset: 60  },
  { label: "LI",  color: "#0A66C2", emoji: "💼", orbitRadius: 240, orbitSpeed: 0.009, startAngle: Math.PI * 0.6, yOffset: -30 },
  { label: "GD",  color: "#4285F4", emoji: "📂", orbitRadius: 215, orbitSpeed: 0.012, startAngle: Math.PI * 1.0, yOffset: 45  },
];

// ─── Central Avatar (cylinder body + sphere head) ────────────────────────────
const CentralAvatar: React.FC<{ scale: number }> = ({ scale }) => {
  return (
    <group scale={[scale, scale, scale]}>
      {/* Body: cylinder */}
      <mesh position={[0, -18, 0]}>
        <cylinderGeometry args={[22, 28, 60, 32]} />
        <meshStandardMaterial
          color="#9F7AEA"
          roughness={0.25}
          metalness={0.1}
          emissive="#7C3AED"
          emissiveIntensity={0.08}
        />
      </mesh>
      {/* Head: sphere */}
      <mesh position={[0, 32, 0]}>
        <sphereGeometry args={[26, 32, 32]} />
        <meshStandardMaterial
          color="#B794F4"
          roughness={0.2}
          metalness={0.12}
          emissive="#9F7AEA"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Soft glow ring */}
      <mesh position={[0, -48, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[40, 3, 16, 64]} />
        <meshStandardMaterial
          color="#C4B5FD"
          roughness={0.3}
          metalness={0.05}
          transparent
          opacity={0.45}
          emissive="#A78BFA"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
};

// ─── Single Orbiting Icon ─────────────────────────────────────────────────────
const OrbitingIcon: React.FC<{
  color: string;
  label: string;
  orbitRadius: number;
  orbitSpeed: number;
  startAngle: number;
  yOffset: number;
  frame: number;
  blurFactor: number;
}> = ({ color, label, orbitRadius, orbitSpeed, startAngle, yOffset, frame, blurFactor }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const angle = startAngle + frame * orbitSpeed;
  const x = Math.cos(angle) * orbitRadius;
  const z = Math.sin(angle) * orbitRadius;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = angle * 0.3;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[x, yOffset * 0.5, z]}
    >
      <boxGeometry args={[38, 38, 6]} />
      <meshStandardMaterial
        color={color}
        roughness={0.15}
        metalness={0.25}
        transparent
        opacity={blurFactor > 0.5 ? 0.6 : 0.9}
        emissive={color}
        emissiveIntensity={0.05}
      />
    </mesh>
  );
};

// ─── Icon label overlay (HTML) ────────────────────────────────────────────────
const IconLabel: React.FC<{
  icon: (typeof APP_ICONS)[0];
  frame: number;
  totalFade: number;
}> = ({ icon, frame, totalFade }) => {
  const angle = icon.startAngle + frame * icon.orbitSpeed;
  const x = Math.cos(angle) * icon.orbitRadius;
  const z = Math.sin(angle) * icon.orbitRadius;

  // Project 3D to 2D screen (approx, canvas is 1920x1080)
  const fov = 60;
  const cameraZ = Math.max(350 - frame * 0.5, 200);
  const perspective = cameraZ / (cameraZ + z);
  const screenX = 960 + x * perspective * (1080 / (2 * Math.tan((fov * Math.PI) / 360)));
  const screenY = 540 - (icon.yOffset * 0.5 * perspective * (1080 / (2 * Math.tan((fov * Math.PI) / 360))));

  // Blur based on z-depth
  const blurAmount = z > 50 ? Math.min((z - 50) / 100 * 4, 6) : z < -50 ? Math.min((-z - 50) / 100 * 4, 6) : 0;
  const zScale = Math.max(0.5, Math.min(1.2, perspective));

  return (
    <div
      style={{
        position: "absolute",
        left: screenX - 28,
        top: screenY - 28,
        width: 56,
        height: 56,
        borderRadius: 14,
        background: `${icon.color}22`,
        backdropFilter: "blur(10px)",
        border: `1.5px solid ${icon.color}55`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        filter: `blur(${blurAmount}px)`,
        transform: `scale(${zScale})`,
        opacity: totalFade * (z < -100 ? 0.5 : 1),
        boxShadow: `0 4px 20px ${icon.color}33, inset 0 1px 0 ${icon.color}44`,
        fontFamily: "'Inter', 'Roboto', sans-serif",
        pointerEvents: "none",
      }}
    >
      <span style={{ fontSize: 20, lineHeight: 1 }}>{icon.emoji}</span>
      <span style={{ fontSize: 9, fontWeight: 700, color: icon.color, marginTop: 2, letterSpacing: "0.04em" }}>
        {icon.label}
      </span>
    </div>
  );
};

// ─── Three.js Scene content ────────────────────────────────────────────────────
const EcosystemScene: React.FC<{ frame: number; avatarScale: number }> = ({ frame, avatarScale }) => {
  const orbitGroupRef = useRef<THREE.Group>(null);
  const orbitAngle = frame * 0.008;

  useFrame(() => {
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y = orbitAngle;
    }
  });

  return (
    <>
      {/* Lighting */} <ambientLight intensity={0.6} />
      <directionalLight position={[-5, 5, 5]} intensity={0.8} color="#ffffff" castShadow />
      <directionalLight position={[3, -2, -3]} intensity={0.2} color="#B794F4" />
      <pointLight position={[0, 100, 0]} intensity={0.3} color="#8ECAFF" />

      {/* Central Avatar */}
      <CentralAvatar scale={avatarScale} />

      {/* Orbiting icons (3D meshes) */}
      <group ref={orbitGroupRef}>
        {APP_ICONS.map((icon) => {
          const angle = icon.startAngle;
          const iz = Math.sin(angle) * icon.orbitRadius * 0.6;
          const blurFactor = Math.abs(iz) > 50 ? 0.6 : 0.9;
          return (
            <OrbitingIcon
              key={icon.label}
              {...icon}
              orbitRadius={icon.orbitRadius * 0.6}
              frame={0}
              blurFactor={blurFactor}
            />
          );
        })}
      </group>
    </>
  );
};

// ─── Main Export ───────────────────────────────────────────────────────────────
export const BlueAlphaEcosystem: React.FC = () => {
  const frame = useCurrentFrame();
  const { } = useVideoConfig();

  // Scene fade in
  const sceneOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Scene fade out (last 20 frames)
  const sceneOut = interpolate(frame, [130, 150], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const totalFade = sceneOpacity * sceneOut;

  // Avatar scale: springs into view at scene start
  const avatarScale = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });

  // Camera Z push: 350 → 250 (slow push in)
  const cameraZ = interpolate(frame, [0, 150], [350, 250], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div style={{ width: 1920, height: 1080, position: "relative", overflow: "hidden", opacity: totalFade }}>
      {/* Background: soft purple radial gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 45%, #F0EFFF 0%, #E4E2F4 100%)",
        }}
      />

      {/* Three.js canvas */}
      <ThreeCanvas
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <perspectiveCamera position={[0, 60, cameraZ]} fov={60} near={1} far={2000} />
        <EcosystemScene frame={frame} avatarScale={avatarScale} />
      </ThreeCanvas>

      {/* HTML overlay: icon labels with depth simulation */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {APP_ICONS.map((icon) => (
          <IconLabel key={icon.label} icon={icon} frame={frame} totalFade={totalFade} />
        ))}
      </div>

      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(228,226,244,0.6) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
