import React from 'react';

const ModulesSection: React.FC = () => {
    const modules = [
        {
            name: 'Content Triage',
            description: 'AI classifies your input — rough idea, partial script, or full screenplay — and plans the optimal processing path.',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--av-amber-400)" strokeWidth="1.5">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
            ),
        },
        {
            name: 'Script Structuring',
            description: 'Extracts logline, synopsis, genre, and characters. Converts raw text into a clean, formatted narrative structure.',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--av-amber-400)" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
            ),
        },
        {
            name: 'Scene Segmentation',
            description: 'Intelligently breaks your script into discrete production scenes with locations, characters, tone, and objectives.',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--av-amber-400)" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
            ),
        },
        {
            name: 'Visual Enrichment',
            description: 'Adds cinematography metadata — shooting style, shot types, lighting, props, and environment details per scene.',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--av-amber-400)" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
                    <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
                </svg>
            ),
        },
        {
            name: 'Keyframe Generation',
            description: 'AI-powered cinematic visualization for every scene — generate reference frames to share with your production team.',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--av-amber-400)" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
            ),
        },
    ];

    return (
        <section className="landing-section">
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <div className="section-eyebrow" style={{ justifyContent: 'center' }}>The AI Pipeline</div>
                    <h2 style={{
                        fontFamily: 'var(--av-font-display)', fontSize: '36px',
                        color: 'var(--av-cream-100)', maxWidth: '600px', margin: '0 auto',
                    }}>
                        Five production stages. <span className="amber">One click.</span>
                    </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
                    {/* Vertical connector line */}
                    <div style={{
                        position: 'absolute', left: '23px', top: '48px', bottom: '48px', width: '1px',
                        background: 'linear-gradient(to bottom, var(--av-amber-400), var(--av-neutral-800))',
                        opacity: 0.3,
                    }} />

                    {modules.map((m, i) => (
                        <div key={i} style={{
                            display: 'flex', gap: '28px', alignItems: 'flex-start',
                            padding: '28px 0',
                        }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                                background: i === 0 ? 'rgba(232,165,16,0.12)' : 'var(--av-bg-raised)',
                                border: `1px solid ${i === 0 ? 'rgba(232,165,16,0.3)' : 'var(--av-neutral-800)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative', zIndex: 1,
                            }}>
                                {m.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                                    <span style={{
                                        fontFamily: 'var(--av-font-display)', fontSize: '10px', fontWeight: 700,
                                        letterSpacing: '0.15em', color: 'var(--av-amber-400)',
                                    }}>STAGE {i + 1}</span>
                                </div>
                                <h4 style={{
                                    fontFamily: 'var(--av-font-display)', color: 'var(--av-cream-100)',
                                    fontSize: '18px', marginBottom: '6px', fontWeight: 600,
                                }}>{m.name}</h4>
                                <p style={{ color: 'var(--av-cream-500)', fontSize: '14px', lineHeight: '1.7', maxWidth: '520px' }}>{m.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ModulesSection;
