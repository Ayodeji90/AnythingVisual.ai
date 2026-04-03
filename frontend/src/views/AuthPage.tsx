import React, { useState } from 'react';
import LogoIris from '../components/LogoIris';
import { authApi, setToken, saveUser } from '../services/api';

interface AuthPageProps {
    onComplete: (profile: any) => void;
    onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onComplete, onBack }) => {
    const [step, setStep] = useState(1);
    const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        intent: ''
    });
    const [emailError, setEmailError] = useState('');

    const roles = [
        { id: 'filmmaker', title: 'Filmmaker / Screenwriter', desc: 'Narrative features and shorts' },
        { id: 'creator', title: 'Content Creator', desc: 'YouTube, TikTok, and web series' },
        { id: 'agency', title: 'Marketing / Agency', desc: 'Brand ads and commercial concepts' }
    ];

    const intents = [
        { id: 'feature', label: 'Feature Film' },
        { id: 'short', label: 'Short Film' },
        { id: 'youtube', label: 'YouTube Video' },
        { id: 'ad', label: 'Brand Ad' },
        { id: 'social', label: 'Social Content' }
    ];

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const nextStep = () => {
        if (!validateEmail(formData.email)) {
            setEmailError('Please enter a valid email address');
            return;
        }
        setEmailError('');
        setStep(s => s + 1);
    };

    const prevStep = () => setStep(s => s - 1);

    const handleFinish = async () => {
        if (!validateEmail(formData.email)) {
            setEmailError('Please enter a valid email address');
            return;
        }
        setEmailError('');

        try {
            if (authMode === 'signup') {
                const res = await authApi.register({
                    email: formData.email,
                    password: formData.password,
                    full_name: formData.name,
                    role: formData.role,
                    intent: formData.intent
                });
                setToken(res.data.access_token);
                const profile = res.data.user;
                saveUser(profile);
                onComplete(profile);
            } else {
                const res = await authApi.login(formData.email, formData.password);
                setToken(res.data.access_token);
                const profile = res.data.user;
                saveUser(profile);
                onComplete(profile);
            }
        } catch (error: any) {
            console.error("Auth failed:", error);
            setEmailError(error.response?.data?.detail || "Authentication failed. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-panel-visual">
                <div className="hero-grid-bg" style={{ opacity: 0.1 }} />
                <div onClick={onBack} style={{ cursor: 'pointer', position: 'absolute', top: '40px', left: '40px' }}>
                    <LogoIris size={32} showText={true} />
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="section-eyebrow" style={{ color: 'var(--av-amber-400)' }}>
                        {authMode === 'signup' ? 'Join the Intelligence' : 'Welcome Back'}
                    </div>
                    <h2 className="display-title" style={{ fontSize: '48px', margin: '24px 0' }}>
                        {authMode === 'signup' ? 'Create with\nScene Intelligence' : 'The Lens is\nRe-opening'}
                    </h2>
                    <p style={{ color: 'var(--av-cream-500)', fontSize: '18px', maxWidth: '400px', fontWeight: 300, lineHeight: '1.6' }}>
                        The AI brain between writing and video production. Your cinematic blueprint starts here.
                    </p>
                </div>

                <div style={{ position: 'absolute', bottom: '80px', left: '80px', display: 'flex', gap: '24px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--av-neutral-500)', letterSpacing: '0.2em' }}>ENCRYPTED AUTH</div>
                    <div style={{ fontSize: '10px', color: 'var(--av-neutral-500)', letterSpacing: '0.2em' }}>PRIVATE ACCESS</div>
                </div>
            </div>

            <div className="auth-panel-form">
                <div className="auth-card">
                    {authMode === 'signup' && (
                        <div className="step-indicator">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`step-dot ${step >= i ? 'active' : ''}`} />
                            ))}
                        </div>
                    )}

                    {step === 1 ? (
                        <div>
                            <h3 style={{ fontFamily: 'var(--av-font-display)', fontSize: '24px', color: 'var(--av-cream-100)', marginBottom: '8px' }}>
                                {authMode === 'signup' ? 'Get Started' : 'Sign In'}
                            </h3>
                            <p style={{ color: 'var(--av-cream-600)', fontSize: '13px', marginBottom: '32px' }}>
                                {authMode === 'signup' ? 'Start your journey into visual intelligence.' : 'Access your cinematic blueprints.'}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {authMode === 'signup' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '10px', color: 'var(--av-cream-600)', fontWeight: 600, textTransform: 'uppercase' }}>Full Name</label>
                                        <input type="text" className="input-field" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '10px', color: 'var(--av-cream-600)', fontWeight: 600, textTransform: 'uppercase' }}>Email Address</label>
                                    <input type="email" className="input-field" placeholder="name@domain.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    {emailError && <span style={{ fontSize: '10px', color: '#FF4D4D', fontWeight: 600 }}>{emailError}</span>}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '10px', color: 'var(--av-cream-600)', fontWeight: 600, textTransform: 'uppercase' }}>Password</label>
                                    <input type="password" className="input-field" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                </div>

                                <button className="btn-primary" style={{ marginTop: '12px' }} onClick={authMode === 'signup' ? nextStep : handleFinish}>
                                    {authMode === 'signup' ? 'Continue' : 'Sign In'}
                                </button>

                                <div style={{ position: 'relative', textAlign: 'center', margin: '16px 0' }}>
                                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--av-neutral-800)' }} />
                                    <span style={{ position: 'relative', background: 'var(--av-bg-base)', padding: '0 12px', fontSize: '10px', color: 'var(--av-neutral-500)' }}>OR</span>
                                </div>

                                <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--av-neutral-700)', color: 'var(--av-cream-200)', gap: '12px' }}>
                                    <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" /><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" /><path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" /><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z" fill="#EA4335" /></svg>
                                    Continue with Google
                                </button>

                                <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--av-cream-600)', textAlign: 'center' }}>
                                    {authMode === 'signup' ? "Already have an account? " : "Don't have an account? "}
                                    <span
                                        onClick={() => {
                                            setAuthMode(authMode === 'signup' ? 'signin' : 'signup');
                                            setStep(1);
                                        }}
                                        style={{ color: 'var(--av-amber-400)', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ) : step === 2 ? (
                        <div>
                            <h3 style={{ fontFamily: 'var(--av-font-display)', fontSize: '24px', color: 'var(--av-cream-100)', marginBottom: '8px' }}>
                                I am a...
                            </h3>
                            <p style={{ color: 'var(--av-cream-600)', fontSize: '13px', marginBottom: '32px' }}>
                                Choose the role that best describes your workflow.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {roles.map(role => (
                                    <div
                                        key={role.id}
                                        className={`role-option ${formData.role === role.id ? 'selected' : ''}`}
                                        onClick={() => setFormData({ ...formData, role: role.id })}
                                    >
                                        <h5>{role.title}</h5>
                                        <p>{role.desc}</p>
                                    </div>
                                ))}

                                <button
                                    className="btn-primary"
                                    style={{ marginTop: '20px' }}
                                    disabled={!formData.role}
                                    onClick={nextStep}
                                >
                                    Continue
                                </button>
                                <button
                                    className="btn-primary"
                                    style={{ background: 'transparent', color: 'var(--av-cream-500)' }}
                                    onClick={prevStep}
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 style={{ fontFamily: 'var(--av-font-display)', fontSize: '24px', color: 'var(--av-cream-100)', marginBottom: '8px' }}>
                                What will you create first?
                            </h3>
                            <p style={{ color: 'var(--av-cream-600)', fontSize: '13px', marginBottom: '32px' }}>
                                Help us tune your first experience.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {intents.map(intent => (
                                    <div
                                        key={intent.id}
                                        className={`role-option ${formData.intent === intent.id ? 'selected' : ''}`}
                                        style={{ padding: '16px' }}
                                        onClick={() => setFormData({ ...formData, intent: intent.id })}
                                    >
                                        <h5 style={{ fontSize: '13px', fontWeight: 500 }}>{intent.label}</h5>
                                    </div>
                                ))}

                                <button
                                    className="btn-primary"
                                    style={{ marginTop: '20px' }}
                                    disabled={!formData.intent}
                                    onClick={handleFinish}
                                >
                                    Complete Onboarding
                                </button>
                                <button
                                    className="btn-primary"
                                    style={{ background: 'transparent', color: 'var(--av-cream-500)' }}
                                    onClick={prevStep}
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
