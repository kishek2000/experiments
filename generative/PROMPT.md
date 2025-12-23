# Comprehensive Prompt: Building Generative Confluence

Use this prompt with Cursor or any capable AI coding assistant to build out the full vision.

---

## THE PROMPT

````
You are building "Generative" - a prototype for the future of Confluence and collaborative software. The core philosophy is this: today, users fit their use cases to tools. Tomorrow, tools should fit themselves to user intents.

## Core Concept

Users express what they want to accomplish (an "intent"), and the system generates the appropriate "surface" - a malleable workspace that combines:
- Structured document editing (ADF-like rich text)
- Unstructured canvas (WebGL-powered whiteboard)
- Interactive elements (voting, polling, timers)
- AI agents (facilitator, scribe, synthesizer)
- Live integrations (Jira, Figma, Atlas, Slack)

## What to Build

### Phase 1: Intent-to-Surface Pipeline

1. **Intent Input Component**
   - Beautiful, minimal interface for entering natural language intent
   - Example intents to inspire users
   - Loading state with generative animation while AI "thinks"

2. **Intent Classifier (Mock AI)**
   - Parse intent into surface type: decision, onboarding, brainstorm, planning, retrospective, documentation
   - Extract key entities: project names, topics, people, timeframes
   - For now, use pattern matching; design for easy swap to real LLM

3. **Surface Generator**
   - Based on classified intent, generate a SurfaceConfig object
   - SurfaceConfig includes:
     - blocks: array of UI blocks to render
     - agents: which AI agents are active
     - connectedSystems: which integrations to show
     - layout: how blocks are arranged
     - theme: visual customization

### Phase 2: Hybrid Canvas

1. **Block Renderer**
   Build these block types:
   - `header`: Section headers (editable)
   - `editor`: Rich text editing area
   - `canvas`: WebGL-powered infinite canvas region
   - `voting`: Poll/voting widget with options
   - `timer`: Countdown timer for timeboxing
   - `embed`: External content (Figma, Loom, etc.)
   - `jira-query`: Live Jira ticket display
   - `context-cards`: Related content from connected systems
   - `chat`: AI Q&A interface
   - `progress`: Checklist/progress tracker
   - `ai-summary`: Auto-updating AI synthesis

2. **Canvas Component**
   - Use HTML5 Canvas or WebGL (Three.js/PixiJS)
   - Infinite pan and zoom
   - Sticky notes (create, move, edit, delete)
   - Drawing tools (pen, shapes, arrows)
   - Image drops
   - Multiplayer cursors

3. **Block Drag & Drop**
   - Reorder blocks
   - Resize canvas regions
   - Add new blocks from palette

### Phase 3: Real-time Collaboration

1. **Multiplayer Infrastructure**
   - Use Yjs or Automerge for CRDT-based sync
   - WebSocket server (can mock with local state initially)
   - Cursor presence (show where others are)
   - Awareness (who's online, what they're doing)

2. **Collaboration UI**
   - Avatar stack showing collaborators
   - Live cursors on canvas
   - Selection indicators in editor
   - "X is typing..." indicators

### Phase 4: AI Agents

1. **Agent Framework**
   ```typescript
   interface Agent {
     id: string
     name: string
     description: string
     capabilities: string[]
     isActive: boolean
     onEvent(event: WorkspaceEvent): AgentSuggestion | null
   }
````

2. **Agent Types**

   - **Facilitator**: Monitors time, ensures balanced participation, redirects tangents
   - **Scribe**: Captures decisions, action items, key points
   - **Synthesizer**: Identifies themes, creates summaries, spots patterns
   - **Guide**: Answers questions, provides context, suggests resources
   - **Connector**: Links people and information, suggests experts

3. **Agent UI**

   - Agent panel showing active agents
   - Activity feed of agent observations
   - Suggestion bar for agent recommendations
   - Accept/dismiss/modify suggestions

4. **Agent Behaviors (Examples)**
   - Facilitator: After 5 minutes of discussion, suggest moving on
   - Scribe: When voting completes, offer to record decision
   - Synthesizer: After 10 sticky notes, offer to cluster them
   - Guide: When user asks question, search connected systems

### Phase 5: Integration Layer

1. **Mock Integration Data**
   Create realistic mock data for:

   - Jira: Tickets with status, assignee, sprint info
   - Confluence: Pages with titles, snippets, authors
   - Atlas: Projects with status, goals, team
   - Figma: Design thumbnails and embed URLs
   - Slack: Thread snippets, channel references

2. **Integration Components**

   - Jira card (shows ticket, can update status)
   - Confluence snippet (shows page excerpt, links to full)
   - Atlas project card (shows status and goals)
   - Figma embed (live preview)
   - Create Jira ticket modal
   - Link to Atlas goal modal

3. **Context Gathering**
   - AI suggests relevant context based on intent
   - User can request more: "Pull in the design specs"
   - Push actions: "Create a Jira ticket for this"

### Phase 6: Voice Integration

1. **Voice Controls**

   - Push-to-talk or toggle mic
   - Speech-to-text using Web Speech API
   - Commands: "Add sticky note: [content]", "Start timer for 5 minutes"

2. **Voice Transcription**

   - Live transcription panel (optional)
   - AI listening and extracting key points
   - "I heard you mention a decision about X. Should I capture it?"

3. **Speaker Attribution** (stretch)
   - Identify different speakers
   - Attribute comments to participants

### Phase 7: Temporal Modes

1. **Mode Switcher**

   - Before/During/After mode toggle
   - Surface adapts based on mode

2. **Mode Behaviors**
   - **Before**: Focus on agenda, context gathering, async prep
   - **During**: Focus on collaboration, real-time editing, voice
   - **After**: Focus on synthesis, action items, distribution

### Phase 8: Polish & Delight

1. **Animations**

   - Surface generation: blocks animate in staggered
   - Agent suggestions: slide up smoothly
   - Voting: percentage bars animate
   - Mode transitions: smooth morph

2. **Ambient Effects**

   - Subtle background gradients that shift
   - Particles or glow when AI is "thinking"
   - Sound design for key actions (optional)

3. **Empty States**
   - Beautiful empty states for each block type
   - Helpful prompts to get started

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Styling**: CSS Modules or Tailwind (your choice)
- **Animation**: Framer Motion
- **Canvas**: HTML5 Canvas, PixiJS, or Three.js
- **Icons**: Lucide React
- **State**: Zustand or Jotai for client state
- **CRDT**: Yjs for multiplayer (can mock initially)

## Design Guidelines

- **Dark theme** by default (terminal/IDE aesthetic)
- **Typography**: Mix of serif (for headings) and monospace (for UI)
- **Accent color**: Acid green (#c4f042) as primary accent
- **Spacing**: Generous whitespace, clean lines
- **Borders**: Subtle, low-contrast borders
- **Shadows**: Minimal, prefer elevation through background color

## File Structure

```
src/
├── components/
│   ├── IntentPrompt/
│   ├── GenerativeSurface/
│   ├── blocks/
│   │   ├── EditorBlock/
│   │   ├── CanvasBlock/
│   │   ├── VotingBlock/
│   │   └── ...
│   ├── agents/
│   │   ├── AgentPanel/
│   │   ├── AgentSuggestion/
│   │   └── ...
│   ├── integrations/
│   │   ├── JiraCard/
│   │   ├── FigmaEmbed/
│   │   └── ...
│   └── collaboration/
│       ├── CursorPresence/
│       ├── AvatarStack/
│       └── ...
├── lib/
│   ├── intent/
│   │   ├── classifier.ts
│   │   └── surfaceGenerator.ts
│   ├── agents/
│   │   ├── framework.ts
│   │   ├── facilitator.ts
│   │   ├── scribe.ts
│   │   └── ...
│   └── integrations/
│       ├── mockData.ts
│       └── types.ts
├── hooks/
│   ├── useCollaboration.ts
│   ├── useAgents.ts
│   └── useVoice.ts
├── types/
│   └── index.ts
└── styles/
    └── theme.css
```

## Interaction Patterns

1. **Intent Submission**

   - User types intent → Press Enter or click submit
   - 1-2 second "generating" state with animation
   - Surface fades in with staggered block animations

2. **Agent Suggestions**

   - Appear as a floating bar at bottom of screen
   - Include: agent icon, suggestion text, accept/dismiss buttons
   - Auto-dismiss after 10 seconds if not interacted with

3. **Block Interactions**

   - Hover: Show drag handle, options menu
   - Click: Enter edit mode for that block
   - Drag: Reorder or resize

4. **Voting**

   - Click option to vote
   - Vote locks in (can't change)
   - Percentages animate in
   - When voting complete, agent suggests recording decision

5. **Canvas**
   - Double-click: Create sticky note
   - Click-drag: Pan
   - Scroll: Zoom
   - Toolbar: Switch between select, draw, text

## Example Flows to Implement

### Flow 1: Team Decision

1. User: "I need to decide which API approach to use with my team"
2. Surface generates: Context area, options with voting, canvas for sketching, active facilitator/scribe
3. Team votes, discusses on canvas
4. Facilitator suggests: "Option B has majority. Ready to record this decision?"
5. User accepts → Scribe captures decision with reasoning

### Flow 2: Project Onboarding

1. User: "I just joined the Payments team and need to understand Project Helios"
2. Surface generates: Learning path, context cards (Jira/Confluence/Atlas), Q&A chat
3. User asks questions in chat, AI answers with citations
4. Progress tracks what user has reviewed
5. User: "Generate me a summary deck" → AI creates slides

### Flow 3: Brainstorm

1. User: "Brainstorm how we can reduce checkout abandonment"
2. Surface generates: Problem framing (with metrics from integrations), infinite canvas, synthesis panel
3. Team adds sticky notes (typed or via voice)
4. Synthesizer: "I see 3 themes emerging: speed, trust, clarity. Should I cluster?"
5. User accepts → Notes auto-group, summaries appear

## What Success Looks Like

1. A user can enter ANY reasonable work intent and get a useful starting surface
2. The surface feels alive—agents make helpful suggestions without being annoying
3. The hybrid canvas feels seamless—documents and whiteboard coexist naturally
4. Integrations feel real—even with mock data, the UX shows the vision
5. Collaboration feels present—even solo, the UI suggests multiplayer readiness
6. The aesthetic is distinctive—not generic "AI tool" look, but crafted and intentional

## Stretch Goals

- Actual LLM integration for intent classification and agent behavior
- Real CRDT multiplayer with WebSocket server
- Voice-to-sticky-note pipeline
- Export to Confluence page
- Presentation mode (turn surface into slides)
- Mobile-responsive canvas
- Keyboard-first navigation

Remember: This is a vision prototype. Prioritize showing the UX possibilities over production robustness. Make it feel magical, even if it's smoke and mirrors underneath.

```

---

## How to Use This Prompt

1. Start a new chat with Cursor/AI assistant
2. Paste the entire prompt above
3. Say: "Let's build this step by step. Start with Phase 1."
4. Work through each phase iteratively
5. Request refinements and polish as you go

The prompt is designed to be comprehensive yet flexible. Feel free to modify priorities based on what excites you most or what would make the most compelling demo.

```
