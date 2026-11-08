import * as THREE from 'three';

/**
 * Ultra-high-resolution procedural Canvas 2D texture generators for:
 * - The iconic Political Leader's SUV rear warning signboard ("নেতার গাড়ি, ১০০০ গজ দূরে থাকুন")
 * - Photorealistic asphalt road surfaces with thermal paint, zebra crossings, and cast-iron manholes
 * - Tactile concrete sidewalks with hazard-painted curb chevrons
 * - Multi-story commercial building facades with authentic Bengali shopfronts & neon boards
 * - Colonial red terracotta brickwork for historic Pabna heritage monuments
 * - Traditional Bangladeshi Rickshaw folk art (রিকশা আর্ট)
 * - Inter-district coach liveries for terminal buses
 * - Political campaign festoons & banners
 */

/**
 * Generates the iconic, ultra-crisp rear signboard texture for the Political Leader's SUV:
 * "নেতার গাড়ি, ১০০০ গজ দূরে থাকুন"
 */
export function createNetarGariRearTexture(maxAnisotropy: number = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep luxury automotive crimson gradient background with metallic flake shimmer
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, '#58080f');
  grad.addColorStop(0.35, '#88131d');
  grad.addColorStop(0.7, '#6b0e16');
  grad.addColorStop(1, '#330508');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Outer brushed-gold metallic beveled border
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 36;
  ctx.strokeRect(28, 28, 1992, 968);

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 8;
  ctx.strokeRect(58, 58, 1932, 908);

  // Corner metallic mounting bolts
  [
    [70, 70],
    [1978, 70],
    [70, 954],
    [1978, 954],
  ].forEach(([bx, by]) => {
    ctx.beginPath();
    ctx.arc(bx, by, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#713f12';
    ctx.stroke();
  });

  // Top Protocol Header Bar with Bangladesh VIP Protocol Stars
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(72, 72, 1904, 110);

  ctx.fillStyle = '#facc15';
  ctx.fillRect(72, 178, 1904, 8);

  ctx.font = '700 52px "Hind Siliguri", "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 12;
  ctx.fillText('★ গণপ্রজাতন্ত্রী বাংলাদেশ · ভিআইপি প্রটোকল কনভয় · পাবনা সদর ★', 1024, 126);

  // Primary Hero Line 1: "নেতার গাড়ি," (Massive 3D Embossed White with Gold Sheen)
  ctx.font = '700 230px "Hind Siliguri", "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillText('নেতার গাড়ি,', 1024, 395);

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 10;
  ctx.fillText('নেতার গাড়ি,', 1024, 385);

  // High-Contrast Luminous Caution Yellow Pill for Line 2: "১০০০ গজ দূরে থাকুন"
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Diagonal safety hazard stripes flanking the caution pill
  const pillY = 530;
  const pillH = 260;
  const pillW = 1820;
  const pillX = 114;

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(pillX - 6, pillY - 6, pillW + 12, pillH + 12, 32);
  ctx.fill();

  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 28);
  ctx.fill();

  ctx.lineWidth = 10;
  ctx.strokeStyle = '#ca8a04';
  ctx.stroke();

  // Left & right hazard chevrons
  ctx.fillStyle = '#1e293b';
  for (let hx = pillX + 30; hx < pillX + 220; hx += 45) {
    ctx.beginPath();
    ctx.moveTo(hx, pillY + 16);
    ctx.lineTo(hx + 24, pillY + 16);
    ctx.lineTo(hx + 6, pillY + pillH - 16);
    ctx.lineTo(hx - 18, pillY + pillH - 16);
    ctx.closePath();
    ctx.fill();
  }
  for (let hx = pillX + pillW - 220; hx < pillX + pillW - 30; hx += 45) {
    ctx.beginPath();
    ctx.moveTo(hx, pillY + 16);
    ctx.lineTo(hx + 24, pillY + 16);
    ctx.lineTo(hx + 6, pillY + pillH - 16);
    ctx.lineTo(hx - 18, pillY + pillH - 16);
    ctx.closePath();
    ctx.fill();
  }

  // Text inside Caution Pill
  ctx.font = '700 185px "Hind Siliguri", "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#991b1b';
  ctx.fillText('১০০০ গজ দূরে থাকুন', 1024, pillY + 138);

  // Bottom Sub-Bar: License Registration & English Warning
  ctx.fillStyle = '#111827';
  ctx.fillRect(72, 824, 1904, 134);

  ctx.fillStyle = '#facc15';
  ctx.font = '700 50px "Chakra Petch", monospace';
  ctx.fillText('DHAKA METRO-GHA 11-0001 · LEADER VIP SUV · STAY 1000 YARDS AWAY', 1024, 888);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates a crisp circular spare-wheel cover emblem with "নেতার গাড়ি · ১০০০ গজ দূরে থাকুন"
 */
export function createSpareWheelSignTexture(maxAnisotropy: number = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, 1024, 1024);

  // Circular outer rim with chrome/gold ring
  ctx.beginPath();
  ctx.arc(512, 512, 480, 0, Math.PI * 2);
  ctx.fillStyle = '#7f1d1d';
  ctx.fill();
  ctx.lineWidth = 28;
  ctx.strokeStyle = '#facc15';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(512, 512, 440, 0, Math.PI * 2);
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#fde047';
  ctx.font = '700 52px "Hind Siliguri", sans-serif';
  ctx.fillText('★ ভিআইপি প্রটোকল ★', 512, 260);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 135px "Hind Siliguri", sans-serif';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 16;
  ctx.fillText('নেতার গাড়ি', 512, 430);

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Yellow pill
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.roundRect(110, 540, 804, 160, 24);
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#ca8a04';
  ctx.stroke();

  ctx.fillStyle = '#991b1b';
  ctx.font = '700 96px "Hind Siliguri", sans-serif';
  ctx.fillText('১০০০ গজ দূরে থাকুন', 512, 622);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 44px "Chakra Petch", sans-serif';
  ctx.fillText('পাবনা সদর · ABDUL HAMID RD', 512, 790);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates photorealistic seamless tileable Pabna Abdul Hamid Road asphalt texture & bump map.
 * Includes worn aggregate stone speckles, tire rubber wear paths, reflective yellow thermal boundaries,
 * center dashed line, pedestrian zebra crossings, and cast-iron drainage grates.
 */
export function createRoadTextures(maxAnisotropy: number = 4): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Dark weathered bituminous asphalt base
  ctx.fillStyle = '#22252a';
  ctx.fillRect(0, 0, 1024, 1024);

  // Deterministic PRNG for realistic aggregate noise
  let seed = 1971;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  // 2. Fine mineral aggregate speckles (light gray, slate, dark basalt)
  for (let i = 0; i < 9000; i++) {
    const x = rand() * 1024;
    const y = rand() * 1024;
    const shade = Math.floor(28 + rand() * 32);
    ctx.fillStyle = `rgb(${shade}, ${shade + 2}, ${shade + 4})`;
    const size = rand() > 0.85 ? 3 : 2;
    ctx.fillRect(x, y, size, size);
  }

  // 3. Dark tire track wear paths in the two main lanes (northbound and southbound)
  const laneCenters = [260, 360, 664, 764];
  laneCenters.forEach((cx) => {
    const wearGrad = ctx.createLinearGradient(cx - 45, 0, cx + 45, 0);
    wearGrad.addColorStop(0, 'rgba(18, 20, 24, 0)');
    wearGrad.addColorStop(0.5, 'rgba(12, 14, 17, 0.45)');
    wearGrad.addColorStop(1, 'rgba(18, 20, 24, 0)');
    ctx.fillStyle = wearGrad;
    ctx.fillRect(cx - 45, 0, 90, 1024);
  });

  // 4. Outer high-visibility yellow road boundary stripes with worn micro-edges
  ctx.fillStyle = '#eab308';
  ctx.fillRect(36, 0, 18, 1024);
  ctx.fillRect(970, 0, 18, 1024);

  // 5. Secondary white lane divider dashes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
  for (let y = 30; y < 1024; y += 256) {
    ctx.fillRect(270, y, 10, 130);
    ctx.fillRect(744, y, 10, 130);
  }

  // 6. Central median double line (vivid reflective yellow + white thermal strip)
  ctx.fillStyle = '#eab308';
  ctx.fillRect(502, 0, 8, 1024);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(514, 0, 8, 1024);

  // 7. Pedestrian Zebra Crossing (জেব্রা ক্রসিং) on lower portion of the tile
  ctx.fillStyle = '#f8fafc';
  for (let zx = 65; zx < 960; zx += 70) {
    ctx.fillRect(zx, 860, 42, 128);
  }

  // 8. Roadside storm drain cast-iron grates along gutter
  [45, 960].forEach((gx) => {
    for (let gy = 160; gy < 1024; gy += 480) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(gx - 6, gy, 14, 52);
      ctx.fillStyle = '#334155';
      for (let sl = gy + 6; sl < gy + 48; sl += 8) {
        ctx.fillRect(gx - 4, sl, 10, 3);
      }
    }
  });

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(1, 26);
  map.anisotropy = maxAnisotropy;

  // High-frequency grayscale bump map
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#7a7d85';
  bCtx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 5000; i++) {
    const v = Math.floor(95 + rand() * 65);
    bCtx.fillStyle = `rgb(${v},${v},${v})`;
    bCtx.fillRect(rand() * 512, rand() * 512, 2, 2);
  }

  // Raised paint lines on bump map
  bCtx.fillStyle = '#ffffff';
  bCtx.fillRect(18, 0, 9, 512);
  bCtx.fillRect(485, 0, 9, 512);
  bCtx.fillRect(251, 0, 10, 512);

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(2, 52);

  return { map, bumpMap };
}

/**
 * Generates tactile concrete paving slabs with alternating black & yellow safety curb paint
 */
export function createSidewalkTexture(maxAnisotropy: number = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, 0, 512, 512);

  // Paving slab grid joints
  ctx.fillStyle = '#64748b';
  for (let x = 0; x <= 512; x += 128) {
    ctx.fillRect(x, 0, 4, 512);
  }
  for (let y = 0; y <= 512; y += 128) {
    ctx.fillRect(0, y, 512, 4);
  }

  // Yellow tactile warning studs along curb edge
  ctx.fillStyle = '#eab308';
  for (let y = 16; y < 512; y += 32) {
    for (let x = 16; x < 64; x += 24) {
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Outer safety painted curb stripes (alternating yellow & black)
  for (let y = 0; y < 512; y += 64) {
    ctx.fillStyle = y % 128 === 0 ? '#facc15' : '#0f172a';
    ctx.fillRect(480, y, 32, 64);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 26);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

/**
 * Generates realistic Bangladesh commercial building shopfront facades:
 * Ground floor with rolling corrugated steel shutters & authentic Bengali neon signboards;
 * Upper floors with modern tinted glass windows, air conditioner units, and balconies.
 */
export function createBuildingFacadeTexture(
  shopNameBn: string,
  categoryBn: string,
  baseColorHex: string,
  signBgHex: string,
  accentHex: string,
  maxAnisotropy: number = 4
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Building wall background
  ctx.fillStyle = baseColorHex;
  ctx.fillRect(0, 0, 1024, 1024);

  // 1. Ground floor shopfront (y = 620 to 1024)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(30, 620, 964, 404);

  // Corrugated steel rolling shutter (শাটার)
  ctx.fillStyle = '#475569';
  for (let sy = 750; sy < 1000; sy += 16) {
    ctx.fillStyle = sy % 32 === 0 ? '#64748b' : '#334155';
    ctx.fillRect(50, sy, 924, 12);
  }

  // Shop Signboard
  ctx.fillStyle = signBgHex;
  ctx.fillRect(45, 630, 934, 110);
  ctx.lineWidth = 6;
  ctx.strokeStyle = accentHex;
  ctx.strokeRect(45, 630, 934, 110);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 48px "Hind Siliguri", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 8;
  ctx.fillText(shopNameBn, 512, 672);

  ctx.font = '600 24px "Hind Siliguri", sans-serif';
  ctx.fillStyle = accentHex;
  ctx.fillText(categoryBn, 512, 715);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // 2. Upper Floors (Floors 2, 3, 4) with glass windows and AC condenser units
  for (let floor = 0; floor < 3; floor++) {
    const fy = 60 + floor * 180;

    // Floor separation concrete beam
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, fy + 140, 1024, 18);

    // 4 glass window bays per floor
    for (let w = 0; w < 4; w++) {
      const wx = 65 + w * 230;
      // Window frame
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(wx, fy, 195, 125);

      // Glass specular reflection
      const wGrad = ctx.createLinearGradient(wx, fy, wx + 195, fy + 125);
      wGrad.addColorStop(0, '#0369a1');
      wGrad.addColorStop(0.5, '#38bdf8');
      wGrad.addColorStop(1, '#075985');
      ctx.fillStyle = wGrad;
      ctx.fillRect(wx + 8, fy + 8, 179, 109);

      // Window mullions (crossbars)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(wx + 95, fy + 8, 5, 109);
      ctx.fillRect(wx + 8, fy + 58, 179, 5);
    }

    // Wall-mounted split AC outdoor compressor unit (authentic detail!)
    const acX = 85 + (floor % 2) * 460;
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(acX, fy + 85, 60, 45);
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(acX + 30, fy + 107, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates British colonial weathered red terracotta brick texture for
 * Pabna Zilla School and Govt. Edward College heritage monuments.
 */
export function createHeritageBrickTexture(maxAnisotropy: number = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#8b1e1e';
  ctx.fillRect(0, 0, 1024, 1024);

  // Stacked terracotta bricks with mortar joints
  const brickH = 32;
  const brickW = 80;
  let row = 0;

  for (let y = 0; y < 1024; y += brickH) {
    const offsetX = (row % 2) * (brickW / 2);
    for (let x = -brickW; x < 1024 + brickW; x += brickW) {
      const shade = Math.floor(130 + Math.random() * 35);
      ctx.fillStyle = `rgb(${shade}, 28, 28)`;
      ctx.fillRect(x + offsetX + 2, y + 2, brickW - 4, brickH - 4);
    }
    // Lime mortar horizontal line
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, y, 1024, 2);
    row++;
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

/**
 * Generates authentic Bangladeshi Rickshaw backboard folk art (রিকশা আর্ট)
 */
export function createRickshawArtTexture(colorHex: number = 0xeab308, maxAnisotropy: number = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 512, 256);

  // Vivid folk art border
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 14;
  ctx.strokeRect(8, 8, 496, 240);

  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 4;
  ctx.strokeRect(22, 22, 468, 212);

  // Center lotus & peacock decorative motif
  ctx.fillStyle = '#059669';
  ctx.beginPath();
  ctx.arc(256, 128, 75, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(256, 128, 48, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '700 28px "Hind Siliguri", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('পাবনা এক্সপ্রেস', 256, 68);
  ctx.fillText('আল্লাহ সর্বশক্তিমান', 256, 188);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates inter-district coach livery texture for parked buses at Pabna Bus Terminal
 */
export function createBusLiveryTexture(
  busNameBn: string,
  routeBn: string,
  colorHex: string,
  maxAnisotropy: number = 4
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 1024, 512);

  // Aerodynamic side swoops
  ctx.fillStyle = colorHex;
  ctx.beginPath();
  ctx.moveTo(0, 240);
  ctx.bezierCurveTo(400, 240, 600, 380, 1024, 320);
  ctx.lineTo(1024, 480);
  ctx.lineTo(0, 480);
  ctx.closePath();
  ctx.fill();

  // Passenger windows strip
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(80, 70, 860, 120);

  for (let wx = 95; wx < 920; wx += 95) {
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(wx, 80, 80, 100);
    // Passenger silhouette
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(wx + 40, 125, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bus brand calligraphy
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 68px "Hind Siliguri", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 10;
  ctx.fillText(busNameBn, 512, 380);

  ctx.font = '700 32px "Hind Siliguri", sans-serif';
  ctx.fillStyle = '#fde047';
  ctx.fillText(routeBn, 512, 440);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates authentic Bengali + English architectural signboards for Pabna landmarks
 */
export function createLandmarkSignTexture(
  titleBn: string,
  titleEn: string,
  subtitleBn: string,
  bgHex: string,
  borderHex: string,
  maxAnisotropy: number = 4
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 340;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 1024, 340);

  // Decorative architectural border
  ctx.strokeStyle = borderHex;
  ctx.lineWidth = 14;
  ctx.strokeRect(12, 12, 1000, 316);

  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 3;
  ctx.strokeRect(26, 26, 972, 288);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Main Bengali Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 78px "Hind Siliguri", "Plus Jakarta Sans", sans-serif';
  ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 10;
  ctx.fillText(titleBn, 512, 110);

  // English Title
  ctx.shadowBlur = 0;
  ctx.fillStyle = borderHex;
  ctx.font = '700 40px "Chakra Petch", sans-serif';
  ctx.fillText(titleEn.toUpperCase(), 512, 205);

  // Subtitle
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 32px "Hind Siliguri", sans-serif';
  ctx.fillText(subtitleBn, 512, 275);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}
