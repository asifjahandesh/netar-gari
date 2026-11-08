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

test('Traffic includes CNG auto, rickshaw, and bike with VIP horn scatter response', () => {
  const traffic = createInitialTraffic();
  const types = new Set(traffic.map((t) => t.type));
  assert.ok(types.has('cng'), 'Should spawn CNG autos');
  assert.ok(types.has('rickshaw'), 'Should spawn Rickshaws');
  assert.ok(types.has('bike'), 'Should spawn Bikes');

  const player = createInitialPlayerState();
  player.x = traffic[0].x;
  player.z = traffic[0].z + 5;
  player.hornTimer = 1.2; // VIP Horn active ("নেতার গাড়ি, ১০০০ গজ দূরে থাকুন")

  const result = stepTrafficVehicles(traffic, player, 1.0, 0.04);
  assert.ok(result.newlySaluted >= 1, 'Nearby vehicles should salute/scatter when VIP horn sounds');
  assert.ok(result.vehicles[0].scaredTimer > 0, 'Closest vehicle should enter scared/yield state');
});

test('findNearestLandmark returns closest Pabna landmark accurately', () => {
  const { landmark, distance } = findNearestLandmark(-22, 18);
  assert.equal(landmark.id, 'zilla-school');
  assert.ok(distance < 5);

  const { landmark: collegeLm } = findNearestLandmark(-95, -50);
  assert.equal(collegeLm.id, 'edward-college');

  const { landmark: bridgeLm } = findNearestLandmark(95, 75);
  assert.equal(bridgeLm.id, 'hardinge-bridge');
});
