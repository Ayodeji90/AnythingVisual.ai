import React from 'react';

interface Scene {
  id: string;
  scene_number: number;
  slug: string;
  int_ext: string;
  location: string;
  day_night: string;
  description: string;
  tone: string;
  visual_style?: string;
  shot_types: string[];
  characters: string[];
  required_elements: string[];
}

interface SceneCardProps {
  scene: Scene;
  isExpanded: boolean;
  onToggle: () => void;
  onOpenScene: (sceneId: string) => void;
}

const ToneColors: Record<string, string> = {
  Tension: '#FF4D4D',
  Defiance: '#E8A510',
  Urgency: '#00F0FF',
  Hope: '#00FF94',
  Melancholy: '#A855F7',
};

const SceneCard: React.FC<SceneCardProps> = ({ scene, isExpanded, onToggle, onOpenScene }) => {
  return (
    <div className={`scene-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="scene-card-header" onClick={onToggle}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="scene-number">SCENE {scene.scene_number.toString().padStart(2, '0')}</span>
            <span className="tone-badge" style={{ background: `${ToneColors[scene.tone] || '#888'}22`, color: ToneColors[scene.tone] || '#888', border: `1px solid ${ToneColors[scene.tone] || '#888'}44` }}>
              {scene.tone}
            </span>
          </div>
          <h4 style={{ fontFamily: 'var(--av-font-display)', fontSize: '18px', color: 'var(--av-cream-100)', marginBottom: '4px' }}>
            {scene.slug}
          </h4>
          <div className="scene-meta-row">
            <div className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {scene.location}
            </div>
            <div className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              {scene.day_night}
            </div>
          </div>
          <div className="char-tags">
            {scene.characters.map(char => (
              <span key={char} className="char-pill">{char}</span>
            ))}
          </div>
        </div>
        {!isExpanded && (
          <div style={{ marginLeft: '16px', color: 'var(--av-neutral-600)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        )}
      </div>

      <div style={{ padding: '0 24px 24px', display: isExpanded ? 'none' : 'block' }}>
        <p style={{ fontSize: '12px', color: 'var(--av-cream-500)', fontStyle: 'italic', opacity: 0.8 }}>
          {scene.description.split('.')[0]}.
        </p>
      </div>

      {isExpanded && (
        <>
          <div className="intelligence-grid">
            <div className="intel-box">
              <h6>Visual Style & Mood</h6>
              <p style={{ fontSize: '12px', color: 'var(--av-cream-600)', lineHeight: '1.5' }}>
                {scene.visual_style || "Cinematic chiaroscuro lighting, emphasizing the isolation of the subject with deep shadows."}
              </p>
            </div>
            <div className="intel-box">
              <h6>Shot Intelligence</h6>
              <div className="shot-tags">
                {scene.shot_types.map(shot => (
                  <span key={shot} className="shot-pill">{shot}</span>
                ))}
              </div>
            </div>
            <div className="intel-box" style={{ gridColumn: 'span 2' }}>
              <h6>Required Elements</h6>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {scene.required_elements.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--av-cream-600)' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--av-amber-400)' }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="intel-box" style={{ gridColumn: 'span 2' }}>
              <h6>Production Script</h6>
              <div className="scene-script-box">
                {scene.description}
              </div>
            </div>
          </div>
          <div style={{ padding: '24px', borderTop: '1px solid var(--av-neutral-800)', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '11px', background: 'transparent', border: '1px solid var(--av-neutral-700)' }}
                onClick={(e) => { e.stopPropagation(); onOpenScene(scene.id); }}
              >
                Deep Intelligence
              </button>
              <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '11px', background: 'transparent', border: '1px solid var(--av-neutral-700)' }}>Duplicate</button>
            </div>
            <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '11px' }}>Generate Frame</button>
          </div>
        </>
      )}
    </div>
  );
};

export default SceneCard;
