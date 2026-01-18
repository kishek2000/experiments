# Plan 03: Component Library

## Overview

The Component Library is the **institutional memory** of the system. Every generated component is stored here with its MatchingSpec, enabling fast retrieval for future requests.

**Key Principle**: Generate once, retrieve forever.

---

## What's Stored

Each component entry contains:

| Field | Description |
|-------|-------------|
| `id` | Unique identifier |
| `version` | Semantic version |
| `code` | React/TSX source |
| `compiledCode` | Bundled, executable JS |
| `matchingSpec` | The ComponentMatchingSpec |
| `metadata` | Creation info, usage stats |
| `derivedFrom` | Parent component if forked |
| `lensSpec` | The LensSpec that generated it |

---

## Component Entry Schema

```typescript
interface ComponentEntry {
  // Identity
  id: string;
  version: string;
  name: string;
  description: string;
  
  // Code
  source: {
    code: string;
    language: 'tsx';
    atlaskitVersion: string;
  };
  compiled?: {
    bundle: string;
    hash: string;
  };
  
  // Matching
  matchingSpec: ComponentMatchingSpec;
  
  // Provenance
  provenance: {
    createdAt: Date;
    createdBy: 'system' | 'user' | 'third-party';
    generatedFrom?: string;  // LensSpec ID
    derivedFrom?: string;    // Parent component ID
    method: 'generated' | 'imported' | 'forked';
  };
  
  // Usage
  stats: {
    useCount: number;
    lastUsed: Date;
    adaptationCount: number;
    userRating?: number;
  };
  
  // Status
  status: 'active' | 'deprecated' | 'draft';
}
```

---

## Part 1: Storage Layer

### 1.1 Storage Backend

**For demo**: In-memory + localStorage

**For production**: Would be a service with:
- Database for metadata and specs
- CDN for compiled bundles
- Search index for fast matching

### Task: Implement Storage Interface

```typescript
interface ComponentStorage {
  // CRUD
  save(component: ComponentEntry): Promise<void>;
  get(id: string): Promise<ComponentEntry | null>;
  getVersion(id: string, version: string): Promise<ComponentEntry | null>;
  delete(id: string): Promise<void>;
  
  // Query
  list(filter?: ComponentFilter): Promise<ComponentEntry[]>;
  search(query: MatchQuery): Promise<RankedCandidate[]>;
  
  // Batch
  saveMany(components: ComponentEntry[]): Promise<void>;
  getMany(ids: string[]): Promise<ComponentEntry[]>;
}

interface ComponentFilter {
  status?: 'active' | 'deprecated' | 'draft';
  createdBy?: string;
  primaryGoal?: string;
  layout?: string;
}
```

**Acceptance Criteria**:
- [ ] CRUD operations work
- [ ] Filtering works
- [ ] Search integrates with matching system
- [ ] Batch operations are efficient
- [ ] Persists across page reloads (localStorage)

---

### 1.2 Indexing

For fast matching, maintain indexes:

| Index | Key | Value |
|-------|-----|-------|
| `byPrimaryGoal` | primaryGoal | ComponentEntry[] |
| `byLayout` | layout | ComponentEntry[] |
| `byContentType` | contentType | ComponentEntry[] |
| `byCapability` | capability | ComponentEntry[] |

**Task**: Implement Index Manager

- Build indexes on load
- Update indexes on save/delete
- Use indexes for filtering in matcher

**Acceptance Criteria**:
- [ ] Indexes built on initialization
- [ ] Indexes updated on changes
- [ ] Matcher uses indexes for fast filtering
- [ ] Memory usage is reasonable

---

## Part 2: Versioning

### Philosophy

From the v2 prompt:

> 1. **A component's purpose never changes.** A calendar component always shows dates. As soon as the purpose changes, it's a new component, not a new version.
>
> 2. **Versions have slight spec differences.** Same React code can have different versions with minor spec variations.
>
> 3. **Adaptation ≠ New version.** Runtime configuration doesn't require a new version. Code changes do.

### Version Rules

| Change Type | Result |
|-------------|--------|
| Bug fix (same spec) | Patch version (1.0.0 → 1.0.1) |
| Add optional field support | Minor version (1.0.0 → 1.1.0) |
| Change required fields | Major version (1.0.0 → 2.0.0) |
| Change purpose/intent | **New component** |
| Runtime field remapping | No version change |
| Config override | No version change |

### Task: Version Manager

```typescript
interface VersionManager {
  // Create new version
  createVersion(
    componentId: string, 
    newCode: string, 
    newSpec: ComponentMatchingSpec
  ): Promise<ComponentEntry>;
  
  // Get version history
  getVersions(componentId: string): Promise<ComponentEntry[]>;
  
  // Compare versions
  compareSpecs(v1: string, v2: string): SpecDiff;
  
  // Determine version type
  determineVersionBump(
    oldSpec: ComponentMatchingSpec, 
    newSpec: ComponentMatchingSpec
  ): 'patch' | 'minor' | 'major' | 'new-component';
}
```

**Acceptance Criteria**:
- [ ] Can create new versions
- [ ] Version history is maintained
- [ ] Can compare spec changes
- [ ] Correctly determines version bump type
- [ ] Purpose changes detected as new component

---

## Part 3: Component Lifecycle

### 3.1 Creation Flow

```
1. GENERATE (Agent 4)
   Code + MatchingSpec produced
   
2. VALIDATE (Agent 5)
   Passes all checks
   
3. DRAFT
   Stored with status: 'draft'
   Only visible to creator
   
4. ACTIVATE
   After successful use, status: 'active'
   Visible to all users
   
5. USAGE
   Stats updated on each use
   Rating collected
   
6. DEPRECATE (optional)
   status: 'deprecated'
   Still retrievable but not suggested
```

### Task: Lifecycle Manager

```typescript
interface LifecycleManager {
  // State transitions
  activate(id: string): Promise<void>;
  deprecate(id: string, reason: string): Promise<void>;
  
  // Usage tracking
  recordUse(id: string, context: UseContext): Promise<void>;
  recordAdaptation(id: string, adaptation: AdaptationInstruction): Promise<void>;
  recordRating(id: string, rating: number, feedback?: string): Promise<void>;
  
  // Analytics
  getPopular(limit: number): Promise<ComponentEntry[]>;
  getRecentlyUsed(userId: string, limit: number): Promise<ComponentEntry[]>;
  getUnderutilized(): Promise<ComponentEntry[]>;
}
```

**Acceptance Criteria**:
- [ ] Lifecycle states enforced
- [ ] Usage stats updated
- [ ] Can query by popularity
- [ ] Can find underutilized components

---

### 3.2 Forking

Users can fork and modify components:

```
Original: TaskKanban v1.0
    ↓ fork
MyTaskKanban v1.0 (derivedFrom: TaskKanban)
    ↓ modify
MyTaskKanban v1.1
```

**Task**: Fork Manager

```typescript
interface ForkManager {
  fork(
    sourceId: string, 
    newName: string, 
    modifications?: Partial<ComponentEntry>
  ): Promise<ComponentEntry>;
  
  getForks(sourceId: string): Promise<ComponentEntry[]>;
  getAncestry(componentId: string): Promise<ComponentEntry[]>;
}
```

**Acceptance Criteria**:
- [ ] Can fork any active component
- [ ] Fork maintains derivedFrom link
- [ ] Can find all forks of a component
- [ ] Can trace ancestry

---

## Part 4: Retrieval Optimization

### 4.1 Caching Strategy

**Three-tier cache**:

| Tier | Location | Contents | Latency |
|------|----------|----------|---------|
| L1 | Memory | Recent components | <1ms |
| L2 | localStorage/IndexedDB | User's library | <10ms |
| L3 | Service (mocked) | Full library | <100ms |

**Cache invalidation**:
- L1: LRU, max 50 components
- L2: On explicit clear or storage quota
- L3: Version-based (component version changes)

**Task**: Implement Cache Manager

```typescript
interface CacheManager {
  get(id: string): Promise<ComponentEntry | null>;
  set(component: ComponentEntry): Promise<void>;
  invalidate(id: string): Promise<void>;
  warmup(ids: string[]): Promise<void>;
  getStats(): CacheStats;
}
```

**Acceptance Criteria**:
- [ ] L1 cache hits are <1ms
- [ ] L2 cache hits are <10ms
- [ ] LRU eviction works
- [ ] Can warm up cache with likely-needed components
- [ ] Stats show hit rates

---

### 4.2 Preloading

Anticipate what components will be needed:

| Trigger | Preload |
|---------|---------|
| User opens database | Components matching database schema |
| User selects content | Components matching content type |
| User types "kanban" | Kanban-related components |

**Task**: Preload Manager

```typescript
interface PreloadManager {
  onContentTypeChange(contentType: string): void;
  onSchemaDetected(schema: SchemaSignature): void;
  onIntentHint(hint: string): void;
}
```

**Acceptance Criteria**:
- [ ] Preloads on content change
- [ ] Preloads on schema detection
- [ ] Preloads on intent hint
- [ ] Doesn't preload too aggressively

---

## Part 5: Demo Implementation

### 5.1 Mock Library

**Task**: Create Initial Library

Seed with 15-20 components covering:

| Category | Components |
|----------|------------|
| **Data Views** | SimpleTable, SortableTable, FilterableTable |
| **Grouped Views** | StatusKanban, PriorityKanban, AssigneeKanban |
| **Timeline Views** | DayCalendar, WeekCalendar, MonthCalendar, GanttChart |
| **Card Views** | ContactCards, TaskCards, ProjectCards |
| **List Views** | SimpleList, ChecklistList, ActivityFeed |
| **Hierarchy** | OrgTree, FileTree, OutlineView |
| **Summary** | MetricsDashboard, StatusSummary |

Each with complete MatchingSpec.

**Acceptance Criteria**:
- [ ] 15+ components in mock library
- [ ] Cover all primary goals
- [ ] Cover all layouts
- [ ] Realistic MatchingSpecs
- [ ] Some overlap for matching tests

---

### 5.2 Library Browser UI

**Task**: Build Library Explorer

| Feature | Description |
|---------|-------------|
| Browse | Grid/list of all components |
| Filter | By goal, layout, capability |
| Search | By name, description |
| Preview | See component rendering mock data |
| Inspect | View MatchingSpec details |
| Stats | Usage count, rating |

**Acceptance Criteria**:
- [ ] Can browse all components
- [ ] Filtering works
- [ ] Search finds by keywords
- [ ] Preview shows visual
- [ ] Spec details viewable

---

### 5.3 Component Detail View

**Task**: Build Component Inspector

| Section | Contents |
|---------|----------|
| Header | Name, version, description |
| Preview | Live render with mock data |
| Spec | Collapsible MatchingSpec |
| Code | Source with syntax highlighting |
| Provenance | Created, derivedFrom, method |
| Stats | Usage, rating, adaptations |
| Versions | Version history |

**Acceptance Criteria**:
- [ ] All sections render
- [ ] Spec is navigable
- [ ] Code is highlighted
- [ ] Versions are browsable

---

## Part 6: Import/Export

### 6.1 Component Export

**Task**: Export Component

```typescript
interface ComponentExport {
  component: ComponentEntry;
  dependencies: string[];  // Atlaskit packages
  readme: string;
  examples: ComponentExample[];
}
```

Export as:
- JSON (for import into other instances)
- ZIP (with code files)

**Acceptance Criteria**:
- [ ] Can export any component
- [ ] Dependencies are listed
- [ ] Examples included
- [ ] Can be imported elsewhere

---

### 6.2 Component Import

**Task**: Import Component

- Validate against current Atlaskit version
- Check for conflicts (same ID)
- Allow rename on conflict

**Acceptance Criteria**:
- [ ] Can import exported components
- [ ] Validates compatibility
- [ ] Handles conflicts
- [ ] Preserves provenance

---

## Verification Checklist

After completing this plan:

- [ ] Storage layer works (CRUD)
- [ ] Indexes enable fast filtering
- [ ] Versioning follows rules
- [ ] Lifecycle states are enforced
- [ ] Forking works
- [ ] Caching improves performance
- [ ] Mock library has diverse components
- [ ] Library browser is usable
- [ ] Export/import works

---

## Open Questions

1. **Storage quotas**: How much can we store in localStorage?
2. **Sync**: How do we sync between devices?
3. **Sharing**: How do users share components?
4. **Trust**: How do we verify third-party components?

