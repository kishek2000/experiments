# Generative

A prototype exploring the future of Confluence and collaborative software—where users express intent and AI generates the right workspace.

![Atlassian Design System](https://img.shields.io/badge/Design-Atlassian-0052CC)
![React](https://img.shields.io/badge/React-18-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)

## Quick Start

```bash
cd generative
yarn install --ignore-engines
yarn dev
```

Open http://localhost:5173

## Deploy to Cloudflare Pages

### Option 1: Direct Deploy (Easiest)

```bash
# Build the app
yarn build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=generative
```

### Option 2: Connect to Git (Recommended)

1. Push to GitHub/GitLab
2. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
3. Click "Create a project" → "Connect to Git"
4. Select your repository
5. Configure:
   - **Build command:** `yarn build`
   - **Build output directory:** `dist`
   - **Node version:** `18` (in Environment Variables: `NODE_VERSION=18`)
6. Deploy!

## Available Flows

### 1. Decision Making
**Try:** "I need to decide with my team which design to use"

### 2. Onboarding  
**Try:** "I'm new to this project and want to understand the context"

### 3. Brainstorming
**Try:** "Let's brainstorm solutions for our performance issues"

### 4. Retrospective
**Try:** "Run a retrospective for our last sprint"
- Collaborative whiteboard with sticky notes
- Live cursors from teammates
- Sprint metrics

### 5. Incident Response
**Try:** "We have a P1 incident - help coordinate the response"
- Dashboard layout with status tracker
- Runbook checklist
- Communication log

### 6. Product Launch
**Try:** "Coordinate the launch of our new payments feature"
- Tabbed interface
- Stakeholder map
- Kanban board

### 7. Knowledge Transfer
**Try:** "I'm leaving the team and need to hand off my knowledge"
- Expertise mapping
- Documentation status
- Handoff checklist

### 8. Documentation ✨ NEW
**Try:** "Help me document our architecture decisions"
- Document outline sidebar
- Rich text editor with AI assist
- Diagram canvas with live collaboration
- Spec tables
- Mermaid flowcharts
- Version history
- Related documents

## Features

- **Light & Dark Theme** - Toggle in header, follows Atlassian design
- **Collaborative Cursors** - Fake real-time presence on whiteboards
- **AI Agents** - Contextual assistants for each workspace type
- **Connected Systems** - Mock integrations with Jira, Confluence, Atlas, etc.
- **Pragmatic Drag & Drop** - Using Atlaskit's DnD library

## Tech Stack

- React 18 + TypeScript
- Vite
- Framer Motion
- Atlaskit components & design tokens
- Lucide Icons
- CSS Modules

## Project Structure

```
src/
├── components/
│   ├── IntentPrompt.tsx      # Landing page with intent input
│   ├── GenerativeSurface.tsx # Main workspace container
│   ├── SurfaceBlock.tsx      # All block type renderers
│   ├── AgentPanel.tsx        # AI agents sidebar
│   ├── CollaborativeWhiteboard.tsx
│   └── ThemeToggle.tsx
├── types.ts                  # TypeScript definitions
├── App.tsx                   # Intent → Surface routing
└── index.css                 # Atlassian design tokens
```
