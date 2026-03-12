import React, { useState, useEffect } from 'react';

interface ProcessingOverlayProps {
    steps: string[];
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ steps }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
        }, 2000);
        return () => clearInterval(interval);
    }, [steps]);

    return (
        <div className="processing-overlay">
            <div className="processing-card">
                <div className="orb-container">
                    <div className="processing-orb" />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--av-font-display)',
                        fontSize: '12px',
                        color: 'var(--av-amber-400)',
                        letterSpacing: '0.1em'
                    }}>
                        AI ENGINE
                    </div>
                </div>

                <div className="pipeline-steps">
                    {steps.map((step, index) => (
                        <div
                            key={step}
                            className={`pipeline-step ${index === currentStepIndex ? 'active' : index < currentStepIndex ? 'complete' : ''}`}
                        >
                            <div className="step-dot-small" />
                            {step}
                        </div>
                    ))}
                </div>

                <div style={{ width: '100%', height: '2px', background: 'var(--av-neutral-800)', position: 'relative' }}>
                    <div style={{
                        width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                        height: '100%',
                        background: 'var(--av-amber-400)',
                        transition: 'width 0.5s ease-out'
                    }} />
                </div>
                <div style={{ marginTop: '12px', fontSize: '9px', color: 'var(--av-cream-600)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    Estimated Time: 8-15 Seconds
                </div>
            </div>
        </div>
    );
};

export default ProcessingOverlay;
