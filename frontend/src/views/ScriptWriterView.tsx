import React, { useState, useRef, useEffect } from 'react';
import { projectApi, getToken, getApiBaseUrl } from '../services/api';

interface ScriptWriterViewProps {
    onBack: () => void;
    userId: number;
}

const STAGE_LABELS: Record<string, { label: string; description: string }> = {
    concept_development: { label: 'Concept Development', description: 'Developing story concept, characters, and narrative arc...' },
    outline: { label: 'Scene Outline', description: 'Creating detailed scene-by-scene outline...' },
    script_writing: { label: 'Writing Screenplay', description: 'Writing the full screenplay in industry format...' },
    polish: { label: 'Final Polish', description: 'Refining dialogue, pacing, and transitions...' },
};

const FORMAT_OPTIONS = [
    { value: 'short', label: 'Short Film', pages: '10–20 pages', icon: '🎬' },
    { value: 'feature', label: 'Feature Film', pages: '90–120 pages', icon: '🎥' },
    { value: 'pilot', label: 'TV Pilot', pages: '30–60 pages', icon: '📺' },
    { value: 'webisode', label: 'Web Series', pages: '5–10 pages', icon: '💻' },
];

const ScriptWriterView: React.FC<ScriptWriterViewProps> = ({ onBack, userId }) => {
    const [idea, setIdea] = useState('');
    const [format, setFormat] = useState('short');
    const [phase, setPhase] = useState<'input' | 'generating' | 'result'>('input');
    const [currentStage, setCurrentStage] = useState('');
    const [stageNumber, setStageNumber] = useState(0);
    const [error, setError] = useState('');
    const [generatedScript, setGeneratedScript] = useState<any>(null);
    const [outline, setOutline] = useState<any>(null);
    const [projectId, setProjectId] = useState<number | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, []);

    const handleGenerate = async () => {
        if (!idea.trim()) return;
        setError('');
        setPhase('generating');
        setCurrentStage('concept_development');
        setStageNumber(0);

        try {
            // Create a project for this script generation
            const projRes = await projectApi.createProject({
                title: `Script: ${idea.substring(0, 50)}...`,
                content_type: 'film',
                language: 'en',
            });
            const pid = projRes.data.id;
            setProjectId(pid);

            // Save the idea
            await projectApi.generateScript(pid, idea, format);

            // Connect to SSE stream
            const token = getToken();
            const baseUrl = getApiBaseUrl();
            const url = `${baseUrl}/ai-pipeline/projects/${pid}/stream-script?format=${format}&token=${token}`;
            const es = new EventSource(url);
            eventSourceRef.current = es;

            es.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.current_stage) {
                        setCurrentStage(data.current_stage);
                    }
                    if (data.stage_number) {
                        setStageNumber(data.stage_number);
                    }
                    if (data.outline) {
                        setOutline(data.outline);
                    }

                    if (data.status === 'complete' && data.generated_script) {
                        setGeneratedScript(data.generated_script);
                        setPhase('result');
                        es.close();
                    } else if (data.status === 'failed') {
                        setError(data.error_message || 'Script generation failed');
                        setPhase('input');
                        es.close();
                    }
                } catch (e) {
                    console.error('SSE parse error:', e);
                }
            };

            es.onerror = () => {
                if (phase === 'generating') {
                    setError('Connection lost. Please try again.');
                    setPhase('input');
                }
                es.close();
            };
        } catch (e: any) {
            setError(e?.response?.data?.detail || 'Failed to start generation');
            setPhase('input');
        }
    };

    const handleCopyScript = () => {
        if (generatedScript?.full_script) {
            navigator.clipboard.writeText(generatedScript.full_script);
        }
    };

    const handleDownloadScript = () => {
        if (!generatedScript?.full_script) return;
        const blob = new Blob([generatedScript.full_script], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${generatedScript.title || 'screenplay'}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ── INPUT PHASE ──
    if (phase === 'input') {
        return (
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
                    <button onClick={onBack} style={{
                        background: 'transparent', border: '1px solid var(--av-neutral-700)',
                        borderRadius: '8px', padding: '8px 12px', color: 'var(--av-cream-400)',
                        cursor: 'pointer', fontSize: '12px',
                    }}>
                        ← Back
                    </button>
                    <div>
                        <h1 style={{
                            fontFamily: 'var(--av-font-display)', fontSize: '28px',
                            color: 'var(--av-cream-100)', margin: 0,
                        }}>Script Writer</h1>
                        <p style={{ color: 'var(--av-cream-500)', fontSize: '14px', margin: '4px 0 0' }}>
                            Turn any idea into a full, formatted screenplay
                        </p>
                    </div>
                </div>

                {error && (
                    <div style={{
                        padding: '14px 20px', marginBottom: '24px', borderRadius: '8px',
                        background: 'rgba(192,74,58,0.1)', border: '1px solid rgba(192,74,58,0.3)',
                        color: '#e8634a', fontSize: '13px',
                    }}>{error}</div>
                )}

                {/* Format Selection */}
                <div style={{ marginBottom: '32px' }}>
                    <label style={{
                        fontFamily: 'var(--av-font-display)', fontSize: '11px', fontWeight: 700,
                        letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--av-amber-400)',
                        display: 'block', marginBottom: '16px',
                    }}>Select Format</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                        {FORMAT_OPTIONS.map(opt => (
                            <button key={opt.value} onClick={() => setFormat(opt.value)} style={{
                                padding: '20px 16px', borderRadius: '12px', cursor: 'pointer',
                                background: format === opt.value ? 'rgba(232,165,16,0.08)' : 'var(--av-bg-raised)',
                                border: `1px solid ${format === opt.value ? 'var(--av-amber-400)' : 'var(--av-neutral-800)'}`,
                                textAlign: 'center', transition: 'all 0.2s',
                            }}>
                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{opt.icon}</div>
                                <div style={{
                                    fontFamily: 'var(--av-font-display)', fontSize: '13px', fontWeight: 600,
                                    color: format === opt.value ? 'var(--av-cream-100)' : 'var(--av-cream-300)',
                                }}>{opt.label}</div>
                                <div style={{ fontSize: '11px', color: 'var(--av-cream-600)', marginTop: '4px' }}>
                                    {opt.pages}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Idea Input */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{
                        fontFamily: 'var(--av-font-display)', fontSize: '11px', fontWeight: 700,
                        letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--av-amber-400)',
                        display: 'block', marginBottom: '12px',
                    }}>Your Idea</label>
                    <textarea
                        className="input-field"
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="Describe your movie idea, story concept, or creative vision...&#10;&#10;Example: 'A retired astronaut discovers that the AI she trained 20 years ago has been secretly sending coded messages to Earth from a distant star system. She must decide whether to reveal this to the world or keep it hidden to protect humanity from the truth.'"
                        style={{
                            height: '200px', resize: 'none', fontSize: '14px',
                            background: 'var(--av-bg-base)', lineHeight: 1.7,
                        }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--av-cream-600)' }}>
                            {idea.length > 0 ? `${idea.length} characters` : 'The more detail, the better the script'}
                        </span>
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    className="btn-primary"
                    onClick={handleGenerate}
                    disabled={!idea.trim() || idea.trim().length < 10}
                    style={{ padding: '16px 40px', fontSize: '13px', width: '100%' }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Generate Full Screenplay
                </button>
            </div>
        );
    }

    // ── GENERATING PHASE ──
    if (phase === 'generating') {
        const stageInfo = STAGE_LABELS[currentStage] || { label: 'Processing...', description: '' };
        const progress = Math.max(10, (stageNumber / 4) * 100);

        return (
            <div style={{
                maxWidth: '600px', margin: '0 auto', padding: '120px 24px',
                textAlign: 'center',
            }}>
                {/* Animated ring */}
                <div style={{
                    width: '80px', height: '80px', margin: '0 auto 32px',
                    borderRadius: '50%', border: '3px solid var(--av-neutral-800)',
                    borderTopColor: 'var(--av-amber-400)',
                    animation: 'spin 1s linear infinite',
                }} />

                <h2 style={{
                    fontFamily: 'var(--av-font-display)', fontSize: '24px',
                    color: 'var(--av-cream-100)', marginBottom: '8px',
                }}>Writing Your Screenplay</h2>

                <p style={{ color: 'var(--av-cream-500)', fontSize: '14px', marginBottom: '40px' }}>
                    {stageInfo.description}
                </p>

                {/* Progress bar */}
                <div style={{
                    width: '100%', height: '4px', borderRadius: '2px',
                    background: 'var(--av-neutral-800)', overflow: 'hidden', marginBottom: '24px',
                }}>
                    <div style={{
                        height: '100%', borderRadius: '2px',
                        background: 'linear-gradient(to right, var(--av-amber-400), var(--av-amber-600))',
                        width: `${progress}%`, transition: 'width 1s ease',
                    }} />
                </div>

                {/* Stage indicators */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                    {Object.entries(STAGE_LABELS).map(([key, val], i) => {
                        const isActive = key === currentStage;
                        const isDone = stageNumber > i + 1;
                        return (
                            <div key={key} style={{
                                flex: 1, padding: '12px 8px', borderRadius: '8px',
                                background: isActive ? 'rgba(232,165,16,0.08)' : 'var(--av-bg-raised)',
                                border: `1px solid ${isActive ? 'var(--av-amber-400)' : 'var(--av-neutral-800)'}`,
                                opacity: isDone || isActive ? 1 : 0.4,
                            }}>
                                <div style={{
                                    fontSize: '10px', fontWeight: 700, fontFamily: 'var(--av-font-display)',
                                    color: isActive ? 'var(--av-amber-400)' : isDone ? 'var(--av-cream-300)' : 'var(--av-cream-600)',
                                    letterSpacing: '0.05em',
                                }}>
                                    {isDone ? '✓' : `${i + 1}`} {val.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ── RESULT PHASE ──
    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
            {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                marginBottom: '40px', paddingBottom: '24px',
                borderBottom: '1px solid var(--av-neutral-800)',
            }}>
                <div>
                    <button onClick={onBack} style={{
                        background: 'transparent', border: 'none', color: 'var(--av-cream-500)',
                        cursor: 'pointer', fontSize: '12px', padding: 0, marginBottom: '12px',
                    }}>← Back to Dashboard</button>
                    <h1 style={{
                        fontFamily: 'var(--av-font-display)', fontSize: '28px',
                        color: 'var(--av-cream-100)', margin: 0,
                    }}>{generatedScript?.title || 'Generated Script'}</h1>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        {generatedScript?.genre && (
                            <span style={{
                                fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px',
                                background: 'rgba(232,165,16,0.08)', color: 'var(--av-amber-400)',
                                border: '1px solid rgba(232,165,16,0.2)',
                            }}>{generatedScript.genre}</span>
                        )}
                        {generatedScript?.format && (
                            <span style={{
                                fontSize: '11px', padding: '4px 12px', borderRadius: '100px',
                                background: 'var(--av-bg-raised)', color: 'var(--av-cream-400)',
                                border: '1px solid var(--av-neutral-800)',
                            }}>{generatedScript.format} • ~{generatedScript.page_count} pages</span>
                        )}
                    </div>
                    {generatedScript?.logline && (
                        <p style={{
                            color: 'var(--av-cream-400)', fontSize: '14px', fontStyle: 'italic',
                            marginTop: '12px', maxWidth: '600px', lineHeight: 1.6,
                        }}>{generatedScript.logline}</p>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-primary" onClick={handleCopyScript} style={{
                        padding: '10px 20px', fontSize: '12px',
                        background: 'transparent', border: '1px solid var(--av-neutral-700)',
                        color: 'var(--av-cream-300)',
                    }}>
                        Copy Script
                    </button>
                    <button className="btn-primary" onClick={handleDownloadScript} style={{
                        padding: '10px 20px', fontSize: '12px',
                    }}>
                        Download .txt
                    </button>
                </div>
            </div>

            {/* Two-column layout: Script + Sidebar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px' }}>
                {/* Script Content */}
                <div style={{
                    background: 'var(--av-bg-raised)', borderRadius: '12px',
                    border: '1px solid var(--av-neutral-800)', padding: '40px',
                    maxHeight: '80vh', overflowY: 'auto',
                }}>
                    <pre style={{
                        fontFamily: '"Courier New", Courier, monospace', fontSize: '13px',
                        color: 'var(--av-cream-200)', lineHeight: 1.8,
                        whiteSpace: 'pre-wrap', wordWrap: 'break-word', margin: 0,
                    }}>
                        {generatedScript?.full_script || 'No script content available.'}
                    </pre>
                </div>

                {/* Sidebar: Outline & Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Outline */}
                    {outline && (
                        <div style={{
                            background: 'var(--av-bg-raised)', borderRadius: '12px',
                            border: '1px solid var(--av-neutral-800)', padding: '24px',
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--av-font-display)', fontSize: '13px', fontWeight: 700,
                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                color: 'var(--av-amber-400)', marginBottom: '16px',
                            }}>Story Outline</h3>

                            {outline.act_structure && outline.act_structure.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {outline.act_structure.map((beat: string, i: number) => (
                                        <div key={i} style={{
                                            display: 'flex', gap: '10px', alignItems: 'flex-start',
                                        }}>
                                            <span style={{
                                                fontFamily: 'var(--av-font-display)', fontSize: '10px',
                                                fontWeight: 700, color: 'var(--av-amber-400)',
                                                minWidth: '20px', marginTop: '2px',
                                            }}>{i + 1}</span>
                                            <span style={{
                                                fontSize: '12px', color: 'var(--av-cream-400)',
                                                lineHeight: 1.6,
                                            }}>{beat}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Characters */}
                    {outline?.character_descriptions && outline.character_descriptions.length > 0 && (
                        <div style={{
                            background: 'var(--av-bg-raised)', borderRadius: '12px',
                            border: '1px solid var(--av-neutral-800)', padding: '24px',
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--av-font-display)', fontSize: '13px', fontWeight: 700,
                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                color: 'var(--av-amber-400)', marginBottom: '16px',
                            }}>Characters</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {outline.character_descriptions.map((char: any, i: number) => (
                                    <div key={i} style={{
                                        padding: '12px', borderRadius: '8px',
                                        background: 'var(--av-bg-base)', border: '1px solid var(--av-neutral-800)',
                                    }}>
                                        <div style={{
                                            fontFamily: 'var(--av-font-display)', fontSize: '13px',
                                            fontWeight: 600, color: 'var(--av-cream-100)', marginBottom: '4px',
                                        }}>{char.name}</div>
                                        <div style={{
                                            fontSize: '10px', color: 'var(--av-amber-400)',
                                            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px',
                                        }}>{char.role}</div>
                                        <div style={{
                                            fontSize: '12px', color: 'var(--av-cream-500)', lineHeight: 1.5,
                                        }}>{char.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{
                        background: 'var(--av-bg-raised)', borderRadius: '12px',
                        border: '1px solid var(--av-neutral-800)', padding: '24px',
                    }}>
                        <h3 style={{
                            fontFamily: 'var(--av-font-display)', fontSize: '13px', fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: 'var(--av-amber-400)', marginBottom: '16px',
                        }}>Next Steps</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button className="btn-primary" onClick={() => { setPhase('input'); setGeneratedScript(null); }} style={{
                                width: '100%', padding: '12px', fontSize: '12px',
                                background: 'transparent', border: '1px solid var(--av-neutral-700)',
                                color: 'var(--av-cream-300)',
                            }}>
                                Generate Another Script
                            </button>
                            <button className="btn-primary" onClick={handleDownloadScript} style={{
                                width: '100%', padding: '12px', fontSize: '12px',
                            }}>
                                Download Screenplay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScriptWriterView;
