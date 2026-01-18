# Addendum: Generative Components & Content Libraries

## Overview

This document revises a core assumption in the original plans. Instead of:
- **AI selects from fixed component registry**

The system should:
- **AI generates components dynamically, built on base design system primitives**
- **Generated components become reusable artifacts**
- **Content type experiences use battle-tested libraries**

---

## Part 1: Generative Components

### The Old Model (Replace This)

```
┌─────────────────────────────────────────────────────────┐
│              FIXED COMPONENT REGISTRY                    │
│                                                          │
│  Table | KanbanBoard | Calendar | Card | List | ...     │
│                                                          │
│  AI's job: Pick the right one, configure props          │
└─────────────────────────────────────────────────────────┘
```

### The New Model (Adopt This)

```
┌─────────────────────────────────────────────────────────┐
│           BASE DESIGN SYSTEM (Atlaskit)                  │
│                                                          │
│  Primitives: Button, Text, Box, Stack, Icon, Badge...   │
│  Patterns: Card, Modal, Dropdown, Table...               │
│  Tokens: Colors, spacing, typography                     │
│                                                          │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              AI COMPONENT GENERATOR                      │
│                                                          │
│  Input: Content + Intent + Context                       │
│  Output: React component code using Atlaskit             │
│                                                          │
│  Can generate:                                           │
│   - Novel layouts                                        │
│   - Custom visualizations                                │
│   - Composite components                                 │
│   - Content-specific UI patterns                         │
│                                                          │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│             COMPONENT LIBRARY (Growing)                  │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │Generated │ │Generated │ │Generated │  ...           │
│  │Component │ │Component │ │Component │                │
│  │    A     │ │    B     │ │    C     │                │
│  └──────────┘ └──────────┘ └──────────┘                │
│                                                          │
│  - Versioned                                             │
│  - Searchable by intent/content-type                     │
│  - Forkable/modifiable                                   │
│  - Usage-tracked                                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## What AI Actually Generates

### Output Types

| Type | Description | Example |
|------|-------------|---------|
| **Inline Component** | One-off component for this render | Custom card layout for specific content |
| **Reusable Component** | Named, stored for future use | "StatusBadgeGroup" for task databases |
| **Composite View** | Assembly of multiple components | Dashboard combining chart + table + actions |
| **Layout Pattern** | Structural arrangement | "MasterDetail" layout for list+preview |

### Code Generation Targets

The AI generates actual React/TypeScript code:

```tsx
// AI generates this:
import { Box, Stack, Badge, Text, xcss } from '@atlaskit/primitives';
import Button from '@atlaskit/button';

const containerStyles = xcss({
  padding: 'space.200',
  backgroundColor: 'color.background.neutral',
  borderRadius: 'border.radius.200',
});

export function TaskCard({ task, onStatusChange }) {
  return (
    <Box xcss={containerStyles}>
      <Stack space="space.100">
        <Text weight="semibold">{task.title}</Text>
        <Badge appearance={statusToAppearance(task.status)}>
          {task.status}
        </Badge>
        <Button appearance="subtle" onClick={() => onStatusChange(task.id)}>
          Update Status
        </Button>
      </Stack>
    </Box>
  );
}
```

### Generation Boundaries

AI generates components, **not**:
- The base design system itself (Atlaskit)
- Core content type experiences (whiteboard canvas, rich text editor)
- Application infrastructure (routing, auth, etc.)

---

## Impact on Each Paradigm

### Compilation Paradigm

**Before**: IR → emit UISpec that references known components
**After**: IR → emit React code that composes Atlaskit primitives

| Phase | Old | New |
|-------|-----|-----|
| Parser | Same | Same |
| IR | Same | Same |
| Emitter | Outputs UISpec | Outputs React/TSX code |
| Output | `{ component: 'Card', props: {...} }` | Actual `function TaskCard() {...}` |

New tasks:
- Code generation templates
- Atlaskit primitive catalog
- Code validation/sandboxing

### Constraint Paradigm

**Before**: Solution space = valid configurations of known components
**After**: Solution space = valid compositions of primitives (much larger!)

| Constraint Type | Old | New |
|-----------------|-----|-----|
| Component choice | Pick from 25 components | Generate from primitives |
| Props | Configure known props | Generate prop interfaces |
| Nesting | Fixed parent-child rules | Primitive composition rules |

New tasks:
- Primitive composition constraints
- Code correctness constraints
- Style consistency constraints

### Lens Paradigm

**Before**: Lens = configuration of a known view type
**After**: Lens = specification that triggers component generation

```
// Old: Lens was config
{ projection: 'kanban', groupBy: 'status', cardFields: [...] }

// New: Lens is intent, AI generates the component
{ 
  intent: "group items by status as draggable columns",
  emphasis: ["status", "assignee"],
  interactions: ["drag-to-change-status"]
}
→ AI generates → KanbanBoard component code
```

### Negotiation Paradigm

**Before**: Propose configurations, user picks
**After**: Propose generated UIs, user refines through conversation

The dialog now includes:
- "Can you make the cards more compact?"
- "Add a quick-edit button on each row"
- AI regenerates component with changes

### Marketplace Paradigm

**Before**: Fixed bidders for fixed components
**After**: Bidders can spawn new components

```
// A bidder might say:
{
  bid: 0.9,
  proposal: {
    type: 'generate',
    prompt: "Card with status badge and avatar stack for assignees",
    cacheKey: "task-card-v3"
  }
}
```

### Evolutionary Paradigm

**Before**: Genome = component tree structure
**After**: Genome = code (or code-generating parameters)

Mutations now include:
- Add/remove Atlaskit primitive
- Change styling tokens
- Restructure layout
- Add/remove interactivity

### Grammar Paradigm

**Before**: Terminals = known components
**After**: Terminals = Atlaskit primitives

```
// Old grammar
DataView → Table | KanbanBoard | Calendar

// New grammar
DataView → generated_component(primitive*)
primitive → Box | Stack | Grid | Text | Button | Badge | ...
```

### Dataflow Paradigm

**Before**: Signals produce UISpec
**After**: Signals produce code (or trigger regeneration)

The reactive graph might include:
```
contentSignal
     ↓
intentSignal = computed(() => analyzeIntent(content))
     ↓
componentSignal = computed(() => generateComponent(intent))
     ↓
renderedUI = render(componentSignal)
```

### Simulation Paradigm

**Before**: Test known component configurations
**After**: Test generated components

This paradigm becomes MORE important—generated code needs validation:
- Accessibility testing
- Usability simulation
- Edge case detection

---

## Component Lifecycle

### Generation → Storage → Reuse

```
1. GENERATE
   User views content → AI generates component → Renders immediately

2. EVALUATE  
   Track: renders correctly? user engages? errors?

3. PERSIST (if good)
   Store in Component Library with:
   - Source code
   - Content type affinity
   - Intent description
   - Usage stats
   - Version

4. REUSE
   Next time similar content/intent → retrieve instead of regenerate

5. EVOLVE
   Fork existing component → modify → new version
```

### Component Library Schema

| Field | Description |
|-------|-------------|
| `id` | Unique identifier |
| `name` | Human-readable name |
| `code` | React/TSX source |
| `compiledCode` | Bundled, executable |
| `contentTypes` | What content this works with |
| `intent` | What user need this addresses |
| `atlaskitDeps` | Which primitives used |
| `generatedBy` | Which paradigm created it |
| `usageCount` | Times used |
| `rating` | User satisfaction |
| `version` | Semantic version |
| `forkedFrom` | Parent component if any |

### Retrieval vs. Generation Decision

```
When rendering content:

1. Analyze content + user intent
2. Search Component Library:
   - Match content type
   - Match intent
   - Consider past success for this user
   
3. If good match found (confidence > threshold):
   → Use existing component
   
4. If no match or low confidence:
   → Generate new component
   → Optionally persist if successful
```

---

## Atlaskit Integration

### Why Atlaskit?

| Reason | Benefit |
|--------|---------|
| Confluence's design system | Visual consistency |
| Well-documented primitives | AI can learn patterns |
| Accessibility built-in | Generated code is accessible |
| Token-based styling | Consistent theming |
| Battle-tested | Fewer bugs in base |

### Atlaskit Primitives for AI

The AI should know these primitives deeply:

**Layout**:
- `Box` - basic container with xcss
- `Stack` - vertical layout
- `Inline` - horizontal layout  
- `Grid` - grid layout
- `Flex` - flexbox

**Typography**:
- `Text` - text with variants
- `Heading` - headings

**Interactive**:
- `Button` - buttons
- `Pressable` - clickable areas
- `Anchor` - links

**Data Display**:
- `Badge` - status badges
- `Lozenge` - labels
- `Avatar` - user avatars
- `Icon` - icons

**Patterns** (higher-level):
- `@atlaskit/dynamic-table` - tables
- `@atlaskit/modal-dialog` - modals
- `@atlaskit/dropdown-menu` - dropdowns
- `@atlaskit/tabs` - tab navigation

### Token Usage

AI should use Atlaskit tokens, not hardcoded values:

```tsx
// ❌ Bad - hardcoded
const styles = xcss({
  padding: '16px',
  color: '#172B4D',
});

// ✅ Good - tokens
const styles = xcss({
  padding: 'space.200',
  color: 'color.text',
});
```

---

## New Infrastructure Tasks

### Task: Atlaskit Primitive Catalog

**File**: `src/core/primitives/atlaskit-catalog.ts`

Document all Atlaskit primitives AI can use:
- Component name and import
- Props with types and descriptions
- Usage examples
- Composition rules
- Accessibility notes

### Task: Code Generator

**File**: `src/core/generation/code-generator.ts`

Generate React/TSX code:
- Template system for common patterns
- Atlaskit import management
- xcss style generation
- Prop interface generation
- TypeScript type safety

### Task: Code Sandbox

**File**: `src/core/generation/sandbox.ts`

Safely execute generated code:
- Compile TSX to JS
- Run in isolated context
- Catch errors gracefully
- Validate output

### Task: Component Library Store

**File**: `src/core/library/component-store.ts`

Persist and retrieve generated components:
- CRUD operations
- Search by content type / intent
- Version management
- Fork/modify support

### Task: Retrieval System

**File**: `src/core/library/retrieval.ts`

Find existing components:
- Semantic similarity to intent
- Content type matching
- Usage/rating weighting
- Confidence scoring

---

## Part 2: Content Type Libraries

### Philosophy

Don't build content experiences from scratch. Use best-in-class libraries:

| Content Type | Recommended Library | Why |
|--------------|--------------------|----|
| **Whiteboard** | tldraw | Most complete, Notion uses it |
| **Rich Text Pages** | Tiptap (ProseMirror) | Extensible, Atlassian-like |
| **Database/Tables** | TanStack Table + custom | Performant, flexible |

### Integration Strategy

These libraries provide the **content editing experience**. Our generative UI wraps around them:

```
┌─────────────────────────────────────────────────────────┐
│                 GENERATIVE UI LAYER                      │
│                                                          │
│  AI generates: chrome, toolbars, sidebars, views        │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │            CONTENT LIBRARY CORE                    │  │
│  │                                                    │  │
│  │  tldraw     │  Tiptap       │  TanStack Table     │  │
│  │  (canvas)   │  (rich text)  │  (database)         │  │
│  │                                                    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Whiteboard: tldraw

**What it provides**:
- Infinite canvas
- Shapes, drawing, text
- Connectors and arrows
- Selection, transformation
- Real-time collaboration (with work)
- Export/import

**What we generate around it**:
- Toolbar customization
- Shape palettes
- Sidebar with element list
- Export views (present mode)
- AI-generated layout suggestions

**Integration**:
```tsx
import { Tldraw } from '@tldraw/tldraw';

// Our generative wrapper
function WhiteboardView({ content }) {
  const generatedToolbar = useGeneratedToolbar(content);
  const generatedSidebar = useGeneratedSidebar(content);
  
  return (
    <GeneratedLayout toolbar={generatedToolbar} sidebar={generatedSidebar}>
      <Tldraw /* core whiteboard, not generated */ />
    </GeneratedLayout>
  );
}
```

### Rich Text: Tiptap

**What it provides**:
- ProseMirror-based editor
- Extensible schema
- Marks and nodes
- Commands API
- Collaborative editing

**What we generate around it**:
- Custom toolbars
- Slash commands UI
- Block handles
- Side-by-side views
- Reading mode layouts

**Integration**:
```tsx
import { useEditor, EditorContent } from '@tiptap/react';

function PageView({ content }) {
  const editor = useEditor({ /* tiptap config */ });
  const generatedChrome = useGeneratedPageChrome(content);
  
  return (
    <GeneratedPageLayout {...generatedChrome}>
      <EditorContent editor={editor} /* core editor, not generated */ />
    </GeneratedPageLayout>
  );
}
```

### Database: TanStack Table + Custom

**What TanStack provides**:
- Headless table logic
- Sorting, filtering, pagination
- Column management
- Virtualization

**What we generate**:
- Table cell renderers
- Kanban view
- Calendar view
- Gallery view
- Custom aggregations

**Integration**:
```tsx
import { useReactTable } from '@tanstack/react-table';

function DatabaseView({ content, viewType }) {
  const table = useReactTable({ data: content.rows, columns: content.columns });
  
  // This IS generated - the view component
  const GeneratedView = useGeneratedDatabaseView(viewType, content);
  
  return <GeneratedView table={table} />;
}
```

---

## Updated Shared Infrastructure

### New Module: Base Libraries

**Directory**: `src/core/base-libraries/`

| File | Purpose |
|------|---------|
| `tldraw-wrapper.tsx` | tldraw integration with our content model |
| `tiptap-wrapper.tsx` | Tiptap integration with our content model |
| `tanstack-wrapper.tsx` | TanStack Table integration |
| `sync.ts` | Bidirectional sync between libraries and our store |

### Content Model Adapters

Each library has its own data model. Create adapters:

```tsx
// Our unified Block model ↔ Library's model
interface ContentAdapter<LibraryModel> {
  toLibrary(blocks: Block[]): LibraryModel;
  fromLibrary(model: LibraryModel): Block[];
  syncChanges(blocks: Block[], changes: LibraryChange[]): Block[];
}

const tldrawAdapter: ContentAdapter<TLStore>;
const tiptapAdapter: ContentAdapter<JSONContent>;
const tanstackAdapter: ContentAdapter<TableData>;
```

### New Fixture Format

Fixtures should now include library-native data:

```typescript
export const whiteboardFixture = {
  // Our block model
  blocks: [...],
  
  // tldraw-native for testing
  tldrawStore: {...},
};
```

---

## Summary of Changes

### Removed Assumptions
- ❌ Fixed component registry
- ❌ AI only configures, doesn't create
- ❌ Build content editors from scratch

### New Assumptions
- ✅ AI generates React code on Atlaskit primitives
- ✅ Generated components are persisted and reused
- ✅ Content editing uses tldraw, Tiptap, TanStack
- ✅ Generative UI wraps around content libraries

### New Tasks to Add
1. Atlaskit primitive catalog
2. Code generation system
3. Code sandbox/execution
4. Component library storage
5. Component retrieval system
6. tldraw integration
7. Tiptap integration
8. TanStack Table integration
9. Content model adapters

### Paradigm Updates
Each paradigm plan needs a section on:
- "What does generation mean here?"
- "How does component reuse work?"
- "What's generated vs. configured?"

