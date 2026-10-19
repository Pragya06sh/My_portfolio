import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function BlockChain({ count = 5 }: { count?: number }) {
  const chainRef = useRef<THREE.Group>(null);
  const blocksRef = useRef<THREE.Group[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (chainRef.current) {
      chainRef.current.rotation.y = t * 0.25;
      chainRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }

    blocksRef.current.forEach((block, idx) => {
      if (block) {
        block.rotation.x = t * 0.4 + idx * 0.5;
        block.rotation.z = Math.sin(t * 0.8 + idx) * 0.2;
      }
    });
  });

  const spacing = 1.35;
  const startX = -((count - 1) * spacing) / 2;

  return (
    <group ref={chainRef}>
      {Array.from({ length: count }).map((_, i) => {
        const xPos = startX + i * spacing;
        const yPos = Math.sin((i / count) * Math.PI) * 0.4;

        return (
          <group key={i} position={[xPos, yPos, 0]}>
            {/* Block Group */}
            <group
              ref={(el) => {
                if (el) blocksRef.current[i] = el;
              }}
            >
              {/* Outer Glassmorphic/Metallic Cube */}
              <mesh>
                <boxGeometry args={[0.7, 0.7, 0.7]} />
                <meshStandardMaterial
                  color="#150a2b"
                  roughness={0.2}
                  metalness={0.8}
                  transparent
                  opacity={0.85}
                />
              </mesh>

              {/* Wireframe Edge Cage */}
              <mesh>
                <boxGeometry args={[0.72, 0.72, 0.72]} />
                <meshBasicMaterial
                  color="#a855f7"
                  wireframe
                  transparent
                  opacity={0.7}
                />
              </mesh>

              {/* Inner Glowing Transaction Hash Core */}
              <mesh>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#c4b5fd"
                  emissiveIntensity={2}
                />
              </mesh>
            </group>

            {/* Connecting Chain Link / Hash Pointer to Next Block */}
            {i < count - 1 && (
              <group position={[spacing / 2, 0, 0]}>
                {/* Laser hash connection beam */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.03, 0.03, spacing - 0.7, 8]} />
                  <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.9}
                  />
                </mesh>
                {/* Outer Glow Tube */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.07, 0.07, spacing - 0.7, 8]} />
                  <meshBasicMaterial
                    color="#8b5cf6"
                    transparent
                    opacity={0.4}
                  />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
