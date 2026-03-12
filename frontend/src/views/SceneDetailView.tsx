import React, { useState } from 'react';

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

interface SceneDetailViewProps {
  scene: Scene;
  projectTitle: string;
  onBack: () => void;
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (updatedScene: Scene) => void;
}

const SceneDetailView: React.FC<SceneDetailViewProps> = ({ scene, projectTitle, onBack, onNext, onPrev, onUpdate }) => {
  const [activeStyle, setActiveStyle] = useState('Cinematic');
  const [prompt, setPrompt] = useState(`Wide anamorphic shot of ${scene.location}, ${scene.visual_style || 'cinematic lighting, 8k resolution'}`);
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const styles = ['Cinematic', 'Documentary', 'Commercial', 'Animated', 'Noir', 'High-Key'];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedImage('https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2059&ixlib=rb-4.0.3');
    }, 3000);
  };

  return (
    <div className="detail-container">
      <div className="detail-left">
        <header className="detail-header">
          <div className="breadcrumb">
            <span onClick={onBack}>{projectTitle}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            <span onClick={onBack}>Board</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            <span style={{ color: 'var(--av-cream-100)' }}>Scene {scene.scene_number}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--av-font-display)', fontSize: '24px', color: 'var(--av-cream-100)' }}>
              {scene.slug}
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div onClick={onPrev} style={{ cursor: 'pointer', color: 'var(--av-cream-600)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </div>
              <div onClick={onNext} style={{ cursor: 'pointer', color: 'var(--av-cream-600)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </div>
            </div>
          </div>
        </header>

        <section>
          <div className="detail-field-group">
            <label className="detail-label">
              Location
              <span className="ai-suggest-btn">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                AI Suggest
              </span>
            </label>
            <input className="detail-input" value={scene.location} readOnly />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="detail-field-group">
              <label className="detail-label">Time of Day</label>
              <input className="detail-input" value={scene.day_night} readOnly />
            </div>
            <div className="detail-field-group">
              <label className="detail-label">Atmospheric Tone</label>
              <input className="detail-input" value={scene.tone} readOnly />
            </div>
          </div>

          <div className="detail-field-group">
            <label className="detail-label">Scene Intelligence Objective</label>
            <textarea
              className="detail-input"
              style={{ height: '80px', resize: 'none' }}
              value="Establish the protagonist's isolation through high-contrast lighting and slow tracking shots."
              readOnly
            />
          </div>

          <div className="detail-field-group">
            <label className="detail-label">Screenplay Script</label>
            <div className="scene-script-box" style={{ maxHeaderHeight: 'none', height: '300px', fontSize: '14px', background: 'var(--av-bg-raised)', border: '1px solid var(--av-neutral-800)' }}>
              {scene.description}
            </div>
          </div>

          <div className="detail-field-group">
            <label className="detail-label">Character Breakdown</label>
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', fontSize: '12px', color: 'var(--av-cream-600)', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--av-neutral-800)' }}>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Character</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Emotional Arc</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Lines</th>
                  </tr>
                </thead>
                <tbody>
                  {scene.characters.map((char, i) => (
                    <tr key={char} style={{ borderBottom: i < scene.characters.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <td style={{ padding: '12px', color: 'var(--av-cream-100)', fontWeight: 600 }}>{char}</td>
                      <td style={{ padding: '12px' }}>{i === 0 ? 'Defance -> Curiosity' : 'Passive Monitoring'}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>{Math.floor(Math.random() * 5) + 1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <div className="detail-right">
        <h3 style={{ fontFamily: 'var(--av-font-display)', fontSize: '14px', color: 'var(--av-amber-400)', marginBottom: '24px', letterSpacing: '0.1em' }}>VISUAL WORKSPACE</h3>

        <div className="detail-field-group">
          <label className="detail-label">Auto-Generated Visual Prompt</label>
          <textarea
            className="detail-input"
            style={{ height: '120px', background: 'var(--av-bg-base)', border: '1px solid var(--av-neutral-700)', fontFamily: 'monospace' }}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="detail-field-group">
          <label className="detail-label">Visual Style Preset</label>
          <div className="style-grid">
            {styles.map(s => (
              <div
                key={s}
                className={`style-pill ${activeStyle === s ? 'active' : ''}`}
                onClick={() => setActiveStyle(s)}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn-primary"
          style={{ width: '100%', padding: '16px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating ? (
            <>
              <div style={{ width: '16px', height: '16px', border: '2px solid rgba(10,9,7,0.3)', borderTopColor: 'var(--av-bg-base)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              Generating Cinematic Intelligence...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              Generate Key Frame
            </>
          )}
        </button>

        <div className="image-preview-box">
          {generating ? (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="processing-orb" style={{ width: '100px', height: '100px', opacity: 0.3 }} />
            </div>
          ) : generatedImage ? (
            <>
              <img src={generatedImage} alt="Generated" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '9px', color: 'var(--av-amber-400)', fontWeight: 800 }}>SCENE {scene.scene_number} • {activeStyle.toUpperCase()}</div>
                  <div style={{ fontSize: '12px', color: 'white', fontWeight: 600 }}>{scene.slug}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px', borderRadius: '4px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--av-neutral-600)', gap: '12px' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Generation Workspace Ready</span>
            </div>
          )}
        </div>

        <section style={{ marginTop: '48px' }}>
          <h4 style={{ fontSize: '11px', color: 'var(--av-cream-600)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>SCENE HISTORY</h4>
          <div className="image-history-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="history-thumb">
                <div style={{ width: '100%', height: '100%', background: 'var(--av-neutral-800)', opacity: 0.5 }} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SceneDetailView;
