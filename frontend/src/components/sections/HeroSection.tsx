import React from 'react';

interface HeroSectionProps {
    onStart: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStart }) => {
    return (
        <section className="landing-section" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: '0',
            overflow: 'hidden',
            position: 'relative',
        }}>
            {/* Cinematic warm gradient background */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(232,165,16,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse 50% 80% at 80% 20%, rgba(201,138,0,0.04) 0%, transparent 60%)',
                pointerEvents: 'none',
            }} />

            {/* Film strip decoration — left */}
            <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: '48px',
                background: 'repeating-linear-gradient(to bottom, var(--av-neutral-800) 0px, var(--av-neutral-800) 24px, transparent 24px, transparent 32px)',
                opacity: 0.15,
            }} />
            {/* Film strip decoration — right */}
            <div style={{
                position: 'absolute', right: 0, top: 0, bottom: 0, width: '48px',
                background: 'repeating-linear-gradient(to bottom, var(--av-neutral-800) 0px, var(--av-neutral-800) 24px, transparent 24px, transparent 32px)',
                opacity: 0.15,
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '860px' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    padding: '8px 20px', borderRadius: '100px',
                    background: 'rgba(232,165,16,0.08)', border: '1px solid rgba(232,165,16,0.2)',
                    marginBottom: '40px',
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--av-amber-400)" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                    <span style={{
                        fontFamily: 'var(--av-font-display)', fontSize: '11px', fontWeight: 600,
                        letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--av-amber-400)',
                    }}>AI-Powered Production Studio</span>
                </div>

                <h1 className="display-title" style={{ textAlign: 'center', marginBottom: '16px' }}>
                    Turn Any Idea Into<br />
                    <span className="amber">Production-Ready Scenes.</span>
                </h1>

                <p style={{
                    fontSize: '19px', color: 'var(--av-cream-400)', maxWidth: '620px',
                    margin: '0 auto 48px', fontWeight: 300, lineHeight: 1.7,
                }}>
                    Paste a script, a rough idea, or a story concept. Our AI breaks it down into structured scenes, visual blueprints, and exportable production documents — in seconds.
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '13px' }} onClick={onStart}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        Start Creating
                    </button>
                    <button className="btn-primary" style={{
                        padding: '16px 32px', fontSize: '13px',
                        background: 'rgba(255,255,255,0.04)', border: '1px solid var(--av-neutral-600)',
                        color: 'var(--av-cream-200)',
                    }} onClick={onStart}>
                        See How It Works
                    </button>
                </div>

                {/* Trust indicators */}
                <div style={{
                    display: 'flex', justifyContent: 'center', gap: '40px',
                    marginTop: '72px', flexWrap: 'wrap',
                }}>
                    {[
                        { icon: '🎬', label: 'Filmmakers' },
                        { icon: '📝', label: 'Screenwriters' },
                        { icon: '🎨', label: 'Content Creators' },
                        { icon: '📺', label: 'Agencies' },
                    ].map(item => (
                        <div key={item.label} style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                            <span style={{ fontSize: '18px' }}>{item.icon}</span>
                            <span style={{
                                fontFamily: 'var(--av-font-display)', fontSize: '11px', fontWeight: 500,
                                letterSpacing: '0.08em', color: 'var(--av-cream-500)', textTransform: 'uppercase',
                            }}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom film frame line */}
            <div style={{
                position: 'absolute', bottom: '0', width: '100%', height: '1px',
                background: 'linear-gradient(to right, transparent, var(--av-amber-400), transparent)',
                opacity: 0.2,
            }} />
        </section>
    );
};

export default HeroSection;
