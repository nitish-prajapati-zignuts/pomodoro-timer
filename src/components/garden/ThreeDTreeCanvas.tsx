"use client";

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";
import { TimerMode } from "@/hooks/useTimer";

interface ThreeDTreeCanvasProps {
  focusCount: number;
  isRunning: boolean;
  mode: TimerMode;
  backgroundTheme?: string;
}

export interface ThreeDTreeCanvasHandle {
  triggerBurst: () => void;
}

// Civilization skin definitions
const CIVI_SKINS: Record<string, {
  trunkColor: number;
  foliage1: number;
  foliage2: number;
  blossomColor: number;
  groundColor: number;
  rimColor: number;
  rimEmissive: number;
  ambientColor: number;
  goldLightColor: number;
  emeraldLightColor: number;
  fogColor: number;
  particleGradient: [string, string, string];
  skyTop: string;
  skyBottom: string;
}> = {
  egypt: {
    trunkColor: 0x6b3d1a,
    foliage1: 0x2d8c4f,
    foliage2: 0x5cb87c,
    blossomColor: 0xffd166,
    groundColor: 0x3b2610,
    rimColor: 0xd4af37,
    rimEmissive: 0x553d08,
    ambientColor: 0x3b2e10,
    goldLightColor: 0xffd166,
    emeraldLightColor: 0xe8a020,
    fogColor: 0x100a05,
    particleGradient: ["rgba(255,235,150,1)", "rgba(212,175,55,0.8)", "rgba(180,100,10,0)"],
    skyTop: "#100a05",
    skyBottom: "#2b1a08",
  },
  greece: {
    trunkColor: 0x7d7060,
    foliage1: 0x607a50,
    foliage2: 0x8aaa70,
    blossomColor: 0xf0ead0,
    groundColor: 0xd0c8b8,
    rimColor: 0xe8e0d0,
    rimEmissive: 0x505050,
    ambientColor: 0x354555,
    goldLightColor: 0xf0e8c0,
    emeraldLightColor: 0xaaccff,
    fogColor: 0x0a0d14,
    particleGradient: ["rgba(240,240,255,1)", "rgba(200,210,230,0.7)", "rgba(100,130,180,0)"],
    skyTop: "#0a0d14",
    skyBottom: "#0d1520",
  },
  india: {
    trunkColor: 0x5a3820,
    foliage1: 0x1a5c40,
    foliage2: 0x4db87a,
    blossomColor: 0xff8fa3,
    groundColor: 0x7a3320,
    rimColor: 0xe06030,
    rimEmissive: 0x6a1f00,
    ambientColor: 0x2a1820,
    goldLightColor: 0xff9040,
    emeraldLightColor: 0xc030a0,
    fogColor: 0x100510,
    particleGradient: ["rgba(255,160,200,1)", "rgba(255,100,160,0.8)", "rgba(200,50,180,0)"],
    skyTop: "#100510",
    skyBottom: "#1e0a18",
  },
  medieval: {
    trunkColor: 0x3a2a18,
    foliage1: 0x1a3828,
    foliage2: 0x304830,
    blossomColor: 0x9060d0,
    groundColor: 0x202820,
    rimColor: 0x7060a0,
    rimEmissive: 0x250040,
    ambientColor: 0x141824,
    goldLightColor: 0xa070e0,
    emeraldLightColor: 0x4060a0,
    fogColor: 0x08080f,
    particleGradient: ["rgba(180,130,255,1)", "rgba(130,90,220,0.8)", "rgba(60,40,120,0)"],
    skyTop: "#08080f",
    skyBottom: "#10101e",
  },
  rome: {
    trunkColor: 0x5a4030,
    foliage1: 0x304820,
    foliage2: 0x608040,
    blossomColor: 0xe0b060,
    groundColor: 0x484038,
    rimColor: 0xc09040,
    rimEmissive: 0x503000,
    ambientColor: 0x2a2010,
    goldLightColor: 0xe0b050,
    emeraldLightColor: 0x80a040,
    fogColor: 0x0a0805,
    particleGradient: ["rgba(220,180,100,1)", "rgba(180,130,60,0.8)", "rgba(120,80,20,0)"],
    skyTop: "#0a0805",
    skyBottom: "#181208",
  },
  mayan: {
    trunkColor: 0x2a4030,
    foliage1: 0x0a4a2c,
    foliage2: 0x0e8050,
    blossomColor: 0x00e0c0,
    groundColor: 0x1a3020,
    rimColor: 0x00c0a0,
    rimEmissive: 0x004030,
    ambientColor: 0x081410,
    goldLightColor: 0x00e0c0,
    emeraldLightColor: 0x40c040,
    fogColor: 0x030a06,
    particleGradient: ["rgba(0,230,200,1)", "rgba(0,180,140,0.8)", "rgba(0,100,60,0)"],
    skyTop: "#030a06",
    skyBottom: "#081410",
  },
};

// Burst particle data
interface BurstParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
}

export const ThreeDTreeCanvas = forwardRef<ThreeDTreeCanvasHandle, ThreeDTreeCanvasProps>(
  function ThreeDTreeCanvas({ focusCount, isRunning, mode, backgroundTheme = "egypt" }, ref) {
    const mountRef = useRef<HTMLDivElement>(null);
    const isRunningRef = useRef(isRunning);
    const focusCountRef = useRef(focusCount);
    const modeRef = useRef(mode);
    const themeRef = useRef(backgroundTheme);
    const burstQueueRef = useRef(false);

    isRunningRef.current = isRunning;
    focusCountRef.current = focusCount;
    modeRef.current = mode;
    themeRef.current = backgroundTheme;

    const [hasWebGL, setHasWebGL] = useState(true);

    // Expose triggerBurst to parent
    useImperativeHandle(ref, () => ({
      triggerBurst: () => {
        burstQueueRef.current = true;
      },
    }));

    useEffect(() => {
      const container = mountRef.current;
      if (!container) return;

      try {
        const testCanvas = document.createElement("canvas");
        const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
        if (!gl) { setHasWebGL(false); return; }
      } catch { setHasWebGL(false); return; }

      const skin = CIVI_SKINS[backgroundTheme] || CIVI_SKINS.egypt;
      const width = container.clientWidth || 360;
      const height = container.clientHeight || 180;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(skin.fogColor, 0.035);
      scene.background = null;

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 2.5, 7.5);
      camera.lookAt(0, 1.2, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(skin.ambientColor, 1.4);
      scene.add(ambientLight);

      const goldPointLight = new THREE.PointLight(skin.goldLightColor, 3.5, 12);
      goldPointLight.position.set(2, 4, 3);
      scene.add(goldPointLight);

      const emeraldLight = new THREE.PointLight(skin.emeraldLightColor, 2.8, 10);
      emeraldLight.position.set(-2.5, 2, -1);
      scene.add(emeraldLight);

      // Ground Dais
      const groundGroup = new THREE.Group();
      const groundGeo = new THREE.CylinderGeometry(3.5, 3.8, 0.4, 48);
      const groundMat = new THREE.MeshStandardMaterial({ color: skin.groundColor, roughness: 0.85, metalness: 0.2 });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.position.y = -0.2;
      groundGroup.add(ground);

      const ringGeo = new THREE.TorusGeometry(3.52, 0.06, 16, 80);
      const ringMat = new THREE.MeshStandardMaterial({
        color: skin.rimColor,
        metalness: 0.85,
        roughness: 0.15,
        emissive: skin.rimEmissive,
        emissiveIntensity: 1.0,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0;
      groundGroup.add(ring);
      scene.add(groundGroup);

      // Tree Root Group
      const treeRoot = new THREE.Group();
      scene.add(treeRoot);

      const trunkMat = new THREE.MeshStandardMaterial({ color: skin.trunkColor, roughness: 0.9, metalness: 0.1 });
      const foliageMat1 = new THREE.MeshStandardMaterial({
        color: skin.foliage1, roughness: 0.5, metalness: 0.2,
        emissive: new THREE.Color(skin.foliage1).multiplyScalar(0.3),
      });
      const foliageMat2 = new THREE.MeshStandardMaterial({
        color: skin.foliage2, roughness: 0.4, metalness: 0.3,
        emissive: new THREE.Color(skin.foliage2).multiplyScalar(0.25),
      });
      const goldBlossomMat = new THREE.MeshStandardMaterial({
        color: skin.blossomColor, roughness: 0.15, metalness: 0.8,
        emissive: new THREE.Color(skin.blossomColor).multiplyScalar(0.45),
      });

      // Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.38, 2.4, 18), trunkMat);
      trunk.position.y = 1.2;
      treeRoot.add(trunk);

      // Branches
      const branch1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.16, 1.3, 12), trunkMat);
      branch1.position.set(0.45, 1.7, 0.2); branch1.rotation.z = -0.55; branch1.rotation.x = 0.2;
      treeRoot.add(branch1);

      const branch2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.14, 1.1, 12), trunkMat);
      branch2.position.set(-0.42, 1.6, -0.1); branch2.rotation.z = 0.58; branch2.rotation.y = 0.3;
      treeRoot.add(branch2);

      const branch3 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.12, 0.9, 10), trunkMat);
      branch3.position.set(0.1, 1.9, -0.5); branch3.rotation.z = -0.2; branch3.rotation.x = -0.5;
      treeRoot.add(branch3);

      // Foliage Clusters
      const clusterData = [
        { pos: [0, 2.5, 0], scale: 1.12, mat: foliageMat2 },
        { pos: [0.72, 2.1, 0.35], scale: 0.82, mat: foliageMat1 },
        { pos: [-0.72, 2.0, -0.2], scale: 0.78, mat: foliageMat1 },
        { pos: [0.1, 2.9, -0.25], scale: 0.72, mat: foliageMat2 },
        { pos: [-0.3, 2.4, 0.55], scale: 0.68, mat: foliageMat2 },
        { pos: [0.55, 2.7, -0.3], scale: 0.62, mat: foliageMat1 },
      ];

      const foliageClusters: THREE.Mesh[] = [];
      clusterData.forEach((c) => {
        const geo = new THREE.IcosahedronGeometry(0.65, 2);
        const mesh = new THREE.Mesh(geo, c.mat);
        mesh.position.set(c.pos[0], c.pos[1], c.pos[2]);
        mesh.scale.setScalar(c.scale);
        treeRoot.add(mesh);
        foliageClusters.push(mesh);
      });

      // Blossom Orbs
      const blossomOrbs: THREE.Mesh[] = [];
      [
        [0.6, 2.5, 0.5], [-0.5, 2.6, 0.2], [0.2, 3.2, 0.1],
        [-0.6, 1.7, 0.4], [0.85, 1.8, -0.2], [0.0, 2.0, 0.9],
        [0.4, 3.0, -0.4], [-0.3, 1.5, -0.5],
      ].forEach((pos) => {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), goldBlossomMat);
        mesh.position.set(pos[0], pos[1], pos[2]);
        treeRoot.add(mesh);
        blossomOrbs.push(mesh);
      });

      // Firefly Particles
      const particleCount = 140;
      const particleGeo = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      const particleSpeeds = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const radius = 0.5 + Math.random() * 3.2;
        particlePositions[i * 3] = Math.cos(theta) * radius;
        particlePositions[i * 3 + 1] = 0.2 + Math.random() * 4.0;
        particlePositions[i * 3 + 2] = Math.sin(theta) * radius;
        particleSpeeds[i] = Math.random() * 0.4 + 0.2;
      }

      particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

      const pCanvas = document.createElement("canvas");
      pCanvas.width = 32; pCanvas.height = 32;
      const pctx = pCanvas.getContext("2d");
      if (pctx) {
        const g = pctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        g.addColorStop(0, skin.particleGradient[0]);
        g.addColorStop(0.35, skin.particleGradient[1]);
        g.addColorStop(1, skin.particleGradient[2]);
        pctx.fillStyle = g;
        pctx.fillRect(0, 0, 32, 32);
      }
      const particleTex = new THREE.CanvasTexture(pCanvas);
      const particleMat = new THREE.PointsMaterial({
        size: 0.17, map: particleTex, transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // =====================================================
      // BURST PARTICLE SYSTEM
      // =====================================================
      const BURST_COUNT = 80;
      const burstGeo = new THREE.BufferGeometry();
      const burstPositions = new Float32Array(BURST_COUNT * 3);
      const burstColors = new Float32Array(BURST_COUNT * 3);
      burstGeo.setAttribute("position", new THREE.BufferAttribute(burstPositions, 3));
      burstGeo.setAttribute("color", new THREE.BufferAttribute(burstColors, 3));

      const burstMat = new THREE.PointsMaterial({
        size: 0.22,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const burstCloud = new THREE.Points(burstGeo, burstMat);
      scene.add(burstCloud);

      const burstParticles: BurstParticle[] = [];
      let isBursting = false;

      const blossomRgb = new THREE.Color(skin.blossomColor);
      const foliageRgb = new THREE.Color(skin.foliage2);

      function initBurst() {
        isBursting = true;
        burstParticles.length = 0;
        for (let i = 0; i < BURST_COUNT; i++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const speed = 0.04 + Math.random() * 0.12;
          const p: BurstParticle = {
            position: new THREE.Vector3(
              Math.random() * 0.8 - 0.4,
              2.2 + Math.random() * 1.2,
              Math.random() * 0.8 - 0.4
            ),
            velocity: new THREE.Vector3(
              Math.sin(phi) * Math.cos(theta) * speed,
              (0.04 + Math.random() * 0.1),
              Math.sin(phi) * Math.sin(theta) * speed
            ),
            life: 1.0,
            maxLife: 0.8 + Math.random() * 0.8,
          };
          burstParticles.push(p);

          // Alternate colors: blossom vs foliage
          const c = i % 3 === 0 ? blossomRgb : foliageRgb;
          burstColors[i * 3] = c.r;
          burstColors[i * 3 + 1] = c.g;
          burstColors[i * 3 + 2] = c.b;
        }
        (burstGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
        burstMat.opacity = 1.0;

        // Flash the dais rim
        ringMat.emissiveIntensity = 4.5;
        goldPointLight.intensity = 12;
        setTimeout(() => { ringMat.emissiveIntensity = 1.0; goldPointLight.intensity = 3.5; }, 600);
      }

      function updateBurst() {
        if (!isBursting) return;

        let allDead = true;
        for (let i = 0; i < burstParticles.length; i++) {
          const p = burstParticles[i];
          p.life -= 0.016 / p.maxLife;
          if (p.life > 0) {
            allDead = false;
            p.velocity.y -= 0.002; // gravity
            p.position.add(p.velocity);
            burstPositions[i * 3] = p.position.x;
            burstPositions[i * 3 + 1] = p.position.y;
            burstPositions[i * 3 + 2] = p.position.z;
          } else {
            // Park dead particles off-screen
            burstPositions[i * 3 + 1] = -999;
          }
        }
        (burstGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

        burstMat.opacity = Math.max(0, burstMat.opacity - 0.012);

        if (allDead || burstMat.opacity <= 0) {
          isBursting = false;
          burstMat.opacity = 0;
        }
      }

      // Mouse Controls
      let mouseX = 0;
      let targetRotationY = 0;
      let isDragging = false;
      let prevMouseX = 0;

      const onMouseDown = (e: MouseEvent) => { isDragging = true; prevMouseX = e.clientX; };
      const onMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          targetRotationY += (e.clientX - prevMouseX) * 0.008;
          prevMouseX = e.clientX;
        } else {
          const rect = container.getBoundingClientRect();
          mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        }
      };
      const onMouseUp = () => { isDragging = false; };
      const onTouchStart = (e: TouchEvent) => { if (e.touches.length === 1) { isDragging = true; prevMouseX = e.touches[0].clientX; } };
      const onTouchMove = (e: TouchEvent) => { if (isDragging && e.touches.length === 1) { targetRotationY += (e.touches[0].clientX - prevMouseX) * 0.008; prevMouseX = e.touches[0].clientX; } };
      const onTouchEnd = () => { isDragging = false; };

      container.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      container.addEventListener("touchstart", onTouchStart, { passive: true });
      container.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd);

      // Animation Loop
      let animationFrameId: number;
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Check for pending burst trigger
        if (burstQueueRef.current) {
          burstQueueRef.current = false;
          initBurst();
        }

        // Growth scale
        const sessions = focusCountRef.current;
        const targetScale = Math.min(1.0, 0.18 + Math.min(sessions, 8) * 0.105);
        treeRoot.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.04);

        // Blossom orbs visibility
        const showBlossoms = sessions >= 3;
        blossomOrbs.forEach((b, idx) => {
          const s = showBlossoms ? Math.min(1.0, (sessions - 2) * 0.22) : 0;
          b.scale.lerp(new THREE.Vector3(s, s, s), 0.07);
          b.position.y += Math.sin(elapsed * 2.2 + idx) * 0.001;
        });

        // Tree sway
        const swaySpeed = isRunningRef.current ? 2.2 : 0.9;
        treeRoot.rotation.z = Math.sin(elapsed * swaySpeed) * 0.028;
        treeRoot.rotation.x = Math.cos(elapsed * swaySpeed * 0.7) * 0.016;

        // Foliage breathing
        foliageClusters.forEach((cluster, i) => {
          const pulse = Math.sin(elapsed * 1.6 + i * 1.1) * 0.032;
          cluster.scale.setScalar(clusterData[i].scale * (1 + pulse));
        });

        // Auto-spin + interaction
        if (!isDragging) targetRotationY += 0.003;
        treeRoot.rotation.y = THREE.MathUtils.lerp(treeRoot.rotation.y, targetRotationY + mouseX * 0.3, 0.05);
        groundGroup.rotation.y = treeRoot.rotation.y;

        // Firefly orbit
        const pos = particleGeo.attributes.position as THREE.BufferAttribute;
        const arr = pos.array as Float32Array;
        const speedMult = isRunningRef.current ? 1.9 : 0.9;
        for (let i = 0; i < particleCount; i++) {
          const angle = particleSpeeds[i] * 0.015 * speedMult;
          const ca = Math.cos(angle), sa = Math.sin(angle);
          const x = arr[i * 3], z = arr[i * 3 + 2];
          arr[i * 3] = x * ca - z * sa;
          arr[i * 3 + 2] = x * sa + z * ca;
          arr[i * 3 + 1] += Math.sin(elapsed * particleSpeeds[i] + i) * 0.004;
          if (arr[i * 3 + 1] > 4.5) arr[i * 3 + 1] = 0.2;
          if (arr[i * 3 + 1] < 0.2) arr[i * 3 + 1] = 4.5;
        }
        pos.needsUpdate = true;

        // Lighting pulse when running
        if (isRunningRef.current) {
          goldPointLight.intensity = 3.5 + Math.sin(elapsed * 3) * 1.5;
          emeraldLight.intensity = 2.8 + Math.cos(elapsed * 2.5) * 1.0;
        }

        // Burst update
        updateBurst();

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", handleResize);
        container.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        container.removeEventListener("touchstart", onTouchStart);
        container.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
        renderer.dispose();
        scene.clear();
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [backgroundTheme]);

    if (!hasWebGL) return null;

    return (
      <div
        ref={mountRef}
        style={{
          width: "100%", height: "190px", borderRadius: "12px", overflow: "hidden",
          position: "relative",
          background: `linear-gradient(180deg, ${CIVI_SKINS[backgroundTheme]?.skyTop ?? "#091315"} 0%, ${CIVI_SKINS[backgroundTheme]?.skyBottom ?? "#0d1e1c"} 100%)`,
          cursor: "grab",
        }}
        title="Drag to rotate your 3D Sanctuary Grove"
      />
    );
  }
);
