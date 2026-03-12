import React, { useState, useEffect } from 'react';

interface InputStudioViewProps {
    projectTitle: string;
    onAnalyze: (text: string, options: any) => void;
    onBack: () => void;
}

const InputStudioView: React.FC<InputStudioViewProps> = ({ projectTitle, onAnalyze, onBack }) => {
    const [text, setText] = useState('');
    const [format, setFormat] = useState('roughly');
    const [genre, setGenre] = useState('drama');

    const placeholders = [
        "A lonely astronaut discovers a garden at the edge of the universe...",
        "EXT. NEON STREETS - NIGHT. Rain slicked pavement. A cybernetic detective walks...",
        "Three friends find a map hidden in an old arcade cabinet..."
    ];

    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="studio-container">
            <div className="studio-left">
                <header style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div onClick={onBack} style={{ cursor: 'pointer', color: 'var(--av-cream-600)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '10px', color: 'var(--av-amber-400)', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, marginBottom: '4px' }}>
                            Input Studio
                        </div>
                        <h2 style={{ fontFamily: 'var(--av-font-display)', fontSize: '20px', color: 'var(--av-cream-100)' }}>{projectTitle}</h2>
                    </div>
                </header>

                <div style={{ fontSize: '11px', color: 'var(--av-cream-600)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>DROP YOUR IDEA, SCRIPT, OR CONCEPT</span>
                    <span>{text.length} characters</span>
                </div>

                <textarea
                    className="studio-textarea"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={placeholders[placeholderIndex]}
                />

                <div style={{ marginBottom: '32px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--av-cream-600)', marginBottom: '12px', fontWeight: 700 }}>INPUT FORMAT</div>
                    <div className="format-chips">
                        {['Rough Idea', 'Bullet Points', 'Partial Script', 'Full Script'].map(f => (
                            <div
                                key={f}
                                className={`chip ${format === f.toLowerCase() ? 'active' : ''}`}
                                onClick={() => setFormat(f.toLowerCase())}
                            >
                                {f}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="studio-action-bar">
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--av-neutral-700)', fontSize: '12px' }}>
                            Upload Script
                        </button>
                        <button
                            className="btn-primary"
                            style={{ background: 'transparent', border: '1px solid var(--av-neutral-700)', fontSize: '12px' }}
                            onClick={() => setText("INT. ABANDONED OBSERVATORY - NIGHT\n\nRain drums against the cracked dome. ELARA (30s, weary) adjusts a telescope that hasn't moved in decades.\n\nELARA\nAre you still there?\n\nStatic crackles through a headset. A faint, melodic tone hums beneath the noise.")}
                        >
                            Use Sample
                        </button>
                    </div>
                    <button
                        className="btn-primary"
                        style={{ padding: '14px 28px', fontSize: '13px' }}
                        disabled={!text.trim()}
                        onClick={() => onAnalyze(text, { format, genre })}
                    >
                        Analyze & Structure →
                    </button>
                </div>
            </div>

            <div className="studio-right">
                <section style={{ marginBottom: '48px' }}>
                    <h3 style={{ fontFamily: 'var(--av-font-display)', fontSize: '14px', color: 'var(--av-cream-100)', marginBottom: '24px' }}>What the engine will detect</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            "Scenes & Locations",
                            "Character Archetypes",
                            "Emotional Arc & Tone",
                            "Visual Energy & Dynamics",
                            "Cinematic Shot Intelligence",
                            "Technical Blueprint XML"
                        ].map(item => (
                            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--av-cream-600)' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--av-amber-400)" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                {item}
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 style={{ fontFamily: 'var(--av-font-display)', fontSize: '14px', color: 'var(--av-cream-100)', marginBottom: '24px' }}>Tips for best results</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="glass-card" style={{ padding: '20px' }}>
                            <h5 style={{ fontSize: '13px', color: 'var(--av-cream-100)', marginBottom: '8px' }}>Be descriptive with visuals</h5>
                            <p style={{ fontSize: '12px', color: 'var(--av-cream-600)', lineHeight: '1.5' }}>Include lighting cues, textures, and atmospheric details to help the AI imagine the scene correctly.</p>
                        </div>
                        <div className="glass-card" style={{ padding: '20px' }}>
                            <h5 style={{ fontSize: '13px', color: 'var(--av-cream-100)', marginBottom: '8px' }}>Define emotional beats</h5>
                            <p style={{ fontSize: '12px', color: 'var(--av-cream-600)', lineHeight: '1.5' }}>The engine performs best when character intentions are clear in the dialogue or action lines.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default InputStudioView;
