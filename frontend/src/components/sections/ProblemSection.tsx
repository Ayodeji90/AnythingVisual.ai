import React from 'react';

const ProblemSection: React.FC = () => {
    return (
        <section className="landing-section" style={{ background: 'var(--av-bg-base)' }}>
            <div className="container">
                <div className="section-eyebrow">The Gap</div>
                <div className="landing-grid-3">
                    <div className="problem-card">
                        <h4>Filmmaker</h4>
                        <p style={{ color: 'var(--av-cream-500)', lineHeight: '1.7' }}>
                            You write a script. You manually break it into scenes. You lose hours of creative momentum on logistics.
                        </p>
                    </div>
                    <div className="problem-card">
                        <h4>Creator</h4>
                        <p style={{ color: 'var(--av-cream-500)', lineHeight: '1.7' }}>
                            You have the idea. But no structure. You improvise, but the lack of planning shows in the final edit.
                        </p>
                    </div>
                    <div className="problem-card">
                        <h4>Agency</h4>
                        <p style={{ color: 'var(--av-cream-500)', lineHeight: '1.7' }}>
                            Client brief to concept to storyboard takes days. It should take minutes. Your pipeline is bottlenecked.
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: '80px', textAlign: 'center' }}>
                    <h2 style={{
                        fontFamily: 'var(--av-font-display)',
                        fontSize: '32px',
                        color: 'var(--av-cream-100)',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        No platform owns <span className="amber">Idea → Scene Intelligence → Visual Output</span>. Until now.
                    </h2>
                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
