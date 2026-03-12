import React, { useState, useEffect } from 'react';
import LogoIris from '../components/LogoIris';

interface UserProfile {
    name: string;
    email: string;
    [key: string]: any;
}

interface SettingsViewProps {
    userProfile: UserProfile;
    onBack: () => void;
    onUpdateProfile: (data: Partial<UserProfile> & Record<string, any>) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ userProfile, onBack, onUpdateProfile }) => {
    const [activeTab, setActiveTab] = useState('account');
    const [hasChanges, setHasChanges] = useState(false);
    const [formData, setFormData] = useState({
        firstName: userProfile?.name?.split(' ')[0] || 'Adaeze',
        lastName: userProfile?.name?.split(' ')[1] || 'Okonkwo',
        email: userProfile?.email || 'adaeze@studiocraft.ng',
        workspace: 'StudioCraft NG',
        creatorType: 'Filmmaker / Director',
        autoGenKeyframes: false,
        saveRawOutput: true,
        maxScenes: 8,
        scriptFormat: 'Screenplay',
        language: 'English',
        pipelineTimeout: '120 seconds'
    });

    const handleInputChange = (field: string, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleSave = () => {
        const fullName = `${formData.firstName} ${formData.lastName}`;
        onUpdateProfile({ ...formData, name: fullName });
        setHasChanges(false);
    };

    const handleDiscard = () => {
        setFormData({
            firstName: userProfile?.name?.split(' ')[0] || 'Adaeze',
            lastName: userProfile?.name?.split(' ')[1] || 'Okonkwo',
            email: userProfile?.email || 'adaeze@studiocraft.ng',
            workspace: 'StudioCraft NG',
            creatorType: 'Filmmaker / Director',
            autoGenKeyframes: false,
            saveRawOutput: true,
            maxScenes: 8,
            scriptFormat: 'Screenplay',
            language: 'English',
            pipelineTimeout: '120 seconds'
        });
        setHasChanges(false);
    };

    const scrollTo = (id: string) => {
        setActiveTab(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    // Sync active tab with scroll position
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['account', 'ai-pipeline', 'billing', 'notifications'];
            let current = sections[0];
            for (const id of sections) {
                const el = document.getElementById(id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 150) {
                        current = id;
                    }
                }
            }
            setActiveTab(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="settings-view-root">
            {/* Sidebar Navigation */}
            <aside className="settings-sidebar">
                <div className="nav-logo">
                    <LogoIris size={22} showText={true} />
                </div>

                <div className="nav-section-label">Settings</div>

                <div className={`nav-item ${activeTab === 'account' ? 'active' : ''}`} onClick={() => scrollTo('account')}>
                    <svg className="nav-icon" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M2.5 13c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <span className="nav-label">Account & Profile</span>
                </div>
                <div className={`nav-item ${activeTab === 'ai-pipeline' ? 'active' : ''}`} onClick={() => scrollTo('ai-pipeline')}>
                    <svg className="nav-icon" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4h3M7 4h7M2 8h7M11 8h3M2 12h4M8 12h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        <circle cx="5.5" cy="4" r="1.5" fill="currentColor" />
                        <circle cx="9.5" cy="8" r="1.5" fill="currentColor" />
                        <circle cx="7" cy="12" r="1.5" fill="currentColor" />
                    </svg>
                    <span className="nav-label">AI & Pipeline</span>
                </div>
                <div className={`nav-item ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => scrollTo('billing')}>
                    <svg className="nav-icon" viewBox="0 0 16 16" fill="none">
                        <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M1.5 7h13" stroke="currentColor" strokeWidth="1.2" />
                        <rect x="3.5" y="9.5" width="3" height="1.5" rx="0.5" fill="currentColor" />
                    </svg>
                    <span className="nav-label">Billing & Usage</span>
                </div>
                <div className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => scrollTo('notifications')}>
                    <svg className="nav-icon" viewBox="0 0 16 16" fill="none">
                        <path d="M8 2a4.5 4.5 0 0 1 4.5 4.5c0 2.25.75 3 1.5 3.5H2c.75-.5 1.5-1.25 1.5-3.5A4.5 4.5 0 0 1 8 2Z" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M6.5 10v.5a1.5 1.5 0 0 0 3 0V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <span className="nav-label">Notifications</span>
                </div>

                <div className="nav-divider"></div>

                <div className="nav-section-label">Workspace</div>
                <div className="nav-item">
                    <svg className="nav-icon" viewBox="0 0 16 16" fill="none">
                        <rect x="1.5" y="1.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M8.5 1.5h6v6h-6v-6z" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M1.5 8.5h6v6h-6v-6z" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M8.5 8.5h6v6h-6v-6z" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                    <span className="nav-label">Team Members</span>
                </div>
                <div className="nav-item">
                    <svg className="nav-icon" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1.5L10 6h4.5L11 9l1.5 4.5L8 11l-4.5 2.5L5 9 1.5 6H6L8 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    </svg>
                    <span className="nav-label">Integrations</span>
                </div>

                <button className="nav-back-btn" onClick={onBack}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    Back to Dashboard
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="settings-main-content">
                <header className="settings-page-header">
                    <div className="page-eyebrow">Configuration</div>
                    <h1 className="page-title">Settings</h1>
                    <p className="page-sub">Manage your account, pipeline, billing, and notification preferences.</p>
                </header>

                {/* Section 1: Account */}
                <section className="settings-section" id="account">
                    <div className="section-header">
                        <div className="section-title-group">
                            <div className="section-eyebrow">01</div>
                            <h2 className="section-title">Account & Profile</h2>
                            <p className="section-desc">Personal details, workspace identity, and security.</p>
                        </div>
                    </div>

                    <div className="settings-card">
                        <div className="settings-row full-width" style={{ padding: '24px' }}>
                            <div className="row-label" style={{ marginBottom: '16px' }}>Profile Photo</div>
                            <div className="avatar-row">
                                <div className="avatar">{formData.firstName.charAt(0)}{formData.lastName.charAt(0)}</div>
                                <div className="avatar-actions">
                                    <button className="btn btn-secondary btn-sm">Upload Photo</button>
                                    <div className="avatar-hint">JPG, PNG or WebP · Max 2MB · Displays at 64×64px</div>
                                </div>
                            </div>
                        </div>

                        <div className="settings-row full-width" style={{ padding: '22px 24px' }}>
                            <div className="input-row">
                                <div className="input-group">
                                    <label className="input-label">First Name</label>
                                    <input className="input" type="text" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} placeholder="First name" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Last Name</label>
                                    <input className="input" type="text" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} placeholder="Last name" />
                                </div>
                            </div>
                        </div>

                        <div className="settings-row full-width" style={{ padding: '22px 24px' }}>
                            <div className="input-group" style={{ width: '100%' }}>
                                <label className="input-label">Email Address</label>
                                <input className="input" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="your@email.com" />
                            </div>
                        </div>
                    </div>

                    <div className="settings-card" style={{ marginTop: '3px' }}>
                        <div className="settings-row full-width" style={{ padding: '22px 24px' }}>
                            <div className="input-row">
                                <div className="input-group">
                                    <label className="input-label">Workspace Name</label>
                                    <input className="input" type="text" value={formData.workspace} onChange={(e) => handleInputChange('workspace', e.target.value)} placeholder="Your workspace" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Creator Type</label>
                                    <select className="select" style={{ width: '100%' }} value={formData.creatorType} onChange={(e) => handleInputChange('creatorType', e.target.value)}>
                                        <option>Filmmaker / Director</option>
                                        <option>Content Creator</option>
                                        <option>Marketing / Agency</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="settings-card" style={{ marginTop: '3px' }}>
                        <div className="settings-row">
                            <div className="row-label-group">
                                <div className="row-label">Password</div>
                                <div className="row-desc">Last changed 42 days ago.</div>
                            </div>
                            <button className="btn btn-secondary btn-sm">Change Password</button>
                        </div>
                        <div className="settings-row">
                            <div className="row-label-group">
                                <div className="row-label">Two-Factor Authentication</div>
                                <div className="row-desc">Add an extra layer of security to your account.</div>
                            </div>
                            <div className="toggle-wrap">
                                <label className="toggle">
                                    <input type="checkbox" />
                                    <span className="toggle-track"></span>
                                    <span className="toggle-thumb"></span>
                                </label>
                                <span className="toggle-label">Off</span>
                            </div>
                        </div>
                    </div>

                    <div className="danger-zone" style={{ marginTop: '3px' }}>
                        <div className="danger-row">
                            <div className="row-label-group">
                                <div className="row-label" style={{ color: 'var(--av-error)' }}>Delete Account</div>
                                <div className="row-desc" style={{ color: 'var(--av-error)', opacity: 0.7 }}>Permanently delete your account and all associated data. This cannot be undone.</div>
                            </div>
                            <button className="btn btn-danger btn-sm">Delete Account</button>
                        </div>
                    </div>
                </section>

                {/* Section 2: AI Pipeline */}
                <section className="settings-section" id="ai-pipeline">
                    <div className="section-header">
                        <div className="section-title-group">
                            <div className="section-eyebrow">02</div>
                            <h2 className="section-title">AI & Pipeline Config</h2>
                            <p className="section-desc">Model selection, output behaviour, and image generation settings.</p>
                        </div>
                    </div>

                    <div className="settings-card">
                        <div className="settings-row">
                            <div className="row-label-group">
                                <div className="row-label">Default Script Format</div>
                                <div className="row-desc">How Stage 2 structures your script output by default.</div>
                            </div>
                            <div className="segment-control">
                                {['Screenplay', 'Outline', 'Brief'].map(f => (
                                    <button
                                        key={f}
                                        className={`segment-btn ${formData.scriptFormat === f ? 'active' : ''}`}
                                        onClick={() => handleInputChange('scriptFormat', f)}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="settings-row">
                            <div className="row-label-group">
                                <div className="row-label">Default Language</div>
                                <div className="row-desc">Output language for structured scripts and scene labels.</div>
                            </div>
                            <select className="select" value={formData.language} onChange={(e) => handleInputChange('language', e.target.value)}>
                                <option>English</option>
                                <option>French</option>
                                <option>Spanish</option>
                                <option>Yoruba</option>
                                <option>Igbo</option>
                                <option>Pidgin English</option>
                            </select>
                        </div>
                        <div className="settings-row">
                            <div className="row-label-group">
                                <div className="row-label">Max Scenes Per Pipeline Run</div>
                                <div className="row-desc">Cap the number of scenes generated per submission. Helps control costs.</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div className="slider-wrap" style={{ width: '160px' }}>
                                    <input
                                        type="range"
                                        className="slider"
                                        min="1"
                                        max="20"
                                        value={formData.maxScenes}
                                        onChange={(e) => handleInputChange('maxScenes', parseInt(e.target.value))}
                                    />
                                    <div className="slider-labels"><span>1</span><span>20</span></div>
                                </div>
                                <div style={{ fontFamily: 'var(--av-font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--av-amber-400)', minWidth: '24px', textAlign: 'center' }}>
                                    {formData.maxScenes}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="settings-card" style={{ marginTop: '3px' }}>
                        <div className="settings-row">
                            <div className="row-label-group">
                                <div className="row-label">Auto-Generate Key Frames</div>
                                <div className="row-desc">Automatically generate key frames for all scenes after pipeline completes.</div>
                            </div>
                            <div className="toggle-wrap">
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={formData.autoGenKeyframes}
                                        onChange={(e) => handleInputChange('autoGenKeyframes', e.target.checked)}
                                    />
                                    <span className="toggle-track"></span>
                                    <span className="toggle-thumb"></span>
                                </label>
                                <span className="toggle-label">{formData.autoGenKeyframes ? 'On' : 'Off'}</span>
                            </div>
                        </div>
                        <div className="settings-row">
                            <div className="row-label-group">
                                <div className="row-label">Save Raw Pipeline Output</div>
                                <div className="row-desc">Store the raw JSON from each stage for debugging and fine-tuning later.</div>
                            </div>
                            <div className="toggle-wrap">
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={formData.saveRawOutput}
                                        onChange={(e) => handleInputChange('saveRawOutput', e.target.checked)}
                                    />
                                    <span className="toggle-track"></span>
                                    <span className="toggle-thumb"></span>
                                </label>
                                <span className="toggle-label">{formData.saveRawOutput ? 'On' : 'Off'}</span>
                            </div>
                        </div>
                        <div className="settings-row">
                            <div className="row-label-group">
                                <div className="row-label">Pipeline Timeout</div>
                                <div className="row-desc">Abort a pipeline run if it exceeds this duration. Prevents runaway costs.</div>
                            </div>
                            <select className="select" value={formData.pipelineTimeout} onChange={(e) => handleInputChange('pipelineTimeout', e.target.value)}>
                                <option>60 seconds</option>
                                <option>120 seconds</option>
                                <option>180 seconds</option>
                                <option>No limit</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Section 3: Billing */}
                <section className="settings-section" id="billing">
                    <div className="section-header">
                        <div className="section-title-group">
                            <div className="section-eyebrow">03</div>
                            <h2 className="section-title">Billing & Usage</h2>
                            <p className="section-desc">Current plan, usage limits, and invoice history.</p>
                        </div>
                    </div>

                    <div className="plan-card current">
                        <div>
                            <div className="plan-badge">✦ Current Plan</div>
                            <div className="plan-name">Creator Pro</div>
                            <div className="plan-price"><strong>$29</strong> / month · renews March 28, 2026</div>
                            <div className="plan-features">
                                <div className="plan-feature">50 pipeline runs per month</div>
                                <div className="plan-feature">250 key frame generations</div>
                                <div className="plan-feature">20 scenes per run</div>
                                <div className="plan-feature">Raw output storage</div>
                                <div className="plan-feature">Priority pipeline queue</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                            <button className="btn btn-primary btn-sm">Upgrade →</button>
                            <button className="btn btn-ghost btn-sm">View all plans</button>
                        </div>
                    </div>

                    <div className="usage-block" style={{ marginTop: '24px' }}>
                        <div className="row-label" style={{ marginBottom: '14px', color: 'var(--av-cream-300)' }}>This Month's Usage</div>
                        <div className="usage-item">
                            <div className="usage-header">
                                <div className="usage-name">Pipeline Runs</div>
                                <div className="usage-count"><strong>38</strong> / 50 used</div>
                            </div>
                            <div className="usage-bar"><div className="usage-fill warning" style={{ width: '76%' }}></div></div>
                        </div>
                        <div className="usage-item">
                            <div className="usage-header">
                                <div className="usage-name">Key Frame Generations</div>
                                <div className="usage-count"><strong>184</strong> / 250 used</div>
                            </div>
                            <div className="usage-bar"><div className="usage-fill" style={{ width: '73.6%' }}></div></div>
                        </div>
                    </div>
                </section>

                {/* Section 4: Notifications */}
                <section className="settings-section" id="notifications" style={{ marginBottom: '120px' }}>
                    <div className="section-header">
                        <div className="section-title-group">
                            <div className="section-eyebrow">04</div>
                            <h2 className="section-title">Notifications</h2>
                            <p className="section-desc">Choose what you hear about and how.</p>
                        </div>
                    </div>

                    <div className="notif-header-row" style={{ paddingBottom: '6px' }}>
                        <div></div>
                        <div className="notif-channel-label">Email</div>
                        <div className="notif-channel-label">In-App</div>
                        <div className="notif-channel-label">Push</div>
                    </div>

                    <div className="notif-group">
                        <div className="notif-group-header">Pipeline & Processing</div>
                        <div className="notif-row">
                            <div>
                                <div className="notif-label">Pipeline Complete</div>
                                <div className="notif-desc">When a full pipeline run finishes successfully.</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-track"></span><span className="toggle-thumb"></span></label>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-track"></span><span className="toggle-thumb"></span></label>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <label className="toggle"><input type="checkbox" /><span className="toggle-track"></span><span className="toggle-thumb"></span></label>
                            </div>
                        </div>
                        <div className="notif-row">
                            <div>
                                <div className="notif-label">Pipeline Failed</div>
                                <div className="notif-desc">When a run fails at any stage with an error.</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-track"></span><span className="toggle-thumb"></span></label>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-track"></span><span className="toggle-thumb"></span></label>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-track"></span><span className="toggle-thumb"></span></label>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Floating Save Bar */}
            <div className={`save-bar ${hasChanges ? 'visible' : ''}`}>
                <div className="save-bar-msg">Unsaved changes</div>
                <div className="save-bar-actions">
                    <button className="btn btn-secondary" onClick={handleDiscard}>Discard</button>
                    <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;