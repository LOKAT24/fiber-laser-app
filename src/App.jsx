import React, { useState, useMemo } from 'react';
import { Settings, Info, BookOpen, AlertTriangle } from 'lucide-react';
import ControlInput from './components/ControlInput';
import TooltipCard from './components/TooltipCard';
import CutoffChart from './components/CutoffChart';
import LaserVisualizer from './components/LaserVisualizer';
import { PRESETS } from './data/constants';
import { calculateLaserPhysics } from './utils/calculations';

const App = () => {
  // --- STATE ---
  const [selectedPresetId, setSelectedPresetId] = useState('manual');

  const [powerPercent, setPowerPercent] = useState(100);
  const [frequency, setFrequency] = useState(30);
  const [pulseWidth, setPulseWidth] = useState(200);
  const [speed, setSpeed] = useState(1000);
  const [lineInterval, setLineInterval] = useState(0.05);
  const [spotSize, setSpotSize] = useState(45);
  const [lensFocal, setLensFocal] = useState(160);

  // --- HANDLERS ---
  const handlePresetChange = (e) => {
    const id = e.target.value;
    setSelectedPresetId(id);
    const preset = PRESETS.find(p => p.id === id);
    if (preset && preset.params) {
      setPowerPercent(preset.params.power);
      setPulseWidth(preset.params.pulse);
      setFrequency(preset.params.freq);
      setSpeed(preset.params.speed);
      setLineInterval(preset.params.hatch);
    }
  };

  const handleManualChange = () => {
    if (selectedPresetId !== 'manual') {
      setSelectedPresetId('manual');
    }
  };

  const handleLensChange = (e) => {
    const f = Number(e.target.value);
    setLensFocal(f);
    const estimatedSpot = Math.round(0.29 * f);
    setSpotSize(estimatedSpot);
  };

  // --- CALCULATIONS ---
  const results = useMemo(() => {
    return calculateLaserPhysics({
      powerPercent,
      frequency,
      pulseWidth,
      speed,
      spotSize,
      lineInterval
    });
  }, [powerPercent, frequency, pulseWidth, speed, spotSize, lineInterval]);

  const currentPreset = PRESETS.find(p => p.id === selectedPresetId);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 font-sans selection:bg-red-500 selection:text-white">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <header className="mb-8 flex items-center justify-between border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              JPT MOPA 100W <span className="text-gray-400 font-light">Calculator</span>
            </h1>
            <p className="text-sm text-gray-500">Symulator parametrów procesu laserowego (Seria M7)</p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
            <Info size={14} />
            <span>Model: YDFLP-E-100-M7-M-R</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: CONTROLS */}
          <div className="lg:col-span-4 space-y-6">

            {/* PRESETS SECTION */}
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full pointer-events-none" />
              <div className="flex items-center space-x-2 mb-4 text-blue-400">
                <BookOpen size={20} />
                <h2 className="font-semibold uppercase tracking-wider text-sm">Baza Wiedzy / Presety</h2>
              </div>

              <select
                value={selectedPresetId}
                onChange={handlePresetChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-sm focus:border-blue-500 outline-none mb-3"
              >
                {PRESETS.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>

              {currentPreset && currentPreset.id !== 'manual' && (
                <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-3 text-xs text-blue-200 leading-relaxed">
                  <p>{currentPreset.desc}</p>
                </div>
              )}
            </div>

            {/* MANUAL CONTROLS */}
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg">
              <div className="flex items-center space-x-2 mb-4 text-red-400">
                <Settings size={20} />
                <h2 className="font-semibold uppercase tracking-wider text-sm">Parametry (Edytowalne)</h2>
              </div>

              {/* SLIDERS WITH INPUTS */}
              <div className="space-y-6">

                <ControlInput
                  label="Moc (% w programie)"
                  value={powerPercent}
                  setValue={setPowerPercent}
                  min={0} max={100} step={1} unit="%"
                  colorClass="accent-red-500"
                  onUserChange={handleManualChange}
                />

                <ControlInput
                  label="Szerokość Impulsu (ns)"
                  value={pulseWidth}
                  setValue={setPulseWidth}
                  min={2} max={500} step={1} unit="ns"
                  colorClass="accent-blue-500"
                  onUserChange={handleManualChange}
                />

                <ControlInput
                  label="Częstotliwość (kHz)"
                  value={frequency}
                  setValue={setFrequency}
                  min={1} max={4000} step={1} unit="kHz"
                  colorClass="accent-green-500"
                  onUserChange={handleManualChange}
                  warning={frequency < results.cutoff && (
                    <div className="mt-1 flex items-center space-x-1 text-amber-500 text-xs">
                      <AlertTriangle size={12} />
                      <span>Poniżej f_cutoff ({Math.round(results.cutoff)}kHz). Spadek mocy!</span>
                    </div>
                  )}
                />

                <ControlInput
                  label="Prędkość (mm/s)"
                  value={speed}
                  setValue={setSpeed}
                  min={10} max={15000} step={10} unit="mm/s"
                  colorClass="accent-purple-500"
                  onUserChange={handleManualChange}
                />

                {/* Hatch / Interval Control */}
                <ControlInput
                  label="Hatch / Interwał (mm)"
                  value={lineInterval}
                  setValue={setLineInterval}
                  min={0.001} max={1.0} step={0.001} unit="mm"
                  colorClass="accent-yellow-500"
                  onUserChange={handleManualChange}
                />

                {/* Spot Size & Lens */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Plamka (µm)</label>
                    <input
                      type="number"
                      value={spotSize} onChange={(e) => setSpotSize(Number(e.target.value))}
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-center focus:border-red-500 outline-none text-red-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Soczewka (mm)</label>
                    <select
                      value={lensFocal} onChange={handleLensChange}
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-center focus:border-red-500 outline-none"
                    >
                      <option value="100">F100 (100x100)</option>
                      <option value="110">F110 (70x70)</option>
                      <option value="160">F160 (110x110)</option>
                      <option value="200">F200 (140x140)</option>
                      <option value="254">F254 (175x175)</option>
                      <option value="330">F330 (220x220)</option>
                      <option value="420">F420 (300x300)</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* CUTOFF CHART */}
            <CutoffChart results={results} frequency={frequency} pulseWidth={pulseWidth} />

          </div>

          {/* RIGHT COLUMN: RESULTS & VIZ */}
          <div className="lg:col-span-8 space-y-6">

            {/* KEY METRICS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <TooltipCard
                title="Moc Rzeczywista"
                value={results.actualAvgPower.toFixed(1)}
                unit="W"
                warning={frequency < results.cutoff}
                subtext={frequency < results.cutoff ? "Ograniczona przez f_cutoff" : "Nominalna dla ustawień"}
                formula={
                  frequency < results.cutoff
                    ? `P = 100W × ${powerPercent}% × (${frequency}kHz / ${Math.round(results.cutoff)}kHz)`
                    : `P = 100W × ${powerPercent}%`
                }
              />

              <TooltipCard
                title="Energia Impulsu"
                value={results.pulseEnergy.toFixed(3)}
                unit="mJ"
                subtext="Kluczowe dla ablacji"
                formula={`E = ${results.actualAvgPower.toFixed(2)}W / ${frequency}kHz`}
              />

              <TooltipCard
                title="Moc Szczytowa"
                value={results.peakPower.toFixed(1)}
                unit="kW"
                subtext="Zdolność kruszenia"
                formula={`P_peak = ${results.pulseEnergy.toFixed(3)}mJ / ${pulseWidth}ns × 1000`}
              />

              <TooltipCard
                title="Fluencja"
                value={results.fluence.toFixed(2)}
                unit="J/cm²"
                subtext="Gęstość energii"
                formula={`F = ${results.pulseEnergy.toFixed(3)}mJ / ${results.spotArea.toFixed(6)}cm²`}
              />

            </div>

            {/* VISUALIZER */}
            <LaserVisualizer results={results} spotSize={spotSize} />

            {/* DETAILED STATS ROW */}
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Zaawansowane parametry</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
                <div>
                  <span className="text-gray-500 block">Irradiancja (Gęstość mocy)</span>
                  <span className="text-gray-200 font-mono">{results.irradiance.toFixed(2)} MW/cm²</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Odległość między liniami</span>
                  <span className="text-gray-200 font-mono">{results.lineIntervalMicrons.toFixed(1)} µm</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Rozstaw impulsów (Pitch)</span>
                  <span className="text-gray-200 font-mono">{results.pulseDistanceMicrons.toFixed(1)} µm</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
