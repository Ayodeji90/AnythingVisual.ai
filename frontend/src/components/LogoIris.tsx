import React from 'react';

interface LogoIrisProps {
    size?: number;
    className?: string;
    showText?: boolean;
}

const LogoIris: React.FC<LogoIrisProps> = ({ size = 72, className = "", showText = true }) => {
    return (
        <div className={`logo-iris ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer thin ring */}
                <circle cx="36" cy="36" r="33" stroke="#C8C4BC" strokeWidth="0.75" opacity="0.3" />
                {/* Four iris blades */}
                <path d="M36 3 C44 18 44 54 36 69 C28 54 28 18 36 3Z" fill="#2A2C34" stroke="#7A7880" strokeWidth="0.6" />
                <path d="M69 36 C54 44 18 44 3 36 C18 28 54 28 69 36Z" fill="#222430" stroke="#6A6870" strokeWidth="0.6" />
                <path d="M9 10 C23 24 48 50 62 62 C50 48 24 24 10 10Z" fill="#1E2028" stroke="#585C68" strokeWidth="0.6" opacity="0.8" />
                <path d="M62 10 C48 24 24 48 10 62 C24 48 48 24 62 10Z" fill="#1E2028" stroke="#585C68" strokeWidth="0.6" opacity="0.8" />
                {/* Mid ring */}
                <circle cx="36" cy="36" r="18" fill="#0C0D10" stroke="#9A9890" strokeWidth="1" />
                {/* Pupil ring */}
                <circle cx="36" cy="36" r="11" fill="#080909" stroke="#C8C4BC" strokeWidth="0.75" opacity="0.6" />
                {/* Specular highlight */}
                <circle cx="41" cy="31" r="2.5" fill="#D8D4CC" opacity="0.55" />
                <circle cx="42.5" cy="30" r="1" fill="#EDEAE3" opacity="0.7" />
                {/* Center pupil dot */}
                <circle cx="36" cy="36" r="4" fill="#E8E4DC" opacity="0.9" />
                <circle cx="36" cy="36" r="2" fill="#F5F3EF" />
            </svg>
            {showText && (
                <div style={{ fontFamily: 'var(--av-font-display)', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.01em', color: 'var(--av-cream-100)' }}>
                    Anything<span style={{ color: 'var(--av-cream-600)', fontWeight: 300 }}>Visual</span>
                </div>
            )}
        </div>
    );
};

export default LogoIris;
