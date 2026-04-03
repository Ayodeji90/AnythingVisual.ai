import React, { useState, useEffect } from 'react';
import SceneCard from '../components/SceneCard';
import './ProductionStudioView.css';

interface ProductionStudioViewProps {
    project: any;
    onBack: () => void;
    onUpdateProject: (updates: any) => void;
    onGenerateScenes: (text: string) => void;
    onGenerateVisual: (sceneId: string) => void;
    onExport?: () => void;
    isProcessing?: boolean;
    processingStage?: number;
}

const ProductionStudioView: React.FC<ProductionStudioViewProps> = ({
    project,
    onBack,
    onUpdateProject,
    onGenerateScenes,
    onGenerateVisual,
    onExport,
    isProcessing = false,
    processingStage = 0
}) => {
    const [text, setText] = useState(project?.original_input || '');
    const [activeTab, setActiveTab] = useState('scenes');
    const [storyVariants, setStoryVariants] = useState<any[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);

    const scenes = project?.blueprint?.scenes || [];

    useEffect(() => {
        if (project?.original_input && !text) {
            setText(project.original_input);
        }
        if (project?.story_variants) {
            try {
                setStoryVariants(JSON.parse(project.story_variants));
            } catch (e) { console.error("Failed to parse variants", e); }
        }
        if (project?.selected_story) {
            setSelectedVariant({ synopsis: project.selected_story });
        }
    }, [project]);

    const handleGenerateStory = async () => {
        onGenerateScenes(text);
    };

    return (
        <div className="prod-studio-container">
            {/* Top Bar */}
            <header className="prod-studio-header">
                <div className="header-left">
                    <button className="back-btn" onClick={onBack}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="project-info">
                        <div className="eyebrow">PRODUCTION WORKSPACE</div>
                        <h2 className="project-title">{project?.title || 'Untitled Production'}</h2>
                    </div>
                    <div className="scene-count-badge">
                        {scenes.length} SCENES
                    </div>
                </div>

                <div className="header-tabs">
                    {['Scenes', 'Script', 'Visuals', 'Settings'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-item ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="header-actions">
                    <button className="btn-secondary">Share</button>
                    <button className="btn-primary" onClick={onExport} disabled={!scenes.length}>Export PDF</button>
                </div>
            </header>

            <main className="prod-studio-main">
                {/* Left Panel: Story Input */}
                <section className="studio-panel story-panel">
                    <div className="panel-header">
                        <span className="panel-label">{selectedVariant ? 'SELECTED STORY' : 'STORY IDEA'}</span>
                    </div>
                    <div className="textarea-wrapper">
                        <textarea
                            className="story-textarea"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter your idea, script, or production notes here..."
                            disabled={isProcessing || !!selectedVariant}
                        />
                        {!selectedVariant && (
                            <div className="textarea-footer">
                                <span className="char-count">{text.length} characters</span>
                                <button
                                    className="sync-btn"
                                    onClick={handleGenerateStory}
                                    disabled={isProcessing || !text.trim()}
                                >
                                    {isProcessing ? 'Thinking...' : 'Generate Story Approaches'}
                                </button>
                            </div>
                        )}
                        {selectedVariant && (
                            <button className="action-link" onClick={() => {
                                setSelectedVariant(null);
                                onUpdateProject({ selected_story: null });
                            }}>Change Story Direction</button>
                        )}
                    </div>
                </section>

                {/* Right Panel: Scene Engine OR Variant Selection */}
                <section className="studio-panel scene-engine-panel">
                    {activeTab === 'scenes' && (
                        <>
                            {!selectedVariant && storyVariants.length > 0 ? (
                                <div className="variant-selection-overlay">
                                    <div className="selection-header">
                                        <h3>Choose your creative direction</h3>
                                        <p>Select the approach that best fits your vision for this production.</p>
                                    </div>
                                    <div className="variant-cards">
                                        {storyVariants.map((v, i) => (
                                            <div key={i} className="variant-card" onClick={() => {
                                                setSelectedVariant(v);
                                                onUpdateProject({ selected_story: v.synopsis });
                                            }}>
                                                <div className="v-approach">{v.approach}</div>
                                                <h4>{v.title}</h4>
                                                <p>{v.synopsis}</p>
                                                <div className="v-footer">
                                                    <span className="v-tone">{v.tone.join(', ')}</span>
                                                    <button className="v-select-btn">Select this Path</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="scene-scroll-area">
                                    {scenes.length === 0 ? (
                                        <div className="empty-engine">
                                            <div className="empty-icon">🎬</div>
                                            <h3>{selectedVariant ? 'Generating Scenes...' : 'Creative Brain Idle'}</h3>
                                            <p>{selectedVariant ? 'Converting your chosen story into structured production segments.' : 'Paste your idea on the left and generate a story first.'}</p>
                                        </div>
                                    ) : (
                                        <div className="scene-grid-studio">
                                            {scenes.map((scene: any, index: number) => (
                                                <div key={scene.id || index} className="studio-scene-wrapper">
                                                    <div className="scene-number-side">{String(index + 1).padStart(2, '0')}</div>
                                                    <SceneCard
                                                        scene={scene}
                                                        isExpanded={false}
                                                        onToggle={() => { }}
                                                        onOpenScene={() => onGenerateVisual(scene.id || index)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'script' && (
                        <div className="full-script-view">
                            <pre className="script-content">{text}</pre>
                        </div>
                    )}
                </section>
            </main>

            {/* Processing Overlay (Minimal) */}
            {isProcessing && (
                <div className="mini-processing-overlay">
                    <div className="processing-indicator">
                        <div className="spinner"></div>
                        <div className="processing-text">
                            STAGE {processingStage}: {
                                processingStage === 1 ? 'Triaging Input' :
                                    processingStage === 2 ? 'Structuring Narrative' :
                                        processingStage === 3 ? 'Segmenting Scenes' :
                                            processingStage === 4 ? 'Enriching Visuals' : 'Engine Working'
                            }...
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductionStudioView;
