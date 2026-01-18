# Paradigm 7: Grammar / Syntax-Directed

## Executive Summary

**Mental Model**: The design system is a formal grammar. UI generation is controlled derivation.

**Core Question**: "What UI is structurally valid?"

**Metaphor**: Think of natural language grammar. You can't say "Dog the runs" because English grammar forbids it. Similarly, a UI grammar defines what compositions are valid. Generation becomes parsing in reverse—deriving sentences (UIs) from the grammar.

---

## Why This Paradigm?

The grammar approach works well because:

1. **Guarantee validity**: Only valid UIs can be generated
2. **Principled**: Rules are explicit and auditable
3. **Composable**: Complex UIs from simple rules
4. **Verifiable**: Can check if UI conforms to grammar
5. **Teachable**: Grammar is documentation

**Best suited for**:
- Strictly controlled design systems
- When consistency is paramount
- Regulated industries (finance, healthcare)
- Component libraries with strict composition rules

**Less suited for**:
- Creative/experimental UIs
- When rules are fuzzy or context-dependent
- Rapidly evolving design systems
- User customization scenarios

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                 UI GRAMMAR                               │
│                                                          │
│  Start Symbol: UI                                        │
│                                                          │
│  Productions:                                            │
│    UI → Layout DataView*                                │
│    Layout → Stack | Grid | Split                        │
│    DataView → Table | Kanban | Calendar | List          │
│    Stack → StackItem+                                    │
│    StackItem → Component | Layout                        │
│    Component → Card | Text | Badge | Button | ...       │
│                                                          │
│  Conditions:                                             │
│    Table requires tabular data                          │
│    Kanban requires status field                         │
│    ...                                                   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│              SEMANTIC EXTRACTOR                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Content → {dataShape, fields, relationships}      │  │
│  └───────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  GENERATOR                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Derive sentence from grammar guided by semantics  │  │
│  └───────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
                      ┌──────────┐
                      │  UISpec  │
                      └──────────┘
```

---

## Key Concepts

### Formal Grammar

A grammar G = (N, Σ, P, S) where:
- **N**: Non-terminals (abstract concepts like "DataView")
- **Σ**: Terminals (actual components like "Table")
- **P**: Production rules (how to expand non-terminals)
- **S**: Start symbol (where derivation begins)

### Productions

Rules for expanding non-terminals:
```
Layout → Stack                    (Layout can be Stack)
Layout → Grid                     (or Grid)
Stack → StackItem StackItem*      (Stack has 1+ items)
StackItem → Text | Card | Layout  (StackItem options)
```

### Conditions

Productions can have conditions:
```
DataView → Table    when dataShape = 'tabular'
DataView → Kanban   when hasStatusField = true
```

### Attributes

Grammar can be attributed (synthesized/inherited):
- **Synthesized**: Computed from children (e.g., size)
- **Inherited**: Passed from parent (e.g., available width)

---

## Task Breakdown

### Phase 1: Grammar Definition

#### Task 1.1: Define Grammar Schema
**File**: `src/paradigms/grammar/types/grammar.ts`

**What to build**:
Type definitions for expressing UI grammars.

**Grammar Structure**:

| Field | Type | Description |
|-------|------|-------------|
| `nonTerminals` | string[] | Abstract symbols |
| `terminals` | string[] | Concrete components |
| `productions` | Production[] | Derivation rules |
| `startSymbol` | string | Where to begin |
| `attributes` | AttributeDef[] | Attribute definitions |

**Production Structure**:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique production ID |
| `lhs` | string | Left-hand side (non-terminal) |
| `rhs` | RHSElement[] | Right-hand side |
| `condition` | Predicate? | When to apply |
| `priority` | number | For ambiguity resolution |
| `attributes` | AttributeRule[] | Attribute computations |

**RHS Element**:
| Type | Description |
|------|-------------|
| `terminal(name)` | A component |
| `nonTerminal(name)` | To be expanded |
| `repeat(element, min, max)` | Repetition |
| `optional(element)` | 0 or 1 |
| `choice(elements)` | Alternatives |

**Acceptance Criteria**:
- [ ] Can express all UI patterns
- [ ] Conditions are evaluable
- [ ] Priorities resolve ambiguity
- [ ] Schema is serializable
- [ ] Grammar is validatable

**Verification**: Define sample grammars; verify they parse correctly.

---

#### Task 1.2: Create Default UI Grammar
**File**: `src/paradigms/grammar/grammars/default-ui-grammar.ts`

**What to build**:
A comprehensive grammar for the design system.

**Non-Terminals**:
| Symbol | Description |
|--------|-------------|
| `UI` | Root of any interface |
| `Layout` | Structural container |
| `DataView` | Data visualization |
| `Item` | Single content item |
| `Field` | Single data field |
| `Action` | Interactive element |
| `Feedback` | Status/notification |

**Sample Productions**:
```
UI → Layout
Layout → Stack(StackItem+)
Layout → Grid(GridItem+)
Layout → Tabs(TabItem+)
StackItem → DataView | Item | Layout | Action
DataView → Table     when dataShape = 'tabular'
DataView → Kanban    when hasStatus = true
DataView → Calendar  when hasDate = true
DataView → List      (default)
Item → Card(Field*, Action*)
Field → Text | Badge | Avatar | Image
Action → Button | Link | Menu
```

**Acceptance Criteria**:
- [ ] Covers all components
- [ ] All content types representable
- [ ] Conditions are meaningful
- [ ] Priorities resolve ambiguity
- [ ] Grammar is complete (no dead ends)

**Verification**: Generate UIs for all fixtures using grammar.

---

#### Task 1.3: Define Attribute System
**File**: `src/paradigms/grammar/types/attributes.ts`

**What to build**:
Schema for grammar attributes.

**Attribute Types**:

| Type | Direction | Description |
|------|-----------|-------------|
| Inherited | Parent → Child | Passed down (e.g., available width) |
| Synthesized | Child → Parent | Computed up (e.g., required height) |

**Common Attributes**:

| Attribute | Type | Direction |
|-----------|------|-----------|
| `availableWidth` | number | Inherited |
| `availableHeight` | number | Inherited |
| `dataContext` | object | Inherited |
| `requiredWidth` | number | Synthesized |
| `requiredHeight` | number | Synthesized |
| `depth` | number | Inherited |

**Attribute Rules**:
```
Stack.children.availableWidth = Stack.availableWidth
Stack.requiredHeight = sum(children.requiredHeight) + gaps
```

**Acceptance Criteria**:
- [ ] Both directions supported
- [ ] Rules are computable
- [ ] Circular dependencies detected
- [ ] Attributes propagate correctly
- [ ] Can define custom attributes

**Verification**: Define attributes; verify propagation.

---

### Phase 2: Grammar Operations

#### Task 2.1: Implement Grammar Validator
**File**: `src/paradigms/grammar/validation/grammar-validator.ts`

**What to build**:
Validate grammar is well-formed.

**Validation Checks**:

| Check | Description |
|-------|-------------|
| Start symbol exists | S ∈ N |
| Productions use defined symbols | All symbols in N ∪ Σ |
| Terminals are components | Σ ⊆ ComponentRegistry |
| No unreachable symbols | All non-terminals reachable from S |
| No infinite derivations | Grammar terminates |
| Conditions are valid | Predicate syntax correct |

**Acceptance Criteria**:
- [ ] All checks implemented
- [ ] Clear error messages
- [ ] Suggestions for fixes
- [ ] Fast validation
- [ ] Can validate partial grammars

**Verification**: Create invalid grammars; verify detection.

---

#### Task 2.2: Implement UISpec Validator
**File**: `src/paradigms/grammar/validation/uispec-validator.ts`

**What to build**:
Check if a UISpec conforms to grammar.

**Validation Process**:
1. Start at UISpec root
2. Attempt to parse against grammar
3. For each node, find matching production
4. Verify children match RHS
5. Check conditions satisfied
6. Report violations

**Acceptance Criteria**:
- [ ] Valid UISpecs pass
- [ ] Invalid UISpecs fail with reason
- [ ] Points to violating node
- [ ] Suggests valid alternatives
- [ ] Fast validation

**Verification**: Validate known good/bad UISpecs.

---

### Phase 3: Generation

#### Task 3.1: Implement Semantic Extractor
**File**: `src/paradigms/grammar/semantic/extractor.ts`

**What to build**:
Extract semantic attributes from content for guiding generation.

**Semantic Attributes**:

| Attribute | Values | Description |
|-----------|--------|-------------|
| `dataShape` | 'scalar', 'list', 'table', 'tree', 'graph' | Shape of data |
| `itemCount` | number | How many items |
| `hasStatusField` | boolean | Status-like column exists |
| `hasDateField` | boolean | Date column exists |
| `hasImageField` | boolean | Images present |
| `hasHierarchy` | boolean | Nested structure |
| `primaryField` | string | Main identifier field |
| `fields` | FieldInfo[] | All fields with types |

**Extraction Process**:
1. Analyze content structure
2. Detect field types
3. Identify semantic roles
4. Package as attribute set

**Acceptance Criteria**:
- [ ] All attributes extracted
- [ ] Handles all content types
- [ ] Semantic fields detected
- [ ] Output guides productions
- [ ] Fast extraction

**Verification**: Extract from fixtures; verify attributes.

---

#### Task 3.2: Implement Grammar Generator
**File**: `src/paradigms/grammar/generator/generator.ts`

**What to build**:
Generate UISpec by deriving from grammar.

**Generation Algorithm**:
```
generate(symbol, context):
  if symbol is terminal:
    return createComponent(symbol, context)
  
  // Find applicable productions
  productions = findProductions(symbol)
  applicable = filter(p => evaluateCondition(p.condition, context))
  
  // Select production (by priority or other strategy)
  production = selectProduction(applicable)
  
  // Expand RHS
  children = []
  for element in production.rhs:
    if element is terminal:
      children.push(createComponent(element))
    else if element is nonTerminal:
      children.push(generate(element, updatedContext))
    else if element is repeat:
      children.push(...generateRepeated(element, context))
  
  return assembleNode(production, children)
```

**Selection Strategies**:
| Strategy | Description |
|----------|-------------|
| Priority | Highest priority production |
| Random | Random from applicable |
| LLM-guided | Ask LLM which fits best |
| User-specified | User hints |

**Acceptance Criteria**:
- [ ] Generates valid UISpecs
- [ ] Conditions guide selection
- [ ] Handles all grammar constructs
- [ ] Terminates for all inputs
- [ ] Selection strategy works

**Verification**: Generate for fixtures; verify validity.

---

#### Task 3.3: Implement LLM-Guided Generation
**File**: `src/paradigms/grammar/generator/llm-guided.ts`

**What to build**:
Use LLM to make generation decisions.

**LLM Decision Points**:
| Point | LLM Input | LLM Output |
|-------|-----------|------------|
| Production selection | Content, options | Selected production |
| Repetition count | Content, element | How many |
| Prop values | Component, context | Props |

**Prompt Structure**:
- Current context (content being rendered)
- Available productions (with descriptions)
- Constraints from conditions
- Request: select best option

**Acceptance Criteria**:
- [ ] LLM makes sensible choices
- [ ] Fallback to priority if LLM fails
- [ ] Caching for similar contexts
- [ ] Decisions are explainable
- [ ] Performance acceptable

**Verification**: Generate with LLM; verify quality.

---

### Phase 4: Grammar Editing

#### Task 4.1: Implement Grammar DSL
**File**: `src/paradigms/grammar/dsl/grammar-dsl.ts`

**What to build**:
Fluent API for defining grammars.

**DSL Examples**:
```
grammar('ui-grammar')
  .start('UI')
  .nonTerminals('UI', 'Layout', 'DataView', 'Item')
  .terminals('Stack', 'Grid', 'Table', 'Card', 'Text')
  
  .production('UI')
    .derives('Layout')
  
  .production('Layout')
    .derives('Stack', repeat('StackItem', 1, Infinity))
  
  .production('DataView')
    .derives('Table')
    .when(ctx => ctx.dataShape === 'tabular')
    .priority(10)
  
  .build()
```

**DSL Features**:
| Feature | Description |
|---------|-------------|
| `.derives()` | Define RHS |
| `.when()` | Add condition |
| `.priority()` | Set priority |
| `.attribute()` | Define attribute rule |
| `.repeat()` | Repetition syntax |
| `.optional()` | Optional element |

**Acceptance Criteria**:
- [ ] DSL produces valid Grammar
- [ ] All grammar features expressible
- [ ] Type-safe
- [ ] Good error messages
- [ ] Readable/maintainable

**Verification**: Build grammar with DSL; verify equivalence.

---

#### Task 4.2: Implement Grammar Editor UI
**File**: `src/paradigms/grammar/ui/grammar-editor.tsx`

**What to build**:
Visual editor for grammars.

**Editor Features**:

| Feature | Description |
|---------|-------------|
| Symbol list | View/add non-terminals and terminals |
| Production editor | Edit productions visually |
| Condition builder | Build conditions without code |
| Validation feedback | Real-time grammar validation |
| Preview | Generate sample to see result |

**UI Elements**:
- Tree view of grammar structure
- Drag-drop for RHS construction
- Condition builder (field, operator, value)
- Live preview pane

**Acceptance Criteria**:
- [ ] Can create grammar from scratch
- [ ] Can edit existing grammar
- [ ] Validation is real-time
- [ ] Preview updates live
- [ ] Usable without coding

**Verification**: Create grammar visually; verify it works.

---

### Phase 5: Pipeline Integration

#### Task 5.1: Implement Grammar Pipeline
**File**: `src/paradigms/grammar/pipeline.ts`

**What to build**:
Complete pipeline extending GenerationPipeline base.

**Pipeline Steps**:
1. Load grammar
2. Extract semantics from content
3. Generate via derivation
4. Validate output
5. Return with metadata

**Pipeline Configuration**:
| Option | Description |
|--------|-------------|
| `grammar` | Which grammar to use |
| `selectionStrategy` | How to choose productions |
| `maxDepth` | Derivation depth limit |
| `validate` | Validate output |

**Metadata**:
- Grammar used
- Derivation trace
- Productions selected
- Conditions evaluated

**Acceptance Criteria**:
- [ ] End-to-end works
- [ ] Grammar is configurable
- [ ] Derivation trace available
- [ ] Validation catches errors
- [ ] Performance acceptable

**Verification**: Run pipeline; verify output.

---

### Phase 6: Analysis & Debugging

#### Task 6.1: Implement Derivation Visualizer
**File**: `src/paradigms/grammar/ui/derivation-viz.tsx`

**What to build**:
Visualize the derivation process.

**Visualization Features**:

| Feature | Description |
|---------|-------------|
| Derivation tree | Tree of production applications |
| Step-through | See derivation step by step |
| Condition display | Show why productions were chosen |
| Alternative paths | What could have been chosen |

**Acceptance Criteria**:
- [ ] Tree renders correctly
- [ ] Step-through works
- [ ] Conditions visible
- [ ] Alternatives shown
- [ ] Useful for debugging

**Verification**: Visualize derivations; verify clarity.

---

#### Task 6.2: Implement Grammar Analyzer
**File**: `src/paradigms/grammar/analysis/analyzer.ts`

**What to build**:
Analyze grammar properties.

**Analysis Outputs**:

| Analysis | Description |
|----------|-------------|
| Reachability | Which symbols are reachable |
| Ambiguity | Where multiple productions match |
| Productivity | Which symbols can derive terminals |
| Cycles | Detect infinite derivations |
| Coverage | Which components are used |

**Acceptance Criteria**:
- [ ] All analyses implemented
- [ ] Reports are clear
- [ ] Suggestions for improvement
- [ ] Fast analysis
- [ ] Export reports

**Verification**: Analyze grammars; verify insights.

---

## Verification Checklist

After completing all tasks, verify:

- [ ] Grammar can express all design system patterns
- [ ] Generation produces valid UIs
- [ ] Conditions guide appropriate selections
- [ ] LLM guidance improves quality
- [ ] Grammar editor is usable
- [ ] Validation catches violations
- [ ] Derivation is explainable

---

## Extension Points

Future enhancements:
1. Grammar composition (combine grammars)
2. Grammar versioning
3. Grammar testing framework
4. Probabilistic grammars
5. Grammar learning from examples

