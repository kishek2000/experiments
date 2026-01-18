# Plan 02: The Agent Pipeline

## Overview

The agent pipeline transforms user input into rendered UI through five specialized agents. Each agent has a single responsibility and clear inputs/outputs.

**Key Principle**: Minimize LLM usage. Only Agent 1 (parsing novel intents) and Agent 4 (generation) require LLM. Agents 2, 3, and 5 are deterministic.

---

## Pipeline Overview

```
User Input
     │
     ▼
┌─────────────────┐
│ AGENT 1: PARSER │  LLM for novel, rules for common
└────────┬────────┘
         │
         ▼
   IntentSignature + SchemaSignature
         │
         ▼
┌─────────────────┐
│ AGENT 2: MATCHER│  Pure retrieval, no LLM
└────────┬────────┘
         │
         ├────────────────────────────────┐
         │                                │
    SCORE ≥ 0.7                      SCORE < 0.7
         │                                │
         ▼                                ▼
┌─────────────────┐              ┌─────────────────┐
│ AGENT 3: ADAPTER│              │AGENT 4: GENERATOR│  LLM generation
└────────┬────────┘              └────────┬────────┘
         │                                │
         └────────────────┬───────────────┘
                          │
                          ▼
                ┌─────────────────┐
                │ AGENT 5: VALIDATOR│  Deterministic checks
                └────────┬────────┘
                         │
                         ▼
                  Rendered Component
```

---

## Agent 1: Intent Parser

### Responsibility

Transform user's natural language + selected content into structured signatures.

### Inputs

| Input | Type | Description |
|-------|------|-------------|
| `prompt` | string | User's natural language request |
| `selectedContent` | ContentSelection | What user selected in the app |
| `contentMetadata` | ContentMetadata | Schema of the content source |

**Content Selection**:
```typescript
interface ContentSelection {
  contentType: 'page' | 'whiteboard' | 'database';
  items: SelectedItem[];
  source: {
    name: string;
    schema: FieldDefinition[];
  };
}
```

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `intent` | IntentSignature | What user wants to accomplish |
| `schema` | SchemaSignature | What fields are needed |
| `confidence` | number | Parser confidence |
| `ambiguities` | Ambiguity[] | Unclear aspects |

### Implementation Strategy

**Two-tier approach**:

1. **Rule-based fast path** (no LLM):
   - Pattern matching on common phrases
   - "show as kanban" → `{ layout: 'grouped', primaryGoal: 'organize' }`
   - "calendar view" → `{ layout: 'timeline', primaryGoal: 'track' }`
   - "list of..." → `{ layout: 'sequential', primaryGoal: 'view' }`

2. **LLM fallback** (for novel/complex):
   - When rules don't match confidently
   - Structured output with IntentSignature schema
   - Include content schema in prompt for field detection

**Rule Patterns** (implement first):

| Pattern | Intent | Layout |
|---------|--------|--------|
| "kanban", "board", "columns" | organize | grouped |
| "calendar", "schedule" | track | timeline |
| "table", "list", "rows" | view | sequential |
| "gallery", "cards", "tiles" | view | grid |
| "tree", "hierarchy", "nested" | view | hierarchical |
| "timeline", "gantt" | track | timeline |
| "by {field}" | organize | grouped |
| "sorted by", "ordered by" | view | sequential |
| "filter", "find", "search" | find | (depends) |

**Field Detection** (from content):
- Analyze selected content schema
- Map fields to roles based on:
  - Name heuristics ("status" → role: status)
  - Type inference (date type → role: date)
  - Value patterns (select with "Done" → role: status)

### Acceptance Criteria

- [ ] Rule patterns cover 80%+ of common requests
- [ ] Rules execute <10ms
- [ ] LLM fallback produces valid signatures
- [ ] Ambiguities are surfaced, not guessed
- [ ] Field roles detected from schema
- [ ] Confidence reflects actual certainty

### Demo Implementation

**Task 1.1**: Pattern Matcher
- Implement regex/keyword patterns for common intents
- Return IntentSignature when match found

**Task 1.2**: Schema Analyzer
- Extract SchemaSignature from content metadata
- Detect field roles from names and types

**Task 1.3**: LLM Parser (mocked)
- Define prompt template for intent parsing
- Mock LLM response for demo
- Parse structured output

**Task 1.4**: Parser Orchestrator
- Try rules first
- Fall back to LLM if low confidence
- Merge results

---

## Agent 2: Matcher

### Responsibility

Find the best existing component for the parsed intent.

### Inputs

| Input | Type | Description |
|-------|------|-------------|
| `intent` | IntentSignature | From Agent 1 |
| `schema` | SchemaSignature | From Agent 1 |
| `preferences` | UserPreferences? | Optional user preferences |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `candidates` | RankedCandidate[] | Sorted by score |
| `bestMatch` | RankedCandidate? | Top candidate if above threshold |
| `decision` | MatchDecision | retrieve / adapt / generate |

**Ranked Candidate**:
```typescript
interface RankedCandidate {
  componentId: string;
  score: number;
  breakdown: ScoreBreakdown;
  adaptationPath?: AdaptationPath;
}

interface ScoreBreakdown {
  intentScore: number;
  schemaScore: number;
  capabilityScore: number;
  visualScore: number;
}
```

**Match Decision**:
```typescript
type MatchDecision = 
  | { type: 'retrieve'; componentId: string; }
  | { type: 'adapt'; componentId: string; adaptation: AdaptationInstruction; }
  | { type: 'generate'; reason: string; nearestMatch?: RankedCandidate; };
```

### Implementation Strategy

**No LLM—pure retrieval + scoring**:

1. **Filter Phase** (fast):
   - Exclude components that can't possibly match
   - By content type affinity
   - By required capabilities

2. **Score Phase**:
   - Compare signatures (see Plan 01)
   - Compute weighted overall score

3. **Rank Phase**:
   - Sort by score
   - Apply tie-breakers (usage count, recency)

4. **Decision Phase**:
   - Score ≥ 0.9 → retrieve
   - Score 0.7-0.9 → adapt
   - Score < 0.7 → generate

### Acceptance Criteria

- [ ] No LLM calls
- [ ] <50ms for library of 1000 components
- [ ] Scores are deterministic
- [ ] Breakdown explains score
- [ ] Decision follows threshold rules
- [ ] Can explain "why not" for rejected candidates

### Demo Implementation

**Task 2.1**: Component Index
- In-memory index of components by key attributes
- Fast lookup by primaryGoal, layout

**Task 2.2**: Scoring Functions
- Implement signature comparison from Plan 01
- Return breakdown with overall score

**Task 2.3**: Ranking & Decision
- Sort candidates
- Apply thresholds
- Compute adaptation path for near-matches

**Task 2.4**: Match Explainer
- Generate human-readable explanation
- Show why top candidate matched
- Show why others didn't

---

## Agent 3: Adapter

### Responsibility

Configure an existing component to work with different content.

### Inputs

| Input | Type | Description |
|-------|------|-------------|
| `component` | ComponentSpec | The matched component |
| `querySchema` | SchemaSignature | What user's content has |
| `queryIntent` | IntentSignature | What user wants |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `adaptation` | AdaptationInstruction | How to configure component |
| `warnings` | AdaptationWarning[] | Potential issues |

**Adaptation Instruction**:
```typescript
interface AdaptationInstruction {
  componentId: string;
  version: string;
  
  fieldMappings: {
    [componentField: string]: {
      contentField: string;
      transform?: string;  // Optional transform expression
    };
  };
  
  configOverrides: {
    [configKey: string]: unknown;
  };
  
  visualOverrides: {
    density?: 'compact' | 'comfortable' | 'spacious';
    emphasis?: VisualEmphasis[];
  };
}
```

### Implementation Strategy

**No LLM—deterministic mapping**:

1. **Field Alignment**:
   - Match by role (highest priority)
   - Match by name similarity
   - Match by type compatibility

2. **Config Inference**:
   - GroupBy field → find field with role: category/status
   - SortBy → find date or priority field
   - Display fields → all non-grouped fields

3. **Visual Adaptation**:
   - Preserve component's visual signature
   - Only override if user explicitly requested

### Acceptance Criteria

- [ ] No LLM calls
- [ ] Field mapping works for common cases
- [ ] Unmapped required fields produce warnings
- [ ] Config is valid for component
- [ ] Adaptation is reversible (can see original)

### Demo Implementation

**Task 3.1**: Field Mapper
- Implement role-based matching
- Implement name similarity matching
- Return confidence for each mapping

**Task 3.2**: Config Generator
- Infer config from intent + schema
- Validate against component's config schema

**Task 3.3**: Adaptation Validator
- Check all required fields mapped
- Check config is valid
- Generate warnings for issues

---

## Agent 4: Generator

### Responsibility

Create a new component when no suitable match exists.

### Inputs

| Input | Type | Description |
|-------|------|-------------|
| `intent` | IntentSignature | What to build |
| `schema` | SchemaSignature | What data it handles |
| `nearestMatch` | ComponentSpec? | Similar component for reference |
| `atlaskitCatalog` | PrimitiveCatalog | Available primitives |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `code` | string | Generated React/TSX |
| `matchingSpec` | ComponentMatchingSpec | Spec for future matching |
| `dependencies` | string[] | Atlaskit imports used |

### Implementation Strategy

**LLM-powered generation**:

1. **Prompt Construction**:
   - Include intent description
   - Include schema with field details
   - Include Atlaskit primitive catalog
   - Include nearest match as example (if available)
   - Include constraints (tokens, accessibility)

2. **Output Parsing**:
   - Extract code block
   - Extract matching spec
   - Validate both

3. **Iterative Refinement** (if validation fails):
   - Send validation errors back to LLM
   - Request fix
   - Max 2 iterations

**Prompt Structure**:
```
You are generating a React component using Atlaskit primitives.

INTENT:
{intentDescription}

SCHEMA (fields the component must handle):
{schemaDescription}

AVAILABLE PRIMITIVES:
{atlaskitCatalog}

EXAMPLE COMPONENT (similar):
{nearestMatchCode}

CONSTRAINTS:
- Use Atlaskit tokens for all styling (space.200, color.text, etc.)
- Component must be accessible (WCAG AA)
- Generate TypeScript with proper types
- Include the ComponentMatchingSpec as a comment

Generate the component code and its matching spec.
```

### Acceptance Criteria

- [ ] Generated code compiles
- [ ] Uses only Atlaskit primitives
- [ ] Uses tokens, not hardcoded values
- [ ] Handles all required schema fields
- [ ] MatchingSpec accurately describes component
- [ ] Code is readable and maintainable

### Demo Implementation

**Task 4.1**: Prompt Builder
- Template for generation prompt
- Include all context

**Task 4.2**: Output Parser
- Extract code from LLM response
- Extract matching spec
- Handle malformed output

**Task 4.3**: Mock Generator
- For demo, return pre-written components
- Simulate generation delay
- Log what would be sent to LLM

**Task 4.4**: Generation Visualizer
- Show the prompt that would be sent
- Show the (mocked) response
- Highlight generated code

---

## Agent 5: Validator

### Responsibility

Ensure output is safe, correct, and meets requirements.

### Inputs

| Input | Type | Description |
|-------|------|-------------|
| `code` | string | Component code (if generated) |
| `adaptation` | AdaptationInstruction? | Adaptation (if adapted) |
| `component` | ComponentSpec | The component being used |
| `content` | Content | The data to render |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `valid` | boolean | Passes all checks |
| `errors` | ValidationError[] | Hard failures |
| `warnings` | ValidationWarning[] | Soft issues |

### Validation Checks

**Grammar Check** (for generated code):
| Check | Description |
|-------|-------------|
| Syntax | Code parses without errors |
| Imports | Only allowed Atlaskit imports |
| Tokens | No hardcoded colors/spacing |
| Types | TypeScript compiles |

**Constraint Check**:
| Check | Description |
|-------|-------------|
| Accessibility | ARIA labels, contrast, keyboard |
| Responsive | Handles mobile breakpoints |
| Performance | No obvious perf issues |

**Schema Binding Check**:
| Check | Description |
|-------|-------------|
| Required fields | All required fields are bound |
| Type compatibility | Field types match expected |
| Null handling | Handles missing values |

### Implementation Strategy

**No LLM—deterministic validation**:

1. **Static Analysis** (for code):
   - Parse AST
   - Check import whitelist
   - Find hardcoded values

2. **Accessibility Lint**:
   - Check for required ARIA attributes
   - Verify interactive elements have labels
   - Check color contrast (if possible)

3. **Schema Validation**:
   - Verify all required fields mapped
   - Check type compatibility
   - Verify null handling

### Acceptance Criteria

- [ ] Catches invalid syntax
- [ ] Catches forbidden imports
- [ ] Catches hardcoded values
- [ ] Catches missing accessibility
- [ ] Catches schema mismatches
- [ ] Clear error messages
- [ ] Can be run independently

### Demo Implementation

**Task 5.1**: Code Validator
- Parse code (can use simple regex for demo)
- Check for forbidden patterns
- Return errors

**Task 5.2**: Accessibility Checker
- Basic checks (button has label, etc.)
- Return warnings

**Task 5.3**: Schema Binder
- Verify fields are mapped
- Check types match
- Return binding result

**Task 5.4**: Validation Dashboard
- Show all checks and results
- Highlight failures
- Show how to fix

---

## Pipeline Orchestration

### Task: Pipeline Coordinator

**File**: `src/pipeline/coordinator.ts`

**Responsibility**: Run agents in sequence, handle errors, produce final result.

**Flow**:
```
1. Receive user input
2. Call Agent 1 (Parser)
   - If parse fails → return error
3. Call Agent 2 (Matcher)
4. Based on decision:
   - retrieve → use component directly
   - adapt → call Agent 3 (Adapter)
   - generate → call Agent 4 (Generator)
5. Call Agent 5 (Validator)
   - If validation fails → retry or return error
6. Render component with content
7. Store new component (if generated)
8. Return result
```

**Result Type**:
```typescript
interface PipelineResult {
  success: boolean;
  
  // What was produced
  component?: RenderedComponent;
  
  // How we got there
  decision: MatchDecision;
  matchScore?: number;
  
  // Metadata
  latency: {
    parse: number;
    match: number;
    adapt?: number;
    generate?: number;
    validate: number;
    total: number;
  };
  
  // If failed
  error?: PipelineError;
}
```

### Acceptance Criteria

- [ ] Orchestrates all agents correctly
- [ ] Handles errors at each stage
- [ ] Measures latency per stage
- [ ] Returns comprehensive result
- [ ] Can be run step-by-step (for debugging)

---

## Demo Implementation Summary

### Components to Build

| Component | Description |
|-----------|-------------|
| **IntentParser** | Rules + mock LLM |
| **ComponentMatcher** | Scoring + ranking |
| **FieldAdapter** | Mapping + config |
| **ComponentGenerator** | Mock generation |
| **ComponentValidator** | All checks |
| **PipelineCoordinator** | Orchestration |

### Interactive Features

| Feature | Description |
|---------|-------------|
| **Step-through mode** | Run pipeline one agent at a time |
| **Agent inspector** | See inputs/outputs for each agent |
| **Latency display** | Show time for each stage |
| **Decision explanation** | Why retrieve/adapt/generate |

---

## Verification Checklist

After completing this plan:

- [ ] Can parse common intents with rules
- [ ] Matcher finds best components
- [ ] Adapter produces valid instructions
- [ ] Generator produces code (mocked)
- [ ] Validator catches issues
- [ ] Pipeline orchestrates correctly
- [ ] Latencies meet targets
- [ ] Can step through and inspect

