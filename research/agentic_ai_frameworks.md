# Agentic AI Frameworks Research — AnythingVisual.ai

> **Purpose**: Evaluate how **LangChain**, **LangGraph**, and **CrewAI** can replace or enhance the current hand-rolled AI pipeline, and explore the broader case for **AI Agents** over simple scripting/automation wrappers.
>
> **Date**: April 2026 | **Author**: AnythingVisual.ai Engineering

---

## Table of Contents

1. [Where We Are Now — Current Architecture Audit](#1-where-we-are-now)
2. [The Problem With "Wrapper AI"](#2-the-problem-with-wrapper-ai)
3. [What Are AI Agents (And Why They Matter)](#3-what-are-ai-agents)
4. [LangChain — Deep Dive](#4-langchain)
5. [LangGraph — Deep Dive](#5-langgraph)
6. [CrewAI — Deep Dive](#6-crewai)
7. [Head-to-Head Comparison](#7-comparison)
8. [Mapping Frameworks to AnythingVisual.ai Pipeline](#8-mapping-to-our-pipeline)
9. [Concrete Migration Scenarios](#9-migration-scenarios)
10. [Risks, Trade-offs & Recommendations](#10-risks-and-recommendations)
11. [Next Steps & Experiments](#11-next-steps)

---

## 1. Where We Are Now — Current Architecture Audit <a name="1-where-we-are-now"></a>

### Current Pipeline (ai_stack/)

```
PipelineOrchestrator
├── Stage 1: InputTriager        → Classifies input (rough idea / bullet list / partial script / full screenplay)
├── Stage 2: ScriptStructurer    → Generates title, logline, synopsis, cleaned script
├── Stage 3: SceneSegmenter      → Splits script into scene objects (XML parsing)
├── Stage 4: VisualEnricher      → Enriches scenes with shot types, lighting, props (parallelized)
└── (Optional) ImageGenerator    → Keyframe generation via fal.ai

ScriptWriter (separate flow)
├── Stage 1: Concept Development → Idea → structured outline
├── Stage 2: Scene Outline       → Outline → scene-by-scene breakdown
├── Stage 3: Script Writing      → Outline → full screenplay draft
└── Stage 4: Polish              → Draft → refined final script

StoryGenerator
└── Generates 3 creative direction variants from a single idea
```

### How it works today

- **Direct OpenAI/Groq API calls** — each pipeline step is a class that takes `AsyncOpenAI`, builds messages, calls `chat.completions.create()`, parses JSON/XML output.
- **State management** — a single `PipelineState` Pydantic model is passed through stages sequentially via an async generator.
- **Error handling** — per-stage try/except with retry logic only in triage; other stages fail-fast.
- **Prompt management** — YAML files loaded via `prompt_loader`, some inline prompts in `story_hub.py`.
- **Parallelism** — only in enrichment (`asyncio.gather` over scenes). Everything else is sequential.
- **No memory** — each LLM call is stateless; no conversation history or cross-stage context sharing beyond what's manually threaded into prompts.
- **No tool use** — LLMs can't call functions, search the web, query databases, or invoke other tools.
- **No self-correction** — if the LLM returns bad output, we retry the same prompt (triage) or just fail.

### What this approach IS

This is **"wrapper AI"** — Python functions that format a prompt, call an LLM, parse the output, and pass it to the next function. It's automation scripting with AI inside. There is no reasoning, planning, delegation, or adaptation.

---

## 2. The Problem With "Wrapper AI" <a name="2-the-problem-with-wrapper-ai"></a>

| Limitation | Impact on AnythingVisual.ai |
|---|---|
| **No reasoning loop** | If the LLM produces a weak logline, there's no mechanism to self-evaluate and retry with better context. |
| **No tool use** | The AI can't look up genre conventions, reference film databases, or fetch character archetypes. |
| **No delegation** | A single LLM does triage AND structuring AND enrichment — no specialization. |
| **Rigid flow** | The pipeline is always Triage → Structure → Segment → Enrich. It can't adapt (e.g., skip triage for a full screenplay, or loop back to restructure after segmentation reveals problems). |
| **No cross-stage memory** | Stage 4 (enrichment) doesn't know what Stage 1 (triage) detected. Context is manually threaded, incomplete, and fragile. |
| **No human-in-the-loop** | The pipeline runs to completion or fails. No pause-and-ask-the-user pattern. |
| **Scaling is manual** | Adding a new pipeline step (e.g., character bible generation) means writing a new class, new prompts, new error handling, and manually wiring it into the orchestrator. |

**Bottom line**: The current approach works for a prototype but will not scale to the Stage 2–6 roadmap (budgets, scheduling, storyboards, video generation, multi-agent collaboration).

---

## 3. What Are AI Agents (And Why They Matter) <a name="3-what-are-ai-agents"></a>

### Definition

An **AI Agent** is an autonomous system that:
1. **Perceives** — takes in context (user input, tool outputs, environment state)
2. **Reasons** — decides what to do next (plan, reflect, re-plan)
3. **Acts** — executes actions (call tools, generate content, delegate to other agents)
4. **Learns** — uses feedback to improve future actions (memory, self-correction)

### Agents vs Wrappers — The Key Differences

| Aspect | Wrapper AI (what we have) | Agentic AI (what we need) |
|---|---|---|
| **Control flow** | Developer-defined, linear | Agent-decided, dynamic |
| **Error handling** | Retry same prompt | Self-correct, re-plan, ask for help |
| **Tool use** | None | Web search, DB queries, API calls, code execution |
| **Memory** | None (stateless per call) | Short-term (conversation) + long-term (project knowledge) |
| **Multi-step reasoning** | Manual chaining | Autonomous ReAct / Plan-and-Execute loops |
| **Specialization** | One LLM does everything | Multiple specialized agents collaborate |
| **Human interaction** | Run-to-completion | Can pause, ask clarifying questions, take feedback |

### Why agents matter for AnythingVisual.ai specifically

- **Creative work is iterative** — a "Director Agent" should review a scene breakdown, spot continuity issues, and send it back for revision.
- **Production planning requires tools** — budget estimation needs calculators; scheduling needs calendar logic; location scouting needs search.
- **Different expertise = different agents** — a Screenwriter agent thinks differently than a Cinematographer agent or a Producer agent.
- **Users need to collaborate with AI** — not just trigger a pipeline and wait.

---

## 4. LangChain — Deep Dive <a name="4-langchain"></a>

### What it is

LangChain is a **framework for building LLM-powered applications** with composable components: prompts, models, output parsers, chains, tools, memory, and retrievers.

### Core concepts relevant to us

| Concept | What it does | AnythingVisual.ai use |
|---|---|---|
| **ChatModels** | Unified interface to OpenAI, Groq, Anthropic, local models | Replace our `openai.AsyncOpenAI` direct calls with provider-agnostic interface |
| **Prompt Templates** | Parameterized prompts with input variables | Replace our YAML loader — more composable, supports few-shot examples |
| **Output Parsers** | Structured output via Pydantic models | Replace our manual `json.loads()` + `TriageResult(**data)` pattern |
| **Chains (LCEL)** | Composable pipelines: `prompt | model | parser` | Replace manual message construction + API call + parsing |
| **Tools** | Functions the LLM can call (search, calculate, DB query) | Enable agents to look up genre conventions, film databases, etc. |
| **Memory** | Conversation buffer, summary memory, entity memory | Cross-stage context, project-level memory |
| **Retrievers (RAG)** | Query vector stores for relevant context | Search user's uploaded scripts, reference materials |
| **Callbacks** | Hooks for logging, streaming, tracing | Replace our manual logging; integrate with LangSmith for observability |

### Example: Current triage vs LangChain triage

**Current (wrapper)**:
```python
# 15+ lines of manual message construction, API call, JSON parsing, retry logic
messages = [{"role": "system", "content": self._get_system_prompt()}, ...]
response = await self.client.chat.completions.create(model=model, messages=messages, ...)
data = json.loads(response.choices[0].message.content)
result = TriageResult(**data)
```

**LangChain equivalent**:
```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import PydanticOutputParser

parser = PydanticOutputParser(pydantic_object=TriageResult)
prompt = ChatPromptTemplate.from_messages([
    ("system", triage_system_prompt),
    ("human", "Analyze this input (Length: {length}):\n\n{text}")
])
chain = prompt | ChatOpenAI(model="gpt-4o").with_structured_output(TriageResult)
result = await chain.ainvoke({"text": raw_input, "length": len(raw_input)})
# result is already a validated TriageResult — no manual parsing
```

### What LangChain gives us

- **Provider-agnostic** — swap Groq ↔ OpenAI ↔ Anthropic without code changes
- **Structured output** — `.with_structured_output(PydanticModel)` eliminates JSON parsing boilerplate
- **Built-in retry** — `chain.with_retry(stop_after_attempt=3)` replaces our manual retry loops
- **Streaming** — native async streaming for SSE without custom generator plumbing
- **LangSmith** — production tracing, evaluation, prompt versioning (replaces our manual logging)

### What LangChain does NOT give us

- **Orchestration logic** — LangChain chains are linear. Complex branching, cycles, human-in-the-loop, and conditional routing need **LangGraph**.
- **Multi-agent coordination** — LangChain has basic agent concepts but not first-class multi-agent patterns.

### Verdict for AnythingVisual.ai

**LangChain is the foundation layer** — use it for model abstraction, structured output, tools, memory, and RAG. But don't use raw LangChain chains for the pipeline orchestration.

---

## 5. LangGraph — Deep Dive <a name="5-langgraph"></a>

### What it is

LangGraph is a **graph-based orchestration framework** built on top of LangChain. It models workflows as **stateful directed graphs** where nodes are functions (or agents) and edges define control flow — including **cycles, conditionals, and human-in-the-loop**.

### Why this is critical for us

Our current pipeline is a linear chain:
```
Triage → Structure → Segment → Enrich → Done
```

But real creative production needs:
```
Triage → Structure → Segment → [Quality Check] →
  ├─ if good → Enrich → Character Bibles → Done
  └─ if bad  → Re-Structure (with feedback) → Segment again → ...
```

LangGraph makes this trivial.

### Core concepts

| Concept | What it does | AnythingVisual.ai use |
|---|---|---|
| **StateGraph** | A graph where each node reads/writes to a shared typed state | Replace `PipelineState` — but now the graph manages transitions |
| **Nodes** | Functions that transform state (can be LLM calls, tools, or logic) | Each pipeline stage becomes a node |
| **Edges** | Define transitions — including conditional edges | "If scene count < 3, re-segment with different instructions" |
| **Conditional edges** | Route based on state | Skip enrichment if user only wants a logline |
| **Cycles** | Nodes can loop (agent → tool → agent → tool → ...) | Self-correction: enrich → QA check → re-enrich if quality is low |
| **Checkpointing** | Persist graph state to DB (Postgres, SQLite) | Resume interrupted pipelines, long-running generation |
| **Human-in-the-loop** | Pause graph, wait for user input, resume | "Here are 3 story directions — which one should I develop?" |
| **Subgraphs** | Nested graphs for modular workflows | Script generation as a subgraph, enrichment as a subgraph |
| **Streaming** | Stream node outputs as they execute | Direct replacement for our SSE async generators |

### Example: Blueprint pipeline as a LangGraph

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Optional

class BlueprintState(TypedDict):
    project_id: str
    raw_input: str
    triage: Optional[dict]
    script: Optional[dict]
    scenes: Optional[List[dict]]
    quality_score: Optional[float]
    status: str
    error: Optional[str]

def triage_node(state: BlueprintState) -> BlueprintState:
    # LangChain chain call here
    result = triage_chain.invoke({"text": state["raw_input"]})
    return {"triage": result.dict()}

def structure_node(state: BlueprintState) -> BlueprintState:
    result = structure_chain.invoke({...})
    return {"script": result.dict()}

def segment_node(state: BlueprintState) -> BlueprintState:
    result = segment_chain.invoke({...})
    return {"scenes": result}

def quality_check(state: BlueprintState) -> str:
    """Conditional edge: decide if scenes are good enough."""
    if len(state["scenes"]) < 2:
        return "re_segment"
    return "enrich"

def enrich_node(state: BlueprintState) -> BlueprintState:
    # Parallel enrichment of all scenes
    enriched = enrich_chain.batch([...])
    return {"scenes": enriched, "status": "complete"}

# Build the graph
graph = StateGraph(BlueprintState)
graph.add_node("triage", triage_node)
graph.add_node("structure", structure_node)
graph.add_node("segment", segment_node)
graph.add_node("enrich", enrich_node)

graph.set_entry_point("triage")
graph.add_edge("triage", "structure")
graph.add_edge("structure", "segment")
graph.add_conditional_edges("segment", quality_check, {
    "re_segment": "structure",   # Loop back!
    "enrich": "enrich"
})
graph.add_edge("enrich", END)

pipeline = graph.compile(checkpointer=postgres_checkpointer)
```

### What LangGraph enables that we can't do today

1. **Self-healing pipelines** — if segmentation produces 0 scenes, automatically loop back to restructuring with adjusted instructions instead of crashing.
2. **Quality gates** — a "Continuity Checker" node reviews all scenes for character consistency before finalizing.
3. **Human-in-the-loop** — pause after story variants, let user pick one, then continue the graph.
4. **Checkpointing** — if the server crashes mid-pipeline, resume from the last completed node (not from scratch).
5. **Parallel branches** — enrich scenes AND generate character bibles simultaneously, then merge.
6. **Dynamic routing** — if input is a full screenplay, skip triage and structure, jump straight to segmentation.
7. **Subgraphs** — the ScriptWriter 4-stage flow becomes a reusable subgraph that can be plugged into any parent graph.

### Verdict for AnythingVisual.ai

**LangGraph is the strongest fit for our pipeline orchestration.** It directly solves the rigidity, error handling, and scaling problems in the current `PipelineOrchestrator`. It should be the backbone of `ai_stack/`.

---

## 6. CrewAI — Deep Dive <a name="6-crewai"></a>

### What it is

CrewAI is a **multi-agent orchestration framework** where you define **Agents** (with roles, goals, and tools) and **Tasks** (with descriptions, expected outputs, and assigned agents), then let a **Crew** coordinate them.

### Core concepts

| Concept | What it does | AnythingVisual.ai use |
|---|---|---|
| **Agent** | An AI persona with role, goal, backstory, and tools | "Screenwriter Agent", "Cinematographer Agent", "Producer Agent" |
| **Task** | A unit of work with description, expected output, agent assignment | "Break this script into scenes", "Enrich scene 3 with visual details" |
| **Crew** | Orchestrates agents and tasks (sequential or hierarchical) | The production pipeline crew |
| **Tools** | Functions agents can invoke (search, file read, API calls) | Script format validator, genre database lookup, budget calculator |
| **Process** | Sequential, hierarchical, or consensual execution | Hierarchical: "Director Agent" delegates to specialists |
| **Memory** | Short-term (within crew run), long-term (across runs), entity memory | Remember character details across pipeline runs for the same project |
| **Delegation** | Agents can delegate subtasks to other agents | Screenwriter asks Researcher to look up period-accurate dialogue |

### Example: AnythingVisual.ai as a CrewAI crew

```python
from crewai import Agent, Task, Crew, Process

# --- Agents ---
script_analyst = Agent(
    role="Script Analyst",
    goal="Classify and assess the quality of incoming creative content",
    backstory="You are a veteran script reader who has evaluated thousands of screenplays, "
              "ad briefs, and creative pitches. You can instantly identify content type, genre, "
              "structure quality, and potential.",
    tools=[genre_db_tool, format_validator_tool],
    llm="groq/llama-3.3-70b-versatile",
    verbose=True
)

screenwriter = Agent(
    role="Screenwriter",
    goal="Transform raw ideas into structured, compelling screenplays",
    backstory="You are an award-winning screenwriter specializing in structure, dialogue, "
              "and visual storytelling. You write in industry-standard format.",
    tools=[screenplay_format_tool],
    llm="openai/gpt-4o"
)

cinematographer = Agent(
    role="Cinematographer",
    goal="Design the visual language for every scene — shots, lighting, camera movement",
    backstory="You are a world-class DP who thinks in frames. You translate story beats into "
              "specific shot types, lighting setups, and visual compositions.",
    tools=[shot_reference_tool, lighting_guide_tool],
    llm="openai/gpt-4o"
)

continuity_supervisor = Agent(
    role="Continuity Supervisor",
    goal="Ensure character, prop, wardrobe, and timeline consistency across all scenes",
    backstory="You catch every continuity error. If a character has blue eyes in scene 1 "
              "and brown eyes in scene 5, you flag it immediately.",
    tools=[],
    llm="groq/llama-3.3-70b-versatile"
)

producer = Agent(
    role="Producer",
    goal="Assess production feasibility: locations, cast, budget implications",
    backstory="You turn creative visions into production plans. You think about budgets, "
              "schedules, and logistics while respecting creative intent.",
    tools=[budget_calculator_tool, location_db_tool],
    llm="openai/gpt-4o"
)

# --- Tasks ---
triage_task = Task(
    description="Analyze the following input and classify it: {raw_input}",
    expected_output="A structured classification with content type, genre, character list, and scene estimate.",
    agent=script_analyst,
    output_pydantic=TriageResult
)

structure_task = Task(
    description="Using the triage analysis, structure this into a complete screenplay blueprint "
                "with title, logline, synopsis, and cleaned script content.",
    expected_output="A structured script with title, logline, synopsis, and formatted content.",
    agent=screenwriter,
    context=[triage_task],  # Gets output of triage automatically
    output_pydantic=StructuredScript
)

segment_task = Task(
    description="Break the structured script into individual scenes with full metadata.",
    expected_output="A list of scene objects with locations, characters, tone, and visual energy.",
    agent=screenwriter,
    context=[structure_task]
)

enrich_task = Task(
    description="For each scene, design the visual approach: shot types, lighting, props, "
                "camera movement, and environment details.",
    expected_output="Enriched scenes with complete visual production metadata.",
    agent=cinematographer,
    context=[segment_task]
)

continuity_task = Task(
    description="Review ALL scenes for continuity errors: character consistency, prop tracking, "
                "timeline logic, wardrobe continuity.",
    expected_output="A continuity report with flags and suggested fixes.",
    agent=continuity_supervisor,
    context=[enrich_task]
)

# --- Crew ---
blueprint_crew = Crew(
    agents=[script_analyst, screenwriter, cinematographer, continuity_supervisor],
    tasks=[triage_task, structure_task, segment_task, enrich_task, continuity_task],
    process=Process.sequential,  # or Process.hierarchical with a manager agent
    memory=True,
    verbose=True
)

result = blueprint_crew.kickoff(inputs={"raw_input": user_script_text})
```

### What CrewAI enables

1. **Role specialization** — each agent has a distinct persona, optimized for its domain.
2. **Automatic context passing** — `context=[previous_task]` feeds outputs forward without manual wiring.
3. **Delegation** — the Screenwriter agent can ask the Script Analyst to re-check something.
4. **Built-in memory** — entities (characters, locations) are tracked across the crew run.
5. **Hierarchical process** — a "Director Agent" can manage the crew, deciding task order dynamically.
6. **Natural extensibility** — adding a "Producer Agent" for Stage 2 is just adding an agent + task.

### Limitations

- **Less control over execution graph** — CrewAI's process modes (sequential/hierarchical) are less flexible than LangGraph's arbitrary graphs with conditional edges and cycles.
- **Harder to implement complex branching** — "if quality is low, loop back" patterns are not native.
- **Checkpointing** — not as mature as LangGraph's built-in persistence.
- **Streaming** — less granular SSE streaming compared to LangGraph's node-level streaming.
- **Debugging** — agent delegation chains can be opaque; harder to trace than explicit graph nodes.

### Verdict for AnythingVisual.ai

**CrewAI is excellent for the "creative team simulation" layer** — where you want specialized agents with distinct personas collaborating on creative output. It's less suited as the core pipeline orchestrator (LangGraph is better for that), but could be used **within** LangGraph nodes for multi-agent creative tasks.

---

## 7. Head-to-Head Comparison <a name="7-comparison"></a>

| Dimension | LangChain | LangGraph | CrewAI |
|---|---|---|---|
| **Primary purpose** | LLM application building blocks | Stateful graph orchestration | Multi-agent role-based collaboration |
| **Execution model** | Linear chains (LCEL) | Directed graphs with cycles | Sequential / Hierarchical crews |
| **State management** | Manual or basic memory | First-class typed state + checkpointing | Built-in short/long-term memory |
| **Branching / Cycles** | Not native | Core feature | Limited (hierarchical delegation) |
| **Human-in-the-loop** | Not native | First-class support | Basic (via human tools) |
| **Multi-agent** | Basic (AgentExecutor) | Via separate nodes | Core design principle |
| **Tool use** | Excellent | Inherits from LangChain | Good (custom tools + LangChain tools) |
| **Streaming** | Good | Excellent (per-node) | Basic |
| **Checkpointing** | None | Postgres/SQLite/Redis | None (roll your own) |
| **Provider agnostic** | Yes (50+ providers) | Yes (via LangChain) | Yes (via LiteLLM) |
| **Observability** | LangSmith integration | LangSmith integration | Basic logging + CrewAI dashboard |
| **Learning curve** | Medium | Medium-High | Low-Medium |
| **Maturity** | Very mature | Mature (v0.2+) | Growing (v0.80+) |
| **Best for us** | Model/tool/memory layer | Pipeline orchestration | Creative agent personas |

---

## 8. Mapping Frameworks to AnythingVisual.ai Pipeline <a name="8-mapping-to-our-pipeline"></a>

### Recommended Architecture: LangChain + LangGraph (+ optional CrewAI for creative nodes)

```
┌─────────────────────────────────────────────────────────────┐
│                    LangGraph Orchestrator                     │
│                  (stateful graph, checkpointed)               │
│                                                               │
│  ┌──────────┐    ┌───────────┐    ┌────────────┐            │
│  │  Triage   │───▶│ Structure  │───▶│  Segment   │            │
│  │  (node)   │    │  (node)    │    │  (node)    │            │
│  └──────────┘    └───────────┘    └─────┬──────┘            │
│                                         │                     │
│                                  ┌──────▼──────┐             │
│                                  │ Quality Gate │             │
│                                  │ (conditional)│             │
│                                  └──┬───────┬──┘             │
│                              bad ◀──┘       └──▶ good        │
│                              │                    │           │
│                     ┌────────▼──┐          ┌──────▼────────┐ │
│                     │ Re-struct  │          │    Enrich     │ │
│                     │ (+ feedback│          │  (parallel    │ │
│                     │  loop)     │          │   CrewAI?)    │ │
│                     └───────────┘          └──────┬────────┘ │
│                                                   │           │
│                                            ┌──────▼────────┐ │
│                                            │  Continuity   │ │
│                                            │  Check (node) │ │
│                                            └──────┬────────┘ │
│                                                   │           │
│                                            ┌──────▼────────┐ │
│                                            │ Character     │ │
│                                            │ Bibles (node) │ │
│                                            └──────┬────────┘ │
│                                                   │           │
│                                                  END         │
│                                                               │
│  All nodes use LangChain for:                                │
│  - ChatModels (provider-agnostic)                            │
│  - Structured output (Pydantic)                              │
│  - Tools (search, DB, calculators)                           │
│  - Memory (project-level RAG)                                │
└─────────────────────────────────────────────────────────────┘
```

### Stage-by-stage framework mapping

| Stage | Current Implementation | Proposed Implementation |
|---|---|---|
| **Triage** | `InputTriager` — direct OpenAI call + manual retry | LangChain chain with `.with_structured_output(TriageResult).with_retry()` inside a LangGraph node |
| **Structuring** | `ScriptStructurer` — direct API call | LangChain chain with context from triage state, conditional edge to skip if input is already structured |
| **Segmentation** | `SceneSegmenter` — XML parsing | LangChain chain with `.with_structured_output(List[SceneObject])` — eliminates fragile XML parsing entirely |
| **Enrichment** | `VisualEnricher` — asyncio.gather | LangGraph `Send()` API for parallel fan-out to per-scene enrichment nodes, OR a CrewAI mini-crew with Cinematographer + Art Director agents |
| **Quality Check** | Does not exist | New LangGraph conditional node — evaluates scene quality, character consistency, completeness |
| **Character Bibles** | Does not exist | New LangGraph node — extracts characters across all scenes, generates bibles with entity memory |
| **Script Generation** | `ScriptWriter` — 4-stage sequential | LangGraph subgraph with concept → outline → write → polish, with conditional loops for quality |
| **Story Variants** | `StoryGenerator` — single LLM call | CrewAI crew: 3 agents (different creative perspectives) each propose a variant, then a "Curator Agent" picks the best 3 |

---

## 9. Concrete Migration Scenarios <a name="9-migration-scenarios"></a>

### Scenario A: Minimal — LangChain only (replace wrappers, keep linear flow)

**Effort**: Low (1–2 weeks)
**Impact**: Medium

- Replace direct `openai.AsyncOpenAI` calls with LangChain `ChatOpenAI` / `ChatGroq`
- Replace manual JSON parsing with `.with_structured_output()`
- Replace manual retry with `.with_retry()`
- Replace YAML prompt loader with LangChain `ChatPromptTemplate`
- Add LangSmith for tracing
- **Keep** the linear `PipelineOrchestrator` structure

**What you get**: Cleaner code, provider flexibility, better observability.
**What you don't get**: Self-correction, branching, human-in-the-loop, multi-agent.

### Scenario B: Recommended — LangChain + LangGraph (full pipeline rewrite)

**Effort**: Medium (3–5 weeks)
**Impact**: High

- All of Scenario A, plus:
- Rewrite `PipelineOrchestrator` as a `StateGraph`
- Add conditional edges (quality gates, dynamic routing)
- Add checkpointing (resume failed pipelines)
- Add human-in-the-loop (story variant selection)
- Add parallel fan-out (enrichment, character bibles)
- Rewrite `ScriptWriter` as a LangGraph subgraph with self-correction loops
- Add project-level memory via LangChain's `ConversationEntityMemory` or RAG

**What you get**: Robust, self-healing, resumable, extensible pipeline. Ready for Stage 2–6.
**What you don't get**: Full multi-agent creative collaboration (that's Scenario C).

### Scenario C: Full — LangChain + LangGraph + CrewAI (agentic creative platform)

**Effort**: High (6–10 weeks)
**Impact**: Very High

- All of Scenario B, plus:
- Define specialized agents (Script Analyst, Screenwriter, Cinematographer, Continuity Supervisor, Producer)
- Use CrewAI crews within specific LangGraph nodes where multi-agent collaboration adds value
- Implement hierarchical delegation (Director Agent manages the crew)
- Add tools: genre databases, shot reference libraries, budget calculators
- Implement long-term entity memory (characters persist across project sessions)

**What you get**: A true "AI production team" that collaborates, debates, and refines — the core differentiator of AnythingVisual.ai.

---

## 10. Risks, Trade-offs & Recommendations <a name="10-risks-and-recommendations"></a>

### Risks

| Risk | Mitigation |
|---|---|
| **Framework lock-in** | LangChain is the most widely adopted; LangGraph is from the same team (LangChain Inc). Risk is manageable. |
| **Latency increase** | More framework overhead per LLM call. Mitigate with caching, parallel execution, and streaming. |
| **Debugging complexity** | Multi-agent flows are harder to debug. Use LangSmith tracing extensively. |
| **Cost increase** | Self-correction loops and multi-agent debate mean more LLM calls. Budget carefully; use cheaper models (Groq/Llama) for internal agent reasoning. |
| **CrewAI maturity** | CrewAI is newer than LangChain/LangGraph. Evaluate version stability before committing. |
| **Over-engineering** | Don't add agents where a simple chain suffices. Not every node needs to be an agent. |

### Key recommendations

1. **Start with Scenario B** (LangChain + LangGraph). It solves the real architectural problems without over-engineering.
2. **Introduce CrewAI selectively** — only for nodes where multi-agent collaboration genuinely improves output quality (enrichment, story variants, continuity checking).
3. **Keep Pydantic schemas** — our existing `TriageResult`, `StructuredScript`, `SceneObject` etc. work perfectly with LangChain's structured output.
4. **Migrate incrementally** — don't rewrite everything at once. Start with one pipeline path (e.g., Blueprint generation), prove it works, then migrate ScriptWriter.
5. **Use Groq (Llama) for internal agent reasoning** and OpenAI (GPT-4o) for final user-facing output — keeps costs controlled.
6. **Invest in LangSmith from day one** — observability is critical when moving to agentic flows.

---

## 11. Next Steps & Experiments <a name="11-next-steps"></a>

### Immediate experiments (this sprint)

- [ ] **Experiment 1**: Rewrite `InputTriager` using LangChain + structured output. Compare code complexity, latency, and output quality vs current implementation.
- [ ] **Experiment 2**: Build the Blueprint pipeline as a LangGraph `StateGraph` with a quality gate after segmentation. Test self-correction loop.
- [ ] **Experiment 3**: Create a CrewAI mini-crew for scene enrichment (Cinematographer + Art Director agents). Compare output richness vs single-LLM enrichment.

### Dependencies to install

```bash
pip install langchain langchain-openai langchain-groq langchain-community
pip install langgraph
pip install crewai crewai-tools
```

### Key documentation

- LangChain: https://python.langchain.com/docs/
- LangGraph: https://langchain-ai.github.io/langgraph/
- CrewAI: https://docs.crewai.com/
- LangSmith: https://docs.smith.langchain.com/

---

## Summary

| Question | Answer |
|---|---|
| **Should we use AI agents?** | Yes. The current wrapper approach won't scale to Stages 2–6. |
| **Which framework for orchestration?** | **LangGraph** — stateful graphs with conditional edges, cycles, checkpointing, and human-in-the-loop. |
| **Which framework for model/tool layer?** | **LangChain** — provider-agnostic models, structured output, tools, memory, RAG. |
| **Which framework for multi-agent creativity?** | **CrewAI** — specialized agent personas collaborating on creative tasks. Use selectively within LangGraph nodes. |
| **Migration path?** | Start with Scenario B (LangChain + LangGraph), add CrewAI where it adds genuine value. |
| **What stays the same?** | Pydantic schemas, FastAPI backend, prompt content (repackaged as LangChain templates), SSE streaming pattern. |
| **What changes fundamentally?** | The orchestrator goes from linear Python code to a declarative stateful graph. LLM calls go from raw API wrappers to composable chains. The system gains memory, tools, self-correction, and the ability to pause for human input. |
