# Plan 06: Demo Application

## Overview

The demo application is an **exploration and explanation tool** for the Generative UI Platform. It's built in Remix and serves to:

1. **Explain** the architecture and concepts
2. **Demonstrate** matching, adaptation, and generation
3. **Explore** how paradigms collaborate
4. **Prototype** the user experience
5. **Build** type foundations for the real system

**This is NOT production software.** It's a sandbox for understanding and validating ideas.

---

## Goals & Non-Goals

### Goals

| Goal | Description |
|------|-------------|
| Clarity | Make the invisible visible (scores, decisions, flows) |
| Interactivity | Let users manipulate and see results |
| Comprehensiveness | Cover all concepts from the architecture |
| Type Safety | Define real TypeScript interfaces |
| Aesthetic | Beautiful enough to inspire confidence |

### Non-Goals

| Non-Goal | Why |
|----------|-----|
| Real LLM integration | Mock it, show what would happen |
| Real Confluence integration | Mock content is fine |
| Production deployment | Local dev is sufficient |
| Authentication | Not needed for exploration |
| Data persistence | Session-only is fine |
| Mobile optimization | Desktop-first for this tool |

---

## Application Structure

### Route Structure

```
app/
├── routes/
│   ├── _index.tsx                    # Landing page
│   │
│   ├── concepts/
│   │   ├── _layout.tsx               # Concepts section layout
│   │   ├── _index.tsx                # Concepts overview
│   │   ├── architecture.tsx          # System architecture
│   │   ├── matching-spec.tsx         # MatchingSpec deep dive
│   │   ├── agent-pipeline.tsx        # Pipeline explanation
│   │   └── paradigms.tsx             # 9 paradigms overview
│   │
│   ├── playground/
│   │   ├── _layout.tsx               # Playground layout
│   │   ├── _index.tsx                # Main playground
│   │   ├── content-selector.tsx      # Choose content to work with
│   │   ├── intent-input.tsx          # Enter your request
│   │   ├── matching-view.tsx         # See matching in action
│   │   ├── generation-view.tsx       # See generation (mocked)
│   │   └── result-view.tsx           # See the result
│   │
│   ├── library/
│   │   ├── _layout.tsx               # Library section layout
│   │   ├── _index.tsx                # Browse components
│   │   ├── $componentId.tsx          # Component detail
│   │   └── compare.tsx               # Compare components
│   │
│   ├── paradigms/
│   │   ├── _layout.tsx               # Paradigms section layout
│   │   ├── _index.tsx                # Paradigms comparison
│   │   ├── lens.tsx                  # Lens paradigm explorer
│   │   ├── compilation.tsx           # Compilation explorer
│   │   ├── grammar.tsx               # Grammar explorer
│   │   ├── constraint.tsx            # Constraint explorer
│   │   ├── dataflow.tsx              # Dataflow explorer
│   │   ├── negotiation.tsx           # Negotiation explorer
│   │   ├── simulation.tsx            # Simulation explorer
│   │   ├── evolutionary.tsx          # Evolutionary explorer
│   │   └── marketplace.tsx           # Marketplace explorer
│   │
│   └── dev/
│       ├── types.tsx                 # Type definitions browser
│       └── fixtures.tsx              # Content fixtures viewer
```

---

## Part 1: Landing Page

### Purpose

First impression. Explain what this is and why it matters.

### Sections

| Section | Content |
|---------|---------|
| Hero | "Generative UI Platform" headline, one-line description |
| Problem | What's wrong with current approaches |
| Vision | The new model (retrieve > adapt > generate) |
| Key Concepts | Cards for Matching Spec, Agent Pipeline, Paradigms |
| Try It | CTA to playground |

### Design

- Full-screen hero with animated illustration
- Scroll-triggered animations for concept reveals
- Clean, modern, confident aesthetic
- Use Atlaskit typography and spacing

### Acceptance Criteria

- [ ] Clear value proposition
- [ ] Key concepts introduced
- [ ] Navigation to all sections
- [ ] Visually impressive

---

## Part 2: Concepts Section

### 2.1 Architecture Page

**Purpose**: Explain the overall system architecture.

**Content**:
- The three-tier model (SDK, Service, Edge)
- Data flow diagram (interactive)
- Component lifecycle
- Performance requirements

**Interactive Elements**:
- Click on tiers to expand
- Hover for explanations
- Animated data flow

### 2.2 Matching Spec Page

**Purpose**: Deep dive into the matching specification.

**Content**:
- Why matching matters
- The five signatures (Intent, Schema, Capability, Affordance, Visual)
- Example specs
- How comparison works

**Interactive Elements**:
- Signature explorer (expand each)
- Side-by-side spec comparison
- Matching score calculator

### 2.3 Agent Pipeline Page

**Purpose**: Explain the 5-agent pipeline.

**Content**:
- Overview diagram
- Each agent's role
- Decision points (retrieve/adapt/generate)
- Latency requirements

**Interactive Elements**:
- Step-through animation
- Click agent to expand
- Show sample inputs/outputs

### 2.4 Paradigms Overview Page

**Purpose**: Introduce all 9 paradigms and their roles.

**Content**:
- Table of paradigms with roles
- Collaboration diagram
- Which paradigm when

**Interactive Elements**:
- Click paradigm for detail
- Filter by pipeline stage
- Compare paradigms

### Acceptance Criteria

- [ ] Architecture is comprehensible
- [ ] Matching spec is demystified
- [ ] Pipeline flow is clear
- [ ] Paradigm roles are understood

---

## Part 3: Playground

### 3.1 Content Selector

**Purpose**: Choose what content to work with.

**Features**:
| Feature | Description |
|---------|-------------|
| Content type tabs | Page / Whiteboard / Database |
| Fixture selector | Choose from mock content |
| Content preview | See what you're selecting |
| Schema display | Show content schema |

**Acceptance Criteria**:
- [ ] Can select any content type
- [ ] Fixtures load correctly
- [ ] Preview shows content structure
- [ ] Schema is visible

### 3.2 Intent Input

**Purpose**: Express what you want.

**Features**:
| Feature | Description |
|---------|-------------|
| Natural language input | Type your request |
| Common intents | Quick buttons for common requests |
| Parsed intent display | Show IntentSignature |
| Schema analysis | Show SchemaSignature |

**Acceptance Criteria**:
- [ ] Can type natural language
- [ ] Quick buttons work
- [ ] Parsed intent is shown
- [ ] Schema is extracted

### 3.3 Matching View

**Purpose**: See matching in real-time.

**Features**:
| Feature | Description |
|---------|-------------|
| Candidate list | Ranked components |
| Score breakdown | Expand to see per-signature scores |
| Match explanation | Why each matched/didn't |
| Threshold visualization | Where retrieve/adapt/generate zones are |
| Decision indicator | What the system decided |

**Acceptance Criteria**:
- [ ] Candidates ranked correctly
- [ ] Scores update as intent changes
- [ ] Explanations are helpful
- [ ] Decision is clear

### 3.4 Generation View (Mocked)

**Purpose**: Show what generation looks like.

**Features**:
| Feature | Description |
|---------|-------------|
| Prompt display | What would be sent to LLM |
| Progress simulation | Fake streaming response |
| Code output | The "generated" code |
| Spec output | The "generated" MatchingSpec |

**Acceptance Criteria**:
- [ ] Shows realistic prompt
- [ ] Simulates generation delay
- [ ] Output looks generated
- [ ] Spec is valid

### 3.5 Result View

**Purpose**: See the final rendered result.

**Features**:
| Feature | Description |
|---------|-------------|
| Rendered component | The actual UI |
| Adaptation display | If adapted, show mappings |
| Validation results | Checks that passed |
| Refinement input | "Make it more compact" |

**Acceptance Criteria**:
- [ ] Component renders correctly
- [ ] Adaptation visible if used
- [ ] Validation results shown
- [ ] Can trigger refinement

### 3.6 Full Flow Demo

**Purpose**: Walk through the entire pipeline.

**Features**:
| Feature | Description |
|---------|-------------|
| Step indicator | Where in pipeline |
| Step-by-step mode | Advance manually |
| Auto mode | Watch it flow |
| Timeline | Latency at each step |

**Acceptance Criteria**:
- [ ] Full pipeline visible
- [ ] Can step through
- [ ] Timeline accurate
- [ ] All decisions visible

---

## Part 4: Component Library

### 4.1 Library Browser

**Purpose**: Browse all components.

**Features**:
| Feature | Description |
|---------|-------------|
| Grid view | Thumbnail + name |
| List view | More details |
| Filters | By goal, layout, capability |
| Search | By name, description |
| Sort | By usage, rating, recency |

**Acceptance Criteria**:
- [ ] All components visible
- [ ] Filtering works
- [ ] Search finds components
- [ ] Views toggle

### 4.2 Component Detail

**Purpose**: Deep dive into a component.

**Sections**:
| Section | Content |
|---------|---------|
| Header | Name, version, description |
| Preview | Live render with mock data |
| Matching Spec | Full spec, collapsible |
| Code | Source with highlighting |
| Provenance | How it was created |
| Stats | Usage, rating |
| Related | Similar components |

**Acceptance Criteria**:
- [ ] All sections render
- [ ] Spec is explorable
- [ ] Code is readable
- [ ] Related components linked

### 4.3 Component Comparison

**Purpose**: Compare two components.

**Features**:
| Feature | Description |
|---------|-------------|
| Side-by-side | Two components |
| Spec diff | Highlight differences |
| Preview comparison | Same data, different component |
| Score comparison | How they'd match same query |

**Acceptance Criteria**:
- [ ] Can select two components
- [ ] Differences highlighted
- [ ] Both render with same data
- [ ] Scores shown

---

## Part 5: Paradigm Explorers

### Each Paradigm Page

**Structure** (same for all 9):

| Section | Content |
|---------|---------|
| Overview | What this paradigm is |
| Role | Where it fits in the system |
| Key Concepts | Paradigm-specific ideas |
| Demo | Interactive demonstration |
| Collaboration | How it works with others |

### Paradigm-Specific Demos

| Paradigm | Demo |
|----------|------|
| **Lens** | Edit a LensSpec, see how it affects matching |
| **Compilation** | See templates, watch hydration |
| **Grammar** | Interactive grammar tree, validation demo |
| **Constraint** | Check constraints, see violations |
| **Dataflow** | Signal graph visualization |
| **Negotiation** | Refinement conversation |
| **Simulation** | Run simulated user, see results |
| **Evolutionary** | Library analytics, trends |
| **Marketplace** | Contribution flow |

**Acceptance Criteria**:
- [ ] Each paradigm has dedicated page
- [ ] Role is clear
- [ ] Demo is interactive
- [ ] Collaboration shown

---

## Part 6: Shared Components

### UI Components

| Component | Description |
|-----------|-------------|
| `<CodeBlock>` | Syntax-highlighted code |
| `<SpecViewer>` | Collapsible spec display |
| `<ScoreBar>` | Visual score indicator |
| `<PipelineStep>` | Step in pipeline |
| `<ComponentCard>` | Component preview card |
| `<SignatureCompare>` | Side-by-side signatures |
| `<DecisionTree>` | Visualize decisions |
| `<LatencyTimeline>` | Show timing |

### Layout Components

| Component | Description |
|-----------|-------------|
| `<PageLayout>` | Standard page layout |
| `<SplitView>` | Two-pane layout |
| `<TabLayout>` | Tabbed content |
| `<DrawerLayout>` | With slide-out drawer |

### Interactive Components

| Component | Description |
|-----------|-------------|
| `<IntentInput>` | Natural language + parse |
| `<ContentSelector>` | Choose content |
| `<MatchingVisualizer>` | Matching demo |
| `<ParadigmSelector>` | Choose paradigm to explore |

---

## Part 7: State Management

### Global State

```typescript
interface AppState {
  // Selected content
  content: {
    type: 'page' | 'whiteboard' | 'database';
    fixture: string;
    data: Block[];
  };
  
  // Current intent
  intent: {
    raw: string;
    parsed: IntentSignature | null;
    schema: SchemaSignature | null;
  };
  
  // Matching results
  matching: {
    candidates: RankedCandidate[];
    decision: MatchDecision | null;
    adaptation: AdaptationInstruction | null;
  };
  
  // Generated component (if any)
  generation: {
    inProgress: boolean;
    result: GenerationResult | null;
  };
  
  // Component library
  library: {
    components: ComponentEntry[];
    filters: ComponentFilter;
  };
}
```

### State Management Choice

Use React Context + useReducer for simplicity:
- No external dependencies
- Good enough for demo
- Easy to understand

---

## Part 8: Styling

### Design System

Use Atlaskit primitives where possible:
- `Box`, `Stack`, `Inline` for layout
- `Text`, `Heading` for typography
- `Button`, `Badge` for UI elements
- Tokens for colors, spacing

### Custom Styling

Where Atlaskit doesn't cover:
- Tailwind CSS for custom styles
- CSS modules for component-specific
- Consistent with Atlaskit tokens

### Theme

- Light mode default
- Dark mode toggle (optional)
- High contrast support

---

## Part 9: Implementation Order

### Phase 1: Foundation (Week 1)

| Task | Description |
|------|-------------|
| Project setup | Remix, Tailwind, Atlaskit |
| Type definitions | All TypeScript interfaces |
| Mock data | Content fixtures |
| Mock library | 15+ components with specs |
| Shared components | Basic UI components |

### Phase 2: Concepts (Week 2)

| Task | Description |
|------|-------------|
| Landing page | Hero and concept cards |
| Architecture page | Diagrams and explanations |
| Matching spec page | Signature explorer |
| Pipeline page | Agent visualization |
| Paradigms overview | Role comparison |

### Phase 3: Playground (Week 3)

| Task | Description |
|------|-------------|
| Content selector | Choose content |
| Intent input | Express intent |
| Matching view | See matching |
| Generation view | Mock generation |
| Result view | See output |
| Full flow | Step-through demo |

### Phase 4: Library (Week 4)

| Task | Description |
|------|-------------|
| Library browser | Browse components |
| Component detail | Deep dive |
| Component comparison | Compare two |

### Phase 5: Paradigms (Week 5)

| Task | Description |
|------|-------------|
| Lens explorer | LensSpec editing |
| Other paradigms | 8 more explorers |
| Integration demo | Paradigms working together |

### Phase 6: Polish (Week 6)

| Task | Description |
|------|-------------|
| Animations | Smooth transitions |
| Responsiveness | Tablet support |
| Accessibility | Keyboard, screen reader |
| Final review | Bug fixes, polish |

---

## Verification Checklist

After completing the demo:

- [ ] Landing page explains the vision
- [ ] Concepts are clearly explained
- [ ] Playground demonstrates full flow
- [ ] Library is browsable and useful
- [ ] Each paradigm has working explorer
- [ ] Types are comprehensive
- [ ] Mock data is realistic
- [ ] App is visually polished
- [ ] Navigation is intuitive
- [ ] Someone new can understand the system

---

## Success Criteria

**The demo is successful if someone can:**

1. Understand what we're building by visiting the landing page
2. Grasp how matching works by using the matching view
3. See how paradigms collaborate by exploring the paradigm section
4. Get intuition for retrieve vs adapt vs generate through the playground
5. Appreciate the architectural decisions through the concepts section

