export type GameState = 'title' | 'playing' | 'paused' | 'gameover';

export type CameraMode = 'chase' | 'rear-closeup' | 'leader-pov' | 'aerial';

export type PaintFinish = 'obsidian-black' | 'pearl-white' | 'protocol-maroon';

export interface Landmark {
  id: string;
  nameBn: string;
  nameEn: string;
  subtitleBn: string;
  subtitleEn: string;
  x: number;
  z: number;
  heading: number; // Direction car faces when teleporting near it
  spawnX: number;
  spawnZ: number;
  radius: number;
  accentColor: string;
  type:
    | 'school'
    | 'market'
    | 'cinema'
    | 'terminal'
    | 'road-arch'
    | 'town-hall'
    | 'college'
    | 'hospital'
    | 'bridge'
    | 'chattar';
}

/**
 * Authentic Pabna City Landmarks along Abdul Hamid Road and connecting civic loops
 * Featuring all famous historical monuments, institutions, and markets of Pabna.
 */
export const PABNA_LANDMARKS: Landmark[] = [
  {
    id: 'abdul-hamid-road',
    nameBn: 'শহীদ আব্দুল হামিদ তোরণ',
    nameEn: 'Abdul Hamid Road Monument',
    subtitleBn: 'পাবনা শহরের প্রবেশদ্বার ও প্রধান বাণিজ্যিক তোরণ',
    subtitleEn: 'Grand Ceremonial Gateway to Central Pabna',
    x: 0,
    z: 115,
    heading: 0,
    spawnX: 0,
    spawnZ: 145,
    radius: 42,
    accentColor: '#f59e0b',
    type: 'road-arch',
  },
  {
    id: 'shapla-chattar',
    nameBn: 'শাপলা চত্বর ও ফোয়ারা',
    nameEn: 'Shapla Chattar Roundabout',
    subtitleBn: 'পাবনা শহরের কেন্দ্রীয় গোলচত্বর ও জাতীয় ফুল স্মৃতিস্তম্ভ',
    subtitleEn: 'National Water Lily Fountain & Civic Plaza',
    x: 0,
    z: 70,
    heading: 0,
    spawnX: -2.2,
    spawnZ: 98,
    radius: 40,
    accentColor: '#06b6d4',
    type: 'chattar',
  },
  {
    id: 'zilla-school',
    nameBn: 'পাবনা জিলা স্কুল',
    nameEn: 'Pabna Zilla School',
    subtitleBn: 'ঐতিহ্যবাহী বিদ্যাপীঠ · স্থাপিত ১৮৫৩',
    subtitleEn: 'Colonial Heritage Red Brick Campus · Est. 1853',
    x: -22,
    z: 18,
    heading: 0,
    spawnX: -2.2,
    spawnZ: 48,
    radius: 48,
    accentColor: '#ef4444',
    type: 'school',
  },
  {
    id: 'robiul-market',
    nameBn: 'রবিউল মার্কেট',
    nameEn: 'Robiul Market Plaza',
    subtitleBn: 'আব্দুল হামিদ রোড শপিং কমপ্লেক্স',
    subtitleEn: 'Multi-Storey Shopping & Electronics Hub',
    x: 22,
    z: -38,
    heading: 0,
    spawnX: -2.2,
    spawnZ: -8,
    radius: 45,
    accentColor: '#38bdf8',
    type: 'market',
  },
  {
    id: 'ananta-cinema',
    nameBn: 'অনন্ত সিনেমা হল ও মোড়',
    nameEn: 'Ananta Cinema Hall',
    subtitleBn: 'পাবনার ঐতিহাসিক প্রেক্ষাগৃহ ও চলচ্চিত্র চত্বর',
    subtitleEn: 'Classic Art-Deco Cinema Palace & Marquee',
    x: -22,
    z: -98,
    heading: 0,
    spawnX: -2.2,
    spawnZ: -68,
    radius: 46,
    accentColor: '#ec4899',
    type: 'cinema',
  },
  {
    id: 'bus-terminal',
    nameBn: 'পাবনা কেন্দ্রীয় বাস টার্মিনাল',
    nameEn: 'Pabna Central Bus Terminal',
    subtitleBn: 'আন্তঃজেলা কোচ টার্মিনাল ও পরিবহন চত্বর',
    subtitleEn: 'Inter-District Coach Concourse & Bays',
    x: 24,
    z: -168,
    heading: 0,
    spawnX: -2.2,
    spawnZ: -138,
    radius: 55,
    accentColor: '#10b981',
    type: 'terminal',
  },
  {
    id: 'town-hall',
    nameBn: 'পাবনা টাউন হল ও ইন্দারা মোড়',
    nameEn: 'Pabna Town Hall & Indara Mor',
    subtitleBn: 'জনসভা ময়দান ও বীর মুক্তিযোদ্ধা চত্বর',
    subtitleEn: 'Civic Rally Grounds & Historic Assembly Hall',
    x: 95,
    z: -70,
    heading: Math.PI,
    spawnX: 95,
    spawnZ: -110,
    radius: 50,
    accentColor: '#eab308',
    type: 'town-hall',
  },
  {
    id: 'edward-college',
    nameBn: 'সরকারি এডওয়ার্ড কলেজ',
    nameEn: 'Govt. Edward College',
    subtitleBn: 'ঐতিহাসিক বিদ্যাপীঠ · স্থাপিত ১৮৯৮',
    subtitleEn: 'Premier Colonial Academic Institution · Est. 1898',
    x: -95,
    z: -50,
    heading: 0,
    spawnX: -95,
    spawnZ: -15,
    radius: 52,
    accentColor: '#f97316',
    type: 'college',
  },
  {
    id: 'mental-hospital',
    nameBn: 'মানসিক হাসপাতাল ও অনুকূল আশ্রম',
    nameEn: 'Pabna Mental Hospital & Hemayetpur',
    subtitleBn: 'ঐতিহাসিক চিকিৎসালয় ও শ্রীশ্রী অনুকূলচন্দ্র আশ্রম',
    subtitleEn: 'Famous National Specialized Hospital · Est. 1953',
    x: -95,
    z: 75,
    heading: 0,
    spawnX: -95,
    spawnZ: 110,
    radius: 52,
    accentColor: '#a855f7',
    type: 'hospital',
  },
  {
    id: 'hardinge-bridge',
    nameBn: 'পাকশী হার্ডিঞ্জ ব্রিজ তোরণ',
    nameEn: 'Paksey Hardinge Bridge Memorial',
    subtitleBn: 'পাবনা জেলার ঐতিহ্যবাহী শতবর্ষী রেলসেতু তোরণ',
    subtitleEn: 'Historic Steel Truss Cantilever River Monument',
    x: 95,
    z: 75,
    heading: Math.PI,
    spawnX: 95,
    spawnZ: 40,
    radius: 52,
    accentColor: '#3b82f6',
    type: 'bridge',
  },
];

export interface AccidentNotice {
  textBn: string;
  amount: number;
  timestamp: number;
}

export interface AccidentEvent {
  type: 'pedestrian' | 'bike' | 'rickshaw' | 'cng' | 'bus';
  reward: number;
  labelBn: string;
  x: number;
  z: number;
}

export interface PlayerCarState {
  x: number;
  z: number;
  heading: number; // 0 = facing -Z (North up Abdul Hamid Road)
  speed: number; // meters per second (can be negative for reverse)
  steerAngle: number; // front wheel angle in radians
  bodyRoll: number;
  bodyPitch: number;
  hornTimer: number;
  sirenActive: boolean;
  waveTimer: number;
  distanceDriven: number;
  saluteCount: number;
  visitedLandmarks: string[];
  // Active BDT Currency & Accident System
  currency: number; // Currency in Taka (৳)
  accidentCount: number;
  chaKhaoyarTimer: number; // Countdown until crowd asks "ভাই চা খাওয়ার টাকা টা যদি......."
  chaKhaoyarActive: boolean;
  chaKhaoyarDeductCount: number;
  lastAccidentNotice: AccidentNotice | null;
}

export type TrafficType = 'cng' | 'rickshaw' | 'bike';

export interface TrafficVehicle {
  id: number;
  type: TrafficType;
  x: number;
  z: number;
  heading: number;
  speed: number;
  baseSpeed: number;
  laneOffset: number;
  targetLaneOffset: number;
  roadSegment: 'main-north' | 'main-south' | 'east-loop';
  scaredTimer: number;
  hitCooldown: number;
  phaseOffset: number;
  colorHex: number;
}

export type PedestrianType = 'student' | 'lungi-man' | 'office-worker';

export interface Pedestrian {
  id: number;
  type: PedestrianType;
  x: number;
  z: number;
  targetX: number;
  heading: number;
  speed: number;
  isFallen: boolean;
  tumbleTimer: number;
  hitCooldown: number;
  colorHex: number;
}

export interface CarInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  handbrake: boolean;
  boost: boolean;
}

export const CAR_CONFIG = {
  maxForwardSpeed: 38, // ~136 km/h top speed (unlimited road freedom)
  maxBoostSpeed: 50, // ~180 km/h with protocol boost
  maxReverseSpeed: -16,
  acceleration: 24,
  boostAcceleration: 38,
  braking: 36,
  reverseAcceleration: 16,
  naturalDrag: 5.5,
  turnRate: 2.35,
  maxSteerAngle: 0.52,
  worldWrapRadius: 420,
};

export function createInitialPlayerState(): PlayerCarState {
  return {
    x: -2.2,
    z: 135,
    heading: 0, // Facing North (-Z) straight down Abdul Hamid Road
    speed: 0,
    steerAngle: 0,
    bodyRoll: 0,
    bodyPitch: 0,
    hornTimer: 0,
    sirenActive: false,
    waveTimer: 0,
    distanceDriven: 0,
    saluteCount: 0,
    visitedLandmarks: ['abdul-hamid-road'],
    currency: 0,
    accidentCount: 0,
    chaKhaoyarTimer: 25, // First "চা খাওয়ার টাকা" prompt after 25s
    chaKhaoyarActive: false,
    chaKhaoyarDeductCount: 0,
    lastAccidentNotice: null,
  };
}

/**
 * Pure step function for updating player car physics.
 * No walls or movement restrictions exist: player can ride anywhere on or off road,
 * and extreme coordinates wrap smoothly around the greater Pabna district loop.
 */
export function stepPlayerCar(
  state: PlayerCarState,
  input: CarInput,
  rawDt: number
): PlayerCarState {
  const dt = Math.min(Math.max(rawDt, 0), 0.05);
  let { x, z, heading, speed, steerAngle, bodyRoll, bodyPitch, hornTimer, waveTimer, distanceDriven } = state;

  const maxSpeed = input.boost ? CAR_CONFIG.maxBoostSpeed : CAR_CONFIG.maxForwardSpeed;
  const accel = input.boost ? CAR_CONFIG.boostAcceleration : CAR_CONFIG.acceleration;

  let targetPitch = 0;

  if (input.handbrake) {
    // Handbrake strong deceleration
    if (Math.abs(speed) < 0.8) {
      speed = 0;
    } else {
      speed -= Math.sign(speed) * CAR_CONFIG.braking * 1.25 * dt;
    }
    targetPitch = speed > 1 ? 0.045 : 0;
  } else if (input.forward && !input.backward) {
    if (speed < 0) {
      speed += CAR_CONFIG.braking * dt;
    } else {
      speed = Math.min(maxSpeed, speed + accel * dt);
    }
    targetPitch = -0.035;
  } else if (input.backward && !input.forward) {
    if (speed > 0) {
      speed -= CAR_CONFIG.braking * dt;
      targetPitch = 0.04;
    } else {
      speed = Math.max(CAR_CONFIG.maxReverseSpeed, speed - CAR_CONFIG.reverseAcceleration * dt);
      targetPitch = 0.025;
    }
  } else {
    // Natural coasting drag
    if (Math.abs(speed) < 0.35) {
      speed = 0;
    } else {
      speed -= Math.sign(speed) * CAR_CONFIG.naturalDrag * dt;
    }
  }

  // Steering input
  let steerInput = 0;
  if (input.left) steerInput += 1;
  if (input.right) steerInput -= 1;

  const targetSteer = steerInput * CAR_CONFIG.maxSteerAngle;
  const steerLerp = 1 - Math.exp(-12 * dt);
  steerAngle = steerAngle + (targetSteer - steerAngle) * steerLerp;

  // Turning rate scales with movement and slightly boosts on handbrake drift
  const speedFactor = Math.min(1, Math.abs(speed) / 4.5);
  const directionSign = speed >= -0.1 ? 1 : -1;
  const driftMultiplier = input.handbrake && Math.abs(speed) > 6 ? 1.35 : 1.0;

  if (Math.abs(speed) > 0.05) {
    heading += steerInput * CAR_CONFIG.turnRate * speedFactor * directionSign * driftMultiplier * dt;
  }

  // Normalize heading to [-PI, PI]
  while (heading > Math.PI) heading -= Math.PI * 2;
  while (heading < -Math.PI) heading += Math.PI * 2;

  // Move car in world space (heading = 0 points along -Z, +PI/2 points along -X)
  const vx = -Math.sin(heading) * speed;
  const vz = -Math.cos(heading) * speed;

  x += vx * dt;
  z += vz * dt;

  // Smoothly wrap if driving extremely far out so road riding is truly endless
  if (z < -290) z += 540;
  if (z > 250) z -= 540;
  if (x < -240) x += 480;
  if (x > 240) x -= 480;

  distanceDriven += Math.abs(speed) * dt;

  // Body roll & pitch dynamics
  const targetRoll = -steerInput * Math.min(1, Math.abs(speed) / 22) * 0.065;
  const suspensionLerp = 1 - Math.exp(-10 * dt);
  bodyRoll = bodyRoll + (targetRoll - bodyRoll) * suspensionLerp;
  bodyPitch = bodyPitch + (targetPitch - bodyPitch) * suspensionLerp;

  hornTimer = Math.max(0, hornTimer - dt);
  waveTimer = Math.max(0, waveTimer - dt);

  // Random "ভাই চা খাওয়ার টাকা টা যদি......." event timer
  let { currency, accidentCount, chaKhaoyarTimer, chaKhaoyarActive, chaKhaoyarDeductCount, lastAccidentNotice } = state;
  chaKhaoyarTimer -= dt;
  if (chaKhaoyarTimer <= 0) {
    chaKhaoyarActive = true;
    chaKhaoyarTimer = 30 + Math.random() * 25; // Repeat every 30-55s
    const deduct = 1000;
    currency = Math.max(0, currency - deduct);
    chaKhaoyarDeductCount += 1;
    lastAccidentNotice = {
      textBn: 'ভাই চা খাওয়ার টাকা টা যদি....... (-১,০০০ ৳)',
      amount: -1000,
      timestamp: Date.now(),
    };
  }

  // Check nearby landmarks
  const visitedSet = new Set(state.visitedLandmarks);
  for (const lm of PABNA_LANDMARKS) {
    const dx = x - lm.x;
    const dz = z - lm.z;
    if (dx * dx + dz * dz <= lm.radius * lm.radius) {
      visitedSet.add(lm.id);
    }
  }

  return {
    ...state,
    x,
    z,
    heading,
    speed,
    steerAngle,
    bodyRoll,
    bodyPitch,
    hornTimer,
    waveTimer,
    distanceDriven,
    visitedLandmarks: Array.from(visitedSet),
    currency,
    accidentCount,
    chaKhaoyarTimer,
    chaKhaoyarActive,
    chaKhaoyarDeductCount,
    lastAccidentNotice,
  };
}

/**
 * Finds the closest landmark to the given (x, z) coordinates
 */
export function findNearestLandmark(x: number, z: number): { landmark: Landmark; distance: number } {
  let best = PABNA_LANDMARKS[0];
  let bestDist = Infinity;
  for (const lm of PABNA_LANDMARKS) {
    const d = Math.hypot(x - lm.x, z - lm.z);
    if (d < bestDist) {
      bestDist = d;
      best = lm;
    }
  }
  return { landmark: best, distance: bestDist };
}

/**
 * Converts m/s speed to integer KM/H for HUD speedometer
 */
export function speedToKmh(speedMs: number): number {
  return Math.round(Math.abs(speedMs) * 3.6);
}

/**
 * Creates deterministic initial Pabna traffic: CNGs, Rickshaws, and Bikes
 */
export function createInitialTraffic(): TrafficVehicle[] {
  const vehicles: TrafficVehicle[] = [];
  const cngColors = [0x15803d, 0x166534, 0x14532d]; // Classic green CNG auto-rickshaw
  const rickshawColors = [0xeab308, 0xec4899, 0x06b6d4, 0xf97316, 0x8b5cf6];
  const bikeColors = [0xdc2626, 0x2563eb, 0x1e293b, 0xd97706];

  let id = 1;
  // 10 CNG Auto-rickshaws along Abdul Hamid Road & East Loop
  for (let i = 0; i < 10; i++) {
    const northbound = i % 2 === 0;
    const z = 140 - i * 42;
    const lane = northbound ? -3.4 : 3.4;
    vehicles.push({
      id: id++,
      type: 'cng',
      x: lane,
      z,
      heading: northbound ? 0 : Math.PI,
      speed: 8.5 + (i % 3) * 1.5,
      baseSpeed: 8.5 + (i % 3) * 1.5,
      laneOffset: lane,
      targetLaneOffset: lane,
      roadSegment: northbound ? 'main-north' : 'main-south',
      scaredTimer: 0,
      phaseOffset: i * 0.7,
      colorHex: cngColors[i % cngColors.length],
    });
  }

  // 12 Cycle Rickshaws (slower, colourful hoods, riding along outer lanes)
  for (let i = 0; i < 12; i++) {
    const northbound = i % 2 === 0;
    const z = 155 - i * 36;
    const lane = northbound ? -5.8 : 5.8;
    vehicles.push({
      id: id++,
      type: 'rickshaw',
      x: lane,
      z,
      heading: northbound ? 0 : Math.PI,
      speed: 4.2 + (i % 3) * 0.6,
      baseSpeed: 4.2 + (i % 3) * 0.6,
      laneOffset: lane,
      targetLaneOffset: lane,
      roadSegment: northbound ? 'main-north' : 'main-south',
      scaredTimer: 0,
      phaseOffset: i * 1.1,
      colorHex: rickshawColors[i % rickshawColors.length],
    });
  }

  // 10 Motorbikes (faster weavers & convoy riders)
  for (let i = 0; i < 10; i++) {
    const northbound = i % 2 === 0;
    const z = 120 - i * 40;
    const lane = northbound ? -1.8 : 1.8;
    vehicles.push({
      id: id++,
      type: 'bike',
      x: lane,
      z,
      heading: northbound ? 0 : Math.PI,
      speed: 13.5 + (i % 4) * 2.0,
      baseSpeed: 13.5 + (i % 4) * 2.0,
      laneOffset: lane,
      targetLaneOffset: lane,
      roadSegment: northbound ? 'main-north' : 'main-south',
      scaredTimer: 0,
      phaseOffset: i * 0.9,
      colorHex: bikeColors[i % bikeColors.length],
    });
  }

  return vehicles;
}

/**
 * Updates traffic vehicles with 3 distinct behavior policies:
 * 1. CNG ('cng'): Periodic lane-weaving between inner and outer lane
 * 2. Rickshaw ('rickshaw'): Steady outer-lane pedaling with gentle sinusoidal sway
 * 3. Bike ('bike'): Fast overtaker that weaves rapidly and yields sharply when VIP approaches
 * Plus VIP Horn ("নেতার গাড়ি, ১০০০ গজ দূরে থাকুন") scatter reaction!
 */
export function stepTrafficVehicles(
  vehicles: TrafficVehicle[],
  player: PlayerCarState,
  elapsedTime: number,
  rawDt: number
): { vehicles: TrafficVehicle[]; newlySaluted: number } {
  const dt = Math.min(Math.max(rawDt, 0), 0.05);
  let newlySaluted = 0;

  const updated = vehicles.map((v) => {
    let { x, z, heading, speed, baseSpeed, laneOffset, targetLaneOffset, scaredTimer } = v;
    const northbound = v.roadSegment === 'main-north';
    const dirSign = northbound ? -1 : 1; // northbound moves toward -Z

    // Distance to political leader's car
    const dx = x - player.x;
    const dz = z - player.z;
    const distToPlayer = Math.hypot(dx, dz);

    // Trigger scatter if player honks VIP horn or has siren on nearby, or drives closely behind
    const hornRadius = player.hornTimer > 0 ? 45 : player.sirenActive ? 32 : 14;
    if (distToPlayer < hornRadius) {
      if (scaredTimer <= 0.1 && (player.hornTimer > 0 || player.sirenActive)) {
        newlySaluted += 1;
      }
      scaredTimer = Math.max(scaredTimer, 2.2);
    }

    if (scaredTimer > 0) {
      scaredTimer = Math.max(0, scaredTimer - dt);
      // Scatter toward roadside shoulder ("১০০০ গজ দূরে থাকুন" effect!)
      const shoulderX = x <= 0 ? -7.6 : 7.6;
      targetLaneOffset = shoulderX;
      speed = baseSpeed * 0.65;
    } else {
      speed = baseSpeed;
      // Distinct archetype behavior policies:
      if (v.type === 'cng') {
        // Policy 1: Lane weaver every few seconds
        const weaveWave = Math.sin(elapsedTime * 0.8 + v.phaseOffset);
        const baseLane = northbound ? -3.4 : 3.4;
        targetLaneOffset = baseLane + (weaveWave > 0.4 ? -1.2 : weaveWave < -0.4 ? 0.9 : 0);
      } else if (v.type === 'rickshaw') {
        // Policy 2: Roadside steady cruiser with subtle pedal sway
        const baseLane = northbound ? -5.8 : 5.8;
        targetLaneOffset = baseLane + Math.sin(elapsedTime * 2.4 + v.phaseOffset) * 0.28;
      } else {
        // Policy 3: Fast motorbike overtaker
        const baseLane = northbound ? -2.0 : 2.0;
        targetLaneOffset = baseLane + Math.sin(elapsedTime * 1.7 + v.phaseOffset) * 1.45;
        speed = baseSpeed * (1 + 0.15 * Math.sin(elapsedTime * 1.2 + v.phaseOffset));
      }
    }

    // Smooth lateral lane interpolation
    const lateralLerp = 1 - Math.exp(-(scaredTimer > 0 ? 6.5 : 2.8) * dt);
    const prevX = x;
    x = x + (targetLaneOffset - x) * lateralLerp;
    laneOffset = x;

    // Gentle soft collision avoidance if right in front of player car
    if (distToPlayer < 4.8) {
      const pushX = dx === 0 ? (northbound ? -1 : 1) : Math.sign(dx);
      x += pushX * 8 * dt;
    }

    // Advance along Z
    z += dirSign * speed * dt;

    // Loop along the 540m Abdul Hamid Road corridor [-290, 250]
    if (z < -290) z += 540;
    if (z > 250) z -= 540;

    const lateralVel = (x - prevX) / Math.max(dt, 0.001);
    const baseHeading = northbound ? 0 : Math.PI;
    heading = baseHeading - lateralVel * 0.06 * dirSign;

    return {
      ...v,
      x,
      z,
      heading,
      speed,
      laneOffset,
      targetLaneOffset,
      scaredTimer,
    };
  });

  return { vehicles: updated, newlySaluted };
}
