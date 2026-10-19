import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import ParticleField from "./ParticleField";
import ChipModel from "./ChipModel";

interface SceneProps {
  scrollProgress?: number;
  activeSection?: string;
}

export default function Scene({ scrollProgress = 0 }: SceneProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  if (tabHidden) return null;

  // Calculate chip explosion and position based on scrollProgress
  // Hero is at scroll 0 - 0.2. Explodes as you scroll into Waryex
  const chipExplode = Math.min(Math.max((scrollProgress - 0.05) * 5, 0), 1);
  const chipOpacity = Math.max(1 - scrollProgress * 3.5, 0);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <Canvas
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        dpr={isMobile ? 1 : [1, 2]}
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        style={{ pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.8}
            color="#ffffff"
          />
          <directionalLight
            position={[-5, -4, -2]}
            intensity={2.2}
            color="#8b5cf6"
          />
          <pointLight
            position={[0, 0, 2]}
            intensity={1.5}
            color="#c4b5fd"
            distance={8}
          />

          {/* Background Ambient Particle Field */}
          <ParticleField />

          {/* Floating Hero Security Chip */}
          {chipOpacity > 0.02 && (
            <group
              position={[isMobile ? 0 : 2.2, isMobile ? -1.2 : 0, 0]}
              scale={isMobile ? 0.7 : 0.95}
            >
              <ChipModel explodeProgress={chipExplode} interactive={!isMobile} />
            </group>
          )}

          {/* Post-processing effects (disabled on low-end/mobile for 60fps) */}
          {!isMobile && (
            <EffectComposer multisampling={0}>
              <Bloom
                intensity={1.2}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
              <ChromaticAberration
                offset={new THREE.Vector2(0.0012, 0.0012)}
                radialModulation={false}
                modulationOffset={0.15}
              />
              <Vignette eskil={false} offset={0.1} darkness={0.8} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
