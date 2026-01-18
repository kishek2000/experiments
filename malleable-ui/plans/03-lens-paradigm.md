# Paradigm 3: Projection / Lens

## Executive Summary

**Mental Model**: There is no "true" UI—only views. The lens is a first-class artifact.

**Core Question**: "What view of this content do I want?"

**Metaphor**: Think of a prism splitting white light into colors. The content is the white light; each lens projects a different spectrum. A database can be viewed as a table, kanban, calendar, or gallery—same data, different lenses.

---

## Why This Paradigm?

The lens/projection approach works well because:

1. **Multiplicity**: Same content, multiple valid views
2. **Persistence**: Lenses are saved and shared artifacts
3. **Composability**: Combine lenses (tabs, filters, overlays)
4. **Bidirectionality**: Changes in UI update content
5. **User Ownership**: Users create and customize lenses

**Best suited for**:
- Databases where multiple views are natural (table, board, calendar)
- Content that different roles view differently
- Power users who want customization
- Collaborative scenarios (share your view)

**Less suited for**:
- Simple documents with one obvious presentation
- One-time content that won't be revisited
- Highly constrained display requirements

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│           CONTENT SPACE                  │
│  (High-dimensional: all fields, all rows)│
└─────────────────┬───────────────────────┘
                  │
         ┌────────┼────────┐
         │        │        │
         ▼        ▼        ▼
      ┌─────┐ ┌─────┐ ┌─────┐
      │Lens │ │Lens │ │Lens │
      │  A  │ │  B  │ │  C  │
      └──┬──┘ └──┬──┘ └──┬──┘
         │       │       │
         ▼       ▼       ▼
      ┌─────┐ ┌─────┐ ┌─────┐
      │Table│ │Kanban│ │Calendar│
      │View │ │View │ │View │
      └─────┘ └─────┘ └─────┘
                  │
                  ▼
         SCREEN SPACE (2D)
```

---

## Key Concepts

### Lens as Artifact

A lens is not just code—it's a saved, shareable, versionable artifact:
- Has a name and description
- Belongs to a user or is shared
- Can be forked and modified
- Tracks version history

### Projection Types

| Projection | Maps From | Maps To |
|------------|-----------|---------|
| Table | Database rows | Grid of cells |
| Kanban | Database rows | Cards in columns |
| Calendar | Items with dates | Events on timeline |
| Gallery | Items with images | Image grid |
| List | Items | Vertical list |
| Tree | Hierarchical items | Expandable tree |
| Graph | Connected items | Node-edge diagram |

### Lens Composition

Lenses can be combined:
- **Tabs**: Multiple lenses, switch between
- **Split**: Multiple lenses side-by-side
- **Overlay**: One lens on top of another
- **Pipe**: Output of one lens feeds another

### Bidirectional Updates

When user edits in UI:
1. Capture the change intent
2. Map back to content change
3. Update content store
4. All lenses re-project

---

## Task Breakdown

### Phase 1: Lens Specification

#### Task 1.1: Define Lens Specification Schema
**File**: `src/paradigms/lens/types/lens-spec.ts`

**What to build**:
Complete schema for defining a lens.

**Lens Specification Structure**:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Display name |
| `description` | string | What this lens shows |
| `version` | number | Schema version |
| `applicability` | ApplicabilitySpec | When this lens can be used |
| `projection` | ProjectionSpec | How to project content |
| `sorting` | SortSpec | Default sort order |
| `filtering` | FilterSpec | Default filters |
| `grouping` | GroupSpec | How to group items |
| `display` | DisplaySpec | Visual configuration |
| `interactions` | InteractionSpec[] | Allowed user actions |
| `metadata` | LensMetadata | Author, created, etc. |

**Applicability Spec**:
| Field | Description |
|-------|-------------|
| `contentTypes` | Which content types work |
| `requiredFields` | Fields that must exist |
| `optionalFields` | Fields that enhance view |
| `minimumItems` | Min items for this view to make sense |

**Projection Spec** (union type for each view):
| Type | Key Fields |
|------|------------|
| `TableProjection` | columns[], columnWidths, rowHeight |
| `KanbanProjection` | groupByField, cardFields[], columnOrder |
| `CalendarProjection` | dateField, endDateField?, titleField |
| `GalleryProjection` | imageField, captionField, columns |
| `ListProjection` | titleField, subtitleField, avatar |

**Acceptance Criteria**:
- [ ] Can express all projection types
- [ ] Applicability rules are checkable
- [ ] Schema is JSON-serializable (for storage)
- [ ] Validation function exists
- [ ] Examples cover all cases

**Verification**: Define lenses for each view type; validate schema.

---

#### Task 1.2: Define Interaction Specifications
**File**: `src/paradigms/lens/types/interactions.ts`

**What to build**:
Schema for defining what users can do through a lens.

**Interaction Types**:

| Interaction | Description |
|-------------|-------------|
| `edit-field` | Edit a field value inline |
| `drag-item` | Reorder or move items |
| `create-item` | Add new items |
| `delete-item` | Remove items |
| `toggle-expand` | Expand/collapse |
| `sort-column` | Change sort order |
| `filter-view` | Apply/modify filters |
| `resize-column` | Adjust column width |

**Interaction Spec**:
| Field | Description |
|-------|-------------|
| `type` | Interaction type |
| `enabled` | Whether allowed |
| `fields` | Which fields this applies to |
| `validation` | Rules for valid changes |
| `onInteract` | Handler reference |

**Acceptance Criteria**:
- [ ] All common interactions specifiable
- [ ] Can enable/disable per field
- [ ] Validation rules work
- [ ] Interactions map to content changes

**Verification**: Define interaction specs; verify they execute.

---

### Phase 2: Lens Registry

#### Task 2.1: Implement Lens Storage
**File**: `src/paradigms/lens/registry/lens-store.ts`

**What to build**:
Persistent storage for lens specifications.

**Operations**:

| Operation | Description |
|-----------|-------------|
| `saveLens(lens)` | Save new or update existing |
| `getLens(id)` | Retrieve by ID |
| `listLenses(filter)` | List with filtering |
| `deleteLens(id)` | Remove lens |
| `forkLens(id, newName)` | Create copy for modification |
| `getLensHistory(id)` | Version history |
| `revertLens(id, version)` | Restore old version |

**Storage Backend** (pluggable):
- Local storage (dev)
- IndexedDB (browser)
- API (production)

**Acceptance Criteria**:
- [ ] CRUD operations work
- [ ] Version history tracked
- [ ] Fork creates independent copy
- [ ] Can query by applicability
- [ ] Handles concurrent access

**Verification**: Store and retrieve lenses; verify integrity.

---

#### Task 2.2: Implement Lens Discovery
**File**: `src/paradigms/lens/registry/lens-discovery.ts`

**What to build**:
Find applicable lenses for given content.

**Discovery Process**:
1. Analyze content (fields, types, item count)
2. Match against lens applicability
3. Rank by relevance
4. Return scored list

**Ranking Factors**:
| Factor | Weight |
|--------|--------|
| Required fields match | High |
| Optional fields present | Medium |
| User's past usage | Medium |
| Popularity (if shared) | Low |
| Recency (recently used) | Low |

**Acceptance Criteria**:
- [ ] Finds all applicable lenses
- [ ] Ranking reflects relevance
- [ ] User preferences influence ranking
- [ ] Returns quickly (< 100ms)
- [ ] Handles no matches gracefully

**Verification**: Test with various content; verify appropriate lenses surface.

---

### Phase 3: Lens Evaluator

#### Task 3.1: Implement Projection Engine
**File**: `src/paradigms/lens/evaluator/projection-engine.ts`

**What to build**:
Apply lens projection to content, producing view data.

**Projection Process**:
1. Extract relevant fields from content
2. Apply filtering
3. Apply sorting
4. Apply grouping
5. Transform to projection shape
6. Return view data

**View Data Shapes**:

| Projection | Output Shape |
|------------|--------------|
| Table | `{ columns: [], rows: [][] }` |
| Kanban | `{ columns: [{ id, title, items: [] }] }` |
| Calendar | `{ events: [{ date, title, data }] }` |
| Gallery | `{ items: [{ image, caption, data }] }` |

**Acceptance Criteria**:
- [ ] All projection types implemented
- [ ] Filtering works correctly
- [ ] Sorting works correctly
- [ ] Grouping works correctly
- [ ] Field extraction handles missing fields
- [ ] Performance acceptable for large datasets

**Verification**: Project fixtures through various lenses; verify output.

---

#### Task 3.2: Implement UISpec Generator
**File**: `src/paradigms/lens/evaluator/uispec-generator.ts`

**What to build**:
Convert view data to UISpec for rendering.

**Generation Process**:
1. Select component for projection type
2. Map view data to component props
3. Add interaction handlers
4. Apply display configuration
5. Return UISpec

**Component Mapping**:
| Projection | Component | Props |
|------------|-----------|-------|
| Table | Table | columns, data, sortable, onSort |
| Kanban | KanbanBoard | columns, onDrag |
| Calendar | Calendar | events, view, onEventClick |
| Gallery | Gallery | items, columns, onClick |

**Acceptance Criteria**:
- [ ] All projections generate valid UISpec
- [ ] Interaction handlers attached
- [ ] Display config applied
- [ ] Keys generated for lists
- [ ] Renders correctly

**Verification**: Generate UISpec from projections; render and verify.

---

### Phase 4: Bidirectional Updates

#### Task 4.1: Implement Change Intent Capture
**File**: `src/paradigms/lens/bidirectional/intent-capture.ts`

**What to build**:
Capture user edits as change intents.

**Change Intent Types**:

| Intent | Data |
|--------|------|
| `field-edit` | itemId, field, oldValue, newValue |
| `item-move` | itemId, oldIndex, newIndex |
| `item-move-group` | itemId, oldGroup, newGroup |
| `item-create` | fields, insertAt |
| `item-delete` | itemId |
| `bulk-edit` | itemIds, field, newValue |

**Intent Metadata**:
- Source lens ID
- Timestamp
- User context

**Acceptance Criteria**:
- [ ] All edit types captured
- [ ] Intent is complete (can be replayed)
- [ ] Old values preserved (for undo)
- [ ] Validation before capture
- [ ] Works with all projections

**Verification**: Perform edits; verify intents captured correctly.

---

#### Task 4.2: Implement Content Updater
**File**: `src/paradigms/lens/bidirectional/content-updater.ts`

**What to build**:
Apply change intents to content store.

**Update Process**:
1. Validate change is allowed
2. Map lens field to content field
3. Apply change to content store
4. Notify subscribers
5. Return result

**Handling Complex Mappings**:
- Lens may combine fields (full name from first + last)
- Lens may derive values (status from date)
- Some lens fields may be read-only

**Acceptance Criteria**:
- [ ] All intent types handled
- [ ] Content store updated correctly
- [ ] Computed fields not directly editable
- [ ] Validation errors returned clearly
- [ ] Store notifications trigger re-projection

**Verification**: Apply changes; verify content updated and views refresh.

---

#### Task 4.3: Implement Optimistic Updates
**File**: `src/paradigms/lens/bidirectional/optimistic-updates.ts`

**What to build**:
Show changes immediately, sync in background.

**Optimistic Update Flow**:
1. Apply change to local view immediately
2. Send change to persistence layer
3. If success: confirm
4. If failure: revert and show error

**Conflict Handling**:
- Detect concurrent edits
- Merge if possible
- Prompt user if conflict

**Acceptance Criteria**:
- [ ] UI updates immediately
- [ ] Reverts on failure
- [ ] Conflicts detected
- [ ] User notified appropriately
- [ ] Works offline (queue changes)

**Verification**: Simulate slow/failed updates; verify behavior.

---

### Phase 5: Lens Composition

#### Task 5.1: Implement Tabbed Lenses
**File**: `src/paradigms/lens/composition/tabbed.ts`

**What to build**:
Show multiple lenses as tabs.

**Tabbed Composition**:
| Field | Description |
|-------|-------------|
| `tabs` | Array of lens IDs |
| `activeTab` | Currently selected |
| `syncSelection` | Whether selection syncs across tabs |

**Features**:
- Click tab to switch view
- Drag to reorder tabs
- Close button to remove
- Add button for new lens

**Acceptance Criteria**:
- [ ] Tabs render and switch correctly
- [ ] Selection syncs if enabled
- [ ] Can add/remove/reorder tabs
- [ ] Persists tab configuration
- [ ] Accessible tab navigation

**Verification**: Create tabbed view; verify switching works.

---

#### Task 5.2: Implement Split Lenses
**File**: `src/paradigms/lens/composition/split.ts`

**What to build**:
Show multiple lenses side-by-side.

**Split Composition**:
| Field | Description |
|-------|-------------|
| `direction` | 'horizontal' \| 'vertical' |
| `panels` | Array of lens IDs |
| `sizes` | Array of panel sizes (percentages) |
| `syncSelection` | Whether selection syncs |

**Features**:
- Drag divider to resize
- Collapse panel
- Maximize panel
- Linked scrolling option

**Acceptance Criteria**:
- [ ] Panels render correctly
- [ ] Resize works smoothly
- [ ] Selection syncs if enabled
- [ ] Responsive (stack on mobile)
- [ ] Persists layout

**Verification**: Create split view; verify interactions.

---

#### Task 5.3: Implement Filtered Lenses
**File**: `src/paradigms/lens/composition/filter-pipe.ts`

**What to build**:
Chain lenses where one filters another's input.

**Filter Pipe Composition**:
```
Base Lens → Filter Lens → Display Lens
(all items)   (subset)     (visualization)
```

**Use Cases**:
- Overview lens → Click item → Detail lens
- List lens → Select items → Comparison lens

**Acceptance Criteria**:
- [ ] Filters pass correctly between lenses
- [ ] Chain can be multiple levels
- [ ] Clear visual indication of filter state
- [ ] Can clear filter to return to full view

**Verification**: Create filter chain; verify data flows.

---

### Phase 6: AI-Assisted Lens Generation

#### Task 6.1: Implement Natural Language Lens Generator
**File**: `src/paradigms/lens/generator/nl-generator.ts`

**What to build**:
Generate lens from natural language description.

**Input Examples**:
- "Show tasks as a kanban board grouped by status"
- "Calendar view with events colored by priority"
- "Table showing only name, status, and due date"

**Generation Process**:
1. Parse NL to extract intent
2. Identify projection type
3. Map field references to actual fields
4. Generate lens specification
5. Validate and return

**LLM Prompt Structure**:
- Content schema (available fields)
- Available projection types
- User request
- Output: LensSpec JSON

**Acceptance Criteria**:
- [ ] Understands common view requests
- [ ] Maps field names (even synonyms)
- [ ] Generates valid lens specs
- [ ] Handles ambiguity (asks clarifying questions)
- [ ] Provides confidence score

**Verification**: Test various NL inputs; verify generated lenses.

---

#### Task 6.2: Implement Lens Refinement
**File**: `src/paradigms/lens/generator/refinement.ts`

**What to build**:
Refine existing lens via natural language.

**Refinement Examples**:
- "Sort by due date instead"
- "Add the priority column"
- "Group by assignee, not status"
- "Hide completed items"

**Refinement Process**:
1. Take existing lens and modification request
2. Identify what to change
3. Apply change to lens spec
4. Return modified lens

**Acceptance Criteria**:
- [ ] Understands modification requests
- [ ] Preserves unmentioned aspects
- [ ] Handles conflicts (replace vs. add)
- [ ] Generates diff for review

**Verification**: Refine lenses; verify changes correct.

---

### Phase 7: Pipeline Integration

#### Task 7.1: Implement Lens Pipeline
**File**: `src/paradigms/lens/pipeline.ts`

**What to build**:
Complete pipeline extending GenerationPipeline base.

**Pipeline Steps**:
1. Analyze content for available fields
2. Discover applicable lenses
3. Select best lens (or user-specified)
4. Apply projection
5. Generate UISpec
6. Attach interaction handlers
7. Return result with metadata

**Metadata**:
- Selected lens and why
- Alternative lenses considered
- Projection statistics
- Interaction capabilities

**Acceptance Criteria**:
- [ ] End-to-end pipeline works
- [ ] Lens discovery integrated
- [ ] User can override lens selection
- [ ] Bidirectional updates work
- [ ] Metadata comprehensive

**Verification**: Run pipeline on fixtures; verify output.

---

### Phase 8: Lens Management UI

#### Task 8.1: Implement Lens Browser
**File**: `src/paradigms/lens/ui/lens-browser.tsx`

**What to build**:
UI for browsing and selecting lenses.

**Features**:
| Feature | Description |
|---------|-------------|
| Grid/list view | Browse available lenses |
| Search | Find by name/description |
| Filter | By type, author, recency |
| Preview | Thumbnail preview of lens |
| Apply | One-click to apply |
| Favorite | Mark frequently used |

**Acceptance Criteria**:
- [ ] Shows all applicable lenses
- [ ] Search works well
- [ ] Preview is accurate
- [ ] Apply works immediately
- [ ] Favorites persist

**Verification**: Browse lenses; verify UX.

---

#### Task 8.2: Implement Lens Editor
**File**: `src/paradigms/lens/ui/lens-editor.tsx`

**What to build**:
UI for creating and modifying lenses.

**Editor Sections**:
| Section | Contents |
|---------|----------|
| Basics | Name, description |
| Projection | Select type, configure fields |
| Display | Colors, sizes, layout |
| Filtering | Default filters |
| Sorting | Default sort |
| Interactions | Enable/disable actions |
| Preview | Live preview |

**Features**:
- Drag-drop field configuration
- Color picker for visual config
- Live preview updates
- Save/Save As buttons
- Validation feedback

**Acceptance Criteria**:
- [ ] Can create lens from scratch
- [ ] Can edit existing lens
- [ ] Live preview works
- [ ] Validation prevents invalid lenses
- [ ] Saves correctly

**Verification**: Create and edit lenses; verify they work.

---

## Verification Checklist

After completing all tasks, verify:

- [ ] Can create lenses for all content types
- [ ] All projection types work correctly
- [ ] Bidirectional updates work
- [ ] Lens composition works
- [ ] NL generation produces valid lenses
- [ ] Lens management UI is usable
- [ ] Performance acceptable for large datasets

---

## Extension Points

Future enhancements:
1. Collaborative lens editing
2. Lens marketplace (share across users)
3. Lens templates
4. Conditional formatting
5. Lens analytics (which are most used)

