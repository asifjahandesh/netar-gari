import * as THREE from 'three';
import { Landmark, PaintFinish } from './rules';
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
    roughness: 0.2,
    metalness: 0.75,
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
    // Projector lens housing
    const hlHousing = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.24, 0.1), darkTrimMat);
    hlHousing.position.set(hx, 0.94, -2.42);
    bodyGroup.add(hlHousing);

    // Glowing LED Projector Core
    const hlCore = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), headlightLensMat);
    hlCore.position.set(hx * 0.96, 0.94, -2.46);
    bodyGroup.add(hlCore);

    // DRL Brow Strip
    const drl = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.03, 0.04), drlMat);
    drl.position.set(hx, 1.05, -2.45);
    bodyGroup.add(drl);

    // Amber Turn Indicator Pod
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

    // Bangladesh Flag (Bottle Green with Red Sun disc)
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

  // Chrome Frame around the rear signboard
  const rearPlaqueFrame = new THREE.Mesh(new THREE.BoxGeometry(2.02, 1.02, 0.08), chromeMat);
  rearPlaqueFrame.position.set(0, 1.35, 2.44);
  bodyGroup.add(rearPlaqueFrame);

  // Signboard Surface
  const rearSignPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.95, 0.96), rearSignMat);
  rearSignPlane.position.set(0, 1.35, 2.49);
  bodyGroup.add(rearSignPlane);

  // Rear LED Taillight clusters
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

  // Compact Spare Wheel Emblem mounted below signboard
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

  // Torso (Mujib Coat over White Panjabi)
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.6, 0.3), mujibCoatMat);
  torso.position.set(0, 0.3, 0);
  leaderGroup.add(torso);

  // Standing Mandarin Collar
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.1, 16), mujibCoatMat);
  collar.position.set(0, 0.64, 0);
  leaderGroup.add(collar);

  // Panjabi White Strip in Middle
  const whiteStrip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.58, 0.32), panjabiMat);
  whiteStrip.position.set(0, 0.3, 0);
  leaderGroup.add(whiteStrip);

  // 6 Metallic Buttons on Mujib Coat
  for (let b = 0; b < 6; b++) {
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.01, 8), chromeMat);
    btn.rotation.x = Math.PI / 2;
    btn.position.set(0.04, 0.12 + b * 0.08, -0.16);
    leaderGroup.add(btn);
  }

  // Head & Hair & Glasses
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), skinMat);
  head.position.set(0, 0.76, 0);
  leaderGroup.add(head);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.186, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
    hairMat
  );
  hair.position.set(0, 0.78, 0.02);
  leaderGroup.add(hair);

  // Black-Rimmed Spectacles
  const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.04), darkTrimMat);
  glasses.position.set(0, 0.78, -0.18);
  leaderGroup.add(glasses);

  // Left Arm resting on sunroof rim
  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.44, 0.13), panjabiMat);
  leftArm.position.set(-0.32, 0.32, -0.05);
  leftArm.rotation.z = 0.28;
  leaderGroup.add(leftArm);

  // Right Arm (Articulated Waving Salute Arm)
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

    // Rubber Tire with tread width
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.34, 24), tireMat);
    tire.rotation.z = Math.PI / 2;
    wg.add(tire);

    // Rim Outer Band
    const rimBand = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.36, 20), rimMat);
    rimBand.rotation.z = Math.PI / 2;
    wg.add(rimBand);

    // 6 Alloy Spokes
    for (let s = 0; s < 6; s++) {
      const angle = (s * Math.PI) / 3;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.28, 0.05), rimMat);
      spoke.rotation.x = angle;
      wg.add(spoke);
    }

    // Ventilated Brake Disc
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 16), discMat);
    disc.rotation.z = Math.PI / 2;
    disc.position.x = -0.05;
    wg.add(disc);

    // Red Performance Brake Caliper
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
 * Builds an authentic Bangladeshi Green CNG Auto-Rickshaw (3-wheeler) with curved cowl & wire mesh cage
 */
export function createCngAutoMesh(colorHex: number = 0x15803d): THREE.Group {
  const g = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.35, metalness: 0.4 });
  const hoodMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.85 });
  const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, metalness: 0.2 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.85 });
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 });
  const meshMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.7 });

  // Lower cabin tub
  const tub = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.72, 2.3), bodyMat);
  tub.position.set(0, 0.54, 0.1);
  g.add(tub);

  // Aerodynamic curved front nose cone
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.68, 0.95, 8), bodyMat);
  nose.rotation.x = -Math.PI / 2;
  nose.rotation.z = Math.PI / 4;
  nose.position.set(0, 0.54, -1.25);
  g.add(nose);

  // Black vinyl waterproof roof canopy
  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.68, 1.9), hoodMat);
  hood.position.set(0, 1.2, 0.2);
  g.add(hood);

  // Yellow safety belt line around waist
  const waistStripe = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.16, 2.34), yellowMat);
  waistStripe.position.set(0, 0.88, 0.1);
  g.add(waistStripe);

  // Side Passenger Protective Wire Mesh Bars (authentic detail)
  [-0.64, 0.64].forEach((sx) => {
    for (let by = 0.95; by < 1.45; by += 0.12) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.6, 8), meshMat);
      bar.rotation.x = Math.PI / 2;
      bar.position.set(sx, by, 0.3);
      g.add(bar);
    }
  });

  // Front round chrome headlight
  const hlBezel = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 16), chromeMat);
  hlBezel.rotation.x = Math.PI / 2;
  hlBezel.position.set(0, 0.66, -1.62);
  g.add(hlBezel);

  const hlCore = new THREE.Mesh(
    new THREE.CircleGeometry(0.12, 16),
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  hlCore.position.set(0, 0.66, -1.67);
  g.add(hlCore);

  // 3 Wheels (1 front centered, 2 rear)
  const wGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.18, 16);
  wGeo.rotateZ(Math.PI / 2);

  const fw = new THREE.Mesh(wGeo, wheelMat);
  fw.position.set(0, 0.28, -1.3);
  g.add(fw);

  const rlw = new THREE.Mesh(wGeo, wheelMat);
  rlw.position.set(-0.64, 0.28, 0.9);
  g.add(rlw);

  const rrw = new THREE.Mesh(wGeo, wheelMat);
  rrw.position.set(0.64, 0.28, 0.9);
  g.add(rrw);

  return g;
}

/**
 * Builds a colorful Bangladeshi Cycle Rickshaw with puller, folding hood & painted folk art (রিকশা আর্ট)
 */
export function createCycleRickshawMesh(
  hoodColorHex: number = 0xeab308,
  maxAnisotropy: number = 4
): THREE.Group {
  const g = new THREE.Group();

  const hoodMat = new THREE.MeshStandardMaterial({ color: hoodColorHex, roughness: 0.6 });
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.45, metalness: 0.75 });
  const seatMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xc68642, roughness: 0.6 });
  const lungiMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.75 });

  // Passenger platform & seat
  const platform = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.12, 1.2), frameMat);
  platform.position.set(0, 0.48, 0.55);
  g.add(platform);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.38, 0.58), seatMat);
  seat.position.set(0, 0.7, 0.72);
  g.add(seat);

  // Curved folding rickshaw hood
  const hood = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.58, 1.05, 16, 1, false, 0, Math.PI),
    hoodMat
  );
  hood.rotation.z = Math.PI / 2;
  hood.position.set(0, 1.18, 0.68);
  g.add(hood);

  // Authentic Painted Rickshaw Art Backboard (ঐতিহ্যবাহী রিকশা আর্ট)
  const artTex = createRickshawArtTexture(hoodColorHex, maxAnisotropy);
  const backBoard = new THREE.Mesh(
    new THREE.PlaneGeometry(1.02, 0.52),
    new THREE.MeshBasicMaterial({ map: artTex, side: THREE.DoubleSide })
  );
  backBoard.position.set(0, 0.94, 1.16);
  g.add(backBoard);

  // Bicycle front frame & chrome handlebars
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.45), frameMat);
  bar.position.set(0, 0.52, -0.25);
  g.add(bar);

  // Rickshaw Puller (Wallah in lungi & shirt)
  const pullerTorso = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.48, 0.24), lungiMat);
  pullerTorso.position.set(0, 1.0, -0.45);
  g.add(pullerTorso);

  const pullerHead = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), skinMat);
  pullerHead.position.set(0, 1.36, -0.45);
  g.add(pullerHead);

  // 3 Thin spoked wheels with chrome hubs
  const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.06, 20);
  wheelGeo.rotateZ(Math.PI / 2);

  const fw = new THREE.Mesh(wheelGeo, frameMat);
  fw.position.set(0, 0.4, -0.98);
  g.add(fw);

  const lw = new THREE.Mesh(wheelGeo, frameMat);
  lw.position.set(-0.58, 0.4, 0.76);
  g.add(lw);

  const rw = new THREE.Mesh(wheelGeo, frameMat);
  rw.position.set(0.58, 0.4, 0.76);
  g.add(rw);

  return g;
}

/**
 * Builds a modern 150cc commuter motorbike + helmeted rider
 */
export function createMotorbikeMesh(colorHex: number = 0xdc2626): THREE.Group {
  const g = new THREE.Group();

  const bikeMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.25, metalness: 0.65 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7, metalness: 0.4 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.15, metalness: 0.9 });
  const jacketMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65 });
  const helmetMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.5 });

  // Contoured fuel tank & body
  const tank = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.44, 1.65), bikeMat);
  tank.position.set(0, 0.58, 0);
  g.add(tank);

  // Chrome exhaust pipe
  const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1, 8), chromeMat);
  exhaust.rotation.x = Math.PI / 2;
  exhaust.position.set(0.2, 0.35, 0.3);
  g.add(exhaust);

  // Angular Headlight
  const hl = new THREE.Mesh(
    new THREE.BoxGeometry(0.26, 0.2, 0.1),
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  hl.position.set(0, 0.78, -0.88);
  g.add(hl);

  // Rider
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.52, 0.28), jacketMat);
  torso.position.set(0, 1.05, 0.08);
  torso.rotation.x = -0.18;
  g.add(torso);

  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 14), helmetMat);
  helmet.position.set(0, 1.42, 0.0);
  g.add(helmet);

  // 2 Alloy Wheels
  const wGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.14, 16);
  wGeo.rotateZ(Math.PI / 2);

  const fw = new THREE.Mesh(wGeo, darkMat);
  fw.position.set(0, 0.34, -0.72);
  g.add(fw);

  const rw = new THREE.Mesh(wGeo, darkMat);
  rw.position.set(0, 0.34, 0.72);
  g.add(rw);

  return g;
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
    // Monumental Ceremonial Arch spanning across Abdul Hamid Road (X = 0)
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.1 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.5 });
    const graniteMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });

    [-11.0, 11.0].forEach((px) => {
      // Tiered Granite Plinth
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 2.4), graniteMat);
      plinth.position.set(px, 0.7, 0);
      g.add(plinth);

      // Fluted Classical Column Shaft
      const col = new THREE.Mesh(new THREE.BoxGeometry(1.6, 9.2, 1.6), pillarMat);
      col.position.set(px, 5.3, 0);
      col.castShadow = true;
      g.add(col);

      // Golden Corinthian Capital
      const cap = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 2.2), trimMat);
      cap.position.set(px, 10.2, 0);
      g.add(cap);
    });

    // Overhead Spanning Beam & Triangular Pediment
    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(24.5, 3.2, 1.4), trimMat);
    topBeam.position.set(0, 10.6, 0);
    g.add(topBeam);

    const pediment = new THREE.Mesh(new THREE.ConeGeometry(4.5, 2.2, 4), trimMat);
    pediment.rotation.y = Math.PI / 4;
    pediment.position.set(0, 13.0, 0);
    g.add(pediment);

    // Double-sided illuminated signboards spanning the road
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
    // Shapla Chattar: Central Roundabout with Water Lily Monument & Tiered Fountain
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

    // Circular Island Base (Radius 12m)
    const island = new THREE.Mesh(new THREE.CylinderGeometry(12, 12, 0.45, 32), curbMat);
    island.position.y = 0.22;
    g.add(island);

    // Fountain Water Basin
    const pool = new THREE.Mesh(new THREE.CylinderGeometry(9.5, 9.5, 0.3, 32), waterMat);
    pool.position.y = 0.55;
    g.add(pool);

    // Central Stem Column
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.2, 6.5, 16), stemMat);
    stem.position.y = 3.6;
    g.add(stem);

    // 8 Sculpted Petals of the National Flower (Shapla / Water Lily)
    for (let p = 0; p < 8; p++) {
      const angle = (p * Math.PI) / 4;
      const petal = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4.2, 4), p % 2 === 0 ? shaplaMat : pinkMat);
      petal.rotation.z = 0.55;
      petal.rotation.y = angle;
      petal.position.set(Math.cos(angle) * 1.6, 6.2, Math.sin(angle) * 1.6);
      g.add(petal);
    }

    // Roadside Forward-Facing Signpost
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

  // Face building toward the main street
  const facingAngle = landmark.x < 0 ? Math.PI / 2 : -Math.PI / 2;
  g.rotation.y = facingAngle;

  // Roadside forward-facing signboard post right by the sidewalk so drivers read it head-on
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
    // Pabna Zilla School (Est. 1853): Colonial Terracotta Red Brick Campus + Clock Tower + Heritage Colonnade
    const brickTex = createHeritageBrickTexture(maxAnisotropy);
    const brickMat = new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.85 });
    const creamMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.45 });

    // Main 2-story academic block
    const mainBlock = new THREE.Mesh(new THREE.BoxGeometry(32, 10.5, 12), brickMat);
    mainBlock.position.set(0, 5.25, -6);
    mainBlock.castShadow = true;
    mainBlock.receiveShadow = true;
    g.add(mainBlock);

    // Multi-tiered Clock Tower (Central Heritage Feature)
    const tower = new THREE.Mesh(new THREE.BoxGeometry(8.2, 15.5, 13), brickMat);
    tower.position.set(0, 7.75, -5.5);
    g.add(tower);

    // Round Clock Faces on Tower
    const clockGeo = new THREE.CircleGeometry(1.2, 24);
    const clockMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfef08a,
      emissiveIntensity: 0.6,
    });
    const clockFace = new THREE.Mesh(clockGeo, clockMat);
    clockFace.position.set(0, 13.5, 1.1);
    g.add(clockFace);

    // Neoclassical Veranda Pillars
    for (let px = -13; px <= 13; px += 3.8) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.48, 10.2, 12), creamMat);
      col.position.set(px, 5.1, 0.4);
      g.add(col);
    }

    // Heritage Gate Arch by Footpath
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
    // Govt. Edward College (Est. 1898): Red-brick Collegiate Gothic/Colonial Complex
    const brickTex = createHeritageBrickTexture(maxAnisotropy);
    const brickMat = new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.85 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });

    const collegeBlock = new THREE.Mesh(new THREE.BoxGeometry(34, 11, 14), brickMat);
    collegeBlock.position.set(0, 5.5, -6);
    collegeBlock.castShadow = true;
    g.add(collegeBlock);

    // Arched Central Portico
    const portico = new THREE.Mesh(new THREE.BoxGeometry(12, 13, 6), whiteMat);
    portico.position.set(0, 6.5, 2);
    g.add(portico);

    const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(15.5, 3.8), signMat);
    signBoard.position.set(0, 8.5, 5.1);
    g.add(signBoard);
  } else if (landmark.type === 'market') {
    // Robiul Market: Modern commercial complex with glass curtain wall & balconies
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.45 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.15, metalness: 0.85 });
    const accentMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.4 });

    const building = new THREE.Mesh(new THREE.BoxGeometry(29, 15.5, 14), wallMat);
    building.position.set(0, 7.75, -4);
    building.castShadow = true;
    g.add(building);

    // Glass Curtain Bays & Floor Slabs
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
    // Ananta Cinema Hall: Art-Deco Marquee Palace + Movie Billboards
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
    // Pabna Central Bus Terminal: Passenger concourse + 3 parked authentic inter-district buses
    const concMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.65 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.4 });

    const terminalHall = new THREE.Mesh(new THREE.BoxGeometry(38, 9.0, 12), concMat);
    terminalHall.position.set(0, 4.5, -10);
    terminalHall.castShadow = true;
    g.add(terminalHall);

    const canopyRoof = new THREE.Mesh(new THREE.BoxGeometry(40, 1.0, 19), roofMat);
    canopyRoof.position.set(0, 9.1, -4);
    g.add(canopyRoof);

    // 3 Authentic Bangladeshi Long-Distance Buses (Pabna Express, Shyamoli, C-Line)
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
    // Pabna Mental Hospital & Hemayetpur Ashram Gate
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 });

    const pavilion = new THREE.Mesh(new THREE.BoxGeometry(32, 10, 14), wallMat);
    pavilion.position.set(0, 5.0, -6);
    g.add(pavilion);

    // Red Cross Medical Crest
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
    // Paksey Hardinge Bridge Steel Truss Memorial Monument
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4, metalness: 0.85 });
    const pierMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });

    // Bridge Concrete Piers
    [-10, 10].forEach((px) => {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(2.4, 6.0, 6.0), pierMat);
      pier.position.set(px, 3.0, 0);
      g.add(pier);
    });

    // Steel Cantilever Truss Girders
    const deck = new THREE.Mesh(new THREE.BoxGeometry(26, 0.8, 5.0), steelMat);
    deck.position.set(0, 6.2, 0);
    g.add(deck);

    // Crisscross Steel Bracing
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
    // Pabna Town Hall & Indara Mor Civic Square
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
