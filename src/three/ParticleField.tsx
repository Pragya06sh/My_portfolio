import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Particle field: ~2000 purple/white points that drift and react to the mouse.
 */
export default function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const count = 2000;

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 30;
      pos[i3 + 1] = (Math.random() - 0.5) * 20;
      pos[i3 + 2] = (Math.random() - 0.5) * 15;

      // Purple or white
      if (Math.random() > 0.7) {
        col[i3] = 1;
        col[i3 + 1] = 1;
        col[i3 + 2] = 1;
      } else {
        col[i3] = 0.545;
        col[i3 + 1] = 0.361;
        col[i3 + 2] = 0.965;
      }

      siz[i] = Math.random() * 2 + 0.5;
    }

    return [pos, col, siz];
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position;
    const time = clock.elapsedTime * 0.1;

    mouseRef.current.x += (pointer.x * 2 - mouseRef.current.x) * 0.02;
    mouseRef.current.y += (pointer.y * 2 - mouseRef.current.y) * 0.02;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      posAttr.setXYZ(
        i,
        x + Math.sin(time + y * 0.5) * 0.3 + mouseRef.current.x * 0.1,
        y + Math.cos(time + x * 0.5) * 0.2 + mouseRef.current.y * 0.1,
        z + Math.sin(time + x * y * 0.01) * 0.2
      );
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
