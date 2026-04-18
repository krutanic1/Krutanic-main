import React from 'react';
import { Camera, Mic, Monitor, Gauge, ChevronDown, ScanFace, Sun, Contrast, UserRound, EyeOff } from 'lucide-react';
import { useStore } from '../store/useStore';

const RESOLUTIONS = [
  { label: '720p',  width: 1280,  height: 720 },
  { label: '1080p', width: 1920,  height: 1080 },
  { label: '1440p', width: 2560,  height: 1440 },
];

const FPS_OPTIONS = [24, 30, 60];

interface AdvancedSettingsProps {
  cameras: any[];
  microphones: any[];
  selectedCamera: string;
  setSelectedCamera: (id: string) => void;
  selectedMic: string;
  setSelectedMic: (id: string) => void;
  isWebcamOn: boolean;
  onToggleWebcam: () => void;
}

function Select({ label, icon: Icon, value, onChange, options, placeholder = 'None detected' }: any) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-[9px] uppercase font-black text-gray-500 tracking-[0.1em]">
        <Icon size={12} className="opacity-70" />
        {label}
      </label>
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-[11px] text-gray-200 pr-10 cursor-pointer focus:outline-none focus:border-brand-primary/40 focus:ring-1 focus:ring-brand-primary/20 transition-all hover:bg-black/60"
        >
          {options.length === 0 && <option value="">{placeholder}</option>}
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value} className="bg-obs-panel">{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-brand-primary transition-colors" />
      </div>
    </div>
  );
}

function SegmentedControl({ label, icon: Icon, options, value, onChange }: any) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-[9px] uppercase font-black text-gray-500 tracking-[0.1em]">
        <Icon size={12} className="opacity-70" />
        {label}
      </label>
      <div className="flex gap-1 bg-black/40 rounded-xl p-1 border border-white/5">
        {options.map((opt: any) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 rounded-lg text-[10px] font-bold tracking-tight transition-all duration-300 ${
              value === opt.value
                ? 'bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-lg'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
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
  isWebcamOn,     onToggleWebcam,
}: AdvancedSettingsProps) {
  const store = useStore();

  const cameraOptions = cameras.map((d) => ({ value: d.deviceId, label: d.label || `Camera ${d.deviceId.slice(0, 8)}` }));
  const micOptions = microphones.map((d) => ({ value: d.deviceId, label: d.label || `Mic ${d.deviceId.slice(0, 8)}` }));
  const resOptions = RESOLUTIONS.map((r) => ({ value: r.label, label: r.label }));
  const fpsOptions = FPS_OPTIONS.map((f) => ({ value: f, label: `${f} FPS` }));

  return (
    <div className="px-5 pb-8 space-y-6 border-t border-obs-border pt-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <div className="h-1 w-4 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
        <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.15em]">Capture Configuration</p>
      </div>

      {/* Camera device + toggle */}
      <div className="space-y-4">
        <Select
          label="Vision Source"
          icon={Camera}
          value={selectedCamera}
          onChange={setSelectedCamera}
          options={cameraOptions}
          placeholder="No cameras connected"
        />
        
        <button
          onClick={onToggleWebcam}
          className={`w-full py-3 rounded-xl text-xs font-black tracking-widest border transition-all duration-300 ${
            isWebcamOn
              ? 'border-brand-primary/40 bg-brand-primary/10 text-brand-primary shadow-[inset_0_0_20px_rgba(56,189,248,0.1)]'
              : 'border-white/5 bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
          }`}
        >
          {isWebcamOn ? 'DISABLE VISION' : 'INITIALIZE CAMERA'}
        </button>

        {isWebcamOn && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            {/* AI Background */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] uppercase font-black text-gray-500 tracking-[0.1em]">
                <ScanFace size={12} className="opacity-70" />
                AI Effects Engine
              </label>
              <div className="flex gap-1.5 bg-black/40 rounded-xl p-1 border border-white/5">
                {[
                  { id: 'off',    label: 'Off',    icon: EyeOff },
                  { id: 'blur',   label: 'Blur',   icon: ScanFace },
                  { id: 'remove', label: 'No BG',  icon: UserRound },
                ].map((opt) => {
                  const isActive = opt.id === 'off' ? !store.isVirtualBgEnabled : (store.isVirtualBgEnabled && store.bgMode === opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        if (opt.id === 'off') {
                          store.setVirtualBgEnabled(false);
                        } else {
                          store.setVirtualBgEnabled(true);
                          store.setBgMode(opt.id as 'blur' | 'remove');
                        }
                      }}
                      className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-inter font-black transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-[1.02]'
                          : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <opt.icon size={14} className={isActive ? 'opacity-100' : 'opacity-40'} />
                      <span className="text-[8px] uppercase tracking-tighter">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Controls (Brightness/Contrast) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[8px] font-black text-gray-500 uppercase">
                  <span className="flex items-center gap-1.5"><Sun size={10} /> Brightness</span>
                  <span className="text-gray-400">{store.cameraBrightness}%</span>
                </div>
                <input
                  type="range" min="50" max="200"
                  value={store.cameraBrightness}
                  onChange={(e) => store.setCameraBrightness(Number(e.target.value))}
                  className="w-full h-1 bg-black/50 rounded-full appearance-none cursor-pointer accent-brand-primary"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[8px] font-black text-gray-500 uppercase">
                  <span className="flex items-center gap-1.5"><Contrast size={10} /> Contrast</span>
                  <span className="text-gray-400">{store.cameraContrast}%</span>
                </div>
                <input
                  type="range" min="50" max="200"
                  value={store.cameraContrast}
                  onChange={(e) => store.setCameraContrast(Number(e.target.value))}
                  className="w-full h-1 bg-black/50 rounded-full appearance-none cursor-pointer accent-brand-primary"
                />
              </div>
            </div>

            {/* PiP Controls */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-tight">Floating Monitor</span>
                  <span className="text-[9px] text-gray-500 font-medium">Overlays all windows</span>
                </div>
                <button
                  onClick={() => store.setShowFloatingCamera(!store.showFloatingCamera)}
                  className={`w-10 h-5 rounded-full transition-all relative ${store.showFloatingCamera ? 'bg-brand-primary' : 'bg-gray-800'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${store.showFloatingCamera ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              {store.showFloatingCamera && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                   <div className="flex items-center justify-between text-[9px] font-black text-gray-500 uppercase">
                    <span>Monitor Width</span>
                    <span className="text-brand-primary">{store.floatingCameraWidth}PX</span>
                  </div>
                  <input
                    type="range" min="180" max="520" step="10"
                    value={store.floatingCameraWidth}
                    onChange={(e) => store.setFloatingCameraWidth(Number(e.target.value))}
                    className="w-full h-1 bg-black/50 rounded-full appearance-none cursor-pointer accent-brand-primary"
                  />
                </div>
              )}
            </div>

            {/* YouTube Streaming Integration */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-tight flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    LIVE BROADCAST ENGINE
                  </span>
                  <span className="text-[9px] text-gray-500 font-medium">YouTube Studio Integration</span>
                </div>
                {!store.youtubeUser ? (
                  <button
                    onClick={async () => {
                      try {
                        const user = await window.electronAPI.youtubeLogin();
                        store.setYoutubeUser(user);
                      } catch (err: any) { 
                        store.setGlobalError('YouTube Login Error: ' + err.message);
                        console.error('Auth error:', err); 
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-white hover:bg-white/10 transition-all"
                  >
                    LOGIN WITH GOOGLE
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      await window.electronAPI.youtubeLogout();
                      store.setYoutubeUser(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[9px] font-black text-red-400 hover:bg-red-500 hover:text-white transition-all"
                  >
                    LOGOUT
                  </button>
                )}
              </div>

              {store.youtubeUser && (
                <div className="animate-in slide-in-from-top-2 duration-300 space-y-4">
                  {/* Channel Info Card */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5">
                    {store.youtubeUser.snippet.thumbnails.default.url && (
                      <img
                        src={store.youtubeUser.snippet.thumbnails.default.url}
                        className="w-8 h-8 rounded-full border border-white/10 shadow-lg"
                        alt="Channel avatar"
                      />
                    )}
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] font-black text-gray-200 truncate">{store.youtubeUser.snippet.title}</span>
                      <span className="text-[8px] text-gray-500 uppercase font-bold tracking-tighter">
                        {parseInt(store.youtubeUser.statistics.subscriberCount).toLocaleString()} Subscribers
                      </span>
                    </div>
                  </div>

                  {/* Broadcast Automation */}
                  <div className="space-y-3 p-3 rounded-xl bg-black/40 border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Auto-Create Broadcast</span>
                      <button
                        onClick={() => store.setIsAutoBroadcastEnabled(!store.isAutoBroadcastEnabled)}
                        className={`w-8 h-4 rounded-full transition-all relative ${store.isAutoBroadcastEnabled ? 'bg-brand-primary' : 'bg-gray-800'}`}
                      >
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${store.isAutoBroadcastEnabled ? 'left-4.5' : 'left-0.5'}`} />
                      </button>
                    </div>

                    {!store.isAutoBroadcastEnabled && !store.activeBroadcastId && (
                      <button
                        onClick={async () => {
                          try {
                            const res = await window.electronAPI.youtubeCreateBroadcast(`Manual Live - ${new Date().toLocaleTimeString()}`);
                            store.setStreamKey(res.streamKey);
                            store.setActiveBroadcastId(res.broadcastId);
                          } catch (err: any) { 
                            store.setGlobalError('Broadcast Error: ' + err.message);
                            console.error('Broadcast err:', err); 
                          }
                        }}
                        className="w-full py-2 rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-[9px] font-black text-brand-primary hover:bg-brand-primary hover:text-white transition-all"
                      >
                        INITIALIZE BROADCAST NOW
                      </button>
                    )}

                    {store.activeBroadcastId && (
                      <div className="p-2 rounded-lg bg-green-500/5 border border-green-500/10 flex items-center justify-between">
                        <span className="text-[8px] font-black text-green-400 uppercase">Broadcast Ready</span>
                        <div className="flex gap-1">
                           <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                           <div className="w-1 h-1 rounded-full bg-green-500/50 animate-pulse delay-75" />
                           <div className="w-1 h-1 rounded-full bg-green-500/20 animate-pulse delay-150" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Streaming Engine</span>
                  <span className="text-[9px] text-gray-500 font-medium">{store.isStreamingEnabled ? 'Ready to cast' : 'Local only'}</span>
                </div>
                <button
                  onClick={() => store.setIsStreamingEnabled(!store.isStreamingEnabled)}
                  className={`w-10 h-5 rounded-full transition-all relative ${store.isStreamingEnabled ? 'bg-red-500' : 'bg-gray-800'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${store.isStreamingEnabled ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              {store.isStreamingEnabled && !store.youtubeUser && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-1 border-stone-800 border-l-2 pl-4 py-1">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Manual Stream Key</label>
                    <input
                      type="password"
                      value={store.streamKey}
                      onChange={(e) => store.setStreamKey(e.target.value)}
                      placeholder="PASTE FROM YOUTUBE STUDIO"
                      className="w-full bg-black/60 border border-white/5 rounded-lg px-3 py-2 text-[11px] text-red-200 placeholder:text-gray-700 outline-none focus:border-red-500/40"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Audio device */}
      <Select
        label="Audio Source"
        icon={Mic}
        value={selectedMic}
        onChange={setSelectedMic}
        options={micOptions}
        placeholder="No input devices"
      />

      {/* Core Options */}
      <div className="grid gap-5 pt-2">
        <SegmentedControl
          label="Canvas Resolution"
          icon={Monitor}
          options={resOptions}
          value={store.resolution}
          onChange={store.setResolution}
        />

        <SegmentedControl
          label="Capture Velocity"
          icon={Gauge}
          options={fpsOptions}
          value={store.fps}
          onChange={store.setFps}
        />
      </div>

      {/* Post-Processing (Cropping) */}
      <div className="pt-6 border-t border-obs-border space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Safe-Zone Framing</span>
            <span className="text-[9px] text-gray-600 font-medium italic">Auto-crop taskbars</span>
          </div>
          <button
            onClick={async () => {
              try {
                const displays = await window.electronAPI.getScreenInfo();
                if (displays?.length > 0) {
                  const display = displays.find(d => d.workArea.width !== d.bounds.width) || displays[0];
                  const { bounds, workArea } = display;
                  store.setCropTop(Math.max(0, workArea.y - bounds.y) + 32);
                  store.setCropBottom(Math.max(0, bounds.height - (workArea.y + workArea.height)) || 42);
                }
              } catch (err) { console.error(err); }
            }}
            className="px-3 py-1.5 rounded-lg text-[9px] font-black border border-brand-primary/30 bg-brand-primary/5 text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-[0_4px_12px_-4px_rgba(56,189,248,0.3)]"
          >
            AUTO-DETECT
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Crop Top (PX)</label>
            <input
              type="number" value={store.cropTop}
              onChange={(e) => store.setCropTop(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 outline-none focus:border-brand-primary/40"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Crop Bottom (PX)</label>
            <input
              type="number" value={store.cropBottom}
              onChange={(e) => store.setCropBottom(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 outline-none focus:border-brand-primary/40"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
