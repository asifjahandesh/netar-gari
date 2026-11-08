export type GameState = 'loading' | 'leader-setup' | 'title' | 'playing' | 'paused' | 'gameover';

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
 * Authentic Pabna City Landmarks along the interconnected continuous road grid & ring loops.
 * Starts from Pabna Zilla School, covers the entire city through Abdul Hamid Road,
 * Robiul Market, Ananta Cinema, Central Bus Terminal, Edward College, Mental Hospital,
 * Hardinge Bridge, Town Hall, Shapla Chattar, and loops right back to Pabna Zilla School!
 */
export const PABNA_LANDMARKS: Landmark[] = [
  {
    id: 'zilla-school',
    nameBn: 'পাবনা জিলা স্কুল',
    nameEn: 'Pabna Zilla School',
    subtitleBn: 'ঐতিহ্যবাহী বিদ্যাপীঠ · স্থাপিত ১৮৫৩',
    subtitleEn: 'Colonial Heritage Red Brick Campus · Est. 1853',
    x: -24,
    z: 110,
    heading: 0,
    spawnX: -4.5,
    spawnZ: 140,
    radius: 48,
    accentColor: '#ef4444',
    type: 'school',
  },
  {
    id: 'abdul-hamid-road',
    nameBn: 'শহীদ আব্দুল হামিদ তোরণ',
    nameEn: 'Abdul Hamid Road Monument',
    subtitleBn: 'পাবনা শহরের প্রবেশদ্বার ও প্রধান ৪-লেন বাণিজ্যিক তোরণ',
    subtitleEn: 'Grand Ceremonial Gateway to Central Pabna 4-Lane Avenue',
    x: 0,
    z: 60,
    heading: 0,
    spawnX: -4.5,
    spawnZ: 85,
    radius: 42,
    accentColor: '#f59e0b',
    type: 'road-arch',
  },
  {
    id: 'shapla-chattar',
    nameBn: 'শাপলা চত্বর ও ফোয়ারা',
    nameEn: 'Shapla Chattar Roundabout',
    subtitleBn: 'পাবনা শহরের কেন্দ্রীয় সংযোগ গোলচত্বর ও ডানে-বামে রাস্তা',
    subtitleEn: 'Central Roundabout, Water Lily Fountain & Crossroad Junction',
    x: 0,
    z: 0,
    heading: 0,
    spawnX: -4.5,
    spawnZ: 25,
    radius: 40,
    accentColor: '#06b6d4',
    type: 'chattar',
  },
  {
    id: 'robiul-market',
    nameBn: 'রবিউল মার্কেট',
    nameEn: 'Robiul Market Plaza',
    subtitleBn: 'আব্দুল হামিদ রোড শপিং কমপ্লেক্স',
    subtitleEn: 'Multi-Storey Shopping & Electronics Hub',
    x: 24,
    z: -60,
    heading: 0,
    spawnX: -4.5,
    spawnZ: -35,
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
    x: -24,
    z: -120,
    heading: 0,
    spawnX: -4.5,
    spawnZ: -95,
    radius: 46,
    accentColor: '#ec4899',
    type: 'cinema',
  },
  {
    id: 'bus-terminal',
    nameBn: 'পাবনা কেন্দ্রীয় বাস টার্মিনাল',
    nameEn: 'Pabna Central Bus Terminal',
    subtitleBn: 'আন্তঃজেলা কোচ টার্মিনাল ও উত্তর লুপ মোড়',
    subtitleEn: 'Inter-District Coach Concourse & North Loop Junction',
    x: 26,
    z: -180,
    heading: 0,
    spawnX: -4.5,
    spawnZ: -160,
    radius: 55,
    accentColor: '#10b981',
    type: 'terminal',
  },
  {
    id: 'town-hall',
    nameBn: 'পাবনা টাউন হল ও ইন্দারা মোড়',
    nameEn: 'Pabna Town Hall & Indara Mor',
    subtitleBn: 'পূর্ব রিং রোড জনসভা ময়দান ও মুক্তিযোদ্ধা চত্বর',
    subtitleEn: 'East Ring Road Civic Grounds & Assembly Hall',
    x: 100,
    z: -70,
    heading: Math.PI,
    spawnX: 100,
    spawnZ: -110,
    radius: 50,
    accentColor: '#eab308',
    type: 'town-hall',
  },
  {
    id: 'edward-college',
    nameBn: 'সরকারি এডওয়ার্ড কলেজ',
    nameEn: 'Govt. Edward College',
    subtitleBn: 'পশ্চিম রিং রোড · ঐতিহাসিক বিদ্যাপীঠ · স্থাপিত ১৮৯৮',
    subtitleEn: 'West Ring Road Colonial Academic Campus · Est. 1898',
    x: -100,
    z: -50,
    heading: 0,
    spawnX: -100,
    spawnZ: -15,
    radius: 52,
    accentColor: '#f97316',
    type: 'college',
  },
  {
    id: 'mental-hospital',
    nameBn: 'মানসিক হাসপাতাল ও অনুকূল আশ্রম',
    nameEn: 'Pabna Mental Hospital & Hemayetpur',
    subtitleBn: 'হিমায়েতপুর রোড · ঐতিহ্যবাহী চিকিৎসালয় ও আশ্রম',
    subtitleEn: 'Famous National Specialized Hospital · Est. 1953',
    x: -100,
    z: 75,
    heading: 0,
    spawnX: -100,
    spawnZ: 110,
    radius: 52,
    accentColor: '#a855f7',
    type: 'hospital',
  },
  {
    id: 'hardinge-bridge',
    nameBn: 'পাকশী হার্ডিঞ্জ ব্রিজ তোরণ',
    nameEn: 'Paksey Hardinge Bridge Memorial',
    subtitleBn: 'দক্ষিণ সংযোগ রিং রোড · শতবর্ষী ঐতিহ্যবাহী রেলসেতু তোরণ',
    subtitleEn: 'South Connector Ring Road Cantilever River Monument',
    x: 100,
    z: 75,
    heading: Math.PI,
    spawnX: 100,
    spawnZ: 40,
    radius: 52,
    accentColor: '#3b82f6',
    type: 'bridge',
  },
];

export interface CorruptionBenchmark {
  id: string;
  nameBn: string;
  scamCostTk: number; // In Taka
  scamCostLabelBn: string;
  icon: string;
  descriptionBn: string;
  pabnaContextBn: string;
}

/**
 * All historic major corruption scams in Bangladesh for satirical achievements
 */
export const BANGLADESH_CORRUPTION_SCAMS: CorruptionBenchmark[] = [
  {
    id: 'rooppur-pillow',
    nameBn: 'রূপপুর পারমাণবিক বালিশ কাণ্ড',
    scamCostTk: 312400000, // ৩১ কোটি ২৪ লাখ টাকা
    scamCostLabelBn: '৩১ কোটি ২৪ লাখ টাকা',
    icon: '🛏️',
    descriptionBn: 'গ্রিন সিটি আবাসিক ভবনে প্রতিটি বালিশ ৫,৯৫৭ টাকা ও ফ্ল্যাটে তোলার মজুরি ৭৬০ টাকা!',
    pabnaContextBn: 'পাবনার ঈশ্বরদীর রূপপুরেই ঘটেছিল বিশ্ব কাঁপানো ঐতিহাসিক এই বালিশ কাণ্ড!',
  },
  {
    id: 'faridpur-curtain',
    nameBn: 'ফরিদপুর মেডিকেল পর্দা কাণ্ড',
    scamCostTk: 375000000, // ৩৭ কোটি ৫০ লাখ টাকা
    scamCostLabelBn: '৩৭ কোটি ৫০ লাখ টাকা',
    icon: '🪟',
    descriptionBn: 'হাসপাতালের প্রতিটি জানালার সাধারণ পর্দার দাম দেখানো হয়েছিল ৩৭ লাখ ৫০ হাজার টাকা!',
    pabnaContextBn: 'হাসপাতালের সাধারণ সুতি পর্দাও কোটি টাকার হীরা-জহরত হয়ে গিয়েছিল!',
  },
  {
    id: 'hallmark-sonali-bank',
    nameBn: 'হলমার্ক সোনালী ব্যাংক ঋণ কেলেঙ্কারি',
    scamCostTk: 35000000000, // ৩৫০০ কোটি টাকা
    scamCostLabelBn: '৩,৫০০ কোটি টাকা',
    icon: '🏦',
    descriptionBn: 'ভুয়া এলসি ও কাগজ তৈরি করে সোনালী ব্যাংকের রূপসী বাংলা শাখা থেকে অর্থ লোপাট!',
    pabnaContextBn: 'ব্যাংকের টাকা মেরে দেওয়া নেতাদের জন্য ছিল শুধুই ডাল-ভাত!',
  },
  {
    id: 'basic-bank-scam',
    nameBn: 'বেসিক ব্যাংক ডাকাতি কাণ্ড',
    scamCostTk: 45000000000, // ৪৫০০ কোটি টাকা
    scamCostLabelBn: '৪,৫০০ কোটি টাকা',
    icon: '💼',
    descriptionBn: 'বিনা জামানতে কাগুজে কোম্পানির নামে হাজার হাজার কোটি টাকা ঋণ অনুমোদন!',
    pabnaContextBn: 'বোর্ডের চোখের পলকেই উধাও হয়ে গিয়েছিল সাধারণ মানুষের রক্ত-ঘামের আমানত!',
  },
  {
    id: 'bismillah-group',
    nameBn: 'বিসমিল্লাহ গ্রুপ ব্যাংক জালিয়াতি',
    scamCostTk: 12000000000, // ১২০০ কোটি টাকা
    scamCostLabelBn: '১,২০০ কোটি টাকা',
    icon: '📄',
    descriptionBn: 'মিথ্যা রপ্তানি ও ভুয়া নথিপত্র দেখিয়ে ৫টি ব্যাংক থেকে অর্থ আত্মসাৎ!',
    pabnaContextBn: 'কাগজে সব ঠিকঠাক, বাস্তবে জাহাজও নাই, মালও নাই!',
  },
  {
    id: 's-alam-banking-looting',
    nameBn: 'এস আলম ব্যাংক দখল ও পাচার কেলেঙ্কারি',
    scamCostTk: 1756250000000, // ১ লাখ ৭৫ হাজার কোটি টাকা
    scamCostLabelBn: '১ লাখ ৭৫ হাজার কোটি টাকা',
    icon: '🏴‍☠️',
    descriptionBn: 'একাধিক বেসরকারি ব্যাংক গায়ের জোরে দখল করে লাখ কোটি টাকা বিদেশে পাচার!',
    pabnaContextBn: 'স্বাধীন বাংলাদেশের অর্থনীতির ইতিহাসে সবচেয়ে বড় আর্থিক লুটপাট!',
  },
  {
    id: 'capital-flight-whitepaper',
    nameBn: '১৫ বছরের অর্থ পাচার মহাকাব্য (হোয়াইট পেপার)',
    scamCostTk: 28000000000000, // ২৮ লাখ কোটি টাকা
    scamCostLabelBn: '২৮ লাখ কোটি টাকা',
    icon: '💸',
    descriptionBn: 'আমদানি-রপ্তানিতে অতিরিক্ত মূল্য দেখিয়ে দেশ থেকে ২৮ লাখ কোটি টাকা পাচার!',
    pabnaContextBn: 'গোটা দেশের কয়েক বছরের জাতীয় বাজেটের সমান টাকা চলে গেছে বিদেশে!',
  },
];

export interface AccidentNotice {
  textBn: string;
  amount: number;
  timestamp: number;
  isWrongSide?: boolean;
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
  isWrongSide: boolean; // True when car driving against standard lane flow (gives 2x income!)
  chaKhaoyarTimer: number; // Countdown until crowd asks "বড় ভাই, চা খাওয়ার জন্যি কয়ডা ট্যাকা দেন না ক্যা"
  chaKhaoyarActive: boolean;
  chaKhaoyarDeductCount: number;
  lastAccidentNotice: AccidentNotice | null;
  leaderName: string;
}

export type TrafficType = 'cng' | 'rickshaw' | 'bike' | 'bus';

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
  roadSegment: 'main-north' | 'main-south' | 'east-loop' | 'west-loop';
  scaredTimer: number;
  hitCooldown: number;
  phaseOffset: number;
  colorHex: number;
  busName?: string;
  busRoute?: string;
}

export type PedestrianType = 'student' | 'lungi-man' | 'office-worker' | 'beggar';

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
  isDividerBeggar?: boolean; // Beggar stationed at median divider trees
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
  maxForwardSpeed: 38, // ~136 km/h top speed
  maxBoostSpeed: 50, // ~180 km/h with protocol boost
  maxReverseSpeed: -16,
  acceleration: 24,
  boostAcceleration: 38,
  braking: 36,
  reverseAcceleration: 16,
  naturalDrag: 5.5,
  turnRate: 2.35,
  maxSteerAngle: 0.52,
};

export const DEFAULT_LEADER_NAME = 'নেতা মহোদয়';

export function getSavedLeaderName(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('pabna_leader_name');
    if (saved && saved.trim().length > 0) return saved.trim();
  }
  return DEFAULT_LEADER_NAME;
}

export function saveLeaderName(name: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pabna_leader_name', name.trim() || DEFAULT_LEADER_NAME);
  }
}

export function getStoredAccountCurrency(): number {
  if (typeof window !== 'undefined') {
    const val = localStorage.getItem('pabna_leader_vault_tk');
    if (val) {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
  }
  return 0;
}

export function saveStoredAccountCurrency(amount: number): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pabna_leader_vault_tk', Math.max(0, Math.round(amount)).toString());
  }
}

/**
 * Calculates which Bangladesh mega corruption achievement has been achieved based on total money
 */
export function calculateCorruptionAchievement(totalTk: number) {
  // Find the most relevant benchmark
  let selected = BANGLADESH_CORRUPTION_SCAMS[0];
  for (const scam of BANGLADESH_CORRUPTION_SCAMS) {
    if (totalTk >= scam.scamCostTk * 0.0001) {
      selected = scam;
    }
  }

  const rawPercent = (totalTk / selected.scamCostTk) * 100;
  let percentStr: string;
  if (rawPercent < 0.0001) {
    percentStr = '০.০০০১%';
  } else if (rawPercent < 0.01) {
    percentStr = rawPercent.toFixed(4) + '%';
  } else if (rawPercent < 1) {
    percentStr = rawPercent.toFixed(2) + '%';
  } else {
    percentStr = rawPercent.toFixed(1) + '%';
  }

  // Format total Tk in Bengali
  const totalFormattedBn = totalTk.toLocaleString('bn-BD');
  const achievementTextBn = `পাবনার বড় ভাই! আপনে মোট ${totalFormattedBn} ট্যাকার ক্ষতি করছেন। যা ${selected.nameBn}-এর প্রায় ${percentStr}!`;

  return {
    selectedScam: selected,
    percentStr,
    totalFormattedBn,
    achievementTextBn,
  };
}

export function createInitialPlayerState(): PlayerCarState {
  const leaderName = getSavedLeaderName();
  const savedVault = getStoredAccountCurrency();

  return {
    x: -4.5,
    z: 140, // Starts at Pabna Zilla School!
    heading: 0, // Facing North (-Z) down Abdul Hamid Road
    speed: 0,
    steerAngle: 0,
    bodyRoll: 0,
    bodyPitch: 0,
    hornTimer: 0,
    sirenActive: false,
    waveTimer: 0,
    distanceDriven: 0,
    saluteCount: 0,
    visitedLandmarks: ['zilla-school'],
    currency: savedVault, // Loaded from user's saved account vault!
    accidentCount: 0,
    isWrongSide: false,
    chaKhaoyarTimer: 25, // First "চা খাওয়ার জন্যি কয়ডা ট্যাকা দেন না ক্যা" prompt after 25s
    chaKhaoyarActive: false,
    chaKhaoyarDeductCount: 0,
    lastAccidentNotice: null,
    leaderName,
  };
}

/**
 * Determines whether the vehicle is traveling on the wrong side of the road.
 * In Bangladesh, normal traffic drives on the LEFT side of each road:
 * - On Main Corridor (North-South, -22 < x < 22):
 *   Left side (Northbound toward -Z) is x < 0. So driving South (+Z) on x < 0 is wrong side!
 *   Right side (Southbound toward +Z) is x > 0. So driving North (-Z) on x > 0 is wrong side!
 * When on the wrong side, the user gets 2x accidental income!
 */
export function checkIsWrongSide(x: number, heading: number, speed: number): boolean {
  if (Math.abs(speed) < 0.5) return false;
  const forwardSign = speed >= 0 ? 1 : -1;
  const vz = -Math.cos(heading) * forwardSign; // vz < 0 means moving North, vz > 0 means South

  if (Math.abs(x) < 22) {
    if (x < -0.8 && vz > 0.4) {
      return true; // Moving South on Northbound lane -> WRONG SIDE!
    }
    if (x > 0.8 && vz < -0.4) {
      return true; // Moving North on Southbound lane -> WRONG SIDE!
    }
  }
  return false;
}

/**
 * Pure step function for updating player car physics with seamless city looping.
 * Starts from Pabna Zilla School (Z = 140), runs through full city,
 * and seamlessly loops through the interconnected 4-lane city loop!
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

  const speedFactor = Math.min(1, Math.abs(speed) / 4.5);
  const directionSign = speed >= -0.1 ? 1 : -1;
  const driftMultiplier = input.handbrake && Math.abs(speed) > 6 ? 1.35 : 1.0;

  if (Math.abs(speed) > 0.05) {
    heading += steerInput * CAR_CONFIG.turnRate * speedFactor * directionSign * driftMultiplier * dt;
  }

  // Normalize heading to [-PI, PI]
  while (heading > Math.PI) heading -= Math.PI * 2;
  while (heading < -Math.PI) heading += Math.PI * 2;

  // Move car in world space
  const vx = -Math.sin(heading) * speed;
  const vz = -Math.cos(heading) * speed;

  x += vx * dt;
  z += vz * dt;

  // Seamless continuous city loop:
  // Starts from Pabna Zilla School (Z = 140), runs across city to Bus Terminal (Z = -180),
  // and smoothly loops around the full city grid without hitting dead ends!
  const LOOP_MIN_Z = -260;
  const LOOP_MAX_Z = 220;
  const LOOP_SPAN_Z = LOOP_MAX_Z - LOOP_MIN_Z; // 480m loop span

  if (z < LOOP_MIN_Z) z += LOOP_SPAN_Z;
  if (z > LOOP_MAX_Z) z -= LOOP_SPAN_Z;

  const LOOP_MIN_X = -220;
  const LOOP_MAX_X = 220;
  const LOOP_SPAN_X = LOOP_MAX_X - LOOP_MIN_X; // 440m cross loop span

  if (x < LOOP_MIN_X) x += LOOP_SPAN_X;
  if (x > LOOP_MAX_X) x -= LOOP_SPAN_X;

  distanceDriven += Math.abs(speed) * dt;

  // Check wrong side condition (gives 2x income!)
  const isWrongSide = checkIsWrongSide(x, heading, speed);

  // Body roll & pitch dynamics
  const targetRoll = -steerInput * Math.min(1, Math.abs(speed) / 22) * 0.065;
  const suspensionLerp = 1 - Math.exp(-10 * dt);
  bodyRoll = bodyRoll + (targetRoll - bodyRoll) * suspensionLerp;
  bodyPitch = bodyPitch + (targetPitch - bodyPitch) * suspensionLerp;

  hornTimer = Math.max(0, hornTimer - dt);
  waveTimer = Math.max(0, waveTimer - dt);

  // Random Pabna local dialect "বড় ভাই, চা খাওয়ার জন্যি কয়ডা ট্যাকা দেন না ক্যা" event timer
  let { currency, accidentCount, chaKhaoyarTimer, chaKhaoyarActive, chaKhaoyarDeductCount, lastAccidentNotice } = state;
  chaKhaoyarTimer -= dt;
  if (chaKhaoyarTimer <= 0) {
    chaKhaoyarActive = true;
    chaKhaoyarTimer = 35 + Math.random() * 25; // Repeat every 35-60s
    const deduct = 1000;
    currency = Math.max(0, currency - deduct);
    saveStoredAccountCurrency(currency); // Save to user's account!
    chaKhaoyarDeductCount += 1;
    lastAccidentNotice = {
      textBn: 'বড় ভাই, চা খাওয়ার জন্যি কয়ডা ট্যাকা দেন না ক্যা! (-১,০০০ ৳)',
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
    isWrongSide,
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
 * Creates deterministic initial Pabna traffic across 4 lanes of Abdul Hamid Road and cross roads
 */
export function createInitialTraffic(): TrafficVehicle[] {
  const vehicles: TrafficVehicle[] = [];
  const cngColors = [0x15803d, 0x166534, 0x14532d];
  const rickshawColors = [0xeab308, 0xec4899, 0x06b6d4, 0xf97316, 0x8b5cf6];
  const bikeColors = [0xdc2626, 0x2563eb, 0x1e293b, 0xd97706];

  let id = 1;
  // 10 CNG Auto-rickshaws across 4-lane Abdul Hamid Road
  for (let i = 0; i < 10; i++) {
    const northbound = i % 2 === 0;
    const z = 140 - i * 40;
    // 4-lane offsets: Left lanes (Northbound) at -4.0 & -8.0; Right lanes (Southbound) at 4.0 & 8.0
    const lane = northbound ? (i % 4 === 0 ? -4.2 : -7.8) : (i % 4 === 1 ? 4.2 : 7.8);
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
      hitCooldown: 0,
      phaseOffset: i * 0.7,
      colorHex: cngColors[i % cngColors.length],
    });
  }

  // 12 Cycle Rickshaws on outer 4th lane
  for (let i = 0; i < 12; i++) {
    const northbound = i % 2 === 0;
    const z = 155 - i * 35;
    const lane = northbound ? -8.5 : 8.5;
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
      hitCooldown: 0,
      phaseOffset: i * 1.1,
      colorHex: rickshawColors[i % rickshawColors.length],
    });
  }

  // 10 Motorbikes on fast inner 2nd lane
  for (let i = 0; i < 10; i++) {
    const northbound = i % 2 === 0;
    const z = 120 - i * 38;
    const lane = northbound ? -3.5 : 3.5;
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
      hitCooldown: 0,
      phaseOffset: i * 0.9,
      colorHex: bikeColors[i % bikeColors.length],
    });
  }

  // 4 Inter-District Heavy Coach Buses
  const busConfigs = [
    { name: 'পাবনা এক্সপ্রেস', route: 'পাবনা - ঢাকা', colorHex: 0xdc2626, z: 80, lane: 5.5, northbound: false },
    { name: 'শ্যামলী স্পেশাল', route: 'পাবনা - চট্টগ্রাম', colorHex: 0x16a34a, z: -40, lane: -5.5, northbound: true },
    { name: 'সি-লাইন ট্রাভেলস', route: 'পাবনা - রাজশাহী', colorHex: 0x2563eb, z: -150, lane: 5.5, northbound: false },
    { name: 'ঈশ্বরদী ট্রাভেলস', route: 'পাবনা - কুষ্টিয়া', colorHex: 0x7c2d12, z: 20, lane: -5.5, northbound: true },
  ];
  for (const b of busConfigs) {
    vehicles.push({
      id: id++,
      type: 'bus',
      x: b.lane,
      z: b.z,
      heading: b.northbound ? 0 : Math.PI,
      speed: 9.5,
      baseSpeed: 9.5,
      laneOffset: b.lane,
      targetLaneOffset: b.lane,
      roadSegment: b.northbound ? 'main-north' : 'main-south',
      scaredTimer: 0,
      hitCooldown: 0,
      phaseOffset: 0.4,
      colorHex: b.colorHex,
      busName: b.name,
      busRoute: b.route,
    });
  }

  return vehicles;
}

/**
 * Creates pedestrians walking on sidewalks, crossing roads,
 * and beggars stationed along middle divider trees asking for alms in Pabna dialect!
 */
export function createInitialPedestrians(): Pedestrian[] {
  const peds: Pedestrian[] = [];
  const studentColors = [0x1e3a8a, 0x0284c7, 0xf8fafc];
  const lungiColors = [0x047857, 0x0369a1, 0x7c2d12, 0x4338ca];
  const officeColors = [0x1e293b, 0x334155, 0x475569];
  const beggarColors = [0x78350f, 0x57534e, 0x44403c];

  let id = 1;
  // 16 Regular Pedestrians on Sidewalks and Crossing
  for (let i = 0; i < 16; i++) {
    const isCrossing = i % 4 === 0;
    const type: PedestrianType = i % 3 === 0 ? 'student' : i % 3 === 1 ? 'lungi-man' : 'office-worker';
    const side = i % 2 === 0 ? -1 : 1;
    const x = isCrossing ? side * 6.5 : side * 12.8;
    const z = 150 - i * 24;
    const colors = type === 'student' ? studentColors : type === 'lungi-man' ? lungiColors : officeColors;

    peds.push({
      id: id++,
      type,
      x,
      z,
      targetX: isCrossing ? -x : x,
      heading: isCrossing ? (side < 0 ? Math.PI / 2 : -Math.PI / 2) : (side < 0 ? 0 : Math.PI),
      speed: 1.1 + (i % 3) * 0.4,
      isFallen: false,
      tumbleTimer: 0,
      hitCooldown: 0,
      colorHex: colors[i % colors.length],
      isDividerBeggar: false,
    });
  }

  // 8 Middle Divider Beggars sitting or standing by the median trees!
  const dividerBeggarZ = [130, 85, 45, 10, -35, -80, -125, -170];
  dividerBeggarZ.forEach((bz, idx) => {
    peds.push({
      id: id++,
      type: 'beggar',
      x: (idx % 2 === 0 ? -0.2 : 0.2), // Right in the center divider
      z: bz,
      targetX: (idx % 2 === 0 ? -0.2 : 0.2),
      heading: idx % 2 === 0 ? Math.PI / 2 : -Math.PI / 2,
      speed: 0.15, // Mostly stationary, swaying slightly
      isFallen: false,
      tumbleTimer: 0,
      hitCooldown: 0,
      colorHex: beggarColors[idx % beggarColors.length],
      isDividerBeggar: true,
    });
  });

  return peds;
}

export interface PedestrianStepResult {
  pedestrians: Pedestrian[];
  accidents: AccidentEvent[];
}

/**
 * Steps pedestrian walking and handles accidents:
 * Base 1,000 Tk per pedestrian accident.
 * If driving on WRONG SIDE, accident gives 2X (2,000 Tk)!
 * All dialogues are rendered in authentic Pabna local dialect!
 */
export function stepPedestrians(
  pedestrians: Pedestrian[],
  player: PlayerCarState,
  rawDt: number
): PedestrianStepResult {
  const dt = Math.min(Math.max(rawDt, 0), 0.05);
  const accidents: AccidentEvent[] = [];
  const wrongSideMultiplier = player.isWrongSide ? 2 : 1;

  const updated = pedestrians.map((p) => {
    let { x, z, heading, speed, isFallen, tumbleTimer, hitCooldown, targetX } = p;
    hitCooldown = Math.max(0, hitCooldown - dt);

    if (isFallen) {
      tumbleTimer = Math.max(0, tumbleTimer - dt);
      if (tumbleTimer <= 0) {
        isFallen = false;
      }
      return { ...p, isFallen, tumbleTimer, hitCooldown };
    }

    // Check collision with player car
    const dx = x - player.x;
    const dz = z - player.z;
    const distToPlayer = Math.hypot(dx, dz);

    if (distToPlayer < 2.5 && hitCooldown <= 0) {
      isFallen = true;
      tumbleTimer = 4.0;
      hitCooldown = 5.0;
      x += (dx >= 0 ? 1 : -1) * 3.8;

      const baseReward = 1000;
      const finalReward = baseReward * wrongSideMultiplier;
      const label = player.isWrongSide
        ? (p.isDividerBeggar
            ? 'উল্টো সাইডে ডিভাইডারের ফকির দুর্ঘটনা! (২x ডাবল: +২,০০০ ৳)'
            : 'উল্টো সাইডে মানুষ দুর্ঘটনা! (২x ডাবল: +২,০০০ ৳)')
        : (p.isDividerBeggar
            ? 'ডিভাইডারের ফকির দুর্ঘটনা! (+১,০০০ ৳)'
            : 'পাবনার পথচারী দুর্ঘটনা! (+১,০০০ ৳)');

      accidents.push({
        type: 'pedestrian',
        reward: finalReward,
        labelBn: label,
        x,
        z,
      });
    } else {
      if (!p.isDividerBeggar) {
        if (Math.abs(x - targetX) > 0.4) {
          const dir = Math.sign(targetX - x);
          x += dir * speed * dt;
        } else {
          targetX = -targetX;
        }
      } else {
        // Divider beggar gentle idle sway
        x = (p.id % 2 === 0 ? -0.2 : 0.2) + Math.sin(Date.now() * 0.002 + p.id) * 0.15;
      }
    }

    // Loop seamlessly along city loop
    if (z < -260) z += 480;
    if (z > 220) z -= 480;

    return {
      ...p,
      x,
      z,
      targetX,
      heading,
      speed,
      isFallen,
      tumbleTimer,
      hitCooldown,
    };
  });

  return { pedestrians: updated, accidents };
}

/**
 * Updates traffic vehicles with accident detection:
 * Bike: 8,000 Tk | Rickshaw: 15,000 Tk | CNG: 25,000 Tk | Bus: 50,000 Tk.
 * When on WRONG SIDE, user gets 2X INCOME (16k to 100k Tk)!
 * All messages formatted in authentic Pabna regional dialect!
 */
export function stepTrafficVehicles(
  vehicles: TrafficVehicle[],
  player: PlayerCarState,
  elapsedTime: number,
  rawDt: number
): { vehicles: TrafficVehicle[]; newlySaluted: number; accidents: AccidentEvent[] } {
  const dt = Math.min(Math.max(rawDt, 0), 0.05);
  let newlySaluted = 0;
  const accidents: AccidentEvent[] = [];
  const wrongSideMultiplier = player.isWrongSide ? 2 : 1;

  const updated = vehicles.map((v) => {
    let { x, z, heading, speed, baseSpeed, laneOffset, targetLaneOffset, scaredTimer, hitCooldown } = v;
    hitCooldown = Math.max(0, hitCooldown - dt);
    const northbound = v.roadSegment === 'main-north';
    const dirSign = northbound ? -1 : 1;

    const dx = x - player.x;
    const dz = z - player.z;
    const distToPlayer = Math.hypot(dx, dz);

    const hitThreshold = v.type === 'bus' ? 5.2 : 3.0;
    if (distToPlayer < hitThreshold && hitCooldown <= 0) {
      hitCooldown = 3.8;
      scaredTimer = 4.0;
      const pushDir = dx >= 0 ? 1 : -1;
      x += pushDir * (v.type === 'bus' ? 2.8 : 4.5);

      let baseReward = 8000;
      let vehicleName = 'বাইক';
      if (v.type === 'cng') {
        baseReward = 25000;
        vehicleName = 'সিএনজি';
      } else if (v.type === 'rickshaw') {
        baseReward = 15000;
        vehicleName = 'রিকশা';
      } else if (v.type === 'bus') {
        baseReward = 50000;
        vehicleName = 'আন্তঃজেলা বাস';
      }

      const finalReward = baseReward * wrongSideMultiplier;
      const label = player.isWrongSide
        ? `উল্টো সাইডে ${vehicleName} দুর্ঘটনা! (২x ডাবল: +${finalReward.toLocaleString('bn-BD')} ৳)`
        : `${vehicleName} দুর্ঘটনা! (+${finalReward.toLocaleString('bn-BD')} ৳)`;

      accidents.push({
        type: v.type,
        reward: finalReward,
        labelBn: label,
        x,
        z,
      });
    }

    // Trigger scatter if player honks VIP horn or has siren on nearby
    const hornRadius = player.hornTimer > 0 ? 45 : player.sirenActive ? 32 : 14;
    if (distToPlayer < hornRadius) {
      if (scaredTimer <= 0.1 && (player.hornTimer > 0 || player.sirenActive)) {
        newlySaluted += 1;
      }
      scaredTimer = Math.max(scaredTimer, 2.2);
    }

    if (scaredTimer > 0) {
      scaredTimer = Math.max(0, scaredTimer - dt);
      const shoulderX = x <= 0 ? -9.8 : 9.8;
      targetLaneOffset = shoulderX;
      speed = baseSpeed * 0.65;
    } else {
      speed = baseSpeed;
      if (v.type === 'cng') {
        const weaveWave = Math.sin(elapsedTime * 0.8 + v.phaseOffset);
        const baseLane = northbound ? -4.5 : 4.5;
        targetLaneOffset = baseLane + (weaveWave > 0.4 ? -1.8 : weaveWave < -0.4 ? 1.5 : 0);
      } else if (v.type === 'rickshaw') {
        const baseLane = northbound ? -8.5 : 8.5;
        targetLaneOffset = baseLane + Math.sin(elapsedTime * 2.4 + v.phaseOffset) * 0.28;
      } else if (v.type === 'bus') {
        const baseLane = northbound ? -5.5 : 5.5;
        targetLaneOffset = baseLane;
      } else {
        const baseLane = northbound ? -3.5 : 3.5;
        targetLaneOffset = baseLane + Math.sin(elapsedTime * 1.7 + v.phaseOffset) * 1.45;
        speed = baseSpeed * (1 + 0.15 * Math.sin(elapsedTime * 1.2 + v.phaseOffset));
      }
    }

    const lateralLerp = 1 - Math.exp(-(scaredTimer > 0 ? 6.5 : 2.8) * dt);
    const prevX = x;
    x = x + (targetLaneOffset - x) * lateralLerp;
    laneOffset = x;

    z += dirSign * speed * dt;

    // Loop seamlessly along 480m city loop
    if (z < -260) z += 480;
    if (z > 220) z -= 480;

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
      hitCooldown,
    };
  });

  return { vehicles: updated, newlySaluted, accidents };
}
