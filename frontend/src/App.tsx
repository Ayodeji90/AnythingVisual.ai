import { useState } from 'react'
import { projectApi } from './services/api'
import Layout from './components/Layout'
import LogoIris from './components/LogoIris'
import HeroSection from './components/sections/HeroSection'
import ProblemSection from './components/sections/ProblemSection'
import ShowcaseSection from './components/sections/ShowcaseSection'
import ModulesSection from './components/sections/ModulesSection'
import SocialProofSection from './components/sections/SocialProofSection'
import Footer from './components/sections/Footer'
import IrisLoader from './components/IrisLoader'
import AuthPage from './views/AuthPage'
import DashboardView from './views/DashboardView'
import InputStudioView from './views/InputStudioView'
import SceneBoardView from './views/SceneBoardView'
import SceneDetailView from './views/SceneDetailView'
import SettingsView from './views/SettingsView'
import ProcessingOverlay from './components/ProcessingOverlay'
import './index.css'

interface Project {
  id: number;
  title: string;
  content_type: string;
}

interface Blueprint {
  id: number;
  logline: string;
  synopsis: string;
  status: string;
  scenes: any[];
}

function App() {
  const [view, setView] = useState<'home' | 'board' | 'auth' | 'dashboard' | 'input-studio' | 'scene-detail' | 'settings'>('home')
  const [userProfile, setUserProfile] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [currentBlueprint, setCurrentBlueprint] = useState<Blueprint | null>(null)
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null)
  const [scriptText, setScriptText] = useState('')
  const [loading, setLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAnalyze = async () => {
    if (!scriptText.trim()) return
    setLoading(true)
    try {
      const projectRes = await projectApi.createProject({
        title: "New Project " + new Date().toLocaleTimeString(),
        content_type: "film",
        language: "en"
      })
      const project = projectRes.data
      setCurrentProject(project)
      setProjects(prev => [project, ...prev])

      const blueprintRes = await projectApi.analyzeScript(project.id, scriptText)
      setCurrentBlueprint(blueprintRes.data)
      setIsProcessing(false)
      setView('board')
      window.scrollTo(0, 0)
    } catch (error) {
      console.error("Analysis failed:", error)
      alert("Analysis failed. Make sure your backend is running and OpenAI API key is set.")
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    if (!currentBlueprint?.scenes) return;
    const headers = ["Scene #", "Slug", "INT/EXT", "Location", "Day/Night", "Description"];
    const rows = currentBlueprint.scenes.map(s => [
      s.scene_number,
      s.slug,
      s.int_ext,
      s.location,
      s.day_night,
      s.description
    ]);
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
    rows.forEach(row => { csvContent += row.join(",") + "\n"; });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${currentProject?.title || 'blueprint'}_breakdown.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Layout>
      {view === 'home' && (
        <nav className="container" style={{
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(10, 9, 7, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--av-neutral-800)'
        }}>
          <div onClick={() => setView('home')} style={{ cursor: 'pointer' }}>
            <LogoIris size={28} showText={true} />
          </div>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="#features" className="footer-link" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Features</a>
            <a href="#demo" className="footer-link" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Demo</a>
            <button
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '10px' }}
              onClick={() => {
                if (userProfile) {
                  setView('dashboard');
                } else {
                  setView('auth');
                }
              }}
            >
              {userProfile ? 'Dashboard' : 'Start Free'}
            </button>
          </div>
        </nav>
      )}

      <main style={{ paddingTop: view === 'home' ? '80px' : '0' }}>
        {isProcessing && (
          <ProcessingOverlay steps={[
            "Parsing Structure",
            "Detecting Scenes",
            "Extracting Characters",
            "Analyzing Tone",
            "Generating Shot Intelligence",
            "Building Board"
          ]} />
        )}

        {view === 'auth' ? (
          <AuthPage
            onBack={() => setView('home')}
            onComplete={(profile) => {
              setUserProfile(profile);
              setView('dashboard');
            }}
          />
        ) : view === 'dashboard' ? (
          <DashboardView
            userProfile={userProfile}
            projects={projects}
            onLogout={() => {
              setUserProfile(null);
              setView('home');
            }}
            onNewProject={() => {
              setView('input-studio');
            }}
            onOpenSettings={() => setView('settings')}
            onOpenProject={(id) => {
              const p = projects.find(p => p.id === id);
              if (p) {
                setCurrentProject(p);
                // In a real app we'd fetch blueprint here
                setView('board');
              }
            }}
          />
        ) : view === 'input-studio' ? (
          <InputStudioView
            projectTitle={currentProject?.title || 'New Project'}
            onBack={() => setView('dashboard')}
            onAnalyze={async (text, _options) => {
              setScriptText(text);
              setIsProcessing(true);
              // Simulated delay for cinematic effect
              await new Promise(r => setTimeout(r, 6000));
              handleAnalyze();
              setIsProcessing(false);
            }}
          />
        ) : view === 'board' ? (
          <SceneBoardView
            blueprint={currentBlueprint}
            onBack={() => setView('dashboard')}
            onExport={handleExportCSV}
            onOpenScene={(id) => {
              setCurrentSceneId(id);
              setView('scene-detail');
            }}
          />
        ) : view === 'scene-detail' ? (
          <SceneDetailView
            scene={currentBlueprint?.scenes.find((s: any) => (s.id || s.scene_number.toString()) === currentSceneId)}
            projectTitle={currentProject?.title || 'Untitled Project'}
            onBack={() => setView('board')}
            onNext={() => {
              const scenes = currentBlueprint?.scenes || [];
              const index = scenes.findIndex((s: any) => (s.id || s.scene_number.toString()) === currentSceneId);
              if (index < scenes.length - 1) {
                setCurrentSceneId(scenes[index + 1].id || scenes[index + 1].scene_number.toString());
              }
            }}
            onPrev={() => {
              const scenes = currentBlueprint?.scenes || [];
              const index = scenes.findIndex((s: any) => (s.id || s.scene_number.toString()) === currentSceneId);
              if (index > 0) {
                setCurrentSceneId(scenes[index - 1].id || scenes[index - 1].scene_number.toString());
              }
            }}
            onUpdate={(_updatedScene) => {
              // Update local state simulation
            }}
          />
        ) : view === 'settings' ? (
          <SettingsView
            userProfile={userProfile}
            onBack={() => setView('dashboard')}
            onUpdateProfile={(data) => {
              setUserProfile({ ...userProfile, ...data });
            }}
          />
        ) : view === 'home' ? (
          <div>
            <HeroSection onStart={() => setView('auth')} />
            <ProblemSection />
            <div id="demo">
              <ShowcaseSection />
            </div>

            {/* Analyzer Section - The Core Experience */}
            <section id="analyzer" className="landing-section" style={{ background: 'var(--av-bg-base)' }}>
              <div className="container">
                <div className="section-eyebrow">Blueprint Engine</div>
                <div className="glass-card" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: 'var(--av-amber-400)'
                  }} />

                  <div style={{ marginBottom: '24px' }}>
                    <label className="section-eyebrow" style={{ marginBottom: '12px', fontSize: '9px' }}>
                      Analyze Creative Content
                    </label>
                    <textarea
                      className="input-field"
                      value={scriptText}
                      onChange={(e) => setScriptText(e.target.value)}
                      placeholder="Paste your rough script, screenplay fragment, or core visual idea here..."
                      style={{ height: '240px', resize: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      className="btn-primary"
                      onClick={handleAnalyze}
                      disabled={loading || !scriptText.trim()}
                    >
                      Generate AI Blueprint
                    </button>
                  </div>

                  {loading && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(10, 9, 7, 0.95)',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(8px)'
                    }}>
                      <IrisLoader text="AnythingVisual" subtext="Processing Visual Data" />
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div id="features">
              <ModulesSection />
            </div>
            <SocialProofSection />
            <Footer />
          </div>
        ) : (
          <div className="container" style={{ padding: '60px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', paddingBottom: '24px', borderBottom: '1px solid var(--av-neutral-700)' }}>
              <div>
                <div className="section-eyebrow" style={{ marginBottom: '8px' }}>Active Production Blueprint</div>
                <h1 className="display-title" style={{ fontSize: '32px' }}>{currentProject?.title}</h1>
                <p style={{ color: 'var(--av-cream-500)', fontSize: '14px', fontStyle: 'italic' }}>{currentBlueprint?.logline}</p>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn-primary" onClick={() => setView('home')} style={{ background: 'transparent', border: '1px solid var(--av-neutral-700)', color: 'var(--av-cream-300)' }}>Back to Home</button>
                <button className="btn-primary" onClick={handleExportCSV}>Export CSV</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '48px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--av-font-display)', fontSize: '18px', marginBottom: '24px', color: 'var(--av-cream-100)' }}>Scene Breakdown</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {currentBlueprint?.scenes?.length ? currentBlueprint.scenes.map((scene: any) => (
                    <div key={scene.id} className="glass-card" style={{ padding: '24px', background: 'transparent' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ fontFamily: 'var(--av-font-display)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--av-cream-500)' }}>
                          SCENE {scene.scene_number} — {scene.slug || `${scene.int_ext} ${scene.location}`}
                        </div>
                        <div style={{
                          fontSize: '9px',
                          fontFamily: 'var(--av-font-display)',
                          padding: '4px 10px',
                          background: 'var(--av-bg-base)',
                          borderRadius: '100px',
                          color: 'var(--av-amber-300)',
                          border: '1px solid var(--av-border-strong)'
                        }}>
                          {scene.day_night || 'N/A'}
                        </div>
                      </div>
                      <div style={{ color: 'var(--av-cream-400)', fontSize: '14px', lineHeight: '1.7' }}>
                        {scene.description}
                      </div>
                    </div>
                  )) : (
                    <div className="glass-card" style={{ padding: '48px', textAlign: 'center', opacity: 0.5 }}>
                      Developing scenes...
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ fontFamily: 'var(--av-font-display)', fontSize: '14px', marginBottom: '12px', color: 'var(--av-amber-400)' }}>Narrative Synopsis</h3>
                  <p style={{ color: 'var(--av-cream-400)', fontSize: '13px', lineHeight: '1.7' }}>{currentBlueprint?.synopsis}</p>
                </div>

                <div className="glass-card" style={{ padding: '24px', border: '1px dashed var(--av-border-strong)', background: 'transparent' }}>
                  <h3 style={{ fontFamily: 'var(--av-font-display)', fontSize: '14px', marginBottom: '12px', color: 'var(--av-cream-600)' }}>Enrichment Layer</h3>
                  <p style={{ color: 'var(--av-cream-600)', fontSize: '12px', lineHeight: '1.6' }}>
                    Visual intelligence is currently processing cinematography, lighting maps, and environmental details for these frames.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </Layout>
  )
}

export default App
