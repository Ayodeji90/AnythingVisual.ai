import React from 'react';
import LogoIris from '../LogoIris';

interface LandingNavProps {
    onStart: () => void;
}

const LandingNav: React.FC<LandingNavProps> = ({ onStart }) => {
    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
            height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 48px',
            background: 'rgba(10,9,7,0.85)', backdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--av-neutral-800)',
        }}>
            <LogoIris size={20} showText={true} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <a href="#how-it-works" style={{
                    fontFamily: 'var(--av-font-display)', fontSize: '11px', fontWeight: 500,
                    letterSpacing: '0.08em', color: 'var(--av-cream-500)', textDecoration: 'none',
                    textTransform: 'uppercase', transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--av-cream-100)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--av-cream-500)'}
                >Features</a>
                <a href="#pipeline" style={{
                    fontFamily: 'var(--av-font-display)', fontSize: '11px', fontWeight: 500,
                    letterSpacing: '0.08em', color: 'var(--av-cream-500)', textDecoration: 'none',
                    textTransform: 'uppercase', transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--av-cream-100)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--av-cream-500)'}
                >Pipeline</a>
                <a href="#testimonials" style={{
                    fontFamily: 'var(--av-font-display)', fontSize: '11px', fontWeight: 500,
                    letterSpacing: '0.08em', color: 'var(--av-cream-500)', textDecoration: 'none',
                    textTransform: 'uppercase', transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--av-cream-100)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--av-cream-500)'}
                >Testimonials</a>

                <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '11px' }} onClick={onStart}>
                    Get Started
                </button>
            </div>
        </nav>
    );
};

export default LandingNav;
