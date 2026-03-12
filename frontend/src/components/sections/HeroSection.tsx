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
            overflow: 'hidden'
        }}>
            <div className="hero-grid-bg" />
            {/* Animated nodes */}
            <div className="grid-node" style={{ top: '20%', left: '15%' }} />
            <div className="grid-node" style={{ top: '60%', left: '80%' }} />
            <div className="grid-node" style={{ top: '40%', left: '45%' }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="section-eyebrow">Visual Intelligence Stage 1 MVP</div>
                <h1 className="display-title">
                    From Raw Idea to<br />
                    <span className="amber">Scene Intelligence.</span>
                </h1>
                <p style={{
                    fontSize: '20px',
                    color: 'var(--av-cream-500)',
                    maxWidth: '580px',
                    margin: '24px 0 48px',
                    fontWeight: 300
                }}>
                    The AI brain between writing and video production. Transform scripts into production-ready blueprints in seconds.
                </p>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '13px' }} onClick={onStart}>
                        Start Free
                    </button>
                    <button className="btn-primary" style={{
                        padding: '16px 32px',
                        fontSize: '13px',
                        background: 'transparent',
                        border: '1px solid var(--av-neutral-600)',
                        color: 'var(--av-cream-200)'
                    }}>
                        Watch Demo
                    </button>
                </div>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '60px',
                width: '100%',
                borderTop: '1px solid var(--av-neutral-800)',
                paddingTop: '24px'
            }}>
                <div className="container">
                    <div style={{
                        fontFamily: 'var(--av-font-display)',
                        fontSize: '10px',
                        letterSpacing: '0.2em',
                        color: 'var(--av-cream-600)',
                        textTransform: 'uppercase'
                    }}>
                        Built for filmmakers, creators & marketing teams
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
