import React from 'react';
import LogoIris from '../LogoIris';

const Footer: React.FC = () => {
    return (
        <footer style={{ background: 'var(--av-bg-base)', borderTop: '1px solid var(--av-neutral-800)', padding: '80px 0 40px' }}>
            <div className="container">
                <div className="landing-grid-3" style={{ gridTemplateColumns: '1fr 1fr 1.5fr', marginBottom: '80px' }}>
                    <div>
                        <LogoIris size={24} showText={true} />
                        <p style={{ color: 'var(--av-cream-600)', fontSize: '13px', marginTop: '24px', maxWidth: '240px' }}>
                            The Visual Intelligence Engine for the next generation of visual storytellers.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ color: 'var(--av-cream-100)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Product</div>
                            <a href="#" className="footer-link">Features</a>
                            <a href="#" className="footer-link">Pricing</a>
                            <a href="#" className="footer-link">Roadmap</a>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ color: 'var(--av-cream-100)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Company</div>
                            <a href="#" className="footer-link">About</a>
                            <a href="#" className="footer-link">Contact</a>
                            <a href="#" className="footer-link">Legal</a>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '32px' }}>
                        <div style={{ color: 'var(--av-cream-100)', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Join the Private Beta</div>
                        <p style={{ color: 'var(--av-cream-600)', fontSize: '12px', marginBottom: '24px' }}>Be the first to build with AnythingVisual intelligence.</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="email"
                                placeholder="email@address.com"
                                className="input-field"
                                style={{ height: '44px', fontSize: '12px' }}
                            />
                            <button className="btn-primary" style={{ height: '44px', padding: '0 20px' }}>Join</button>
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '32px',
                    borderTop: '1px solid var(--av-neutral-800)'
                }}>
                    <div style={{ fontSize: '11px', color: 'var(--av-cream-600)', fontFamily: 'var(--av-font-display)' }}>
                        © 2026 ANYTHINGVISUAL.AI — ALL RIGHTS RESERVED
                    </div>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <a href="#" className="footer-link">Twitter</a>
                        <a href="#" className="footer-link">Discord</a>
                        <a href="#" className="footer-link">GitHub</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
