# Shared Infrastructure Plan

## Overview

This document describes the foundational infrastructure that **all 9 paradigms depend on**. Before implementing any paradigm, this shared layer must be completed. It provides the content model, design system, AI integration, and common utilities.

---

## Why This Exists

Each paradigm takes content and produces UI. They all need:
- A **unified content model** to represent pages, whiteboards, and databases
- A **design system** with components they can use to build UIs
- An **AI/LLM layer** for intelligent decisions
- A **common pipeline interface** so paradigms are interchangeable

Building this once means paradigms focus purely on their unique approach.

---

## Module 1: Content Model

### Purpose
Represent all Confluence content types (Page, Whiteboard, Database) in a unified block-based model that paradigms can analyze and transform.

### Task 1.1: Define Base Block Schema
**File**: `src/core/types/block.ts`

**What to build**:
- A `BlockId` type (UUID string)
- A `BaseBlock` interface with: id, type, parentId, childIds, properties, timestamps
- Type discriminators for each content type

**Block Types to define**:

| Category | Block Types |
|----------|-------------|
| **Page** | TextBlock, HeadingBlock (levels 1-6), ListBlock (ordered/unordered), ImageBlock, EmbedBlock, PageBlock (container) |
| **Whiteboard** | CanvasBlock, ShapeBlock (rect/ellipse/diamond/line), StickyBlock, ConnectorBlock |
| **Database** | DatabaseBlock, RowBlock, ColumnDefinition (text/number/date/select/multi-select/person/checkbox/url/relation) |

**Acceptance Criteria**:
- [ ] All types compile without TypeScript errors
- [ ] Each block type has appropriate required and optional properties
- [ ] Type guards (`isTextBlock`, `isShapeBlock`, etc.) correctly narrow types
- [ ] Union type `Block` covers all block types
- [ ] Can create valid instances of each block type

**Verification**: Write unit tests that construct each block type and verify type guards.

---

### Task 1.2: Implement Block Store
**File**: `src/core/store/block-store.ts`

**What to build**:
An in-memory store for blocks with:
- CRUD operations (create, read, update, delete)
- Query methods (getById, getChildren, getDescendants, query by type)
- Subscription system for change notifications
- Immutable update patterns (returns new references)

**Required Methods**:
| Method | Description |
|--------|-------------|
| `getBlock(id)` | Get single block by ID |
| `getBlocks(ids)` | Get multiple blocks |
| `getChildren(parentId)` | Get immediate children in order |
| `getDescendants(rootId)` | Get all descendants (tree traversal) |
| `getRoots()` | Get all blocks with null parentId |
| `query(predicate)` | Find blocks matching condition |
| `addBlock(block)` | Add new block |
| `updateBlock(id, changes)` | Partial update |
| `deleteBlock(id, cascade)` | Delete with optional cascade |
| `subscribe(callback)` | Subscribe to all changes |
| `subscribeToBlock(id, callback)` | Subscribe to specific block |

**Acceptance Criteria**:
- [ ] All CRUD operations work correctly
- [ ] `getChildren` returns children in correct order (by position/index)
- [ ] `subscribe` fires callback on any mutation
- [ ] Updates return new object references (immutability)
- [ ] Cascade delete removes all descendants
- [ ] Subscription cleanup works (no memory leaks)

**Verification**: Comprehensive unit test suite covering all operations.

---

### Task 1.3: Create Sample Content Fixtures
**Directory**: `src/fixtures/`

**What to build**:
Realistic sample content for testing and demos.

**Required Fixtures**:

| Fixture | Description | Minimum Requirements |
|---------|-------------|---------------------|
| `page-simple.ts` | Basic document | 10+ blocks, headings, paragraphs, one list |
| `page-complex.ts` | Rich document | 50+ blocks, nested lists, images, embeds, deep heading hierarchy |
| `whiteboard-simple.ts` | Basic canvas | 15+ elements, basic shapes, a few connectors |
| `whiteboard-complex.ts` | Rich canvas | 50+ elements, clusters, complex connector topology |
| `database-tasks.ts` | Task tracker | 5+ columns (title, status, assignee, due date, priority), 20+ rows |
| `database-crm.ts` | CRM contacts | 8+ columns (name, company, email, phone, status, value, last contact, notes), 30+ rows |
| `database-inventory.ts` | Product catalog | 10+ columns (SKU, name, category, price, quantity, supplier, etc.), 50+ rows |

**Acceptance Criteria**:
- [ ] Each fixture passes block schema validation
- [ ] Page fixtures have realistic text content (not lorem ipsum)
- [ ] Database fixtures have diverse data in each column type
- [ ] Whiteboard fixtures have spatial clustering (not random placement)
- [ ] All fixtures export both the block array and a pre-populated store

**Verification**: Load each fixture into BlockStore and verify structure.

---

### Task 1.4: Implement Content Analyzer
**File**: `src/core/analysis/content-analyzer.ts`

**What to build**:
Analyze content structure and extract metadata useful for UI generation.

**Analysis Output Structure**:

| Field | Description |
|-------|-------------|
| `contentType` | 'page' \| 'whiteboard' \| 'database' |
| `blockCount` | Total number of blocks |
| `maxDepth` | Deepest nesting level |
| `rootBlock` | Reference to root block |

**Page-specific analysis**:
| Field | Description |
|-------|-------------|
| `headingStructure` | Array of heading levels forming outline |
| `hasLists` | Boolean |
| `listCount` | Number of list blocks |
| `hasImages` | Boolean |
| `imageCount` | Number |
| `hasEmbeds` | Boolean |
| `embedTypes` | Array of embed types found |
| `wordCount` | Approximate word count |
| `estimatedReadingTime` | Minutes |

**Whiteboard-specific analysis**:
| Field | Description |
|-------|-------------|
| `elementCount` | Total shapes + stickies |
| `connectorCount` | Number of connectors |
| `boundingBox` | { minX, minY, maxX, maxY, width, height } |
| `clusters` | Array of detected spatial clusters |
| `hasFlow` | Boolean - detected directional flow |
| `flowDirection` | 'left-to-right' \| 'top-to-bottom' \| 'radial' \| null |

**Database-specific analysis**:
| Field | Description |
|-------|-------------|
| `columnCount` | Number of columns |
| `rowCount` | Number of rows |
| `columnTypes` | Map of column name to type |
| `hasStatusColumn` | Boolean + column name if found |
| `hasDateColumn` | Boolean + column name if found |
| `hasAssigneeColumn` | Boolean + column name if found |
| `hasPriorityColumn` | Boolean + column name if found |
| `suggestedViews` | Array of view types that would work well |

**Acceptance Criteria**:
- [ ] Correctly identifies content type from block structure
- [ ] Page analysis detects heading hierarchy accurately
- [ ] Whiteboard analysis identifies spatial clusters (using distance threshold)
- [ ] Database analysis detects semantic columns (status, date, assignee)
- [ ] `suggestedViews` provides reasonable recommendations

**Verification**: Run analyzer on all fixtures and verify output matches expected structure.

---

## Module 2: Design System Foundation

### Purpose
Provide the building blocks that paradigms use to construct UIs: tokens, component definitions, and a runtime renderer.

### Task 2.1: Define Design Tokens
**File**: `src/design-system/tokens.ts`

**What to build**:
Semantic design tokens with descriptions that AI can understand.

**Token Categories**:

| Category | Tokens to Define |
|----------|-----------------|
| **Colors** | Interactive (primary, secondary, danger), Background (surface, elevated, sunken), Text (primary, secondary, disabled, inverse), Status (success, warning, error, info), Border (default, strong, subtle) |
| **Spacing** | Scale from 0 to 12 (4px base unit) |
| **Typography** | Font families, sizes (xs to 4xl), weights (regular, medium, semibold, bold), line heights |
| **Radii** | none, sm, md, lg, xl, full |
| **Shadows** | none, sm, md, lg, xl |
| **Transitions** | Duration (fast, normal, slow), easing functions |
| **Z-Index** | Layering scale (dropdown, modal, tooltip, etc.) |

**Key requirement**: Each token must have a `description` field explaining when to use it, not just the value.

**Acceptance Criteria**:
- [ ] All tokens have both `value` and `description`
- [ ] Descriptions are specific enough for AI to make correct choices
- [ ] Color tokens include both light and dark mode values
- [ ] Spacing scale is consistent (e.g., 4px base unit)
- [ ] Typography defines complete type scale

**Verification**: Review descriptions for clarity; test token values render correctly in CSS.

---

### Task 2.2: Create Component Registry Schema
**File**: `src/design-system/component-registry.ts`

**What to build**:
A registry of available components with rich metadata for AI-driven selection.

**Required Metadata per Component**:

| Field | Description |
|-------|-------------|
| `name` | Unique identifier |
| `displayName` | Human-readable name |
| `description` | What this component does and when to use it |
| `category` | 'layout' \| 'data-display' \| 'input' \| 'feedback' \| 'navigation' |
| `suitableFor.contentTypes` | Which content types this works with |
| `suitableFor.dataShapes` | 'scalar' \| 'list' \| 'table' \| 'tree' \| 'graph' |
| `suitableFor.useCases` | Specific scenarios (e.g., "showing task status") |
| `propsSchema` | JSON Schema for component props |
| `requiredProps` | Array of required prop names |
| `slots` | Named slots for child content |
| `examples` | Array of example usages with props |
| `constraints` | Min/max children, required parent types, etc. |

**Components to Define**:

| Category | Components |
|----------|------------|
| **Layout** | Stack (vertical/horizontal), Grid, Container, Card, Divider, Spacer |
| **Data Display** | Text, Heading, Badge, Avatar, Icon, Image, Table, List, Tree |
| **Complex Views** | KanbanBoard, Calendar, Timeline, Gallery, Chart |
| **Input** | Button, TextField, Select, Checkbox, DatePicker, Toggle |
| **Feedback** | Alert, Toast, Progress, Skeleton, Empty |
| **Navigation** | Tabs, Breadcrumb, Link, Menu |

**Acceptance Criteria**:
- [ ] At least 25 components defined
- [ ] Every component has complete propsSchema
- [ ] `suitableFor` metadata enables intelligent component selection
- [ ] At least 2 examples per component
- [ ] Descriptions explain not just what but when to use

**Verification**: Validate all propsSchemas are valid JSON Schema; review descriptions for usefulness.

---

### Task 2.3: Implement Component Renderer
**File**: `src/design-system/renderer.tsx`

**What to build**:
A runtime that takes a UISpec (declarative UI tree) and renders it using registered components.

**UISpec Structure**:
```
UISpec = {
  component: string (component name)
  props: object (component props)
  children: UISpec[] (nested children)
  key: string (optional React key)
}
```

**Renderer Responsibilities**:
- Resolve component name to actual React component
- Pass props through, handling data binding expressions
- Recursively render children
- Handle missing components gracefully (show error boundary)
- Support slot-based composition

**Data Binding**:
Props can reference data using a binding syntax:
- `"{{data.field}}"` - direct field access
- `"{{data.items[0].name}}"` - nested access
- Support simple expressions for transforms

**Acceptance Criteria**:
- [ ] Renders any valid UISpec to React elements
- [ ] Handles deeply nested children (10+ levels)
- [ ] Data binding resolves correctly
- [ ] Missing components show helpful error, don't crash
- [ ] Keys are applied for list rendering
- [ ] Slot composition works correctly

**Verification**: Render various UISpec trees and verify correct DOM output.

---

### Task 2.4: Implement Component Library
**Directory**: `src/design-system/components/`

**What to build**:
Actual React implementations of all registered components.

**Implementation Requirements**:
- Use design tokens for all styling (no hardcoded values)
- Support both light and dark themes
- Meet WCAG 2.1 AA accessibility standards
- Accept all props defined in registry schema
- Forward refs where appropriate
- Support className/style overrides

**Priority Components** (implement first):

| Component | Key Features |
|-----------|--------------|
| Stack | Direction, gap, alignment, wrap |
| Grid | Columns (responsive), gap, auto-fit |
| Card | Header, body, footer slots; elevation |
| Text | Size, weight, color, truncation |
| Badge | Variants (status colors), sizes |
| Table | Sortable headers, row selection |
| KanbanBoard | Draggable cards, column config |
| Calendar | Month/week/day views, events |
| Button | Variants, sizes, loading state |
| TextField | Label, placeholder, validation |

**Acceptance Criteria**:
- [ ] All 25+ components implemented
- [ ] Components use design tokens exclusively
- [ ] Keyboard navigation works where applicable
- [ ] Screen reader announcements are appropriate
- [ ] Components match registry prop definitions
- [ ] Dark mode works without extra code

**Verification**: Visual testing + accessibility audit with axe-core.

---

## Module 3: AI Integration Foundation

### Purpose
Abstract LLM interactions so paradigms can focus on their logic, not API details.

### Task 3.1: Create LLM Client Abstraction
**File**: `src/core/llm/client.ts`

**What to build**:
A provider-agnostic interface for LLM calls.

**Interface Requirements**:

| Method | Description |
|--------|-------------|
| `complete(prompt, options)` | Basic completion |
| `chat(messages, options)` | Multi-turn conversation |
| `structured(prompt, schema, options)` | Output constrained to JSON schema |
| `stream(prompt, options)` | Streaming response |

**Options**:
- `model`: Model identifier
- `temperature`: 0-1
- `maxTokens`: Response limit
- `stopSequences`: Early termination

**Implementations to Build**:

| Implementation | Purpose |
|----------------|---------|
| `AnthropicClient` | Production use with Claude |
| `OpenAIClient` | Alternative production option |
| `MockClient` | Testing with deterministic responses |
| `RecordingClient` | Wraps another client, records for replay |

**Acceptance Criteria**:
- [ ] All implementations conform to interface
- [ ] Anthropic client handles API errors gracefully
- [ ] Structured output enforces JSON schema
- [ ] Streaming delivers chunks incrementally
- [ ] MockClient enables deterministic tests
- [ ] RecordingClient saves request/response pairs

**Verification**: Integration tests against real APIs + unit tests with MockClient.

---

### Task 3.2: Create Prompt Templates
**Directory**: `src/core/llm/prompts/`

**What to build**:
Reusable, composable prompt templates for common operations.

**Templates Needed**:

| Template | Purpose | Inputs |
|----------|---------|--------|
| `analyzeContentIntent` | Understand what user wants to do with content | Content analysis, user context |
| `selectViewType` | Choose appropriate view for content | Content analysis, available views |
| `generateUISpec` | Create UI specification | Content, component registry, constraints |
| `refineUISpec` | Improve existing UI based on feedback | Current spec, feedback, constraints |
| `explainDecision` | Generate human-readable explanation | Decision context, chosen option |

**Template Features**:
- Parameterized with typed inputs
- Include examples (few-shot)
- Specify output format (especially for structured)
- Version tracked for reproducibility

**Acceptance Criteria**:
- [ ] All templates produce valid outputs
- [ ] Templates include relevant context (tokens, components)
- [ ] Few-shot examples improve output quality
- [ ] Output formats are enforced
- [ ] Templates are composable (can combine)

**Verification**: Test each template with varied inputs; verify output structure.

---

### Task 3.3: Implement Generation Pipeline Base
**File**: `src/core/pipeline/base.ts`

**What to build**:
Abstract base class that all paradigms extend.

**Generation Context** (input to all paradigms):

| Field | Description |
|-------|-------------|
| `content` | Array of blocks to render |
| `store` | BlockStore instance |
| `analysis` | ContentAnalysis result |
| `componentRegistry` | Available components |
| `tokens` | Design tokens |
| `userPreferences` | Optional user preferences |
| `viewport` | Screen dimensions |
| `previousResult` | Optional previous generation (for refinement) |

**Generation Result** (output from all paradigms):

| Field | Description |
|-------|-------------|
| `spec` | UISpec tree |
| `metadata.paradigm` | Which paradigm generated this |
| `metadata.generationTimeMs` | How long it took |
| `metadata.tokensUsed` | LLM token consumption |
| `metadata.decisions` | Log of decisions made |
| `metadata.confidence` | Overall confidence score |

**Abstract Pipeline Interface**:

| Method | Description |
|--------|-------------|
| `generate(context)` | Main generation method |
| `validate(spec)` | Verify output is valid |
| `explain(result)` | Human-readable explanation |

**Acceptance Criteria**:
- [ ] All paradigms can extend this base
- [ ] Context provides everything paradigms need
- [ ] Result captures all necessary metadata
- [ ] Validation catches common errors
- [ ] Explanation is genuinely helpful

**Verification**: Implement a trivial paradigm to verify the interface works.

---

## Module 4: Demo Application Shell

### Task 4.1: Create Application Shell
**Files**: `src/demo/App.tsx`, routing, layout

**What to build**:
A demo application that showcases all paradigms.

**Features**:
- Paradigm selector (dropdown or tabs)
- Content selector (load fixtures or paste custom)
- Side-by-side view (content → generated UI)
- Generation metadata display
- Theme toggle (light/dark)

**Acceptance Criteria**:
- [ ] Can switch between paradigms
- [ ] Can load all fixture types
- [ ] Shows generation time and token usage
- [ ] Responsive layout
- [ ] Accessible navigation

---

## Dependency Graph

```
Block Types (1.1)
      ↓
Block Store (1.2) ←── Fixtures (1.3)
      ↓
Content Analyzer (1.4)
      ↓
┌─────┴─────┐
│           │
↓           ↓
Design      LLM
System      Integration
(2.1-2.4)   (3.1-3.2)
│           │
└─────┬─────┘
      ↓
Pipeline Base (3.3)
      ↓
Demo Shell (4.1)
      ↓
[Paradigm Implementations]
```

---

## Implementation Order

| Order | Task | Estimated Time | Dependencies |
|-------|------|----------------|--------------|
| 1 | Block Types (1.1) | 4 hours | None |
| 2 | Block Store (1.2) | 6 hours | 1.1 |
| 3 | Fixtures (1.3) | 4 hours | 1.1, 1.2 |
| 4 | Content Analyzer (1.4) | 6 hours | 1.1, 1.2 |
| 5 | Design Tokens (2.1) | 4 hours | None |
| 6 | Component Registry (2.2) | 6 hours | 2.1 |
| 7 | Component Library (2.4) | 16 hours | 2.1, 2.2 |
| 8 | Component Renderer (2.3) | 6 hours | 2.2, 2.4 |
| 9 | LLM Client (3.1) | 6 hours | None |
| 10 | Prompt Templates (3.2) | 4 hours | 3.1 |
| 11 | Pipeline Base (3.3) | 4 hours | All above |
| 12 | Demo Shell (4.1) | 8 hours | All above |

**Total: ~74 hours (roughly 2 weeks)**

---

## Verification Checklist

Before starting any paradigm implementation, verify:

- [ ] Can create and store all block types
- [ ] Fixtures load correctly into store
- [ ] Content analyzer produces expected output for all fixtures
- [ ] All components render correctly
- [ ] UISpec renderer works with nested structures
- [ ] LLM client connects successfully
- [ ] Prompt templates produce valid output
- [ ] Demo shell displays generated UI

