# Plan 05: Content Libraries

## Overview

We don't reinvent content editing. We use battle-tested libraries for core experiences:

| Content Type | Library | What It Provides |
|--------------|---------|------------------|
| **Whiteboard** | tldraw | Canvas, shapes, connectors |
| **Rich Text** | Tiptap | Prose editing, blocks, embeds |
| **Database** | TanStack Table | Headless table logic |

**What AI generates**: The chrome around these libraries—toolbars, views, sidebars, custom renderers.

---

## The Integration Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                    GENERATED UI LAYER                                │
│                                                                      │
│  AI generates:                                                       │
│  - Custom toolbars                                                  │
│  - View components (kanban, calendar, gallery)                      │
│  - Sidebars and panels                                              │
│  - Cell renderers                                                   │
│  - Block handles and decorations                                    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    CONTENT LIBRARY CORE                         │ │
│  │                                                                 │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │ │
│  │  │   tldraw     │ │    Tiptap    │ │TanStack Table│           │ │
│  │  │   (canvas)   │ │  (rich text) │ │  (database)  │           │ │
│  │  │              │ │              │ │              │           │ │
│  │  │  NOT         │ │  NOT         │ │  NOT         │           │ │
│  │  │  GENERATED   │ │  GENERATED   │ │  GENERATED   │           │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘           │ │
│  │                                                                 │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Part 1: tldraw Integration (Whiteboard)

### What tldraw Provides

| Feature | Description |
|---------|-------------|
| Infinite canvas | Pan, zoom, scroll |
| Shape primitives | Rectangle, ellipse, arrow, line, etc. |
| Drawing tools | Freehand, highlighter |
| Text | Text on canvas |
| Connectors | Arrows between shapes |
| Selection | Multi-select, transform |
| Collaboration | Real-time sync (with backend work) |
| Export | SVG, PNG, JSON |

### What We Generate Around It

| Generated | Description |
|-----------|-------------|
| **Custom Toolbar** | App-specific tools, shortcuts |
| **Shape Palette** | Domain-specific shape templates |
| **Sidebar** | Element list, layers, properties |
| **Export Panel** | Custom export options |
| **Presentation Mode** | Slide-like navigation |
| **AI Features** | Layout suggestions, clustering |

### Integration Points

```typescript
// Our wrapper around tldraw
import { Tldraw, createTLStore, TLStore } from '@tldraw/tldraw';

function WhiteboardView({ content, generatedUI }) {
  const store = useTldrawStore(content);
  
  return (
    <div className="whiteboard-container">
      {/* Generated toolbar */}
      {generatedUI.toolbar && <GeneratedToolbar spec={generatedUI.toolbar} store={store} />}
      
      {/* Core tldraw - NOT generated */}
      <Tldraw store={store} />
      
      {/* Generated sidebar */}
      {generatedUI.sidebar && <GeneratedSidebar spec={generatedUI.sidebar} store={store} />}
    </div>
  );
}
```

### Content Model Sync

**Our Block Model ↔ tldraw TLStore**

```typescript
interface WhiteboardAdapter {
  // Our model → tldraw
  toTldraw(blocks: Block[]): TLStore;
  
  // tldraw → Our model
  fromTldraw(store: TLStore): Block[];
  
  // Sync changes
  onTldrawChange(store: TLStore, change: TLChange): BlockUpdate[];
  onBlockChange(blocks: Block[], change: BlockChange): TLStoreUpdate[];
}
```

### Demo Tasks

**Task 5.1.1**: tldraw Integration Shell
- Set up tldraw in the app
- Basic canvas rendering
- Pan/zoom working

**Task 5.1.2**: Content Adapter
- Convert mock whiteboard content to tldraw
- Bidirectional sync

**Task 5.1.3**: Generated Toolbar Demo
- Show how AI would generate a custom toolbar
- Toolbar spec → rendered toolbar

**Task 5.1.4**: Shape Palette Demo
- Show custom shape templates
- Domain-specific shapes (flowchart, org chart)

---

## Part 2: Tiptap Integration (Rich Text Pages)

### What Tiptap Provides

| Feature | Description |
|---------|-------------|
| Rich text editing | Bold, italic, lists, etc. |
| Block structure | Headings, paragraphs, code blocks |
| Embeds | Images, videos, iframes |
| Extensibility | Custom nodes and marks |
| Collaborative editing | Y.js integration |
| Markdown support | Import/export |

### What We Generate Around It

| Generated | Description |
|-----------|-------------|
| **Custom Toolbar** | Context-specific formatting |
| **Slash Commands** | "/" menu with AI suggestions |
| **Block Handles** | Drag handles, block actions |
| **Reading Mode** | Presentation layout |
| **AI Features** | Summarize, expand, translate |
| **Outline View** | Document structure sidebar |

### Integration Points

```typescript
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

function PageView({ content, generatedUI }) {
  const editor = useEditor({
    extensions: [StarterKit, ...customExtensions],
    content: content.tiptapContent,
  });
  
  return (
    <div className="page-container">
      {/* Generated toolbar */}
      {generatedUI.toolbar && <GeneratedToolbar spec={generatedUI.toolbar} editor={editor} />}
      
      {/* Core Tiptap - NOT generated */}
      <EditorContent editor={editor} />
      
      {/* Generated outline sidebar */}
      {generatedUI.outline && <GeneratedOutline spec={generatedUI.outline} editor={editor} />}
    </div>
  );
}
```

### Content Model Sync

**Our Block Model ↔ Tiptap JSONContent**

```typescript
interface PageAdapter {
  // Our model → Tiptap
  toTiptap(blocks: Block[]): JSONContent;
  
  // Tiptap → Our model
  fromTiptap(content: JSONContent): Block[];
  
  // Sync changes
  onTiptapTransaction(editor: Editor, transaction: Transaction): BlockUpdate[];
  onBlockChange(blocks: Block[], change: BlockChange): TiptapCommand[];
}
```

### Demo Tasks

**Task 5.2.1**: Tiptap Integration Shell
- Set up Tiptap in the app
- Basic editing working
- StarterKit extensions

**Task 5.2.2**: Content Adapter
- Convert mock page content to Tiptap
- Bidirectional sync

**Task 5.2.3**: Generated Toolbar Demo
- Show context-sensitive toolbar generation
- Different toolbars for different contexts

**Task 5.2.4**: Slash Command Demo
- Show AI-powered slash commands
- "/" → contextual suggestions

---

## Part 3: TanStack Table Integration (Database)

### What TanStack Table Provides

| Feature | Description |
|---------|-------------|
| Headless UI | Logic without styling |
| Sorting | Multi-column sort |
| Filtering | Column and global filters |
| Pagination | Client and server-side |
| Grouping | Group by columns |
| Selection | Row and cell selection |
| Column management | Visibility, ordering, sizing |
| Virtualization | Large dataset handling |

### What We Generate Around It

| Generated | Description |
|-----------|-------------|
| **Table View** | Styled table using TanStack |
| **Kanban View** | Cards grouped by field |
| **Calendar View** | Events on timeline |
| **Gallery View** | Card grid |
| **Cell Renderers** | Custom field display |
| **Filters UI** | Filter controls |
| **Views Switcher** | Toggle between views |

### The Key Insight

TanStack Table is **headless**—it provides logic, not UI. This is perfect for our model:

- TanStack handles: sorting, filtering, grouping, pagination
- We generate: the visual representation

### Integration Points

```typescript
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';

function DatabaseView({ content, generatedUI }) {
  const table = useReactTable({
    data: content.rows,
    columns: content.columns.map(columnToTanStack),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
  });
  
  // The view component IS generated
  const ViewComponent = generatedUI.viewComponent;
  
  return (
    <div className="database-container">
      {/* Generated filter bar */}
      {generatedUI.filters && <GeneratedFilters spec={generatedUI.filters} table={table} />}
      
      {/* Generated view - FULLY generated */}
      <ViewComponent table={table} />
      
      {/* Generated pagination */}
      {generatedUI.pagination && <GeneratedPagination spec={generatedUI.pagination} table={table} />}
    </div>
  );
}
```

### View Generation

The entire view component can be generated:

```tsx
// AI generates this entire component
function GeneratedKanbanView({ table }) {
  const grouped = table.getGroupedRowModel().rows;
  
  return (
    <Inline space="space.200">
      {grouped.map(group => (
        <Box key={group.id} xcss={columnStyles}>
          <Heading size="small">{group.getValue()}</Heading>
          <Stack space="space.100">
            {group.subRows.map(row => (
              <Card key={row.id}>
                <Text>{row.getValue('title')}</Text>
                <Badge>{row.getValue('priority')}</Badge>
              </Card>
            ))}
          </Stack>
        </Box>
      ))}
    </Inline>
  );
}
```

### Content Model Sync

**Our Block Model ↔ TanStack Table**

```typescript
interface DatabaseAdapter {
  // Our model → TanStack
  toTanStack(blocks: Block[]): { data: Row[]; columns: ColumnDef[] };
  
  // TanStack → Our model (for edits)
  fromTableEdit(rowId: string, columnId: string, value: unknown): BlockUpdate;
  
  // Column definition
  columnToTanStack(column: ColumnBlock): ColumnDef;
}
```

### Demo Tasks

**Task 5.3.1**: TanStack Table Integration
- Set up TanStack Table
- Basic table rendering
- Sorting and filtering

**Task 5.3.2**: Content Adapter
- Convert mock database content to TanStack
- Bidirectional sync for edits

**Task 5.3.3**: Generated Table View
- Full table view component generation
- Custom cell renderers

**Task 5.3.4**: Generated Kanban View
- Kanban using TanStack grouping
- Drag and drop (optional)

**Task 5.3.5**: Generated Calendar View
- Calendar using date fields
- Different calendar views (month, week)

**Task 5.3.6**: View Switcher
- Toggle between table, kanban, calendar, gallery
- Show how same data, different view

---

## Part 4: Unified Content Model

### The Problem

Each library has its own data model:
- tldraw: `TLStore` with shapes, bindings
- Tiptap: `JSONContent` with nodes, marks
- TanStack: Flat rows and column definitions

### The Solution

**Our Block Model** is the source of truth. Adapters sync bidirectionally.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     OUR BLOCK MODEL                                  │
│                     (Source of Truth)                                │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ PageBlock│  │ Canvas   │  │ Database │  │ RowBlock │           │
│  │          │  │  Block   │  │  Block   │  │          │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│        │              │             │             │                 │
│        │              │             │             │                 │
└────────┼──────────────┼─────────────┼─────────────┼─────────────────┘
         │              │             │             │
         ▼              ▼             ▼             ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
   │  Tiptap  │  │  tldraw  │  │ TanStack │  │ TanStack │
   │ Adapter  │  │ Adapter  │  │ Adapter  │  │ Adapter  │
   └──────────┘  └──────────┘  └──────────┘  └──────────┘
         │              │             │             │
         ▼              ▼             ▼             ▼
   ┌──────────┐  ┌──────────┐  ┌──────────────────────┐
   │JSONContent│  │ TLStore  │  │ { data, columns }   │
   └──────────┘  └──────────┘  └──────────────────────┘
```

### Sync Strategy

| Direction | Trigger | Action |
|-----------|---------|--------|
| Our → Library | Block change | Update library model |
| Library → Our | User edit | Update block model |

**Conflict Resolution**: Library wins for its domain (tldraw knows canvas best).

### Demo Tasks

**Task 5.4.1**: Block Model Refinement
- Ensure block model covers all content types
- Add any missing fields

**Task 5.4.2**: Unified Content Store
- Single store that notifies adapters
- Change propagation

**Task 5.4.3**: Cross-Content Demo
- Embed whiteboard in page
- Embed database in page
- Show unified model

---

## Part 5: Mock Content

### Mock Page Content

```typescript
const mockPage: Block[] = [
  {
    id: 'page-1',
    type: 'page',
    parentId: null,
    childIds: ['heading-1', 'para-1', 'list-1', 'embed-1'],
    properties: { title: 'Project Overview' }
  },
  {
    id: 'heading-1',
    type: 'heading',
    parentId: 'page-1',
    childIds: [],
    properties: { level: 1, text: 'Goals' }
  },
  // ... more blocks
];
```

### Mock Whiteboard Content

```typescript
const mockWhiteboard: Block[] = [
  {
    id: 'canvas-1',
    type: 'canvas',
    parentId: null,
    childIds: ['shape-1', 'shape-2', 'connector-1'],
    properties: { width: 1920, height: 1080 }
  },
  {
    id: 'shape-1',
    type: 'shape',
    parentId: 'canvas-1',
    childIds: [],
    properties: { 
      shapeType: 'rectangle',
      x: 100, y: 100, width: 200, height: 100,
      text: 'Start'
    }
  },
  // ... more shapes
];
```

### Mock Database Content

```typescript
const mockDatabase: Block[] = [
  {
    id: 'db-1',
    type: 'database',
    parentId: null,
    childIds: ['row-1', 'row-2', 'row-3'],
    properties: {
      columns: [
        { id: 'title', name: 'Title', type: 'text' },
        { id: 'status', name: 'Status', type: 'select', options: ['To Do', 'In Progress', 'Done'] },
        { id: 'assignee', name: 'Assignee', type: 'person' },
        { id: 'dueDate', name: 'Due Date', type: 'date' },
        { id: 'priority', name: 'Priority', type: 'select', options: ['P1', 'P2', 'P3'] },
      ]
    }
  },
  {
    id: 'row-1',
    type: 'row',
    parentId: 'db-1',
    childIds: [],
    properties: {
      title: 'Implement login',
      status: 'In Progress',
      assignee: 'Alice',
      dueDate: '2024-02-15',
      priority: 'P1'
    }
  },
  // ... more rows
];
```

### Demo Tasks

**Task 5.5.1**: Create Mock Content
- 3 page fixtures (simple, complex, embedded)
- 2 whiteboard fixtures (flowchart, org chart)
- 3 database fixtures (tasks, CRM, inventory)

**Task 5.5.2**: Content Selector UI
- Dropdown to select mock content
- Preview of selected content
- Load into content store

---

## Verification Checklist

After completing this plan:

- [ ] tldraw renders in app
- [ ] Tiptap renders in app
- [ ] TanStack Table works
- [ ] Each adapter converts bidirectionally
- [ ] Mock content loads correctly
- [ ] Changes sync between model and library
- [ ] Generated chrome appears around libraries

