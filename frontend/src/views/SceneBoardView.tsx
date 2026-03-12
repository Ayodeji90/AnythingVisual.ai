import React, { useState } from 'react';
import SceneCard from '../components/SceneCard';

interface SceneBoardViewProps {
  blueprint: any;
  onBack: () => void;
  onExport: (format: string) => void;
  onOpenScene: (id: string) => void;
}

const SceneBoardView: React.FC<SceneBoardViewProps> = ({ blueprint, onBack, onExport, onOpenScene }) => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [showScript, setShowScript] = useState(false);
  const [viewMode, setViewMode] = useState('board');

  const scenes = blueprint?.scenes || [];

  return (
    <div className="board-container">
      <header className="board-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div onClick={onBack} style={{ cursor: 'pointer', color: 'var(--av-cream-600)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--av-font-display)', fontSize: '16px', color: 'var(--av-cream-100)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {blueprint?.title || 'Untitled Project'}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--av-neutral-600)" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            </h2>
            <div style={{ fontSize: '10px', color: 'var(--av-cream-600)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {scenes.length} Scenes • {blueprint?.characters?.length || 4} Characters • English
            </div>
          </div>
        </div>

        <div className="view-toggle" style={{ display: 'flex', background: 'var(--av-bg-base)', padding: '4px', borderRadius: '8px', border: '1px solid var(--av-neutral-800)' }}>
          {['Board', 'List', 'Script'].map(mode => (
            <div
              key={mode}
              onClick={() => setViewMode(mode.toLowerCase())}
              style={{
                padding: '6px 16px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '6px',
                cursor: 'pointer',
                background: viewMode === mode.toLowerCase() ? 'var(--av-bg-raised)' : 'transparent',
                color: viewMode === mode.toLowerCase() ? 'var(--av-amber-400)' : 'var(--av-cream-600)',
                transition: 'all 0.2s'
              }}
            >
              {mode}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div
            onClick={() => setShowScript(!showScript)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: showScript ? 'var(--av-amber-400)' : 'var(--av-cream-600)',
              cursor: 'pointer',
              marginRight: '12px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
            Script Strip
          </div>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '11px', background: 'transparent', border: '1px solid var(--av-neutral-700)' }}>Share</button>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '11px' }} onClick={() => onExport('pdf')}>Export</button>
        </div>
      </header>

      <div className={`script-strip ${!showScript ? 'collapsed' : ''}`}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h5 style={{ fontSize: '10px', color: 'var(--av-amber-400)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>RAW SCRIPT STUDIO</h5>
            <span style={{ fontSize: '10px', color: 'var(--av-cream-600)' }}>LAST SYNC 2M AGO</span>
          </div>
          <div className="scene-script-box" style={{ maxHeaderHeight: 'none', background: 'transparent', padding: 0, fontSize: '14px', border: 'none' }}>
            {blueprint?.full_script || blueprint?.synopsis || "No script content loaded."}
            <br /><br />
            INT. OBSERVATORY - CONTINUOUS
            <br /><br />
            ELARA leans in closer. The static is forming patterns. Not noise. Mathematics.
          </div>
        </div>
      </div>

      <main className="board-grid">
        {scenes.map((scene: any) => (
          <SceneCard
            key={scene.id || scene.scene_number}
            scene={{
              ...scene,
              shot_types: scene.shot_types || ["Medium Shot", "Eye Level"],
              characters: scene.characters || ["Unknown"],
              required_elements: scene.required_elements || ["Ambient Sound"]
            }}
            isExpanded={expandedCardId === (scene.id || scene.scene_number.toString())}
            onToggle={() => setExpandedCardId(expandedCardId === (scene.id || scene.scene_number.toString()) ? null : (scene.id || scene.scene_number.toString()))}
            onOpenScene={(id) => onOpenScene(id)}
          />
        ))}

        <div
          className="glass-card"
          style={{
            height: '240px',
            border: '2px dashed var(--av-neutral-800)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            gap: '12px'
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--av-bg-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--av-neutral-600)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--av-cream-600)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.1em' }}>Add Scene</span>
        </div>
      </main>

      <div style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(232, 165, 16, 0.95)',
        color: 'var(--av-bg-base)',
        padding: '12px 24px',
        borderRadius: '100px',
        boxShadow: '0 8px 32px rgba(232, 165, 16, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontWeight: 800,
        fontSize: '12px',
        cursor: 'pointer',
        zIndex: 100
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="7 13 12 18 17 13" /><polyline points="7 6 12 11 17 6" /></svg>
        GENERATE ALL KEYFRAMES
      </div>
    </div>
  );
};

export default SceneBoardView;
