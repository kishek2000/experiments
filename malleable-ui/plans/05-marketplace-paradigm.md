# Paradigm 5: Component Marketplace / Bidding

## Executive Summary

**Mental Model**: Components are autonomous agents that compete to represent content.

**Core Question**: "Which component best represents this content?"

**Metaphor**: Think of an advertising auction. When you search for something, advertisers bid to show you their ad. Similarly, when content needs rendering, components bid to render it. The best bidder wins, but a coherence layer ensures the overall UI makes sense.

---

## Why This Paradigm?

The marketplace/bidding approach works well because:

1. **Extensible**: Add new components without changing core logic
2. **Competitive**: Best representation wins naturally
3. **Decentralized**: No central decision-maker needed
4. **Pluggable**: Third-party components can participate
5. **Self-improving**: Better bidders rise to the top

**Best suited for**:
- Plugin architectures where components are added dynamically
- A/B testing different component implementations
- Situations where "best" is context-dependent
- Ecosystem platforms with third-party developers

**Less suited for**:
- Highly controlled design systems
- Simple content with obvious rendering
- Performance-critical paths (auction overhead)
- When consistency matters more than optimization

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CONTENT                               │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│  │ Slot 1 │ │ Slot 2 │ │ Slot 3 │ │ Slot 4 │           │
│  └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘           │
└──────┼──────────┼──────────┼──────────┼─────────────────┘
       │          │          │          │
       ▼          ▼          ▼          ▼
┌─────────────────────────────────────────────────────────┐
│                  BIDDING ARENA                           │
│                                                          │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐              │
│  │Bidder│ │Bidder│ │Bidder│ │Bidder│ │Bidder│              │
│  │  A   │ │  B   │ │  C   │ │  D   │ │  E   │              │
│  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘              │
│     │        │        │        │        │               │
│     ▼        ▼        ▼        ▼        ▼               │
│  ┌─────────────────────────────────────────────┐        │
│  │              AUCTION ENGINE                  │        │
│  │  Collect bids → Rank → Select winners       │        │
│  └──────────────────────┬──────────────────────┘        │
└─────────────────────────┼───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  COHERENCE LAYER                         │
│  ┌───────────────────────────────────────────────┐      │
│  │ Verify compatibility │ Enforce consistency    │      │
│  │ Resolve conflicts    │ Apply global style     │      │
│  └───────────────────────────────────────────────┘      │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
                    ┌──────────┐
                    │  UISpec  │
                    └──────────┘
```

---

## Key Concepts

### Slots

Content is divided into slots that components bid on:
- A database row is a slot
- A document section is a slot
- The root container is a slot
- Slots can be nested (components render child slots)

### Bidders

Each component has a bidder that evaluates whether it can render a slot:
- **Can bid**: Does the slot match this component's capabilities?
- **Bid score**: How well does this component fit?
- **Proposed props**: How would it render?

### Bids

A bid is a component's offer to render a slot:
| Field | Description |
|-------|-------------|
| `componentName` | Which component is bidding |
| `slotId` | Which slot it's bidding on |
| `score` | Bid amount (0-1) |
| `confidence` | How confident in the score |
| `reasoning` | Why this component is appropriate |
| `proposedProps` | How it would configure itself |

### Auction Strategies

Different ways to select winners:
| Strategy | Description |
|----------|-------------|
| `highest-bid` | Simple maximum score |
| `weighted-random` | Probabilistic selection |
| `ensemble` | Combine multiple components |
| `user-override` | User can pin choices |

### Coherence Layer

After auction, ensure overall UI makes sense:
- No conflicting components
- Consistent styling
- Logical hierarchy
- Performance constraints met

---

## Task Breakdown

### Phase 1: Bidding System

#### Task 1.1: Define Slot Schema
**File**: `src/paradigms/marketplace/types/slot.ts`

**What to build**:
Define what a slot is and how to identify them.

**Slot Structure**:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `type` | SlotType | Category of slot |
| `content` | Block[] | Content to render |
| `parentSlotId` | string? | Parent slot if nested |
| `context` | SlotContext | Additional context |
| `constraints` | SlotConstraints | Requirements |

**Slot Types**:
| Type | Description |
|------|-------------|
| `root` | Top-level container |
| `section` | Document section |
| `collection` | List of items |
| `item` | Single item |
| `field` | Single field/value |
| `action` | Interactive element |

**Slot Context**:
- Parent component (if any)
- Sibling slots
- User preferences for this slot
- Historical component choices

**Acceptance Criteria**:
- [ ] All content can be decomposed into slots
- [ ] Slot types cover all cases
- [ ] Context provides bidders necessary info
- [ ] Constraints are checkable
- [ ] Nested slots work correctly

**Verification**: Decompose fixtures into slots; verify completeness.

---

#### Task 1.2: Define Bid Schema
**File**: `src/paradigms/marketplace/types/bid.ts`

**What to build**:
Define the structure of a bid.

**Bid Structure**:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique bid ID |
| `bidderId` | string | Which bidder submitted |
| `componentName` | string | Component to render |
| `slotId` | string | Slot being bid on |
| `score` | number | Bid score (0-1) |
| `confidence` | number | Confidence in score (0-1) |
| `reasoning` | string | Human-readable explanation |
| `proposedProps` | object | Component props |
| `requirements` | BidRequirements | What this bid needs |
| `timestamp` | Date | When bid was made |

**Bid Requirements**:
| Field | Description |
|-------|-------------|
| `childSlots` | Slots this component will create |
| `siblingConstraints` | Requirements on siblings |
| `excludes` | Components that conflict |

**Acceptance Criteria**:
- [ ] All bid information captured
- [ ] Score is normalized 0-1
- [ ] Reasoning is useful
- [ ] Props are valid for component
- [ ] Requirements enable coherence checks

**Verification**: Create sample bids; verify schema.

---

#### Task 1.3: Define Bidder Interface
**File**: `src/paradigms/marketplace/types/bidder.ts`

**What to build**:
Interface that all bidders must implement.

**Bidder Interface**:

| Method | Description |
|--------|-------------|
| `canBid(slot)` | Quick check if bidding makes sense |
| `bid(slot, context)` | Generate bid for slot |
| `explain(bid)` | Detailed explanation of bid |

**Bidder Metadata**:
| Field | Description |
|-------|-------------|
| `id` | Unique bidder ID |
| `componentName` | Component this bidder represents |
| `slotTypes` | Slot types this bidder handles |
| `version` | Bidder version |
| `author` | Who created (for third-party) |

**Acceptance Criteria**:
- [ ] Interface is implementable
- [ ] canBid enables fast filtering
- [ ] bid produces complete Bid
- [ ] explain is human-readable
- [ ] Metadata enables discovery

**Verification**: Implement a simple bidder; verify it works.

---

### Phase 2: Built-in Bidders

#### Task 2.1: Implement Table Bidder
**File**: `src/paradigms/marketplace/bidders/table-bidder.ts`

**What to build**:
Bidder for Table component.

**Bidding Logic**:
| Factor | Score Impact |
|--------|--------------|
| Database content | +0.4 |
| Multiple columns | +0.2 |
| Sortable data | +0.1 |
| Many rows | +0.1 |
| No status column | +0.1 (less suited for kanban) |
| Images present | -0.2 (gallery better) |

**Props Generation**:
- Map columns from content schema
- Set column widths based on content
- Enable sorting if sortable
- Configure pagination for large datasets

**Acceptance Criteria**:
- [ ] Bids appropriately on databases
- [ ] Doesn't bid on non-tabular content
- [ ] Props are valid
- [ ] Reasoning explains score
- [ ] Competitive with other bidders

**Verification**: Present various content; verify bids.

---

#### Task 2.2: Implement Kanban Bidder
**File**: `src/paradigms/marketplace/bidders/kanban-bidder.ts`

**What to build**:
Bidder for KanbanBoard component.

**Bidding Logic**:
| Factor | Score Impact |
|--------|--------------|
| Database content | +0.3 |
| Status column present | +0.4 |
| Reasonable row count | +0.1 |
| Assignee column | +0.1 |
| No status column | -0.5 (critical) |

**Props Generation**:
- Identify groupBy column
- Configure card display fields
- Set column order (workflow stages)

**Acceptance Criteria**:
- [ ] Strong bids when status column exists
- [ ] Weak bids without status
- [ ] Correctly identifies groupBy
- [ ] Props configure board well
- [ ] Explains workflow detection

**Verification**: Bid on databases with/without status; verify scores.

---

#### Task 2.3: Implement Calendar Bidder
**File**: `src/paradigms/marketplace/bidders/calendar-bidder.ts`

**What to build**:
Bidder for Calendar component.

**Bidding Logic**:
| Factor | Score Impact |
|--------|--------------|
| Date column present | +0.5 |
| Date range (start + end) | +0.2 |
| Reasonable date spread | +0.1 |
| Title-like field | +0.1 |
| No date column | -1.0 (can't bid) |

**Props Generation**:
- Map date field(s)
- Identify title field
- Set initial view (month/week)

**Acceptance Criteria**:
- [ ] Only bids when dates exist
- [ ] Higher score for date ranges
- [ ] Configures calendar correctly
- [ ] Reasonable initial view
- [ ] Handles date parsing

**Verification**: Bid on dated content; verify appropriateness.

---

#### Task 2.4: Implement Card Bidder
**File**: `src/paradigms/marketplace/bidders/card-bidder.ts`

**What to build**:
Bidder for Card component (for single items).

**Bidding Logic**:
| Factor | Score Impact |
|--------|--------------|
| Single item slot | +0.4 |
| Multiple fields | +0.2 |
| Has image | +0.1 |
| Has title | +0.1 |
| Parent is list/grid | +0.1 |

**Props Generation**:
- Identify header/title field
- Select fields for body
- Configure image placement
- Set card variant

**Acceptance Criteria**:
- [ ] Bids on item-level slots
- [ ] Doesn't bid on collections
- [ ] Props produce good cards
- [ ] Handles missing fields
- [ ] Works in list context

**Verification**: Bid on item slots; verify card configuration.

---

#### Task 2.5: Implement Gallery Bidder
**File**: `src/paradigms/marketplace/bidders/gallery-bidder.ts`

**What to build**:
Bidder for Gallery component.

**Bidding Logic**:
| Factor | Score Impact |
|--------|--------------|
| Collection slot | +0.3 |
| Items have images | +0.5 |
| Multiple items | +0.1 |
| Mostly images | +0.1 (vs. text-heavy) |
| No images | -1.0 (can't bid) |

**Props Generation**:
- Map image field
- Configure grid columns
- Set caption field
- Configure click behavior

**Acceptance Criteria**:
- [ ] Strong bids when images present
- [ ] Only bids on collections
- [ ] Column count appropriate
- [ ] Handles missing images gracefully
- [ ] Click behavior configured

**Verification**: Bid on image-heavy content; verify gallery config.

---

#### Task 2.6: Implement Stack Bidder
**File**: `src/paradigms/marketplace/bidders/stack-bidder.ts`

**What to build**:
Bidder for Stack component (layout).

**Bidding Logic**:
| Factor | Score Impact |
|--------|--------------|
| Container slot | +0.3 |
| Multiple children | +0.2 |
| Heterogeneous content | +0.2 |
| Default fallback | +0.1 |

This is often the fallback layout bidder.

**Props Generation**:
- Determine direction (usually vertical)
- Calculate gap
- Set alignment

**Acceptance Criteria**:
- [ ] Bids on container slots
- [ ] Reasonable fallback score
- [ ] Doesn't compete too strongly
- [ ] Props are sensible defaults
- [ ] Works as catch-all

**Verification**: Verify stack bids as fallback.

---

### Phase 3: Auction Engine

#### Task 3.1: Implement Bid Collector
**File**: `src/paradigms/marketplace/auction/collector.ts`

**What to build**:
Collect bids from all registered bidders for all slots.

**Collection Process**:
1. Enumerate all slots from content
2. For each slot, query registered bidders
3. Filter bidders by canBid
4. Collect bids from willing bidders
5. Return bid collection

**Optimization**:
- Parallel bid collection
- Cache canBid results
- Early termination if high-confidence bid found

**Acceptance Criteria**:
- [ ] All slots receive bids
- [ ] All registered bidders queried
- [ ] Bids collected in parallel
- [ ] Performance acceptable
- [ ] Handles bidder errors gracefully

**Verification**: Collect bids for fixtures; verify completeness.

---

#### Task 3.2: Implement Auction Strategies
**File**: `src/paradigms/marketplace/auction/strategies.ts`

**What to build**:
Different strategies for selecting winners.

**Strategy: Highest Bid**:
- Simply select maximum score
- Tie-break by confidence, then by deterministic rule

**Strategy: Weighted Random**:
- Probability proportional to score
- Enables exploration
- Good for A/B testing

**Strategy: Ensemble**:
- Allow multiple winners
- Combine their outputs (e.g., tabs)
- Useful when multiple views are valid

**Strategy: User Override**:
- Check if user has pinned a component
- That component wins regardless of score
- Other bids used for alternatives

**Acceptance Criteria**:
- [ ] All strategies implemented
- [ ] Highest bid is deterministic
- [ ] Weighted random is reproducible (seeded)
- [ ] Ensemble produces valid combinations
- [ ] Override respects user choices

**Verification**: Run auctions with each strategy; verify selection.

---

#### Task 3.3: Implement Auction Engine
**File**: `src/paradigms/marketplace/auction/engine.ts`

**What to build**:
Core auction orchestration.

**Auction Process**:
1. Decompose content into slots
2. Collect all bids
3. For each slot, run strategy
4. Record winners
5. Return auction result

**Auction Result**:
| Field | Description |
|-------|-------------|
| `winners` | Map of slotId → winning bid |
| `allBids` | All bids for analysis |
| `strategy` | Which strategy was used |
| `timestamp` | When auction ran |

**Acceptance Criteria**:
- [ ] Auctions complete successfully
- [ ] All slots have winners
- [ ] Results are reproducible
- [ ] Timing data captured
- [ ] Handles no-bid slots

**Verification**: Run complete auctions; verify results.

---

### Phase 4: Coherence Layer

#### Task 4.1: Implement Compatibility Checker
**File**: `src/paradigms/marketplace/coherence/compatibility.ts`

**What to build**:
Verify winning bids are compatible.

**Compatibility Rules**:

| Rule | Description |
|------|-------------|
| Parent-child | Parent accepts child component type |
| Sibling | No conflicting siblings |
| Exclusion | Bid exclusions respected |
| Nesting depth | Maximum nesting not exceeded |

**Conflict Resolution**:
When incompatible:
1. Identify conflict
2. Find alternative bids for conflicting slots
3. Re-run selection for those slots
4. Repeat until resolved

**Acceptance Criteria**:
- [ ] Detects all incompatibilities
- [ ] Resolution finds valid alternatives
- [ ] Terminates (doesn't loop forever)
- [ ] Reports unresolvable conflicts
- [ ] Minimal changes to resolve

**Verification**: Create conflicts; verify resolution.

---

#### Task 4.2: Implement Style Enforcer
**File**: `src/paradigms/marketplace/coherence/style-enforcer.ts`

**What to build**:
Ensure consistent styling across winners.

**Style Rules**:

| Rule | Description |
|------|-------------|
| Spacing | Consistent gap between components |
| Typography | Heading hierarchy correct |
| Colors | Status colors consistent |
| Density | Similar density across UI |

**Enforcement**:
- Collect style properties from all winners
- Identify inconsistencies
- Apply normalization (adjust props)

**Acceptance Criteria**:
- [ ] Spacing normalized
- [ ] Colors consistent
- [ ] Typography hierarchical
- [ ] Density uniform
- [ ] Changes minimal

**Verification**: Check styled outputs; verify consistency.

---

#### Task 4.3: Implement UISpec Assembler
**File**: `src/paradigms/marketplace/coherence/assembler.ts`

**What to build**:
Assemble winning bids into UISpec tree.

**Assembly Process**:
1. Start with root slot winner
2. For each child slot, insert child UISpec
3. Recurse for nested slots
4. Apply final style adjustments
5. Return complete UISpec

**Acceptance Criteria**:
- [ ] Produces valid UISpec
- [ ] Nesting correct
- [ ] Props from bids preserved
- [ ] Keys generated
- [ ] Renderable output

**Verification**: Assemble from auction results; verify UISpec.

---

### Phase 5: Bidder Registration

#### Task 5.1: Implement Bidder Registry
**File**: `src/paradigms/marketplace/registry/bidder-registry.ts`

**What to build**:
Registry for managing bidders.

**Registry Operations**:

| Operation | Description |
|-----------|-------------|
| `register(bidder)` | Add bidder to registry |
| `unregister(bidderId)` | Remove bidder |
| `getBidders(slotType)` | Get bidders for slot type |
| `getAllBidders()` | List all registered |
| `enable(bidderId)` | Enable bidder |
| `disable(bidderId)` | Disable bidder |

**Bidder Discovery**:
- Auto-discover bidders in directory
- Plugin loading support
- Hot reload (dev mode)

**Acceptance Criteria**:
- [ ] Registration works
- [ ] Can query by slot type
- [ ] Enable/disable works
- [ ] Discovery works
- [ ] Hot reload works

**Verification**: Register bidders; verify discovery.

---

#### Task 5.2: Implement Bidder Analytics
**File**: `src/paradigms/marketplace/registry/analytics.ts`

**What to build**:
Track bidder performance.

**Metrics to Track**:

| Metric | Description |
|--------|-------------|
| `winRate` | How often bidder wins |
| `bidFrequency` | How often bidder bids |
| `userAcceptance` | User doesn't change after win |
| `avgScore` | Average bid score |
| `avgConfidence` | Average confidence |

**Analytics Uses**:
- Identify weak bidders
- Compare bidder versions
- A/B testing results
- Improve bidding algorithms

**Acceptance Criteria**:
- [ ] All metrics tracked
- [ ] Queryable history
- [ ] Aggregation works
- [ ] Export for analysis
- [ ] Real-time updates

**Verification**: Run auctions; verify metrics collected.

---

### Phase 6: Pipeline Integration

#### Task 6.1: Implement Marketplace Pipeline
**File**: `src/paradigms/marketplace/pipeline.ts`

**What to build**:
Complete pipeline extending GenerationPipeline base.

**Pipeline Steps**:
1. Register/discover bidders
2. Decompose content to slots
3. Run auction
4. Apply coherence layer
5. Assemble UISpec
6. Record analytics
7. Return result

**Metadata**:
- All bids submitted
- Auction results
- Coherence adjustments
- Bidder analytics

**Acceptance Criteria**:
- [ ] End-to-end works
- [ ] All bidders participate
- [ ] Coherence enforced
- [ ] Analytics recorded
- [ ] Metadata comprehensive

**Verification**: Run pipeline on fixtures; verify output.

---

### Phase 7: A/B Testing Support

#### Task 7.1: Implement Experiment Framework
**File**: `src/paradigms/marketplace/experiments/framework.ts`

**What to build**:
Run controlled experiments between bidders.

**Experiment Definition**:
| Field | Description |
|-------|-------------|
| `id` | Experiment ID |
| `name` | Human name |
| `variants` | Bidder variants to test |
| `allocation` | Traffic split |
| `metrics` | Success metrics |
| `duration` | How long to run |

**Experiment Process**:
1. Define experiment
2. Allocate users to variants
3. Track metrics per variant
4. Analyze results
5. Declare winner

**Acceptance Criteria**:
- [ ] Experiments definable
- [ ] Allocation is sticky (same user same variant)
- [ ] Metrics tracked per variant
- [ ] Statistical significance calculated
- [ ] Can end experiment early

**Verification**: Run mini-experiment; verify tracking.

---

## Verification Checklist

After completing all tasks, verify:

- [ ] All built-in bidders work correctly
- [ ] Auction selects appropriate components
- [ ] Coherence prevents conflicts
- [ ] Custom bidders can be added
- [ ] Analytics track performance
- [ ] A/B testing works
- [ ] Performance acceptable

---

## Extension Points

Future enhancements:
1. Bidder marketplace (third-party bidders)
2. Real-time bidder tuning
3. Federated bidding (distributed)
4. Bidder sandboxing (security)
5. Bid explanation UI

