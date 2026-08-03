'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * 3D WebGL Canvas Hero — AI Content Factory
 * Pure WebGL (no Three.js dependency) — particle field + neural network visualization
 * Uses the 3d-web-experience skill patterns: WebGL fallback, performance targets, mobile detection
 */

interface Particle {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  life: number; maxLife: number;
  r: number; g: number; b: number;
  size: number;
}

const VERT_SHADER = `
  attribute vec3 aPosition;
  attribute vec4 aColor;
  attribute float aSize;
  uniform mat4 uProjection;
  uniform mat4 uView;
  uniform float uTime;
  varying vec4 vColor;
  
  void main() {
    vColor = aColor;
    vec3 pos = aPosition;
    pos.y += sin(uTime * 0.5 + aPosition.x * 0.3) * 0.1;
    pos.x += cos(uTime * 0.3 + aPosition.z * 0.2) * 0.08;
    gl_Position = uProjection * uView * vec4(pos, 1.0);
    gl_PointSize = aSize * (1.0 / gl_Position.w) * 500.0;
  }
`;

const FRAG_SHADER = `
  precision mediump float;
  varying vec4 vColor;
  
  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    gl_FragColor = vec4(vColor.rgb, vColor.a * alpha);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vert: string, frag: string): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vert);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

function makeProjection(fov: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1.0 / Math.tan((fov * Math.PI) / 360);
  const rangeInv = 1.0 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0,
  ]);
}

function makeView(eyeZ: number): Float32Array {
  const mat = new Float32Array(16);
  mat[0] = 1; mat[5] = 1; mat[10] = 1; mat[15] = 1;
  mat[14] = -eyeZ;
  return mat;
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [loading, setLoading] = useState(true);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
    if (!gl) { setWebGLSupported(false); setLoading(false); return; }

    const prog = createProgram(gl, VERT_SHADER, FRAG_SHADER);
    if (!prog) { setWebGLSupported(false); setLoading(false); return; }

    setLoading(false);
    gl.useProgram(prog);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.clearColor(0, 0, 0, 0);

    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
    const PARTICLE_COUNT = isMobile ? 300 : 800;
    const EDGE_COUNT = isMobile ? 100 : 300;

    // Generate particles (neural network nodes)
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 4,
      z: (Math.random() - 0.5) * 4,
      vx: (Math.random() - 0.5) * 0.002,
      vy: (Math.random() - 0.5) * 0.002,
      vz: (Math.random() - 0.5) * 0.001,
      life: Math.random() * 100,
      maxLife: 80 + Math.random() * 40,
      r: Math.random() > 0.5 ? 0.0 : (Math.random() > 0.5 ? 0.54 : 0.0),
      g: Math.random() > 0.5 ? 0.83 : (Math.random() > 0.5 ? 0.36 : 1.0),
      b: Math.random() > 0.5 ? 1.0 : (Math.random() > 0.5 ? 0.96 : 0.53),
      size: 1.5 + Math.random() * 3,
    }));

    // Attribute locations
    const posLoc = gl.getAttribLocation(prog, 'aPosition');
    const colLoc = gl.getAttribLocation(prog, 'aColor');
    const sizeLoc = gl.getAttribLocation(prog, 'aSize');
    const projLoc = gl.getUniformLocation(prog, 'uProjection');
    const viewLoc = gl.getUniformLocation(prog, 'uView');
    const timeLoc = gl.getUniformLocation(prog, 'uTime');

    const posBuf = gl.createBuffer();
    const colBuf = gl.createBuffer();
    const sizeBuf = gl.createBuffer();

    let t = 0;
    let rot = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * (isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
      canvas.height = canvas.offsetHeight * (isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      t += 0.016;
      rot += 0.003;

      // Update particles
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.z += p.vz;
        p.life += 0.5;
        if (p.life > p.maxLife) {
          p.life = 0;
          p.x = (Math.random() - 0.5) * 6;
          p.y = (Math.random() - 0.5) * 4;
          p.z = (Math.random() - 0.5) * 4;
        }
        if (Math.abs(p.x) > 3) p.vx *= -1;
        if (Math.abs(p.y) > 2) p.vy *= -1;
        if (Math.abs(p.z) > 2) p.vz *= -1;
      });

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const aspect = canvas.width / canvas.height;
      gl.uniformMatrix4fv(projLoc, false, makeProjection(60, aspect, 0.1, 100));

      // Slow camera orbit
      const camX = Math.sin(rot) * 0.3;
      const camY = Math.cos(rot * 0.7) * 0.2;
      const view = makeView(4.5);
      view[12] = camX; view[13] = camY;
      gl.uniformMatrix4fv(viewLoc, false, view);
      gl.uniform1f(timeLoc, t);

      // Draw particles
      const pos = new Float32Array(particles.flatMap((p) => [p.x, p.y, p.z]));
      const alpha = particles.map((p) => {
        const lifeRatio = p.life / p.maxLife;
        return lifeRatio < 0.1 ? lifeRatio * 10 : lifeRatio > 0.9 ? (1 - lifeRatio) * 10 : 1;
      });
      const cols = new Float32Array(particles.flatMap((p, i) => [p.r, p.g, p.b, alpha[i] * 0.8]));
      const sizes = new Float32Array(particles.map((p) => p.size));

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
      gl.bufferData(gl.ARRAY_BUFFER, cols, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(colLoc);
      gl.vertexAttribPointer(colLoc, 4, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
      gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(sizeLoc);
      gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(prog);
    };
  }, []);

  if (!webGLSupported) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-violet-900/20 flex items-center justify-center">
        <div className="text-muted-foreground text-sm">WebGL not supported — upgrade your browser for the 3D experience</div>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease' }}
      />
    </>
  );
}
