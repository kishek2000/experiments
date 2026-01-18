# Paradigm 6: Evolutionary / Genetic

## Executive Summary

**Mental Model**: Good UI is discovered through selection pressure, not designed.

**Core Question**: "What UI survives and thrives?"

**Metaphor**: Think of natural selection. Random mutations create variation; selection pressure eliminates the unfit; over generations, highly adapted organisms emerge. Similarly, UI variations compete, users select winners, and optimal UIs evolve.

---

## Why This Paradigm?

The evolutionary approach works well because:

1. **Exploration**: Discovers non-obvious solutions
2. **No bias**: Doesn't assume what "good" looks like
3. **User-driven**: Selection is based on real usage
4. **Continuous**: Always improving
5. **Robust**: Works without explicit rules

**Best suited for**:
- When optimal UI is unknown
- Long-running applications with many users
- A/B testing at scale
- Situations where traditional design fails

**Less suited for**:
- New applications (no user data)
- Single-user scenarios
- Time-critical first impressions
- When consistency is paramount

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    GENERATION 0                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│  │UI A  │ │UI B  │ │UI C  │ │UI D  │ │UI E  │         │
│  │      │ │      │ │      │ │      │ │      │         │
│  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘         │
└─────┼────────┼────────┼────────┼────────┼──────────────┘
      │        │        │        │        │
      ▼        ▼        ▼        ▼        ▼
┌─────────────────────────────────────────────────────────┐
│                 FITNESS EVALUATION                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │ User signals + Heuristics + Constraints          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    SELECTION                             │
│  ┌──────┐      ┌──────┐                                 │
│  │UI B  │      │UI D  │     (winners selected)          │
│  │ 0.8  │      │ 0.7  │                                 │
│  └──┬───┘      └──┬───┘                                 │
└─────┼──────────────┼────────────────────────────────────┘
      │              │
      ▼              ▼
┌─────────────────────────────────────────────────────────┐
│            MUTATION & CROSSOVER                          │
│                                                          │
│  B + mutation → B'    D + mutation → D'                 │
│  B × D → BD (crossover)                                 │
│                                                          │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    GENERATION 1                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│  │ B    │ │ B'   │ │ D    │ │ D'   │ │ BD   │         │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘         │
└─────────────────────────────────────────────────────────┘
          │
          ▼
      [Repeat]
```

---

## Key Concepts

### Genome

A UI is represented as a genome—a tree of genes that can be mutated and crossed:
- **Component gene**: Which component (Table, Card, etc.)
- **Prop genes**: Property values
- **Layout genes**: Arrangement of children
- **Style genes**: Visual properties

### Fitness

How well a UI performs, measured by:
- **User signals**: Engagement, task completion, time
- **Heuristics**: Content coverage, accessibility
- **Constraints**: Hard requirements that must be met

### Operators

Genetic operators that create variation:
- **Mutation**: Random small changes
- **Crossover**: Combine two parent genomes
- **Selection**: Choose survivors

### Population

A set of UI genomes in one generation:
- Typically 10-50 individuals
- Diversity maintained
- Elite preservation (keep best)

---

## Task Breakdown

### Phase 1: Genome Representation

#### Task 1.1: Define Genome Schema
**File**: `src/paradigms/evolutionary/types/genome.ts`

**What to build**:
Data structure representing a UI genome.

**Genome Structure**:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique genome ID |
| `generation` | number | Which generation |
| `parentIds` | string[] | Parent genomes (0-2) |
| `fitness` | number | Evaluated fitness (0-1) |
| `genes` | GeneNode | Root of gene tree |
| `metadata` | GenomeMetadata | Creation info |

**Gene Node Structure**:

| Field | Type | Description |
|-------|------|-------------|
| `type` | 'component' \| 'prop' \| 'layout' \| 'style' | Gene type |
| `value` | any | Gene value |
| `mutable` | boolean | Can this gene mutate |
| `children` | GeneNode[] | Child genes |

**Example Genome** (conceptual):
```
genes:
  component: "KanbanBoard"
  props:
    groupBy: "status"
    cardFields: ["title", "assignee"]
  children:
    - component: "KanbanColumn"
      props:
        title: "To Do"
      children:
        - component: "Card"
          ...
```

**Acceptance Criteria**:
- [ ] Can represent any UISpec as genome
- [ ] Genes are individually addressable
- [ ] Mutation points identified
- [ ] Genome serializable
- [ ] Can convert genome ↔ UISpec

**Verification**: Convert fixtures to genomes and back; verify fidelity.

---

#### Task 1.2: Implement Genome Builder
**File**: `src/paradigms/evolutionary/genome/builder.ts`

**What to build**:
Create genomes from content (initial population).

**Building Strategies**:

| Strategy | Description |
|----------|-------------|
| Random | Random valid component choices |
| Heuristic | Use content analysis to guide |
| Template | Start from known-good patterns |
| Import | Convert existing UISpec |

**Process**:
1. Analyze content structure
2. For each content element, generate gene
3. Make random but valid choices
4. Assemble into genome
5. Verify genome is viable

**Acceptance Criteria**:
- [ ] All strategies produce valid genomes
- [ ] Genomes are diverse (different strategies, different results)
- [ ] Content fully represented
- [ ] Genome is renderable
- [ ] Generation is fast

**Verification**: Generate initial populations; verify diversity.

---

#### Task 1.3: Implement Genome-to-UISpec Converter
**File**: `src/paradigms/evolutionary/genome/converter.ts`

**What to build**:
Convert genome to renderable UISpec.

**Conversion Process**:
1. Walk gene tree
2. For component genes, create UISpec node
3. For prop genes, add to props object
4. For children, recurse
5. Validate output

**Acceptance Criteria**:
- [ ] All genomes convert to valid UISpec
- [ ] Props correctly mapped
- [ ] Children ordered correctly
- [ ] Handles invalid genomes gracefully
- [ ] Conversion is deterministic

**Verification**: Convert and render genomes; verify correctness.

---

### Phase 2: Genetic Operators

#### Task 2.1: Implement Mutation Operators
**File**: `src/paradigms/evolutionary/operators/mutation.ts`

**What to build**:
Operators that make small random changes.

**Mutation Types**:

| Mutation | Description |
|----------|-------------|
| `change-component` | Replace component with compatible alternative |
| `mutate-prop` | Change a property value |
| `add-child` | Add a new child component |
| `remove-child` | Remove a child component |
| `reorder-children` | Shuffle child order |
| `change-style` | Modify style properties |

**Mutation Parameters**:
- Mutation rate: probability of mutating each gene
- Mutation magnitude: how much to change
- Valid mutations: only produce valid genomes

**Acceptance Criteria**:
- [ ] All mutation types implemented
- [ ] Mutations produce valid genomes
- [ ] Mutation rate is configurable
- [ ] Mutations are recorded (for replay)
- [ ] Can undo mutations

**Verification**: Apply mutations; verify genomes remain valid.

---

#### Task 2.2: Implement Crossover Operators
**File**: `src/paradigms/evolutionary/operators/crossover.ts`

**What to build**:
Operators that combine two parent genomes.

**Crossover Types**:

| Crossover | Description |
|-----------|-------------|
| `subtree-swap` | Exchange subtrees between parents |
| `prop-blend` | Average/interpolate numeric props |
| `uniform` | For each gene, randomly pick parent |

**Crossover Process**:
1. Select crossover point(s)
2. Combine genetic material
3. Verify offspring is valid
4. If invalid, retry with different point

**Acceptance Criteria**:
- [ ] All crossover types implemented
- [ ] Offspring inherit from both parents
- [ ] Offspring are valid genomes
- [ ] Invalid combinations handled
- [ ] Crossover is reproducible (seeded)

**Verification**: Cross genomes; verify offspring validity.

---

#### Task 2.3: Implement Selection Strategies
**File**: `src/paradigms/evolutionary/operators/selection.ts`

**What to build**:
Strategies for selecting survivors.

**Selection Strategies**:

| Strategy | Description |
|----------|-------------|
| `tournament` | Random subsets compete; winners proceed |
| `roulette` | Selection probability ∝ fitness |
| `rank` | Selection probability ∝ rank |
| `elitism` | Top N always survive |
| `diversity` | Maintain population diversity |

**Selection Parameters**:
- Population size
- Selection pressure (how strongly fitness matters)
- Elitism count (how many best to always keep)

**Acceptance Criteria**:
- [ ] All strategies implemented
- [ ] Higher fitness → higher selection probability
- [ ] Diversity maintained (not premature convergence)
- [ ] Elitism preserves best
- [ ] Selection is reproducible

**Verification**: Run selection; verify fitness correlation.

---

### Phase 3: Fitness Evaluation

#### Task 3.1: Implement Heuristic Fitness Functions
**File**: `src/paradigms/evolutionary/fitness/heuristics.ts`

**What to build**:
Automatic fitness evaluation without user data.

**Fitness Components**:

| Component | Weight | Description |
|-----------|--------|-------------|
| `content-coverage` | 0.3 | All content rendered |
| `hierarchy-preserved` | 0.15 | Structure maintained |
| `accessibility` | 0.2 | WCAG compliance |
| `complexity` | 0.1 | Not too complex/simple |
| `consistency` | 0.15 | Visual consistency |
| `performance` | 0.1 | Predicted render speed |

**Evaluation Process**:
1. Convert genome to UISpec
2. Analyze UISpec for each component
3. Calculate weighted sum
4. Return fitness score

**Acceptance Criteria**:
- [ ] All components implemented
- [ ] Scores are normalized 0-1
- [ ] Weights are configurable
- [ ] Evaluation is fast
- [ ] Scores are deterministic

**Verification**: Evaluate genomes; verify scores make sense.

---

#### Task 3.2: Implement User Signal Fitness
**File**: `src/paradigms/evolutionary/fitness/user-signals.ts`

**What to build**:
Evaluate fitness from real user behavior.

**User Signals**:

| Signal | Interpretation |
|--------|----------------|
| Dwell time | Longer = more engaging |
| Task completion | Completed = effective |
| Error rate | Fewer errors = clearer |
| Click-through | More interaction = engaging |
| Abandonment | Left quickly = poor fit |
| Explicit rating | Direct feedback |

**Signal Collection**:
- Track signals per genome shown
- Aggregate across users
- Handle sparse data

**Acceptance Criteria**:
- [ ] All signal types collected
- [ ] Aggregation handles variance
- [ ] Cold start handled (use heuristics)
- [ ] Signal decay over time
- [ ] Privacy-respecting

**Verification**: Collect signals; verify fitness correlation.

---

#### Task 3.3: Implement Constraint Fitness
**File**: `src/paradigms/evolutionary/fitness/constraints.ts`

**What to build**:
Evaluate hard constraint satisfaction.

**Constraint Categories**:

| Category | Examples |
|----------|----------|
| Validity | All components exist, props valid |
| Accessibility | Contrast, labels, keyboard |
| Content | All content rendered |
| Performance | Render budget not exceeded |

**Constraint Handling**:
- Violations → fitness = 0 (or very low)
- Near-violations → reduced fitness
- Full compliance → no penalty

**Acceptance Criteria**:
- [ ] All constraints checkable
- [ ] Violations heavily penalized
- [ ] Gradual penalty near boundary
- [ ] Fast evaluation
- [ ] Constraint list configurable

**Verification**: Check constrained genomes; verify penalties.

---

### Phase 4: Evolution Engine

#### Task 4.1: Implement Population Manager
**File**: `src/paradigms/evolutionary/engine/population.ts`

**What to build**:
Manage population of genomes.

**Population Operations**:

| Operation | Description |
|-----------|-------------|
| `initialize(size)` | Create initial population |
| `evaluate()` | Fitness for all members |
| `select(count)` | Select survivors |
| `breed(parents)` | Create offspring |
| `replace(offspring)` | New generation |
| `getBest()` | Return fittest member |

**Population Metrics**:
- Average fitness
- Best fitness
- Fitness variance
- Diversity index

**Acceptance Criteria**:
- [ ] All operations work
- [ ] Population size maintained
- [ ] Diversity tracked
- [ ] History preserved
- [ ] Generation counter correct

**Verification**: Run evolution cycles; verify population management.

---

#### Task 4.2: Implement Evolution Loop
**File**: `src/paradigms/evolutionary/engine/evolution-loop.ts`

**What to build**:
Main evolution algorithm.

**Evolution Loop**:
```
1. Initialize population
2. Loop until termination:
   a. Evaluate fitness
   b. Select survivors
   c. Apply crossover to create offspring
   d. Apply mutations
   e. Replace population
   f. Check termination condition
3. Return best genome
```

**Termination Conditions**:
| Condition | Description |
|-----------|-------------|
| Max generations | Hard limit |
| Fitness threshold | Good enough |
| Convergence | No improvement for N generations |
| Time limit | Wall clock budget |

**Acceptance Criteria**:
- [ ] Loop runs correctly
- [ ] All operators applied
- [ ] Termination works
- [ ] Best genome tracked
- [ ] Can pause/resume

**Verification**: Run evolution; verify improvement over generations.

---

#### Task 4.3: Implement Diversity Maintenance
**File**: `src/paradigms/evolutionary/engine/diversity.ts`

**What to build**:
Prevent premature convergence.

**Diversity Mechanisms**:

| Mechanism | Description |
|-----------|-------------|
| Niching | Similar genomes compete locally |
| Crowding | Replace similar individuals |
| Island model | Separate sub-populations |
| Random injection | Add random individuals |

**Diversity Metrics**:
- Genotype distance (structural difference)
- Phenotype distance (visual difference)
- Fitness distribution

**Acceptance Criteria**:
- [ ] Diversity maintained across generations
- [ ] Not premature convergence
- [ ] Mechanisms configurable
- [ ] Metrics trackable
- [ ] Can detect diversity collapse

**Verification**: Monitor diversity; verify it's maintained.

---

### Phase 5: User Signal Collection

#### Task 5.1: Implement Signal Tracker
**File**: `src/paradigms/evolutionary/signals/tracker.ts`

**What to build**:
Track user interactions with rendered genomes.

**Tracking Events**:

| Event | Data Captured |
|-------|---------------|
| View start | Genome ID, timestamp |
| View end | Duration |
| Click | Element, position |
| Scroll | Depth reached |
| Task complete | Task type, success |
| Explicit rating | Score, comment |
| Error | Type, context |

**Tracker Features**:
- Associate events with genome
- Session tracking
- Batch uploads
- Privacy controls

**Acceptance Criteria**:
- [ ] All event types tracked
- [ ] Events associated with genomes
- [ ] Batching works
- [ ] Can disable tracking
- [ ] Data is anonymized

**Verification**: Generate events; verify capture.

---

#### Task 5.2: Implement Signal Aggregator
**File**: `src/paradigms/evolutionary/signals/aggregator.ts`

**What to build**:
Aggregate signals into fitness scores.

**Aggregation Process**:
1. Collect signals for genome
2. Normalize per-signal
3. Weight and combine
4. Handle sparse data
5. Return fitness estimate

**Statistical Handling**:
- Confidence intervals
- Sample size requirements
- Outlier handling
- Temporal decay

**Acceptance Criteria**:
- [ ] Aggregation produces stable scores
- [ ] Handles sparse data
- [ ] Confidence reflected
- [ ] Outliers don't dominate
- [ ] Decay works

**Verification**: Aggregate signals; verify fitness scores.

---

### Phase 6: Pipeline Integration

#### Task 6.1: Implement Evolutionary Pipeline
**File**: `src/paradigms/evolutionary/pipeline.ts`

**What to build**:
Complete pipeline extending GenerationPipeline base.

**Pipeline Modes**:

| Mode | Description |
|------|-------------|
| `evolve-fresh` | Start evolution from scratch |
| `evolve-continue` | Continue from saved population |
| `best-current` | Return current best without evolving |
| `sample` | Return random from population |

**Pipeline Steps**:
1. Load or create population
2. Run evolution (if evolving)
3. Select best genome
4. Convert to UISpec
5. Return with metadata

**Metadata**:
- Generation count
- Population fitness stats
- Lineage of best
- Evolution parameters

**Acceptance Criteria**:
- [ ] All modes work
- [ ] Evolution improves fitness
- [ ] Can save/load populations
- [ ] Metadata comprehensive
- [ ] Performance acceptable

**Verification**: Run pipeline; verify evolution works.

---

### Phase 7: Visualization & Debugging

#### Task 7.1: Implement Evolution Visualizer
**File**: `src/paradigms/evolutionary/ui/evolution-viz.tsx`

**What to build**:
Visualize evolution progress.

**Visualizations**:

| View | Description |
|------|-------------|
| Fitness over time | Line chart of best/avg/worst |
| Population view | Grid of current genomes |
| Lineage tree | Family tree of best genome |
| Diversity plot | Scatter plot of genome distances |
| Operator stats | Which operators help most |

**Acceptance Criteria**:
- [ ] All visualizations render
- [ ] Updates in real-time
- [ ] Can pause to inspect
- [ ] Can click to see genome details
- [ ] Useful for debugging

**Verification**: Run evolution; verify visualizations help.

---

#### Task 7.2: Implement Genome Diff Viewer
**File**: `src/paradigms/evolutionary/ui/genome-diff.tsx`

**What to build**:
Compare two genomes side-by-side.

**Diff Features**:
| Feature | Description |
|---------|-------------|
| Gene-by-gene | Highlight changed genes |
| Side-by-side render | See visual difference |
| Mutation history | What mutations led to difference |
| Fitness comparison | Which is better and why |

**Acceptance Criteria**:
- [ ] Diffs are accurate
- [ ] Changes highlighted clearly
- [ ] Renders both genomes
- [ ] Shows mutation history
- [ ] Fitness explained

**Verification**: Compare genomes; verify diff accuracy.

---

## Verification Checklist

After completing all tasks, verify:

- [ ] Initial populations are diverse
- [ ] Fitness evaluation works (heuristic + signals)
- [ ] Genetic operators produce valid offspring
- [ ] Evolution improves fitness over time
- [ ] Diversity maintained
- [ ] User signals collected and used
- [ ] Visualization helps understanding

---

## Extension Points

Future enhancements:
1. Multi-objective optimization
2. Co-evolution (user model evolves too)
3. Distributed evolution
4. Human-in-the-loop selection
5. Novelty search (maximize diversity)

