import React from 'react';

const ModulesSection: React.FC = () => {
    const modules = [
        {
            name: "Idea Structuring",
            description: "Convert messy creative thoughts into a solid narrative spine.",
            icon: "1"
        },
        {
            name: "Scene Segmentation",
            description: "Intelligently divide your script into logical production units.",
            icon: "2"
        },
        {
            name: "Scene Intelligence",
            description: "Extract deep metadata: characters, props, and setting details.",
            icon: "3"
        },
        {
            name: "Scene Board",
            description: "Visualize your entire project in a dynamic, editable board view.",
            icon: "4"
        },
        {
            name: "Key Frame Generation",
            description: "AI-powered visualization for every scene in your blueprint.",
            icon: "5"
        }
    ];

    return (
        <section className="landing-section">
            <div className="container">
                <div className="section-eyebrow">The Pipeline</div>
                <h2 style={{
                    fontFamily: 'var(--av-font-display)',
                    fontSize: '32px',
                    color: 'var(--av-cream-100)',
                    marginBottom: '64px'
                }}>
                    Five Modules. <span className="amber">One Platform.</span>
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '24px'
                }}>
                    {modules.map((m, i) => (
                        <div key={i} className="module-card">
                            <div className="icon" style={{ fontFamily: 'var(--av-font-display)', fontWeight: 700 }}>{m.icon}</div>
                            <h4 style={{ fontFamily: 'var(--av-font-display)', color: 'var(--av-cream-100)', fontSize: '16px' }}>{m.name}</h4>
                            <p style={{ color: 'var(--av-cream-500)', fontSize: '13px', lineHeight: '1.6' }}>{m.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ModulesSection;
