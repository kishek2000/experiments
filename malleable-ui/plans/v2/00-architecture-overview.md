# Architecture Overview

## The Core Insight

This is not "9 ways to generate UI." This is **one system with 9 collaborating paradigms** that together form a generative component foundry with institutional memory.

The key question is not "how do we generate?" but "how do we **retrieve, adapt, or generate** as appropriate?"

---

## The Matching Hierarchy

Performance is fundamental. The system must be fast:

| Scenario | Latency | Mechanism |
|----------|---------|-----------|
| Exact match | < 50ms | Local cache lookup by spec signature |
| Adapt existing | < 200ms | Field remapping, no code change |
| Generate new | 2-5s | LLM generation (but cached forever after) |

**Design principle**: Generate once, retrieve forever.

---

## The Central Data Structures

### 1. LensSpec (User-Facing)

What the user creates and owns. Expresses intent without prescribing implementation.

```
"Show me tasks grouped by status, with priority emphasized"
     ↓ parsed into ↓
{
  intent: { primaryGoal: 'organize', layout: 'grouped' },
  schema: { required: [status: 'category'], optional: [priority: 'priority'] },
  emphasis: ['status', 'priority']
}
```

### 2. ComponentMatchingSpec (System)

How the system knows what a component can do—without reading code.

```
{
  intent: { primaryGoal: 'organize', layout: 'grouped' },
  schema: { required: [status: 'category'], groupField: 'status' },
  capabilities: { canReorder: true, canEditInline: true },
  affordances: [{ trigger: 'drag', action: 'changeStatus' }],
  visual: { density: 'comfortable' }
}
```

### 3. Generated Component

The actual React/TSX code built on Atlaskit primitives, stored with its MatchingSpec.

---

## The Agent Pipeline

Five agents, each with a clear responsibility:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AGENT PIPELINE                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  INPUT: User prompt + Selected content                               │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  AGENT 1: INTENT PARSER                                      │   │
│  │  Prompt + content → IntentSignature + SchemaSignature        │   │
│  │  Rule-based for common patterns, LLM for novel               │   │
│  └───────────────────────────┬──────────────────────────────────┘   │
│                              │                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  AGENT 2: MATCHER                                            │   │
│  │  Query signatures → Ranked candidates + adaptation paths     │   │
│  │  NO LLM—pure retrieval + scoring                             │   │
│  └───────────────────────────┬──────────────────────────────────┘   │
│                              │                                       │
│              ┌───────────────┴───────────────┐                      │
│         SCORE ≥ 0.7                     SCORE < 0.7                 │
│              │                               │                       │
│  ┌───────────▼──────────┐       ┌───────────▼──────────────────┐   │
│  │  AGENT 3: ADAPTER    │       │  AGENT 4: GENERATOR          │   │
│  │  Field remapping     │       │  Full LLM generation         │   │
│  │  Config adjustments  │       │  Code + MatchingSpec         │   │
│  │  FAST                │       │  SLOW (but cached)           │   │
│  └───────────┬──────────┘       └───────────┬──────────────────┘   │
│              │                               │                       │
│              └───────────────┬───────────────┘                      │
│                              │                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  AGENT 5: VALIDATOR                                          │   │
│  │  Grammar check (valid Atlaskit)                              │   │
│  │  Constraint check (a11y, responsive)                         │   │
│  │  Schema binding check                                        │   │
│  └───────────────────────────┬──────────────────────────────────┘   │
│                              │                                       │
│  OUTPUT: Rendered component + Stored artifact                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Where Paradigms Live

Each paradigm is not a standalone system—it's a **layer that contributes to the pipeline**:

| Paradigm | Role | Pipeline Stage |
|----------|------|----------------|
| **Lens** | User-facing specification language | Input (LensSpec) |
| **Compilation** | Fast path for known patterns | Agent 4 (template-based generation) |
| **Grammar** | Structural validity guardrails | Agent 5 (validation) |
| **Constraint** | Requirements enforcement | Agent 5 (validation) |
| **Dataflow** | Reactivity when content changes | Rendering layer |
| **Negotiation** | User refinement loop | Post-render feedback → re-run pipeline |
| **Simulation** | Pre-promotion validation | Background (new components) |
| **Evolutionary** | Library improvement over time | Background (usage tracking) |
| **Marketplace** | Third-party extensibility | Component library |

---

## Multi-Platform Architecture

The system spans multiple apps via SDK + Service:

```
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 1: Content Apps (each embeds SDK)                            │
│                                                                      │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐                    │
│  │  Pages   │     │Whiteboard│     │ Database │                    │
│  │  [SDK]   │     │  [SDK]   │     │  [SDK]   │                    │
│  │  Tiptap  │     │  tldraw  │     │ TanStack │                    │
│  └────┬─────┘     └────┬─────┘     └────┬─────┘                    │
│       │                │                │                           │
│       └────────────────┼────────────────┘                           │
│                        │                                             │
│  LAYER 2: Generation Service                                        │
│                        │                                             │
│               ┌────────▼────────┐                                   │
│               │   GENERATION    │                                   │
│               │    SERVICE      │                                   │
│               │  (Matching,     │                                   │
│               │   Generation,   │                                   │
│               │   Library)      │                                   │
│               └────────┬────────┘                                   │
│                        │                                             │
│  LAYER 3: Edge Cache                                                │
│                        │                                             │
│               ┌────────▼────────┐                                   │
│               │   CDN / EDGE    │                                   │
│               │  (Compiled      │                                   │
│               │   components)   │                                   │
│               └─────────────────┘                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Lifecycle

```
1. USER REQUEST
   "Show tasks as kanban by status"
   
2. PARSE → LensSpec
   { intent: 'organize', layout: 'grouped', groupField: 'status' }
   
3. MATCH against Component Library
   Compare LensSpec signatures to stored ComponentMatchingSpecs
   
4a. HIGH MATCH (≥0.7) → ADAPT
    Remap fields, adjust config
    
4b. LOW MATCH (<0.7) → GENERATE
    LLM produces code + MatchingSpec
    
5. VALIDATE
   Grammar (valid Atlaskit composition)
   Constraints (accessible, responsive)
   
6. RENDER
   Bind to user's content, display
   
7. STORE (if new)
   Component + MatchingSpec → Library
   Now available for future retrieval
   
8. EVOLVE (background)
   Track usage, learn what works
```

---

## What We're Building (Demo App)

This Remix app is an **exploration and explanation tool**, not the full platform.

### Goals

1. **Explain** the architecture visually
2. **Demonstrate** matching, adaptation, generation
3. **Explore** how paradigms collaborate
4. **Prototype** the user experience
5. **Build** type foundations for the real system

### Non-Goals

- Real LLM integration (mock it)
- Real Confluence integration (mock content)
- Production deployment
- Authentication
- Persistence beyond session

### Success Criteria

Someone using the app should:
1. Understand what we're building
2. See how matching works (scores, decisions)
3. Watch paradigms collaborate
4. Get intuition for retrieve vs adapt vs generate
5. Appreciate the architectural decisions

---

## Plan Structure

The v2 plans are organized by **architectural layer**, not by paradigm:

| Plan | Focus |
|------|-------|
| `01-matching-system.md` | The core matching problem and signatures |
| `02-agent-pipeline.md` | The 5-agent pipeline |
| `03-component-library.md` | Storage, retrieval, versioning |
| `04-paradigm-integration.md` | How 9 paradigms collaborate |
| `05-content-libraries.md` | tldraw, Tiptap, TanStack integration |
| `06-demo-application.md` | The Remix exploration app |

Each paradigm becomes a **section** in `04-paradigm-integration.md`, not a standalone plan.

