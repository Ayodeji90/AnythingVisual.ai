import React from 'react';
import LogoIris from '../components/LogoIris';

interface DashboardViewProps {
  userProfile: any;
  projects: any[];
  onNewProject: () => void;
  onOpenProject: (id: number) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  projects,
  onNewProject,
  onOpenProject,
  onOpenSettings,
  onLogout
}) => {
  const stats = [
    { label: 'Total Projects', value: projects.length },
    { label: 'Scenes Generated', value: projects.length * 12 },
    { label: 'Images Generated', value: projects.length * 4 },
    { label: 'Scripts Processed', value: projects.length }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = userProfile?.name || userProfile?.email?.split('@')[0] || 'Member';

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <LogoIris size={28} showText={true} />

        <nav className="sidebar-nav">
          <div className="nav-item active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </div>
          <div className="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            Projects
          </div>
          <div className="nav-item" onClick={onOpenSettings} style={{ cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Settings
          </div>

          <button
            className="btn-primary"
            style={{ marginTop: '32px', width: '100%', fontSize: '11px', padding: '12px' }}
            onClick={onNewProject}
          >
            + New Project
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '12px', color: 'var(--av-cream-100)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {displayName}
            </div>
            <div style={{ fontSize: '9px', color: 'var(--av-cream-600)' }}>
              Pro Plan <span className="plan-badge">MVP</span>
            </div>
          </div>
          <div onClick={onLogout} style={{ cursor: 'pointer', opacity: 0.5 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--av-font-display)', fontSize: '28px', color: 'var(--av-cream-100)', marginBottom: '8px' }}>
            {getGreeting()}, {displayName}.
          </h2>
          <p style={{ color: 'var(--av-cream-600)', fontSize: '15px' }}>Ready to build something cinematic?</p>
        </header>

        <section className="stats-strip">
          {stats.map(stat => (
            <div key={stat.label} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </section>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'var(--av-font-display)', fontSize: '16px', color: 'var(--av-cream-200)' }}>Recent Projects</h3>
            <div style={{ fontSize: '12px', color: 'var(--av-amber-400)', cursor: 'pointer', fontWeight: 600 }}>View All</div>
          </div>

          {projects.length > 0 ? (
            <div className="project-grid">
              {projects.map(project => (
                <div key={project.id} className="project-card" onClick={() => onOpenProject(project.id)}>
                  <div className="project-thumb">
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                      <LogoIris size={16} opacity={0.3} />
                    </div>
                  </div>
                  <div className="project-body">
                    <h4 style={{ color: 'var(--av-cream-100)', marginBottom: '4px', fontSize: '15px' }}>{project.title}</h4>
                    <p style={{ color: 'var(--av-cream-600)', fontSize: '12px' }}>
                      {project.content_type?.toUpperCase() || 'FILM'} • 12 scenes
                    </p>
                  </div>
                  <div className="project-footer">
                    <div style={{ fontSize: '10px', color: 'var(--av-cream-600)' }}>
                      Edited 2m ago
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '80px', textAlign: 'center', border: '1px dashed var(--av-neutral-700)' }}>
              <div style={{ marginBottom: '24px', opacity: 0.3 }}>
                <LogoIris size={64} />
              </div>
              <h3 style={{ color: 'var(--av-cream-100)', marginBottom: '8px' }}>Create your first project</h3>
              <p style={{ color: 'var(--av-cream-600)', fontSize: '14px', marginBottom: '32px', maxWidth: '300px', margin: '0 auto 32px' }}>
                Start from a blank script or try one of our cinematic templates to see the engine in action.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button className="btn-primary" onClick={onNewProject}>+ New Project</button>
                <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--av-neutral-700)' }}>Try Template</button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DashboardView;
