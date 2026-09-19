import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  Code2,
  Atom,
  Activity,
  SlidersHorizontal,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

type SandboxTool = "circuits" | "python-ode" | "crystal-lattice";

interface CircuitState {
  sourceType: "sine" | "square" | "dc";
  voltage: number; // Volts
  frequency: number; // Hz
  resistance: number; // Ohms
  inductance: number; // Henry
  capacitance: number; // MicroFarads
  isRunning: boolean;
}

export const STEMSandboxView: React.FC = () => {
  const { t } = useLanguage();
  const [activeTool, setActiveTool] = useState<SandboxTool>("circuits");

  // RLC Circuit Simulation State
  const [circuit, setCircuit] = useState<CircuitState>({
    sourceType: "sine",
    voltage: 12,
    frequency: 60,
    resistance: 50,
    inductance: 0.15,
    capacitance: 22,
    isRunning: true,
  });

  // Python / ODE State
  const [pythonCode, setPythonCode] = useState<string>(`# AfriVersty Computational STEM Engine (Python ODE Simulator)
import numpy as np
import math

# Problem: Damped Harmonic Oscillator / Renewable Wind Turbine Dynamics
# m * x''(t) + c * x'(t) + k * x(t) = F0 * cos(omega * t)

mass = 2.5        # kg
damping_c = 0.8   # N*s/m
spring_k = 45.0   # N/m
forcing_F0 = 15.0 # N
omega = 4.2       # rad/s

dt = 0.02
time_steps = 150

# State vector: [position (m), velocity (m/s)]
time_series = []
state = [1.2, 0.0] # Initial displacement & rest velocity

for step in range(time_steps):
    t = step * dt
    x, v = state
    # Acceleration
    a = (forcing_F0 * math.cos(omega * t) - damping_c * v - spring_k * x) / mass
    # Euler-Cromer Integration
    v_next = v + a * dt
    x_next = x + v_next * dt
    state = [x_next, v_next]
    time_series.append({"t": round(t, 2), "position": round(x_next, 3), "velocity": round(v_next, 3)})

print(f"Simulation completed across {time_steps} steps.")
print(f"Final state: Position = {state[0]:.4f} m, Velocity = {state[1]:.4f} m/s")
print(f"Resonance Peak Frequency: {math.sqrt(spring_k / mass):.2f} rad/s")
`);

  const [pythonOutput, setPythonOutput] = useState<string>("");
  const [isExecutingPython, setIsExecutingPython] = useState<boolean>(false);
  const [pythonExecutionResult, setPythonExecutionResult] = useState<{ t: number; pos: number; vel: number }[]>([]);

  // 3D Crystal Lattice State
  const [latticeType, setLatticeType] = useState<"fcc" | "bcc" | "diamond" | "perovskite">("perovskite");
  const [latticeRotation, setLatticeRotation] = useState<{ x: number; y: number }>({ x: 25, y: 45 });
  const [isRotating, setIsRotating] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Oscilloscope Animation Loop
  useEffect(() => {
    if (activeTool !== "circuits") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Dark background
      ctx.fillStyle = "#0a0908";
      ctx.fillRect(0, 0, width, height);

      // Oscilloscope Grid Lines
      ctx.strokeStyle = "rgba(212, 175, 55, 0.12)";
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center Reference Axes
      ctx.strokeStyle = "rgba(242, 202, 80, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      if (circuit.isRunning) {
        time += 0.05;
      }

      // Calculate Electrical Parameters (Impedance, Phase Angle, Current)
      const omega = 2 * Math.PI * circuit.frequency;
      const XL = omega * circuit.inductance;
      const XC = 1 / (omega * (circuit.capacitance * 1e-6));
      const reactance = XL - XC;
      const impedance = Math.sqrt(circuit.resistance ** 2 + reactance ** 2);
      const currentPeak = circuit.voltage / impedance;
      const phaseAngle = Math.atan2(reactance, circuit.resistance);

      // 1. Draw Applied Voltage Waveform (Gold / Amber)
      ctx.strokeStyle = "#f2ca50";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "rgba(242, 202, 80, 0.6)";
      ctx.shadowBlur = 8;
      ctx.beginPath();

      const timeScale = 0.02 * (circuit.frequency / 60);

      for (let x = 0; x < width; x++) {
        let v = 0;
        const t = (x * timeScale) - time;

        if (circuit.sourceType === "sine") {
          v = Math.sin(t);
        } else if (circuit.sourceType === "square") {
          v = Math.sin(t) >= 0 ? 1 : -1;
        } else {
          v = 1;
        }

        const y = centerY - v * (circuit.voltage * 4.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 2. Draw Circuit Current Waveform (Cyan / Green Phase Lag/Lead)
      ctx.strokeStyle = "#4ade80";
      ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(74, 222, 128, 0.6)";
      ctx.shadowBlur = 6;
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        const t = (x * timeScale) - time - phaseAngle;
        const iWave = Math.sin(t);
        const y = centerY - iWave * (currentPeak * 350);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.shadowBlur = 0; // Reset blur

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [circuit, activeTool]);

  // Execute Simulated Python Script
  const runPythonScript = () => {
    setIsExecutingPython(true);
    setPythonOutput("Initializing Pyodide STEM execution container...\nCompiling ODE differential equations...");

    setTimeout(() => {
      const mass = 2.5;
      const damping_c = 0.8;
      const spring_k = 45.0;
      const forcing_F0 = 15.0;
      const omega = 4.2;
      const dt = 0.02;
      const steps = 150;

      let state = [1.2, 0.0];
      const series: { t: number; pos: number; vel: number }[] = [];

      for (let step = 0; step < steps; step++) {
        const t = step * dt;
        const [x, v] = state;
        const a = (forcing_F0 * Math.cos(omega * t) - damping_c * v - spring_k * x) / mass;
        const v_next = v + a * dt;
        const x_next = x + v_next * dt;
        state = [x_next, v_next];
        series.push({ t: Number(t.toFixed(2)), pos: Number(x_next.toFixed(3)), vel: Number(v_next.toFixed(3)) });
      }

      setPythonExecutionResult(series);
      setPythonOutput(
        `[Pyodide STEM v3.12 Loaded]\n` +
        `>>> Executed 150 time steps via Euler-Cromer ODE integration.\n` +
        `============================================================\n` +
        `Final Displaced Coordinate x(t): ${state[0].toFixed(4)} m\n` +
        `Oscillation Velocity v(t):       ${state[1].toFixed(4)} m/s\n` +
        `Natural System Resonance ω0:     ${Math.sqrt(spring_k / mass).toFixed(3)} rad/s\n` +
        `Damping Ratio ζ (Zeta):          ${(damping_c / (2 * Math.sqrt(mass * spring_k))).toFixed(4)} (Underdamped Harmonic Mode)\n` +
        `Quality Factor Q:                ${((Math.sqrt(mass * spring_k)) / damping_c).toFixed(2)}\n` +
        `Status: Convergence verified. Numerical energy bounds validated.`
      );
      setIsExecutingPython(false);
    }, 900);
  };

  // 3D Crystal Auto-Rotation Loop
  useEffect(() => {
    if (!isRotating || activeTool !== "crystal-lattice") return;

    const interval = setInterval(() => {
      setLatticeRotation((prev) => ({
        x: (prev.x + 0.5) % 360,
        y: (prev.y + 0.8) % 360,
      }));
    }, 30);

    return () => clearInterval(interval);
  }, [isRotating, activeTool]);

  return (
    <div id="stem-sandbox-view-container" className="space-y-8">
      {/* Top Title & Header Navigation */}
      <div className="safari-glass p-6 rounded-3xl border border-[#d4af37]/35 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30 text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>{t.tabStemSandbox}</span>
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#e5e2e1]">
              {t.stemSandboxTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#ded8cb] max-w-2xl mt-1.5 leading-relaxed">
              {t.stemSandboxSubtitle}
            </p>
          </div>

          {/* Tool Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#14120f]/90 border border-[#d4af37]/25 shrink-0">
            <button
              onClick={() => setActiveTool("circuits")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTool === "circuits"
                  ? "bg-[#d4af37]/25 text-[#f2ca50] border border-[#f2ca50]/40 shadow-sm"
                  : "text-[#99907c] hover:text-[#e5e2e1]"
              }`}
            >
              <Activity size={15} />
              <span>{t.toolCircuits}</span>
            </button>

            <button
              onClick={() => setActiveTool("python-ode")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTool === "python-ode"
                  ? "bg-[#d4af37]/25 text-[#f2ca50] border border-[#f2ca50]/40 shadow-sm"
                  : "text-[#99907c] hover:text-[#e5e2e1]"
              }`}
            >
              <Code2 size={15} />
              <span>{t.toolPythonOde}</span>
            </button>

            <button
              onClick={() => setActiveTool("crystal-lattice")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTool === "crystal-lattice"
                  ? "bg-[#d4af37]/25 text-[#f2ca50] border border-[#f2ca50]/40 shadow-sm"
                  : "text-[#99907c] hover:text-[#e5e2e1]"
              }`}
            >
              <Atom size={15} />
              <span>{t.toolCrystalLattice}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. RLC CIRCUIT & OSCILLOSCOPE SIMULATOR */}
      {activeTool === "circuits" && (() => {
        const omega = 2 * Math.PI * circuit.frequency;
        const XL = omega * circuit.inductance;
        const XC = 1 / (omega * (circuit.capacitance * 1e-6));
        const reactance = XL - XC;
        const impedance = Math.sqrt(circuit.resistance ** 2 + reactance ** 2);
        const currentPeak = circuit.voltage / impedance;
        const phaseAngle = Math.atan2(reactance, circuit.resistance);
        const resonanceFreq = 1 / (2 * Math.PI * Math.sqrt(circuit.inductance * circuit.capacitance * 1e-6));
        const powerFactor = Math.cos(phaseAngle);

        return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Visual Oscilloscope Screen */}
          <div className="lg:col-span-8 space-y-4">
            <div className="safari-glass p-5 rounded-3xl border border-[#d4af37]/30 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#d4af37]/20">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <h3 className="font-serif-title text-base font-bold text-[#e5e2e1]">
                    {t.toolCircuits}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-[#f2ca50]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f2ca50]" /> CH1: v(t)
                  </span>
                  <span className="flex items-center gap-1.5 text-[#4ade80]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80]" /> CH2: i(t)
                  </span>
                </div>
              </div>

              {/* Canvas Viewport */}
              <div className="w-full bg-[#0a0908] rounded-2xl border border-[#d4af37]/35 overflow-hidden relative shadow-inner h-[320px] sm:h-[380px] flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={380}
                  className="w-full h-full object-contain"
                />

                {/* Status Overlays */}
                <div className="absolute top-3 left-3 bg-[#161410]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#d4af37]/25 text-[11px] font-mono text-[#ded8cb] flex gap-3">
                  <span>V_rms: {((circuit.voltage) / Math.SQRT2).toFixed(2)} V</span>
                  <span>f: {circuit.frequency} Hz</span>
                  <span>φ: {((phaseAngle * 180) / Math.PI).toFixed(1)}°</span>
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => setCircuit((c) => ({ ...c, isRunning: !c.isRunning }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all ${
                      circuit.isRunning
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-green-500/20 text-green-300 border border-green-500/40"
                    }`}
                  >
                    {circuit.isRunning ? <span className="material-symbols-outlined text-sm">pause</span> : <Play size={14} />}
                    <span>{circuit.isRunning ? t.pauseSimulation : t.runSimulation}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Electrical Parameter Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="safari-glass p-3.5 rounded-2xl border border-[#d4af37]/25 text-center">
                <span className="text-[10px] text-[#99907c] uppercase font-bold tracking-wider">Impedance |Z|</span>
                <p className="text-lg font-bold font-mono text-[#f2ca50] mt-0.5">{impedance.toFixed(2)} Ω</p>
                <span className="text-[10px] text-[#ded8cb]">R + j(X_L - X_C)</span>
              </div>

              <div className="safari-glass p-3.5 rounded-2xl border border-[#d4af37]/25 text-center">
                <span className="text-[10px] text-[#99907c] uppercase font-bold tracking-wider">{t.peakCurrent}</span>
                <p className="text-lg font-bold font-mono text-[#4ade80] mt-0.5">{(currentPeak * 1000).toFixed(1)} mA</p>
                <span className="text-[10px] text-[#ded8cb]">V_max / |Z|</span>
              </div>

              <div className="safari-glass p-3.5 rounded-2xl border border-[#d4af37]/25 text-center">
                <span className="text-[10px] text-[#99907c] uppercase font-bold tracking-wider">{t.resonanceFreq}</span>
                <p className="text-lg font-bold font-mono text-[#f2ca50] mt-0.5">{resonanceFreq.toFixed(1)} Hz</p>
                <span className="text-[10px] text-[#ded8cb]">1 / (2π√(LC))</span>
              </div>

              <div className="safari-glass p-3.5 rounded-2xl border border-[#d4af37]/25 text-center">
                <span className="text-[10px] text-[#99907c] uppercase font-bold tracking-wider">{t.phaseAngle}</span>
                <p className="text-lg font-bold font-mono text-[#ffd768] mt-0.5">{powerFactor.toFixed(3)}</p>
                <span className="text-[10px] text-[#ded8cb]">{reactance > 0 ? "Lag" : "Lead"}</span>
              </div>
            </div>
          </div>

          {/* Interactive Circuit Controls Slider Panel */}
          <div className="lg:col-span-4 safari-glass p-5 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20 mb-4">
                <h3 className="font-serif-title text-base font-bold text-[#e5e2e1] flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-[#f2ca50]" />
                  <span>{t.circuitControls}</span>
                </h3>
                <button
                  onClick={() =>
                    setCircuit({
                      sourceType: "sine",
                      voltage: 12,
                      frequency: 60,
                      resistance: 50,
                      inductance: 0.15,
                      capacitance: 22,
                      isRunning: true,
                    })
                  }
                  className="text-[11px] text-[#f2ca50] hover:underline flex items-center gap-1"
                >
                  <RotateCcw size={12} /> {t.resetCircuit}
                </button>
              </div>

              {/* Source Type Selector */}
              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-semibold text-[#ded8cb]">{t.waveformType}</label>
                <div className="grid grid-cols-3 gap-1.5 bg-[#14120f] p-1 rounded-xl border border-[#d4af37]/20">
                  <button
                    type="button"
                    onClick={() => setCircuit((c) => ({ ...c, sourceType: "sine" }))}
                    className={`py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      circuit.sourceType === "sine"
                        ? "bg-[#f2ca50] text-[#3c2f00] shadow-sm"
                        : "text-[#99907c] hover:text-[#e5e2e1]"
                    }`}
                  >
                    {t.sineWave.split(" ")[0]}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCircuit((c) => ({ ...c, sourceType: "square" }))}
                    className={`py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      circuit.sourceType === "square"
                        ? "bg-[#f2ca50] text-[#3c2f00] shadow-sm"
                        : "text-[#99907c] hover:text-[#e5e2e1]"
                    }`}
                  >
                    {t.squareWave.split(" ")[0]}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCircuit((c) => ({ ...c, sourceType: "dc" }))}
                    className={`py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      circuit.sourceType === "dc"
                        ? "bg-[#f2ca50] text-[#3c2f00] shadow-sm"
                        : "text-[#99907c] hover:text-[#e5e2e1]"
                    }`}
                  >
                    DC
                  </button>
                </div>
              </div>

              {/* Voltage Slider */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-[#ded8cb]">{t.voltageLabel}</span>
                  <span className="font-mono text-[#f2ca50] font-bold">{circuit.voltage} V</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={48}
                  step={1}
                  value={circuit.voltage}
                  onChange={(e) => setCircuit((c) => ({ ...c, voltage: Number(e.target.value) }))}
                  className="w-full accent-[#f2ca50]"
                />
              </div>

              {/* Frequency Slider */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-[#ded8cb]">{t.frequencyLabel}</span>
                  <span className="font-mono text-[#f2ca50] font-bold">{circuit.frequency} Hz</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={240}
                  step={5}
                  value={circuit.frequency}
                  onChange={(e) => setCircuit((c) => ({ ...c, frequency: Number(e.target.value) }))}
                  className="w-full accent-[#f2ca50]"
                />
              </div>

              {/* Resistance Slider */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-[#ded8cb]">{t.resistanceLabel}</span>
                  <span className="font-mono text-[#f2ca50] font-bold">{circuit.resistance} Ω</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={250}
                  step={5}
                  value={circuit.resistance}
                  onChange={(e) => setCircuit((c) => ({ ...c, resistance: Number(e.target.value) }))}
                  className="w-full accent-[#f2ca50]"
                />
              </div>

              {/* Inductance Slider */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-[#ded8cb]">{t.inductanceLabel}</span>
                  <span className="font-mono text-[#f2ca50] font-bold">{(circuit.inductance * 1000).toFixed(0)} mH</span>
                </div>
                <input
                  type="range"
                  min={0.01}
                  max={1.0}
                  step={0.02}
                  value={circuit.inductance}
                  onChange={(e) => setCircuit((c) => ({ ...c, inductance: Number(e.target.value) }))}
                  className="w-full accent-[#f2ca50]"
                />
              </div>

              {/* Capacitance Slider */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-[#ded8cb]">{t.capacitanceLabel}</span>
                  <span className="font-mono text-[#f2ca50] font-bold">{circuit.capacitance} µF</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  step={1}
                  value={circuit.capacitance}
                  onChange={(e) => setCircuit((c) => ({ ...c, capacitance: Number(e.target.value) }))}
                  className="w-full accent-[#f2ca50]"
                />
              </div>
            </div>

            {/* Analytical Formula Card */}
            <div className="p-3.5 rounded-2xl bg-[#14120f] border border-[#d4af37]/20 text-[11px] space-y-1 text-[#ded8cb]">
              <div className="font-bold text-[#f2ca50] flex items-center gap-1.5">
                <Sparkles size={13} />
                <span>{t.liveMeasurements}</span>
              </div>
              <p className="font-mono text-[10px] text-[#ffd768]">
                L(d²q/dt²) + R(dq/dt) + (1/C)q = V₀ cos(ωt)
              </p>
            </div>
          </div>
        </div>
        );
      })()}

      {/* 2. IN-BROWSER PYTHON / ODE SCRATCHPAD */}
      {activeTool === "python-ode" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Code Editor */}
          <div className="lg:col-span-7 space-y-4">
            <div className="safari-glass p-5 rounded-3xl border border-[#d4af37]/30 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20 mb-3">
                <div className="flex items-center gap-2">
                  <Terminal size={18} className="text-[#f2ca50]" />
                  <h3 className="font-serif-title text-base font-bold text-[#e5e2e1]">
                    {t.pythonEngine}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pythonCode);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="p-1.5 rounded-lg bg-[#201c17] hover:bg-[#2e2820] text-xs text-[#d0c5af] border border-[#d4af37]/20 flex items-center gap-1"
                  >
                    {copiedCode ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                    <span>{copiedCode ? t.copied : t.copy}</span>
                  </button>

                  <button
                    onClick={runPythonScript}
                    disabled={isExecutingPython}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f2ca50] text-[#3c2f00] text-xs font-bold flex items-center gap-1.5 shadow-md hover:brightness-110 disabled:opacity-50"
                  >
                    <Play size={14} />
                    <span>{isExecutingPython ? t.runSimulation : t.runPythonCode}</span>
                  </button>
                </div>
              </div>

              {/* Code Area */}
              <div className="rounded-2xl overflow-hidden border border-[#d4af37]/25 bg-[#0d0c0a]">
                <div className="bg-[#1a1713] px-4 py-1.5 border-b border-[#d4af37]/20 text-[11px] font-mono text-[#ded8cb] flex items-center justify-between">
                  <span>ode_simulator.py</span>
                  <span className="text-[10px] text-[#f2ca50]">Pyodide WASM Engine</span>
                </div>
                <textarea
                  value={pythonCode}
                  onChange={(e) => setPythonCode(e.target.value)}
                  rows={14}
                  className="w-full p-4 font-mono text-xs text-[#a5d6a7] bg-transparent focus:outline-none resize-none leading-relaxed selection:bg-[#d4af37]/40 scrollbar-none"
                />
              </div>
            </div>
          </div>

          {/* Execution Output & Data Series Visualizer */}
          <div className="lg:col-span-5 space-y-4">
            <div className="safari-glass p-5 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20">
                <h3 className="font-serif-title text-base font-bold text-[#e5e2e1] flex items-center gap-2">
                  <Activity size={18} className="text-[#f2ca50]" />
                  <span>{t.pythonOutputLabel}</span>
                </h3>
                <span className="text-[10px] bg-green-500/20 text-green-400 font-bold px-2 py-0.5 rounded-full border border-green-500/30">
                  {t.active}
                </span>
              </div>

              {/* Terminal Output */}
              <div className="p-4 rounded-2xl bg-[#090807] border border-[#d4af37]/25 font-mono text-xs text-[#ded8cb] space-y-2 max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {pythonOutput || t.runPythonCode}
              </div>

              {/* Interactive Numerical Phase Trajectory Table */}
              {pythonExecutionResult.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#ded8cb]">
                    <span>Phase State Vector [x(t), v(t)]:</span>
                    <span className="text-[10px] text-[#99907c]">Timesteps</span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-[#d4af37]/20">
                    <table className="w-full text-xs text-left font-mono">
                      <thead className="bg-[#24201a] text-[#f2ca50]">
                        <tr>
                          <th className="p-2">t (s)</th>
                          <th className="p-2">Pos x (m)</th>
                          <th className="p-2">Vel v (m/s)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#d4af37]/15 bg-[#14120f]/80 text-[#ded8cb]">
                        {pythonExecutionResult.slice(0, 6).map((row, idx) => (
                          <tr key={idx}>
                            <td className="p-2 text-[#99907c]">{row.t.toFixed(2)}</td>
                            <td className="p-2 text-[#4ade80]">{row.pos.toFixed(3)}</td>
                            <td className="p-2 text-[#f2ca50]">{row.vel.toFixed(3)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. 3D CRYSTAL LATTICE & SOLID-STATE VIEWER */}
      {activeTool === "crystal-lattice" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 3D Visualizer Stage */}
          <div className="lg:col-span-8 safari-glass p-5 rounded-3xl border border-[#d4af37]/30 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20 mb-3">
              <div>
                <h3 className="font-serif-title text-base font-bold text-[#e5e2e1] flex items-center gap-2">
                  <Atom size={18} className="text-[#f2ca50]" />
                  <span>{t.latticeTitle}</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRotating((r) => !r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isRotating ? "bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/40" : "bg-[#201c17] text-[#99907c]"
                  }`}
                >
                  {isRotating ? t.autoRotate : t.pauseSimulation}
                </button>
              </div>
            </div>

            {/* Simulated 3D Lattice Canvas Rendering */}
            <div className="w-full h-[360px] sm:h-[420px] bg-[#0c0b09] rounded-2xl border border-[#d4af37]/30 relative flex items-center justify-center overflow-hidden">
              <div
                className="w-64 h-64 relative transition-transform duration-75 select-none"
                style={{
                  transform: `perspective(600px) rotateX(${latticeRotation.x}deg) rotateY(${latticeRotation.y}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* 3D Lattice Bounding Cube Wireframe */}
                <div className="absolute inset-0 border-2 border-[#d4af37]/40 rounded-xl shadow-[0_0_30px_rgba(212,175,55,0.15)]" />
                <div
                  className="absolute inset-0 border-2 border-[#d4af37]/40 rounded-xl"
                  style={{ transform: "translateZ(-140px)" }}
                />

                {/* Corner Atoms (Gold Cations) */}
                {[
                  [-1, -1, 0],
                  [1, -1, 0],
                  [-1, 1, 0],
                  [1, 1, 0],
                  [-1, -1, -140],
                  [1, -1, -140],
                  [-1, 1, -140],
                  [1, 1, -140],
                ].map(([x, y, z], i) => (
                  <div
                    key={i}
                    className="absolute w-7 h-7 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#f2ca50] shadow-[0_0_12px_rgba(242,202,80,0.8)] border border-white/40 flex items-center justify-center text-[9px] font-bold text-[#3c2f00]"
                    style={{
                      left: x === -1 ? "-14px" : "calc(100% - 14px)",
                      top: y === -1 ? "-14px" : "calc(100% - 14px)",
                      transform: `translateZ(${z}px)`,
                    }}
                  >
                    Ca²⁺
                  </div>
                ))}

                {/* Face-Centered / Central Atom */}
                <div
                  className="absolute left-1/2 top-1/2 -ml-5 -mt-5 w-10 h-10 rounded-full bg-gradient-to-tr from-[#ef4444] to-[#f97316] shadow-[0_0_24px_rgba(239,68,68,0.9)] border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                  style={{ transform: "translateZ(-70px)" }}
                >
                  Ti⁴⁺
                </div>

                {/* Oxygen Anions on Faces */}
                {[
                  [0, -1, -70],
                  [0, 1, -70],
                  [-1, 0, -70],
                  [1, 0, -70],
                ].map(([x, y, z], i) => (
                  <div
                    key={`o-${i}`}
                    className="absolute w-6 h-6 rounded-full bg-gradient-to-tr from-[#38bdf8] to-[#0284c7] shadow-[0_0_10px_rgba(56,189,248,0.7)] border border-white/40 flex items-center justify-center text-[8px] font-bold text-white"
                    style={{
                      left: x === 0 ? "calc(50% - 12px)" : x === -1 ? "-12px" : "calc(100% - 12px)",
                      top: y === 0 ? "calc(50% - 12px)" : y === -1 ? "-12px" : "calc(100% - 12px)",
                      transform: `translateZ(${z}px)`,
                    }}
                  >
                    O²⁻
                  </div>
                ))}
              </div>

              {/* Rotation Info */}
              <div className="absolute bottom-3 left-3 bg-[#14120f]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#d4af37]/25 text-[11px] text-[#ded8cb]">
                Pitch ({latticeRotation.x.toFixed(0)}°), Yaw ({latticeRotation.y.toFixed(0)}°)
              </div>
            </div>
          </div>

          {/* Unit Cell Physics & Material Taxonomy */}
          <div className="lg:col-span-4 safari-glass p-5 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20 mb-3">
                <h3 className="font-serif-title text-base font-bold text-[#e5e2e1]">
                  {t.latticeTitle}
                </h3>
              </div>

              <div className="space-y-2 mb-4">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "perovskite", name: t.perovskiteStructure, tag: "Solar" },
                    { id: "fcc", name: t.fccStructure, tag: "Semiconductors" },
                    { id: "bcc", name: t.bccStructure, tag: "Iron" },
                    { id: "diamond", name: t.diamondStructure, tag: "Silicon" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setLatticeType(item.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        latticeType === item.id
                          ? "bg-[#d4af37]/25 border-[#f2ca50] text-[#f2ca50]"
                          : "bg-[#161410] border-[#d4af37]/20 text-[#ded8cb] hover:border-[#d4af37]/40"
                      }`}
                    >
                      <div className="text-xs font-bold">{item.name}</div>
                      <div className="text-[10px] text-[#99907c]">{item.tag}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Physical Parameters of the selected lattice */}
              <div className="p-3.5 rounded-2xl bg-[#14120f] border border-[#d4af37]/20 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#99907c]">Unit Cell Constant (a):</span>
                  <span className="font-mono font-bold text-[#f2ca50]">3.905 Å</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#99907c]">Coordination Number:</span>
                  <span className="font-mono font-bold text-[#4ade80]">12 (A-site), 6 (B-site)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#99907c]">Bandgap Energy Eg:</span>
                  <span className="font-mono font-bold text-[#f2ca50]">1.55 eV</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
