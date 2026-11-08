import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameState,
  CameraMode,
  PaintFinish,
  PABNA_LANDMARKS,
} from './game/rules';
import {
  PabnaWorldCanvas,
  HudTelemetry,
  WorldControlActions,
} from './components/PabnaWorldCanvas';
import { soundEngine } from './game/audio';

const CAMERA_MODES: { id: CameraMode; label: string }[] = [
  { id: 'chase', label: 'Chase Cam' },
  { id: 'rear-closeup', label: 'Rear Sign (নেতার গাড়ি)' },
  { id: 'leader-pov', label: 'Leader Sunroof POV' },
  { id: 'aerial', label: 'Drone Aerial' },
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return 'playing';
      }
    }
    return 'title';
  });

  const [cameraMode, setCameraMode] = useState<CameraMode>('chase');
  const [paintFinish, setPaintFinish] = useState<PaintFinish>('obsidian-black');
  const [muted, setMuted] = useState<boolean>(false);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });
  const [mobileGamepadVisible, setMobileGamepadVisible] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 1024
      );
    }
    return true;
  });

  const [telemetry, setTelemetry] = useState<HudTelemetry>({
    speedKmh: 0,
    distanceMeters: 0,
    saluteCount: 0,
    nearestLandmark: PABNA_LANDMARKS[0],
    landmarkDistance: 35,
    visitedCount: 1,
    sirenActive: false,
    isReversing: false,
    playerX: -2,
    playerZ: 135,
    playerHeading: 0,
    currency: 0,
    accidentCount: 0,
    chaKhaoyarActive: false,
    lastAccidentNotice: null,
  });

  const actionsRef = useRef<WorldControlActions | null>(null);

  // Mirror game state to document.body.dataset.state
  useEffect(() => {
    document.body.dataset.state = gameState;
  }, [gameState]);

  const startGame = useCallback(() => {
    document.body.dataset.state = 'playing';
    setGameState('playing');
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    soundEngine.playClick();
  }, []);

  const cycleCamera = useCallback(() => {
    setCameraMode((prev) => {
      const idx = CAMERA_MODES.findIndex((c) => c.id === prev);
      return CAMERA_MODES[(idx + 1) % CAMERA_MODES.length].id;
    });
    soundEngine.playClick();
  }, []);

  const handleToggleMute = useCallback(() => {
    const isNowMuted = soundEngine.toggleMute();
    setMuted(isNowMuted);
  }, []);

  // Global keyboard bindings for Title -> Start, Pause, Camera, Mute, Dock Collapse
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'title') {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        setGameState((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
        soundEngine.playClick();
      } else if (gameState === 'playing') {
        if (e.code === 'KeyC') {
          cycleCamera();
        } else if (e.code === 'KeyM') {
          handleToggleMute();
        } else if (e.code === 'KeyV') {
          setCameraMode((prev) => (prev === 'rear-closeup' ? 'chase' : 'rear-closeup'));
          soundEngine.playClick();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState, startGame, cycleCamera, handleToggleMute]);

  const currentCameraLabel = CAMERA_MODES.find((c) => c.id === cameraMode)?.label ?? 'Chase Cam';

  return (
    <main className="relative w-full h-full overflow-hidden select-none">
      {/* Persistent 60fps Three.js Pabna City Road Viewport */}
      <PabnaWorldCanvas
        gameState={gameState}
        cameraMode={cameraMode}
        paintFinish={paintFinish}
        onTelemetryUpdate={setTelemetry}
        actionsRef={actionsRef}
      />

      {/* =====================================================================
          STATE 1: TITLE SCREEN ('title')
          Asymmetric left-third negative space composition + bespoke SVG emblem
         ===================================================================== */}
      {gameState === 'title' && (
        <div
          className="fixed inset-0 z-20 flex flex-col justify-between p-4 md:p-12 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at top left, rgba(9,13,22,0.88) 0%, rgba(9,13,22,0.55) 50%, rgba(9,13,22,0.85) 100%)',
          }}
        >
          {/* Left-third Title Lockup & Primary CTA */}
          <div className="max-w-xl my-auto pointer-events-auto">
            {/* Bespoke Inline SVG Title Emblem */}
            <svg
              viewBox="0 0 540 195"
              className="w-full max-w-[320px] sm:max-w-[420px] md:max-w-[500px] h-auto mb-3 md:mb-5 drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]"
              role="img"
              aria-label="Pabna VIP Convoy: নেতার গাড়ি, ১০০০ গজ দূরে থাকুন"
            >
              {/* Protocol Shield Header */}
              <rect
                x="4"
                y="6"
                width="310"
                height="32"
                rx="6"
                fill="#7f1d1d"
                stroke="#facc15"
                strokeWidth="2.5"
              />
              <text
                x="159"
                y="27"
                textAnchor="middle"
                fill="#fde047"
                fontSize="14"
                fontWeight="700"
                fontFamily="Chakra Petch, Hind Siliguri, sans-serif"
                letterSpacing="1.5"
              >
                ★ PABNA ABDUL HAMID ROAD 3D ★
              </text>

              {/* Main Display Title */}
              <text
                x="4"
                y="86"
                fill="#ffffff"
                fontSize="50"
                fontWeight="700"
                fontFamily="Hind Siliguri, Plus Jakarta Sans, sans-serif"
              >
                পাবনা সিটি কনভয়
              </text>
              <text
                x="4"
                y="126"
                fill="#facc15"
                fontSize="28"
                fontWeight="700"
                fontFamily="Chakra Petch, sans-serif"
                letterSpacing="2"
              >
                PABNA VIP PROTOCOL RIDE
              </text>

              {/* Rear Car Bumper Sign Replica Plaque */}
              <rect
                x="4"
                y="140"
                width="510"
                height="48"
                rx="6"
                fill="#991b1b"
                stroke="#facc15"
                strokeWidth="3"
              />
              <text
                x="259"
                y="172"
                textAnchor="middle"
                fill="#fef08a"
                fontSize="26"
                fontWeight="700"
                fontFamily="Hind Siliguri, sans-serif"
              >
                নেতার গাড়ি, ১০০০ গজ দূরে থাকুন
              </text>
            </svg>

            <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed mb-4 md:mb-6 max-w-lg font-normal hidden sm:block">
              Experience the full 3D visual realism of Pabna City: drive down{' '}
              <span className="text-amber-300 font-semibold">Abdul Hamid Road</span> past{' '}
              <span className="text-white font-medium">
                Pabna Zilla School, Shapla Chattar, Robiul Market, Ananta Cinema Hall, Bus Terminal,
                Govt. Edward College, and Paksey Bridge Monument
              </span>{' '}
              with dedicated touch buttons for mobile and keyboard controls for desktop.
            </p>

            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <button
                type="button"
                data-start="true"
                onClick={startGame}
                className="px-6 py-3.5 md:px-8 md:py-4 rounded-xl bg-amber-400 hover:bg-amber-300 active:translate-y-0.5 text-slate-950 font-display font-bold text-sm md:text-lg tracking-wide shadow-[0_0_30px_rgba(251,191,36,0.5)] transition cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2"
              >
                <span>🚗</span>
                <span>START VIP RIDE · যাত্রা শুরু করুন</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCameraMode('rear-closeup');
                  startGame();
                }}
                className="px-4 py-3 md:px-5 md:py-4 rounded-xl bg-red-950/90 hover:bg-red-900 text-amber-200 border-2 border-amber-400/60 font-bengali font-bold text-xs md:text-sm transition cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2"
              >
                <span>🔍</span>
                <span>নেতার গাড়ি দেখুন (Rear Sign)</span>
              </button>
            </div>
          </div>

          {/* Control hints footer */}
          <div className="w-full flex items-center justify-between text-[11px] md:text-sm text-slate-300 font-display tracking-wide pt-2 md:pt-4 border-t border-slate-800/80">
            <span>
              Controls: Touch buttons on mobile screen · WASD / Arrows on PC · Space VIP Horn · B Leader Wave · C Camera
            </span>
          </div>
        </div>
      )}

      {/* =====================================================================
          STATE 2: PLAYING HUD ('playing')
         ===================================================================== */}
      {gameState === 'playing' && (
        <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-2 md:p-5">
          {/* -------------------------------------------------------------
              2A. DESKTOP TOP BAR (Full rich cards, hidden on mobile)
             ------------------------------------------------------------- */}
          <div className="hidden md:flex items-start justify-between gap-3">
            {/* Top-Left Cluster: Active Pabna Landmark & Convoy Respect Readout */}
            <div
              className="pointer-events-auto rounded-xl px-4 py-2.5 border border-amber-400/40 shadow-xl shrink-0"
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.92)' }}
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-[10px] md:text-[11px] font-display uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <span>📍</span>
                    <span>CURRENT PABNA LOCATION · বর্তমান অবস্থান</span>
                  </div>
                  <div className="text-base md:text-xl font-bold font-bengali text-white leading-tight">
                    {telemetry.nearestLandmark.nameBn}{' '}
                    <span className="text-xs md:text-sm font-display font-semibold text-slate-300">
                      · {telemetry.nearestLandmark.nameEn}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-bengali">
                    {telemetry.nearestLandmark.subtitleBn} ·{' '}
                    <span className="font-mono tabular-nums text-amber-300">
                      {telemetry.landmarkDistance}m away
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabular Stats Strip */}
              <div className="mt-2 pt-2 border-t border-slate-700/80 flex items-center gap-4 md:gap-5 text-xs">
                <div>
                  <span className="text-slate-400 font-display">DISTANCE </span>
                  <span className="font-mono tabular-nums font-bold text-white text-sm">
                    {telemetry.distanceMeters}m
                  </span>
                </div>
                <span aria-hidden="true" className="text-slate-600">
                  ·
                </span>
                <div>
                  <span className="text-slate-400 font-display">SALUTES </span>
                  <span className="font-mono tabular-nums font-bold text-amber-300 text-sm">
                    {telemetry.saluteCount}
                  </span>
                </div>
                <span aria-hidden="true" className="text-slate-600">
                  ·
                </span>
                <div>
                  <span className="text-slate-400 font-display">LANDMARKS </span>
                  <span className="font-mono tabular-nums font-bold text-emerald-400 text-sm">
                    {telemetry.visitedCount}/{PABNA_LANDMARKS.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Active BDT Currency & Accident Counter */}
            <div
              className="pointer-events-auto rounded-xl px-4 py-2 border-2 border-emerald-400/80 shadow-2xl flex items-center gap-3 mx-auto shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
              }}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xl font-bold text-emerald-300 shadow-inner">
                ৳
              </div>
              <div>
                <div className="text-[10px] md:text-[11px] font-display uppercase tracking-widest text-emerald-300 font-bold">
                  ACTIVE BDT CURRENCY · ব্যালেন্স
                </div>
                <div className="text-xl md:text-2xl font-bold font-mono text-emerald-300 tabular-nums leading-none">
                  ৳ {telemetry.currency.toLocaleString()}
                </div>
                <div className="text-[10px] font-bengali text-slate-300 mt-0.5">
                  মোট দুর্ঘটনা: <span className="text-amber-300 font-bold">{telemetry.accidentCount}</span>
                </div>
              </div>
            </div>

            {/* Top-Right Cluster: Rear Bumper Sign View + Mobile Touch Gamepad Toggle + Utility Buttons */}
            <div className="flex items-center gap-2 pointer-events-auto flex-wrap justify-end">
              {/* Diegetic Rear Bumper Sign Toggle Button */}
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setCameraMode((prev) => (prev === 'rear-closeup' ? 'chase' : 'rear-closeup'));
                  soundEngine.playClick();
                }}
                aria-label="Inspect Rear Car Sign: নেতার গাড়ি, ১০০০ গজ দূরে থাকুন"
                className={`px-3 py-2 rounded-lg border text-xs font-bengali font-bold transition cursor-pointer whitespace-nowrap shrink-0 shadow-md ${
                  cameraMode === 'rear-closeup'
                    ? 'bg-amber-400 text-slate-950 border-white'
                    : 'bg-red-950/90 text-amber-200 border-amber-400/50 hover:bg-red-900'
                }`}
              >
                নেতার গাড়ি, ১০০০ গজ দূরে থাকুন [V]
              </button>

              {/* Mobile Gamepad / Touch Buttons Toggle */}
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setMobileGamepadVisible((prev) => !prev);
                  soundEngine.playClick();
                }}
                aria-label="Toggle Mobile Touch Controls"
                className={`h-10 px-3 rounded-lg border text-xs font-display font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-md transition ${
                  mobileGamepadVisible
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                <span>📱</span>
                <span>Touch Pad: {mobileGamepadVisible ? 'ON' : 'OFF'}</span>
              </button>

              {/* Camera Mode Button */}
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  cycleCamera();
                }}
                aria-label={`Switch Camera View (Current: ${currentCameraLabel})`}
                className="h-10 px-3 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-100 text-xs font-display font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>📷</span>
                <span>{currentCameraLabel} [C]</span>
              </button>

              {/* Mute Button [M] */}
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  handleToggleMute();
                }}
                aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
                className="w-10 h-10 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-100 cursor-pointer shrink-0"
              >
                {muted ? '🔇' : '🔊'}
              </button>

              {/* Pause Button [P] */}
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setGameState('paused');
                  soundEngine.playClick();
                }}
                aria-label="Pause Game"
                className="w-10 h-10 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-100 cursor-pointer shrink-0"
              >
                ⏸
              </button>
            </div>
          </div>

          {/* -------------------------------------------------------------
              2B. MOBILE COMPACT TOP BAR (Sleek 38px floating header, 0 obstruction)
             ------------------------------------------------------------- */}
          <div className="flex md:hidden items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/60 backdrop-blur-md border border-white/15 pointer-events-auto shadow-lg mx-0.5">
            {/* Left: Landmark & Speed badge */}
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="text-amber-400 text-xs shrink-0">📍</span>
              <div className="min-w-0">
                <div className="text-xs font-bold font-bengali text-white leading-tight truncate max-w-[120px] xs:max-w-[150px]">
                  {telemetry.nearestLandmark.nameBn}
                </div>
                <div className="text-[10px] font-mono text-amber-300 leading-none mt-0.5">
                  <span className="font-bold">{telemetry.speedKmh}</span> km/h · {telemetry.distanceMeters}m
                </div>
              </div>
            </div>

            {/* Center: Active BDT Currency badge */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/70 text-emerald-300 shadow-inner shrink-0">
              <span className="text-xs font-bold">৳</span>
              <span className="font-mono font-bold text-xs tabular-nums">
                {telemetry.currency.toLocaleString()}
              </span>
            </div>

            {/* Right: Compact Icon Utility Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Camera Cycle */}
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  cycleCamera();
                }}
                aria-label="Switch Camera Mode"
                className="w-7 h-7 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-100 flex items-center justify-center text-xs active:bg-amber-400 active:text-slate-950 cursor-pointer"
              >
                📷
              </button>

              {/* Rear Bumper Sign View */}
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setCameraMode((prev) => (prev === 'rear-closeup' ? 'chase' : 'rear-closeup'));
                  soundEngine.playClick();
                }}
                aria-label="Toggle Rear Sign View"
                className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs cursor-pointer ${
                  cameraMode === 'rear-closeup'
                    ? 'bg-amber-400 text-slate-950 border-white'
                    : 'bg-red-950/90 text-amber-200 border-amber-500/50'
                }`}
              >
                🏷️
              </button>

              {/* Touch Pad Toggle */}
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setMobileGamepadVisible((prev) => !prev);
                  soundEngine.playClick();
                }}
                aria-label="Toggle Mobile Touch Controls"
                className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs cursor-pointer ${
                  mobileGamepadVisible
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-slate-900/80 text-slate-400 border-slate-700'
                }`}
              >
                📱
              </button>

              {/* Mute Button */}
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  handleToggleMute();
                }}
                aria-label={muted ? 'Unmute' : 'Mute'}
                className="w-7 h-7 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-100 flex items-center justify-center text-xs active:bg-slate-700 cursor-pointer"
              >
                {muted ? '🔇' : '🔊'}
              </button>

              {/* Pause Button */}
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setGameState('paused');
                  soundEngine.playClick();
                }}
                aria-label="Pause"
                className="w-7 h-7 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-100 flex items-center justify-center text-xs active:bg-amber-400 cursor-pointer"
              >
                ⏸
              </button>
            </div>
          </div>

          {/* Floating Accident & Reward Notice Toast */}
          {telemetry.lastAccidentNotice && (
            <div
              key={telemetry.lastAccidentNotice.timestamp}
              className="mx-auto pointer-events-none mt-1.5 px-3.5 py-1 rounded-full border shadow-lg animate-bounce flex items-center gap-1.5 backdrop-blur-md shrink-0"
              style={{
                backgroundColor:
                  telemetry.lastAccidentNotice.amount >= 0 ? 'rgba(6, 78, 59, 0.9)' : 'rgba(153, 27, 27, 0.9)',
                borderColor: telemetry.lastAccidentNotice.amount >= 0 ? '#34d399' : '#f87171',
              }}
            >
              <span className="text-sm">
                {telemetry.lastAccidentNotice.amount >= 0 ? '💥💰' : '☕💸'}
              </span>
              <span className="font-bengali font-bold text-xs sm:text-sm text-white">
                {telemetry.lastAccidentNotice.textBn}
              </span>
            </div>
          )}

          {/* =====================================================================
              DEDICATED MOBILE TOUCH GAMEPAD HUD (Ergonomic Translucent Floating Controls)
             ===================================================================== */}
          {mobileGamepadVisible && (
            <>
              {/* Quick Floating Action Row: VIP Horn, Wave, Siren (Floating right above pedals) */}
              <div
                className="fixed bottom-28 sm:bottom-32 right-2.5 sm:right-4 z-20 pointer-events-auto flex items-center gap-1.5 sm:gap-2 select-none"
                style={{ touchAction: 'none' }}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    actionsRef.current?.triggerHorn();
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    actionsRef.current?.triggerHorn();
                  }}
                  aria-label="VIP Horn"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-600/40 active:bg-amber-400 active:text-slate-950 text-white border border-red-400/50 backdrop-blur-sm shadow-md active:scale-95 transition flex items-center justify-center text-base sm:text-lg cursor-pointer"
                >
                  📢
                </button>

                <button
                  type="button"
                  tabIndex={-1}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    actionsRef.current?.triggerWave();
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    actionsRef.current?.triggerWave();
                  }}
                  aria-label="Leader Wave Salute"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-amber-500/40 active:bg-amber-300 text-white border border-amber-300/50 backdrop-blur-sm shadow-md active:scale-95 transition flex items-center justify-center text-base sm:text-lg cursor-pointer"
                >
                  ✋
                </button>

                <button
                  type="button"
                  tabIndex={-1}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    actionsRef.current?.toggleSiren();
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    actionsRef.current?.toggleSiren();
                  }}
                  aria-label="Toggle Siren"
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border backdrop-blur-sm shadow-md flex items-center justify-center text-base sm:text-lg active:scale-95 transition cursor-pointer ${
                    telemetry.sirenActive
                      ? 'bg-blue-600/70 border-white text-white animate-pulse'
                      : 'bg-slate-900/40 border-slate-600/50 text-slate-300'
                  }`}
                >
                  🚨
                </button>
              </div>

              {/* Left Thumb: Steering Left & Right (Floating at Bottom-Left Corner) */}
              <div
                className="fixed bottom-3 sm:bottom-4 left-2.5 sm:left-4 z-20 pointer-events-auto flex items-center gap-2 select-none"
                style={{ touchAction: 'none' }}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    actionsRef.current?.setTouchInput('left', true);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    actionsRef.current?.setTouchInput('left', false);
                  }}
                  onTouchCancel={(e) => {
                    e.preventDefault();
                    actionsRef.current?.setTouchInput('left', false);
                  }}
                  onMouseDown={() => actionsRef.current?.setTouchInput('left', true)}
                  onMouseUp={() => actionsRef.current?.setTouchInput('left', false)}
                  onMouseLeave={() => actionsRef.current?.setTouchInput('left', false)}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-950/40 active:bg-amber-400 active:text-slate-950 text-white font-display font-bold text-xl flex flex-col items-center justify-center border border-white/20 shadow-lg active:scale-95 transition backdrop-blur-sm cursor-pointer"
                  aria-label="Steer Left"
                >
                  <span>◀</span>
                  <span className="text-[9px] font-bengali leading-none mt-0.5">বামে</span>
                </button>

                <button
                  type="button"
                  tabIndex={-1}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    actionsRef.current?.setTouchInput('right', true);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    actionsRef.current?.setTouchInput('right', false);
                  }}
                  onTouchCancel={(e) => {
                    e.preventDefault();
                    actionsRef.current?.setTouchInput('right', false);
                  }}
                  onMouseDown={() => actionsRef.current?.setTouchInput('right', true)}
                  onMouseUp={() => actionsRef.current?.setTouchInput('right', false)}
                  onMouseLeave={() => actionsRef.current?.setTouchInput('right', false)}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-950/40 active:bg-amber-400 active:text-slate-950 text-white font-display font-bold text-xl flex flex-col items-center justify-center border border-white/20 shadow-lg active:scale-95 transition backdrop-blur-sm cursor-pointer"
                  aria-label="Steer Right"
                >
                  <span>▶</span>
                  <span className="text-[9px] font-bengali leading-none mt-0.5">ডানে</span>
                </button>
              </div>

              {/* Right Thumb: Gas, Brake & Drift Pedals (Floating at Bottom-Right Corner) */}
              <div
                className="fixed bottom-3 sm:bottom-4 right-2.5 sm:right-4 z-20 pointer-events-auto flex items-end gap-2 select-none"
                style={{ touchAction: 'none' }}
              >
                {/* Drift / Handbrake button */}
                <button
                  type="button"
                  tabIndex={-1}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    actionsRef.current?.setTouchInput('handbrake', true);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    actionsRef.current?.setTouchInput('handbrake', false);
                  }}
                  onTouchCancel={(e) => {
                    e.preventDefault();
                    actionsRef.current?.setTouchInput('handbrake', false);
                  }}
                  onMouseDown={() => actionsRef.current?.setTouchInput('handbrake', true)}
                  onMouseUp={() => actionsRef.current?.setTouchInput('handbrake', false)}
                  onMouseLeave={() => actionsRef.current?.setTouchInput('handbrake', false)}
                  className="w-11 h-14 rounded-xl bg-amber-500/35 hover:bg-amber-500/50 active:bg-amber-400 active:text-slate-950 text-amber-200 font-display font-bold text-xs flex flex-col items-center justify-center border border-amber-400/40 shadow-lg active:scale-95 transition backdrop-blur-sm cursor-pointer"
                  aria-label="Handbrake / Drift"
                >
                  <span className="text-base">⚡</span>
                  <span className="text-[8px] font-bold leading-none mt-0.5">DRIFT</span>
                </button>

                {/* Brake / Reverse Pedal */}
                <button
                  type="button"
                  tabIndex={-1}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    actionsRef.current?.setTouchInput('backward', true);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    actionsRef.current?.setTouchInput('backward', false);
                  }}
                  onTouchCancel={(e) => {
                    e.preventDefault();
                    actionsRef.current?.setTouchInput('backward', false);
                  }}
                  onMouseDown={() => actionsRef.current?.setTouchInput('backward', true)}
                  onMouseUp={() => actionsRef.current?.setTouchInput('backward', false)}
                  onMouseLeave={() => actionsRef.current?.setTouchInput('backward', false)}
                  className="w-13 h-18 sm:w-15 sm:h-22 rounded-2xl bg-rose-600/35 hover:bg-rose-600/50 active:bg-rose-500 text-white font-display font-bold text-xs flex flex-col items-center justify-center border border-rose-400/40 shadow-lg active:scale-95 transition backdrop-blur-sm cursor-pointer"
                  aria-label="Brake and Reverse"
                >
                  <span className="text-lg leading-none">▼</span>
                  <span className="text-[10px] font-bold leading-none mt-1">BRAKE</span>
                  <span className="text-[8px] font-bengali text-rose-200 leading-none">ব্রেক</span>
                </button>

                {/* Accelerate / Gas Pedal */}
                <button
                  type="button"
                  tabIndex={-1}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    actionsRef.current?.setTouchInput('forward', true);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    actionsRef.current?.setTouchInput('forward', false);
                  }}
                  onTouchCancel={(e) => {
                    e.preventDefault();
                    actionsRef.current?.setTouchInput('forward', false);
                  }}
                  onMouseDown={() => actionsRef.current?.setTouchInput('forward', true)}
                  onMouseUp={() => actionsRef.current?.setTouchInput('forward', false)}
                  onMouseLeave={() => actionsRef.current?.setTouchInput('forward', false)}
                  className="w-15 h-22 sm:w-18 sm:h-26 rounded-2xl bg-emerald-600/40 hover:bg-emerald-600/55 active:bg-emerald-400 text-white font-display font-bold text-sm flex flex-col items-center justify-center border border-emerald-400/50 shadow-lg active:scale-95 transition backdrop-blur-sm cursor-pointer"
                  aria-label="Accelerate"
                >
                  <span className="text-2xl leading-none">▲</span>
                  <span className="text-[11px] font-bold leading-none mt-1">GAS</span>
                  <span className="text-[9px] font-bengali text-emerald-200 leading-none">ত্বরণ</span>
                </button>
              </div>
            </>
          )}

          {/* -------------------------------------------------------------
              2C. COLLAPSIBLE BOTTOM DOCK & LANDMARK JUMP STRIP
             ------------------------------------------------------------- */}
          {/* Desktop Dock Container */}
          <div className="hidden md:flex flex-col items-center mx-auto w-full max-w-[1280px] pointer-events-auto">
            {/* Collapse / Expand Drawer Tab */}
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                setDockCollapsed((prev) => !prev);
              }}
              className="px-3.5 py-1 rounded-t-lg bg-slate-900/95 border border-b-0 border-slate-700 text-xs font-display text-slate-300 hover:text-white cursor-pointer whitespace-nowrap shadow-lg flex items-center gap-1.5"
            >
              <span>{dockCollapsed ? '▴' : '▾'}</span>
              <span>
                {dockCollapsed ? 'Show Pabna Landmarks & Teleport Strip' : 'Hide Landmark Dock'}
              </span>
            </button>

            {!dockCollapsed && (
              <div
                className="w-full rounded-xl px-3.5 py-2.5 border border-slate-700/90 shadow-2xl flex items-center justify-between gap-3"
                style={{ backgroundColor: 'rgba(11, 17, 30, 0.95)' }}
              >
                {/* Zone 1: Speedometer */}
                <div className="flex items-center gap-3 pr-3 border-r border-slate-800">
                  <div className="text-right min-w-[72px]">
                    <div className="text-2xl md:text-3xl font-display font-bold tabular-nums text-amber-400 leading-none">
                      {telemetry.speedKmh}
                    </div>
                    <div className="text-[10px] font-display uppercase tracking-wider text-slate-400">
                      KM/H · {telemetry.isReversing ? 'REV' : 'DRIVE'}
                    </div>
                  </div>
                </div>

                {/* Zone 2: Instant Pabna Landmark Jump Strip (All 10 Famous Landmarks) */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 flex-1">
                  {PABNA_LANDMARKS.map((lm) => {
                    const isNearest = telemetry.nearestLandmark.id === lm.id;
                    return (
                      <button
                        key={lm.id}
                        type="button"
                        tabIndex={-1}
                        onClick={(e) => {
                          e.currentTarget.blur();
                          actionsRef.current?.teleportToLandmark(lm.id);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bengali font-semibold transition cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                          isNearest
                            ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                            : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <span>📍</span>
                        <span>{lm.nameBn}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Zone 3: SUV Paint Finishes */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <span className="text-[11px] font-display text-slate-400 uppercase">
                    Paint:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {(
                      [
                        { id: 'obsidian-black', hex: '#0f172a', label: 'Black VIP SUV' },
                        { id: 'pearl-white', hex: '#f8fafc', label: 'White VIP SUV' },
                        { id: 'protocol-maroon', hex: '#600d16', label: 'Maroon VIP SUV' },
                      ] as { id: PaintFinish; hex: string; label: string }[]
                    ).map((sw) => (
                      <button
                        key={sw.id}
                        type="button"
                        tabIndex={-1}
                        aria-label={sw.label}
                        onClick={(e) => {
                          e.currentTarget.blur();
                          setPaintFinish(sw.id);
                          soundEngine.playClick();
                        }}
                        className={`w-6 h-6 rounded-full border-2 cursor-pointer transition ${
                          paintFinish === sw.id ? 'border-amber-400 scale-110 shadow-lg' : 'border-slate-500'
                        }`}
                        style={{ backgroundColor: sw.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Minimal Landmark Drawer Trigger (Centered at bottom, non-obstructive) */}
          <div className="flex md:hidden fixed bottom-2 left-1/2 -translate-x-1/2 z-15 pointer-events-auto">
            {dockCollapsed ? (
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setDockCollapsed(false);
                }}
                className="px-3 py-1 rounded-full bg-slate-950/60 hover:bg-slate-900/80 border border-white/20 text-[11px] font-bengali text-slate-200 cursor-pointer whitespace-nowrap shadow-md backdrop-blur-sm flex items-center gap-1.5"
              >
                <span>📍 পাবনা স্থানসমূহ ({PABNA_LANDMARKS.length}) ▴</span>
              </button>
            ) : (
              <div className="fixed bottom-0 inset-x-0 mx-auto max-w-lg bg-slate-950/92 backdrop-blur-lg border-t border-slate-700/80 p-3 rounded-t-2xl shadow-2xl z-30 pointer-events-auto max-h-52 overflow-y-auto">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-amber-400 font-bengali flex items-center gap-1">
                    <span>📍</span>
                    <span>পাবনার দর্শনীয় স্থানসমূহ (তাৎক্ষণিক গমন)</span>
                  </span>
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setDockCollapsed(true)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-display cursor-pointer"
                  >
                    বন্ধ করুন ✕
                  </button>
                </div>

                {/* Horizontal Scrolling Landmark List */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 mb-2">
                  {PABNA_LANDMARKS.map((lm) => {
                    const isNearest = telemetry.nearestLandmark.id === lm.id;
                    return (
                      <button
                        key={lm.id}
                        type="button"
                        tabIndex={-1}
                        onClick={(e) => {
                          e.currentTarget.blur();
                          actionsRef.current?.teleportToLandmark(lm.id);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bengali font-semibold transition cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                          isNearest
                            ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                            : 'bg-slate-800/90 text-slate-200'
                        }`}
                      >
                        <span>📍</span>
                        <span>{lm.nameBn}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Mobile Paint Selection */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-display">SUV PAINT FINISH:</span>
                  <div className="flex items-center gap-2">
                    {(
                      [
                        { id: 'obsidian-black', hex: '#0f172a', label: 'Black' },
                        { id: 'pearl-white', hex: '#f8fafc', label: 'White' },
                        { id: 'protocol-maroon', hex: '#600d16', label: 'Maroon' },
                      ] as { id: PaintFinish; hex: string; label: string }[]
                    ).map((sw) => (
                      <button
                        key={sw.id}
                        type="button"
                        tabIndex={-1}
                        aria-label={sw.label}
                        onClick={() => {
                          setPaintFinish(sw.id);
                          soundEngine.playClick();
                        }}
                        className={`w-6 h-6 rounded-full border-2 cursor-pointer transition ${
                          paintFinish === sw.id ? 'border-amber-400 scale-110 shadow-lg' : 'border-slate-500'
                        }`}
                        style={{ backgroundColor: sw.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          STREET EVENT DIALOG: "ভাই চা খাওয়ার টাকা টা যদি......."
         ===================================================================== */}
      {telemetry.chaKhaoyarActive && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 flex items-center justify-center p-3"
          style={{ backgroundColor: 'rgba(9, 13, 22, 0.45)' }}
        >
          <div className="w-full max-w-xs sm:max-w-sm rounded-2xl bg-slate-950/85 backdrop-blur-md border border-amber-400/80 p-4 sm:p-5 shadow-[0_0_40px_rgba(245,158,11,0.4)] text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl shadow-inner">
              ☕
            </div>

            <div className="text-[10px] font-display uppercase tracking-widest text-amber-300 mb-0.5 font-bold">
              পাবনা শহরের চা আড্ডা · STREET PETITION
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-bengali text-white mb-1.5 leading-tight">
              “ভাই চা খাওয়ার টাকা টা যদি.......”
            </h2>

            <p className="text-xs sm:text-sm font-bengali text-amber-200/90 mb-3 leading-snug">
              পাবনা শহরের একদল মানুষ এসে নেতার গাড়ি ঘিরে ধরে বিনীতভাবে চা খাওয়ার টাকা চেয়েছে!
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-bengali font-bold mb-4">
              <span>💸</span>
              <span>-১,০০০ টাকা কেটে নেওয়া হয়েছে!</span>
            </div>

            <button
              type="button"
              onClick={() => {
                actionsRef.current?.dismissChaKhaoyar();
              }}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bengali font-bold text-sm shadow-[0_0_20px_rgba(251,191,36,0.4)] active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>☕</span>
              <span>আচ্ছা নেন (দিলাম ১,০০০ টাকা)</span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          STATE 3: PAUSE MODAL ('paused')
         ===================================================================== */}
      {gameState === 'paused' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pause-modal-title"
          className="fixed inset-0 z-30 flex items-center justify-center p-3 sm:p-6"
          style={{ backgroundColor: 'rgba(9, 13, 22, 0.65)' }}
        >
          <div className="w-full max-w-sm sm:max-w-md rounded-2xl bg-slate-950/90 backdrop-blur-md border border-amber-400/40 p-4 sm:p-6 shadow-2xl">
            <div className="text-xs font-display uppercase tracking-widest text-amber-400 mb-1">
              VIP PROTOCOL PAUSED · বিরতি
            </div>
            <h2 id="pause-modal-title" className="text-xl sm:text-2xl font-bold font-bengali text-white mb-3">
              নেতার গাড়ি · পাবনা সিটি রোড
            </h2>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 p-2.5 sm:p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40">
              <div>
                <div className="text-[10px] sm:text-[11px] font-display text-emerald-300">TOTAL BDT · ব্যালেন্স</div>
                <div className="text-lg sm:text-xl font-mono tabular-nums font-bold text-emerald-300">
                  ৳ {telemetry.currency.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] sm:text-[11px] font-display text-emerald-300">ACCIDENTS · দুর্ঘটনা</div>
                <div className="text-lg sm:text-xl font-mono tabular-nums font-bold text-amber-300">
                  {telemetry.accidentCount}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 p-2.5 sm:p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-[10px] font-display text-slate-400">DISTANCE</div>
                <div className="text-sm sm:text-base font-mono tabular-nums font-bold text-white">
                  {telemetry.distanceMeters}m
                </div>
              </div>
              <div>
                <div className="text-[10px] font-display text-slate-400">SALUTES</div>
                <div className="text-sm sm:text-base font-mono tabular-nums font-bold text-amber-400">
                  {telemetry.saluteCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-display text-slate-400">LANDMARKS</div>
                <div className="text-sm sm:text-base font-mono tabular-nums font-bold text-emerald-400">
                  {telemetry.visitedCount}/{PABNA_LANDMARKS.length}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setGameState('playing')}
                className="w-full py-2.5 sm:py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-sm cursor-pointer shadow-lg active:scale-95 transition"
              >
                RESUME VIP DRIVE (Esc / P)
              </button>
              <button
                type="button"
                onClick={() => {
                  actionsRef.current?.resetCar();
                  setGameState('playing');
                }}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-display font-semibold text-xs sm:text-sm cursor-pointer"
              >
                RESET TO START (ABDUL HAMID ROAD)
              </button>
              <button
                type="button"
                onClick={() => setGameState('title')}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-display font-semibold text-xs sm:text-sm cursor-pointer"
              >
                RETURN TO TITLE SCREEN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          STATE 4: SUMMARY MODAL ('gameover')
         ===================================================================== */}
      {gameState === 'gameover' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="summary-modal-title"
          className="fixed inset-0 z-30 flex items-center justify-center p-3 sm:p-6"
          style={{ backgroundColor: 'rgba(9, 13, 22, 0.7)' }}
        >
          <div className="w-full max-w-sm sm:max-w-md rounded-2xl bg-slate-950/90 backdrop-blur-md border border-amber-400/50 p-4 sm:p-6 shadow-2xl">
            <div className="text-xs font-display uppercase tracking-widest text-emerald-400 mb-1">
              PABNA CITY CONVOY LOG · আনলিমিটেড রাইড
            </div>
            <h2 id="summary-modal-title" className="text-xl sm:text-2xl font-bold font-bengali text-white mb-1">
              নেতার গাড়ি, ১০০০ গজ দূরে থাকুন
            </h2>
            <p className="text-xs text-slate-300 mb-3 sm:mb-4">
              Full 3D exploration of Pabna City across Abdul Hamid Road, Zilla School, Shapla Chattar,
              Robiul Market, Ananta Cinema Hall, Edward College, Mental Hospital, and Paksey Bridge.
            </p>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 p-2.5 sm:p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40">
              <div>
                <div className="text-[10px] sm:text-[11px] font-display text-emerald-300">TOTAL BDT · সংগৃহীত টাকা</div>
                <div className="text-lg sm:text-xl font-mono tabular-nums font-bold text-emerald-300">
                  ৳ {telemetry.currency.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] sm:text-[11px] font-display text-emerald-300">ACCIDENTS · মোট দুর্ঘটনা</div>
                <div className="text-lg sm:text-xl font-mono tabular-nums font-bold text-amber-300">
                  {telemetry.accidentCount}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 p-2.5 sm:p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-[10px] font-display text-slate-400">DRIVEN</div>
                <div className="text-sm sm:text-base font-mono tabular-nums font-bold text-white">
                  {telemetry.distanceMeters}m
                </div>
              </div>
              <div>
                <div className="text-[10px] font-display text-slate-400">PUBLIC SALUTES</div>
                <div className="text-sm sm:text-base font-mono tabular-nums font-bold text-amber-400">
                  {telemetry.saluteCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-display text-slate-400">VISITED</div>
                <div className="text-sm sm:text-base font-mono tabular-nums font-bold text-emerald-400">
                  {telemetry.visitedCount}/{PABNA_LANDMARKS.length}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                data-start="true"
                onClick={() => setGameState('playing')}
                className="w-full py-2.5 sm:py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-sm cursor-pointer shadow-lg active:scale-95 transition"
              >
                CONTINUE UNLIMITED RIDE · চালিয়ে যান
              </button>
              <button
                type="button"
                onClick={() => {
                  actionsRef.current?.resetCar();
                  setGameState('playing');
                }}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-display font-semibold text-xs sm:text-sm cursor-pointer"
              >
                NEW TOUR FROM ABDUL HAMID ROAD
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
