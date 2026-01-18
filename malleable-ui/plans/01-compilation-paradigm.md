# Paradigm 1: Compilation

## Executive Summary

**Mental Model**: Content is source code, UI is the compiled output.

**Core Question**: "How do I transform this content into UI?"

**Metaphor**: Think of a compiler pipeline. Source code (content) is parsed into an intermediate representation (IR), analyzed and optimized through multiple passes, then emitted as target code (UISpec). Each pass has a single responsibility and is independently testable.

---

## Why This Paradigm?

The compilation approach works well because:

1. **Predictable**: Same input always produces same output (deterministic)
2. **Debuggable**: Can inspect IR at each stage to understand decisions
3. **Extensible**: Add new passes without changing existing ones
4. **Fast**: No iterative refinement or search—single forward pass
5. **Familiar**: Developers understand compiler concepts

**Best suited for**:
- High-volume content where speed matters
- Content with clear structural patterns
- Situations requiring reproducible output
- Batch processing scenarios

**Less suited for**:
- Highly ambiguous content needing interpretation
- Personalization requiring user preference learning
- Exploratory interfaces where multiple options should be offered

---

## Architecture Overview

```
Content (Blocks)
    ↓
[Parser] ─── Converts blocks to IR
    ↓
Intermediate Representation (IR)
    ↓
[Analysis Passes] ─── Extract patterns, annotate
    ↓
Annotated IR
    ↓
[Transform Passes] ─── Apply view decisions
    ↓
Layout IR
    ↓
[Optimization Passes] ─── Performance improvements
    ↓
Optimized IR
    ↓
[Emitter] ─── Generate UISpec
    ↓
UISpec (Output)
```

---

## Key Concepts

### Intermediate Representation (IR)

The IR is a normalized tree that abstracts away content-type differences. While a Page has "headings" and a Database has "columns," in IR both become structural elements that can be processed uniformly.

**IR Node Types**:
| Kind | Description | Source |
|------|-------------|--------|
| `document` | Root container | PageBlock, DatabaseBlock, CanvasBlock |
| `section` | Logical grouping | Heading-defined sections, whiteboard clusters |
| `group` | Visual grouping | Lists, related rows |
| `item` | Single content piece | Paragraph, row, shape |
| `collection` | Homogeneous items | Database rows, list items |
| `record` | Key-value data | Row fields |
| `field` | Single data point | Cell value |

### Annotations

Passes attach annotations to IR nodes without modifying structure:
- `importance: number` - How prominent this should be
- `semanticRole: string` - What this represents (title, status, date, etc.)
- `suggestedComponent: string` - What component might render this
- `layoutHints: object` - Size, position suggestions

### Passes

Each pass is a function: `(ir: IRNode) => IRNode`

Passes are categorized:
1. **Analysis**: Read-only, add annotations
2. **Transform**: Modify structure, make view decisions
3. **Optimize**: Improve performance without changing semantics

---

## Task Breakdown

### Phase 1: IR Foundation

#### Task 1.1: Define IR Node Types
**File**: `src/paradigms/compilation/ir/types.ts`

**What to build**:
- `IRNode` interface with kind, data, children, annotations
- Type-specific data shapes for each kind
- Annotation types and type guards
- Tree traversal utilities

**IR Node Structure**:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `kind` | IRKind | Node type |
| `data` | KindData | Kind-specific payload |
| `children` | IRNode[] | Child nodes |
| `annotations` | IRAnnotation[] | Attached metadata |
| `sourceBlockId` | string? | Original block reference |

**Annotation Structure**:

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Annotation category |
| `source` | string | Which pass added this |
| `confidence` | number | 0-1 confidence score |
| `payload` | any | Annotation data |

**Acceptance Criteria**:
- [ ] All IR kinds have typed data shapes
- [ ] Can construct valid IR trees
- [ ] Annotations can be added/queried efficiently
- [ ] Source block reference maintained for debugging
- [ ] Tree traversal helpers work correctly (map, filter, find, reduce)

**Verification**: Unit tests constructing and traversing IR trees.

---

#### Task 1.2: Implement IR Builder Utilities
**File**: `src/paradigms/compilation/ir/builder.ts`

**What to build**:
Fluent builder API for constructing IR nodes.

**Builder Features**:
| Method | Description |
|--------|-------------|
| `document()` | Start building document node |
| `section(title?)` | Create section node |
| `group()` | Create group node |
| `item(data)` | Create item node |
| `collection(items)` | Create collection from items |
| `withAnnotation(type, payload)` | Add annotation |
| `withChildren(...)` | Add children |
| `build()` | Finalize and return IR |

**Acceptance Criteria**:
- [ ] Builder produces valid IR
- [ ] Fluent chaining works naturally
- [ ] Immutable (each call returns new builder)
- [ ] Validates structure during build
- [ ] Can clone and modify existing IR

**Verification**: Build various IR structures; verify correctness.

---

### Phase 2: Content Parsers

#### Task 2.1: Implement Page Parser
**File**: `src/paradigms/compilation/parsers/page-parser.ts`

**What to build**:
Convert Page blocks to IR.

**Parsing Rules**:

| Block Type | IR Conversion |
|------------|---------------|
| PageBlock | `document` node |
| HeadingBlock | Creates/closes `section` based on level |
| TextBlock | `item` node with text data |
| ListBlock | `group` with `item` children |
| ImageBlock | `item` with image data |
| EmbedBlock | `item` with embed data |

**Section Detection**:
- H1 creates top-level section
- H2 creates subsection within H1 section
- H3+ creates deeper nesting
- Content between headings belongs to preceding section

**Acceptance Criteria**:
- [ ] All page block types parsed correctly
- [ ] Heading hierarchy creates proper section nesting
- [ ] Text content preserved accurately
- [ ] List nesting handled correctly
- [ ] Source block IDs linked

**Verification**: Parse page fixtures; verify IR structure matches expected.

---

#### Task 2.2: Implement Whiteboard Parser
**File**: `src/paradigms/compilation/parsers/whiteboard-parser.ts`

**What to build**:
Convert Whiteboard blocks to IR.

**Parsing Rules**:

| Block Type | IR Conversion |
|------------|---------------|
| CanvasBlock | `document` node |
| ShapeBlock | `item` with shape data |
| StickyBlock | `item` with sticky data |
| ConnectorBlock | Stored as relationship, not node |

**Spatial Analysis**:
- Detect clusters using distance threshold
- Each cluster becomes a `section`
- Connected components via connectors form `groups`
- Preserve position data for layout hints

**Acceptance Criteria**:
- [ ] All whiteboard blocks parsed
- [ ] Spatial clusters detected and grouped
- [ ] Connector relationships preserved
- [ ] Bounding boxes calculated
- [ ] Position data available for layout

**Verification**: Parse whiteboard fixtures; verify clusters match visual groupings.

---

#### Task 2.3: Implement Database Parser
**File**: `src/paradigms/compilation/parsers/database-parser.ts`

**What to build**:
Convert Database blocks to IR.

**Parsing Rules**:

| Block Type | IR Conversion |
|------------|---------------|
| DatabaseBlock | `document` with column metadata |
| RowBlock | `record` node |
| Cell values | `field` nodes |

**Special Handling**:
- Detect semantic columns (status, date, assignee)
- Mark as annotations on fields
- Calculate column statistics (unique values, ranges)

**Acceptance Criteria**:
- [ ] Database structure converted to IR
- [ ] Column types preserved
- [ ] Row data accessible as records
- [ ] Semantic columns identified
- [ ] Statistics calculated

**Verification**: Parse database fixtures; verify field access works.

---

### Phase 3: Analysis Passes

#### Task 3.1: Implement Heading Hierarchy Pass
**File**: `src/paradigms/compilation/passes/analysis/heading-hierarchy.ts`

**What to build**:
Analyze document structure from headings.

**Annotations Added**:
| Annotation | Description |
|------------|-------------|
| `outline-level` | Depth in document outline |
| `section-importance` | Based on heading level and content |
| `has-subsections` | Boolean |
| `subsection-count` | Number |

**Acceptance Criteria**:
- [ ] Correctly identifies outline structure
- [ ] Importance scores reflect heading levels
- [ ] Handles missing heading levels gracefully (e.g., H1 → H3)
- [ ] Works with flat documents (no headings)

**Verification**: Run on page fixtures; verify outline matches expected.

---

#### Task 3.2: Implement Status Workflow Pass
**File**: `src/paradigms/compilation/passes/analysis/status-workflow.ts`

**What to build**:
Detect status-based workflows in databases.

**Detection Heuristics**:
- Column named "status", "state", "stage", "phase"
- Select/single-select column type
- Values like: todo/in-progress/done, open/closed, draft/published

**Annotations Added**:
| Annotation | Description |
|------------|-------------|
| `status-column` | Which column is status |
| `status-values` | Unique status values found |
| `status-distribution` | Count per status |
| `workflow-detected` | Boolean |
| `kanban-suitable` | Boolean (if workflow detected) |

**Acceptance Criteria**:
- [ ] Detects status columns by name and type
- [ ] Extracts all unique status values
- [ ] Calculates distribution
- [ ] Correctly identifies kanban suitability
- [ ] Works when no status column exists

**Verification**: Run on database fixtures; verify status detection.

---

#### Task 3.3: Implement Date Pattern Pass
**File**: `src/paradigms/compilation/passes/analysis/date-patterns.ts`

**What to build**:
Detect date-based patterns for timeline/calendar views.

**Detection Heuristics**:
- Column with date type
- Column names: date, due, deadline, created, updated, start, end
- Date range patterns (start + end dates)

**Annotations Added**:
| Annotation | Description |
|------------|-------------|
| `date-columns` | Array of date column info |
| `date-range` | Min/max dates in data |
| `has-date-range` | Has both start and end dates |
| `temporal-density` | Items per time unit |
| `calendar-suitable` | Good for calendar view |
| `timeline-suitable` | Good for timeline view |

**Acceptance Criteria**:
- [ ] Detects date columns correctly
- [ ] Calculates date ranges
- [ ] Identifies date range pairs (start/end)
- [ ] Determines view suitability
- [ ] Handles empty/missing dates

**Verification**: Run on fixtures with dates; verify detection.

---

#### Task 3.4: Implement Spatial Clusters Pass
**File**: `src/paradigms/compilation/passes/analysis/spatial-clusters.ts`

**What to build**:
Analyze spatial relationships in whiteboards.

**Clustering Algorithm**:
- Use distance-based clustering (DBSCAN or simple threshold)
- Consider visual weight (larger elements anchor clusters)
- Respect connector relationships

**Annotations Added**:
| Annotation | Description |
|------------|-------------|
| `cluster-id` | Which cluster this belongs to |
| `cluster-centroid` | Center point of cluster |
| `cluster-bounds` | Bounding box |
| `cluster-members` | IDs of cluster members |
| `is-isolated` | Not in any cluster |
| `connection-count` | Number of connections |

**Acceptance Criteria**:
- [ ] Groups nearby elements into clusters
- [ ] Handles overlapping elements
- [ ] Respects connector relationships
- [ ] Calculates cluster metadata
- [ ] Works with sparse layouts

**Verification**: Run on whiteboard fixtures; visualize clusters.

---

#### Task 3.5: Implement Importance Scoring Pass
**File**: `src/paradigms/compilation/passes/analysis/importance.ts`

**What to build**:
Calculate importance score for each IR node.

**Scoring Factors**:

| Factor | Weight | Description |
|--------|--------|-------------|
| Heading level | High | H1 > H2 > H3 > text |
| Position | Medium | Earlier = more important |
| Size | Medium | Larger elements more important |
| Connections | Medium | More connections = hub |
| Content length | Low | Longer content may be important |
| Semantic role | High | Title, status are important |

**Output**:
- `importance: number` (0-1) on each node
- `relative-importance: number` (within siblings)

**Acceptance Criteria**:
- [ ] All nodes receive importance scores
- [ ] Scores reflect intuitive importance
- [ ] Factors are configurable
- [ ] Handles edge cases (empty content)
- [ ] Scores are normalized

**Verification**: Score fixtures; verify important elements score high.

---

### Phase 4: Transform Passes

#### Task 4.1: Implement Structure Normalization Pass
**File**: `src/paradigms/compilation/passes/transform/normalize.ts`

**What to build**:
Normalize IR structure for consistent processing.

**Normalizations**:
| Transform | Description |
|-----------|-------------|
| Flatten single-child sections | Remove unnecessary nesting |
| Merge adjacent text nodes | Combine for rendering |
| Hoist orphan content | Put heading-less content in implicit section |
| Standardize field names | Consistent casing |

**Acceptance Criteria**:
- [ ] IR is structurally consistent after pass
- [ ] No information lost
- [ ] Idempotent (running twice = running once)
- [ ] Handles all IR kinds

**Verification**: Normalize fixtures; verify structure.

---

#### Task 4.2: Implement View Selection Pass
**File**: `src/paradigms/compilation/passes/transform/view-selection.ts`

**What to build**:
Decide which view type to use for each section.

**View Selection Rules**:

| Condition | Selected View |
|-----------|---------------|
| Database + status column + kanban-suitable | KanbanBoard |
| Database + date column + calendar-suitable | Calendar |
| Database + date range + timeline-suitable | Timeline |
| Database (default) | Table |
| Collection with images | Gallery |
| Collection (default) | List |
| Document with sections | Accordion or Tabs |
| Whiteboard with flow | Flowchart |
| Whiteboard (default) | Canvas |

**Annotations Added**:
- `selected-view: string` - Component to use
- `view-confidence: number` - How sure we are
- `alternative-views: string[]` - Other options

**Acceptance Criteria**:
- [ ] Selects appropriate view for content
- [ ] Confidence reflects how good the match is
- [ ] Alternatives provided for user override
- [ ] Handles ambiguous cases reasonably
- [ ] Rules are configurable

**Verification**: Run on fixtures; verify view selections make sense.

---

#### Task 4.3: Implement Layout Hints Pass
**File**: `src/paradigms/compilation/passes/transform/layout-hints.ts`

**What to build**:
Add layout information to guide emitter.

**Layout Hints**:
| Hint | Description |
|------|-------------|
| `layout-direction` | horizontal / vertical |
| `layout-columns` | Number of grid columns |
| `layout-gap` | Spacing between items |
| `min-width` | Minimum width |
| `max-width` | Maximum width |
| `prominence` | full / half / quarter |
| `collapse-by-default` | Start collapsed |

**Determination Factors**:
- Screen viewport (from context)
- Content amount
- Importance scores
- Content type (images want width, text wants height)

**Acceptance Criteria**:
- [ ] All renderable nodes have layout hints
- [ ] Hints are appropriate for content
- [ ] Responsive considerations included
- [ ] Prominence reflects importance
- [ ] Handles nested layouts

**Verification**: Check hints produce good layouts.

---

### Phase 5: Optimization Passes

#### Task 5.1: Implement Component Deduplication Pass
**File**: `src/paradigms/compilation/passes/optimize/deduplicate.ts`

**What to build**:
Identify repeated patterns that can share components.

**Deduplication Targets**:
- Repeated card layouts
- Similar list items
- Common header patterns

**Output**:
- Mark nodes with shared `template-id`
- Extract template definition

**Acceptance Criteria**:
- [ ] Identifies repeated patterns
- [ ] Templates are correctly extracted
- [ ] Variations are handled (same structure, different data)
- [ ] Doesn't over-deduplicate (preserve meaningful differences)

**Verification**: Process fixtures; verify templates.

---

#### Task 5.2: Implement Lazy Loading Pass
**File**: `src/paradigms/compilation/passes/optimize/lazy-load.ts`

**What to build**:
Mark heavy content for lazy loading.

**Lazy Loading Candidates**:
- Images below the fold
- Collapsed sections
- Data beyond initial viewport
- Embeds (videos, iframes)

**Annotations Added**:
- `lazy-load: boolean`
- `load-trigger: 'visible' | 'interaction' | 'explicit'`
- `placeholder: string` - What to show while loading

**Acceptance Criteria**:
- [ ] Heavy content marked for lazy loading
- [ ] Above-fold content not lazy loaded
- [ ] Appropriate placeholders defined
- [ ] Load triggers make sense

**Verification**: Verify lazy loading marks.

---

#### Task 5.3: Implement Virtualization Pass
**File**: `src/paradigms/compilation/passes/optimize/virtualize.ts`

**What to build**:
Mark long lists for virtualization.

**Virtualization Threshold**: > 50 items

**Annotations Added**:
- `virtualize: boolean`
- `estimated-item-height: number`
- `overscan: number` - Items to render beyond viewport

**Acceptance Criteria**:
- [ ] Long lists marked for virtualization
- [ ] Item heights estimated
- [ ] Appropriate overscan values
- [ ] Short lists not virtualized

**Verification**: Process large fixtures; verify marks.

---

### Phase 6: Emitter

#### Task 6.1: Implement UISpec Emitter
**File**: `src/paradigms/compilation/emitter/emitter.ts`

**What to build**:
Convert annotated IR to UISpec.

**Emitter Responsibilities**:
1. Map IR kinds to components
2. Convert data to props
3. Respect layout hints
4. Handle lazy loading
5. Apply virtualization
6. Generate proper keys

**Component Mapping**:

| IR Kind + Annotations | Component |
|-----------------------|-----------|
| document + page | Stack |
| document + database + kanban | KanbanBoard |
| document + database + table | Table |
| section + collapsible | Accordion |
| section + tabs | Tabs |
| group | Card or Stack |
| collection + gallery | Gallery |
| collection + list | List |
| item + text | Text |
| item + image | Image |
| record | Card with fields |
| field | Text or Badge |

**Acceptance Criteria**:
- [ ] All IR patterns emit valid UISpec
- [ ] Props correctly populated
- [ ] Layout hints applied
- [ ] Keys generated for lists
- [ ] Handles unknown patterns gracefully

**Verification**: Emit from IR; verify UISpec renders correctly.

---

### Phase 7: Pipeline Integration

#### Task 7.1: Implement Pass Registry
**File**: `src/paradigms/compilation/passes/registry.ts`

**What to build**:
Registry for managing and ordering passes.

**Features**:
| Feature | Description |
|---------|-------------|
| Registration | Register passes with metadata |
| Ordering | Define pass dependencies |
| Filtering | Enable/disable passes |
| Composition | Create pass pipelines |

**Pass Metadata**:
- `name: string`
- `phase: 'analysis' | 'transform' | 'optimize'`
- `dependencies: string[]` - Must run after these
- `optional: boolean` - Can skip if needed

**Acceptance Criteria**:
- [ ] Passes register correctly
- [ ] Dependencies respected in ordering
- [ ] Can enable/disable passes
- [ ] Can create custom pipelines
- [ ] Detects circular dependencies

**Verification**: Register passes; verify order.

---

#### Task 7.2: Implement Compilation Pipeline
**File**: `src/paradigms/compilation/pipeline.ts`

**What to build**:
Complete pipeline extending GenerationPipeline base.

**Pipeline Steps**:
1. Detect content type
2. Select appropriate parser
3. Parse to IR
4. Run analysis passes
5. Run transform passes
6. Run optimization passes
7. Emit UISpec
8. Collect metadata

**Debugging Support**:
- Log IR at each stage (when debug enabled)
- Track which passes modified what
- Measure time per pass

**Acceptance Criteria**:
- [ ] Full pipeline works end-to-end
- [ ] All content types supported
- [ ] Metadata correctly collected
- [ ] Debug logging helpful
- [ ] Errors indicate which pass failed

**Verification**: Run pipeline on all fixtures; verify output.

---

### Phase 8: AI Augmentation

#### Task 8.1: Implement LLM-Assisted Analysis
**File**: `src/paradigms/compilation/passes/analysis/llm-analysis.ts`

**What to build**:
Use LLM for ambiguous analysis decisions.

**When to Use LLM**:
- Status column detection when naming is unclear
- Document intent when structure is ambiguous
- Semantic role assignment for unlabeled fields
- View selection when multiple views are equally suitable

**Implementation**:
- Only invoke when heuristics are uncertain (confidence < threshold)
- Cache LLM decisions for similar patterns
- Include decision in metadata for explainability

**Acceptance Criteria**:
- [ ] LLM called only when needed
- [ ] Decisions improve over heuristics
- [ ] Caching reduces API calls
- [ ] Decisions are explainable
- [ ] Works when LLM unavailable (falls back to heuristics)

**Verification**: Test with ambiguous content; verify LLM improves results.

---

### Phase 9: Developer Tools

#### Task 9.1: Implement IR Visualizer
**File**: `src/paradigms/compilation/debug/ir-visualizer.tsx`

**What to build**:
React component to visualize IR trees.

**Features**:
- Tree view of IR nodes
- Expand/collapse nodes
- Show/hide annotations
- Filter by annotation type
- Highlight nodes by kind
- Click to see full node data

**Acceptance Criteria**:
- [ ] Renders any IR tree
- [ ] Annotations visible
- [ ] Performance okay with large trees
- [ ] Useful for debugging

**Verification**: Use while debugging; verify helpfulness.

---

#### Task 9.2: Implement Pass Inspector
**File**: `src/paradigms/compilation/debug/pass-inspector.tsx`

**What to build**:
Visualize IR changes across passes.

**Features**:
- Step through passes
- See before/after for each pass
- Highlight changes
- Show timing per pass
- Export for analysis

**Acceptance Criteria**:
- [ ] Shows all passes in order
- [ ] Changes clearly highlighted
- [ ] Timing accurate
- [ ] Can export data

**Verification**: Inspect pass execution; verify clarity.

---

## Verification Checklist

After completing all tasks, verify:

- [ ] Can compile all fixture types (page, whiteboard, database)
- [ ] Output UISpec renders correctly
- [ ] Performance acceptable (< 500ms for typical content)
- [ ] Debug tools help identify issues
- [ ] LLM augmentation improves ambiguous cases
- [ ] Pipeline is extensible (can add new passes)

---

## Extension Points

Future enhancements:
1. Custom pass plugins
2. Theme-aware emission
3. Accessibility pass
4. Internationalization pass
5. Performance profiling pass

