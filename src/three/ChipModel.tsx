import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ChipModelProps {
  explodeProgress?: number; // 0 (assembled) to 1 (fully exploded)
  interactive?: boolean;
}

export default function ChipModel({
  explodeProgress = 0,
  interactive = true,
}: ChipModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const tracesRef = useRef<THREE.LineSegments>(null);
  const glowRingRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Generate procedural pins around the perimeter (square chip)
  const pins = useMemo(() => {
    const list: [number, number, number, number][] = []; // x, y, z, rotationY
    const countPerSide = 14;
    const size = 3.6;
    const step = size / countPerSide;

    for (let i = 0; i < countPerSide; i++) {
      const offset = -size / 2 + (i + 0.5) * step;
      // Top side
      list.push([offset, 0, -size / 2 - 0.22, 0]);
      // Bottom side
      list.push([offset, 0, size / 2 + 0.22, Math.PI]);
      // Left side
      list.push([-size / 2 - 0.22, 0, offset, Math.PI / 2]);
      // Right side
      list.push([size / 2 + 0.22, 0, offset, -Math.PI / 2]);
    }
    return list;
  }, []);

  // Generate procedural circuit traces
  const traceGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const rnd = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Concentric geometric circuit pathways
    for (let ring = 0; ring < 6; ring++) {
      const r = 0.8 + ring * 0.38;
      const segments = 16;
      for (let s = 0; s < segments; s++) {
        const theta1 = (s / segments) * Math.PI * 2;
        const theta2 = ((s + 0.7) / segments) * Math.PI * 2;
        points.push(
          new THREE.Vector3(Math.cos(theta1) * r, 0.05, Math.sin(theta1) * r),
          new THREE.Vector3(Math.cos(theta2) * r, 0.05, Math.sin(theta2) * r)
        );
      }
    }

    // Radial bus lines extending outward
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const inner = 0.9;
      const outer = 1.7 + rnd(i * 3.7) * 0.4;
      const x1 = Math.cos(angle) * inner;
      const z1 = Math.sin(angle) * inner;
      const x2 = Math.cos(angle) * outer;
      const z2 = Math.sin(angle) * outer;
      points.push(
        new THREE.Vector3(x1, 0.05, z1),
        new THREE.Vector3(x2, 0.05, z2)
      );

      // 45-degree angle jogs (typical PCB trace routing)
      const jogAngle = angle + 0.2;
      points.push(
        new THREE.Vector3(x2, 0.05, z2),
        new THREE.Vector3(Math.cos(jogAngle) * (outer + 0.3), 0.05, Math.sin(jogAngle) * (outer + 0.3))
      );
    }

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, []);

  // Waryex "W" logo geometry vertices
  const wLogoGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [
      new THREE.Vector3(-0.65, 0.12, -0.45),
      new THREE.Vector3(-0.35, 0.12, 0.45),
      new THREE.Vector3(-0.35, 0.12, 0.45),
      new THREE.Vector3(0, 0.12, -0.1),
      new THREE.Vector3(0, 0.12, -0.1),
      new THREE.Vector3(0.35, 0.12, 0.45),
      new THREE.Vector3(0.35, 0.12, 0.45),
      new THREE.Vector3(0.65, 0.12, -0.45),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      // Smooth idle floating and slow rotation
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.12;
      const baseRotY = t * 0.15;

      if (interactive) {
        // Smooth tilt damping towards mouse
        mouseRef.current.x += (pointer.x * 0.4 - mouseRef.current.x) * 0.05;
        mouseRef.current.y += (pointer.y * 0.4 - mouseRef.current.y) * 0.05;
        groupRef.current.rotation.x = 0.45 - mouseRef.current.y;
        groupRef.current.rotation.y = baseRotY + mouseRef.current.x;
        groupRef.current.rotation.z = -mouseRef.current.x * 0.3;
      } else {
        groupRef.current.rotation.x = 0.4;
        groupRef.current.rotation.y = baseRotY;
      }
    }

    // Pulse effects on glow ring and traces
    if (glowRingRef.current) {
      const scale = 1 + Math.sin(t * 3.5) * 0.05;
      glowRingRef.current.scale.set(scale, scale, 1);
    }
  });

  // Calculate layer explosion offsets
  const explode = explodeProgress;
  const pinOffsetY = -0.4 * explode;
  const substrateOffsetY = 0;
  const traceOffsetY = 0.35 * explode;
  const dieOffsetY = 0.7 * explode;
  const lidOffsetY = 1.1 * explode;

  return (
    <group ref={groupRef} dispose={null}>
      {/* ── LAYER 1: PINS (around edge) ── */}
      <group position={[0, pinOffsetY, 0]}>
        {pins.map(([x, y, z, rot], idx) => (
          <mesh key={idx} position={[x, y, z]} rotation={[0, rot, 0]}>
            <boxGeometry args={[0.08, 0.04, 0.28]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.95}
              roughness={0.15}
              emissive="#c4b5fd"
              emissiveIntensity={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* ── LAYER 2: DARK METALLIC SUBSTRATE / PCB BASE ── */}
      <group position={[0, substrateOffsetY, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[3.8, 0.16, 3.8]} />
          <meshStandardMaterial
            color="#0b0817"
            roughness={0.35}
            metalness={0.85}
          />
        </mesh>
        {/* Substrate Chamfered Rim Glow */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.84, 0.04, 3.84]} />
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      </group>

      {/* ── LAYER 3: GLOWING TRACE LAYER ── */}
      <group position={[0, traceOffsetY, 0]}>
        <primitive object={tracesRef.current || new THREE.LineSegments(traceGeometry, new THREE.LineBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.85 }))} />

        {/* Trace Accent Pads (White & Purple flashing) */}
        {[-1.2, -0.6, 0.6, 1.2].map((px, xi) =>
          [-1.2, -0.6, 0.6, 1.2].map((pz, zi) => (
            <mesh key={`${xi}-${zi}`} position={[px, 0.06, pz]}>
              <boxGeometry args={[0.12, 0.02, 0.12]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#a855f7"
                emissiveIntensity={1.8}
              />
            </mesh>
          ))
        )}
      </group>

      {/* ── LAYER 4: SILICON DIE / CORE ── */}
      <group position={[0, dieOffsetY, 0]}>
        <mesh ref={coreRef} position={[0, 0.1, 0]}>
          <boxGeometry args={[2.0, 0.1, 2.0]} />
          <meshStandardMaterial
            color="#140b2e"
            roughness={0.15}
            metalness={0.9}
            emissive="#4c1d95"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* ── LAYER 5: INTEGRATED HEAT SPREADER / TOP LID ── */}
      <group position={[0, lidOffsetY, 0]}>
        {/* Polished Titanium / Dark Metallic Cap */}
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[1.7, 0.06, 1.7]} />
          <meshStandardMaterial
            color="#1a1138"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Glowing Central Aperture / Emblem Backing */}
        <mesh
          ref={glowRingRef}
          position={[0, 0.175, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.55, 0.65, 32]} />
          <meshBasicMaterial
            color="#c4b5fd"
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Outer Ring */}
        <mesh position={[0, 0.175, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.72, 0.76, 32]} />
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Laser-etched glowing "W" Mark */}
        <lineSegments geometry={wLogoGeometry}>
          <lineBasicMaterial
            color="#ffffff"
            linewidth={3}
            transparent
            opacity={1.0}
          />
        </lineSegments>

        {/* Micro-label indicator dots */}
        <mesh position={[0.6, 0.18, 0.6]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}
