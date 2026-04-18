import React from 'react';
import { Plus, Trash2, Layers, Bookmark } from 'lucide-react';

interface Scene {
  id: string;
  name: string;
}

interface SceneListProps {
  scenes: Scene[];
  activeScene: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export default function SceneList({ scenes, activeScene, onSelect, onAdd, onRemove }: SceneListProps) {
  return (
    <div className="flex flex-col h-full bg-obs-panel border-r border-obs-border w-64 shadow-[10px_0_30px_rgba(0,0,0,0.3)] z-10 transition-all duration-300">
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="p-1 px-2 rounded-md bg-brand-primary/10 border border-brand-primary/20">
             <Layers size={12} className="text-brand-primary" />
          </div>
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
            Scene Pipeline
          </h3>
        </div>
        <button 
          onClick={onAdd}
          className="p-1.5 hover:bg-brand-primary/20 rounded-lg transition-all text-brand-primary border border-brand-primary/10 hover:scale-110 active:scale-95"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            onClick={() => onSelect(scene.id)}
            className={`
              group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 border
              ${activeScene === scene.id 
                ? 'bg-brand-primary/10 text-white border-brand-primary/30 shadow-[0_8px_20px_-8px_rgba(56,189,248,0.4)]' 
                : 'hover:bg-white/5 text-gray-500 border-transparent hover:border-white/5'}
            `}
          >
            {activeScene === scene.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-primary rounded-r-full shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
            )}
            
            <div className="flex items-center gap-3 min-w-0">
               <Bookmark size={12} className={activeScene === scene.id ? 'text-brand-primary' : 'text-gray-600'} />
               <span className={`text-[12px] font-bold truncate tracking-tight ${activeScene === scene.id ? 'text-white' : 'text-gray-500'}`}>
                 {scene.name.toUpperCase()}
               </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(scene.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 text-red-500/60 hover:text-red-500 rounded-lg transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {scenes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Layers size={32} className="text-white/5 mb-4" />
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed">
              No Production Scenes Found
            </p>
            <button 
               onClick={onAdd}
               className="mt-4 text-[9px] font-black text-brand-primary/50 hover:text-brand-primary uppercase tracking-widest transition-colors"
            >
               + Initialize First Scene
            </button>
          </div>
        )}
      </div>

      {/* Aesthetic Bottom Marker */}
      <div className="p-4 border-t border-white/5 bg-black/10">
         <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Engine Version: 2.0.4-PRO</span>
         </div>
         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-[65%] bg-brand-primary/20" />
         </div>
      </div>
    </div>
  );
}
