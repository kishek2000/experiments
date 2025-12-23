# Generative Confluence: The Future of Collaborative Work

## The Core Insight

Today, humans conform to tools. Tomorrow, tools conform to humans.

Current software forces users to think in terms of the tool's abstractions: "I need to create a Confluence page" or "I should make a Jira ticket." But users don't think in tools—they think in **intentions**: "I need to make a decision with my team" or "I want to understand this project."

The future of Confluence isn't a better document editor. It's **an intent-driven workspace that generates the right surface for the job**.

---

## Key Concepts

### 1. Intent → Surface

Users express what they want to accomplish, not what tool to use. The AI interprets intent and generates an appropriate **surface configuration**—a mix of:

- **Structured blocks** (rich text, tables, data displays)
- **Unstructured canvas** (WebGL whiteboard, infinite scroll, freeform)
- **Interactive elements** (voting, polls, timers, checklists)
- **AI agents** (facilitators, scribes, summarizers)
- **Live integrations** (Jira, Figma, Atlas, Slack)

### 2. Hybrid Canvas

The workspace isn't constrained to one modality. A single surface can contain:
- Document sections (ADF-style structured content)
- Canvas regions (Miro-style infinite whiteboard)
- Data widgets (live Jira queries, Figma embeds)
- Temporal elements (meeting agendas, timers)

These seamlessly coexist and flow into each other.

### 3. Ambient Intelligence

The AI isn't just responding to prompts—it's **ambient**:
- Listening to voice conversations and extracting key points
- Watching collaboration patterns and suggesting structure
- Noticing when decisions are being made and offering to capture them
- Identifying when someone needs help and proactively offering it

### 4. Connected Fabric

Every surface is a node in a larger knowledge fabric:
- **Pull from anywhere**: Jira tickets, Atlas goals, Figma designs, Slack threads, calendar events
- **Push to anywhere**: Create Jira tickets, update Atlas, post to Slack, schedule follow-ups
- **Bidirectional sync**: Changes propagate across systems

### 5. Temporal Awareness

The surface understands time and transforms accordingly:
- **Before**: Preparation mode—gather context, create agenda
- **During**: Collaboration mode—real-time editing, voice integration, live updates
- **After**: Synthesis mode—generate summaries, capture decisions, assign actions

### 6. Multi-Agent Collaboration

AI agents participate as collaborators:
- **Facilitator**: Keeps discussion on track, ensures everyone is heard
- **Scribe**: Captures decisions, action items, key points
- **Devil's Advocate**: Challenges assumptions, surfaces risks
- **Synthesizer**: Identifies themes, creates summaries
- **Connector**: Links people and information

---

## User Scenarios

### Scenario 1: Decision Making

**Intent**: "I need to decide with my team which design direction to pursue for our checkout flow"

**Generated Surface**:
1. Context panel pulling in:
   - Related Jira tickets for checkout improvements
   - Figma design options
   - Previous decision records
2. Decision canvas with:
   - Design embeds side-by-side
   - Voting mechanism for each option
   - Pros/cons table (AI pre-populated from design descriptions)
3. Active agents:
   - Facilitator tracking time and ensuring all voices heard
   - Scribe capturing discussion points
4. Voice integration for live discussion

**AI Behaviors**:
- Notices when consensus is forming → "It looks like Option B is leading. Should I capture this as the tentative decision?"
- Detects discussion going in circles → "You've discussed performance 3 times. Would you like to table this and move on?"
- Post-decision → "Should I create the follow-up Jira tickets and update Atlas?"

### Scenario 2: Onboarding

**Intent**: "I'm new to Project Phoenix and need to get up to speed on the authentication feature"

**Generated Surface**:
1. Learning path with progressive disclosure:
   - Project overview (auto-generated from Atlas)
   - Team structure (who to ask what)
   - Recent decisions (from Confluence ADRs)
   - Current sprint context (from Jira)
2. Context cards:
   - Key documents ranked by relevance
   - Recent discussions (Slack threads)
   - Related PRs and code changes
3. Interactive Q&A:
   - Chat interface to ask questions
   - AI answers with citations to actual documents
4. People connections:
   - "Talk to Sarah about auth implementation"
   - "James made the original design decisions"

**AI Behaviors**:
- Notices knowledge gaps → "You haven't seen the security requirements yet. Should I add those?"
- Tracks progress → "You've covered 60% of essential context. Here's what's remaining..."
- Generates artifacts → "Want me to create a summary slide deck for your 1:1 with your manager?"

### Scenario 3: Brainstorming

**Intent**: "We need to brainstorm solutions for our mobile app performance issues"

**Generated Surface**:
1. Problem framing:
   - Current metrics (pulled from monitoring)
   - User feedback (from support tickets)
   - Previous attempts (from Confluence)
2. Infinite canvas for ideation:
   - Sticky notes (add via keyboard or voice)
   - Clustering (AI groups related ideas)
   - Voting on ideas
3. Synthesis panel:
   - AI identifies emerging themes
   - Groups ideas into actionable categories
   - Surfaces similar solutions from other teams

**AI Behaviors**:
- Ensures divergent thinking → "You've been focused on frontend solutions. What about backend or infrastructure approaches?"
- Identifies patterns → "Three ideas mention caching. Should I create a 'Caching Approaches' cluster?"
- Connects to action → "Ready to move to prioritization? I can help rank these by impact vs. effort."

---

## Technical Architecture

### Frontend
- **Hybrid Renderer**: DOM for structured content + WebGL for canvas regions
- **Real-time Sync**: CRDT-based (Yjs/Automerge) for multiplayer
- **Component System**: AI-instantiable components (voting, timers, embeds, etc.)
- **Voice Pipeline**: Web Audio API + speech recognition + speaker diarization

### AI Layer
- **Intent Recognition**: LLM-based understanding of user goals
- **Surface Generation**: Templated configurations with dynamic customization
- **Ambient Monitoring**: Continuous analysis of collaboration patterns
- **Artifact Synthesis**: Summarization, decision capture, action item extraction

### Integration Layer
- **Unified Data Model**: Normalized view of data across systems
- **Bidirectional Connectors**: Read/write to Jira, Confluence, Atlas, Figma, Slack
- **Event System**: Real-time updates from connected systems

### Agent Framework
- **Agent Registry**: Available agents and their capabilities
- **Agent Orchestration**: Which agents are active and when
- **Agent Communication**: Agents can suggest actions to users and each other

---

## Design Principles

1. **Intent-First**: Never ask "what tool?" Ask "what outcome?"
2. **Progressive Disclosure**: Start simple, complexity emerges as needed
3. **Ambient, Not Intrusive**: AI suggests, humans decide
4. **Connected, Not Siloed**: Everything is linked, nothing is isolated
5. **Temporal Fluidity**: The workspace adapts to the phase of work
6. **Human-AI Collaboration**: Agents augment, not replace, human collaboration

---

## The Prompt

Below is a comprehensive prompt you can give to an AI coding assistant to build this vision.

