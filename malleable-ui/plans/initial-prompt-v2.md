# Generative UI Platform: Architecture & Implementation Prompt

## Executive Summary

We are building a **generative and malleable UI platform** for Atlassian Confluence content types (Pages, Whiteboards, Databases). The core insight is that AI should **generate components on demand** using design system primitives—not merely select from a fixed registry of pre-built components.

This document captures the architectural thinking, matching system design, agent pipeline, and paradigm exploration that will guide implementation.

---

## Part 1: The Foundational Shift

### From Selection to Generation

**The old model** (what most "AI UI" systems do):
```
Content → Classify → Pick(KanbanBoard | Table | Calendar) → Configure props
```

**Our model**:
```
Content + Intent → Generate(React/TSX using Atlaskit primitives) → Reusable Artifact
```

The generated component becomes a **thing the user owns**—shareable, forkable, versionable. This aligns with Ink & Switch's malleable software vision.

### What AI Generates

| Output Type | Description | Example |
|-------------|-------------|---------|
| **Inline Component** | One-off for immediate render | Custom card layout for specific content |
| **Reusable Component** | Named, stored for future use | "StatusBadgeGroup" for task databases |
| **Composite View** | Assembly of multiple components | Dashboard combining chart + table + actions |
| **Layout Pattern** | Structural arrangement | "MasterDetail" layout for list+preview |

### What AI Does NOT Generate

- The base design system itself (Atlaskit)
- Core content editing experiences (tldraw for whiteboard, Tiptap for rich text, TanStack Table for databases)
- Application infrastructure (routing, auth, data fetching)

The AI generates **the chrome around** these libraries—toolbars, sidebars, views, custom cell renderers, layout arrangements.

---

## Part 2: The Matching Problem

### The Core Insight

When a user requests a UI, we need to determine:
1. **Do we already have a component that fits?** → Retrieve and use (fast)
2. **Do we have something close?** → Adapt with configuration (fast)
3. **Is this truly novel?** → Generate new (slow, but cached for future)

The matching system cannot read 1000 lines of React code to make this determination. Instead, **every component has a structured Matching Spec** that enables fast comparison.

### The Matching Spec Schema

```typescript
interface ComponentMatchingSpec {
  id: string;
  version: string;
  
  intent: IntentSignature;
  schema: SchemaSignature;
  capabilities: CapabilitySignature;
  affordances: AffordanceSignature;
  visual: VisualSignature;
  
  confidence: {
    intentScores: Record<string, number>;
  };
  
  generatedFrom?: string;  // Lens spec ID
  derivedFrom?: string;    // Parent component if forked
}
```

#### Intent Signature

What the user wants to **accomplish**:

```typescript
interface IntentSignature {
  primaryGoal: 
    | 'view'        // See information
    | 'compare'     // Side by side comparison
    | 'track'       // Monitor progress/status
    | 'organize'    // Arrange/categorize
    | 'find'        // Search/filter to locate
    | 'edit'        // Modify content
    | 'create'      // Add new items
    | 'summarize';  // Overview/aggregate
    
  emphasis?: string[];  // ['status', 'timeline', 'ownership', 'priority']
  
  layout?: 
    | 'grouped'     // Items in buckets (kanban)
    | 'sequential'  // Items in order (list)
    | 'grid'        // Items in 2D
    | 'hierarchical'// Items nested (tree)
    | 'timeline'    // Items on time axis (calendar, gantt)
    | 'freeform';   // Items placed freely (whiteboard)
}
```

#### Schema Signature

What **shape of content** the component handles:

```typescript
interface SchemaSignature {
  required: FieldRequirement[];
  optional: FieldRequirement[];
  
  structure: {
    minItems?: number;
    maxItems?: number;
    supportsNested?: boolean;
    supportsRelations?: boolean;
  };
}

interface FieldRequirement {
  role: 
    | 'identifier' | 'title' | 'status' | 'category'
    | 'date' | 'dateRange' | 'person' | 'priority'
    | 'numeric' | 'richText' | 'media' | 'link';
    
  type?: 'string' | 'number' | 'date' | 'boolean' | 'select' | 'multiSelect' | 'relation';
  
  usage: 'display' | 'group' | 'sort' | 'filter' | 'aggregate' | 'link';
}
```

#### Capability Signature

What the component can **do**:

```typescript
interface CapabilitySignature {
  // Data operations
  canFilter: boolean;
  canSort: boolean;
  canGroup: boolean;
  canAggregate: boolean;
  canPaginate: boolean;
  canVirtualize: boolean;
  
  // Edit operations
  canEditInline: boolean;
  canReorder: boolean;
  canReparent: boolean;
  canCreate: boolean;
  canDelete: boolean;
  
  // View operations
  canExpand: boolean;
  canCollapse: boolean;
  canZoom: boolean;
  canSelect: boolean;
}
```

#### Affordance Signature

What **interactions** are exposed:

```typescript
interface AffordanceSignature {
  interactions: Interaction[];
}

interface Interaction {
  trigger: 'click' | 'doubleClick' | 'drag' | 'hover' | 'contextMenu' | 'keyboard';
  target: 'item' | 'field' | 'group' | 'container' | 'header';
  action: string;
  
  contentEffect?: {
    operation: 'update' | 'create' | 'delete' | 'reorder';
    fields: string[];
  };
}
```

#### Visual Signature

The **look and feel**:

```typescript
interface VisualSignature {
  density: 'compact' | 'comfortable' | 'spacious';
  chrome: 'minimal' | 'standard' | 'rich';
  
  emphasis: {
    field: string;
    treatment: 'size' | 'color' | 'position' | 'icon';
  }[];
  
  responsive: {
    mobile: 'stack' | 'scroll' | 'collapse' | 'hide';
    tablet: 'adapt' | 'same';
  };
}
```

### Matching Spec Generation

When AI generates a new component, it **also generates the Matching Spec**. This is not derived from code analysis—it's produced alongside the code as a first-class output.

### Component Versioning Philosophy

Key principles:

1. **A component's purpose never changes.** A calendar component always shows dates. As soon as the purpose changes, it's a new component, not a new version.

2. **Versions have slight spec differences.** Same React code can have different versions with minor spec variations (e.g., supports an additional optional field).

3. **Adaptation ≠ New version.** Runtime configuration (field remapping) doesn't require a new version. Code changes do.

4. **Atomic design principles apply.** A "view switcher" that toggles between calendar and kanban is a higher-level composition, not a variant of either.

---

## Part 3: The Agent Pipeline

### Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AGENT PIPELINE                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  USER INPUT                                                          │
│  ├── Selected content in app (highlights, selection)                │
│  └── Prompt: "show me a kanban of these tasks by status"            │
│                                                                      │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  AGENT 1: INTENT PARSER                                      │   │
│  │                                                               │   │
│  │  Input: User prompt + selected content metadata              │   │
│  │  Output: IntentSignature + SchemaSignature                   │   │
│  │                                                               │   │
│  │  Can be rule-based for common patterns, LLM for novel        │   │
│  └───────────────────────────┬──────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  AGENT 2: MATCHER                                            │   │
│  │                                                               │   │
│  │  Input: Query (Intent + Schema signatures)                   │   │
│  │  Output: Ranked candidates + adaptation instructions         │   │
│  │                                                               │   │
│  │  Vector similarity + structured comparison                   │   │
│  │  No LLM needed—pure retrieval                                │   │
│  └───────────────────────────┬──────────────────────────────────┘   │
│                              │                                       │
│              ┌───────────────┴───────────────┐                      │
│              │                               │                       │
│       SCORE ≥ 0.7                      SCORE < 0.7                  │
│              │                               │                       │
│              ▼                               ▼                       │
│  ┌────────────────────┐         ┌────────────────────────────────┐  │
│  │  AGENT 3: ADAPTER  │         │  AGENT 4: GENERATOR            │  │
│  │                    │         │                                 │  │
│  │  Remaps fields     │         │  Full LLM generation           │  │
│  │  Applies config    │         │  Produces code + MatchingSpec  │  │
│  │                    │         │                                 │  │
│  │  FAST              │         │  SLOW (but cached)             │  │
│  └─────────┬──────────┘         └─────────────┬──────────────────┘  │
│            │                                   │                     │
│            └───────────────┬───────────────────┘                    │
│                            │                                         │
│                            ▼                                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  AGENT 5: VALIDATOR                                          │   │
│  │                                                               │   │
│  │  - Grammar check (valid Atlaskit composition)               │   │
│  │  - Accessibility check                                       │   │
│  │  - Schema binding check                                      │   │
│  └───────────────────────────┬──────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  RENDER + STORE                                              │   │
│  │                                                               │   │
│  │  - Render component with user's content                      │   │
│  │  - Store in library with MatchingSpec (if new)              │   │
│  │  - Cache locally for instant future retrieval               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Performance Requirements

**Critical constraint:** The system must be fast after first generation.

| Scenario | Target Latency | Mechanism |
|----------|---------------|-----------|
| Exact match in cache | < 50ms | Local IndexedDB lookup |
| Match with adaptation | < 200ms | Retrieval + config remapping |
| New generation | 2-5s | LLM generation (but cached for future) |

This means: **Generate once, retrieve forever.** The matcher must be extremely fast, and the component library must be effectively indexed.

---

## Part 4: Multi-Platform Architecture

### The Challenge

- Pages, Whiteboards, and Databases are **separate applications** in Confluence
- Generated components need to be **accessible from all three**
- Each app has its own content library (Tiptap, tldraw, TanStack Table)
- We need a **shared generation service** but **local rendering**

### Recommended Architecture: SDK + Service

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  LAYER 1: Content Apps                                              │
│  ──────────────────────                                             │
│  Each app embeds:                                                    │
│  - @atlassian/generative-ui-sdk                                     │
│  - Their content library (Tiptap, tldraw, TanStack)                 │
│  - Local component cache (IndexedDB)                                │
│                                                                      │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐                    │
│  │  Pages   │     │Whiteboard│     │ Database │                    │
│  │   App    │     │   App    │     │   App    │                    │
│  │          │     │          │     │          │                    │
│  │  [SDK]   │     │  [SDK]   │     │  [SDK]   │                    │
│  │  Tiptap  │     │  tldraw  │     │ TanStack │                    │
│  └────┬─────┘     └────┬─────┘     └────┬─────┘                    │
│       │                │                │                           │
│       └────────────────┼────────────────┘                           │
│                        │                                             │
│  LAYER 2: Generation Service                                        │
│  ────────────────────────────                                       │
│                        │                                             │
│               ┌────────▼────────┐                                   │
│               │   GENERATION    │                                   │
│               │    SERVICE      │                                   │
│               │                 │                                   │
│               │  - Matching     │                                   │
│               │  - Generation   │                                   │
│               │  - Validation   │                                   │
│               │  - Library      │                                   │
│               └────────┬────────┘                                   │
│                        │                                             │
│  LAYER 3: Edge Cache                                                │
│  ───────────────────────                                            │
│                        │                                             │
│               ┌────────▼────────┐                                   │
│               │   CDN / EDGE    │                                   │
│               │                 │                                   │
│               │  Compiled       │                                   │
│               │  components     │                                   │
│               │  served fast    │                                   │
│               └─────────────────┘                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. User in Database App selects rows, types "show as kanban by status"

2. SDK (local):
   - Analyzes selected content → SchemaSignature
   - Parses prompt → IntentSignature
   - Checks local cache: "Do I have this?"
   
3. If cache HIT → Render immediately (< 50ms)

4. If cache MISS → Call Generation Service:
   - Service checks library: "Does anyone have this?"
   - If library HIT → Return component, SDK caches locally
   - If library MISS → Generate via LLM, validate, store, return
   
5. SDK renders component with user's content

6. Next request with same intent+schema → Step 3 hits
```

---

## Part 5: The Nine Paradigms

We identified 9 fundamentally different ways to frame the generative UI problem. In the context of our architecture, they serve different roles:

### Paradigm Roles in the System

| Paradigm | Role | Where It Lives |
|----------|------|----------------|
| **Lens** | The specification language—what users save and share | SDK + Service |
| **Grammar** | The guardrails—what's valid Atlaskit composition | Service (validation) |
| **Compilation** | The fast path—templates for known patterns | Service (generation) |
| **Constraint** | The requirements layer—accessibility, responsiveness | Service (validation) |
| **Negotiation** | The refinement loop—user corrects, system regenerates | SDK (UI interaction) |
| **Simulation** | The safety net—validate before promoting to library | Service (background) |
| **Evolutionary** | The learning layer—improve library over time | Service (background) |
| **Marketplace** | The extensibility layer—third parties contribute | Service (storage) |
| **Dataflow** | The reactivity layer—live updates when content changes | SDK (rendering) |

### Lens as the "Master" Paradigm

The **Lens** paradigm is special—it provides the **user-facing language for expressing intent**:

```typescript
// A Lens Spec is what the user creates/refines
interface LensSpec {
  intent: string;  // Natural language or structured
  emphasis: string[];
  interactions: string[];
  constraints: string[];
}

// The Lens Spec drives everything else:
// - Matching uses it to find components
// - Generation uses it to create components
// - Negotiation refines it based on feedback
// - The stored component references its source Lens
```

The Lens Spec is **recoverable and editable**. Users can:
1. Apply an existing lens
2. Fork and modify a lens
3. Create a lens from scratch via natural language
4. Refine a lens through conversation

### How Paradigms Collaborate

```
USER: "Show me a kanban of tasks by status"
           │
           ▼
    ┌──────────────┐
    │    LENS      │  Captures intent as LensSpec
    └──────┬───────┘
           │
           ├───────────────────────────────────┐
           │                                   │
           ▼                                   ▼
    ┌──────────────┐                   ┌──────────────┐
    │ COMPILATION  │  Known pattern?   │  GENERATION  │  Novel?
    │  (template)  │  Use fast path    │    (LLM)     │  Full generation
    └──────┬───────┘                   └──────┬───────┘
           │                                   │
           └───────────────┬───────────────────┘
                           │
                           ▼
                   ┌──────────────┐
                   │   GRAMMAR    │  Is it valid Atlaskit?
                   └──────┬───────┘
                           │
                           ▼
                   ┌──────────────┐
                   │  CONSTRAINT  │  Is it accessible? Responsive?
                   └──────┬───────┘
                           │
                           ▼
                   ┌──────────────┐
                   │  SIMULATION  │  Would users succeed with this?
                   │  (optional)  │  (for new components)
                   └──────┬───────┘
                           │
                           ▼
                        RENDER
                           │
                           │ User sees result
                           │
           ┌───────────────┴───────────────┐
           │                               │
       SATISFIED                     NEEDS REFINEMENT
           │                               │
           ▼                               ▼
    ┌──────────────┐               ┌──────────────┐
    │ EVOLUTIONARY │               │ NEGOTIATION  │
    │              │               │              │
    │ Track usage, │               │ "Make cards  │
    │ improve over │               │  more compact"│
    │ time         │               │              │
    └──────────────┘               └──────┬───────┘
                                          │
                                          │ Updates LensSpec
                                          │ Regenerates
                                          ▼
                                       REPEAT
```

---

## Part 6: Design System Foundation

### Base: Atlaskit

AI generates components using [Atlaskit](https://atlassian.design/) primitives:

**Layout:**
- `Box`, `Stack`, `Inline`, `Grid`, `Flex`

**Typography:**
- `Text`, `Heading`

**Interactive/Display:**
- `Button`, `Badge`, `Lozenge`, `Avatar`, `Icon`

**Patterns:**
- `@atlaskit/dynamic-table`
- `@atlaskit/modal-dialog`
- `@atlaskit/dropdown-menu`
- `@atlaskit/tabs`

### Token Usage (Critical)

AI must use Atlaskit tokens, never hardcoded values:

```tsx
// ❌ Wrong
const styles = xcss({
  padding: '16px',
  color: '#172B4D',
});

// ✅ Correct
const styles = xcss({
  padding: 'space.200',
  color: 'color.text',
});
```

### Content Libraries (Don't Reinvent)

| Content Type | Library | AI Generates Around It |
|--------------|---------|------------------------|
| **Whiteboard** | tldraw | Toolbars, sidebars, shape palettes, export views |
| **Rich Text** | Tiptap | Custom toolbars, slash commands, block handles |
| **Database** | TanStack Table | Cell renderers, view components (kanban, calendar, gallery) |

---

## Part 7: Open Questions

These need resolution during implementation:

### Matching & Scoring
1. How do we score schema compatibility when field names differ but roles match? (e.g., "Status" vs "Workflow Stage")
2. What's the exact threshold for "adapt" vs "generate new"?
3. How do we weight intent match vs schema match vs capability match?

### Versioning
1. When the design system updates, what triggers component regeneration?
2. How do we handle breaking changes in Atlaskit?

### Multi-tenancy
1. Should components be tenant-specific or shared across tenants?
2. Privacy implications of generated code?

### User Agency
1. Can users see/edit generated code?
2. Or is it a black box they interact with only via Lens specs?

### Offline
1. What happens when Generation Service is unavailable?
2. How aggressive should local caching be?

---

## Part 8: Implementation Request

### Context

We have an **empty Remix web application** that will serve as the exploratory implementation of this platform.

### What We Want

Build out this Remix app to:

1. **Explain the concepts**
   - Landing page that introduces the generative UI platform vision
   - Visual explanation of the matching spec architecture
   - Interactive diagram of the agent pipeline
   - Paradigm explorer showing how each paradigm fits

2. **Demonstrate the architecture**
   - Mock component library with sample MatchingSpecs
   - Interactive matcher that shows scoring in real-time
   - Simulated generation flow (can be mocked, doesn't need real LLM)
   - Show the "retrieve vs adapt vs generate" decision tree

3. **Explore the paradigms**
   - Dedicated section for each paradigm
   - Show how that paradigm would approach a sample problem
   - Compare outputs across paradigms
   - Highlight where paradigms collaborate

4. **Prototype the user experience**
   - Content selection simulation (mock Pages/Whiteboard/Database content)
   - Prompt input for expressing intent
   - Real-time matching visualization
   - Rendered output preview
   - Lens spec editor

5. **Technical foundations**
   - TypeScript interfaces for all the types defined above
   - Mock data structures for components, specs, content
   - Routing structure that mirrors the conceptual architecture
   - Clean separation of concerns matching the proposed system design

### Design Approach

- Use Tailwind CSS for styling (or Atlaskit if available in Remix context)
- Prioritize clarity over completeness—this is an exploration tool
- Make the invisible visible: show the matching scores, the decision points, the spec comparisons
- Progressive disclosure: start simple, allow drilling into complexity
- Interactive where possible: let users manipulate inputs and see how outputs change

### Not Required

- Real LLM integration (mock the generation)
- Real Confluence integration (mock the content)
- Production deployment considerations
- Authentication/authorization
- Persistence beyond session

### The Goal

Someone should be able to use this app to:
1. Understand what we're trying to build
2. See how the matching system works
3. Explore how different paradigms approach the same problem
4. Get an intuition for when to retrieve vs adapt vs generate
5. Appreciate the architectural decisions and their tradeoffs

---

## Summary

We're building a **generative component foundry with institutional memory**:

- AI generates React components using Atlaskit primitives
- Every component has a structured Matching Spec for fast retrieval
- The system retrieves when possible, generates when necessary
- Lens specs are the user-facing language for expressing intent
- Nine paradigms collaborate to handle different aspects of the problem
- The architecture spans multiple apps via shared SDK and service

This is not "AI picks components" or "AI writes apps." This is **AI as a craftsman that builds UI artifacts, remembers what works, and gets faster over time.**