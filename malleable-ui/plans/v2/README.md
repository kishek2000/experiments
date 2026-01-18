# Generative UI Platform: v2 Plans

## The Reframe

This v2 represents a significant shift from the original plans:

| Aspect | v1 (Original) | v2 (Current) |
|--------|---------------|--------------|
| **Central Problem** | "How do we generate UI?" | "How do we match, adapt, or generate?" |
| **Paradigms** | 9 standalone pipelines | 9 collaborating layers |
| **Key Data Structure** | UISpec | ComponentMatchingSpec |
| **Performance** | Not emphasized | Critical (<50ms retrieve) |
| **Output** | Generated UI | Component foundry with memory |
| **Goal** | Build the platform | Build exploration/demo app |

---

## The Core Insight

> **Generate once, retrieve forever.**

The system prioritizes **retrieval** (instant) over **generation** (slow). Every generated component becomes a retrievable artifact for future use.

```
User Request
     │
     ├── Match found (score ≥ 0.7) ──→ Retrieve/Adapt ──→ <50ms
     │
     └── No match ──→ Generate ──→ Store ──→ 2-5s (but cached forever)
```

---

## Plan Structure

| Plan | Focus |
|------|-------|
| [00-architecture-overview.md](./00-architecture-overview.md) | The big picture |
| [01-matching-system.md](./01-matching-system.md) | The heart: signatures, scoring, decisions |
| [02-agent-pipeline.md](./02-agent-pipeline.md) | The 5 agents: parse, match, adapt, generate, validate |
| [03-component-library.md](./03-component-library.md) | Storage, retrieval, versioning |
| [04-paradigm-integration.md](./04-paradigm-integration.md) | How 9 paradigms collaborate |
| [05-content-libraries.md](./05-content-libraries.md) | tldraw, Tiptap, TanStack integration |
| [06-demo-application.md](./06-demo-application.md) | The Remix exploration app |

---

## Key Concepts

### The Matching Spec

Every component has a **ComponentMatchingSpec** that enables fast retrieval without reading code:

```
Intent Signature    → What the user wants to accomplish
Schema Signature    → What shape of content it handles
Capability Signature → What operations it supports
Affordance Signature → What interactions are exposed
Visual Signature    → How it looks
```

### The Agent Pipeline

Five agents, each with one job:

```
Agent 1: Parser     → User input → Signatures (rules + LLM)
Agent 2: Matcher    → Signatures → Ranked candidates (no LLM)
Agent 3: Adapter    → Close match → Field remapping (no LLM)
Agent 4: Generator  → No match → New component (LLM)
Agent 5: Validator  → Any output → Checks (no LLM)
```

### The Lens Paradigm

The **Lens** is the user-facing language. Other paradigms serve supporting roles:

- **Compilation**: Fast path templates
- **Grammar**: Structural validation
- **Constraint**: Requirements enforcement
- **Dataflow**: Reactive binding
- **Negotiation**: User refinement
- **Simulation**: Usability validation
- **Evolutionary**: Library learning
- **Marketplace**: Extensibility

---

## What We're Building

A **Remix demo application** that:

1. **Explains** the architecture visually
2. **Demonstrates** matching, adaptation, generation
3. **Explores** paradigm collaboration
4. **Prototypes** the user experience
5. **Defines** TypeScript interfaces

### Not Building

- Real LLM integration (mock it)
- Real Confluence integration (mock content)
- Production deployment
- Authentication
- Persistence beyond session

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Remix |
| Styling | Tailwind + Atlaskit |
| Content Libraries | tldraw, Tiptap, TanStack Table |
| State | React Context + useReducer |
| Types | TypeScript throughout |

---

## Implementation Timeline

| Week | Focus |
|------|-------|
| 1 | Foundation: types, mocks, shared components |
| 2 | Concepts section: architecture explanations |
| 3 | Playground: matching, generation, results |
| 4 | Component library: browse, detail, compare |
| 5 | Paradigm explorers: interactive demos |
| 6 | Polish: animations, accessibility, review |

---

## Reading Order

1. **Start with** [00-architecture-overview.md](./00-architecture-overview.md) for the big picture
2. **Dive into** [01-matching-system.md](./01-matching-system.md) for the core mechanism
3. **Understand** [02-agent-pipeline.md](./02-agent-pipeline.md) for the execution flow
4. **Learn about** [04-paradigm-integration.md](./04-paradigm-integration.md) for how paradigms fit
5. **See** [06-demo-application.md](./06-demo-application.md) for what we're building

---

## Key Differences from v1 Plans

### Paradigms Are Not Standalone

In v1, each paradigm was a complete generation pipeline. In v2, paradigms are **layers that collaborate**:

```
v1: Pick paradigm → Run pipeline → Get UI
v2: LensSpec → Match → (Adapt | Generate) → Validate → Render
                              ↑
         [Paradigms contribute at different stages]
```

### Performance Is Fundamental

v1 didn't emphasize performance. v2 has explicit latency targets:

| Scenario | Target |
|----------|--------|
| Retrieve | <50ms |
| Adapt | <200ms |
| Generate | 2-5s (but cached) |

### LensSpec vs MatchingSpec

Two distinct artifacts:

| LensSpec | MatchingSpec |
|----------|--------------|
| User-facing | System-facing |
| Fuzzy, natural language | Precise, typed |
| Editable by users | Generated, not edited |
| Saved as user artifact | Stored with component |

### Demo First, Platform Later

v1 was about building the platform. v2 is about **exploring and explaining** via a demo app. The demo validates ideas before heavy implementation.

---

## Open Questions

These need resolution during implementation:

### Matching
- Exact scoring weights
- Threshold tuning
- Handling "stretch" matches (0.5-0.7)

### Versioning
- When does purpose change trigger new component vs version?
- Design system upgrade strategy

### Generation
- Prompt engineering for reliable output
- Fallback when generation fails

### User Experience
- How much matching detail to show?
- How to present adaptation options?

