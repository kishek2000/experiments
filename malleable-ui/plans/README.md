# Generative UI Platform: Implementation Plans

This directory contains detailed implementation plans for 9 distinct paradigms of generative UI, plus the shared infrastructure they all depend on.

## Overview

Each paradigm represents a fundamentally different way to think about and implement UI generation from content. By implementing and comparing all 9, we can understand the tradeoffs and potentially combine the best aspects of multiple approaches.

## ⚠️ Important: Generative Components Model

> **The AI doesn't just select from fixed components—it GENERATES new components on demand.**
> 
> Read [00a-generative-components-addendum.md](./00a-generative-components-addendum.md) first. It fundamentally changes the architecture:
> - AI generates React/TSX code using Atlaskit primitives
> - Generated components are stored and reused
> - Content experiences (whiteboard, rich text, tables) use battle-tested libraries (tldraw, Tiptap, TanStack)

## Plan Structure

| File | Paradigm | Core Question |
|------|----------|---------------|
| [00-shared-infrastructure.md](./00-shared-infrastructure.md) | **Foundation** | What does every paradigm need? |
| [00a-generative-components-addendum.md](./00a-generative-components-addendum.md) | **Key Revision** | How does AI generate (not just select) components? |
| [01-compilation-paradigm.md](./01-compilation-paradigm.md) | **Compilation** | How do I transform this content? |
| [02-constraint-paradigm.md](./02-constraint-paradigm.md) | **Constraint Satisfaction** | What UI satisfies all requirements? |
| [03-lens-paradigm.md](./03-lens-paradigm.md) | **Projection/Lens** | What view of this content do I want? |
| [04-negotiation-paradigm.md](./04-negotiation-paradigm.md) | **Negotiation/Dialog** | What does this user need right now? |
| [05-marketplace-paradigm.md](./05-marketplace-paradigm.md) | **Component Marketplace** | Which component best represents this? |
| [06-evolutionary-paradigm.md](./06-evolutionary-paradigm.md) | **Evolutionary/Genetic** | What UI performs best? |
| [07-grammar-paradigm.md](./07-grammar-paradigm.md) | **Grammar/Syntax** | What UI is structurally valid? |
| [08-dataflow-paradigm.md](./08-dataflow-paradigm.md) | **Dataflow/Reactive** | How does UI respond to change? |
| [09-simulation-paradigm.md](./09-simulation-paradigm.md) | **Simulation/Agent** | What UI achieves user goals? |

## How to Read These Plans

Each paradigm plan follows a consistent structure:

1. **Executive Summary** - Mental model, core question, metaphor
2. **Why This Paradigm?** - Strengths, weaknesses, when to use
3. **Architecture Overview** - Visual diagram of the approach
4. **Key Concepts** - Important terms and ideas
5. **Task Breakdown** - Detailed, verifiable implementation tasks
6. **Verification Checklist** - How to know when it's done
7. **Extension Points** - Future enhancement ideas

## Task Properties

Each task includes:
- **What to build**: Description without prescribing exact code
- **Acceptance Criteria**: Checkboxes for verification
- **Verification Method**: How to confirm it works

Tasks are designed to be:
- ✅ **Individually verifiable** - Can be tested in isolation
- ✅ **Incrementally valuable** - Each adds working functionality
- ✅ **Reasonably scoped** - 2-8 hours of work typically
- ✅ **Dependency-clear** - Prerequisites are stated

## Implementation Order

### Phase 1: Foundation (Weeks 1-2)
Complete `00-shared-infrastructure.md` first. All paradigms depend on:
- Content model (blocks, store)
- Design system (tokens, components, renderer)
- AI integration (LLM client, prompts)
- Pipeline base class

### Phase 2: First Paradigms (Weeks 3-5)
Start with paradigms that are most different from each other:

1. **Compilation** (Week 3) - Deterministic, rule-based
2. **Lens** (Week 4) - User-centric, persistent views
3. **Constraint** (Week 5) - Declarative requirements

### Phase 3: AI-Heavy Paradigms (Weeks 6-8)
These rely more on LLM intelligence:

4. **Negotiation** (Week 6) - Conversational refinement
5. **Marketplace** (Week 7) - Component competition
6. **Grammar** (Week 8) - Formal structure

### Phase 4: Advanced Paradigms (Weeks 9-11)

7. **Evolutionary** (Week 9) - Learning over time
8. **Dataflow** (Week 10) - Reactive updates
9. **Simulation** (Week 11) - Agent-based testing

### Phase 5: Integration (Weeks 12-13)
- Comparison framework
- Combined approaches
- Documentation

## Paradigm Comparison

| Paradigm | Speed | Quality | Flexibility | Learning | Best For |
|----------|-------|---------|-------------|----------|----------|
| Compilation | ⚡⚡⚡ | ⚡⚡ | ⚡ | - | High volume, clear patterns |
| Constraint | ⚡⚡ | ⚡⚡⚡ | ⚡⚡ | - | Regulated, requirements-heavy |
| Lens | ⚡⚡⚡ | ⚡⚡ | ⚡⚡⚡ | - | Databases, power users |
| Negotiation | ⚡ | ⚡⚡⚡ | ⚡⚡⚡ | ⚡⚡⚡ | New users, complex content |
| Marketplace | ⚡⚡ | ⚡⚡ | ⚡⚡⚡ | ⚡⚡ | Plugin architectures |
| Evolutionary | ⚡ | ⚡⚡⚡ | ⚡⚡ | ⚡⚡⚡ | Long-running, many users |
| Grammar | ⚡⚡⚡ | ⚡⚡⚡ | ⚡ | - | Strict design systems |
| Dataflow | ⚡⚡⚡ | ⚡⚡ | ⚡⚡ | - | Real-time, dashboards |
| Simulation | ⚡ | ⚡⚡⚡ | ⚡⚡ | ⚡⚡ | High-stakes, testing |

## Combining Paradigms

The "right" answer likely combines multiple paradigms:

```
┌─────────────────────────────────────────────────────────┐
│                  HYBRID APPROACH                         │
│                                                          │
│  Grammar     → Guarantees structural validity            │
│      ↓                                                   │
│  Constraint  → Enforces requirements                     │
│      ↓                                                   │
│  Simulation  → Validates usability                       │
│      ↓                                                   │
│  Negotiation → Refines with user                         │
│      ↓                                                   │
│  Lens        → Persists as reusable view                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Total Task Count

| Plan | Tasks |
|------|-------|
| Shared Infrastructure | 12 |
| Compilation | 18 |
| Constraint | 14 |
| Lens | 16 |
| Negotiation | 14 |
| Marketplace | 14 |
| Evolutionary | 16 |
| Grammar | 12 |
| Dataflow | 14 |
| Simulation | 14 |
| **Total** | **~144 tasks** |

## Technology Stack

### Base Design System: Atlaskit
AI generates components using [Atlaskit](https://atlassian.design/) primitives:
- `Box`, `Stack`, `Inline`, `Grid` - Layout
- `Text`, `Heading` - Typography  
- `Button`, `Badge`, `Lozenge` - Interactive/Display
- `xcss` - Token-based styling

### Content Libraries (Don't Reinvent)
| Content Type | Library | Why |
|--------------|---------|-----|
| **Whiteboard** | [tldraw](https://tldraw.dev/) | Best canvas library, used by Notion |
| **Rich Text** | [Tiptap](https://tiptap.dev/) | ProseMirror-based, extensible, Atlassian-like |
| **Database** | [TanStack Table](https://tanstack.com/table) | Headless, performant, flexible |

We generate the **chrome around** these libraries (toolbars, views, sidebars), not the core editing experience.

## Getting Started

1. **Read the addendum first**: `00a-generative-components-addendum.md`
2. Read `00-shared-infrastructure.md` completely
3. Set up project structure per shared infrastructure
4. Implement foundation tasks (block types, store, etc.)
5. Choose first paradigm based on your priorities
6. Work through tasks in order within each plan
7. Verify each task before moving on
8. Use the demo app to see results

## Contributing

When adding to these plans:
- Keep tasks individually verifiable
- Include acceptance criteria
- Don't prescribe exact code
- Focus on what, not how
- Consider dependencies

