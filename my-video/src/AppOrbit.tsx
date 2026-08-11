import React, { useRef } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── App Icon Data ─────────────────────────────────────────────────────────────
const APP_ICONS = [
  { label: "IG",  color: "#E1306C", emoji: "📸", orbitRadius: 210, orbitSpeed: 0.012, startAngle: 0,           yBase: 25 },
  { label: "SP",  color: "#1DB954", emoji: "🎵", orbitRadius: 250, orbitSpeed: 0.009, startAngle: Math.PI * 0.4, yBase: -15 },
  { label: "WA",  color: "#25D366", emoji: "💬", orbitRadius: 190, orbitSpeed: 0.014, startAngle: Math.PI * 0.8, yBase: 40 },
  { label: "MM",  color: "#F6851B", emoji: "🦊", orbitRadius: 230, orbitSpeed: 0.010, startAngle: Math.PI * 1.2, yBase: -35 },
  { label: "CB",  color: "#0052FF", emoji: "🔵", orbitRadius: 210, orbitSpeed: 0.011, startAngle: Math.PI * 1.6, yBase: 15 },
  { label: "BN",  color: "#F0B90B", emoji: "🟡", orbitRadius: 250, orbitSpeed: 0.008, startAngle: Math.PI * 1.9, yBase: -45 },
  { label: "YT",  color: "#FF0000", emoji: "▶️", orbitRadius: 195, orbitSpeed: 0.013, startAngle: Math.PI * 0.2, yBase: 50 },
  { label: "LI",  color: "#0A66C2", emoji: "💼", orbitRadius: 235, orbitSpeed: 0.009, startAngle: Math.PI * 0.6, yBase: -25 },
  { label: "GD",  color: "#4285F4", emoji: "📂", orbitRadius: 205, orbitSpeed: 0.012, startAngle: Math.PI * 1.0, yBase: 35 },
];

// ─── Central Avatar ────────────────────────────────────────────────────────────
const Avatar3D: React.FC<{ scale: number }> = ({ scale }) => {
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
      {/* Glow Torus */}
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

// ─── 3D Orbiting Mesh ──────────────────────────────────────────────────────────
const OrbitMesh: React.FC<{
  color: string;
  orbitRadius: number;
  startAngle: number;
  yBase: number;
  frame: number;
  idx: number;
}> = ({ color, orbitRadius, startAngle, yBase, frame, idx }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const angle = startAngle + frame * 0.01;
  const bobY = Math.sin((frame + idx * 12) / 10) * 8;
  const x = Math.cos(angle) * orbitRadius;
  const z = Math.sin(angle) * orbitRadius;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = angle * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[x, (yBase + bobY) * 0.5, z]}>
      <boxGeometry args={[36, 36, 6]} />
      <meshStandardMaterial
        color={color}
        roughness={0.15}
        metalness={0.25}
        transparent
        opacity={0.85}
        emissive={color}
        emissiveIntensity={0.06}
      />
    </mesh>
  );
};

// ─── HTML Overlay Label ────────────────────────────────────────────────────────
const IconCardHTML: React.FC<{
  icon: (typeof APP_ICONS)[0];
  idx: number;
  frame: number;
  totalFade: number;
}> = ({ icon, idx, frame, totalFade }) => {
  const angle = icon.startAngle + frame * icon.orbitSpeed;
  const bobY = Math.sin((frame + idx * 12) / 10) * 8;
  const x = Math.cos(angle) * icon.orbitRadius;
  const z = Math.sin(angle) * icon.orbitRadius;

  const fov = 60;
  const cameraZ = Math.max(350 - frame * 0.5, 250);
  const perspective = cameraZ / (cameraZ + z);
  const screenX = 960 + x * perspective * (1080 / (2 * Math.tan((fov * Math.PI) / 360)));
  const screenY = 540 - ((icon.yBase + bobY) * 0.5 * perspective * (1080 / (2 * Math.tan((fov * Math.PI) / 360))));

  const blurAmount = z > 50 ? Math.min((z - 50) / 100 * 4, 6) : z < -50 ? Math.min((-z - 50) / 100 * 4, 6) : 0;
  const zScale = Math.max(0.55, Math.min(1.2, perspective));

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
        opacity: totalFade * (z < -110 ? 0.45 : 1),
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

// ─── Three.js Scene ─────────────────────────────────────────────────────────────
const ThreeScene: React.FC<{ frame: number; avatarScale: number }> = ({ frame, avatarScale }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = frame * 0.008;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[-5, 5, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[3, -2, -3]} intensity={0.2} color="#B794F4" />
      <pointLight position={[0, 100, 0]} intensity={0.3} color="#8ECAFF" />

      <Avatar3D scale={avatarScale} />

      <group ref={groupRef}>
        {APP_ICONS.map((icon, idx) => (
          <OrbitMesh
            key={icon.label}
            {...icon}
            orbitRadius={icon.orbitRadius * 0.6}
            frame={frame}
            idx={idx}
          />
        ))}
      </group>
    </>
  );
};

// ─── Main Export: <AppOrbit/> ───────────────────────────────────────────────────
export const AppOrbit: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene fade in / out
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const fadeOut = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });
  const totalFade = fadeIn * fadeOut;

  // Avatar spring scale entry
  const avatarScale = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });

  // Camera Z push: 350 → 250 with continuous subtle handheld drift
  const cameraZ = interpolate(frame, [0, 150], [350, 250], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const driftX = Math.sin(frame * 0.03) * 6;
  const driftY = Math.cos(frame * 0.025) * 4;

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

      {/* Three.js Canvas */}
      <ThreeCanvas
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <perspectiveCamera position={[driftX, 60 + driftY, cameraZ]} fov={60} near={1} far={2000} />
        <ThreeScene frame={frame} avatarScale={avatarScale} />
      </ThreeCanvas>

      {/* HTML overlay labels with continuous vertical bob */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {APP_ICONS.map((icon, idx) => (
          <IconCardHTML key={icon.label} icon={icon} idx={idx} frame={frame} totalFade={totalFade} />
        ))}
      </div>
    </div>
  );
};
