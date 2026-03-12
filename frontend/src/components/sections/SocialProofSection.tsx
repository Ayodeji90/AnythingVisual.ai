import React from 'react';

const SocialProofSection: React.FC = () => {
    const quotes = [
        {
            name: "Marcus Thorne",
            role: "Independent Filmmaker",
            quote: "AnythingVisual turned my 40-page script into a shooting board in 20 minutes. It's like having a production assistant that never sleeps."
        },
        {
            name: "Elena Rossi",
            role: "Creative Director",
            quote: "The segment intelligence is terrifyingly good. It caught props I hadn't even consciously written into the scene yet."
        },
        {
            name: "David Chen",
            role: "Content Creator",
            quote: "Finally, a tool that understands how creators actually think. It doesn't replace the artist; it removes the friction."
        }
    ];

    return (
        <section className="landing-section" style={{ background: 'var(--av-bg-raised)' }}>
            <div className="container">
                <div className="section-eyebrow">Alpha Feedback</div>
                <div className="landing-grid-3">
                    {quotes.map((q, i) => (
                        <div key={i} className="glass-card" style={{ padding: '32px' }}>
                            <p style={{
                                color: 'var(--av-cream-200)',
                                fontSize: '15px',
                                lineHeight: '1.8',
                                marginBottom: '32px',
                                fontStyle: 'italic'
                            }}>
                                "{q.quote}"
                            </p>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--av-cream-100)', fontSize: '14px' }}>{q.name}</div>
                                <div style={{ color: 'var(--av-amber-400)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
                                    {q.role}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialProofSection;
