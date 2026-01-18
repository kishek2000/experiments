# Paradigm 8: Dataflow / Reactive

## Executive Summary

**Mental Model**: UI is a continuous function of inputs, automatically derived.

**Core Question**: "How does the UI respond to change?"

**Metaphor**: Think of a spreadsheet. When you change a cell, dependent cells update automatically. Similarly, UI is a "formula" that recalculates whenever its inputs change—content, viewport, user state, time.

---

## Why This Paradigm?

The dataflow/reactive approach works well because:

1. **Live**: UI updates automatically with changes
2. **Declarative**: Define relationships, not procedures
3. **Efficient**: Only recompute what changed
4. **Composable**: Build complex from simple transforms
5. **Debuggable**: Can trace any value to its inputs

**Best suited for**:
- Real-time collaborative applications
- Dashboards with live data
- Responsive/adaptive UIs
- Complex derived state

**Less suited for**:
- Static content
- Heavy one-time computations
- When update overhead matters
- Simple direct mappings

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    INPUT SIGNALS                         │
│                                                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ Content │ │Viewport │ │  User   │ │  Time   │       │
│  │ Signal  │ │ Signal  │ │ State   │ │ Signal  │       │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘       │
└───────┼──────────┼──────────┼──────────┼───────────────┘
        │          │          │          │
        └──────────┴──────────┴──────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                 REACTIVE GRAPH                           │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Computed Nodes                       │   │
│  │                                                   │   │
│  │  content ──┬──→ analysis ──→ viewType            │   │
│  │            │                    │                 │   │
│  │  viewport ─┼──→ layout ────────┼──→ uiSpec      │   │
│  │            │                    │                 │   │
│  │  user ─────┴──→ preferences ───┘                 │   │
│  │                                                   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
                      ┌──────────┐
                      │  UISpec  │
                      │ (live)   │
                      └──────────┘
```

---

## Key Concepts

### Signals

Reactive values that can change over time:
- **Writable signals**: Direct input (content, user actions)
- **Computed signals**: Derived from other signals
- **Effects**: Side effects triggered by signal changes

### Reactive Graph

A dependency graph where:
- Nodes are signals
- Edges are dependencies
- Changes propagate through edges
- Only affected nodes recompute

### Transforms

Pure functions that map signals to signals:
```
contentSignal → transform(analyze) → analysisSignal
analysisSignal + viewportSignal → transform(selectView) → viewSignal
```

### Incremental Computation

Don't recompute everything—only what changed:
- Track fine-grained dependencies
- Cache intermediate results
- Diff inputs and outputs

---

## Task Breakdown

### Phase 1: Signal System

#### Task 1.1: Implement Core Signal Primitives
**File**: `src/paradigms/dataflow/signals/core.ts`

**What to build**:
Core reactive primitives.

**Signal Types**:

| Type | Description |
|------|-------------|
| `Signal<T>` | Base readable signal |
| `WritableSignal<T>` | Writable signal |
| `ComputedSignal<T>` | Derived signal |
| `Effect` | Side effect runner |

**Core API**:

| Function | Description |
|----------|-------------|
| `signal(initial)` | Create writable signal |
| `computed(fn)` | Create computed signal |
| `effect(fn)` | Create side effect |
| `batch(fn)` | Batch multiple updates |
| `untrack(fn)` | Read without tracking |

**Signal Interface**:
| Method | Description |
|--------|-------------|
| `get()` | Get current value |
| `subscribe(cb)` | Subscribe to changes |

**WritableSignal Interface**:
| Method | Description |
|--------|-------------|
| `set(value)` | Set new value |
| `update(fn)` | Update with function |

**Acceptance Criteria**:
- [ ] Basic signals work
- [ ] Computed signals auto-update
- [ ] Effects run on dependency change
- [ ] Batching prevents glitches
- [ ] Subscriptions can be cleaned up

**Verification**: Create signal graphs; verify reactivity.

---

#### Task 1.2: Implement Dependency Tracking
**File**: `src/paradigms/dataflow/signals/tracking.ts`

**What to build**:
Automatic dependency tracking.

**Tracking Mechanism**:
1. Before computing, start tracking context
2. When signal.get() called, record dependency
3. After computing, store dependency list
4. On update, notify dependents

**Optimizations**:
- Only recompute if dependencies actually changed
- Lazy evaluation (don't compute until read)
- Memoization of stable computations

**Acceptance Criteria**:
- [ ] Dependencies tracked automatically
- [ ] Recomputes only when needed
- [ ] Handles dynamic dependencies
- [ ] No memory leaks
- [ ] Cycle detection

**Verification**: Create complex graphs; verify tracking.

---

#### Task 1.3: Implement Signal Utilities
**File**: `src/paradigms/dataflow/signals/utilities.ts`

**What to build**:
Utility functions for working with signals.

**Utilities**:

| Utility | Description |
|---------|-------------|
| `map(signal, fn)` | Transform signal value |
| `combine(signals, fn)` | Combine multiple signals |
| `filter(signal, pred)` | Filter signal updates |
| `debounce(signal, ms)` | Debounce updates |
| `throttle(signal, ms)` | Throttle updates |
| `distinctUntilChanged(signal)` | Skip equal updates |
| `switchMap(signal, fn)` | Switch to new signal on change |

**Acceptance Criteria**:
- [ ] All utilities work correctly
- [ ] Proper cleanup on disposal
- [ ] Types are correct
- [ ] Composable with each other
- [ ] Performance acceptable

**Verification**: Use utilities in combinations; verify behavior.

---

### Phase 2: Input Signals

#### Task 2.1: Implement Content Signal
**File**: `src/paradigms/dataflow/inputs/content-signal.ts`

**What to build**:
Signal wrapping content store.

**Features**:
- Updates when store changes
- Provides granular signals for specific blocks
- Efficient diffing

**Signal API**:
| Method | Description |
|--------|-------------|
| `content()` | All content signal |
| `block(id)` | Signal for specific block |
| `children(id)` | Signal for block's children |
| `query(predicate)` | Signal for query result |

**Acceptance Criteria**:
- [ ] Reflects store changes
- [ ] Granular signals work
- [ ] Efficient (doesn't over-notify)
- [ ] Handles block additions/removals
- [ ] Query signals update correctly

**Verification**: Modify store; verify signal updates.

---

#### Task 2.2: Implement Viewport Signal
**File**: `src/paradigms/dataflow/inputs/viewport-signal.ts`

**What to build**:
Signal for viewport/screen information.

**Viewport Data**:
| Field | Description |
|-------|-------------|
| `width` | Viewport width |
| `height` | Viewport height |
| `breakpoint` | Current breakpoint name |
| `orientation` | Portrait/landscape |
| `pixelRatio` | Device pixel ratio |

**Features**:
- Updates on resize
- Debounced for performance
- Derived signals for breakpoints

**Acceptance Criteria**:
- [ ] Tracks viewport accurately
- [ ] Debounced appropriately
- [ ] Breakpoints computed correctly
- [ ] Works in SSR (fallback)
- [ ] Cleans up listeners

**Verification**: Resize viewport; verify signal updates.

---

#### Task 2.3: Implement User State Signal
**File**: `src/paradigms/dataflow/inputs/user-signal.ts`

**What to build**:
Signal for user state and preferences.

**User State**:
| Field | Description |
|-------|-------------|
| `preferences` | User preferences |
| `interactions` | Recent interactions |
| `focus` | Currently focused element |
| `selection` | Selected items |

**Features**:
- Persistent preferences
- Session-based interactions
- Real-time focus/selection

**Acceptance Criteria**:
- [ ] Preferences load/save
- [ ] Interactions tracked
- [ ] Focus/selection accurate
- [ ] Privacy-respecting
- [ ] Signals are granular

**Verification**: Interact with UI; verify state signal.

---

#### Task 2.4: Implement Time Signal
**File**: `src/paradigms/dataflow/inputs/time-signal.ts`

**What to build**:
Signals for time-based reactivity.

**Time Signals**:
| Signal | Description |
|--------|-------------|
| `now()` | Current timestamp (configurable interval) |
| `elapsed()` | Time since start |
| `interval(ms)` | Ticks every ms |
| `timeout(ms)` | Single tick after ms |
| `timeOfDay()` | Morning/afternoon/evening/night |

**Use Cases**:
- Auto-refresh content
- Time-based styling (night mode)
- Animation timing
- Session timeout

**Acceptance Criteria**:
- [ ] Intervals work correctly
- [ ] Can be paused/resumed
- [ ] Cleanup on disposal
- [ ] Configurable precision
- [ ] Battery-friendly

**Verification**: Create time-dependent UI; verify updates.

---

### Phase 3: Transform Functions

#### Task 3.1: Implement Content Transforms
**File**: `src/paradigms/dataflow/transforms/content-transforms.ts`

**What to build**:
Pure functions transforming content signals.

**Transforms**:

| Transform | Input | Output |
|-----------|-------|--------|
| `analyze` | Content | ContentAnalysis |
| `filter` | Content, Predicate | Filtered Content |
| `sort` | Content, Comparator | Sorted Content |
| `group` | Content, Key | Grouped Content |
| `paginate` | Content, Page, Size | Page of Content |
| `search` | Content, Query | Search Results |

**Acceptance Criteria**:
- [ ] All transforms pure
- [ ] Work with signals
- [ ] Composable
- [ ] Efficient (incremental where possible)
- [ ] Type-safe

**Verification**: Apply transforms; verify results.

---

#### Task 3.2: Implement View Selection Transform
**File**: `src/paradigms/dataflow/transforms/view-selection.ts`

**What to build**:
Transform that selects view based on inputs.

**Input Signals**:
- Content analysis
- Viewport
- User preferences

**Output**:
- Selected view type
- View configuration

**Selection Logic**:
```
viewType = computed(() => {
  const analysis = analysisSignal.get()
  const viewport = viewportSignal.get()
  const prefs = userPrefs.get()
  
  if (prefs.preferredView) return prefs.preferredView
  if (viewport.width < 768) return 'list' // Mobile
  if (analysis.hasStatusColumn) return 'kanban'
  if (analysis.hasDateColumn) return 'calendar'
  return 'table'
})
```

**Acceptance Criteria**:
- [ ] Selection responds to all inputs
- [ ] Logic is sensible
- [ ] Override works
- [ ] Mobile handling correct
- [ ] Stable (doesn't flicker)

**Verification**: Change inputs; verify selection changes.

---

#### Task 3.3: Implement Layout Transform
**File**: `src/paradigms/dataflow/transforms/layout-transform.ts`

**What to build**:
Transform that computes layout from inputs.

**Input Signals**:
- View type
- Viewport
- Content amount

**Output**:
- Layout configuration (columns, gaps, etc.)

**Layout Computation**:
- Responsive breakpoints
- Content-aware sizing
- Density preferences

**Acceptance Criteria**:
- [ ] Layout responds to viewport
- [ ] Content amount considered
- [ ] Responsive breakpoints work
- [ ] Density preferences applied
- [ ] Layout is stable

**Verification**: Resize; verify layout adapts.

---

### Phase 4: UISpec Generation

#### Task 4.1: Implement Reactive UISpec Generator
**File**: `src/paradigms/dataflow/generator/reactive-generator.ts`

**What to build**:
Generate UISpec as computed signal.

**Generator as Signal Graph**:
```
contentSignal
     ↓
analysisSignal = computed(() => analyze(contentSignal.get()))
     ↓
viewTypeSignal = computed(() => selectView(analysisSignal.get(), ...))
     ↓
layoutSignal = computed(() => computeLayout(viewTypeSignal.get(), ...))
     ↓
uiSpecSignal = computed(() => generateSpec(viewTypeSignal.get(), layoutSignal.get(), ...))
```

**Acceptance Criteria**:
- [ ] UISpec is reactive signal
- [ ] Updates on any input change
- [ ] Intermediate signals available
- [ ] Efficient (incremental)
- [ ] Always valid

**Verification**: Change inputs; verify UISpec updates.

---

#### Task 4.2: Implement Incremental Diffing
**File**: `src/paradigms/dataflow/generator/incremental.ts`

**What to build**:
Only regenerate changed parts of UISpec.

**Diffing Strategy**:
1. Track which content blocks changed
2. Map blocks to UISpec nodes
3. Only regenerate affected nodes
4. Preserve unchanged subtrees

**Optimization Levels**:
| Level | Description |
|-------|-------------|
| Full | Regenerate everything |
| Structural | Reuse unchanged structure |
| Minimal | Only update changed props |

**Acceptance Criteria**:
- [ ] Detects changes correctly
- [ ] Only affected nodes regenerate
- [ ] Keys enable React reconciliation
- [ ] Preserves component state
- [ ] Measurably faster

**Verification**: Make small changes; verify minimal regeneration.

---

### Phase 5: Reactive Rendering

#### Task 5.1: Implement Reactive Renderer
**File**: `src/paradigms/dataflow/renderer/reactive-renderer.tsx`

**What to build**:
React integration for signal-based UISpec.

**Renderer Features**:
- Subscribe to UISpec signal
- Re-render on signal change
- Preserve component instances where possible
- Error boundaries for failures

**React Integration**:
- Hook: `useSignal(signal)` - subscribe to signal
- Component: `<SignalRenderer spec={uiSpecSignal} />`

**Acceptance Criteria**:
- [ ] Renders UISpec signal
- [ ] Updates on signal change
- [ ] Component state preserved
- [ ] Errors handled gracefully
- [ ] Performance acceptable

**Verification**: Update signals; verify DOM updates correctly.

---

#### Task 5.2: Implement Transition Handling
**File**: `src/paradigms/dataflow/renderer/transitions.ts`

**What to build**:
Smooth transitions when UISpec changes.

**Transition Types**:
| Type | When |
|------|------|
| Fade | Content changes |
| Slide | Layout shifts |
| Scale | Items added/removed |
| None | Prop-only changes |

**Implementation**:
- Detect change type
- Apply appropriate transition
- Coordinate with React's transition API

**Acceptance Criteria**:
- [ ] Transitions are smooth
- [ ] Appropriate transition selected
- [ ] Can disable transitions
- [ ] Doesn't break interaction
- [ ] Respects reduced motion

**Verification**: Make changes; verify transitions.

---

### Phase 6: Pipeline Integration

#### Task 6.1: Implement Dataflow Pipeline
**File**: `src/paradigms/dataflow/pipeline.ts`

**What to build**:
Complete pipeline extending GenerationPipeline base.

**Pipeline as Signal Graph**:
Rather than single generate() call, pipeline creates a live signal graph.

**Pipeline API**:
| Method | Description |
|--------|-------------|
| `create(context)` | Create signal graph |
| `getUISpecSignal()` | Get live UISpec signal |
| `dispose()` | Clean up signals |

**Metadata Signal**:
- Generation time (per update)
- Change source
- Transform timings

**Acceptance Criteria**:
- [ ] Creates working signal graph
- [ ] UISpec signal is live
- [ ] Cleanup works
- [ ] Metadata tracked
- [ ] Integrates with demo app

**Verification**: Run pipeline; verify live updates.

---

### Phase 7: Debugging

#### Task 7.1: Implement Signal Debugger
**File**: `src/paradigms/dataflow/ui/signal-debugger.tsx`

**What to build**:
Debug tool for signal graphs.

**Debugger Features**:

| Feature | Description |
|---------|-------------|
| Graph view | Visualize signal dependencies |
| Value inspector | See current values |
| Update log | Log of all updates |
| Time travel | Replay past states |
| Breakpoints | Pause on signal change |

**Acceptance Criteria**:
- [ ] Graph renders correctly
- [ ] Values inspectable
- [ ] Updates logged
- [ ] Time travel works
- [ ] Useful for debugging

**Verification**: Debug issues; verify tool helps.

---

#### Task 7.2: Implement Performance Monitor
**File**: `src/paradigms/dataflow/ui/perf-monitor.tsx`

**What to build**:
Monitor signal graph performance.

**Metrics**:
| Metric | Description |
|--------|-------------|
| Update frequency | How often signals update |
| Computation time | Time in computed functions |
| Cascade depth | How deep updates propagate |
| Memory usage | Signal storage |

**Acceptance Criteria**:
- [ ] All metrics tracked
- [ ] Real-time display
- [ ] Identify bottlenecks
- [ ] Export data
- [ ] Minimal overhead

**Verification**: Run with monitor; verify insights.

---

## Verification Checklist

After completing all tasks, verify:

- [ ] Signals track and propagate correctly
- [ ] All input signals work
- [ ] Transforms are composable and efficient
- [ ] UISpec updates reactively
- [ ] Incremental updates work
- [ ] Debugging tools are useful
- [ ] Performance is acceptable

---

## Extension Points

Future enhancements:
1. Distributed signals (multi-device sync)
2. Signal persistence (save/restore graph state)
3. Signal recording (replay sessions)
4. Custom signal operators
5. Server-side signals

