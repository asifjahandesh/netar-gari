import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  GameState,
  CameraMode,
  PaintFinish,
  PABNA_LANDMARKS,
  Landmark,
  PlayerCarState,
  createInitialPlayerState,
  stepPlayerCar,
  findNearestLandmark,
  speedToKmh,
  createInitialTraffic,
  stepTrafficVehicles,
  createInitialPedestrians,
  stepPedestrians,
  AccidentNotice,
  CarInput,
} from '../game/rules';
import {
  createRoadTextures,
  createSidewalkTexture,
  createBuildingFacadeTexture,
} from '../game/textures';
import {
  createLeaderVipSuv,
  createCngAutoMesh,
  createCycleRickshawMesh,
  createMotorbikeMesh,
  createBusMesh,
  createPedestrianMesh,
  PedestrianMeshRig,
  createLandmarkMesh,
} from '../game/models';
import { soundEngine } from '../game/audio';

export interface HudTelemetry {
  speedKmh: number;
  distanceMeters: number;
  saluteCount: number;
  nearestLandmark: Landmark;
  landmarkDistance: number;
  visitedCount: number;
  sirenActive: boolean;
  isReversing: boolean;
  isWrongSide: boolean;
  playerX: number;
  playerZ: number;
  playerHeading: number;
  currency: number;
  accidentCount: number;
  chaKhaoyarActive: boolean;
  lastAccidentNotice: AccidentNotice | null;
  leaderName: string;
}

export interface WorldControlActions {
  triggerHorn: () => void;
  triggerWave: () => void;
  toggleSiren: () => void;
  teleportToLandmark: (landmarkId: string) => void;
  resetCar: () => void;
  setTouchInput: (key: keyof CarInput, active: boolean) => void;
  dismissChaKhaoyar: () => void;
  updateLeaderName: (name: string) => void;
}

interface PabnaWorldCanvasProps {
  gameState: GameState;
  cameraMode: CameraMode;
  paintFinish: PaintFinish;
  onTelemetryUpdate: (telemetry: HudTelemetry) => void;
  actionsRef: React.MutableRefObject<WorldControlActions | null>;
}

// Pre-allocated math scratch objects outside render loop (zero GC)
const _desiredCamPos = new THREE.Vector3();
const _desiredLookAt = new THREE.Vector3();
const _currentCamPos = new THREE.Vector3(0, 5, 146);
const _currentLookAt = new THREE.Vector3(0, 1.5, 130);
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

const PAINT_COLOR_MAP: Record<PaintFinish, number> = {
  'obsidian-black': 0x111827,
  'pearl-white': 0xf8fafc,
  'protocol-maroon': 0x6b111b,
};

export const PabnaWorldCanvas: React.FC<PabnaWorldCanvasProps> = ({
  gameState,
  cameraMode,
  paintFinish,
  onTelemetryUpdate,
  actionsRef,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const gameStateRef = useRef<GameState>(gameState);
  const cameraModeRef = useRef<CameraMode>(cameraMode);
  const paintFinishRef = useRef<PaintFinish>(paintFinish);
  const onTelemetryRef = useRef(onTelemetryUpdate);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    paintFinishRef.current = paintFinish;
  }, [paintFinish]);

  useEffect(() => {
    onTelemetryRef.current = onTelemetryUpdate;
  }, [onTelemetryUpdate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL (SwiftShader / llvmpipe) from GPU renderer string
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    // 2. Scene, Sky Horizon & Studio Environment Map
    const scene = new THREE.Scene();
    const skyHorizonColor = new THREE.Color(0xdbeafe);
    scene.background = skyHorizonColor;
    scene.fog = new THREE.FogExp2(0xdbeafe, 0.0038);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      56,
      (container.clientWidth || window.innerWidth) / (container.clientHeight || window.innerHeight),
      0.2,
      450
    );

    // 3. Balanced Warm/Cool Studio Outdoor Lighting
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x3f6212, 0.85);
    hemiLight.position.set(0, 60, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.85);
    sunLight.position.set(45, 75, 55);
    sunLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      sunLight.shadow.mapSize.set(1024, 1024);
      const d = 65;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.camera.near = 5;
      sunLight.shadow.camera.far = 190;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.02;
    }
    scene.add(sunLight);
    scene.add(sunLight.target);

    // 4. Ground Terrain, Pabna Abdul Hamid Road Corridor & Cross Loop Roads
    const grassGeo = new THREE.PlaneGeometry(1600, 1600);
    grassGeo.rotateX(-Math.PI / 2);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a1f, // Rich green ground
      roughness: 0.92,
      metalness: 0.02,
    });
    const grassMesh = new THREE.Mesh(grassGeo, grassMat);
    grassMesh.position.y = 0;
    grassMesh.receiveShadow = true;
    scene.add(grassMesh);

    // Main 4-Lane Abdul Hamid Road Asphalt (24m wide, 680m long, offset y = 0.03 to avoid z-fighting)
    // 2 lanes northbound, 2 lanes southbound, divided by central median
    const { map: roadMap, bumpMap: roadBump } = createRoadTextures(maxAniso);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: roadMap,
      bumpMap: roadBump,
      bumpScale: 0.04,
      roughness: 0.76,
      metalness: 0.08,
    });

    const mainRoadGeo = new THREE.PlaneGeometry(24, 680);
    mainRoadGeo.rotateX(-Math.PI / 2);
    const mainRoad = new THREE.Mesh(mainRoadGeo, roadMat);
    mainRoad.position.set(0, 0.03, -20);
    mainRoad.receiveShadow = true;
    scene.add(mainRoad);

    // Concrete Footpaths / Sidewalks (outer boundaries at x = -13.8 and x = 13.8)
    const sidewalkTex = createSidewalkTexture(maxAniso);
    const sidewalkMat = new THREE.MeshStandardMaterial({
      map: sidewalkTex,
      roughness: 0.8,
    });
    const leftSidewalk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.2, 680), sidewalkMat);
    leftSidewalk.position.set(-13.8, 0.1, -20);
    leftSidewalk.receiveShadow = true;
    scene.add(leftSidewalk);

    const rightSidewalk = leftSidewalk.clone();
    rightSidewalk.position.x = 13.8;
    scene.add(rightSidewalk);

    // Middle Concrete Divider Island with soil bed (1.4m wide, 0.28m high)
    const dividerMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.85,
    });
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x271e16,
      roughness: 0.95,
    });
    const centerDivider = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.28, 680), dividerMat);
    centerDivider.position.set(0, 0.14, -20);
    centerDivider.receiveShadow = true;
    scene.add(centerDivider);

    const dividerSoil = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 678), soilMat);
    dividerSoil.position.set(0, 0.28, -20);
    scene.add(dividerSoil);

    // Intersecting East-West Cross Roads (connecting full city and giving options for right/left roads)
    // 4 major intersections where vehicles can turn left/right:
    // - North Loop (Terminal & Bypass): z = -180
    // - Central Loop (Ananta Cinema & Robiul Market): z = -70
    // - Civic Junction (Shapla Chattar Roundabout): z = 0
    // - South Loop (Zilla School, Hardinge Bridge, Edward College): z = 110
    const crossRoadMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: roadMap,
      roughness: 0.78,
    });
    [-180, -70, 0, 110].forEach((cz) => {
      const cr = new THREE.Mesh(new THREE.PlaneGeometry(360, 20), crossRoadMat);
      cr.rotation.x = -Math.PI / 2;
      cr.position.set(0, 0.026, cz);
      scene.add(cr);
    });

    // Outer East and West 4-Lane Ring Avenues (connecting all districts: Edward College, Hospital, Bridge, Town Hall)
    [-100, 100].forEach((rx) => {
      const loopRoad = new THREE.Mesh(new THREE.PlaneGeometry(20, 520), crossRoadMat);
      loopRoad.rotation.x = -Math.PI / 2;
      loopRoad.position.set(rx, 0.027, -35);
      scene.add(loopRoad);
    });

    // 5. Build All 10 Iconic Pabna City Landmarks & Historical Monuments
    PABNA_LANDMARKS.forEach((lm) => {
      const lmGroup = createLandmarkMesh(lm, maxAniso);
      scene.add(lmGroup);
    });

    // 6. Concrete Electricity Utility Poles & Tangled Overhead Black Cables (Classic Bangladesh Skyline!)
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
    const crossArmMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.7 });
    const cableMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });

    [-11.2, 11.2].forEach((px) => {
      for (let z = 180; z >= -260; z -= 36) {
        // Concrete Pole
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 7.5, 8), poleMat);
        pole.position.set(px, 3.75, z);
        scene.add(pole);

        // Cross-arm with ceramic insulators
        const arm = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.12), crossArmMat);
        arm.position.set(px, 7.2, z);
        scene.add(arm);

        // Street Light Luminaire with warm LED glow
        const lightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8), crossArmMat);
        lightArm.rotation.z = px < 0 ? -Math.PI / 4 : Math.PI / 4;
        lightArm.position.set(px < 0 ? px + 0.6 : px - 0.6, 7.6, z);
        scene.add(lightArm);

        const lampHead = new THREE.Mesh(
          new THREE.BoxGeometry(0.25, 0.1, 0.4),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xfef08a,
            emissiveIntensity: 1.4,
          })
        );
        lampHead.position.set(px < 0 ? px + 1.2 : px - 1.2, 8.2, z);
        scene.add(lampHead);

        // Black Utility Cables linking to next pole along Z
        if (z - 36 >= -260) {
          const cableGeo = new THREE.CylinderGeometry(0.012, 0.012, 36.2, 4);
          cableGeo.rotateX(Math.PI / 2);
          const cable1 = new THREE.Mesh(cableGeo, cableMat);
          cable1.position.set(px - 0.5, 7.2, z - 18);
          scene.add(cable1);

          const cable2 = new THREE.Mesh(cableGeo, cableMat);
          cable2.position.set(px + 0.5, 7.2, z - 18);
          scene.add(cable2);
        }
      }
    });

    // 7. Roadside Traditional Bengali Tea Stalls (টং দোকান)
    const teaStallConfigs = [
      { x: -12.4, z: 42, rot: Math.PI / 2 },
      { x: 12.4, z: -55, rot: -Math.PI / 2 },
      { x: -12.4, z: -140, rot: Math.PI / 2 },
    ];
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
    const tinMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.65 });
    const kettleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.9 });

    teaStallConfigs.forEach((ts) => {
      const tg = new THREE.Group();
      tg.position.set(ts.x, 0, ts.z);
      tg.rotation.y = ts.rot;

      // Wooden counter & bench
      const counter = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 1.1), woodMat);
      counter.position.set(0, 0.45, 0);
      tg.add(counter);

      const bench = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.45, 0.4), woodMat);
      bench.position.set(0, 0.22, 1.2);
      tg.add(bench);

      // Corrugated Tin Canopy Roof
      const tinRoof = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, 2.4), tinMat);
      tinRoof.position.set(0, 2.3, 0.4);
      tinRoof.rotation.x = 0.15;
      tg.add(tinRoof);

      // Bamboo Support Poles
      [-1.3, 1.3].forEach((bx) => {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 6), woodMat);
        pole.position.set(bx, 1.2, 1.2);
        tg.add(pole);
      });

      // Aluminum Tea Kettle (কেটলি) on counter
      const kettle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.25, 12), kettleMat);
      kettle.position.set(-0.5, 1.05, 0);
      tg.add(kettle);

      // Glass cookie jars (কাঁচের বয়াম)
      const jarMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.1, metalness: 0.8 });
      [0.2, 0.6].forEach((jx) => {
        const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.22, 10), jarMat);
        jar.position.set(jx, 1.02, 0);
        tg.add(jar);
      });

      scene.add(tg);
    });

    // 8. Instanced Trees: Roadside Mango & Flaming Krishnachura + Central Divider Trees!
    const treeCount = 200;
    const trunkGeo = new THREE.CylinderGeometry(0.28, 0.42, 3.0, 8);
    trunkGeo.translate(0, 1.5, 0);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.92 });
    const trunkInstanced = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount);

    const canopyGeo = new THREE.DodecahedronGeometry(2.3, 1);
    canopyGeo.translate(0, 4.0, 0);
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.72 });
    const canopyInstanced = new THREE.InstancedMesh(canopyGeo, canopyMat, treeCount);

    const treePalette = [0x15803d, 0x166534, 0x14532d, 0xdc2626, 0xe11d48, 0x16a34a];
    let tIdx = 0;

    // A) Central 4-Lane Divider Trees (placed right down x = 0 at every 14m interval)
    for (let z = 200; z >= -270 && tIdx < treeCount; z -= 14) {
      const isCrossIntersection = [-180, -70, 0, 110].some((cz) => Math.abs(z - cz) < 14);
      if (isCrossIntersection) continue;

      const scale = 0.72 + ((tIdx * 19) % 25) * 0.01;
      _dummy.position.set(0, 0.28, z);
      _dummy.rotation.set(0, (tIdx * 1.3) % (Math.PI * 2), 0);
      _dummy.scale.set(scale, scale * 1.1, scale);
      _dummy.updateMatrix();

      trunkInstanced.setMatrixAt(tIdx, _dummy.matrix);
      canopyInstanced.setMatrixAt(tIdx, _dummy.matrix);

      _color.setHex(treePalette[tIdx % treePalette.length]);
      canopyInstanced.setColorAt(tIdx, _color);
      tIdx++;
    }

    // B) Outer Roadside Trees
    for (let z = 195; z >= -275 && tIdx < treeCount; z -= 10) {
      const nearLandmark = PABNA_LANDMARKS.some(
        (l) => l.type !== 'road-arch' && Math.abs(z - l.z) < 18
      );
      if (nearLandmark) continue;

      [-18.5, 18.5].forEach((sideX) => {
        if (tIdx >= treeCount) return;
        const scale = 0.85 + ((tIdx * 17) % 35) * 0.014;
        const jitterZ = ((tIdx * 13) % 5) - 2;
        _dummy.position.set(sideX + (sideX < 0 ? -0.8 : 0.8), 0, z + jitterZ);
        _dummy.rotation.set(0, (tIdx * 1.1) % (Math.PI * 2), 0);
        _dummy.scale.set(scale, scale, scale);
        _dummy.updateMatrix();

        trunkInstanced.setMatrixAt(tIdx, _dummy.matrix);
        canopyInstanced.setMatrixAt(tIdx, _dummy.matrix);

        _color.setHex(treePalette[tIdx % treePalette.length]);
        canopyInstanced.setColorAt(tIdx, _color);
        tIdx++;
      });
    }
    trunkInstanced.count = tIdx;
    canopyInstanced.count = tIdx;
    trunkInstanced.computeBoundingSphere();
    canopyInstanced.computeBoundingSphere();
    scene.add(trunkInstanced);
    scene.add(canopyInstanced);

    // 9. Authentic Multi-Storey Pabna Commercial Buildings with Bengali Shopfronts
    const shopData = [
      { name: 'বনলতা সুইটস অ্যান্ড ক্যাফে', cat: 'ঐতিহ্যবাহী পাবনার খাঁটি ঘিয়ের মিষ্টি', base: '#f1f5f9', sign: '#7f1d1d', accent: '#facc15' },
      { name: 'পাবনা ড্রাগ হাউস ও ফার্মেসি', cat: '২৪ ঘণ্টা জরুরি ওষুধ ও সার্জিক্যাল', base: '#e0f2fe', sign: '#064e3b', accent: '#34d399' },
      { name: 'রাজশাহী সিল্ক ও শাড়ি বিতান', cat: 'আভিজাত্য ও ঐতিহ্যের সেরা বস্ত্র শোরুম', base: '#fef3c7', sign: '#701a75', accent: '#f472b6' },
      { name: 'ঢাকা ফ্যাশন অ্যান্ড গার্মেন্টস', cat: 'রেডিমেড পোশাক ও আধুনিক ফ্যাশন কালেকশন', base: '#fce7f3', sign: '#1e3a8a', accent: '#60a5fa' },
      { name: 'পাবনা ডিজিটাল সাইবার পয়েন্ট', cat: 'কম্পিউটার সেবা ও অনলাইন রেজিস্ট্রেশন', base: '#e2e8f0', sign: '#1e293b', accent: '#38bdf8' },
      { name: 'ভাই ভাই গ্র্যান্ড টি অ্যান্ড বেকারি', cat: 'স্পেশাল মালাই চা ও ফ্রেশ বিস্কুট', base: '#ffedd5', sign: '#78350f', accent: '#fbbf24' },
    ];

    const shopGeo = new THREE.BoxGeometry(9.5, 9.5, 11);
    let sIdx = 0;
    for (let z = 165; z >= -255; z -= 30) {
      const nearLandmark = PABNA_LANDMARKS.some(
        (l) => l.type !== 'road-arch' && Math.abs(z - l.z) < 24
      );
      if (nearLandmark) continue;

      [-21, 21].forEach((sx) => {
        const info = shopData[sIdx % shopData.length];
        const facadeTex = createBuildingFacadeTexture(
          info.name,
          info.cat,
          info.base,
          info.sign,
          info.accent,
          maxAniso
        );
        const facadeMat = new THREE.MeshStandardMaterial({
          map: facadeTex,
          roughness: 0.65,
        });

        const bldg = new THREE.Mesh(shopGeo, facadeMat);
        bldg.position.set(sx, 4.75, z);
        bldg.rotation.y = sx < 0 ? Math.PI / 2 : -Math.PI / 2;
        bldg.castShadow = true;
        bldg.receiveShadow = true;
        scene.add(bldg);
        sIdx++;
      });
    }

    // 10. Pooled Celebration Flower Petal / Confetti Particle Ring Buffer (InstancedMesh)
    const particleCapacity = 60;
    const petalGeo = new THREE.PlaneGeometry(0.22, 0.22);
    const petalMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const petalInstanced = new THREE.InstancedMesh(petalGeo, petalMat, particleCapacity);
    petalInstanced.frustumCulled = false;
    scene.add(petalInstanced);

    interface PetalParticle {
      active: boolean;
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      life: number;
    }
    const petals: PetalParticle[] = Array.from({ length: particleCapacity }, (_, i) => {
      _color.setHex(i % 2 === 0 ? 0xfacc15 : 0xf97316); // Marigold yellow & orange petals
      petalInstanced.setColorAt(i, _color);
      _dummy.position.set(0, -100, 0);
      _dummy.updateMatrix();
      petalInstanced.setMatrixAt(i, _dummy.matrix);
      return { active: false, x: 0, y: -100, z: 0, vx: 0, vy: 0, vz: 0, life: 0 };
    });
    let petalCursor = 0;

    const spawnPetalBurst = (originX: number, originY: number, originZ: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const p = petals[petalCursor];
        petalCursor = (petalCursor + 1) % particleCapacity;
        p.active = true;
        p.x = originX + (Math.random() - 0.5) * 1.6;
        p.y = originY + Math.random() * 0.6;
        p.z = originZ + (Math.random() - 0.5) * 1.6;
        p.vx = (Math.random() - 0.5) * 6;
        p.vy = 3.5 + Math.random() * 4.5;
        p.vz = (Math.random() - 0.5) * 6;
        p.life = 1.1;
      }
    };

    // 9. Create Hero Political Leader's VIP SUV ("নেতার গাড়ি, ১০০০ গজ দূরে থাকুন")
    const leaderCar = createLeaderVipSuv(maxAniso);
    scene.add(leaderCar.root);

    // 10. Create Pabna Traffic Vehicles (CNGs, Rickshaws, Motorbikes, Inter-District Buses)
    let trafficState = createInitialTraffic();
    const trafficMeshes: THREE.Group[] = trafficState.map((tv) => {
      let mesh: THREE.Group;
      if (tv.type === 'cng') {
        mesh = createCngAutoMesh(tv.colorHex);
      } else if (tv.type === 'rickshaw') {
        mesh = createCycleRickshawMesh(tv.colorHex, maxAniso);
      } else if (tv.type === 'bus') {
        mesh = createBusMesh(tv.busName || 'পাবনা এক্সপ্রেস', tv.busRoute || 'পাবনা - ঢাকা', tv.colorHex, maxAniso);
      } else {
        mesh = createMotorbikeMesh(tv.colorHex);
      }
      mesh.position.set(tv.x, 0, tv.z);
      mesh.rotation.y = tv.heading;
      scene.add(mesh);
      return mesh;
    });

    // 11. Create Pabna Pedestrians walking along sidewalks and zebra crossings
    let pedestriansState = createInitialPedestrians();
    const pedestrianRigs: PedestrianMeshRig[] = pedestriansState.map(createPedestrianMesh);
    pedestrianRigs.forEach((rig) => scene.add(rig.root));

    // 12. Player State & Unified Keyboard + Touch Input Hub
    let playerState: PlayerCarState = createInitialPlayerState();
    let prevChaKhaoyarActive = false;
    const keysPressed = new Set<string>();
    const touchInput: CarInput = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      handbrake: false,
      boost: false,
    };

    let cameraShakeTrauma = 0;

    const triggerHornAction = () => {
      playerState.hornTimer = 1.4;
      cameraShakeTrauma = Math.min(1, cameraShakeTrauma + 0.35);
      soundEngine.playVipHorn();
      spawnPetalBurst(playerState.x, 2.5, playerState.z, 16);
    };

    const triggerWaveAction = () => {
      playerState.waveTimer = 1.8;
      playerState.saluteCount += 3;
      soundEngine.playCrowdCheer();
      spawnPetalBurst(playerState.x, 2.7, playerState.z, 24);
    };

    const toggleSirenAction = () => {
      playerState.sirenActive = !playerState.sirenActive;
      soundEngine.playClick();
    };

    const teleportToLandmark = (landmarkId: string) => {
      const target = PABNA_LANDMARKS.find((l) => l.id === landmarkId);
      if (!target) return;
      playerState.x = target.spawnX;
      playerState.z = target.spawnZ;
      playerState.heading = target.heading;
      playerState.speed = 0;
      if (!playerState.visitedLandmarks.includes(target.id)) {
        playerState.visitedLandmarks = [...playerState.visitedLandmarks, target.id];
      }
      soundEngine.playCrowdCheer();
      spawnPetalBurst(playerState.x, 2.6, playerState.z, 20);
    };

    const resetCar = () => {
      playerState = createInitialPlayerState();
      soundEngine.playClick();
    };

    const dismissChaKhaoyar = () => {
      playerState.chaKhaoyarActive = false;
      soundEngine.playClick();
    };

    const updateLeaderName = (name: string) => {
      playerState.leaderName = name;
    };

    actionsRef.current = {
      triggerHorn: triggerHornAction,
      triggerWave: triggerWaveAction,
      toggleSiren: toggleSirenAction,
      teleportToLandmark,
      resetCar,
      setTouchInput: (key, active) => {
        touchInput[key] = active;
      },
      dismissChaKhaoyar,
      updateLeaderName,
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current !== 'playing') return;
      const code = e.code;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) {
        e.preventDefault();
      }
      if (!keysPressed.has(code)) {
        keysPressed.add(code);
        // Edge-triggered one-shot actions
        if (code === 'Space' || code === 'KeyH') {
          triggerHornAction();
        } else if (code === 'KeyB') {
          triggerWaveAction();
        } else if (code === 'KeyF') {
          toggleSirenAction();
        } else if (code === 'KeyR') {
          resetCar();
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.code);
    };

    const clearInputs = () => {
      keysPressed.clear();
      touchInput.forward = false;
      touchInput.backward = false;
      touchInput.left = false;
      touchInput.right = false;
      touchInput.handbrake = false;
      touchInput.boost = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearInputs);

    // Pre-warm shaders on GPU
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 12. ResizeObserver for responsive viewport
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    // 13. Software-WebGL Safe Animation Loop (afterDraw fenceSync)
    let frameId = 0;
    let isDisposed = false;
    const clock = new THREE.Clock();
    let lastHudUpdate = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      const poll = () => {
        if (isDisposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (isDisposed) return;
      const rawDt = clock.getDelta();
      const dt = Math.min(rawDt, 0.05);
      const elapsed = clock.getElapsedTime();

      // Update paint finish if switched in HUD
      const desiredPaintHex = PAINT_COLOR_MAP[paintFinishRef.current];
      leaderCar.paintMaterials.forEach((m) => {
        if (m.color.getHex() !== desiredPaintHex) {
          m.color.setHex(desiredPaintHex);
        }
      });

      const currentState = gameStateRef.current;

      if (currentState === 'playing' || currentState === 'title') {
        const activeInput: CarInput =
          currentState === 'playing'
            ? {
                forward:
                  keysPressed.has('KeyW') ||
                  keysPressed.has('ArrowUp') ||
                  touchInput.forward,
                backward:
                  keysPressed.has('KeyS') ||
                  keysPressed.has('ArrowDown') ||
                  touchInput.backward,
                left:
                  keysPressed.has('KeyA') ||
                  keysPressed.has('ArrowLeft') ||
                  touchInput.left,
                right:
                  keysPressed.has('KeyD') ||
                  keysPressed.has('ArrowRight') ||
                  touchInput.right,
                handbrake: keysPressed.has('ControlLeft') || touchInput.handbrake,
                boost:
                  keysPressed.has('ShiftLeft') ||
                  keysPressed.has('ShiftRight') ||
                  touchInput.boost,
              }
            : {
                // On Title screen, gently cruise or idle cleanly
                forward: false,
                backward: false,
                left: false,
                right: false,
                handbrake: false,
                boost: false,
              };

        playerState = stepPlayerCar(playerState, activeInput, dt);

        // Sound trigger on "চা খাওয়ার টাকা" prompt activation
        if (playerState.chaKhaoyarActive && !prevChaKhaoyarActive) {
          soundEngine.playChaKhaoSound();
        }
        prevChaKhaoyarActive = playerState.chaKhaoyarActive;

        // Step Pabna pedestrians walking on sidewalks and crossing roads (+1,000 Tk per accident)
        const pedStep = stepPedestrians(pedestriansState, playerState, dt);
        pedestriansState = pedStep.pedestrians;
        if (pedStep.accidents.length > 0) {
          for (const acc of pedStep.accidents) {
            playerState.currency += acc.reward;
            playerState.accidentCount += 1;
            playerState.lastAccidentNotice = {
              textBn: acc.labelBn,
              amount: acc.reward,
              timestamp: Date.now(),
              isWrongSide: playerState.isWrongSide,
            };
            soundEngine.playCrashSound();
            soundEngine.playCashSound();
            cameraShakeTrauma = Math.min(1, cameraShakeTrauma + 0.4);
            spawnPetalBurst(acc.x, 1.4, acc.z, 14);
          }
        }

        // Step Pabna traffic (CNGs, Rickshaws, Bikes, Buses: +5,000 to +50,000 Tk per accident)
        const trafficStep = stepTrafficVehicles(trafficState, playerState, elapsed, dt);
        trafficState = trafficStep.vehicles;
        if (trafficStep.newlySaluted > 0) {
          playerState.saluteCount += trafficStep.newlySaluted;
        }
        if (trafficStep.accidents.length > 0) {
          for (const acc of trafficStep.accidents) {
            playerState.currency += acc.reward;
            playerState.accidentCount += 1;
            playerState.lastAccidentNotice = {
              textBn: acc.labelBn,
              amount: acc.reward,
              timestamp: Date.now(),
              isWrongSide: playerState.isWrongSide,
            };
            soundEngine.playCrashSound();
            soundEngine.playCashSound();
            cameraShakeTrauma = Math.min(1, cameraShakeTrauma + 0.65);
            playerState.speed *= 0.65;
            spawnPetalBurst(acc.x, 1.8, acc.z, 22);
          }
        }
      }

      // Sync Hero VIP SUV mesh transforms
      leaderCar.root.position.set(playerState.x, 0, playerState.z);
      leaderCar.root.rotation.y = playerState.heading;
      leaderCar.bodyGroup.rotation.z = playerState.bodyRoll;
      leaderCar.bodyGroup.rotation.x = playerState.bodyPitch;

      leaderCar.frontLeftWheelPivot.rotation.y = playerState.steerAngle;
      leaderCar.frontRightWheelPivot.rotation.y = playerState.steerAngle;

      const wheelSpin = playerState.speed * dt * 2.2;
      leaderCar.wheels.forEach((w) => {
        w.rotation.x -= wheelSpin;
      });

      // Animate the Political Leader waving through the sunroof!
      const waveSpeed = playerState.waveTimer > 0 ? 11.0 : 3.2;
      const waveAmp = playerState.waveTimer > 0 ? 0.55 : 0.22;
      leaderCar.leaderArmPivot.rotation.z = -0.35 + Math.sin(elapsed * waveSpeed) * waveAmp;
      leaderCar.leaderArmPivot.rotation.x = Math.cos(elapsed * waveSpeed * 0.7) * 0.18;

      // Animate VIP Roof Strobe Lights (Red / Blue police protocol flash)
      const strobeRapid = playerState.sirenActive || playerState.hornTimer > 0;
      const strobePhase = Math.sin(elapsed * (strobeRapid ? 24 : 6));
      leaderCar.beaconRed.emissiveIntensity = strobePhase > 0 ? 2.6 : 0.3;
      leaderCar.beaconBlue.emissiveIntensity = strobePhase <= 0 ? 2.6 : 0.3;

      // Animate VIP Horn Shockwave Ring ("১০০০ গজ দূরে থাকুন" pulse)
      const ringMat = leaderCar.hornShockwaveRing.material as THREE.MeshBasicMaterial;
      if (playerState.hornTimer > 0) {
        const progress = 1 - playerState.hornTimer / 1.4;
        const scale = 1 + progress * 14;
        leaderCar.hornShockwaveRing.scale.set(scale, scale, 1);
        ringMat.opacity = Math.max(0, (1 - progress) * 0.65);
      } else {
        ringMat.opacity = 0;
      }

      // Update Traffic Vehicle Meshes
      for (let i = 0; i < trafficState.length; i++) {
        const tv = trafficState[i];
        const mesh = trafficMeshes[i];
        mesh.position.set(tv.x, 0, tv.z);
        mesh.rotation.y = tv.heading;
      }

      // Update Pedestrian Meshes & Walking Cycles
      for (let i = 0; i < pedestriansState.length; i++) {
        const p = pedestriansState[i];
        const rig = pedestrianRigs[i];
        rig.root.position.set(p.x, 0, p.z);
        rig.root.rotation.y = p.heading;
        if (p.isFallen) {
          rig.root.rotation.z = Math.PI / 2; // fallen sideways on road from impact
          rig.leftLeg.rotation.x = 0.25;
          rig.rightLeg.rotation.x = -0.25;
        } else {
          rig.root.rotation.z = 0;
          const walkPhase = elapsed * p.speed * 6.5 + p.id;
          const legSwing = Math.sin(walkPhase) * 0.45;
          rig.leftLeg.rotation.x = legSwing;
          rig.rightLeg.rotation.x = -legSwing;
          rig.leftArm.rotation.x = -legSwing * 0.75;
          rig.rightArm.rotation.x = legSwing * 0.75;
        }
      }

      // Update Pooled Celebration Flower Petals
      let petalsDirty = false;
      for (let i = 0; i < particleCapacity; i++) {
        const p = petals[i];
        if (!p.active) continue;
        petalsDirty = true;
        p.life -= dt;
        if (p.life <= 0 || p.y < 0.05) {
          p.active = false;
          _dummy.position.set(0, -100, 0);
          _dummy.updateMatrix();
          petalInstanced.setMatrixAt(i, _dummy.matrix);
        } else {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.z += p.vz * dt;
          p.vy -= 9.8 * dt;
          _dummy.position.set(p.x, p.y, p.z);
          _dummy.rotation.set(elapsed * 4 + i, elapsed * 3, 0);
          _dummy.scale.set(1, 1, 1);
          _dummy.updateMatrix();
          petalInstanced.setMatrixAt(i, _dummy.matrix);
        }
      }
      if (petalsDirty) {
        petalInstanced.instanceMatrix.needsUpdate = true;
      }

      // Camera Choreography with Exponential Damping & Portrait/Mobile Responsive Framing
      const sinH = Math.sin(playerState.heading);
      const cosH = Math.cos(playerState.heading);
      const isPortrait = camera.aspect < 1.0;

      if (currentState === 'title') {
        // Title Screen Stage: Live World Showcase framing the back & side of the Leader's VIP SUV
        // so "নেতার গাড়ি, ১০০০ গজ দূরে থাকুন" and Abdul Hamid Road are prominently visible!
        const sway = Math.sin(elapsed * 0.45) * 1.4;
        const distBackTitle = isPortrait ? 7.6 : 5.6;
        _desiredCamPos.set(
          playerState.x + (isPortrait ? 0.3 : 1.65) + sway * 0.35,
          isPortrait ? 2.6 : 2.05,
          playerState.z + distBackTitle
        );
        _desiredLookAt.set(
          playerState.x - 0.4,
          1.45,
          playerState.z - 6.0
        );
      } else {
        const mode = cameraModeRef.current;
        if (mode === 'rear-closeup') {
          // Close-up framing the rear signboard "নেতার গাড়ি, ১০০০ গজ দূরে থাকুন" & Leader in sunroof
          _desiredCamPos.set(
            playerState.x + sinH * (isPortrait ? 4.9 : 4.2),
            isPortrait ? 1.85 : 1.52,
            playerState.z + cosH * (isPortrait ? 4.9 : 4.2)
          );
          _desiredLookAt.set(
            playerState.x - sinH * 4.0,
            isPortrait ? 1.4 : 1.12,
            playerState.z - cosH * 4.0
          );
        } else if (mode === 'leader-pov') {
          // Sunroof Political Leader perspective looking over the hood & flags down Abdul Hamid Road
          _desiredCamPos.set(
            playerState.x + sinH * 0.4,
            2.75,
            playerState.z + cosH * 0.4
          );
          _desiredLookAt.set(
            playerState.x - sinH * 28,
            1.7,
            playerState.z - cosH * 28
          );
        } else if (mode === 'aerial') {
          // High Convoy Helicopter / Drone View of Pabna City Road
          _desiredCamPos.set(
            playerState.x + sinH * 15,
            14.5,
            playerState.z + cosH * 15
          );
          _desiredLookAt.set(
            playerState.x - sinH * 14,
            1.2,
            playerState.z - cosH * 14
          );
        } else {
          // Default 'chase' camera: elevated cleanly so vehicle and road are high above mobile controls
          const speedPullback = Math.min(1.5, Math.abs(playerState.speed) * 0.032);
          const distBack = (isPortrait ? 7.6 : 6.1) + speedPullback;
          const camHeight = isPortrait ? 3.1 : 2.35;
          const lookAtHeight = isPortrait ? 1.5 : 1.05;
          _desiredCamPos.set(
            playerState.x + sinH * distBack,
            camHeight,
            playerState.z + cosH * distBack
          );
          _desiredLookAt.set(
            playerState.x - sinH * 12,
            lookAtHeight,
            playerState.z - cosH * 12
          );
        }
      }

      const camLerp = 1 - Math.exp(-8.5 * dt);
      _currentCamPos.lerp(_desiredCamPos, camLerp);
      _currentLookAt.lerp(_desiredLookAt, camLerp);

      // Apply decaying trauma*trauma shake on horn/boost
      if (cameraShakeTrauma > 0) {
        cameraShakeTrauma = Math.max(0, cameraShakeTrauma - dt * 1.8);
        const shake = cameraShakeTrauma * cameraShakeTrauma * 0.14;
        camera.position.set(
          _currentCamPos.x + (Math.random() - 0.5) * shake,
          _currentCamPos.y + (Math.random() - 0.5) * shake,
          _currentCamPos.z
        );
      } else {
        camera.position.copy(_currentCamPos);
      }
      camera.lookAt(_currentLookAt);

      // Dynamic FOV kick with speed (higher base FOV on portrait/mobile to avoid claustrophobic view)
      const baseFov = isPortrait ? 68 : 56;
      const targetFov = baseFov + Math.min(10, Math.abs(playerState.speed) * 0.22);
      if (Math.abs(camera.fov - targetFov) > 0.1) {
        camera.fov += (targetFov - camera.fov) * (1 - Math.exp(-6 * dt));
        camera.updateProjectionMatrix();
      }

      // Move directional light shadow frustum with player car
      sunLight.position.set(playerState.x + 40, 75, playerState.z + 45);
      sunLight.target.position.set(playerState.x, 0, playerState.z);

      renderer.render(scene, camera);

      // Throttle React HUD telemetry updates to ~10Hz
      if (elapsed - lastHudUpdate >= 0.1) {
        lastHudUpdate = elapsed;
        const { landmark, distance } = findNearestLandmark(playerState.x, playerState.z);
        onTelemetryRef.current({
          speedKmh: speedToKmh(playerState.speed),
          distanceMeters: Math.round(playerState.distanceDriven),
          saluteCount: playerState.saluteCount,
          nearestLandmark: landmark,
          landmarkDistance: Math.round(distance),
          visitedCount: playerState.visitedLandmarks.length,
          sirenActive: playerState.sirenActive,
          isReversing: playerState.speed < -0.5,
          isWrongSide: playerState.isWrongSide,
          playerX: Math.round(playerState.x),
          playerZ: Math.round(playerState.z),
          playerHeading: playerState.heading,
          currency: playerState.currency,
          accidentCount: playerState.accidentCount,
          chaKhaoyarActive: playerState.chaKhaoyarActive,
          lastAccidentNotice: playerState.lastAccidentNotice,
          leaderName: playerState.leaderName,
        });
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearInputs);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      data-testid="pabna-webgl-canvas"
      className="fixed inset-0 w-full h-full overflow-hidden bg-slate-950"
    />
  );
};
