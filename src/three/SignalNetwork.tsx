import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SignalNetworkProps {
  nodeCount?: number;
  highlightAnomaly?: boolean;
}

export default function SignalNetwork({
  nodeCount = 45,
  highlightAnomaly = true,
}: SignalNetworkProps) {
  const pointsRef = useRef<THREE.InstancedMesh>(null);
  const normalLinesRef = useRef<THREE.LineSegments>(null);
  const anomalyLinesRef = useRef<THREE.LineSegments>(null);

  // Generate node base positions and velocities
  const nodes = useMemo(() => {
    const list: {
      pos: THREE.Vector3;
      basePos: THREE.Vector3;
      speed: number;
      offset: number;
      isAnomaly: boolean;
    }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 7.5,
        (Math.random() - 0.5) * 5
      );
      const isAnomaly = i === 8 || i === 19 || i === 28;
      list.push({
        pos: pos.clone(),
        basePos: pos,
        speed: 0.3 + Math.random() * 0.4,
        offset: Math.random() * Math.PI * 2,
        isAnomaly,
      });
    }
    return list;
  }, [nodeCount]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-allocated line buffer arrays
  const maxNormalLines = 240;
  const normalPositions = useMemo(() => new Float32Array(maxNormalLines * 6), []);
  const maxAnomalyLines = 30;
  const anomalyPositions = useMemo(() => new Float32Array(maxAnomalyLines * 6), []);

  // Initialize geometries with pre-allocated buffer attributes
  useEffect(() => {
    if (normalLinesRef.current) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        "position",
        new THREE.BufferAttribute(normalPositions, 3)
      );
      normalLinesRef.current.geometry.dispose();
      normalLinesRef.current.geometry = geo;
    }
    if (anomalyLinesRef.current) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        "position",
        new THREE.BufferAttribute(anomalyPositions, 3)
      );
      anomalyLinesRef.current.geometry.dispose();
      anomalyLinesRef.current.geometry = geo;
    }
  }, [normalPositions, anomalyPositions]);

  // Frame loop
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // 1. Update node positions
    nodes.forEach((node, i) => {
      node.pos.x =
        node.basePos.x + Math.sin(time * node.speed + node.offset) * 0.35;
      node.pos.y =
        node.basePos.y + Math.cos(time * node.speed * 0.8 + node.offset) * 0.3;

      dummy.position.copy(node.pos);
      const scale = node.isAnomaly
        ? 0.15 + Math.sin(time * 4) * 0.03
        : 0.08;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      if (pointsRef.current) {
        pointsRef.current.setMatrixAt(i, dummy.matrix);
      }
    });

    if (pointsRef.current) {
      pointsRef.current.instanceMatrix.needsUpdate = true;
    }

    // 2. Populate dynamic line buffers
    let normalCount = 0;
    let anomalyCount = 0;
    const maxDist = 2.8;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = nodes[i].pos.distanceTo(nodes[j].pos);
        if (d < maxDist) {
          if (highlightAnomaly && nodes[i].isAnomaly && nodes[j].isAnomaly) {
            if (anomalyCount < maxAnomalyLines) {
              const idx = anomalyCount * 6;
              anomalyPositions[idx] = nodes[i].pos.x;
              anomalyPositions[idx + 1] = nodes[i].pos.y;
              anomalyPositions[idx + 2] = nodes[i].pos.z;
              anomalyPositions[idx + 3] = nodes[j].pos.x;
              anomalyPositions[idx + 4] = nodes[j].pos.y;
              anomalyPositions[idx + 5] = nodes[j].pos.z;
              anomalyCount++;
            }
          } else {
            if (normalCount < maxNormalLines) {
              const idx = normalCount * 6;
              normalPositions[idx] = nodes[i].pos.x;
              normalPositions[idx + 1] = nodes[i].pos.y;
              normalPositions[idx + 2] = nodes[i].pos.z;
              normalPositions[idx + 3] = nodes[j].pos.x;
              normalPositions[idx + 4] = nodes[j].pos.y;
              normalPositions[idx + 5] = nodes[j].pos.z;
              normalCount++;
            }
          }
        }
      }
    }

    // Always ensure at least one visible anomaly link
    if (highlightAnomaly && anomalyCount === 0 && nodes.length > 28) {
      const idx = 0;
      anomalyPositions[idx] = nodes[8].pos.x;
      anomalyPositions[idx + 1] = nodes[8].pos.y;
      anomalyPositions[idx + 2] = nodes[8].pos.z;
      anomalyPositions[idx + 3] = nodes[19].pos.x;
      anomalyPositions[idx + 4] = nodes[19].pos.y;
      anomalyPositions[idx + 5] = nodes[19].pos.z;
      anomalyCount = 1;
    }

    if (normalLinesRef.current) {
      const attr = normalLinesRef.current.geometry.attributes
        .position as THREE.BufferAttribute | undefined;
      if (attr) {
        attr.needsUpdate = true;
        normalLinesRef.current.geometry.setDrawRange(0, normalCount * 2);
      }
    }

    if (anomalyLinesRef.current) {
      const attr = anomalyLinesRef.current.geometry.attributes
        .position as THREE.BufferAttribute | undefined;
      if (attr) {
        attr.needsUpdate = true;
        anomalyLinesRef.current.geometry.setDrawRange(0, anomalyCount * 2);
      }
    }
  });

  return (
    <group>
      {/* Nodes instanced spheres */}
      <instancedMesh
        ref={pointsRef}
        args={[undefined, undefined, nodeCount]}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#a855f7"
          emissiveIntensity={2.5}
          roughness={0.2}
          metalness={0.8}
        />
      </instancedMesh>

      {/* Normal signal connection lines */}
      <lineSegments ref={normalLinesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.35}
        />
      </lineSegments>

      {/* Abnormal relationship detected lines (bright white pulsing) */}
      <lineSegments ref={anomalyLinesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.95}
        />
      </lineSegments>
    </group>
  );
}
