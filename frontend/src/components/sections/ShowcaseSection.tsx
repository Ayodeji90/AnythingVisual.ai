import React from 'react';

const ShowcaseSection: React.FC = () => {
    const steps = [
        {
            step: '01',
            title: 'Paste Your Script',
            description: 'Drop in anything — a rough idea, screenplay fragment, treatment, or full script. Any format works.',
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--av-amber-400)" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                </svg>
            ),
            preview: (
                <div style={{ padding: '20px', background: 'var(--av-bg-base)', borderRadius: '10px', border: '1px solid var(--av-neutral-800)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--av-cream-500)', lineHeight: 1.8, fontFamily: 'var(--av-font-body)' }}>
                        <span style={{ color: 'var(--av-cream-300)', fontWeight: 600 }}>EXT. ROOFTOP — NIGHT</span><br />
                        Rain hammers the concrete. MAYA stands at the edge, looking down at the city lights bleeding through the storm...<br /><br />
                        <span style={{ color: 'var(--av-cream-300)', fontWeight: 600 }}>INT. CONTROL ROOM — CONTINUOUS</span><br />
                        Monitors flicker. JACK slams his fist on the desk...
                    </div>
                </div>
            ),
        },
        {
            step: '02',
            title: 'AI Scene Breakdown',
            description: 'Our pipeline triages, structures, and segments your content into production-ready scenes with full metadata.',
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--av-amber-400)" strokeWidth="1.5">
                    <path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
            ),
            preview: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                        { num: 1, title: 'Rooftop Confrontation', tone: 'Tension', location: 'EXT. Rooftop' },
                        { num: 2, title: 'Control Room Crisis', tone: 'Urgency', location: 'INT. Control Room' },
                        { num: 3, title: 'The Escape', tone: 'Defiance', location: 'EXT. Alley' },
                    ].map(s => (
                        <div key={s.num} style={{
                            padding: '14px 16px', background: 'var(--av-bg-base)',
                            borderRadius: '8px', border: '1px solid var(--av-neutral-800)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontFamily: 'var(--av-font-display)', fontSize: '10px', color: 'var(--av-cream-600)', letterSpacing: '0.1em' }}>SC {String(s.num).padStart(2, '0')}</span>
                                <span style={{ fontSize: '13px', color: 'var(--av-cream-200)', fontWeight: 500 }}>{s.title}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '10px', color: 'var(--av-cream-500)' }}>{s.location}</span>
                                <span style={{
                                    fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
                                    background: 'rgba(232,165,16,0.1)', color: 'var(--av-amber-400)',
                                    border: '1px solid rgba(232,165,16,0.2)',
                                }}>{s.tone}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            step: '03',
            title: 'Export & Produce',
            description: 'Download your blueprint as a professional PDF, view on the scene board, or generate AI keyframes per scene.',
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--av-amber-400)" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
            ),
            preview: (
                <div style={{ display: 'flex', gap: '12px' }}>
                    {['PDF Blueprint', 'Scene Board', 'AI Keyframes'].map(label => (
                        <div key={label} style={{
                            flex: 1, padding: '20px 12px', textAlign: 'center',
                            background: 'var(--av-bg-base)', borderRadius: '10px',
                            border: '1px solid var(--av-neutral-800)',
                        }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '8px',
                                background: 'rgba(232,165,16,0.08)', border: '1px solid rgba(232,165,16,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 10px',
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--av-amber-400)" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--av-cream-300)', fontWeight: 600, fontFamily: 'var(--av-font-display)' }}>{label}</span>
                        </div>
                    ))}
                </div>
            ),
        },
    ];

    return (
        <section className="landing-section" style={{ background: 'var(--av-bg-raised)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '72px' }}>
                    <div className="section-eyebrow" style={{ justifyContent: 'center' }}>How It Works</div>
                    <h2 style={{
                        fontFamily: 'var(--av-font-display)', fontSize: '36px',
                        color: 'var(--av-cream-100)', maxWidth: '600px', margin: '0 auto',
                    }}>
                        Three steps from <span className="amber">idea to production.</span>
                    </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    {steps.map((s, i) => (
                        <div key={s.step} style={{
                            display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '56px',
                            alignItems: 'center',
                            direction: i % 2 === 1 ? 'rtl' : 'ltr',
                        }}>
                            <div style={{ direction: 'ltr' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '12px',
                                        background: 'rgba(232,165,16,0.06)', border: '1px solid rgba(232,165,16,0.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>{s.icon}</div>
                                    <span style={{
                                        fontFamily: 'var(--av-font-display)', fontSize: '12px', fontWeight: 700,
                                        letterSpacing: '0.15em', color: 'var(--av-amber-400)',
                                    }}>STEP {s.step}</span>
                                </div>
                                <h3 style={{
                                    fontFamily: 'var(--av-font-display)', fontSize: '26px',
                                    color: 'var(--av-cream-100)', marginBottom: '12px',
                                }}>{s.title}</h3>
                                <p style={{ color: 'var(--av-cream-500)', fontSize: '15px', lineHeight: 1.7, maxWidth: '400px' }}>
                                    {s.description}
                                </p>
                            </div>
                            <div style={{
                                direction: 'ltr',
                                background: 'var(--av-bg-raised)', borderRadius: '16px',
                                border: '1px solid var(--av-neutral-800)', padding: '20px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                            }}>
                                {s.preview}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShowcaseSection;
