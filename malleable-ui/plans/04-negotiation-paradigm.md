# Paradigm 4: Negotiation / Dialog

## Executive Summary

**Mental Model**: UI emerges from ongoing conversation between system and user.

**Core Question**: "What does this user need right now?"

**Metaphor**: Think of an interior designer working with a client. They propose, get feedback, refine, propose again—until the client is satisfied. The final design isn't predetermined; it emerges from the negotiation.

---

## Why This Paradigm?

The negotiation approach works well because:

1. **Personalized**: UI adapts to individual user
2. **Iterative**: Gets better with feedback
3. **Conversational**: Natural interaction model
4. **Learning**: Builds user model over time
5. **Explainable**: System can justify proposals

**Best suited for**:
- New users whose preferences are unknown
- Complex content with many valid presentations
- Users who want agency over UI decisions
- Situations where one-size-fits-all fails

**Less suited for**:
- High-volume, batch processing
- Users who want zero interaction
- Time-critical applications
- Content with obvious single presentation

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    USER MODEL                            │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐              │
│  │ Explicit │ │ Implicit │ │ Rejection  │              │
│  │Preferences│ │ Signals │ │  Patterns  │              │
│  └──────────┘ └──────────┘ └────────────┘              │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   DIALOG MANAGER                         │
│                                                          │
│  ┌──────┐    ┌─────────┐    ┌────────┐    ┌─────────┐  │
│  │START │───▶│PROPOSING│───▶│AWAITING│───▶│REFINING │  │
│  └──────┘    └─────────┘    │FEEDBACK│    └────┬────┘  │
│                              └────────┘         │       │
│                                   │             │       │
│                                   └─────────────┘       │
│                                         │               │
│                                    ┌────▼────┐          │
│                                    │CONVERGED│          │
│                                    └─────────┘          │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                PROPOSAL GENERATOR                        │
│    ┌─────────────────────────────────────────────┐      │
│    │  Initial Proposal  │  Refinement Proposal   │      │
│    └─────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

---

## Key Concepts

### Dialog States

| State | Description | Transitions |
|-------|-------------|-------------|
| `initial` | Just started, no history | → proposing |
| `proposing` | Generating a proposal | → awaiting-feedback |
| `awaiting-feedback` | Showing proposal, waiting | → refining, converged |
| `refining` | Processing feedback | → proposing |
| `converged` | User accepted, done | → (end) |

### User Model

Persistent representation of user preferences:
- **Explicit**: Things user directly stated
- **Implicit**: Inferred from behavior
- **Rejection patterns**: What they don't like

### Proposal

A UI suggestion with:
- The actual UISpec
- Confidence score
- Explanation of why this was proposed
- Alternatives considered

### Feedback Types

| Type | Example | Action |
|------|---------|--------|
| Accept | "This is good" | Converge |
| Reject | "No, not that" | Update model, re-propose |
| Refine | "Make it more compact" | Adjust and re-propose |
| Compare | "Show me alternatives" | Present options |
| Specific | "Use a table instead" | Direct modification |

---

## Task Breakdown

### Phase 1: User Model

#### Task 1.1: Define User Model Schema
**File**: `src/paradigms/negotiation/model/user-model.ts`

**What to build**:
Schema for representing user preferences.

**User Model Structure**:

| Category | Fields |
|----------|--------|
| **Explicit Preferences** | preferredViews, preferredTheme, density, fontSize |
| **Implicit Signals** | dwellTime per view, editFrequency, scrollDepth |
| **Rejection Patterns** | rejectedComponents, rejectedLayouts, rejectedColors |
| **Context History** | previousSessions, contentTypesViewed |
| **Feedback History** | pastFeedback with timestamps |

**Preference Confidence**:
Each preference has a confidence level based on:
- How recently expressed/observed
- How many times confirmed
- Consistency across contexts

**Acceptance Criteria**:
- [ ] All preference types captured
- [ ] Confidence scores meaningful
- [ ] History is bounded (doesn't grow forever)
- [ ] Can merge explicit and implicit signals
- [ ] Serializable for persistence

**Verification**: Create user models; verify they capture preferences accurately.

---

#### Task 1.2: Implement User Model Store
**File**: `src/paradigms/negotiation/model/model-store.ts`

**What to build**:
Persistence layer for user models.

**Operations**:

| Operation | Description |
|-----------|-------------|
| `getModel(userId)` | Retrieve user's model |
| `updateModel(userId, update)` | Apply update to model |
| `recordFeedback(userId, feedback)` | Store feedback event |
| `recordImplicit(userId, signal)` | Store implicit signal |
| `decay()` | Age old preferences (reduce confidence) |
| `exportModel(userId)` | Export for portability |

**Acceptance Criteria**:
- [ ] CRUD operations work
- [ ] Updates merge correctly
- [ ] Decay reduces old preference confidence
- [ ] Export produces portable format
- [ ] Handles missing users gracefully

**Verification**: Store and retrieve models; verify persistence.

---

#### Task 1.3: Implement Preference Inference
**File**: `src/paradigms/negotiation/model/inference.ts`

**What to build**:
Infer preferences from behavior.

**Inference Rules**:

| Signal | Inference |
|--------|-----------|
| Long dwell time on kanban | prefers kanban for databases |
| Quick switch away from table | may not prefer table |
| Frequently expands sections | prefers expanded by default |
| Often uses dark mode toggle | prefers dark theme |
| High edit frequency in view | effective view for this user |

**Inference Process**:
1. Collect behavioral signals
2. Apply inference rules
3. Calculate confidence
4. Update user model

**Acceptance Criteria**:
- [ ] All signal types processed
- [ ] Inferences are reasonable
- [ ] Confidence reflects evidence strength
- [ ] Can disable inference (privacy)
- [ ] Transparent (user can see inferences)

**Verification**: Generate signals; verify inferences correct.

---

### Phase 2: Dialog Manager

#### Task 2.1: Define Dialog State Machine
**File**: `src/paradigms/negotiation/dialog/state-machine.ts`

**What to build**:
Formal state machine for dialog flow.

**States and Transitions**:

| State | Triggers | Next State |
|-------|----------|------------|
| initial | startDialog() | proposing |
| proposing | proposalReady() | awaiting-feedback |
| awaiting-feedback | userAccepts() | converged |
| awaiting-feedback | userRejects() | refining |
| awaiting-feedback | userRefines() | refining |
| refining | refinementReady() | proposing |
| converged | (terminal) | - |

**State Context**:
- Current proposal
- Feedback history this session
- User model reference
- Content being viewed

**Acceptance Criteria**:
- [ ] All states and transitions defined
- [ ] Invalid transitions rejected
- [ ] Context maintained across transitions
- [ ] Can serialize/restore state
- [ ] Timeout handling (user abandons)

**Verification**: Walk through all paths; verify state management.

---

#### Task 2.2: Implement Dialog Manager
**File**: `src/paradigms/negotiation/dialog/manager.ts`

**What to build**:
Core dialog orchestrator.

**Manager Responsibilities**:
1. Manage state machine
2. Coordinate proposal generation
3. Process user feedback
4. Update user model
5. Determine convergence

**Methods**:

| Method | Description |
|--------|-------------|
| `startDialog(content, user)` | Begin negotiation |
| `getCurrentProposal()` | Get current proposal |
| `submitFeedback(feedback)` | Process user feedback |
| `getAlternatives()` | Get alternative proposals |
| `acceptCurrent()` | Accept current proposal |
| `getExplanation()` | Why current proposal |

**Acceptance Criteria**:
- [ ] Full dialog flow works
- [ ] State transitions correct
- [ ] Feedback updates model
- [ ] Converges in reasonable iterations
- [ ] Handles edge cases (cancel, timeout)

**Verification**: Complete dialogs; verify flow is natural.

---

### Phase 3: Proposal Generator

#### Task 3.1: Implement Initial Proposal Generator
**File**: `src/paradigms/negotiation/proposals/initial.ts`

**What to build**:
Generate first proposal based on content and user model.

**Generation Strategy**:
1. Analyze content structure
2. Consider user preferences
3. Consider context (viewport, time)
4. Generate candidate proposals
5. Score and select best
6. Return with explanation

**Scoring Factors**:

| Factor | Weight |
|--------|--------|
| Content fit | 0.3 |
| User preference match | 0.4 |
| Context appropriateness | 0.2 |
| Novelty (avoid repetition) | 0.1 |

**Acceptance Criteria**:
- [ ] Proposals appropriate for content
- [ ] User preferences influence result
- [ ] Explanation makes sense
- [ ] Generates within time budget
- [ ] Handles new users (cold start)

**Verification**: Generate initial proposals; verify quality.

---

#### Task 3.2: Implement Refinement Proposal Generator
**File**: `src/paradigms/negotiation/proposals/refinement.ts`

**What to build**:
Generate refined proposal based on feedback.

**Refinement Strategies by Feedback Type**:

| Feedback | Strategy |
|----------|----------|
| "Too busy" | Reduce density, hide less important |
| "Too sparse" | Add fields, increase density |
| "Wrong view" | Switch view type |
| "Wrong grouping" | Change groupBy field |
| "Wrong order" | Change sort |
| "More color" | Add status badges, colored headers |

**Process**:
1. Parse feedback to identify changes
2. Apply changes to previous proposal
3. Verify still valid
4. Return with explanation of changes

**Acceptance Criteria**:
- [ ] Understands common feedback
- [ ] Changes are targeted (minimal diff)
- [ ] Preserves good aspects
- [ ] Explains what changed and why
- [ ] Handles ambiguous feedback

**Verification**: Provide feedback; verify refinements appropriate.

---

#### Task 3.3: Implement Alternative Generator
**File**: `src/paradigms/negotiation/proposals/alternatives.ts`

**What to build**:
Generate diverse alternatives for comparison.

**Diversity Strategy**:
1. Generate proposals with different views
2. Generate proposals with different layouts
3. Generate proposals with different focus
4. Ensure variety (not similar options)

**Alternative Categories**:

| Category | Examples |
|----------|----------|
| View type | Table vs. Kanban vs. Calendar |
| Density | Compact vs. Comfortable vs. Spacious |
| Focus | Overview vs. Detail vs. Action |
| Grouping | By status vs. By assignee vs. By date |

**Acceptance Criteria**:
- [ ] Alternatives are genuinely different
- [ ] Each alternative is valid
- [ ] Reasonable number (3-5)
- [ ] Covers different user intents
- [ ] Clear differentiation explained

**Verification**: Generate alternatives; verify diversity.

---

### Phase 4: Feedback Processing

#### Task 4.1: Implement Feedback Interpreter
**File**: `src/paradigms/negotiation/feedback/interpreter.ts`

**What to build**:
Parse natural language feedback into structured actions.

**Feedback to Action Mapping**:

| Feedback Pattern | Action |
|------------------|--------|
| "yes", "looks good", "perfect" | Accept |
| "no", "wrong", "not what I want" | Reject |
| "try {view}" | SwitchView(view) |
| "sort by {field}" | ChangeSort(field) |
| "group by {field}" | ChangeGrouping(field) |
| "show {field}" | AddField(field) |
| "hide {field}" | RemoveField(field) |
| "more {quality}" | Adjust(quality, +) |
| "less {quality}" | Adjust(quality, -) |

**LLM Interpretation**:
For ambiguous feedback, use LLM to interpret:
- Input: feedback text, current proposal, content schema
- Output: structured action(s)

**Acceptance Criteria**:
- [ ] Common patterns recognized without LLM
- [ ] Ambiguous feedback handled via LLM
- [ ] Multiple actions from one feedback
- [ ] Confidence score for interpretation
- [ ] Fallback for uninterpretable feedback

**Verification**: Test various feedback strings; verify interpretation.

---

#### Task 4.2: Implement Implicit Feedback Capture
**File**: `src/paradigms/negotiation/feedback/implicit.ts`

**What to build**:
Capture behavioral signals during proposal viewing.

**Signals to Capture**:

| Signal | Meaning |
|--------|---------|
| View duration | Interest level |
| Scroll depth | Content engagement |
| Hover patterns | Areas of interest |
| Click patterns | Important elements |
| Edit actions | Functional view |
| Quick dismiss | Not useful |
| Slow review | Considering carefully |

**Signal Collection**:
- Event listeners for interactions
- Time tracking
- Scroll position tracking
- Aggregation over session

**Acceptance Criteria**:
- [ ] All signal types captured
- [ ] Non-intrusive (doesn't affect UX)
- [ ] Privacy-respecting (can disable)
- [ ] Signals are normalized
- [ ] Real-time and batch modes

**Verification**: Interact with proposals; verify signals captured.

---

### Phase 5: Convergence & Learning

#### Task 5.1: Implement Convergence Detection
**File**: `src/paradigms/negotiation/convergence/detection.ts`

**What to build**:
Detect when dialog should end.

**Convergence Signals**:

| Signal | Weight |
|--------|--------|
| Explicit acceptance | 1.0 (immediate) |
| No changes for N iterations | 0.8 |
| High implicit engagement | 0.6 |
| Proposal score above threshold | 0.5 |
| User starts working (editing content) | 0.9 |

**Anti-convergence Signals**:
- User asking for alternatives
- Low engagement metrics
- Continued feedback

**Acceptance Criteria**:
- [ ] Explicit acceptance works immediately
- [ ] Implicit convergence detected
- [ ] Doesn't converge prematurely
- [ ] Timeout after max iterations
- [ ] User can override (keep negotiating)

**Verification**: Simulate dialogs; verify convergence appropriate.

---

#### Task 5.2: Implement Model Updater
**File**: `src/paradigms/negotiation/convergence/model-updater.ts`

**What to build**:
Update user model after dialog concludes.

**Updates to Apply**:

| Event | Update |
|-------|--------|
| Accepted proposal | Reinforce preferences that led to it |
| Rejected proposal | Record rejection pattern |
| Specific feedback | Extract explicit preference |
| Implicit signals | Update implicit preferences |

**Learning Rate**:
- Single instance: low confidence
- Repeated pattern: high confidence
- Recent > old

**Acceptance Criteria**:
- [ ] Model updated correctly
- [ ] Learning rate appropriate
- [ ] Negative feedback recorded
- [ ] History maintained for review
- [ ] Can undo learning (user corrects)

**Verification**: Complete dialogs; verify model updates.

---

### Phase 6: Pipeline Integration

#### Task 6.1: Implement Negotiation Pipeline
**File**: `src/paradigms/negotiation/pipeline.ts`

**What to build**:
Complete pipeline extending GenerationPipeline base.

**Pipeline Modes**:
| Mode | Behavior |
|------|----------|
| `interactive` | Full dialog with user |
| `best-guess` | Single proposal based on model |
| `batch` | Process multiple contents silently |

**Pipeline Steps** (interactive):
1. Load/create user model
2. Analyze content
3. Initialize dialog manager
4. Generate initial proposal
5. Wait for feedback
6. Refine or converge
7. Update model
8. Return final result

**Acceptance Criteria**:
- [ ] All modes work correctly
- [ ] Interactive mode handles async
- [ ] Model persistence works
- [ ] Metadata tracks dialog history
- [ ] Graceful degradation

**Verification**: Run in each mode; verify behavior.

---

### Phase 7: Dialog UI

#### Task 7.1: Implement Proposal Preview
**File**: `src/paradigms/negotiation/ui/proposal-preview.tsx`

**What to build**:
Display current proposal with feedback affordances.

**UI Elements**:
| Element | Purpose |
|---------|---------|
| Full preview | Rendered UISpec |
| Accept button | Accept current |
| Refine input | Text field for feedback |
| Alternatives button | Show other options |
| Explanation panel | Why this proposal |
| History rail | Previous proposals |

**Acceptance Criteria**:
- [ ] Preview renders correctly
- [ ] Feedback input works
- [ ] Can navigate history
- [ ] Explanation is visible
- [ ] Responsive layout

**Verification**: Use UI; verify usability.

---

#### Task 7.2: Implement Alternatives Comparison
**File**: `src/paradigms/negotiation/ui/alternatives-view.tsx`

**What to build**:
Compare multiple proposals side-by-side.

**Comparison Features**:
| Feature | Description |
|---------|-------------|
| Grid view | 2-4 proposals visible |
| Highlight differences | Show what varies |
| Quick select | One-click to choose |
| Details on demand | Expand for full preview |

**Acceptance Criteria**:
- [ ] Shows multiple alternatives
- [ ] Differences highlighted
- [ ] Can select any alternative
- [ ] Scales to different counts
- [ ] Mobile-friendly (stack vs. grid)

**Verification**: View alternatives; verify comparison effective.

---

#### Task 7.3: Implement Feedback Suggestions
**File**: `src/paradigms/negotiation/ui/feedback-suggestions.tsx`

**What to build**:
Suggest feedback options based on context.

**Suggestion Categories**:
| Category | Examples |
|----------|----------|
| View changes | "Try as kanban", "Switch to table" |
| Layout changes | "More compact", "More spacious" |
| Content changes | "Show more fields", "Hide dates" |
| Sort/filter | "Sort by date", "Filter to active" |

**Dynamic Suggestions**:
- Based on content schema
- Based on current proposal
- Based on user history

**Acceptance Criteria**:
- [ ] Suggestions are relevant
- [ ] Click to use suggestion
- [ ] Limited number (not overwhelming)
- [ ] Update as proposal changes
- [ ] Don't repeat accepted suggestions

**Verification**: Check suggestions; verify relevance.

---

## Verification Checklist

After completing all tasks, verify:

- [ ] Complete dialog flows work
- [ ] User model captures preferences
- [ ] Proposals improve with feedback
- [ ] Convergence happens appropriately
- [ ] UI enables natural conversation
- [ ] Model persists across sessions
- [ ] Performance acceptable

---

## Extension Points

Future enhancements:
1. Multi-user negotiation (collaborative)
2. Voice interface for feedback
3. Proactive suggestions (predict needs)
4. A/B testing of proposals
5. Explainable AI justifications

