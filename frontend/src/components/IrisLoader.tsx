import React from 'react';

interface IrisLoaderProps {
    size?: number;
    text?: string;
    subtext?: string;
}

const IrisLoader: React.FC<IrisLoaderProps> = ({
    size = 64,
    text = "AnythingVisual",
    subtext = "Building Intelligence"
}) => {
    return (
        <div className="iris-loader-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            padding: '40px'
        }}>
            <style>{`
        @keyframes irisRotate {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes beamPulse {
          0%   { opacity: 0.3; transform: scale(0.8); }
          50%  { opacity: 1;   transform: scale(1.1); }
          100% { opacity: 0.3; transform: scale(0.8); }
        }
        @keyframes textFade {
          0%   { opacity: 0.4; }
          50%  { opacity: 1; }
          100% { opacity: 0.4; }
        }
        .iris-svg-animate {
          animation: irisRotate 4s linear infinite;
        }
        .iris-beam-animate {
          animation: beamPulse 2s ease-in-out infinite;
          transform-origin: center;
        }
        .loader-text-animate {
          animation: textFade 2s ease-in-out infinite;
        }
      `}</style>

            <div className="iris-loader" style={{ position: 'relative', width: size, height: size }}>
                <div style={{
                    position: 'absolute',
                    inset: '-20%',
                    background: 'radial-gradient(circle, rgba(232, 165, 16, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%'
                }} />
                <svg className="iris-svg-animate" width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="36" cy="36" r="33" stroke="var(--av-cream-600)" strokeWidth="0.5" opacity="0.2" />
                    <path d="M36 3 C44 18 44 54 36 69 C28 54 28 18 36 3Z" fill="var(--av-neutral-700)" stroke="var(--av-neutral-500)" strokeWidth="0.5" />
                    <path d="M69 36 C54 44 18 44 3 36 C18 28 54 28 69 36Z" fill="var(--av-neutral-800)" stroke="var(--av-neutral-600)" strokeWidth="0.5" transform="rotate(45 36 36)" />
                    <path d="M36 3 C44 18 44 54 36 69 C28 54 28 18 36 3Z" fill="var(--av-neutral-700)" stroke="var(--av-neutral-500)" strokeWidth="0.5" transform="rotate(90 36 36)" />
                    <path d="M69 36 C54 44 18 44 3 36 C18 28 54 28 69 36Z" fill="var(--av-neutral-800)" stroke="var(--av-neutral-600)" strokeWidth="0.5" transform="rotate(135 36 36)" />

                    <circle cx="36" cy="36" r="14" fill="var(--av-bg-base)" stroke="var(--av-neutral-400)" strokeWidth="1" />
                    <g className="iris-beam-animate">
                        <circle cx="36" cy="36" r="6" fill="var(--av-amber-400)" opacity="0.8" />
                        <circle cx="36" cy="36" r="3" fill="var(--av-cream-100)" />
                    </g>
                </svg>
            </div>

            <div style={{ textAlign: 'center' }}>
                <div className="loader-text-animate" style={{
                    fontFamily: 'var(--av-font-display)',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'var(--av-cream-100)',
                    letterSpacing: '0.05em'
                }}>
                    {text.split('Visual')[0]}<span style={{ color: 'var(--av-cream-600)', fontWeight: 300 }}>Visual</span>
                </div>
                <div className="loader-text-animate" style={{
                    fontSize: '10px',
                    color: 'var(--av-amber-400)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3em',
                    marginTop: '8px',
                    opacity: 0.8
                }}>
                    {subtext}
                </div>
            </div>
        </div>
    );
};

export default IrisLoader;
