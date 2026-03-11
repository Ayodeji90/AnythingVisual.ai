## AnythingVisual.ai — Product Description

**AnythingVisual.ai is a creator-first, AI-native visual content engine for storytellers, marketers, and creative teams worldwide.**
It turns a raw *idea, script, or creative brief* into a **structured, production-ready visual blueprint**—scene-by-scene, shot-by-shot—with character bibles, visual references, dialogue polish, and a collaborative workspace for writers, directors, producers, and brand teams.

Over time, AnythingVisual.ai adds **scene-level and campaign-level generative previews**: short, consistent "proof-of-vision" clips that help creators pitch, plan, and produce faster—without needing massive capital upfront.

### Who it's for (initial focus)

* **Indie filmmakers & storytellers** who want their scripts packaged to production standard
* **Marketers & ad agencies** turning briefs into structured visual shot lists and campaign plans
* **Educators & content creators** building visual narratives from ideas
* **Small studios & creative teams** pitching investors or sponsors with structured pitch packs

### The core promise

**From concept → blueprint → pitch → produce**, with less friction, less cost, and higher output quality.

### What makes it different

* Not a generic "text-to-video" toy
* A **visual production OS**: structured pre-production + collaboration + continuity across film, ads, and campaigns
* Built around **creator realities** — tight budgets, fast cycles, multilingual workflows, diverse content formats
* **Modular backend architecture**: designed from day one to accommodate new visual use cases (films, ads, campaigns) without rebuilding core infrastructure

---

## Stage-by-stage product roadmap

### Stage 1 — Visual Intelligence + Pre-Production Blueprint (MVP)

**Goal:** Deliver immediate value without heavy video infra. Make concept-to-blueprint "feel magical."

**Key user workflow**

1. Upload script / brief / paste idea
2. AI refines premise → logline → synopsis
3. Auto-splits into **scenes or campaign segments**
4. Generates a **visual production pack**
5. Export / share with collaborators

**Core features**

* Idea → logline, synopsis, outline (beats)
* Script / brief analysis: structure, pacing, visual opportunities, narrative flow
* **Scene breakdown**: INT/EXT, day/night, location, characters, props, wardrobe
* **Shot list suggestions** + camera notes
* Dialogue polish (keep tone/voice consistent)
* **Character / persona bibles** (traits, motivations, speech style, continuity notes)
* Collaboration: comments, version history, "director notes"
* Exports: PDF/DOCX + breakdown sheets + CSV

**Success signals**

* Users complete onboarding → generate breakdown → export/share
* Repeat use for revisions (same project revisited multiple times)
* Early willingness to pay for "visual production pack" output

---

### Stage 2 — Producer Tools (Budget, Scheduling, Packaging)

**Goal:** Turn the blueprint into something a producer or brand manager can run with.

**Core features**

* **Budget estimator** (simple first): locations count, cast/talent count, props complexity
* **Shooting / production schedule generator** (group by location/actors/day-night or campaign phase)
* Call sheets + creative briefs templates
* Casting breakdowns + audition/talent-brief sides
* Rights/credits + usage rights templates
* "Pitch Pack" generator: one-pager + synopsis + mood references + team notes

**Success signals**

* Small studios and brand teams adopt it for real planning
* Clear conversion to paid plans
* Referrals within filmmaking and marketing circles

---

### Stage 3 — Visual Development (Moodboards + Storyboards + Animatics)

**Goal:** Help creators *see* the vision before spending money on production.

**Core features**

* Style selection (genre look, camera language, color mood, brand palette)
* **Storyboard generation** (frame prompts + editable panels)
* **Animatic builder**: storyboard → timed sequence with temp audio
* Asset library: characters, wardrobe, location references (project-level)
* Brand kit support: upload logos, color palettes, font guidelines

**Success signals**

* Pitch packs win funding / sponsorship / client approvals more often (user-reported)
* Projects move faster from concept to shoot

---

### Stage 4 — Scene-Level & Campaign-Level Generative Previews (30–90 seconds, consistent)

**Goal:** Start video generation where it's actually useful and controllable: short scenes or campaign spots for pitching and planning.

**Core features**

* Generate **short scene previews or ad spot previews** (not full lengths)
* Character / product / wardrobe continuity across shots within a scene or campaign
* Voice options: temp voices, multilingual (as available), subtitles
* "Director / Creative Director controls": framing, tone, pacing, cut rhythm
* Regenerate specific shot without redoing the whole sequence

**Success signals**

* Creators use previews in pitches, client presentations, and marketing
* Paid usage scales with minutes/credits
* Quality feedback loops become the moat (data + workflows)

---

### Stage 5 — Episode / Short-Film / Campaign Assembly (5–20 minutes)

**Goal:** Controlled long-form or full-campaign output via composition: stitch scenes and segments reliably.

**Core features**

* Timeline editor (AI-assisted cuts)
* Scene / segment stitching: audio continuity, transitions, subtitles
* Consistency engine v2: character/product identity across multiple scenes
* Automated QC: continuity warnings, dialogue mismatch, pacing flags

**Success signals**

* Creators publish shorts or campaign videos using AnythingVisual.ai pipeline
* Community showcase drives acquisition

---

### Stage 6 — Feature-Length & Enterprise Campaign Pipeline (30–90 minutes)

**Goal:** The "full production" outcome through robust planning + consistent generation + assembly.

**Core features**

* Long-form memory/continuity across acts or campaign phases
* Multi-character / multi-product interaction stability
* Render orchestration at scale (queues, retries, cost controls)
* Studio & agency collaboration: roles, approvals, deliveries
* Distribution outputs: trailers, teasers, social cuts, platform-specific formats

**Success signals**

* Studios and agencies rely on AnythingVisual.ai as standard workflow
* Marketplace/partnerships become viable

---

## Product focus rules (so we don't lose the plot)

* **We don't chase full-length generation early.** We earn it via stages.
* Every stage must stand alone as a sellable product.
* Each stage adds a new "why people can't leave."
* The **backend is modular by design** — new content types (films, ads, educational videos, music videos) slot in as use-case modules without rebuilding core infrastructure.

---

## Architecture principles (modular by design)

To support a broader scope in the long term while keeping the initial build tight:

* **Use-case modules** are registered plugins on top of the core Visual Intelligence engine — a new content type (e.g., "Music Video", "Product Demo") adds a module, not a rewrite.
* **Schema-first approach**: all AI outputs are validated against JSON schemas, enabling consistent structure across film, ad, and campaign use cases.
* **Job queue architecture** (Temporal / Celery): each generation type is a job step, trivially extensible to new pipeline flows.
* **Prompt templates are namespaced**: `film/scene_breakdown`, `ad/campaign_segment` — same engine, different lenses.

---

## Stage 1 PRD — AnythingVisual.ai (MVP)

**Name:** AnythingVisual.ai — Concept → Visual Blueprint (Stage 1)
**Objective:** Turn an idea, script, or creative brief into a production-ready pre-production pack (scene list, shot suggestions, character/persona bibles, and exportable breakdowns) that creative teams can review, share, and iterate on.

**Target users:** Indie filmmakers, scriptwriters, marketers, ad agencies, film students, small studios, content creators.

**User problem:** Pre-production and visual planning is slow, inconsistent, and expensive; creators and teams need a fast, structured blueprint to pitch and start production.

**Core value proposition:** Produce a detailed, exportable visual production pack from a concept, text idea, or script in minutes, preserving creative voice and continuity while accounting for real creator realities (tight budgets, fast cycles, multilingual).

**MVP scope (must-have):**

* Upload / paste script, creative brief, or idea (text, .txt, .docx, .pdf, Fountain)
* AI: concept → logline, synopsis, outline (beats)
* Auto split into scenes / segments with metadata (INT/EXT, day/night, characters)
* Generate production pack per scene: props, basic shot list suggestions, wardrobe, continuity notes
* Character / persona bibles (traits, speech/brand style)
* Dialogue / copy polish (tone-preserving)
* Collaboration basics: comments + version history
* Export: PDF (pack) + CSV breakdown sheet + DOCX

**Out of scope (MVP):**

* Video generation or animatics (Stage 3+)
* Budget estimation / schedules (Stage 2)
* Production-grade audio/video rendering

**Success metrics (90 days):**

* Time-to-first-pack < 15 minutes (from upload to download-ready)
* % of users who export a pack on first session ≥ 20%
* Retention: > 25% of users return to edit/re-generate within 14 days
* NPS for product-market fit target: ≥ 40 from core users

**Risks & mitigations:**

* LLM hallucinations (characters/continuity errors): add structured schema with validation + human edit affordances.
* Privacy/ownership concerns: explicit provenance metadata, exportable prompt logs, project-level access controls.
* Cost: chunk and cache prompts; offer limited free credits & paid pack exports.

**Milestones:**

* Week 0–2: Data model + API skeleton + LLM prompt templates
* Week 2–6: UI for upload + single-pass generation + exports
* Week 6–10: Collaboration + versioning + polish + alpha invites

---

## MVP screens — exact fields + wireframe notes

### A. Onboarding / Project creation

* Title: "Create a Project"
* Fields: Project name, content type (Film / Ad Campaign / Short Content / Other), language, target runtime (optional), tags (genre)
* CTA: Upload script/brief / Paste idea
* Tip: Save project to DB and show an example template link

### B. Upload / Input screen

* Two tabs: Paste idea | Upload file
* File types: .txt, .docx, .pdf, .fountain, .fdx
* Option toggles:
  * "Preserve original formatting" (on/off)
  * "Tone: keep / modernise / localize"
* CTA: Analyze (primary) — shows anticipated credits consumption

### C. Generation progress

* Job steps: Ingest → Structure → Scenes/Segments → Packs → Assets (if any)
* Live log lines, progress bar, cancel button
* "View prompt & inputs" (transparency) + "Cost estimate"

### D. Blueprint results — Overview

Top area:
* Title, logline, synopsis (editable inline)
* Buttons: Export (PDF/DOCX/CSV), Share, Create Revision

Middle area: two-column layout
* Left: Scene / segment list (collapsed by default)
* Right: Selected scene detail

Bottom: Character / persona bibles, Project Notes, Revision history

### E. Scene / Segment detail panel

* Header: Scene # / slug / brief
* Fields: INT/EXT, Day/Night, Location, Characters/Personas present
* Production pack tiles: Props, Wardrobe / Brand Assets, Shot List, Dialogue / Copy Polish, Continuity Flags
* Actions: Regenerate scene, Lock scene, Comment

### F. Character / Persona bible screen

* Card per character/persona: Name, age/profile, arc notes, speech/brand style, example lines, casting hint
* Buttons: Export character sheet, Create new variant

### G. Collaboration (global)

* Inline comment threads per scene/shot/line
* @mentions, simple permissions: Owner, Editor, Viewer

### H. Exports modal

* Format pick (PDF/DOCX/CSV)
* Export options: include prompt log? include version? include comments?
* Confirm + download signed URL

---

## Engineering deliverables — tech choices

**Frontend**
* Vite + React + TypeScript (current stack)
* Vanilla CSS + glassmorphism design system (current)
* Rich editor: TipTap or Slate for in-place script editing
* File uploads: direct S3 signed URLs

**Backend**
* FastAPI (Python) — in place
* Workflow: Temporal or Redis Queue/Celery
* LLM integration layer: namespaced prompt templates, schema enforcement, caching

**Storage**
* Postgres + pgvector (optional for semantic features)
* S3-compatible for file storage
* Redis for cache, rate limits, session state

**Auth & Payments**
* Auth: JWT (in place) + Google OAuth
* Payments: Stripe for plans/credits

**Hosting**
* Vercel for frontend + AWS (ECS) for backend
* GPU infra NOT required for Stage 1 (LLMs via hosted providers)

**Observability**
* Sentry for errors, Prometheus/Grafana for metrics

---

## DB schema (v0) — core tables (Postgres)

* `users` (id, name, email, role, created_at)
* `projects` (id, owner_id, title, content_type, language, target_runtime_minutes, created_at, updated_at)
* `scripts` (id, project_id, filename, content_ref(s3), version, uploaded_by, created_at)
* `blueprints` (id, project_id, status, prompt_hash, model_version, created_at)
* `scenes` (id, blueprint_id, scene_number, slug, int_ext, day_night, location, description, locked, created_at)
* `characters` (id, project_id, name, bio, speech_style, created_at)
* `assets_metadata` (id, project_id, type, s3_key, provenance_json)
* `jobs` (id, project_id, type, status, payload_json, result_json, started_at, finished_at)
* `comments` (id, project_id, user_id, target_type, target_id, body, created_at)
* `revisions` (id, project_id, user_id, diff_json, created_at)

Note: `projects.content_type` is the modular hook — `film | ad_campaign | short_content | other` — enabling type-specific prompt templates and breakdown schemas per use case.

---

## First 10 API endpoints (v0)

1. `POST /api/projects` — create project (body: title, content_type, language, runtime)
2. `GET /api/projects/:id` — get project + recent blueprints
3. `POST /api/projects/:id/scripts` — upload or paste script/brief (multipart or body)
4. `POST /api/projects/:id/blueprints` — start blueprint generation → returns job id
5. `GET /api/jobs/:job_id` — job status/logs/results
6. `GET /api/blueprints/:id` — get blueprint structured (logline, synopsis, scenes, characters)
7. `PATCH /api/scenes/:id` — edit scene (fields: location, description, props, lock)
8. `POST /api/scenes/:id/regenerate` — regenerate scene (body: `{mode: "cheaper" | "cinematic" | "shorter"}`)
9. `POST /api/projects/:id/export` — generate export → returns signed URL when ready
10. `POST /api/projects/:id/share` — create share link (body: permission)

---

## "Generate Blueprint" Workflow

```
1. Receive request: project_id + script_id (or text) + content_type
2. Ingest: if file → convert to text (pdf/docx → text), store original
3. Preprocess: split into rough scene/segment candidates (heuristic)
4. LLM step 1: Generate logline, synopsis, beats (schema-validated, content_type-aware)
   - store prompt + response
5. LLM step 2: For each segment candidate → produce structured metadata:
   {int_ext, day_night, location_suggestion, characters, short_description}
   - run in parallel (batch up to N)
6. LLM step 3: Generate production pack per scene/segment:
   {props/brand_assets, wardrobe, shot_list_suggestions, continuity_flags, dialogue_polish}
7. LLM step 4: Extract characters/personas across content → create bibles
8. Validate: run light QA (schema checks, missing fields)
9. Finalize blueprint: set status=READY and emit notification
10. Persist provenance: prompt templates, model_version, token usage, prompt_hash
```

Key notes:
* All LLM outputs validated against a content-type-specific JSON schema (reject & retry on parse errors)
* Cache repeated prompt hashes to reduce cost
* Allow manual override UI for every generated field
