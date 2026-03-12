import React, { useState } from 'react';

const ShowcaseSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'filmmaker' | 'creator' | 'agency'>('filmmaker');

    const workflows = {
        filmmaker: {
            title: "Script to Blueprint",
            description: "Automate the breakdown of complex screenplays into production-ready data.",
            mockupText: "EXT. DESERT - DAY\n\nMax wanders through the dunes. The heat is oppressive..."
        },
        creator: {
            title: "Idea to Structure",
            description: "Turn a rough logline into a multi-scene visual roadmap for your next video.",
            mockupText: "Idea: A futuristic cooking show set on a space station."
        },
        agency: {
            title: "Brief to Storyboard",
            description: "Convert client briefs into structured visual segments with cinematic metadata.",
            mockupText: "Brief: Launch campaign for the new AV-1 High Speed Camera."
        }
    };

    return (
        <section className="landing-section" style={{ background: 'var(--av-bg-raised)' }}>
            <div className="container">
                <div className="section-eyebrow">Product Demo</div>

                <div style={{ display: 'flex', gap: '32px', marginBottom: '48px' }}>
                    {(['filmmaker', 'creator', 'agency'] as const).map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="landing-grid-3" style={{ gridTemplateColumns: '400px 1fr', gap: '64px', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontFamily: 'var(--av-font-display)', fontSize: '24px', marginBottom: '16px', color: 'var(--av-cream-100)' }}>
                            {workflows[activeTab].title}
                        </h3>
                        <p style={{ color: 'var(--av-cream-500)', fontSize: '16px', lineHeight: '1.7', marginBottom: '32px' }}>
                            {workflows[activeTab].description}
                        </p>
                        <button className="btn-primary">Explore Workflow</button>
                    </div>

                    <div className="glass-card" style={{ padding: '0', overflow: 'hidden', height: '400px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{
                            height: '32px',
                            background: 'var(--av-bg-base)',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 16px',
                            gap: '8px',
                            borderBottom: '1px solid var(--av-neutral-800)'
                        }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }} />
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }} />
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }} />
                            <div style={{ marginLeft: '16px', fontSize: '10px', color: 'var(--av-cream-600)', fontFamily: 'var(--av-font-mono)' }}>
                                app.anythingvisual.ai
                            </div>
                        </div>
                        <div style={{ flex: 1, padding: '24px', position: 'relative' }}>
                            <div style={{ fontFamily: 'var(--av-font-mono)', fontSize: '12px', color: 'var(--av-cream-400)', opacity: 0.8 }}>
                                {workflows[activeTab].mockupText}
                            </div>

                            <div style={{
                                position: 'absolute',
                                bottom: '24px',
                                right: '24px',
                                left: '24px',
                                padding: '16px',
                                background: 'var(--av-bg-base)',
                                border: '1px solid var(--av-amber-400)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                animation: 'slideIn 0.5s ease-out'
                            }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--av-amber-400)' }} />
                                <div style={{ fontSize: '11px', color: 'var(--av-amber-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Processing Scene Intelligence...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShowcaseSection;
