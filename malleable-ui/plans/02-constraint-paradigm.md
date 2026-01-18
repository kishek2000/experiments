# Paradigm 2: Constraint Satisfaction

## Executive Summary

**Mental Model**: UI is a solution to a constraint problem—discovered, not designed.

**Core Question**: "What UI satisfies all my requirements?"

**Metaphor**: Think of Sudoku. You don't design the solution; you discover it by satisfying constraints. Similarly, the ideal UI isn't invented—it's the unique (or near-unique) solution that satisfies content, design, accessibility, user, and context constraints simultaneously.

---

## Why This Paradigm?

The constraint satisfaction approach works well because:

1. **Declarative**: Specify what you want, not how to get it
2. **Complete**: Guarantees all requirements are met (hard constraints)
3. **Optimal**: Among valid solutions, finds the best (soft constraints)
4. **Transparent**: Can explain why a solution was chosen
5. **Flexible**: Easy to add/remove/modify constraints

**Best suited for**:
- Complex requirements with many interacting rules
- Regulated environments (accessibility, brand guidelines)
- Situations where all constraints must be explicitly satisfied
- When users need to understand why certain UI choices were made

**Less suited for**:
- Simple content with obvious presentations
- When speed matters more than optimality
- Highly creative/novel UI generation
- When constraints are hard to articulate

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                 CONSTRAINT SOURCES                       │
├──────────┬──────────┬──────────┬──────────┬────────────┤
│ Content  │  Design  │   User   │ Context  │ Accessibility│
│Constraints│Constraints│Preferences│Constraints│ Constraints │
└────┬─────┴────┬─────┴────┬─────┴────┬─────┴──────┬─────┘
     │          │          │          │            │
     └──────────┴──────────┴──────────┴────────────┘
                           │
                           ▼
                 ┌─────────────────┐
                 │ Constraint Pool │
                 │  (Hard + Soft)  │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Solution Space  │
                 │   Definition    │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │    SOLVER       │
                 │  ─────────────  │
                 │  Propagation    │
                 │  Backtracking   │
                 │  Optimization   │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Valid Solution  │
                 │    (UISpec)     │
                 └─────────────────┘
```

---

## Key Concepts

### Hard vs. Soft Constraints

| Type | Behavior | Examples |
|------|----------|----------|
| **Hard** | Must be satisfied; solution invalid otherwise | "All content must be visible", "Contrast ratio ≥ 4.5:1" |
| **Soft** | Preferred but can be violated; has weight | "Prefer cards over tables", "User likes dark mode" |

### Constraint Domains

| Domain | What it governs |
|--------|-----------------|
| **Content** | Structural requirements from the content itself |
| **Design** | Design system rules and component constraints |
| **User** | User preferences and past choices |
| **Context** | Viewport, device, time of day, etc. |
| **Accessibility** | WCAG requirements, user accommodations |

### Solution Space

The universe of possible UIs, defined by:
- Available components
- Valid prop combinations
- Allowed compositions (what can contain what)
- Layout options

### Constraint Propagation

When you assign a value to one variable, propagate implications:
- If root is KanbanBoard, children must be KanbanColumn
- If column is "status", view should probably show status prominently
- If viewport < 768px, don't use side-by-side layout

---

## Task Breakdown

### Phase 1: Constraint Language

#### Task 1.1: Define Constraint Type System
**File**: `src/paradigms/constraint/types/constraint.ts`

**What to build**:
Type definitions for expressing constraints.

**Constraint Structure**:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `type` | 'hard' \| 'soft' | Constraint type |
| `domain` | ConstraintDomain | Where this comes from |
| `name` | string | Human-readable name |
| `description` | string | What this constraint enforces |
| `check` | function | For hard: returns boolean |
| `score` | function | For soft: returns 0-1 score |
| `weight` | number | For soft: importance (0-10) |
| `appliesTo` | predicate | Which solution nodes this applies to |

**Constraint Domains**:
- `content` - From content analysis
- `design` - From design system rules
- `user` - From user preferences
- `context` - From environment
- `accessibility` - From WCAG/a11y requirements

**Acceptance Criteria**:
- [ ] Can express both hard and soft constraints
- [ ] Domain categorization works
- [ ] Check/score functions receive necessary context
- [ ] Weights are normalized (0-10 scale)
- [ ] `appliesTo` enables targeted constraints

**Verification**: Define sample constraints of each type; verify they compile and execute.

---

#### Task 1.2: Define Solution Space Types
**File**: `src/paradigms/constraint/types/solution.ts`

**What to build**:
Types representing the space of possible UIs.

**Solution Variables**:

| Variable | Domain | Description |
|----------|--------|-------------|
| `rootComponent` | Component[] | What component renders root |
| `itemComponent[i]` | Component[] | Component for each content item |
| `layout[i]` | Layout[] | Layout for each container |
| `props[i][p]` | PropValues[] | Prop values for each component |

**Partial Solution**:
A solution where some variables are unassigned. Used during search.

**Complete Solution**:
All variables assigned. Can be converted to UISpec.

**Acceptance Criteria**:
- [ ] Variables cover all UI decisions
- [ ] Domains enumerate valid values
- [ ] Partial solutions trackable
- [ ] Complete solutions convertible to UISpec
- [ ] Can clone/branch solutions for backtracking

**Verification**: Create solution types; verify they capture UI decisions.

---

#### Task 1.3: Implement Constraint DSL
**File**: `src/paradigms/constraint/dsl/constraint-dsl.ts`

**What to build**:
Fluent API for defining constraints without writing functions.

**DSL Examples**:
```
constraint('all-content-visible')
  .hard()
  .domain('content')
  .forAll('item')
  .require(item => item.isRendered)

constraint('prefer-kanban-for-status')
  .soft()
  .weight(8)
  .domain('content')
  .when(content => content.hasStatusColumn)
  .prefer(root => root.component === 'KanbanBoard')

constraint('min-contrast')
  .hard()
  .domain('accessibility')
  .forAll('text')
  .require(text => contrastRatio(text.color, text.background) >= 4.5)
```

**DSL Features**:
| Method | Description |
|--------|-------------|
| `hard()` / `soft()` | Set constraint type |
| `domain(d)` | Set domain |
| `weight(n)` | Set soft constraint weight |
| `forAll(selector)` | Apply to all matching nodes |
| `when(predicate)` | Conditional activation |
| `require(predicate)` | Hard constraint check |
| `prefer(predicate)` | Soft constraint scoring |

**Acceptance Criteria**:
- [ ] DSL produces valid Constraint objects
- [ ] All constraint patterns expressible
- [ ] Type-safe (TypeScript catches errors)
- [ ] Readable and maintainable
- [ ] Composable (combine constraints)

**Verification**: Define common constraints using DSL; verify behavior.

---

### Phase 2: Constraint Collectors

#### Task 2.1: Implement Content Constraint Collector
**File**: `src/paradigms/constraint/collectors/content-collector.ts`

**What to build**:
Extract constraints from content analysis.

**Constraints Generated**:

| Constraint | Type | Description |
|------------|------|-------------|
| `all-content-rendered` | Hard | Every block must appear in UI |
| `hierarchy-preserved` | Hard | Parent-child relationships maintained |
| `order-preserved` | Soft | Items appear in original order |
| `status-visible` | Soft | Status column prominent if exists |
| `dates-visible` | Soft | Date fields visible if exist |
| `images-displayed` | Soft | Images rendered, not just linked |
| `links-actionable` | Hard | Links must be clickable |

**Input**: ContentAnalysis
**Output**: Constraint[]

**Acceptance Criteria**:
- [ ] All content types generate appropriate constraints
- [ ] No content can be silently dropped
- [ ] Semantic columns get visibility constraints
- [ ] Constraints reference specific content elements

**Verification**: Run on fixtures; verify constraints make sense.

---

#### Task 2.2: Implement Design Constraint Collector
**File**: `src/paradigms/constraint/collectors/design-collector.ts`

**What to build**:
Extract constraints from design system rules.

**Constraints Generated**:

| Constraint | Type | Description |
|------------|------|-------------|
| `valid-nesting` | Hard | Components only contain allowed children |
| `required-props` | Hard | All required props are provided |
| `prop-types` | Hard | Props match expected types |
| `consistent-spacing` | Soft | Use design token spacing |
| `consistent-colors` | Soft | Use design token colors |
| `component-limits` | Soft | Max items per component type |

**Input**: ComponentRegistry, DesignTokens
**Output**: Constraint[]

**Acceptance Criteria**:
- [ ] Component constraints from registry
- [ ] Token usage enforced
- [ ] Nesting rules from component definitions
- [ ] Prop schemas enforced

**Verification**: Create invalid solutions; verify constraints catch them.

---

#### Task 2.3: Implement User Preference Collector
**File**: `src/paradigms/constraint/collectors/user-collector.ts`

**What to build**:
Convert user preferences to soft constraints.

**Preference Types**:

| Preference | Constraint Generated |
|------------|---------------------|
| `preferredView: 'kanban'` | Soft preference for KanbanBoard |
| `preferredTheme: 'dark'` | Soft preference for dark colors |
| `compactMode: true` | Soft preference for dense layouts |
| `accessibility.fontSize: 'large'` | Hard requirement for large fonts |
| `accessibility.highContrast: true` | Hard requirement for high contrast |

**Input**: UserPreferences (stored or session)
**Output**: Constraint[]

**Acceptance Criteria**:
- [ ] All preferences converted to constraints
- [ ] Accessibility preferences become hard constraints
- [ ] Aesthetic preferences become soft constraints
- [ ] Missing preferences handled gracefully

**Verification**: Set preferences; verify constraints generated.

---

#### Task 2.4: Implement Context Constraint Collector
**File**: `src/paradigms/constraint/collectors/context-collector.ts`

**What to build**:
Generate constraints from runtime context.

**Context Factors**:

| Factor | Constraints Generated |
|--------|----------------------|
| `viewport.width < 768` | No multi-column layouts |
| `viewport.width >= 1200` | Can use sidebars |
| `device: 'mobile'` | Touch-friendly targets (44px min) |
| `connection: 'slow'` | Lazy load images |
| `timeOfDay: 'night'` | Prefer dark theme |
| `locale: 'ar'` | RTL layout |

**Input**: ContextInfo (viewport, device, network, locale, etc.)
**Output**: Constraint[]

**Acceptance Criteria**:
- [ ] Responsive constraints from viewport
- [ ] Touch constraints for mobile
- [ ] Performance constraints from network
- [ ] Locale constraints for i18n

**Verification**: Simulate different contexts; verify constraints.

---

#### Task 2.5: Implement Accessibility Constraint Collector
**File**: `src/paradigms/constraint/collectors/accessibility-collector.ts`

**What to build**:
WCAG compliance constraints.

**WCAG Constraints**:

| WCAG Criterion | Constraint |
|----------------|------------|
| 1.4.3 Contrast | Text contrast ≥ 4.5:1 (≥ 3:1 for large) |
| 1.4.4 Resize | Text scalable to 200% |
| 2.1.1 Keyboard | All interactive elements keyboard accessible |
| 2.4.1 Bypass | Skip navigation available for repeated blocks |
| 2.4.6 Headings | Descriptive headings |
| 2.4.7 Focus | Visible focus indicators |
| 4.1.2 Name/Role | ARIA labels for controls |

**Input**: AccessibilityLevel ('A' | 'AA' | 'AAA')
**Output**: Constraint[]

**Acceptance Criteria**:
- [ ] All WCAG 2.1 AA criteria covered
- [ ] Constraints are verifiable
- [ ] Can select conformance level
- [ ] Constraints compose with other domains

**Verification**: Generate solutions; audit with axe-core.

---

### Phase 3: Solution Space

#### Task 3.1: Define Solution Variables
**File**: `src/paradigms/constraint/solver/variables.ts`

**What to build**:
Define all variables that constitute a UI solution.

**Variable Categories**:

| Category | Variables |
|----------|-----------|
| **Structure** | Component for each content node |
| **Layout** | Direction, columns, gaps for containers |
| **Styling** | Colors, spacing, typography choices |
| **Props** | Values for each component prop |
| **Behavior** | Interactions, animations |

**Variable Domains** (possible values):

| Variable | Domain Example |
|----------|----------------|
| `rootComponent` | ['Stack', 'Grid', 'KanbanBoard', 'Table'] |
| `layoutDirection` | ['horizontal', 'vertical'] |
| `spacing` | ['tight', 'normal', 'loose'] |

**Acceptance Criteria**:
- [ ] All UI decisions have variables
- [ ] Domains are finite and enumerable
- [ ] Variables can be constrained
- [ ] Missing domains detected early

**Verification**: Enumerate variables for sample content; verify coverage.

---

#### Task 3.2: Implement Domain Reduction
**File**: `src/paradigms/constraint/solver/domain-reduction.ts`

**What to build**:
Reduce variable domains based on constraints.

**Reduction Rules**:
- If content is database → root ∈ {Table, KanbanBoard, Calendar, ...}
- If content has images → itemComponent must support image props
- If mobile context → layout excludes wide multi-column

**Arc Consistency**:
When one variable's domain changes, propagate to related variables.

**Acceptance Criteria**:
- [ ] Domains reduced based on hard constraints
- [ ] Arc consistency maintained
- [ ] Detects empty domains (no valid solution)
- [ ] Reduction is sound (doesn't remove valid values)

**Verification**: Apply constraints; verify domain reductions correct.

---

### Phase 4: Solver

#### Task 4.1: Implement Backtracking Search
**File**: `src/paradigms/constraint/solver/backtracking.ts`

**What to build**:
Core search algorithm to find solutions.

**Algorithm**:
1. Select unassigned variable
2. Try values from domain
3. Check constraints
4. If valid, recurse to next variable
5. If invalid, backtrack and try next value
6. If all values fail, backtrack further

**Optimizations**:
- **Variable ordering**: Most constrained variable first (MRV)
- **Value ordering**: Least constraining value first (LCV)
- **Constraint propagation**: Reduce domains after each assignment
- **Intelligent backjumping**: Skip irrelevant variables

**Acceptance Criteria**:
- [ ] Finds valid solution if one exists
- [ ] Reports no solution if none exists
- [ ] MRV ordering implemented
- [ ] LCV ordering implemented
- [ ] Propagation reduces search space

**Verification**: Solve constrained problems; verify solutions valid.

---

#### Task 4.2: Implement Soft Constraint Optimization
**File**: `src/paradigms/constraint/solver/optimization.ts`

**What to build**:
Optimize soft constraint satisfaction among valid solutions.

**Approach**: Branch-and-bound
1. Find any valid solution
2. Calculate soft score
3. Continue search, pruning branches that can't beat current best
4. Return best-scoring solution

**Scoring**:
- Each soft constraint contributes: weight × score
- Total = sum of weighted scores
- Normalize to 0-1 range

**Acceptance Criteria**:
- [ ] Finds optimal (or near-optimal) solution
- [ ] Respects all hard constraints
- [ ] Weights influence outcome correctly
- [ ] Terminates in reasonable time

**Verification**: Vary soft constraints; verify optimal selection changes.

---

#### Task 4.3: Implement Solution Mapper
**File**: `src/paradigms/constraint/solver/solution-mapper.ts`

**What to build**:
Convert solver output to UISpec.

**Mapping Process**:
1. For each assigned variable, extract component decision
2. Build UISpec tree from structure variables
3. Apply props from prop variables
4. Apply styling from style variables

**Acceptance Criteria**:
- [ ] All solutions map to valid UISpec
- [ ] No information lost in mapping
- [ ] Props correctly assigned
- [ ] Nested structures preserved

**Verification**: Map solutions; render and verify correctness.

---

### Phase 5: Pipeline Integration

#### Task 5.1: Implement Constraint Pipeline
**File**: `src/paradigms/constraint/pipeline.ts`

**What to build**:
Complete pipeline extending GenerationPipeline base.

**Pipeline Steps**:
1. Collect constraints from all domains
2. Define solution space from content
3. Apply initial domain reduction
4. Run backtracking search
5. Optimize soft constraints
6. Map to UISpec
7. Collect metadata

**Metadata to Track**:
- Constraints collected per domain
- Hard constraints satisfied (all)
- Soft constraint scores
- Search statistics (nodes explored, backtracks)
- Solution optimality (gap from bound)

**Acceptance Criteria**:
- [ ] End-to-end pipeline works
- [ ] All constraint domains integrated
- [ ] Metadata comprehensive
- [ ] Errors indicate failing constraints

**Verification**: Run on fixtures; verify solutions satisfy constraints.

---

### Phase 6: Debugging & Explanation

#### Task 6.1: Implement Constraint Conflict Detector
**File**: `src/paradigms/constraint/debug/conflict-detector.ts`

**What to build**:
Identify conflicting constraints when no solution exists.

**Detection Approach**:
1. If solver fails, find minimal conflict set
2. For each constraint, check if removing it enables solution
3. Report which constraints conflict

**Output**:
- Minimal conflict set
- Suggestions for resolution

**Acceptance Criteria**:
- [ ] Detects conflicts when no solution exists
- [ ] Reports minimal conflict set
- [ ] Suggestions are actionable
- [ ] Handles multiple conflict sources

**Verification**: Create conflicting constraints; verify detection.

---

#### Task 6.2: Implement Solution Explainer
**File**: `src/paradigms/constraint/debug/explainer.ts`

**What to build**:
Explain why a particular UI was generated.

**Explanation Content**:
- Which constraints drove each decision
- Why alternatives were rejected
- Soft constraint tradeoffs made
- How user preferences influenced result

**Format**:
```
Root component: KanbanBoard
  Because: content.hasStatusColumn (weight 8) 
  And: user.preferredView !== 'table' (weight 5)
  Rejected: Table (soft score: 0.6 vs 0.8)
```

**Acceptance Criteria**:
- [ ] Every decision has explanation
- [ ] Explains both positive and negative factors
- [ ] References specific constraints by name
- [ ] Readable for non-technical users

**Verification**: Generate explanations; verify clarity.

---

### Phase 7: Interactive Constraint Editor

#### Task 7.1: Implement Constraint Editor UI
**File**: `src/paradigms/constraint/ui/constraint-editor.tsx`

**What to build**:
UI for viewing and modifying constraints.

**Features**:
| Feature | Description |
|---------|-------------|
| View all constraints | Grouped by domain |
| Enable/disable | Toggle constraints on/off |
| Adjust weights | Slider for soft constraint weights |
| Add custom | Define new constraints via form |
| See impact | Preview how changes affect solution |
| Conflict highlight | Show conflicting constraints |

**Acceptance Criteria**:
- [ ] All constraints visible and organized
- [ ] Can toggle constraints
- [ ] Weight adjustment works
- [ ] Custom constraints can be added
- [ ] Live preview updates

**Verification**: Interact with editor; verify changes reflect in generation.

---

#### Task 7.2: Implement Constraint Suggestion System
**File**: `src/paradigms/constraint/ui/suggestions.ts`

**What to build**:
Suggest constraints based on user actions.

**Suggestion Triggers**:
| User Action | Suggested Constraint |
|-------------|---------------------|
| Switches to Kanban | "Prefer KanbanBoard for databases with status" |
| Increases font size | "Minimum font size: X" |
| Collapses section | "Start section X collapsed" |
| Moves element | "Position X before Y" |

**Acceptance Criteria**:
- [ ] Actions trigger relevant suggestions
- [ ] Suggestions are opt-in
- [ ] Accepted suggestions become persistent constraints
- [ ] Clear explanation of what each suggestion does

**Verification**: Perform actions; verify suggestions appear.

---

## Verification Checklist

After completing all tasks, verify:

- [ ] Can express real-world UI requirements as constraints
- [ ] Solver finds solutions for all fixture types
- [ ] Hard constraints are never violated
- [ ] Soft constraints influence solution quality
- [ ] Conflicts are detected and explained
- [ ] Constraint editor enables customization
- [ ] Performance acceptable (< 2s for typical content)

---

## Common Constraint Patterns

### Pattern: "Must Display All Content"
```
forAll(contentItem):
  exists(uiElement): renders(contentItem)
```

### Pattern: "Maintain Hierarchy"
```
forAll(parent, child where parent.contains(child)):
  uiFor(parent).contains(uiFor(child))
```

### Pattern: "Responsive Layout"
```
when(viewport.width < 768):
  forAll(container):
    container.layout = 'vertical'
```

### Pattern: "Accessible Color Contrast"
```
forAll(text, background):
  contrastRatio(text.color, background.color) >= 4.5
```

---

## Extension Points

Future enhancements:
1. Learning constraints from user corrections
2. Constraint templates for common scenarios
3. Collaborative constraint editing
4. Constraint versioning and rollback
5. Constraint testing/validation framework

