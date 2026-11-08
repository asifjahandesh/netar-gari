import * as THREE from 'three';
import { Landmark, PaintFinish, Pedestrian } from './rules';
import {
  createNetarGariRearTexture,
  createSpareWheelSignTexture,
  createLandmarkSignTexture,
  createHeritageBrickTexture,
  createRickshawArtTexture,
  createBusLiveryTexture,
} from './textures';

export interface LeaderCarRig {
  root: THREE.Group;
  bodyGroup: THREE.Group;
  paintMaterials: THREE.MeshStandardMaterial[];
  frontLeftWheelPivot: THREE.Group;
  frontRightWheelPivot: THREE.Group;
  wheels: THREE.Object3D[];
  leaderArmPivot: THREE.Group;
  beaconRed: THREE.MeshStandardMaterial;
  beaconBlue: THREE.MeshStandardMaterial;
  hornShockwaveRing: THREE.Mesh;
}

const PAINT_HEX: Record<PaintFinish, number> = {
  'obsidian-black': 0x0f172a,
  'pearl-white': 0xf8fafc,
  'protocol-maroon': 0x600d16,
};

/**
 * Builds the realistic Political Leader's VIP SUV ("নেতার গাড়ি"):
 * - Sculpted curvaceous SUV chassis with beveled edges, flared arches, power hood
 * - Multi-slat chrome radiator grille, crystal projector LED headlights with DRL brows
 * - High-end 6-spoke alloy wheels with ventilated brake discs and red Brembo-style brake calipers
 * - Full chrome bullbar, front fender flagpoles waving Bangladesh flags, roof strobe bar
 * - Standing Political Leader (Neta) in white Panjabi & black Mujib coat with animated waving arm
 * - High-resolution illuminated rear tailgate plaque: "নেতার গাড়ি, ১০০০ গজ দূরে থাকুন"
 * - Rear-mounted spare wheel badge
 */
export function createLeaderVipSuv(maxAnisotropy: number = 4): LeaderCarRig {
  const root = new THREE.Group();

  // Contact shadow disc on asphalt (y = 0.02)
  const shadowGeo = new THREE.CircleGeometry(2.9, 32);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
  shadowDisc.position.y = 0.02;
  root.add(shadowDisc);

  // VIP Horn Shockwave Ring ("১০০০ গজ দূরে থাকুন" clearance pulse)
  const ringGeo = new THREE.RingGeometry(1.6, 2.4, 36);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xfacc15,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const hornShockwaveRing = new THREE.Mesh(ringGeo, ringMat);
  hornShockwaveRing.position.y = 0.06;
  root.add(hornShockwaveRing);

  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  // High-end Automotive PBR Paint Material with metallic gloss & clearcoat effect
  const bodyPaintMat = new THREE.MeshStandardMaterial({
    color: PAINT_HEX['obsidian-black'],
    roughness: 0.18,
    metalness: 0.8,
  });
  const paintMaterials = [bodyPaintMat];

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.12,
    metalness: 0.95,
  });
  const darkTrimMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.65,
    metalness: 0.25,
  });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    roughness: 0.08,
    metalness: 0.9,
    transparent: true,
    opacity: 0.88,
  });

  // 1. Lower SUV Chassis & Sculpted Hull
  const lowerHull = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.78, 4.85), bodyPaintMat);
  lowerHull.position.set(0, 0.82, 0);
  lowerHull.castShadow = true;
  lowerHull.receiveShadow = true;
  bodyGroup.add(lowerHull);

  // Hood Power Bulge with aerodynamic taper
  const hoodBulge = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 1.65), bodyPaintMat);
  hoodBulge.position.set(0, 1.25, -1.25);
  hoodBulge.rotation.x = -0.06;
  bodyGroup.add(hoodBulge);

  // Front & Rear Sculpted Bumpers
  const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(2.24, 0.42, 0.35), bodyPaintMat);
  frontBumper.position.set(0, 0.6, -2.48);
  bodyGroup.add(frontBumper);

  const frontSkidPlate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 0.3), chromeMat);
  frontSkidPlate.position.set(0, 0.4, -2.52);
  bodyGroup.add(frontSkidPlate);

  // Chrome Side Running Boards / Steps
  [-1.16, 1.16].forEach((sx) => {
    const step = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 3.2), chromeMat);
    step.position.set(sx, 0.44, 0.1);
    bodyGroup.add(step);

    const stepRubber = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 3.0), darkTrimMat);
    stepRubber.position.set(sx, 0.5, 0.1);
    bodyGroup.add(stepRubber);
  });

  // 2. Upper Cabin Greenhouse & Slanted Pillars
  const cabinBox = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.74, 2.95), bodyPaintMat);
  cabinBox.position.set(0, 1.56, 0.32);
  cabinBox.castShadow = true;
  bodyGroup.add(cabinBox);

  // Windshield with aerodynamic rake
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.66, 0.08), glassMat);
  windshield.position.set(0, 1.54, -1.16);
  windshield.rotation.x = 0.28;
  bodyGroup.add(windshield);

  // Side Glass windows with pillars
  const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.54, 2.65), glassMat);
  sideGlass.position.set(0, 1.58, 0.35);
  bodyGroup.add(sideGlass);

  // Chrome Roof Rails
  [-0.92, 0.92].forEach((rx) => {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.5, 8), chromeMat);
    rail.rotation.x = Math.PI / 2;
    rail.position.set(rx, 1.98, 0.35);
    bodyGroup.add(rail);
  });

  // 3. Front Facia: Multi-Bar Radiator Grille & Crystal Projector Headlights
  const grille = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.52, 0.08), chromeMat);
  grille.position.set(0, 0.88, -2.44);
  bodyGroup.add(grille);

  // VIP Grille Emblem
  const emblem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 16), chromeMat);
  emblem.rotation.x = Math.PI / 2;
  emblem.position.set(0, 0.88, -2.48);
  bodyGroup.add(emblem);

  // Headlight units (Crystal Projector LEDs with DRLs)
  const headlightLensMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xfef08a,
    emissiveIntensity: 1.8,
    roughness: 0.1,
  });
  const drlMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    emissive: 0x60a5fa,
    emissiveIntensity: 2.2,
  });
  const turnMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 1.5,
  });

  [-0.82, 0.82].forEach((hx) => {
    const hlHousing = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.24, 0.1), darkTrimMat);
    hlHousing.position.set(hx, 0.94, -2.42);
    bodyGroup.add(hlHousing);

    const hlCore = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), headlightLensMat);
    hlCore.position.set(hx * 0.96, 0.94, -2.46);
    bodyGroup.add(hlCore);

    const drl = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.03, 0.04), drlMat);
    drl.position.set(hx, 1.05, -2.45);
    bodyGroup.add(drl);

    const turn = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.04), turnMat);
    turn.position.set(hx > 0 ? hx + 0.16 : hx - 0.16, 0.94, -2.43);
    bodyGroup.add(turn);
  });

  // Heavy-duty VIP Front Bullbar
  const bullbar = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.38, 0.16), chromeMat);
  bullbar.position.set(0, 0.6, -2.52);
  bodyGroup.add(bullbar);

  // Dual Driving Lamps on Bullbar
  [-0.45, 0.45].forEach((lx) => {
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.08, 16), chromeMat);
    lamp.rotation.x = Math.PI / 2;
    lamp.position.set(lx, 0.72, -2.56);
    bodyGroup.add(lamp);

    const lampLens = new THREE.Mesh(new THREE.CircleGeometry(0.09, 16), headlightLensMat);
    lampLens.position.set(lx, 0.72, -2.61);
    bodyGroup.add(lampLens);
  });

  // Front Fender Flagpoles with Bangladesh National Protocol Flags
  [-0.96, 0.96].forEach((fx) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.72, 8), chromeMat);
    pole.position.set(fx * 1.15, 1.5, -2.25);
    bodyGroup.add(pole);

    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), chromeMat);
    finial.position.set(fx * 1.15, 1.86, -2.25);
    bodyGroup.add(finial);

    const flagMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.25, 0.4),
      new THREE.MeshStandardMaterial({
        color: 0x059669,
        emissive: 0x022c22,
        roughness: 0.5,
      })
    );
    flagMesh.position.set(fx * 1.15, 1.7, -2.05);
    bodyGroup.add(flagMesh);

    const redDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 0.025, 16),
      new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        emissive: 0x7f1d1d,
        roughness: 0.5,
      })
    );
    redDisc.rotation.z = Math.PI / 2;
    redDisc.position.set(fx * 1.15, 1.7, -2.07);
    bodyGroup.add(redDisc);
  });

  // 4. Rear Tailgate with the Unmissable Signboard: "নেতার গাড়ি, ১০০০ গজ দূরে থাকুন"
  const rearSignTex = createNetarGariRearTexture(maxAnisotropy);
  const rearSignMat = new THREE.MeshBasicMaterial({ map: rearSignTex });

  const rearPlaqueFrame = new THREE.Mesh(new THREE.BoxGeometry(2.02, 1.02, 0.08), chromeMat);
  rearPlaqueFrame.position.set(0, 1.35, 2.44);
  bodyGroup.add(rearPlaqueFrame);

  const rearSignPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.95, 0.96), rearSignMat);
  rearSignPlane.position.set(0, 1.35, 2.49);
  bodyGroup.add(rearSignPlane);

  const tailLightMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 1.6,
  });
  [-0.9, 0.9].forEach((tx) => {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.54, 0.08), tailLightMat);
    tl.position.set(tx, 1.05, 2.43);
    bodyGroup.add(tl);
  });

  const spareWheelTex = createSpareWheelSignTexture(maxAnisotropy);
  const spareFace = new THREE.Mesh(
    new THREE.CircleGeometry(0.26, 28),
    new THREE.MeshBasicMaterial({ map: spareWheelTex })
  );
  spareFace.position.set(0.74, 0.56, 2.58);
  bodyGroup.add(spareFace);

  // 5. Roof VIP Protocol Strobe Light Bar (Red & Blue high-intensity LED beacons)
  const lightBarBase = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.08, 0.28), chromeMat);
  lightBarBase.position.set(0, 1.95, -0.55);
  bodyGroup.add(lightBarBase);

  const beaconRed = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xef4444,
    emissiveIntensity: 2.0,
  });
  const beaconBlue = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    emissive: 0x3b82f6,
    emissiveIntensity: 2.0,
  });

  const redPod = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.12, 0.24), beaconRed);
  redPod.position.set(-0.34, 2.02, -0.55);
  bodyGroup.add(redPod);

  const bluePod = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.12, 0.24), beaconBlue);
  bluePod.position.set(0.34, 2.02, -0.55);
  bodyGroup.add(bluePod);

  // 6. Open Sunroof + Standing Political Leader (Neta in White Panjabi & Black Mujib Coat)
  const sunroofRim = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.08, 0.92), darkTrimMat);
  sunroofRim.position.set(0, 1.92, 0.15);
  bodyGroup.add(sunroofRim);

  const leaderGroup = new THREE.Group();
  leaderGroup.position.set(0, 1.88, 0.15);
  bodyGroup.add(leaderGroup);

  const panjabiMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.65 });
  const mujibCoatMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xc68a4c, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 });

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.6, 0.3), mujibCoatMat);
  torso.position.set(0, 0.3, 0);
  leaderGroup.add(torso);

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.1, 16), mujibCoatMat);
  collar.position.set(0, 0.64, 0);
  leaderGroup.add(collar);

  const whiteStrip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.58, 0.32), panjabiMat);
  whiteStrip.position.set(0, 0.3, 0);
  leaderGroup.add(whiteStrip);

  for (let b = 0; b < 6; b++) {
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.01, 8), chromeMat);
    btn.rotation.x = Math.PI / 2;
    btn.position.set(0.04, 0.12 + b * 0.08, -0.16);
    leaderGroup.add(btn);
  }

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), skinMat);
  head.position.set(0, 0.76, 0);
  leaderGroup.add(head);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.186, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
    hairMat
  );
  hair.position.set(0, 0.78, 0.02);
  leaderGroup.add(hair);

  const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.04), darkTrimMat);
  glasses.position.set(0, 0.78, -0.18);
  leaderGroup.add(glasses);

  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.44, 0.13), panjabiMat);
  leftArm.position.set(-0.32, 0.32, -0.05);
  leftArm.rotation.z = 0.28;
  leaderGroup.add(leftArm);

  const leaderArmPivot = new THREE.Group();
  leaderArmPivot.position.set(0.3, 0.52, 0);
  leaderGroup.add(leaderArmPivot);

  const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.5, 0.13), panjabiMat);
  rightArm.position.set(0.06, 0.24, 0);
  leaderArmPivot.add(rightArm);

  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), skinMat);
  rightHand.position.set(0.06, 0.52, 0);
  leaderArmPivot.add(rightHand);

  // 7. Four Rotating 6-Spoke Alloy Wheels with Ventilated Brake Discs & Red Calipers
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.88,
    metalness: 0.1,
  });
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.2,
    metalness: 0.9,
  });
  const discMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.35,
    metalness: 0.85,
  });
  const caliperMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    roughness: 0.3,
    metalness: 0.5,
  });

  const wheels: THREE.Object3D[] = [];
  const frontLeftWheelPivot = new THREE.Group();
  const frontRightWheelPivot = new THREE.Group();

  const buildWheel = () => {
    const wg = new THREE.Group();

    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.34, 24), tireMat);
    tire.rotation.z = Math.PI / 2;
    wg.add(tire);

    const rimBand = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.36, 20), rimMat);
    rimBand.rotation.z = Math.PI / 2;
    wg.add(rimBand);

    for (let s = 0; s < 6; s++) {
      const angle = (s * Math.PI) / 3;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.28, 0.05), rimMat);
      spoke.rotation.x = angle;
      wg.add(spoke);
    }

    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 16), discMat);
    disc.rotation.z = Math.PI / 2;
    disc.position.x = -0.05;
    wg.add(disc);

    const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.12), caliperMat);
    caliper.position.set(-0.05, 0.16, 0);
    wg.add(caliper);

    return wg;
  };

  frontLeftWheelPivot.position.set(-1.08, 0.44, -1.48);
  const flWheel = buildWheel();
  frontLeftWheelPivot.add(flWheel);
  root.add(frontLeftWheelPivot);
  wheels.push(flWheel);

  frontRightWheelPivot.position.set(1.08, 0.44, -1.48);
  const frWheel = buildWheel();
  frontRightWheelPivot.add(frWheel);
  root.add(frontRightWheelPivot);
  wheels.push(frWheel);

  const rlWheel = buildWheel();
  rlWheel.position.set(-1.08, 0.44, 1.48);
  root.add(rlWheel);
  wheels.push(rlWheel);

  const rrWheel = buildWheel();
  rrWheel.position.set(1.08, 0.44, 1.48);
  root.add(rrWheel);
  wheels.push(rrWheel);

  return {
    root,
    bodyGroup,
    paintMaterials,
    frontLeftWheelPivot,
    frontRightWheelPivot,
    wheels,
    leaderArmPivot,
    beaconRed,
    beaconBlue,
    hornShockwaveRing,
  };
}

/**
 * Builds an authentic, realistic Bangladeshi Green CNG Auto-Rickshaw (3-wheeler):
 * - Sculpted aerodynamic metallic green cabin with beveled front cowl & black tarpaulin roof
 * - Iron wire mesh security grilles on both passenger openings
 * - Front single wheel in chrome fork with curved mudguard
 * - Dual rear wheels with rubber tread, steel rims and chrome lug nuts
 * - Chrome motorcycle handlebar with instrument dials & brake levers
 * - 3D Driver figure in authentic Bangladeshi check lungi and collared polo shirt
 * - Round halogen crystal headlight with chrome bezel & amber turn signals
 * - Rear engine cover with yellow/black hazard chevrons and registration plate ("পাবনা-থ-১১-২৩৪৫")
 */
export function createCngAutoMesh(colorHex: number = 0x15803d): THREE.Group {
  const g = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.28,
    metalness: 0.55,
  });
  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x064e3b, // deep dark green tarpaulin
    roughness: 0.75,
    metalness: 0.15,
  });
  const yellowMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.35,
    metalness: 0.3,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.12,
    metalness: 0.95,
  });
  const darkTrimMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.65,
    metalness: 0.35,
  });
  const meshMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.4,
    metalness: 0.8,
  });
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.9,
    metalness: 0.05,
  });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    roughness: 0.06,
    metalness: 0.9,
    transparent: true,
    opacity: 0.78,
  });
  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xfef08a,
    emissiveIntensity: 2.0,
  });
  const amberMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 1.5,
  });
  const taillightMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 1.6,
  });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xb4793f, roughness: 0.65 });
  const lungiMat = new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.75 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.65 });

  // 1. Lower Body Tub & Passenger Floorboard
  const tub = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.74, 2.38), bodyMat);
  tub.position.set(0, 0.55, 0.1);
  tub.castShadow = true;
  g.add(tub);

  // Aerodynamic nose taper & front wheel apron
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.72, 1.05, 12), bodyMat);
  nose.rotation.x = -Math.PI / 2;
  nose.rotation.z = Math.PI / 4;
  nose.position.set(0, 0.55, -1.32);
  g.add(nose);

  // Front wheel fender arch
  const frontFender = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.35, 0.75), bodyMat);
  frontFender.position.set(0, 0.48, -1.35);
  g.add(frontFender);

  // 2. High-Visibility Yellow Waist Stripe ("সিএনজি")
  const waistStripe = new THREE.Mesh(new THREE.BoxGeometry(1.39, 0.16, 2.42), yellowMat);
  waistStripe.position.set(0, 0.9, 0.1);
  g.add(waistStripe);

  // 3. Canopy Roof with curved tarpaulin corners
  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.72, 1.95), roofMat);
  hood.position.set(0, 1.25, 0.22);
  hood.castShadow = true;
  g.add(hood);

  // Canopy Visor Brow
  const roofVisor = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.1, 0.38), roofMat);
  roofVisor.position.set(0, 1.62, -0.85);
  roofVisor.rotation.x = -0.22;
  g.add(roofVisor);

  // 4. Clear Glass Windshield with black gasket
  const windshieldFrame = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.62, 0.06), darkTrimMat);
  windshieldFrame.position.set(0, 1.22, -0.74);
  windshieldFrame.rotation.x = 0.14;
  g.add(windshieldFrame);

  const windshieldGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.16, 0.54), glassMat);
  windshieldGlass.position.set(0, 1.22, -0.77);
  windshieldGlass.rotation.x = 0.14;
  g.add(windshieldGlass);

  // Single Windshield Wiper
  const wiper = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.48, 6), darkTrimMat);
  wiper.position.set(0.1, 1.18, -0.8);
  wiper.rotation.z = -0.35;
  g.add(wiper);

  // 5. Iron Wire Mesh Security Gates (both passenger openings)
  [-0.67, 0.67].forEach((sx) => {
    // Horizontal security bars
    for (let by = 0.92; by <= 1.48; by += 0.12) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.55, 8), meshMat);
      bar.rotation.x = Math.PI / 2;
      bar.position.set(sx, by, 0.35);
      g.add(bar);
    }
    // Vertical uprights
    [-0.35, 0.35, 1.05].forEach((vz) => {
      const vbar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.65, 8), meshMat);
      vbar.position.set(sx, 1.2, vz);
      g.add(vbar);
    });
  });

  // 6. Realistic Headlight, Amber Turn Indicators, and Rear Lamps
  const hlHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 18), chromeMat);
  hlHousing.rotation.x = Math.PI / 2;
  hlHousing.position.set(0, 0.68, -1.72);
  g.add(hlHousing);

  const hlLens = new THREE.Mesh(new THREE.CircleGeometry(0.14, 18), headlightMat);
  hlLens.position.set(0, 0.68, -1.79);
  g.add(hlLens);

  // Amber turn indicators on nose
  [-0.38, 0.38].forEach((ix) => {
    const indicator = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.06, 12), amberMat);
    indicator.rotation.x = Math.PI / 2;
    indicator.position.set(ix, 0.68, -1.58);
    g.add(indicator);
  });

  // Rear taillight cluster
  [-0.52, 0.52].forEach((tx) => {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 0.06), taillightMat);
    tl.position.set(tx, 0.72, 1.3);
    g.add(tl);
  });

  // Rear yellow/black chevron hazard bumper
  const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.18, 0.12), darkTrimMat);
  rearBumper.position.set(0, 0.36, 1.3);
  g.add(rearBumper);

  // Registration plate ("পাবনা-থ-১১-২৩৪৫")
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.15, 0.04), yellowMat);
  plate.position.set(0, 0.62, 1.3);
  g.add(plate);

  // 7. Interior: Motorcycle Handlebar, Speedometer & Driver Figure
  const handlebar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8), chromeMat);
  handlebar.rotation.z = Math.PI / 2;
  handlebar.position.set(0, 0.92, -0.58);
  g.add(handlebar);

  // Driver figure
  const driverTorso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.44, 0.24), shirtMat);
  driverTorso.position.set(0, 0.98, -0.22);
  g.add(driverTorso);

  const driverLungi = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.38), lungiMat);
  driverLungi.position.set(0, 0.64, -0.26);
  g.add(driverLungi);

  const driverHead = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), skinMat);
  driverHead.position.set(0, 1.32, -0.22);
  g.add(driverHead);

  // 8. Realistic 3 Wheels with rubber tires, steel rims, and chrome hubs
  const buildCngWheel = () => {
    const wg = new THREE.Group();
    const tire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.18, 18),
      tireMat
    );
    tire.rotation.z = Math.PI / 2;
    wg.add(tire);

    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.19, 16),
      chromeMat
    );
    rim.rotation.z = Math.PI / 2;
    wg.add(rim);

    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.21, 10),
      darkTrimMat
    );
    hub.rotation.z = Math.PI / 2;
    wg.add(hub);

    return wg;
  };

  const frontWheel = buildCngWheel();
  frontWheel.position.set(0, 0.28, -1.35);
  g.add(frontWheel);

  const rearLeftWheel = buildCngWheel();
  rearLeftWheel.position.set(-0.66, 0.28, 0.95);
  g.add(rearLeftWheel);

  const rearRightWheel = buildCngWheel();
  rearRightWheel.position.set(0.66, 0.28, 0.95);
  g.add(rearRightWheel);

  return g;
}

/**
 * Builds a colorful, realistic Bangladeshi Cycle Rickshaw with puller, folding hood & painted folk art (রিকশা আর্ট)
 */
export function createCycleRickshawMesh(
  hoodColorHex: number = 0xeab308,
  maxAnisotropy: number = 4
): THREE.Group {
  const g = new THREE.Group();

  const hoodMat = new THREE.MeshStandardMaterial({
    color: hoodColorHex,
    roughness: 0.5,
    metalness: 0.2,
  });
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.35,
    metalness: 0.85,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.12,
    metalness: 0.95,
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.25,
    metalness: 0.85,
  });
  const seatMat = new THREE.MeshStandardMaterial({
    color: 0xb91c1c, // deep red quilted vinyl
    roughness: 0.45,
  });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xb4793f, roughness: 0.65 });
  const lungiMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.75 });
  const gamchhaMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.7 });
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9, metalness: 0.05 });

  // 1. Bicycle Front Chassis Frame
  const downTube = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.95, 8), frameMat);
  downTube.rotation.x = 0.55;
  downTube.position.set(0, 0.75, -0.55);
  g.add(downTube);

  const topTube = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8, 8), frameMat);
  topTube.rotation.x = Math.PI / 2;
  topTube.position.set(0, 1.05, -0.65);
  g.add(topTube);

  // Chrome Sweeping Handlebars
  const handlebar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.64, 8), chromeMat);
  handlebar.rotation.z = Math.PI / 2;
  handlebar.position.set(0, 1.25, -0.92);
  g.add(handlebar);

  // Classic Brass Dome Bell on handlebar
  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), brassMat);
  bell.position.set(0.18, 1.29, -0.92);
  g.add(bell);

  // Front Fork
  const forkLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.55, 8), chromeMat);
  forkLeft.position.set(-0.06, 0.6, -1.02);
  forkLeft.rotation.x = 0.25;
  g.add(forkLeft);
  const forkRight = forkLeft.clone();
  forkRight.position.x = 0.06;
  g.add(forkRight);

  // 2. Rear Passenger Carriage Platform & Chassis Frame
  const platform = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.12, 1.25), frameMat);
  platform.position.set(0, 0.48, 0.55);
  g.add(platform);

  // Wooden passenger footstep plate
  const footstep = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 0.04, 0.28),
    new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
  );
  footstep.position.set(0, 0.32, -0.15);
  g.add(footstep);

  // Quilted Vinyl Passenger Seat
  const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.26, 0.62), seatMat);
  seatCushion.position.set(0, 0.68, 0.72);
  g.add(seatCushion);

  const seatBackrest = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.52, 0.14), seatMat);
  seatBackrest.position.set(0, 1.02, 0.98);
  g.add(seatBackrest);

  // Brass studded armrests
  [-0.52, 0.52].forEach((ax) => {
    const armrest = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.55), seatMat);
    armrest.position.set(ax, 0.86, 0.72);
    g.add(armrest);
  });

  // Folding Canopy Hood with curved support ribs
  const hoodCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.62, 1.08, 20, 1, false, 0, Math.PI),
    hoodMat
  );
  hoodCylinder.rotation.z = Math.PI / 2;
  hoodCylinder.position.set(0, 1.28, 0.72);
  g.add(hoodCylinder);

  // Scissor struts for folding hood
  [-0.55, 0.55].forEach((sx) => {
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.68, 6), chromeMat);
    strut.rotation.x = -0.45;
    strut.position.set(sx, 1.15, 0.45);
    g.add(strut);
  });

  // 3. High-Resolution Rickshaw Folk Art Backboard (রিকশা আর্ট)
  const artTex = createRickshawArtTexture(hoodColorHex, maxAnisotropy);
  const backBoard = new THREE.Mesh(
    new THREE.PlaneGeometry(1.04, 0.54),
    new THREE.MeshBasicMaterial({ map: artTex, side: THREE.DoubleSide })
  );
  backBoard.position.set(0, 0.98, 1.18);
  g.add(backBoard);

  // 4. Detailed Spoked 28" Bicycle Wheels (Front & Dual Rear)
  const buildSpokedWheel = () => {
    const wg = new THREE.Group();

    // Rubber Tire
    const tire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.06, 24),
      tireMat
    );
    tire.rotation.z = Math.PI / 2;
    wg.add(tire);

    // Chrome Rim
    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 0.07, 24),
      chromeMat
    );
    rim.rotation.z = Math.PI / 2;
    wg.add(rim);

    // Central Wheel Hub
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.12, 12),
      chromeMat
    );
    hub.rotation.z = Math.PI / 2;
    wg.add(hub);

    // Radial Wire Spokes
    for (let s = 0; s < 12; s++) {
      const angle = (s * Math.PI) / 6;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.74, 0.008), chromeMat);
      spoke.rotation.x = angle;
      wg.add(spoke);
    }

    return wg;
  };

  const frontWheel = buildSpokedWheel();
  frontWheel.position.set(0, 0.42, -1.05);
  g.add(frontWheel);

  const rearLeftWheel = buildSpokedWheel();
  rearLeftWheel.position.set(-0.62, 0.42, 0.78);
  g.add(rearLeftWheel);

  const rearRightWheel = buildSpokedWheel();
  rearRightWheel.position.set(0.62, 0.42, 0.78);
  g.add(rearRightWheel);

  // Rear Mudguards over wheels
  [-0.62, 0.62].forEach((mx) => {
    const mudguard = new THREE.Mesh(
      new THREE.CylinderGeometry(0.46, 0.46, 0.1, 16, 1, false, 0, Math.PI * 0.7),
      frameMat
    );
    mudguard.rotation.z = Math.PI / 2;
    mudguard.position.set(mx, 0.46, 0.76);
    g.add(mudguard);
  });

  // 5. Authentic Rickshaw Puller Figure (লুঙ্গি, গেঞ্জি ও গামছা)
  const pullerTorso = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.48, 0.22), lungiMat);
  pullerTorso.position.set(0, 1.05, -0.42);
  pullerTorso.rotation.x = 0.24; // leaning forward aggressively to pedal
  g.add(pullerTorso);

  const pullerHead = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), skinMat);
  pullerHead.position.set(0, 1.4, -0.48);
  g.add(pullerHead);

  // Red Gamchha draped around neck
  const gamchha = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.12, 0.26), gamchhaMat);
  gamchha.position.set(0, 1.25, -0.44);
  g.add(gamchha);

  // Arms gripping the handlebars
  [-0.18, 0.18].forEach((ax) => {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.48, 8), skinMat);
    arm.position.set(ax, 1.15, -0.68);
    arm.rotation.x = -0.55;
    g.add(arm);
  });

  return g;
}

/**
 * Builds a modern, realistic 150cc commuter motorbike + helmeted rider:
 * - Double-cradle tubular steel chassis with exposed engine block & cooling fins
 * - Telescopic front forks with chrome stanchions and front disc brake
 * - Upswept chrome exhaust pipe with satin black silencer
 * - Sculpted aerodynamic fuel tank with knee indents & metallic finish
 * - Stepped dual-level sports seat
 * - Clip-on handlebars with instruments, mirrors, and projector headlight
 * - 5-spoke black alloy rims with red calipers & rubber tires
 * - Rider wearing aerodynamic full-face helmet with tinted visor and jacket
 */
export function createMotorbikeMesh(colorHex: number = 0xdc2626): THREE.Group {
  const g = new THREE.Group();

  const bikeMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.22,
    metalness: 0.75,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.65,
    metalness: 0.45,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.1,
    metalness: 0.95,
  });
  const engineMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.4,
    metalness: 0.8,
  });
  const caliperMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 });
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9, metalness: 0.05 });
  const jacketMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65 });
  const helmetMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.15,
    metalness: 0.6,
  });
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    roughness: 0.05,
    metalness: 0.95,
  });
  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xfef08a,
    emissiveIntensity: 2.2,
  });

  // 1. Sculpted Fuel Tank with knee recesses & chrome fuel cap
  const tank = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.46, 0.85), bikeMat);
  tank.position.set(0, 0.78, -0.15);
  tank.rotation.x = -0.12;
  g.add(tank);

  const tankCap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 12), chromeMat);
  tankCap.position.set(0, 1.02, -0.22);
  g.add(tankCap);

  // 2. Stepped Two-Up Leather Sports Seat
  const riderSeat = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.18, 0.55), darkMat);
  riderSeat.position.set(0, 0.72, 0.35);
  g.add(riderSeat);

  const pillionSeat = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.18, 0.42), darkMat);
  pillionSeat.position.set(0, 0.82, 0.75);
  g.add(pillionSeat);

  // 3. 150cc Engine Block with cooling fins & crankcase
  const engineBlock = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.42, 0.48), engineMat);
  engineBlock.position.set(0, 0.42, 0.05);
  g.add(engineBlock);

  // Cooling fins
  for (let f = 0.28; f <= 0.58; f += 0.08) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.015, 0.44), engineMat);
    fin.position.set(0, f, 0.05);
    g.add(fin);
  }

  // Upswept Chrome Exhaust Header & Muffler
  const exhaustHeader = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.9, 8), chromeMat);
  exhaustHeader.rotation.x = Math.PI / 2;
  exhaustHeader.position.set(0.2, 0.32, 0.35);
  g.add(exhaustHeader);

  const muffler = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.65, 12), darkMat);
  muffler.rotation.x = 1.35;
  muffler.position.set(0.22, 0.45, 0.85);
  g.add(muffler);

  // 4. Front Telescopic Fork & Aerodynamic Headlight Cowl
  [-0.14, 0.14].forEach((fx) => {
    const fork = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.85, 8), chromeMat);
    fork.rotation.x = 0.32;
    fork.position.set(fx, 0.52, -0.65);
    g.add(fork);
  });

  const frontFender = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.55), bikeMat);
  frontFender.position.set(0, 0.56, -0.78);
  frontFender.rotation.x = 0.28;
  g.add(frontFender);

  // Headlight Cowl with Visor & Crystal Lamp
  const cowl = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.35, 0.22), bikeMat);
  cowl.position.set(0, 0.92, -0.82);
  cowl.rotation.x = 0.28;
  g.add(cowl);

  const lamp = new THREE.Mesh(new THREE.CircleGeometry(0.1, 14), headlightMat);
  lamp.position.set(0, 0.92, -0.94);
  lamp.rotation.x = -0.28;
  g.add(lamp);

  // Handlebars & Side Mirrors
  const handlebar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.62, 8), chromeMat);
  handlebar.rotation.z = Math.PI / 2;
  handlebar.position.set(0, 1.02, -0.68);
  g.add(handlebar);

  [-0.28, 0.28].forEach((mx) => {
    const mirrorStem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.18, 6), darkMat);
    mirrorStem.position.set(mx, 1.12, -0.7);
    g.add(mirrorStem);

    const mirrorHead = new THREE.Mesh(new THREE.CircleGeometry(0.05, 12), chromeMat);
    mirrorHead.position.set(mx, 1.2, -0.7);
    g.add(mirrorHead);
  });

  // 5. 5-Spoke Alloy Wheels with Ventilated Disc Brakes & Red Calipers
  const buildBikeWheel = (hasDisc: boolean = true) => {
    const wg = new THREE.Group();

    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.13, 20), tireMat);
    tire.rotation.z = Math.PI / 2;
    wg.add(tire);

    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.14, 16), darkMat);
    rim.rotation.z = Math.PI / 2;
    wg.add(rim);

    // 5 Spokes
    for (let s = 0; s < 5; s++) {
      const angle = (s * Math.PI * 2) / 5;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.25, 0.02), darkMat);
      spoke.rotation.x = angle;
      wg.add(spoke);
    }

    if (hasDisc) {
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 14), chromeMat);
      disc.rotation.z = Math.PI / 2;
      disc.position.x = -0.06;
      wg.add(disc);

      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.08), caliperMat);
      caliper.position.set(-0.06, 0.12, 0);
      wg.add(caliper);
    }

    return wg;
  };

  const frontWheel = buildBikeWheel(true);
  frontWheel.position.set(0, 0.36, -0.85);
  g.add(frontWheel);

  const rearWheel = buildBikeWheel(true);
  rearWheel.position.set(0, 0.36, 0.78);
  g.add(rearWheel);

  // 6. Commuter Rider Figure
  const riderTorso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.54, 0.28), jacketMat);
  riderTorso.position.set(0, 1.15, 0.1);
  riderTorso.rotation.x = -0.32; // leaning into the wind
  g.add(riderTorso);

  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), helmetMat);
  helmet.position.set(0, 1.54, 0.0);
  g.add(helmet);

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.09, 0.12), visorMat);
  visor.position.set(0, 1.54, -0.14);
  g.add(visor);

  return g;
}

/**
 * Builds a realistic Inter-District Heavy Coach Bus (e.g. Pabna Express, Shyamoli, C-Line)
 * with aerodynamic high-deck body, tinted panoramic windows, bus livery, roof luggage rack,
 * dual rear wheels, chrome wheel caps, rubber mudflaps, and front destination marquee.
 */
export function createBusMesh(
  busNameBn: string = 'পাবনা এক্সপ্রেস',
  routeBn: string = 'পাবনা - ঢাকা',
  colorHex: number = 0xdc2626,
  maxAnisotropy: number = 4
): THREE.Group {
  const g = new THREE.Group();

  const colorHexStr = '#' + colorHex.toString(16).padStart(6, '0');
  const liveryTex = createBusLiveryTexture(busNameBn, routeBn, colorHexStr, maxAnisotropy);

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: liveryTex,
    roughness: 0.35,
    metalness: 0.3,
  });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.15, metalness: 0.95 });
  const darkTrimMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7, metalness: 0.3 });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.08,
    metalness: 0.85,
    transparent: true,
    opacity: 0.88,
  });
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9, metalness: 0.05 });
  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xfef08a,
    emissiveIntensity: 1.8,
  });
  const taillightMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 1.8,
  });

  // 1. Aerodynamic High-Deck Bus Coach Body (10.4m long, 2.85m wide, 3.2m tall)
  const coachBody = new THREE.Mesh(new THREE.BoxGeometry(2.85, 3.2, 10.4), bodyMat);
  coachBody.position.set(0, 1.95, 0);
  coachBody.castShadow = true;
  coachBody.receiveShadow = true;
  g.add(coachBody);

  // Aerodynamic rounded front cap / brow
  const frontCap = new THREE.Mesh(
    new THREE.CylinderGeometry(1.42, 1.42, 2.85, 16, 1, false, 0, Math.PI * 0.5),
    bodyMat
  );
  frontCap.rotation.z = Math.PI / 2;
  frontCap.rotation.y = Math.PI / 2;
  frontCap.position.set(0, 3.15, -4.8);
  g.add(frontCap);

  // 2. Panoramic Windshield (front split glass with black pillar)
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.35, 0.08), glassMat);
  windshield.position.set(0, 2.4, -5.22);
  windshield.rotation.x = -0.12;
  g.add(windshield);

  // Dual Windshield Wipers
  [-0.6, 0.6].forEach((wx) => {
    const wiper = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.7, 6), darkTrimMat);
    wiper.rotation.z = wx < 0 ? -0.4 : 0.4;
    wiper.position.set(wx, 2.15, -5.26);
    g.add(wiper);
  });

  // Destination Electronic Marquee Signboard above Windshield
  const marqueeSign = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.38, 0.06),
    new THREE.MeshStandardMaterial({
      color: 0x090d16,
      emissive: 0xfacc15,
      emissiveIntensity: 0.9,
    })
  );
  marqueeSign.position.set(0, 3.25, -5.16);
  g.add(marqueeSign);

  // 3. Front Grille & Projector Headlights
  const grille = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.55, 0.08), chromeMat);
  grille.position.set(0, 0.95, -5.22);
  g.add(grille);

  // Heavy Front Bumper with Tow Hooks
  const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.45, 0.3), darkTrimMat);
  frontBumper.position.set(0, 0.55, -5.25);
  g.add(frontBumper);

  // Headlight clusters (triple projector LEDs on each side)
  [-1.05, 1.05].forEach((hx) => {
    const hlHousing = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.28, 0.1), chromeMat);
    hlHousing.position.set(hx, 1.05, -5.22);
    g.add(hlHousing);

    for (let c = -1; c <= 1; c++) {
      const projector = new THREE.Mesh(new THREE.CircleGeometry(0.065, 12), headlightMat);
      projector.position.set(hx + c * 0.13, 1.05, -5.28);
      g.add(projector);
    }
  });

  // Fog Lamps in Bumper
  [-0.8, 0.8].forEach((fx) => {
    const fog = new THREE.Mesh(new THREE.CircleGeometry(0.08, 12), headlightMat);
    fog.position.set(fx, 0.55, -5.41);
    g.add(fog);
  });

  // 4. Roof Luggage Rack with Wrapped Tarpaulin Cargo (পাবনা দূরপাল্লার বাস মালামাল ক্যারিয়ার)
  const rackMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4, metalness: 0.8 });
  const tarpMat = new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.85 });
  const blueTarpMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.85 });

  const rackFrame = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.2, 5.8), rackMat);
  rackFrame.position.set(0, 3.65, 0.5);
  g.add(rackFrame);

  // Cargo bundles
  const cargo1 = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.65, 2.6), tarpMat);
  cargo1.position.set(0, 4.0, -0.6);
  g.add(cargo1);

  const cargo2 = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.55, 2.4), blueTarpMat);
  cargo2.position.set(0, 3.95, 1.8);
  g.add(cargo2);

  // 5. Heavy-Duty 6 Wheels (2 front, 4 dual-rear)
  const buildBusWheel = (isDual: boolean = false) => {
    const wg = new THREE.Group();
    const tireGeo = new THREE.CylinderGeometry(0.55, 0.55, isDual ? 0.62 : 0.32, 20);
    tireGeo.rotateZ(Math.PI / 2);
    const tire = new THREE.Mesh(tireGeo, tireMat);
    wg.add(tire);

    const rimGeo = new THREE.CylinderGeometry(0.36, 0.36, isDual ? 0.64 : 0.34, 16);
    rimGeo.rotateZ(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeo, chromeMat);
    wg.add(rim);

    const hubCap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, isDual ? 0.66 : 0.36, 12), chromeMat);
    hubCap.rotation.z = Math.PI / 2;
    wg.add(hubCap);

    return wg;
  };

  // Front Wheels
  const flWheel = buildBusWheel(false);
  flWheel.position.set(-1.38, 0.55, -3.2);
  g.add(flWheel);

  const frWheel = buildBusWheel(false);
  frWheel.position.set(1.38, 0.55, -3.2);
  g.add(frWheel);

  // Dual Rear Wheels
  const rlWheel = buildBusWheel(true);
  rlWheel.position.set(-1.32, 0.55, 2.8);
  g.add(rlWheel);

  const rrWheel = buildBusWheel(true);
  rrWheel.position.set(1.32, 0.55, 2.8);
  g.add(rrWheel);

  // Heavy Rubber Mudflaps behind Rear Wheels
  const mudflapMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.95 });
  [-1.32, 1.32].forEach((mx) => {
    const flap = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.55, 0.04), mudflapMat);
    flap.position.set(mx, 0.45, 3.45);
    g.add(flap);
  });

  // 6. Rear Tailgate with Vertical LED Lights & License Plate
  [-1.15, 1.15].forEach((tx) => {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.72, 0.06), taillightMat);
    tl.position.set(tx, 1.45, 5.22);
    g.add(tl);
  });

  // Rear Plate
  const rearPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.24, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 })
  );
  rearPlate.position.set(0, 0.95, 5.22);
  g.add(rearPlate);

  return g;
}

export interface PedestrianMeshRig {
  root: THREE.Group;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
  torso: THREE.Mesh;
}

/**
 * Builds realistic 3D animated pedestrian models with authentic Bangladeshi attire
 * (Zilla school uniform, lungi & shirt, office trousers)
 */
export function createPedestrianMesh(p: Pedestrian): PedestrianMeshRig {
  const root = new THREE.Group();
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xb4793f, roughness: 0.65 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.85 });
  const clothesMat = new THREE.MeshStandardMaterial({ color: p.colorHex, roughness: 0.7 });
  const pantsMat = new THREE.MeshStandardMaterial({
    color: p.type === 'student' ? 0x1e3a8a : p.type === 'lungi-man' ? p.colorHex : 0x1e293b,
    roughness: 0.75,
  });

  // Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.52, 0.22), clothesMat);
  torso.position.y = 1.05;
  torso.castShadow = true;
  root.add(torso);

  // Head & Hair
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), skinMat);
  head.position.y = 1.45;
  root.add(head);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.145, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.55),
    hairMat
  );
  hair.position.set(0, 1.47, 0.02);
  root.add(hair);

  // Animated Limbs
  const legGeo = new THREE.BoxGeometry(0.12, 0.56, 0.12);
  legGeo.translate(0, -0.28, 0);

  const leftLeg = new THREE.Mesh(legGeo, pantsMat);
  leftLeg.position.set(-0.1, 0.78, 0);
  root.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, pantsMat);
  rightLeg.position.set(0.1, 0.78, 0);
  root.add(rightLeg);

  const armGeo = new THREE.BoxGeometry(0.1, 0.46, 0.1);
  armGeo.translate(0, -0.23, 0);

  const leftArm = new THREE.Mesh(armGeo, clothesMat);
  leftArm.position.set(-0.25, 1.25, 0);
  root.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, clothesMat);
  rightArm.position.set(0.25, 1.25, 0);
  root.add(rightArm);

  root.position.set(p.x, 0, p.z);
  root.rotation.y = p.heading;
  return { root, leftLeg, rightLeg, leftArm, rightArm, torso };
}

/**
 * Builds realistic, composite 3D Pabna Landmark buildings and monuments:
 * - Shohid Abdul Hamid Road Ceremonial Memorial Arch
 * - Shapla Chattar (National Water Lily Roundabout Monument & Fountain)
 * - Pabna Zilla School (Colonial Red Terracotta Brick Heritage Campus · Est. 1853)
 * - Robiul Market Multi-Storey Commercial Mall
 * - Ananta Cinema Hall Art-Deco Palace & Marquee
 * - Pabna Central Bus Terminal with Inter-District Coaches
 * - Pabna Town Hall & Indara Mor Civic Rally Grounds
 * - Govt. Edward College (Colonial Red-Brick Academic Wings · Est. 1898)
 * - Pabna Mental Hospital & Hemayetpur Satsang Ashram Gate
 * - Paksey Hardinge Bridge Steel Truss Memorial
 */
export function createLandmarkMesh(landmark: Landmark, maxAnisotropy: number = 4): THREE.Group {
  const g = new THREE.Group();
  g.position.set(landmark.x, 0, landmark.z);

  const signTex = createLandmarkSignTexture(
    landmark.nameBn,
    landmark.nameEn,
    landmark.subtitleBn,
    landmark.type === 'school' || landmark.type === 'college'
      ? '#7f1d1d'
      : landmark.type === 'market'
      ? '#0f172a'
      : landmark.type === 'cinema'
      ? '#4a044e'
      : landmark.type === 'terminal'
      ? '#064e3b'
      : landmark.type === 'hospital'
      ? '#3b0764'
      : '#1e293b',
    landmark.accentColor,
    maxAnisotropy
  );
  const signMat = new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide });

  if (landmark.type === 'road-arch') {
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.1 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.5 });
    const graniteMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });

    [-11.0, 11.0].forEach((px) => {
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 2.4), graniteMat);
      plinth.position.set(px, 0.7, 0);
      g.add(plinth);

      const col = new THREE.Mesh(new THREE.BoxGeometry(1.6, 9.2, 1.6), pillarMat);
      col.position.set(px, 5.3, 0);
      col.castShadow = true;
      g.add(col);

      const cap = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 2.2), trimMat);
      cap.position.set(px, 10.2, 0);
      g.add(cap);
    });

    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(24.5, 3.2, 1.4), trimMat);
    topBeam.position.set(0, 10.6, 0);
    g.add(topBeam);

    const pediment = new THREE.Mesh(new THREE.ConeGeometry(4.5, 2.2, 4), trimMat);
    pediment.rotation.y = Math.PI / 4;
    pediment.position.set(0, 13.0, 0);
    g.add(pediment);

    const frontSign = new THREE.Mesh(new THREE.PlaneGeometry(18.5, 2.8), signMat);
    frontSign.position.set(0, 10.6, 0.75);
    g.add(frontSign);

    const backSign = new THREE.Mesh(new THREE.PlaneGeometry(18.5, 2.8), signMat);
    backSign.position.set(0, 10.6, -0.75);
    backSign.rotation.y = Math.PI;
    g.add(backSign);

    return g;
  }

  if (landmark.type === 'chattar') {
    const curbMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.8,
    });
    const shaplaMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.1,
    });
    const pinkMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.3,
    });
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.4,
    });

    const island = new THREE.Mesh(new THREE.CylinderGeometry(12, 12, 0.45, 32), curbMat);
    island.position.y = 0.22;
    g.add(island);

    const pool = new THREE.Mesh(new THREE.CylinderGeometry(9.5, 9.5, 0.3, 32), waterMat);
    pool.position.y = 0.55;
    g.add(pool);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.2, 6.5, 16), stemMat);
    stem.position.y = 3.6;
    g.add(stem);

    for (let p = 0; p < 8; p++) {
      const angle = (p * Math.PI) / 4;
      const petal = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4.2, 4), p % 2 === 0 ? shaplaMat : pinkMat);
      petal.rotation.z = 0.55;
      petal.rotation.y = angle;
      petal.position.set(Math.cos(angle) * 1.6, 6.2, Math.sin(angle) * 1.6);
      g.add(petal);
    }

    const postMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.6 });
    const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.2, 8), postMat);
    postL.position.set(-3.2, 2.1, 13.5);
    g.add(postL);
    const postR = postL.clone();
    postR.position.x = 3.2;
    g.add(postR);
    const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 2.2), signMat);
    signBoard.position.set(0, 3.6, 13.5);
    g.add(signBoard);

    return g;
  }

  const facingAngle = landmark.x < 0 ? Math.PI / 2 : -Math.PI / 2;
  g.rotation.y = facingAngle;

  const roadsideSignGroup = new THREE.Group();
  roadsideSignGroup.position.set(0, 0, 7.5);
  roadsideSignGroup.rotation.y = -facingAngle;
  const postMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.6 });
  const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 5.4, 8), postMat);
  postL.position.set(-3.5, 2.7, 0);
  roadsideSignGroup.add(postL);
  const postR = postL.clone();
  postR.position.x = 3.5;
  roadsideSignGroup.add(postR);

  const roadSignFront = new THREE.Mesh(new THREE.PlaneGeometry(8.0, 2.4), signMat);
  roadSignFront.position.set(0, 4.5, 0.16);
  roadsideSignGroup.add(roadSignFront);
  const roadSignBack = new THREE.Mesh(new THREE.PlaneGeometry(8.0, 2.4), signMat);
  roadSignBack.position.set(0, 4.5, -0.16);
  roadSignBack.rotation.y = Math.PI;
  roadsideSignGroup.add(roadSignBack);
  g.add(roadsideSignGroup);

  if (landmark.type === 'school') {
    const brickTex = createHeritageBrickTexture(maxAnisotropy);
    const brickMat = new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.85 });
    const creamMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.45 });

    const mainBlock = new THREE.Mesh(new THREE.BoxGeometry(32, 10.5, 12), brickMat);
    mainBlock.position.set(0, 5.25, -6);
    mainBlock.castShadow = true;
    mainBlock.receiveShadow = true;
    g.add(mainBlock);

    const tower = new THREE.Mesh(new THREE.BoxGeometry(8.2, 15.5, 13), brickMat);
    tower.position.set(0, 7.75, -5.5);
    g.add(tower);

    const clockGeo = new THREE.CircleGeometry(1.2, 24);
    const clockMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfef08a,
      emissiveIntensity: 0.6,
    });
    const clockFace = new THREE.Mesh(clockGeo, clockMat);
    clockFace.position.set(0, 13.5, 1.1);
    g.add(clockFace);

    for (let px = -13; px <= 13; px += 3.8) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.48, 10.2, 12), creamMat);
      col.position.set(px, 5.1, 0.4);
      g.add(col);
    }

    const gateLeft = new THREE.Mesh(new THREE.BoxGeometry(1.5, 6.5, 1.5), brickMat);
    gateLeft.position.set(-6.2, 3.25, 11.5);
    g.add(gateLeft);
    const gateRight = gateLeft.clone();
    gateRight.position.x = 6.2;
    g.add(gateRight);

    const gateSign = new THREE.Mesh(new THREE.PlaneGeometry(14.5, 3.4), signMat);
    gateSign.position.set(0, 6.2, 12.25);
    g.add(gateSign);
  } else if (landmark.type === 'college') {
    const brickTex = createHeritageBrickTexture(maxAnisotropy);
    const brickMat = new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.85 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });

    const collegeBlock = new THREE.Mesh(new THREE.BoxGeometry(34, 11, 14), brickMat);
    collegeBlock.position.set(0, 5.5, -6);
    collegeBlock.castShadow = true;
    g.add(collegeBlock);

    const portico = new THREE.Mesh(new THREE.BoxGeometry(12, 13, 6), whiteMat);
    portico.position.set(0, 6.5, 2);
    g.add(portico);

    const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(15.5, 3.8), signMat);
    signBoard.position.set(0, 8.5, 5.1);
    g.add(signBoard);
  } else if (landmark.type === 'market') {
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.45 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.15, metalness: 0.85 });
    const accentMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.4 });

    const building = new THREE.Mesh(new THREE.BoxGeometry(29, 15.5, 14), wallMat);
    building.position.set(0, 7.75, -4);
    building.castShadow = true;
    g.add(building);

    for (let floor = 1; floor <= 3; floor++) {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(30.2, 0.45, 15.2), accentMat);
      slab.position.set(0, floor * 4.4, -4);
      g.add(slab);

      const windowBand = new THREE.Mesh(new THREE.BoxGeometry(27.5, 2.8, 0.3), glassMat);
      windowBand.position.set(0, floor * 4.4 - 1.8, 3.05);
      g.add(windowBand);
    }

    const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(16.5, 4.0), signMat);
    signBoard.position.set(0, 7.8, 3.45);
    g.add(signBoard);
  } else if (landmark.type === 'cinema') {
    const hallMat = new THREE.MeshStandardMaterial({ color: 0xfae8ff, roughness: 0.5 });
    const marqueeMat = new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.35 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.25, metalness: 0.6 });

    const auditorium = new THREE.Mesh(new THREE.BoxGeometry(27, 12.5, 16), hallMat);
    auditorium.position.set(0, 6.25, -5);
    auditorium.castShadow = true;
    g.add(auditorium);

    const tower = new THREE.Mesh(new THREE.BoxGeometry(9, 18, 6.5), marqueeMat);
    tower.position.set(0, 9.0, 1.5);
    g.add(tower);

    const canopy = new THREE.Mesh(new THREE.BoxGeometry(21, 0.9, 5.8), goldMat);
    canopy.position.set(0, 4.4, 4.8);
    g.add(canopy);

    const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(16.5, 4.2), signMat);
    signBoard.position.set(0, 8.2, 4.85);
    g.add(signBoard);
  } else if (landmark.type === 'terminal') {
    const concMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.65 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.4 });

    const terminalHall = new THREE.Mesh(new THREE.BoxGeometry(38, 9.0, 12), concMat);
    terminalHall.position.set(0, 4.5, -10);
    terminalHall.castShadow = true;
    g.add(terminalHall);

    const canopyRoof = new THREE.Mesh(new THREE.BoxGeometry(40, 1.0, 19), roofMat);
    canopyRoof.position.set(0, 9.1, -4);
    g.add(canopyRoof);

    const busData = [
      { name: 'পাবনা এক্সপ্রেস', route: 'পাবনা - ঢাকা', color: '#dc2626' },
      { name: 'শ্যামলী স্পেশাল', route: 'পাবনা - চট্টগ্রাম', color: '#16a34a' },
      { name: 'সি-লাইন ট্রাভেলস', route: 'পাবনা - সিলেট', color: '#2563eb' },
    ];

    [-11, 0, 11].forEach((bx, idx) => {
      const bInfo = busData[idx];
      const liveryTex = createBusLiveryTexture(bInfo.name, bInfo.route, bInfo.color, maxAnisotropy);
      const coach = new THREE.Mesh(
        new THREE.BoxGeometry(2.9, 3.4, 10.0),
        new THREE.MeshStandardMaterial({ map: liveryTex, roughness: 0.35, metalness: 0.25 })
      );
      coach.position.set(bx, 1.9, 2.5);
      coach.castShadow = true;
      g.add(coach);
    });

    const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(19, 4.4), signMat);
    signBoard.position.set(0, 11.0, 5.2);
    g.add(signBoard);
  } else if (landmark.type === 'hospital') {
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 });

    const pavilion = new THREE.Mesh(new THREE.BoxGeometry(32, 10, 14), wallMat);
    pavilion.position.set(0, 5.0, -6);
    g.add(pavilion);

    const crossV = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.2, 0.2), redMat);
    crossV.position.set(0, 6.0, 1.1);
    g.add(crossV);
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.2, 0.2), redMat);
    crossH.position.set(0, 6.0, 1.1);
    g.add(crossH);

    const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(16.5, 3.8), signMat);
    signBoard.position.set(0, 9.2, 1.2);
    g.add(signBoard);
  } else if (landmark.type === 'bridge') {
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4, metalness: 0.85 });
    const pierMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });

    [-10, 10].forEach((px) => {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(2.4, 6.0, 6.0), pierMat);
      pier.position.set(px, 3.0, 0);
      g.add(pier);
    });

    const deck = new THREE.Mesh(new THREE.BoxGeometry(26, 0.8, 5.0), steelMat);
    deck.position.set(0, 6.2, 0);
    g.add(deck);

    for (let bx = -9; bx <= 9; bx += 4.5) {
      const truss = new THREE.Mesh(new THREE.BoxGeometry(0.35, 5.5, 0.35), steelMat);
      truss.position.set(bx, 9.0, 2.3);
      g.add(truss);
      const trussR = truss.clone();
      trussR.position.z = -2.3;
      g.add(trussR);
    }

    const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(16.5, 3.8), signMat);
    signBoard.position.set(0, 7.5, 3.2);
    g.add(signBoard);
  } else {
    const stageMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.55 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.45 });

    const podium = new THREE.Mesh(new THREE.BoxGeometry(26, 1.8, 13), stageMat);
    podium.position.set(0, 0.9, -4);
    g.add(podium);

    const backdrop = new THREE.Mesh(new THREE.BoxGeometry(24, 9.0, 1.2), redMat);
    backdrop.position.set(0, 5.4, -9);
    g.add(backdrop);

    const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(17, 4.0), signMat);
    signBoard.position.set(0, 6.5, -8.3);
    g.add(signBoard);
  }

  return g;
}
