import React, { useState, useEffect } from 'react'
import { projectApi } from './services/api'
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
  const [view, setView] = useState<'home' | 'blueprint'>('home')
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [currentBlueprint, setCurrentBlueprint] = useState<Blueprint | null>(null)
  const [scriptText, setScriptText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch projects on load (if needed)
    // projectApi.getProjects().then(res => setProjects(res.data))
  }, [])

  const handleAnalyze = async () => {
    if (!scriptText) return
    setLoading(true)
    try {
      // 1. Create a proxy project for now
      const projectRes = await projectApi.createProject({
        title: "New Project " + new Date().toLocaleTimeString(),
        content_type: "film",
        language: "en"
      })
      const project = projectRes.data
      setCurrentProject(project)

      // 2. Perform analysis
      const blueprintRes = await projectApi.analyzeScript(project.id, scriptText)
      setCurrentBlueprint(blueprintRes.data)
      setView('blueprint')
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
    rows.forEach(row => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${currentProject?.title || 'blueprint'}_breakdown.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="app-container">
      <nav style={{ padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{ fontSize: '1.5rem', fontWeight: 800, cursor: 'pointer' }}
          className="gradient-text"
          onClick={() => setView('home')}
        >
          AnythingVisual.ai
        </div>
      </nav>

      <main className="container">
        {view === 'home' ? (
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
              From Idea to <span className="gradient-text">Visual Blueprint</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
              Transform your script into a structured production blueprint in seconds.
            </p>

            <div className="glass-card" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>New Visual Project</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  placeholder="Paste your script, logline, or creative brief here..."
                  style={{
                    width: '100%',
                    height: '240px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    color: 'white',
                    padding: '1.5rem',
                    fontSize: '1.1rem',
                    resize: 'none',
                    outline: 'none'
                  }}
                />
                <button
                  className="btn-primary"
                  onClick={handleAnalyze}
                  disabled={loading || !scriptText}
                  style={{ marginTop: '1rem', padding: '1.25rem', fontSize: '1.1rem' }}
                >
                  {loading ? 'Analyzing with Visual Intelligence...' : 'Generate AI Blueprint'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <h1 className="gradient-text">{currentProject?.title}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>{currentBlueprint?.logline}</p>
              </div>
              <button className="btn-primary" onClick={handleExportCSV} style={{ height: 'fit-content' }}>Export CSV</button>
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
              <div className="glass-card" style={{ flex: 1, padding: '2rem' }}>
                <h2 style={{ marginBottom: '2rem' }}>Scene Breakdown</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {currentBlueprint?.scenes?.length ? currentBlueprint.scenes.map((scene: any) => (
                    <div key={scene.id} className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                          SCENE {scene.scene_number}: {scene.int_ext} {scene.location} - {scene.day_night}
                        </div>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        {scene.description}
                      </div>
                    </div>
                  )) : (
                    <div style={{ textAlign: 'center', opacity: 0.5 }}>No scenes generated yet.</div>
                  )}
                </div>
              </div>

              <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="glass-card" style={{ padding: '2rem' }}>
                  <h3 className="gradient-text" style={{ marginBottom: '1rem' }}>Synopsis</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{currentBlueprint?.synopsis}</p>
                </div>
                <div className="glass-card" style={{ padding: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Production Pack</h3>
                  <div style={{ opacity: 0.6, fontSize: '0.9rem' }}>
                    Visual intelligence is currently refining wardrobe, props, and camera suggestions for these scenes.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
