import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ShieldProps {
  assemblyProgress?: number; // 0 (fragmented) to 1 (fully assembled)
}

export default function Shield({ assemblyProgress = 1 }: ShieldProps) {
  const shieldGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Generate geometric shield plates / fragments
  const fragments = useMemo(() => {
    const list: {
      basePos: THREE.Vector3;
      scatterDir: THREE.Vector3;
      scale: [number, number, number];
      rot: [number, number, number];
    }[] = [];

    // Construct a heraldic cyber shield layout
    // Center column
    list.push({
      basePos: new THREE.Vector3(0, 0.6, 0),
      scatterDir: new THREE.Vector3(0, 3, 2),
      scale: [0.7, 0.7, 0.1],
      rot: [0, 0, 0],
    });
    list.push({
      basePos: new THREE.Vector3(0, -0.1, 0),
      scatterDir: new THREE.Vector3(0, -2.5, 3),
      scale: [0.7, 0.7, 0.1],
      rot: [0, 0, 0],
    });
    list.push({
      basePos: new THREE.Vector3(0, -0.85, 0),
      scatterDir: new THREE.Vector3(0, -4, 2),
      scale: [0.5, 0.6, 0.1],
      rot: [0, 0, Math.PI / 4],
    });

    // Left flank
    list.push({
      basePos: new THREE.Vector3(-0.7, 0.6, 0),
      scatterDir: new THREE.Vector3(-3.5, 2, 2.5),
      scale: [0.65, 0.7, 0.1],
      rot: [0, 0, -0.15],
    });
    list.push({
      basePos: new THREE.Vector3(-0.65, -0.1, 0),
      scatterDir: new THREE.Vector3(-3, -1.5, 2.5),
      scale: [0.6, 0.65, 0.1],
      rot: [0, 0, -0.2],
    });

    // Right flank
    list.push({
      basePos: new THREE.Vector3(0.7, 0.6, 0),
      scatterDir: new THREE.Vector3(3.5, 2, 2.5),
      scale: [0.65, 0.7, 0.1],
      rot: [0, 0, 0.15],
    });
    list.push({
      basePos: new THREE.Vector3(0.65, -0.1, 0),
      scatterDir: new THREE.Vector3(3, -1.5, 2.5),
      scale: [0.6, 0.65, 0.1],
      rot: [0, 0, 0.2],
    });

    return list;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (shieldGroupRef.current) {
      shieldGroupRef.current.position.y = Math.sin(t * 1.5) * 0.08;
      shieldGroupRef.current.rotation.y = Math.sin(t * 0.8) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.4;
    }
  });

  // Inverse assembly: 0 = exploded, 1 = locked together
  const scatterFactor = 1 - Math.min(Math.max(assemblyProgress, 0), 1);

  return (
    <group ref={shieldGroupRef}>
      {/* Outer Holographic Energy Ring */}
      <mesh ref={ringRef} position={[0, 0, -0.1]}>
        <ringGeometry args={[1.6, 1.64, 48]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.6 * assemblyProgress}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Geometric Shield Fragment Plates */}
      {fragments.map((frag, i) => {
        const curX = frag.basePos.x + frag.scatterDir.x * scatterFactor;
        const curY = frag.basePos.y + frag.scatterDir.y * scatterFactor;
        const curZ = frag.basePos.z + frag.scatterDir.z * scatterFactor;

        return (
          <group
            key={i}
            position={[curX, curY, curZ]}
            rotation={[
              frag.rot[0] + scatterFactor * 1.2,
              frag.rot[1] + scatterFactor * 1.5,
              frag.rot[2],
            ]}
          >
            {/* Metallic Facet */}
            <mesh>
              <boxGeometry args={frag.scale} />
              <meshStandardMaterial
                color="#160c30"
                metalness={0.9}
                roughness={0.2}
                emissive="#7c3aed"
                emissiveIntensity={0.25}
              />
            </mesh>
            {/* Wireframe Border */}
            <mesh>
              <boxGeometry
                args={[
                  frag.scale[0] * 1.02,
                  frag.scale[1] * 1.02,
                  frag.scale[2] * 1.02,
                ]}
              />
              <meshBasicMaterial
                color="#c4b5fd"
                wireframe
                transparent
                opacity={0.8}
              />
            </mesh>
          </group>
        );
      })}

      {/* Central Cyber Lock Core */}
      <mesh position={[0, 0, 0.1]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#a855f7"
          emissiveIntensity={2.5}
        />
      </mesh>
    </group>
  );
}
