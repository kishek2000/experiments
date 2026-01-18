# Paradigm 9: Simulation / Agent-Based

## Executive Summary

**Mental Model**: Simulate users to discover the optimal UI before real users see it.

**Core Question**: "What UI achieves user goals most effectively?"

**Metaphor**: Think of a flight simulator. Pilots practice in simulation before flying real planes. Similarly, UI candidates are tested in simulation with synthetic users before being shown to real users.

---

## Why This Paradigm?

The simulation approach works well because:

1. **Pre-validation**: Test before real users see it
2. **Diverse perspectives**: Simulate many user types
3. **Objective**: Measurable outcomes
4. **Scalable**: Run thousands of simulations
5. **Safe**: No real user frustration

**Best suited for**:
- High-stakes UIs where mistakes are costly
- When user testing is expensive/slow
- Optimizing task completion
- Accessibility validation

**Less suited for**:
- Novel/creative UIs (hard to simulate reactions)
- Emotional/aesthetic optimization
- When simulation fidelity is low
- Simple content with obvious UI

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    PERSONAS                              │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│  │  PM    │ │  Dev   │ │  Exec  │ │ Newbie │           │
│  │Persona │ │Persona │ │Persona │ │Persona │           │
│  └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘           │
└──────┼──────────┼──────────┼──────────┼─────────────────┘
       │          │          │          │
       └──────────┴──────────┴──────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                     TASKS                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Find status │ Update item │ Overview │ Search    │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 SIMULATION ENGINE                        │
│                                                          │
│  For each (UI Candidate × Persona × Task):              │
│    1. Place simulated user at UI                        │
│    2. User attempts task                                │
│    3. Record: success, time, errors, path              │
│                                                          │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 AGGREGATION                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ UI A: 85% success, 12s avg, 0.3 errors          │   │
│  │ UI B: 78% success, 18s avg, 0.8 errors          │   │
│  │ UI C: 92% success, 10s avg, 0.1 errors ←WINNER  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Key Concepts

### Personas

Simulated user archetypes with characteristics:
- Technical skill level
- Domain expertise
- Patience/attention span
- Exploration tendency
- Accessibility needs

### Tasks

Goals users want to accomplish:
- Find specific information
- Update/modify data
- Get overview/summary
- Navigate to related content
- Complete workflow

### Simulation Run

A single persona attempting a single task on a single UI:
- Starting state
- Actions taken (click, scroll, type)
- Outcome (success/failure)
- Metrics (time, errors, path length)

### Agent

The LLM-powered "brain" that decides what actions a simulated user takes, based on:
- What they see (UI state)
- What they want (task goal)
- Who they are (persona traits)

---

## Task Breakdown

### Phase 1: Persona System

#### Task 1.1: Define Persona Schema
**File**: `src/paradigms/simulation/types/persona.ts`

**What to build**:
Schema for defining simulated user personas.

**Persona Attributes**:

| Attribute | Range | Description |
|-----------|-------|-------------|
| `technicalSkill` | 1-10 | Comfort with technology |
| `domainExpertise` | 1-10 | Knowledge of content domain |
| `attentionSpan` | 1-10 | Patience for complex UIs |
| `toleranceForComplexity` | 1-10 | Handles dense information |
| `explorationTendency` | 1-10 | Tries vs. gives up quickly |
| `readingSpeed` | wpm | Words per minute |
| `clickAccuracy` | 0-1 | Motor control precision |

**Accessibility Attributes**:
| Attribute | Description |
|-----------|-------------|
| `visualAcuity` | Vision impairment level |
| `colorVision` | Color blindness type |
| `motorControl` | Fine motor ability |
| `cognitiveLoad` | Processing capacity |
| `useScreenReader` | Boolean |
| `useKeyboardOnly` | Boolean |

**Acceptance Criteria**:
- [ ] All attributes defined
- [ ] Ranges are meaningful
- [ ] Combinations produce realistic users
- [ ] Accessibility needs expressible
- [ ] Personas are serializable

**Verification**: Create diverse personas; verify they make sense.

---

#### Task 1.2: Implement Default Personas
**File**: `src/paradigms/simulation/personas/defaults.ts`

**What to build**:
Pre-defined realistic personas.

**Default Personas**:

| Persona | Profile |
|---------|---------|
| **PM (Sarah)** | High domain expertise, moderate technical skill, moderate patience, scans for status |
| **Developer (Alex)** | High technical skill, moderate domain, low patience for bad UX, keyboard-oriented |
| **Executive (Jordan)** | Low technical skill, high domain, very low patience, wants quick overview |
| **New User (Taylor)** | Low everything, high exploration, easily overwhelmed |
| **Accessibility User (Morgan)** | Screen reader user, keyboard only, high patience |
| **Power User (Casey)** | High everything, finds edge cases, uses shortcuts |

**Acceptance Criteria**:
- [ ] At least 6 diverse personas
- [ ] Cover common user types
- [ ] Include accessibility persona
- [ ] Attributes are realistic
- [ ] Can customize defaults

**Verification**: Validate personas with stakeholders.

---

#### Task 1.3: Implement Persona Generator
**File**: `src/paradigms/simulation/personas/generator.ts`

**What to build**:
Generate random personas for broader testing.

**Generation Strategy**:
- Sample from distributions for each attribute
- Ensure coherence (e.g., high technical → faster clicking)
- Option to bias toward specific profiles
- Generate accessibility variants

**Acceptance Criteria**:
- [ ] Generates coherent personas
- [ ] Controllable distribution
- [ ] Can generate thousands quickly
- [ ] Includes accessibility representation
- [ ] Reproducible (seeded)

**Verification**: Generate many personas; verify distribution.

---

### Phase 2: Task Definitions

#### Task 2.1: Define Task Schema
**File**: `src/paradigms/simulation/types/task.ts`

**What to build**:
Schema for defining tasks users attempt.

**Task Structure**:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Display name |
| `description` | string | What to accomplish |
| `goal` | GoalSpec | How to know if succeeded |
| `startingContext` | Context | Where user begins |
| `maxTime` | number | Timeout in seconds |
| `difficulty` | number | Expected difficulty |

**Goal Types**:
| Type | Description |
|------|-------------|
| `find-value` | Locate specific information |
| `update-value` | Change a field to target value |
| `navigate-to` | Reach a specific location |
| `complete-action` | Perform action (create, delete) |
| `verify-state` | Confirm something is true |

**Acceptance Criteria**:
- [ ] All goal types expressible
- [ ] Success is objectively verifiable
- [ ] Starting context is clear
- [ ] Timeout is reasonable
- [ ] Difficulty is calibrated

**Verification**: Define tasks; verify they're testable.

---

#### Task 2.2: Implement Default Tasks
**File**: `src/paradigms/simulation/tasks/defaults.ts`

**What to build**:
Pre-defined common tasks.

**Default Tasks**:

| Task | Goal | Content Type |
|------|------|--------------|
| `find-status` | Find status of specific item | Database |
| `update-status` | Change item status | Database |
| `find-assignee` | Find who owns item | Database |
| `reassign` | Change assignee | Database |
| `count-by-status` | How many in each status | Database |
| `find-overdue` | Find items past due date | Database |
| `read-section` | Read specific section | Page |
| `find-heading` | Navigate to heading | Page |
| `scan-overview` | Get general understanding | Any |

**Acceptance Criteria**:
- [ ] Tasks cover common scenarios
- [ ] Multiple content types covered
- [ ] Range of difficulties
- [ ] Goals are verifiable
- [ ] Clear success criteria

**Verification**: Manually complete tasks; verify feasibility.

---

### Phase 3: Agent Simulator

#### Task 3.1: Define Agent Action Space
**File**: `src/paradigms/simulation/agent/actions.ts`

**What to build**:
Define what actions simulated users can take.

**Action Types**:

| Action | Parameters | Description |
|--------|------------|-------------|
| `click` | target | Click on element |
| `hover` | target | Mouse over element |
| `scroll` | direction, amount | Scroll viewport |
| `type` | text | Enter text |
| `select` | option | Choose from dropdown |
| `drag` | from, to | Drag and drop |
| `keyboard` | key | Press key |
| `wait` | duration | Pause |
| `give-up` | reason | Abandon task |

**Target Specification**:
- By role (button, link, input)
- By text content
- By position (coordinates)
- By accessibility label

**Acceptance Criteria**:
- [ ] All UI interactions covered
- [ ] Targets precisely specifiable
- [ ] Actions are executable
- [ ] Keyboard-only subset defined
- [ ] Can record action sequence

**Verification**: Execute actions; verify they work.

---

#### Task 3.2: Implement UI State Extractor
**File**: `src/paradigms/simulation/agent/state-extractor.ts`

**What to build**:
Extract observable state for agent to "see".

**State Representation**:

| Component | What Agent Sees |
|-----------|-----------------|
| Structure | Hierarchy of elements |
| Content | Text content |
| Interactive | Buttons, links, inputs |
| Selection | What's selected/focused |
| Visibility | What's in viewport |
| Feedback | Error messages, loading states |

**Extraction for LLM**:
- Convert UI state to text description
- Highlight actionable elements
- Include accessibility labels
- Keep concise (token budget)

**Acceptance Criteria**:
- [ ] Captures all relevant state
- [ ] Concise for LLM consumption
- [ ] Actionable elements identified
- [ ] Accessibility info included
- [ ] Updates on UI change

**Verification**: Extract state; verify completeness.

---

#### Task 3.3: Implement LLM Agent
**File**: `src/paradigms/simulation/agent/llm-agent.ts`

**What to build**:
LLM-powered decision-making for simulated user.

**Agent Prompt Structure**:
```
You are simulating a user with these characteristics:
[Persona description]

Your goal is:
[Task description]

Current UI state:
[Extracted state]

Previous actions taken:
[Action history]

What action should you take next?
Available actions: [action space]

Respond with a single action and brief reasoning.
```

**Persona Influence**:
- Low technical skill → simpler action choices
- Low patience → faster give-up
- High exploration → tries more options

**Acceptance Criteria**:
- [ ] Agent makes sensible decisions
- [ ] Persona influences behavior
- [ ] Eventually completes or gives up
- [ ] Doesn't loop forever
- [ ] Actions are valid

**Verification**: Run agent on tasks; verify behavior.

---

#### Task 3.4: Implement Timing Model
**File**: `src/paradigms/simulation/agent/timing.ts`

**What to build**:
Realistic timing for simulated actions.

**Timing Factors**:

| Factor | Impact |
|--------|--------|
| Reading speed | Time to read text |
| Click time | Based on Fitts's law |
| Think time | Decision latency |
| Typing speed | Characters per second |
| Scroll speed | Based on content |

**Persona Adjustments**:
- Low technical skill → slower
- High expertise → faster scanning
- Screen reader → different timing model

**Acceptance Criteria**:
- [ ] Timing is realistic
- [ ] Persona-adjusted
- [ ] Fitts's law implemented
- [ ] Configurable parameters
- [ ] Accessibility timing correct

**Verification**: Compare to real user studies.

---

### Phase 4: Simulation Engine

#### Task 4.1: Implement Simulation Runner
**File**: `src/paradigms/simulation/engine/runner.ts`

**What to build**:
Execute single simulation run.

**Simulation Loop**:
```
1. Initialize UI with candidate
2. Place agent at starting context
3. Loop until timeout or completion:
   a. Extract current state
   b. Query agent for next action
   c. Execute action
   d. Record result
   e. Check if goal achieved
4. Calculate metrics
5. Return simulation result
```

**Simulation Result**:
| Field | Description |
|-------|-------------|
| `success` | Goal achieved |
| `timeElapsed` | Simulated time |
| `actionCount` | Number of actions |
| `errorCount` | Wrong actions taken |
| `actionPath` | Sequence of actions |
| `finalState` | Ending UI state |

**Acceptance Criteria**:
- [ ] Simulation runs to completion
- [ ] Goals correctly detected
- [ ] Metrics accurately calculated
- [ ] Actions recorded
- [ ] Handles edge cases

**Verification**: Run simulations; verify results.

---

#### Task 4.2: Implement Batch Simulation
**File**: `src/paradigms/simulation/engine/batch.ts`

**What to build**:
Run many simulations in parallel.

**Batch Configuration**:
| Field | Description |
|-------|-------------|
| `uiCandidates` | UIs to test |
| `personas` | Personas to use |
| `tasks` | Tasks to attempt |
| `runsPerCombination` | Statistical replicates |
| `parallelism` | Concurrent simulations |

**Execution Strategy**:
- Cartesian product of (UI × Persona × Task)
- Run N replicates per combination
- Aggregate results
- Calculate confidence intervals

**Acceptance Criteria**:
- [ ] All combinations tested
- [ ] Parallel execution works
- [ ] Results aggregated correctly
- [ ] Progress reporting
- [ ] Can resume interrupted batch

**Verification**: Run batch; verify all combinations.

---

#### Task 4.3: Implement Results Aggregator
**File**: `src/paradigms/simulation/engine/aggregator.ts`

**What to build**:
Aggregate simulation results into insights.

**Aggregation Levels**:

| Level | Aggregates Over |
|-------|-----------------|
| Per-UI | All personas and tasks |
| Per-Persona | All UIs and tasks |
| Per-Task | All UIs and personas |
| Overall | Everything |

**Computed Metrics**:
| Metric | Description |
|--------|-------------|
| `successRate` | % of successful simulations |
| `avgTime` | Average completion time |
| `avgErrors` | Average error count |
| `pathEfficiency` | Optimal vs. actual path length |
| `abandonRate` | % gave up |

**Statistical Analysis**:
- Mean, median, std dev
- Confidence intervals
- Significance tests (A vs. B)

**Acceptance Criteria**:
- [ ] All metrics calculated
- [ ] All aggregation levels work
- [ ] Statistical measures correct
- [ ] Handles sparse data
- [ ] Export to CSV/JSON

**Verification**: Aggregate results; verify calculations.

---

### Phase 5: UI Generation

#### Task 5.1: Implement Simulation-Guided Generator
**File**: `src/paradigms/simulation/generator/simulation-guided.ts`

**What to build**:
Generate UI candidates optimized by simulation.

**Generation Strategy**:
1. Generate initial candidates (diverse)
2. Simulate all candidates
3. Identify best performers
4. Generate variations of best
5. Simulate variations
6. Repeat until convergence

**Candidate Generation**:
- Use other paradigms (compilation, constraint, etc.)
- Random variations
- LLM-generated alternatives

**Acceptance Criteria**:
- [ ] Generates diverse candidates
- [ ] Simulation drives selection
- [ ] Converges to good UI
- [ ] Handles local optima
- [ ] Reasonable iteration count

**Verification**: Run optimization; verify improvement.

---

#### Task 5.2: Implement Issue Detector
**File**: `src/paradigms/simulation/generator/issue-detector.ts`

**What to build**:
Identify UI issues from simulation data.

**Issue Types**:

| Issue | Detection |
|-------|-----------|
| Low discoverability | Users don't find element |
| Confusing flow | Many wrong actions before right |
| Performance bottleneck | Consistently slow at step |
| Accessibility barrier | Accessibility persona fails |
| Cognitive overload | Give-up at specific point |

**Issue Report**:
| Field | Description |
|-------|-------------|
| `type` | Issue category |
| `severity` | How bad |
| `location` | Where in UI |
| `evidence` | Supporting simulation data |
| `suggestion` | Potential fix |

**Acceptance Criteria**:
- [ ] All issue types detected
- [ ] Evidence is concrete
- [ ] Severity is calibrated
- [ ] Suggestions are actionable
- [ ] Low false positive rate

**Verification**: Introduce issues; verify detection.

---

### Phase 6: Pipeline Integration

#### Task 6.1: Implement Simulation Pipeline
**File**: `src/paradigms/simulation/pipeline.ts`

**What to build**:
Complete pipeline extending GenerationPipeline base.

**Pipeline Steps**:
1. Generate UI candidates
2. Define simulation batch
3. Run simulations
4. Aggregate results
5. Select best candidate
6. Detect issues
7. Return with metadata

**Pipeline Modes**:
| Mode | Description |
|------|-------------|
| `full` | Generate, simulate, optimize |
| `evaluate-only` | Simulate given UI |
| `quick` | Reduced persona/task set |

**Metadata**:
- Candidates tested
- Simulation statistics
- Winner selection rationale
- Detected issues

**Acceptance Criteria**:
- [ ] All modes work
- [ ] End-to-end pipeline works
- [ ] Results are useful
- [ ] Performance acceptable
- [ ] Issues reported

**Verification**: Run pipeline; verify quality.

---

### Phase 7: Dashboard

#### Task 7.1: Implement Simulation Dashboard
**File**: `src/paradigms/simulation/ui/dashboard.tsx`

**What to build**:
Visualize simulation results.

**Dashboard Sections**:

| Section | Content |
|---------|---------|
| Summary | Overall metrics, winner |
| Comparison | Side-by-side UI comparison |
| Breakdown | By persona, by task |
| Replay | Watch simulation runs |
| Issues | Detected problems |

**Visualizations**:
- Success rate bar charts
- Time distribution histograms
- Heatmap of persona × task
- Action path diagrams

**Acceptance Criteria**:
- [ ] All sections render
- [ ] Comparisons are clear
- [ ] Replay works
- [ ] Issues highlighted
- [ ] Exportable

**Verification**: Use dashboard; verify insights.

---

#### Task 7.2: Implement Simulation Replay
**File**: `src/paradigms/simulation/ui/replay.tsx`

**What to build**:
Replay a simulation run visually.

**Replay Features**:
| Feature | Description |
|---------|-------------|
| Play/pause | Control playback |
| Speed control | Faster/slower |
| Step through | Action by action |
| State display | Show agent's "thoughts" |
| Metrics overlay | Time, errors shown |

**Acceptance Criteria**:
- [ ] Replay is accurate
- [ ] Controls work smoothly
- [ ] Agent reasoning visible
- [ ] Can jump to points
- [ ] Export as video

**Verification**: Replay simulations; verify accuracy.

---

## Verification Checklist

After completing all tasks, verify:

- [ ] Personas are realistic and diverse
- [ ] Tasks are completable
- [ ] Agent makes sensible decisions
- [ ] Timing is realistic
- [ ] Simulations complete correctly
- [ ] Aggregation provides insights
- [ ] Issue detection is useful
- [ ] Dashboard aids understanding

---

## Extension Points

Future enhancements:
1. Learning persona behaviors from real users
2. Multi-agent simulations (collaboration)
3. Adversarial testing (break the UI)
4. Continuous simulation in production
5. Crowd-sourced simulation validation

