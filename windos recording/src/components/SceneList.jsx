import React from 'react';
import { Plus, Trash2, Layers } from 'lucide-react';

export default function SceneList({ scenes, activeScene, onSelect, onAdd, onRemove }) {
  return (
    <div className="flex flex-col h-full bg-obs-panel border-r border-obs-border w-64">
      <div className="flex items-center justify-between p-3 border-b border-obs-border">
        <h3 className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <img src="/assets/icon.png" alt="" className="w-3.5 h-3.5 rounded-sm" />
          Scenes
        </h3>
        <button 
          onClick={onAdd}
          className="p-1 hover:bg-white/10 rounded-md transition-colors text-brand-primary"
        >
          <Plus size={18} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            onClick={() => onSelect(scene.id)}
            className={`
              group flex items-center justify-between p-2 rounded-md cursor-pointer transition-all
              ${activeScene === scene.id ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30' : 'hover:bg-white/5 text-gray-400'}
            `}
          >
            <span className="text-sm font-medium truncate">{scene.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(scene.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 text-red-500 rounded transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {scenes.length === 0 && (
          <div className="text-center py-8 text-xs text-gray-600 italic">
            No scenes added
          </div>
        )}
      </div>
    </div>
  );
}
