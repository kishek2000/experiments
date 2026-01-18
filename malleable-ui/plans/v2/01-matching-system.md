# Plan 01: The Matching System

## Overview

The matching system is the **heart of the architecture**. Its job: given a user's intent and content schema, find the best existing component—or determine that generation is necessary.

**Key Insight**: We can't read 1000 lines of React to decide if a component fits. Every component has a **Matching Spec**—a structured description of what it does, separate from how it's implemented.

---

## The Matching Hierarchy

| Decision | When | Latency | Mechanism |
|----------|------|---------|-----------|
| **Retrieve** | Exact or near-exact match | <50ms | Spec signature lookup |
| **Adapt** | Same structure, different fields | <200ms | Field remapping |
| **Generate** | Novel requirement | 2-5s | LLM generation |

**Design principle**: The system should retrieve 80%+ of requests. Generation is the fallback, not the default.

---

## Part 1: The Matching Spec Schema

### 1.1 Intent Signature

What the user wants to **accomplish**.

**Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `primaryGoal` | enum | The main user objective |
| `emphasis` | string[] | Fields/aspects to highlight |
| `layout` | enum | Spatial arrangement preference |

**Primary Goals**:
| Goal | Description | Example Request |
|------|-------------|-----------------|
| `view` | See information | "Show me the tasks" |
| `compare` | Side-by-side | "Compare these two versions" |
| `track` | Monitor progress | "Track status of my items" |
| `organize` | Arrange/categorize | "Group by status" |
| `find` | Search/filter | "Find overdue tasks" |
| `edit` | Modify content | "Let me update these" |
| `create` | Add new items | "Add a new task" |
| `summarize` | Overview/aggregate | "Summary of project status" |

**Layouts**:
| Layout | Description | Typical Component |
|--------|-------------|-------------------|
| `grouped` | Items in buckets | Kanban board |
| `sequential` | Items in order | List, table |
| `grid` | Items in 2D matrix | Gallery, grid |
| `hierarchical` | Nested items | Tree, outline |
| `timeline` | Items on time axis | Calendar, Gantt |
| `freeform` | Free placement | Canvas, whiteboard |

**Acceptance Criteria**:
- [ ] All primary goals enumerated
- [ ] All layouts enumerated
- [ ] Emphasis is freeform string array
- [ ] Can serialize to/from JSON
- [ ] Can compute similarity between two IntentSignatures

---

### 1.2 Schema Signature

What **shape of content** the component handles.

**Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `required` | FieldRequirement[] | Must have these fields |
| `optional` | FieldRequirement[] | Works better with these |
| `structure` | StructureSpec | Item count, nesting, relations |

**Field Requirement**:

| Field | Type | Description |
|-------|------|-------------|
| `role` | enum | Semantic role of the field |
| `type` | enum | Data type |
| `usage` | enum | How the field is used |

**Field Roles** (semantic, not just type):
| Role | Description | Example |
|------|-------------|---------|
| `identifier` | Unique ID | Task ID |
| `title` | Primary label | Task name |
| `status` | Workflow state | To Do / In Progress / Done |
| `category` | Classification | Type, tag |
| `date` | Single date | Due date |
| `dateRange` | Start + end | Sprint dates |
| `person` | User reference | Assignee |
| `priority` | Importance level | P1, P2, P3 |
| `numeric` | Number value | Story points |
| `richText` | Formatted text | Description |
| `media` | Image/video | Attachment |
| `link` | URL or relation | Related task |

**Field Usages**:
| Usage | Description |
|-------|-------------|
| `display` | Shown in UI |
| `group` | Used to group items |
| `sort` | Used to order items |
| `filter` | Used to filter items |
| `aggregate` | Summed/counted |
| `link` | Navigation target |

**Structure Spec**:
| Field | Description |
|-------|-------------|
| `minItems` | Minimum items component handles |
| `maxItems` | Maximum items (or "unlimited") |
| `supportsNested` | Can items have children? |
| `supportsRelations` | Can items link to each other? |

**Acceptance Criteria**:
- [ ] All field roles enumerated
- [ ] All usages enumerated
- [ ] Structure constraints expressible
- [ ] Can compute schema compatibility score

---

### 1.3 Capability Signature

What the component can **do** (operations).

**Schema**:

| Capability | Type | Description |
|------------|------|-------------|
| `canFilter` | boolean | Filter items by criteria |
| `canSort` | boolean | Reorder by field |
| `canGroup` | boolean | Group by field |
| `canAggregate` | boolean | Show counts/sums |
| `canPaginate` | boolean | Handle large sets |
| `canVirtualize` | boolean | Render only visible |
| `canEditInline` | boolean | Edit without modal |
| `canReorder` | boolean | Drag to reorder |
| `canReparent` | boolean | Move between groups |
| `canCreate` | boolean | Add new items |
| `canDelete` | boolean | Remove items |
| `canExpand` | boolean | Show/hide details |
| `canCollapse` | boolean | Minimize sections |
| `canZoom` | boolean | Scale view |
| `canSelect` | boolean | Multi-select items |

**Acceptance Criteria**:
- [ ] All capabilities are boolean flags
- [ ] Can compute capability match (query needs subset of component provides)
- [ ] Missing capabilities reduce match score

---

### 1.4 Affordance Signature

What **interactions** are exposed to users.

**Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `interactions` | Interaction[] | List of user interactions |

**Interaction**:

| Field | Type | Description |
|-------|------|-------------|
| `trigger` | enum | How user initiates |
| `target` | enum | What user acts on |
| `action` | string | What happens |
| `contentEffect` | ContentEffect? | How content changes |

**Triggers**: `click`, `doubleClick`, `drag`, `hover`, `contextMenu`, `keyboard`

**Targets**: `item`, `field`, `group`, `container`, `header`

**Content Effect**:
| Field | Description |
|-------|-------------|
| `operation` | `update`, `create`, `delete`, `reorder` |
| `fields` | Which fields are affected |

**Acceptance Criteria**:
- [ ] All common interactions expressible
- [ ] Content effects capture bidirectional updates
- [ ] Can compare affordance sets

---

### 1.5 Visual Signature

The **look and feel**.

**Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `density` | enum | `compact`, `comfortable`, `spacious` |
| `chrome` | enum | `minimal`, `standard`, `rich` |
| `emphasis` | VisualEmphasis[] | How fields are highlighted |
| `responsive` | ResponsiveSpec | Mobile/tablet behavior |

**Visual Emphasis**:
| Field | Description |
|-------|-------------|
| `field` | Which field |
| `treatment` | `size`, `color`, `position`, `icon` |

**Responsive Spec**:
| Field | Description |
|-------|-------------|
| `mobile` | `stack`, `scroll`, `collapse`, `hide` |
| `tablet` | `adapt`, `same` |

**Acceptance Criteria**:
- [ ] Visual preferences expressible
- [ ] Responsive behavior captured
- [ ] Can compare visual signatures

---

## Part 2: The Matching Algorithm

### 2.1 Signature Comparison

**Task**: Implement comparison functions for each signature type.

**Intent Comparison**:
| Factor | Weight | Scoring |
|--------|--------|---------|
| `primaryGoal` match | 0.5 | Exact = 1.0, related = 0.5, different = 0 |
| `layout` match | 0.3 | Exact = 1.0, compatible = 0.5, different = 0 |
| `emphasis` overlap | 0.2 | Jaccard similarity |

**Schema Comparison**:
| Factor | Weight | Scoring |
|--------|--------|---------|
| Required fields satisfied | 0.6 | All = 1.0, missing = penalty per field |
| Field roles match | 0.3 | Same role = 1.0, compatible = 0.5 |
| Structure compatible | 0.1 | Constraints satisfied |

**Capability Comparison**:
- Query capabilities must be **subset** of component capabilities
- Missing required capability = 0 score (hard failure)
- Extra capabilities = no penalty

**Overall Matching Score**:
```
score = (intent × 0.4) + (schema × 0.4) + (capability × 0.15) + (visual × 0.05)
```

**Acceptance Criteria**:
- [ ] Each signature type has comparison function
- [ ] Weights are configurable
- [ ] Score is 0-1 normalized
- [ ] Hard failures (missing capability) produce 0 score
- [ ] Comparison is fast (<1ms per candidate)

---

### 2.2 Candidate Ranking

**Task**: Given a query, rank all components in library.

**Process**:
1. Filter by hard requirements (content type, required capabilities)
2. Score remaining candidates
3. Sort by score descending
4. Return top N with scores

**Optimization**:
- Index components by primaryGoal + layout for fast filtering
- Pre-compute embeddings of emphasis terms for similarity
- Cache frequent queries

**Acceptance Criteria**:
- [ ] Returns ranked list with scores
- [ ] Fast filtering before expensive scoring
- [ ] Top-10 returned in <50ms for library of 1000 components
- [ ] Scores are explainable (breakdown available)

---

### 2.3 Match Thresholds

**Task**: Define thresholds for retrieve/adapt/generate decisions.

| Score Range | Decision | Action |
|-------------|----------|--------|
| ≥ 0.9 | **Direct Retrieve** | Use component as-is |
| 0.7 - 0.9 | **Adapt** | Remap fields, adjust config |
| 0.5 - 0.7 | **Consider Generate** | May adapt with significant changes, or generate |
| < 0.5 | **Generate** | Create new component |

**Adaptation Path**:
When adapting, compute the "adaptation cost":
- Field remapping (low cost)
- Config changes (low cost)
- Minor visual adjustments (medium cost)
- Capability additions (high cost → might push to generate)

**Acceptance Criteria**:
- [ ] Thresholds are configurable
- [ ] Adaptation cost is computed
- [ ] Decision is deterministic for same inputs
- [ ] Can explain why a decision was made

---

## Part 3: Field Mapping

### 3.1 Schema Alignment

**Task**: Map user's content fields to component's expected fields.

**Challenge**: User has `Workflow Stage`, component expects `status`.

**Approach**:
1. **Role-based matching**: Both are `role: status` → automatic match
2. **Name similarity**: "Workflow Stage" ≈ "Status" via embedding similarity
3. **Type compatibility**: Both are `type: select` → compatible
4. **User confirmation**: Uncertain mappings flagged for confirmation

**Mapping Result**:
```typescript
interface FieldMapping {
  componentField: string;
  contentField: string;
  confidence: number;
  mappingType: 'exact' | 'role' | 'inferred' | 'user';
}
```

**Acceptance Criteria**:
- [ ] Exact name matches automatically mapped
- [ ] Same-role fields matched with high confidence
- [ ] Type-compatible fields suggested
- [ ] Low-confidence mappings flagged
- [ ] User can override any mapping

---

### 3.2 Adaptation Instructions

**Task**: Generate instructions for adapting a component to new content.

**Adaptation Instruction**:
```typescript
interface AdaptationInstruction {
  componentId: string;
  fieldMappings: FieldMapping[];
  configOverrides: Record<string, unknown>;
  visualAdjustments: VisualAdjustment[];
}
```

The component runtime uses these instructions to:
- Bind different fields to expected slots
- Override default configuration
- Apply visual tweaks

**Acceptance Criteria**:
- [ ] Instructions are serializable
- [ ] Component can render with instructions
- [ ] Instructions don't require code changes
- [ ] Can validate instructions against component spec

---

## Part 4: Demo Implementation

### 4.1 Mock Component Library

**Task**: Create 10-20 mock components with MatchingSpecs.

**Components to Mock**:

| Component | Intent | Layout | Key Schema |
|-----------|--------|--------|------------|
| SimpleTable | view | sequential | Any tabular data |
| TaskKanban | organize | grouped | status (required) |
| ProjectCalendar | track | timeline | date (required) |
| ContactCards | view | grid | person, media |
| IssueList | find | sequential | status, priority |
| GanttChart | track | timeline | dateRange (required) |
| OrgTree | view | hierarchical | parent relation |
| MetricsDashboard | summarize | grid | numeric (aggregated) |
| FileGallery | view | grid | media (required) |
| ActivityFeed | track | sequential | date (required) |

**Acceptance Criteria**:
- [ ] Each component has complete MatchingSpec
- [ ] Specs are realistic and varied
- [ ] Cover all primary goals
- [ ] Cover all layouts
- [ ] Include edge cases (minimal vs. rich requirements)

---

### 4.2 Interactive Matcher UI

**Task**: Build UI that visualizes matching in real-time.

**Features**:
| Feature | Description |
|---------|-------------|
| Query input | Enter intent, schema, capabilities |
| Live scoring | See scores update as you type |
| Score breakdown | Expand to see per-signature scores |
| Candidate list | Ranked components with scores |
| Match explanation | Why this component matched/didn't |
| Threshold visualization | See retrieve/adapt/generate zones |

**Acceptance Criteria**:
- [ ] Can enter query signatures interactively
- [ ] Scores update in real-time
- [ ] Can see score breakdown by signature
- [ ] Clear visualization of thresholds
- [ ] Explains match decisions

---

### 4.3 Field Mapping UI

**Task**: Visualize field mapping between query and component.

**Features**:
| Feature | Description |
|---------|-------------|
| Side-by-side | Query fields on left, component fields on right |
| Connection lines | Lines showing mappings |
| Confidence indicators | Color-coded by confidence |
| Manual override | Drag to remap fields |
| Unmapped warning | Highlight unmapped required fields |

**Acceptance Criteria**:
- [ ] Visual representation of mappings
- [ ] Can manually adjust mappings
- [ ] Confidence is visible
- [ ] Unmapped fields are clear
- [ ] Can save mapping as adaptation instruction

---

## Verification Checklist

After completing this plan:

- [ ] All signature schemas defined in TypeScript
- [ ] Comparison functions work for each signature
- [ ] Overall matching score is computed correctly
- [ ] Thresholds produce expected decisions
- [ ] Field mapping works for common cases
- [ ] Mock library has diverse components
- [ ] Interactive UI demonstrates matching
- [ ] Can explain any match decision

---

## Open Questions

### Scoring
1. Are the weights (0.4/0.4/0.15/0.05) right?
2. Should capability mismatch be hard failure or soft penalty?
3. How do we handle "stretch" matches (score 0.5-0.7)?

### Field Mapping
1. How much ambiguity requires user confirmation?
2. Can we learn field mappings from user corrections?
3. Should mappings be stored for future use?

### Performance
1. How large will the component library get?
2. Do we need vector embeddings for emphasis similarity?
3. Should we pre-compute pairwise similarities?

