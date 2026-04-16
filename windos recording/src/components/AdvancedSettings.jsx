import React from 'react';
import { Camera, Mic, Monitor, Gauge, ChevronDown, ScanFace, Sun, Contrast, UserRound, EyeOff } from 'lucide-react';

const RESOLUTIONS = [
  { label: '720p',  width: 1280,  height: 720 },
  { label: '1080p', width: 1920,  height: 1080 },
  { label: '1440p', width: 2560,  height: 1440 },
];

const FPS_OPTIONS = [24, 30, 60];

function Select({ label, icon: Icon, value, onChange, options, placeholder = 'None detected' }) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
        <Icon size={10} />
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 pr-8 cursor-pointer focus:outline-none focus:border-brand-primary/50 transition-colors"
        >
          {options.length === 0 && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}

function SegmentedControl({ label, icon: Icon, options, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
        <Icon size={10} />
        {label}
      </label>
      <div className="flex gap-1 bg-black/30 rounded-lg p-1 border border-white/5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
              value === opt.value
                ? 'bg-brand-primary text-white shadow'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AdvancedSettings({
  cameras, microphones,
  selectedCamera, setSelectedCamera,
  selectedMic,    setSelectedMic,
  fps,            setFps,
  resolution,     setResolution,
  isWebcamOn,     onToggleWebcam,
  isVirtualBgEnabled, setIsVirtualBgEnabled,
  bgMode,             setBgMode,
  cameraBrightness,   setCameraBrightness,
  cameraContrast,     setCameraContrast,
  floatingCameraWidth, setFloatingCameraWidth,
  showFloatingCamera, setShowFloatingCamera,
}) {
  const cameraOptions     = cameras.map((d)     => ({ value: d.deviceId, label: d.label || `Camera ${d.deviceId.slice(0, 8)}` }));
  const micOptions        = microphones.map((d) => ({ value: d.deviceId, label: d.label || `Mic ${d.deviceId.slice(0, 8)}`    }));
  const resolutionOptions = RESOLUTIONS.map((r)  => ({ value: r.label,  label: r.label }));
  const fpsOptions        = FPS_OPTIONS.map((f)  => ({ value: f,        label: `${f} fps` }));

  return (
    <div className="px-4 pb-4 space-y-4 border-t border-obs-border pt-4">
      <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Capture Settings</p>

      {/* Camera device + toggle */}
      <div className="space-y-2">
        <Select
          label="Camera"
          icon={Camera}
          value={selectedCamera}
          onChange={setSelectedCamera}
          options={cameraOptions}
          placeholder="No cameras"
        />
        <button
          onClick={onToggleWebcam}
          className={`w-full py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isWebcamOn
              ? 'border-brand-primary/40 bg-brand-primary/10 text-brand-primary'
              : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          {isWebcamOn ? '🎥 Camera ON — Click to disable' : '📷 Enable Camera'}
        </button>

        {isWebcamOn && (
          <div className="space-y-1.5 pt-2 border-t border-white/5 mt-1">
            <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              <ScanFace size={10} />
              AI Background
            </label>
            <div className="flex gap-1 bg-black/30 rounded-lg p-1 border border-white/5">
              {[
                { id: 'off',    label: 'Off',    icon: EyeOff },
                { id: 'blur',   label: 'Blur',   icon: ScanFace },
                { id: 'remove', label: 'No BG',  icon: UserRound },
              ].map((opt) => {
                const isActive = opt.id === 'off' ? !isVirtualBgEnabled : (isVirtualBgEnabled && bgMode === opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (opt.id === 'off') {
                        setIsVirtualBgEnabled(false);
                      } else {
                        setIsVirtualBgEnabled(true);
                        setBgMode(opt.id);
                      }
                    }}
                    className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-md text-[9px] font-bold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <opt.icon size={12} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isWebcamOn && (
          <div className="space-y-3 pt-1 border-t border-white/5 mt-2">
            {/* Floating live camera on all app tabs/pages */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-gray-500">
                <span>Live Camera On All Tabs</span>
                <button
                  onClick={() => setShowFloatingCamera((v) => !v)}
                  className={`px-2 py-1 rounded text-[10px] border ${showFloatingCamera
                    ? 'border-brand-primary/40 text-brand-primary bg-brand-primary/10'
                    : 'border-white/10 text-gray-400 bg-white/5'
                    }`}
                >
                  {showFloatingCamera ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Floating camera size */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-gray-500">
                <span>Live Camera Size</span>
                <span>{floatingCameraWidth}px</span>
              </div>
              <input
                type="range"
                min="180"
                max="520"
                step="10"
                value={floatingCameraWidth}
                onChange={(e) => setFloatingCameraWidth(Number(e.target.value))}
                className="w-full h-1 bg-black/30 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>

            {/* Brightness */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-gray-500">
                <span className="flex items-center gap-1"><Sun size={10} /> Brightness</span>
                <span>{cameraBrightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                value={cameraBrightness}
                onChange={(e) => setCameraBrightness(Number(e.target.value))}
                className="w-full h-1 bg-black/30 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-gray-500">
                <span className="flex items-center gap-1"><Contrast size={10} /> Contrast</span>
                <span>{cameraContrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                value={cameraContrast}
                onChange={(e) => setCameraContrast(Number(e.target.value))}
                className="w-full h-1 bg-black/30 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* Microphone device */}
      <Select
        label="Microphone"
        icon={Mic}
        value={selectedMic}
        onChange={setSelectedMic}
        options={micOptions}
        placeholder="No microphones"
      />

      {/* Resolution */}
      <SegmentedControl
        label="Resolution"
        icon={Monitor}
        options={resolutionOptions}
        value={resolution}
        onChange={setResolution}
      />

      {/* FPS */}
      <SegmentedControl
        label="Frame Rate"
        icon={Gauge}
        options={fpsOptions}
        value={fps}
        onChange={setFps}
      />
    </div>
  );
}
