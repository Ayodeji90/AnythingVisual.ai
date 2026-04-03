import React from 'react';

const SocialProofSection: React.FC = () => {
    const quotes = [
        {
            name: 'Marcus Thorne',
            role: 'Independent Filmmaker',
            initials: 'MT',
            quote: 'AnythingVisual turned my 40-page script into a shooting board in 20 minutes. It\'s like having a production assistant that never sleeps.',
        },
        {
            name: 'Elena Rossi',
            role: 'Creative Director, Lumen Studios',
            initials: 'ER',
            quote: 'The scene intelligence is terrifyingly good. It caught props and continuity details I hadn\'t even consciously written into the scene.',
        },
        {
            name: 'David Chen',
            role: 'Content Creator & YouTuber',
            initials: 'DC',
            quote: 'Finally, a tool that understands how creators actually think. It doesn\'t replace the artist — it removes all the friction between idea and production.',
        },
    ];

    return (
        <section className="landing-section" style={{ background: 'var(--av-bg-raised)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <div className="section-eyebrow" style={{ justifyContent: 'center' }}>From the Community</div>
                    <h2 style={{
                        fontFamily: 'var(--av-font-display)', fontSize: '32px',
                        color: 'var(--av-cream-100)', maxWidth: '500px', margin: '0 auto',
                    }}>
                        Trusted by <span className="amber">storytellers.</span>
                    </h2>
                </div>

                <div className="landing-grid-3">
                    {quotes.map((q, i) => (
                        <div key={i} style={{
                            padding: '36px 32px',
                            background: 'var(--av-bg-base)',
                            border: '1px solid var(--av-neutral-800)',
                            borderRadius: 'var(--av-radius-lg)',
                            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                            transition: 'border-color 0.3s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--av-neutral-600)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--av-neutral-800)'}
                        >
                            {/* Quote mark */}
                            <div>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '16px', opacity: 0.2 }}>
                                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="var(--av-amber-400)" />
                                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="var(--av-amber-400)" />
                                </svg>
                                <p style={{
                                    color: 'var(--av-cream-300)', fontSize: '15px',
                                    lineHeight: '1.8', fontStyle: 'italic', marginBottom: '32px',
                                }}>
                                    {q.quote}
                                </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderTop: '1px solid var(--av-neutral-800)', paddingTop: '20px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: 'rgba(232,165,16,0.1)', border: '1px solid rgba(232,165,16,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontFamily: 'var(--av-font-display)', fontSize: '12px', fontWeight: 700,
                                    color: 'var(--av-amber-400)', letterSpacing: '0.05em',
                                }}>{q.initials}</div>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--av-cream-100)', fontSize: '14px' }}>{q.name}</div>
                                    <div style={{ color: 'var(--av-cream-500)', fontSize: '11px', marginTop: '2px' }}>{q.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Banner */}
                <div style={{
                    marginTop: '80px', padding: '48px', textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(232,165,16,0.06) 0%, rgba(201,138,0,0.02) 100%)',
                    border: '1px solid rgba(232,165,16,0.15)', borderRadius: 'var(--av-radius-xl)',
                }}>
                    <h3 style={{
                        fontFamily: 'var(--av-font-display)', fontSize: '28px',
                        color: 'var(--av-cream-100)', marginBottom: '12px',
                    }}>Ready to transform your workflow?</h3>
                    <p style={{
                        color: 'var(--av-cream-500)', fontSize: '15px', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px',
                    }}>
                        Join filmmakers, creators, and agencies who are already building with AnythingVisual.
                    </p>
                    <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '13px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                        Get Started Free
                    </button>
                </div>
            </div>
        </section>
    );
};

export default SocialProofSection;
