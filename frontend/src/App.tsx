import { useState, useEffect, useCallback } from 'react'
import { projectApi, getToken, getSavedUser, clearAuth, getApiBaseUrl } from './services/api'
import { exportBlueprintPdf } from './services/exportPdf'
import Layout from './components/Layout'
import LogoIris from './components/LogoIris'
import HeroSection from './components/sections/HeroSection'
import ProblemSection from './components/sections/ProblemSection'
import ShowcaseSection from './components/sections/ShowcaseSection'
import ModulesSection from './components/sections/ModulesSection'
import SocialProofSection from './components/sections/SocialProofSection'
import Footer from './components/sections/Footer'
import LandingNav from './components/sections/LandingNav'
import IrisLoader from './components/IrisLoader'
import AuthPage from './views/AuthPage'
import DashboardView from './views/DashboardView'
import InputStudioView from './views/InputStudioView'
import SceneBoardView from './views/SceneBoardView'
import SceneDetailView from './views/SceneDetailView'
import SettingsView from './views/SettingsView'
import AdminDashboardView from './views/AdminDashboardView'
import ProductionStudioView from './views/ProductionStudioView'
import ScriptWriterView from './views/ScriptWriterView'
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
  const [view, setView] = useState<'home' | 'board' | 'auth' | 'dashboard' | 'input-studio' | 'scene-detail' | 'settings' | 'admin' | 'production-studio' | 'script-writer'>('home')
  const [userProfile, setUserProfile] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [currentBlueprint, setCurrentBlueprint] = useState<Blueprint | null>(null)
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null)
  const [scriptText, setScriptText] = useState('')
  const [loading, setLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStage, setProcessingStage] = useState(0)

  const handleLogout = useCallback(() => {
    clearAuth();
    setUserProfile(null);
    setProjects([]);
    setCurrentProject(null);
    setCurrentBlueprint(null);
    setView('home');
  }, []);

  // Restore session from localStorage on mount
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setView('admin');
      return;
    }
    const savedUser = getSavedUser();
    const token = getToken();
    if (savedUser && token) {
      setUserProfile(savedUser);
      setView('dashboard');
      // Fetch projects for the restored session
      projectApi.getProjects()
        .then(res => setProjects(res.data))
        .catch(() => handleLogout());
    }
  }, [handleLogout]);

  // Listen for 401 logout events from axios interceptor
  useEffect(() => {
    const onForceLogout = () => handleLogout();
    window.addEventListener('auth:logout', onForceLogout);
    return () => window.removeEventListener('auth:logout', onForceLogout);
  }, [handleLogout]);

  const fetchBlueprint = async (projectId: number): Promise<any | null> => {
    try {
      const res = await projectApi.getBlueprint(projectId);
      return res.data;
    } catch (e) {
      console.error('Failed to fetch blueprint:', e);
      return null;
    }
  };

  const runPipelineSSE = (projectId: number, targetStage?: number): Promise<{ status: string; blueprintId?: number }> => {
    return new Promise((resolve) => {
      const token = getToken();
      const stageParam = targetStage ? `&target_stage=${targetStage}` : '';
      const eventSource = new EventSource(
        `${getApiBaseUrl()}/ai-pipeline/projects/${projectId}/stream?token=${token}${stageParam}`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.current_stage) setProcessingStage(data.current_stage);

        if (data.status === 'complete' || data.status === 'failed') {
          eventSource.close();
          if (data.status === 'complete') {
            resolve({ status: 'complete', blueprintId: data.blueprint_id });
          } else {
            resolve({ status: 'failed' });
          }
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        resolve({ status: 'failed' });
      };
    });
  };

  const handleAnalyze = async () => {
    if (!scriptText.trim()) return;
    if (!userProfile) {
      setView('auth');
      return;
    }
    setLoading(true);
    setIsProcessing(true);
    setProcessingStage(1);
    try {
      // 1. Create project
      const projectRes = await projectApi.createProject({
        title: "New Project " + new Date().toLocaleTimeString(),
        content_type: "film",
        language: "en"
      });
      const project = projectRes.data;
      setCurrentProject(project);
      setProjects(prev => [project, ...prev]);

      // 2. Save input to project
      await projectApi.analyzeScript(project.id, scriptText);

      // 3. Run the full pipeline via SSE
      const result = await runPipelineSSE(project.id);

      if (result.status === 'complete') {
        // 4. Fetch the persisted blueprint from DB
        const bp = await fetchBlueprint(project.id);
        if (bp) {
          setCurrentBlueprint(bp);
          setView('board');
          window.scrollTo(0, 0);
        } else {
          alert('Pipeline completed but failed to load results.');
        }
      } else {
        alert('Analysis pipeline failed. Check your API key and try again.');
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Make sure your backend is running and API key is set.");
    } finally {
      setLoading(false);
      setIsProcessing(false);
      setProcessingStage(0);
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

  const handleExportPDF = () => {
    if (!currentBlueprint?.scenes) return;
    exportBlueprintPdf(
      currentProject?.title || 'Untitled Project',
      currentBlueprint
    );
  }

  const handleGenerateScenes = async (text: string) => {
    if (!currentProject) return;

    // If we haven't selected a story yet, we generate variants first
    const projectAny = currentProject as any;
    if (!projectAny.selected_story) {
      setIsProcessing(true);
      setProcessingStage(1);
      try {
        const res = await projectApi.generateVariants(currentProject.id, text);
        setCurrentProject({ ...currentProject, story_variants: JSON.stringify(res.data.variants) } as any);
        setProcessingStage(0);
      } catch (e) {
        console.error(e);
        alert("Variant generation failed.");
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    setIsProcessing(true);
    setProcessingStage(2);

    try {
      // Save the input
      await projectApi.analyzeScript(currentProject.id, text);

      // Run the full pipeline via SSE
      const result = await runPipelineSSE(currentProject.id);

      if (result.status === 'complete') {
        const bp = await fetchBlueprint(currentProject.id);
        if (bp) {
          setCurrentBlueprint(bp);
        } else {
          alert('Pipeline completed but failed to load results.');
        }
      } else {
        alert('Scene generation failed.');
      }
    } catch (error) {
      console.error("Failed to sync:", error);
    } finally {
      setIsProcessing(false);
      setProcessingStage(0);
    }
  };

  const handleSelectStory = async (story: string) => {
    if (!currentProject) return;
    try {
      await projectApi.selectVariant(currentProject.id, story);
      setCurrentProject({ ...currentProject, selected_story: story } as any);
      // After selection, trigger scene generation automatically
      handleGenerateScenes(story);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateVisual = async (sceneId: string) => {
    // Placeholder for per-scene visual generation
    alert("Generating visual for scene " + sceneId);
  };

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
              // Fetch user's projects after login
              projectApi.getProjects()
                .then(res => setProjects(res.data))
                .catch(err => console.error('Failed to fetch projects:', err));
              setView('dashboard');
            }}
          />
        ) : view === 'dashboard' ? (
          <DashboardView
            userProfile={userProfile}
            projects={projects}
            onLogout={handleLogout}
            onNewProject={async () => {
              // Create a blank project and go to studio
              setLoading(true);
              try {
                const res = await projectApi.createProject({
                  title: "New Production",
                  content_type: "film",
                  language: "en"
                });
                setCurrentProject(res.data);
                setCurrentBlueprint({ scenes: [] } as any);
                setView('production-studio');
              } catch (e) {
                console.error(e);
              } finally {
                setLoading(false);
              }
            }}
            onOpenSettings={() => setView('settings')}
            onOpenScriptWriter={() => setView('script-writer')}
            onOpenProject={async (id) => {
              const p = projects.find(p => p.id === id);
              if (p) {
                setCurrentProject(p);
                // Fetch the persisted blueprint if it exists
                const bp = await fetchBlueprint(p.id);
                setCurrentBlueprint(bp || { scenes: [] } as any);
                setView('production-studio');
              }
            }}
          />
        ) : view === 'production-studio' ? (
          <ProductionStudioView
            project={{ ...currentProject, blueprint: currentBlueprint }}
            onBack={() => setView('dashboard')}
            onUpdateProject={(updates) => setCurrentProject({ ...currentProject, ...updates })}
            onGenerateScenes={handleGenerateScenes}
            onGenerateVisual={handleGenerateVisual}
            onExport={handleExportPDF}
            isProcessing={isProcessing}
            processingStage={processingStage}
          />
        ) : view === 'board' ? (
          <SceneBoardView
            blueprint={currentBlueprint}
            onBack={() => setView('dashboard')}
            onExport={handleExportPDF}
            onOpenScene={(id) => {
              setCurrentSceneId(id);
              setView('scene-detail');
            }}
          />
        ) : view === 'scene-detail' ? (
          <SceneDetailView
            scene={currentBlueprint?.scenes.find((s: any) => String(s.id || s.scene_number) === currentSceneId)}
            projectTitle={currentProject?.title || 'Untitled Project'}
            onBack={() => setView('board')}
            onNext={() => {
              const scenes = currentBlueprint?.scenes || [];
              const index = scenes.findIndex((s: any) => String(s.id || s.scene_number) === currentSceneId);
              if (index < scenes.length - 1) {
                const next = scenes[index + 1];
                setCurrentSceneId(String(next.id || next.scene_number));
              }
            }}
            onPrev={() => {
              const scenes = currentBlueprint?.scenes || [];
              const index = scenes.findIndex((s: any) => String(s.id || s.scene_number) === currentSceneId);
              if (index > 0) {
                const prev = scenes[index - 1];
                setCurrentSceneId(String(prev.id || prev.scene_number));
              }
            }}
            onUpdate={(_updatedScene) => {
              // Update local state simulation
            }}
          />
        ) : view === 'script-writer' ? (
          <ScriptWriterView
            onBack={() => setView('dashboard')}
            userId={userProfile?.id}
          />
        ) : view === 'settings' ? (
          <SettingsView
            userProfile={userProfile}
            onBack={() => setView('dashboard')}
            onUpdateProfile={(data) => {
              setUserProfile({ ...userProfile, ...data });
            }}
          />
        ) : view === 'admin' ? (
          <AdminDashboardView />
        ) : view === 'home' ? (
          <div>
            <LandingNav onStart={() => setView('auth')} />
            <HeroSection onStart={() => setView('auth')} />
            <ProblemSection />
            <div id="how-it-works">
              <ShowcaseSection />
            </div>

            {/* Try It Now Section */}
            <section id="try-it" className="landing-section" style={{ background: 'var(--av-bg-base)' }}>
              <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Try It Now</div>
                  <h2 style={{
                    fontFamily: 'var(--av-font-display)', fontSize: '32px',
                    color: 'var(--av-cream-100)', marginBottom: '12px',
                  }}>Paste a script. <span className="amber">See the magic.</span></h2>
                  <p style={{ color: 'var(--av-cream-500)', fontSize: '15px', maxWidth: '500px', margin: '0 auto' }}>
                    Drop any creative text below and watch our AI pipeline transform it into a production-ready blueprint.
                  </p>
                </div>

                <div className="glass-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '3px',
                    background: 'linear-gradient(to right, var(--av-amber-400), var(--av-amber-600))',
                  }} />

                  <textarea
                    className="input-field"
                    value={scriptText}
                    onChange={(e) => setScriptText(e.target.value)}
                    placeholder="EXT. ROOFTOP — NIGHT&#10;&#10;Rain hammers the concrete. MAYA stands at the edge, looking down at the city lights bleeding through the storm...&#10;&#10;Or just describe your idea: 'A thriller about two detectives chasing a serial killer through Tokyo at night'"
                    style={{
                      height: '200px', resize: 'none', fontSize: '14px',
                      background: 'var(--av-bg-base)', lineHeight: 1.7,
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--av-cream-600)' }}>
                      {scriptText.length > 0 ? `${scriptText.length} characters` : 'Paste or type your script'}
                    </span>
                    <button
                      className="btn-primary"
                      onClick={handleAnalyze}
                      disabled={loading || !scriptText.trim()}
                      style={{ padding: '14px 32px', fontSize: '12px' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                      Generate Blueprint
                    </button>
                  </div>

                  {loading && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(10, 9, 7, 0.95)', zIndex: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backdropFilter: 'blur(8px)', borderRadius: 'var(--av-radius-lg)',
                    }}>
                      <IrisLoader text="AnythingVisual" subtext="Generating your production blueprint..." />
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div id="pipeline">
              <ModulesSection />
            </div>
            <div id="testimonials">
              <SocialProofSection />
            </div>
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
