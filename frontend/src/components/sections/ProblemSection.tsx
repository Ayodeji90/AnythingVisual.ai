import React from 'react';

const ProblemSection: React.FC = () => {
    const painPoints = [
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--av-amber-400)" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
            ),
            title: 'Script to Breakdown',
            hours: '8+ hours manual',
            description: 'Filmmakers spend entire days manually breaking scripts into scenes, tagging locations, characters, and props by hand.',
        },
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--av-amber-400)" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                    <line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" />
                    <line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="22" y2="7" /><line x1="2" y1="17" x2="22" y2="17" />
                </svg>
            ),
            title: 'Storyboard Creation',
            hours: '2-5 days typical',
            description: 'Visual planning is bottlenecked — rough ideas sit in notebooks while production timelines slip and budgets inflate.',
        },
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--av-amber-400)" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
            ),
            title: 'Pre-Production Lag',
            hours: 'Weeks wasted',
            description: 'The gap between "idea" and "ready to shoot" is where creative momentum dies. Every project loses time here.',
        },
    ];

    return (
        <section className="landing-section" style={{ background: 'var(--av-bg-base)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '72px' }}>
                    <div className="section-eyebrow" style={{ justifyContent: 'center' }}>The Production Gap</div>
                    <h2 style={{
                        fontFamily: 'var(--av-font-display)', fontSize: '36px',
                        color: 'var(--av-cream-100)', maxWidth: '700px', margin: '0 auto',
                    }}>
                        Great stories deserve better tools <span className="amber">between writing and shooting.</span>
                    </h2>
                </div>

                <div className="landing-grid-3">
                    {painPoints.map((p, i) => (
                        <div key={i} style={{
                            padding: '36px 32px',
                            background: 'var(--av-bg-raised)',
                            border: '1px solid var(--av-neutral-800)',
                            borderRadius: 'var(--av-radius-lg)',
                            display: 'flex', flexDirection: 'column', gap: '16px',
                            transition: 'border-color 0.3s, transform 0.3s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--av-neutral-600)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--av-neutral-800)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                {p.icon}
                                <span style={{
                                    fontFamily: 'var(--av-font-display)', fontSize: '10px', fontWeight: 700,
                                    color: 'var(--av-tone-tension)', letterSpacing: '0.05em',
                                    padding: '4px 10px', borderRadius: '100px',
                                    background: 'rgba(192,74,58,0.1)', border: '1px solid rgba(192,74,58,0.2)',
                                }}>{p.hours}</span>
                            </div>
                            <h4 style={{
                                fontFamily: 'var(--av-font-display)', fontSize: '18px',
                                color: 'var(--av-cream-100)', fontWeight: 600,
                            }}>{p.title}</h4>
                            <p style={{ color: 'var(--av-cream-500)', fontSize: '14px', lineHeight: '1.7' }}>
                                {p.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: '80px', textAlign: 'center', padding: '48px 0',
                    borderTop: '1px solid var(--av-neutral-800)',
                }}>
                    <p style={{
                        fontFamily: 'var(--av-font-display)', fontSize: '14px',
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        color: 'var(--av-amber-400)', marginBottom: '16px',
                    }}>With AnythingVisual</p>
                    <h2 style={{
                        fontFamily: 'var(--av-font-display)', fontSize: '32px',
                        color: 'var(--av-cream-100)', maxWidth: '700px', margin: '0 auto',
                    }}>
                        Idea to production blueprint <span className="amber">in under 60 seconds.</span>
                    </h2>
                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
