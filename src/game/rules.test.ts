import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PABNA_LANDMARKS,
  createInitialPlayerState,
  stepPlayerCar,
  findNearestLandmark,
  speedToKmh,
  createInitialTraffic,
  stepTrafficVehicles,
  createInitialPedestrians,
  stepPedestrians,
  TrafficVehicle,
} from './rules';

test('Pabna landmarks include all major iconic monuments and institutions', () => {
  const names = PABNA_LANDMARKS.map((l) => l.nameEn.toLowerCase()).join(' | ');
  assert.ok(names.includes('abdul hamid road'), 'Missing Abdul Hamid Road');
  assert.ok(names.includes('zilla school'), 'Missing Zilla School');
  assert.ok(names.includes('robiul market'), 'Missing Robiul Market');
  assert.ok(names.includes('ananta cinema'), 'Missing Ananta Cinema Hall');
  assert.ok(names.includes('bus terminal'), 'Missing Bus Terminal');
  assert.ok(names.includes('edward college'), 'Missing Edward College');
  assert.ok(names.includes('mental hospital'), 'Missing Mental Hospital');
  assert.ok(names.includes('hardinge bridge'), 'Missing Hardinge Bridge');
  assert.ok(names.includes('shapla chattar'), 'Missing Shapla Chattar');
  assert.equal(PABNA_LANDMARKS.length, 10, 'Should have 10 comprehensive Pabna landmarks');
});

test('Player car accelerates, steers, and has no hard barriers (wraps smoothly)', () => {
  let state = createInitialPlayerState();
  const initialZ = state.z;

  // Accelerate forward for 10 steps
  for (let i = 0; i < 10; i++) {
    state = stepPlayerCar(
      state,
      { forward: true, backward: false, left: true, right: false, handbrake: false, boost: false },
      0.04
    );
  }

  assert.ok(state.speed > 5, 'Car should accelerate forward');
  assert.ok(state.z < initialZ, 'Car should move north (-Z) along Abdul Hamid Road');
  assert.ok(state.heading > 0, 'Car should turn left when steering left');
  assert.ok(state.distanceDriven > 0, 'Distance driven should accumulate');
  assert.ok(speedToKmh(state.speed) >= 18, 'KM/H conversion should work');
});

test('Traffic includes CNG auto, rickshaw, bike, and heavy inter-district buses', () => {
  const traffic = createInitialTraffic();
  const types = new Set(traffic.map((t) => t.type));
  assert.ok(types.has('cng'), 'Should spawn CNG autos');
  assert.ok(types.has('rickshaw'), 'Should spawn Rickshaws');
  assert.ok(types.has('bike'), 'Should spawn Bikes');
  assert.ok(types.has('bus'), 'Should spawn Buses');

  const player = createInitialPlayerState();
  player.x = traffic[0].x;
  player.z = traffic[0].z + 5;
  player.hornTimer = 1.2; // VIP Horn active ("নেতার গাড়ি, ১০০০ গজ দূরে থাকুন")

  const result = stepTrafficVehicles(traffic, player, 1.0, 0.04);
  assert.ok(result.newlySaluted >= 1, 'Nearby vehicles should salute/scatter when VIP horn sounds');
  assert.ok(result.vehicles[0].scaredTimer > 0, 'Closest vehicle should enter scared/yield state');
});

test('Accident with 1 person (pedestrian) increases currency by exactly 1,000 Tk', () => {
  const pedestrians = createInitialPedestrians();
  const player = createInitialPlayerState();
  // Place player right at first pedestrian
  player.x = pedestrians[0].x;
  player.z = pedestrians[0].z;

  const result = stepPedestrians(pedestrians, player, 0.04);
  assert.equal(result.accidents.length, 1, 'Should trigger 1 pedestrian accident');
  assert.equal(result.accidents[0].reward, 1000, 'Pedestrian collision must award exactly 1,000 Tk');
  assert.equal(result.accidents[0].type, 'pedestrian');
  assert.ok(result.pedestrians[0].isFallen, 'Hit pedestrian should be marked fallen');
});

test('Accident with vehicles increases currency from 5,000 to 50,000 Tk based on vehicle size', () => {
  const player = createInitialPlayerState();

  const testCases: { type: TrafficVehicle['type']; expectedReward: number }[] = [
    { type: 'bike', expectedReward: 8000 },
    { type: 'rickshaw', expectedReward: 15000 },
    { type: 'cng', expectedReward: 25000 },
    { type: 'bus', expectedReward: 50000 },
  ];

  for (const tc of testCases) {
    const singleVehicle: TrafficVehicle = {
      id: 99,
      type: tc.type,
      x: 0,
      z: 10,
      heading: 0,
      speed: 10,
      baseSpeed: 10,
      laneOffset: 0,
      targetLaneOffset: 0,
      roadSegment: 'main-north',
      scaredTimer: 0,
      hitCooldown: 0,
      phaseOffset: 0,
      colorHex: 0xff0000,
    };

    player.x = singleVehicle.x;
    player.z = singleVehicle.z;

    const res = stepTrafficVehicles([singleVehicle], player, 0, 0.04);
    assert.equal(res.accidents.length, 1, `Should trigger accident for ${tc.type}`);
    assert.equal(res.accidents[0].reward, tc.expectedReward, `Reward for ${tc.type} should be ${tc.expectedReward}`);
    assert.ok(
      res.accidents[0].reward >= 5000 && res.accidents[0].reward <= 50000,
      'Vehicle accident reward must be within 5,000 to 50,000 Tk'
    );
  }
});

test('Random "চা খাওয়ার টাকা" prompt deducts 1,000 Tk from currency', () => {
  let player = createInitialPlayerState();
  player.currency = 5000;
  player.chaKhaoyarTimer = 0.01; // About to trigger

  const emptyInput = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    handbrake: false,
    boost: false,
  };

  player = stepPlayerCar(player, emptyInput, 0.05);

  assert.equal(player.chaKhaoyarActive, true, 'Cha khaoyar event should become active');
  assert.equal(player.currency, 4000, 'Currency should be deducted by exactly 1,000 Tk');
  assert.equal(player.chaKhaoyarDeductCount, 1, 'Deduct count should increment');
  assert.ok(player.lastAccidentNotice?.textBn.includes('চা খাওয়ার'), 'Notice should record tea event in Pabna dialect');
});

test('findNearestLandmark returns closest Pabna landmark accurately', () => {
  const { landmark, distance } = findNearestLandmark(-24, 110);
  assert.equal(landmark.id, 'zilla-school');
  assert.ok(distance < 5);

  const { landmark: collegeLm } = findNearestLandmark(-100, -50);
  assert.equal(collegeLm.id, 'edward-college');

  const { landmark: bridgeLm } = findNearestLandmark(100, 75);
  assert.equal(bridgeLm.id, 'hardinge-bridge');
});

test('Driving on wrong side awards 2x income for accidents', () => {
  const pedestrians = createInitialPedestrians();
  const player = createInitialPlayerState();
  player.isWrongSide = true; // Driving on wrong side
  player.x = pedestrians[0].x;
  player.z = pedestrians[0].z;

  const result = stepPedestrians(pedestrians, player, 0.04);
  assert.equal(result.accidents.length, 1);
  assert.equal(result.accidents[0].reward, 2000, 'Wrong side accident should grant double reward (+2,000 Tk)');
});
