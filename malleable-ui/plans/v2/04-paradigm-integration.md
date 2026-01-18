# Plan 04: Paradigm Integration

## Overview

The 9 paradigms are not standalone systems—they are **collaborating layers** within a unified architecture. Each paradigm contributes a specific capability at a specific stage of the pipeline.

---

## Paradigm Roles

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PARADIGM INTEGRATION                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  USER INPUT: "Show tasks as kanban by status"                       │
│         │                                                            │
│         ▼                                                            │
│  ┌──────────────┐                                                   │
│  │    LENS      │  The specification language                       │
│  │              │  Captures intent as LensSpec                       │
│  └──────┬───────┘                                                   │
│         │                                                            │
│         ├─────────────────────────────────────────┐                 │
│         │                                         │                  │
│    MATCH FOUND                              NO MATCH                 │
│         │                                         │                  │
│         ▼                                         ▼                  │
│  ┌──────────────┐                        ┌──────────────┐           │
│  │  DATAFLOW    │                        │ COMPILATION  │           │
│  │              │                        │              │           │
│  │  Reactive    │                        │  Fast path   │           │
│  │  binding     │                        │  templates   │           │
│  └──────┬───────┘                        └──────┬───────┘           │
│         │                                       │                    │
│         │                               (or full LLM generation)    │
│         │                                       │                    │
│         └───────────────┬───────────────────────┘                   │
│                         │                                            │
│                         ▼                                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                     VALIDATION LAYER                          │   │
│  │  ┌──────────────┐              ┌──────────────┐              │   │
│  │  │   GRAMMAR    │              │  CONSTRAINT  │              │   │
│  │  │              │              │              │              │   │
│  │  │  Structural  │              │  A11y,       │              │   │
│  │  │  validity    │              │  responsive  │              │   │
│  │  └──────────────┘              └──────────────┘              │   │
│  └──────────────────────────┬───────────────────────────────────┘   │
│                             │                                        │
│                             ▼                                        │
│                          RENDER                                      │
│                             │                                        │
│                             │ User sees result                       │
│         ┌───────────────────┼───────────────────────┐               │
│         │                   │                       │                │
│    SATISFIED           NEEDS CHANGE            NEW COMPONENT        │
│         │                   │                       │                │
│         ▼                   ▼                       ▼                │
│  ┌──────────────┐   ┌──────────────┐       ┌──────────────┐         │
│  │ EVOLUTIONARY │   │ NEGOTIATION  │       │  SIMULATION  │         │
│  │              │   │              │       │              │         │
│  │ Track usage, │   │ Refine via   │       │ Validate     │         │
│  │ learn        │   │ feedback     │       │ usability    │         │
│  └──────────────┘   └──────────────┘       └──────────────┘         │
│                                                    │                 │
│                                                    ▼                 │
│                                            ┌──────────────┐         │
│                                            │ MARKETPLACE  │         │
│                                            │              │         │
│                                            │ Store for    │         │
│                                            │ future use   │         │
│                                            └──────────────┘         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Paradigm 1: LENS (The Specification Layer)

### Role in System

**The user-facing language for expressing intent.**

The LensSpec is what users create, share, fork, and refine. It's the bridge between natural language ("show as kanban") and the structured signatures used for matching.

### Where It Lives

- **Agent 1 (Parser)**: Parses user input into LensSpec
- **Input to Matcher**: LensSpec drives component search
- **User Artifact**: Users can save, share, edit LensSpecs
- **Provenance**: Generated components link back to their LensSpec

### LensSpec Schema

```typescript
interface LensSpec {
  id: string;
  name: string;
  description: string;
  
  // Core intent (maps to IntentSignature)
  intent: {
    goal: string;       // Natural language or primaryGoal enum
    emphasis: string[]; // Fields to highlight
    layout?: string;    // Layout preference
  };
  
  // Interactions allowed
  interactions: string[];  // "edit inline", "drag to reorder", etc.
  
  // Constraints
  constraints: string[];   // "must be accessible", "mobile-friendly"
  
  // User-level, not system-level
  // Unlike MatchingSpec which is precise, LensSpec is expressive
}
```

### Key Difference: LensSpec vs MatchingSpec

| Aspect | LensSpec | MatchingSpec |
|--------|----------|--------------|
| Audience | Users | System |
| Precision | Fuzzy, natural language | Exact, typed |
| Purpose | Express intent | Enable matching |
| Editable | Yes, by users | No (generated) |
| Persistence | Saved as user artifact | Stored with component |

### Demo Features

- **Lens Editor**: Create/edit LensSpecs visually
- **Lens Gallery**: Browse saved lenses
- **Lens → Match Visualization**: See how LensSpec maps to MatchingSpec

---

## Paradigm 2: COMPILATION (The Fast Path)

### Role in System

**Template-based generation for known patterns.**

When LLM generation is needed but the pattern is common, compilation provides a fast path using pre-built templates.

### Where It Lives

- **Agent 4 (Generator)**: First try templates before full LLM
- **Template Library**: Pre-built patterns for common cases

### Template Types

| Pattern | Template | When to Use |
|---------|----------|-------------|
| Status Kanban | `kanban-by-status.template` | Database with status column, "kanban" intent |
| Simple Table | `basic-table.template` | Any tabular data, "table" intent |
| Calendar | `event-calendar.template` | Data with dates, "calendar" intent |
| Card Grid | `card-gallery.template` | Items with image/title, "cards" intent |

### Template Structure

```typescript
interface ComponentTemplate {
  id: string;
  name: string;
  
  // When to use this template
  triggers: {
    primaryGoal: string[];
    layout: string[];
    requiredSchemaRoles: string[];
  };
  
  // The template code (with placeholders)
  template: string;
  
  // How to fill placeholders
  bindings: {
    placeholder: string;
    from: 'schema' | 'intent' | 'config';
    path: string;
  }[];
}
```

### Generation Flow

```
1. Check if any template triggers match
2. If match: hydrate template with bindings
3. If no match: fall back to LLM generation
```

### Demo Features

- **Template Browser**: See all available templates
- **Template Match Visualization**: Why a template was/wasn't selected
- **Template Hydration Demo**: Show placeholders being filled

---

## Paradigm 3: GRAMMAR (Structural Validity)

### Role in System

**Ensures generated code is structurally valid.**

The grammar defines what Atlaskit compositions are allowed. Agent 5 uses it to validate generated code.

### Where It Lives

- **Agent 5 (Validator)**: Grammar check phase
- **Generator Constraints**: LLM is told the grammar rules

### Grammar Rules

**Valid Compositions**:
```
// What can contain what
Stack → (Stack | Inline | Box | Card | Text | ...)+
Grid → (GridItem)+
Card → CardHeader? + CardBody + CardFooter?
Table → TableHead + TableBody
TableBody → TableRow+
```

**Token Requirements**:
```
// Styling must use tokens
✓ padding: 'space.200'
✗ padding: '16px'

✓ color: 'color.text'
✗ color: '#172B4D'
```

**Import Whitelist**:
```
// Only these imports allowed
@atlaskit/primitives: Box, Stack, Inline, Grid, Text, Heading, ...
@atlaskit/button: Button
@atlaskit/badge: Badge
...
```

### Validation Checks

| Check | Implementation |
|-------|----------------|
| Valid nesting | Parse AST, check parent-child |
| Token usage | Regex for hardcoded values |
| Import whitelist | Check import statements |
| Required props | Check component props |

### Demo Features

- **Grammar Visualizer**: Interactive tree of valid compositions
- **Validation Results**: Show what passed/failed
- **Fix Suggestions**: How to correct violations

---

## Paradigm 4: CONSTRAINT (Requirements Enforcement)

### Role in System

**Ensures generated UI meets hard requirements.**

Accessibility, responsive design, and performance constraints are enforced here.

### Where It Lives

- **Agent 5 (Validator)**: Constraint check phase
- **Generator Constraints**: LLM is told the constraints

### Constraint Categories

**Accessibility (WCAG AA)**:
| Constraint | Check |
|------------|-------|
| Color contrast | 4.5:1 for text |
| Keyboard access | All interactive elements focusable |
| Labels | Buttons and inputs have labels |
| ARIA | Correct ARIA attributes |

**Responsive**:
| Constraint | Check |
|------------|-------|
| Mobile breakpoint | Works at 320px width |
| Touch targets | Min 44px tap areas |
| No horizontal scroll | Content fits viewport |

**Performance**:
| Constraint | Check |
|------------|-------|
| No obvious loops | No render loops in code |
| Reasonable DOM size | Not too many elements |
| Lazy loading | Heavy content is lazy |

### Demo Features

- **Constraint Checker**: Run all checks on a component
- **A11y Report**: Detailed accessibility audit
- **Responsive Preview**: See component at different sizes

---

## Paradigm 5: DATAFLOW (Reactive Binding)

### Role in System

**Live updates when content changes.**

Once a component is rendered, dataflow keeps it in sync with underlying content.

### Where It Lives

- **Rendering Layer**: Component binds to content signals
- **Bidirectional Updates**: UI changes → content changes

### Reactive Architecture

```
Content Store (source of truth)
        │
        ▼
    Signals
        │
        ▼
  Component (reacts to changes)
        │
        ▼
  Rendered UI (updates automatically)
```

### Signal Types

| Signal | Description |
|--------|-------------|
| `contentSignal` | The content data |
| `schemaSignal` | Content schema (rarely changes) |
| `selectionSignal` | Currently selected items |
| `filterSignal` | Active filters |

### Binding

Component props bind to signals:
```typescript
// Pseudo-code
<KanbanBoard
  items={contentSignal.items}
  groupBy={contentSignal.schema.statusField}
  onMove={(item, newStatus) => contentStore.update(item.id, { status: newStatus })}
/>
```

### Demo Features

- **Signal Inspector**: See signals and their values
- **Binding Visualizer**: What props bind to what signals
- **Live Update Demo**: Change content, see UI update

---

## Paradigm 6: NEGOTIATION (Refinement Loop)

### Role in System

**User corrects, system refines.**

When the generated UI isn't quite right, users provide feedback and the system regenerates or adapts.

### Where It Lives

- **Post-render Feedback**: UI for capturing user input
- **Pipeline Re-run**: Feedback → updated LensSpec → re-generate

### Feedback Types

| Feedback | System Response |
|----------|-----------------|
| "Make it more compact" | Update visual.density in LensSpec, re-run |
| "Add priority column" | Update schema emphasis, re-run |
| "I want table, not kanban" | Update intent.layout, re-run |
| "This is perfect" | Accept, stop refinement |

### Refinement Flow

```
1. User sees generated UI
2. User provides feedback (NL or structured)
3. System updates LensSpec based on feedback
4. Pipeline re-runs with updated LensSpec
5. Repeat until user satisfied
```

### Demo Features

- **Feedback Panel**: Input for refinement requests
- **LensSpec Diff**: Show what changed
- **Refinement History**: Track refinements in session

---

## Paradigm 7: SIMULATION (Usability Validation)

### Role in System

**Validate new components before promoting to library.**

Run simulated users through the component to detect usability issues.

### Where It Lives

- **Background Process**: After generation, before promotion
- **Quality Gate**: Component must pass simulation to become active

### Simulation Scenarios

| Scenario | What It Tests |
|----------|---------------|
| Find item by name | Discoverability |
| Update status | Edit flow |
| Filter to subset | Filter UX |
| Navigate with keyboard | Accessibility |

### Simulation Personas

| Persona | Characteristics |
|---------|-----------------|
| Power User | Fast, uses shortcuts |
| New User | Slow, exploratory |
| Screen Reader User | Keyboard only, ARIA dependent |
| Mobile User | Touch, small screen |

### Simulation Output

```typescript
interface SimulationResult {
  scenario: string;
  persona: string;
  success: boolean;
  timeToComplete: number;
  errorCount: number;
  issues: UsabilityIssue[];
}
```

### Demo Features

- **Simulation Runner**: Run scenarios against a component
- **Results Dashboard**: Success rates, times, issues
- **Issue Highlighter**: Show where users struggled

---

## Paradigm 8: EVOLUTIONARY (Learning Over Time)

### Role in System

**Track what works, improve the library.**

Over time, learn which components are successful and why.

### Where It Lives

- **Background Process**: Continuous learning
- **Library Improvement**: Suggest new components, deprecate poor ones

### Learning Signals

| Signal | What It Indicates |
|--------|-------------------|
| Use count | Popularity |
| Adaptation rate | Flexibility |
| User rating | Satisfaction |
| Refinement rate | Initial quality |
| Abandonment | Failure |

### Evolution Actions

| Signal Pattern | Action |
|----------------|--------|
| High use, low refinement | Promote, suggest as default |
| High use, high refinement | Study refinements, improve |
| Low use, high quality | Marketing problem, increase visibility |
| High abandonment | Investigate, possibly deprecate |

### Demo Features

- **Library Analytics**: Usage stats, trends
- **Evolution Log**: What the system has learned
- **Recommendations**: Suggested library improvements

---

## Paradigm 9: MARKETPLACE (Extensibility)

### Role in System

**Third-party and user contributions.**

The component library isn't just system-generated—users and third parties can contribute.

### Where It Lives

- **Component Library**: Storage for all components
- **Import/Export**: Sharing mechanism
- **Ratings/Reviews**: Quality signals

### Contribution Types

| Type | Description |
|------|-------------|
| User Component | User-generated, personal use |
| Shared Component | User-generated, shared publicly |
| Third-Party | External developer contribution |
| Verified | Reviewed and approved |

### Trust Model

| Level | Access | Verification |
|-------|--------|--------------|
| Personal | Only creator | None |
| Shared | Anyone with link | Self-reported spec |
| Public | Everyone | Automated checks |
| Verified | Featured | Manual review |

### Demo Features

- **Contribution Flow**: Create and share a component
- **Component Ratings**: Rate and review
- **Trust Indicators**: Show verification level

---

## Integration Points

### Pipeline Integration

| Paradigm | Pipeline Stage | Integration Point |
|----------|----------------|-------------------|
| Lens | Agent 1 | Input parsing |
| Compilation | Agent 4 | Template generation |
| Grammar | Agent 5 | Structure validation |
| Constraint | Agent 5 | Requirements validation |
| Dataflow | Rendering | Signal binding |
| Negotiation | Post-render | Feedback loop |
| Simulation | Post-generation | Quality gate |
| Evolutionary | Background | Usage tracking |
| Marketplace | Library | Storage/sharing |

### Data Flow

```
LensSpec (Lens)
    │
    ├── Templates (Compilation) ──┬── Validation (Grammar + Constraint)
    │                             │
    └── LLM Generation ───────────┘
                                  │
                                  ▼
                            Render (Dataflow)
                                  │
                     ┌────────────┼────────────┐
                     │            │            │
                Feedback      Success      New Component
             (Negotiation)  (Evolutionary)  (Simulation)
                     │            │            │
                     └────────────┼────────────┘
                                  │
                                  ▼
                           Library (Marketplace)
```

---

## Demo Implementation

### Paradigm Explorer

**Task**: Build interactive section showing all paradigms.

| Section | Content |
|---------|---------|
| Overview | Diagram showing all paradigms and their roles |
| Individual Pages | One page per paradigm with details |
| Integration Demo | Walk through a request showing each paradigm's contribution |
| Comparison | Same request, different paradigm emphasis |

### Integration Visualization

**Task**: Show how paradigms collaborate on a real request.

- Timeline view: which paradigm activates when
- Data flow: what data passes between paradigms
- Decision points: where paradigms influence outcome

---

## Verification Checklist

After completing this plan:

- [ ] Each paradigm's role is clear
- [ ] Integration points are defined
- [ ] Demo shows all paradigms
- [ ] Can trace a request through paradigms
- [ ] Paradigms work together, not in isolation

