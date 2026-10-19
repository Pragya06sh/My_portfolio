import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ThreatSphere({ radius = 2 }: { radius?: number }) {
  const outerSphereRef = useRef<THREE.Mesh>(null);
  const innerSphereRef = useRef<THREE.Mesh>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate orbiting particles around threat sphere
  const particleCount = 180;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const r = radius * (1.25 + Math.random() * 0.7);

      pos[i * 3] = r * Math.cos(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi);
      pos[i * 3 + 2] = r * Math.cos(phi) * Math.sin(theta);

      // Mix of purple and white
      if (Math.random() > 0.6) {
        cols[i * 3] = 1;
        cols[i * 3 + 1] = 1;
        cols[i * 3 + 2] = 1;
      } else {
        cols[i * 3] = 0.65;
        cols[i * 3 + 1] = 0.35;
        cols[i * 3 + 2] = 0.98;
      }
    }
    return [pos, cols];
  }, [radius]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (outerSphereRef.current) {
      outerSphereRef.current.rotation.x = t * 0.18;
      outerSphereRef.current.rotation.y = t * 0.25;
    }

    if (innerSphereRef.current) {
      innerSphereRef.current.rotation.x = -t * 0.15;
      innerSphereRef.current.rotation.z = t * 0.2;
      const pulse = 1 + Math.sin(t * 3) * 0.04;
      innerSphereRef.current.scale.set(pulse, pulse, pulse);
    }

    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y = -t * 0.35;
      orbitGroupRef.current.rotation.z = Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <group>
      {/* Outer Wireframe Icosahedron */}
      <mesh ref={outerSphereRef}>
        <icosahedronGeometry args={[radius, 1]} />
        <meshBasicMaterial
          color="#8b5cf6"
          wireframe
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Inner Threat Core Sphere */}
      <mesh ref={innerSphereRef}>
        <icosahedronGeometry args={[radius * 0.72, 2]} />
        <meshStandardMaterial
          color="#1b0836"
          emissive="#7c3aed"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
          wireframe
        />
      </mesh>

      {/* Core Glowing Dot */}
      <mesh>
        <sphereGeometry args={[radius * 0.25, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Orbiting Ring Particles */}
      <group ref={orbitGroupRef}>
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[colors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.06}
            vertexColors
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* Threat Orbit Rings */}
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[radius * 1.45, 0.015, 16, 64]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>
    </group>
  );
}
