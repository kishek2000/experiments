export type SurfaceType =
  | "decision"
  | "onboarding"
  | "brainstorm"
  | "workspace"
  | "retrospective"
  | "incident"
  | "launch"
  | "handoff"
  | "documentation";

export type LayoutType =
  | "stack" // Vertical stack of blocks
  | "columns" // Side-by-side columns
  | "tabs" // Tabbed interface
  | "dashboard" // Grid of widgets
  | "split" // Split pane (left/right or top/bottom)
  | "timeline"; // Timeline-based layout

export type BlockType =
  | "header"
  | "editor"
  | "divider"
  | "voting"
  | "canvas"
  | "progress"
  | "context-cards"
  | "chat"
  | "ai-summary"
  | "ai-interpretation"
  | "retro-columns"
  | "status-tracker"
  | "runbook"
  | "timeline"
  | "checklist"
  | "stakeholder-map"
  | "metrics-panel"
  | "communication-log"
  | "expertise-map"
  | "documentation-tree"
  | "handoff-checklist"
  | "tabs-container"
  | "kanban"
  | "doc-outline"
  | "rich-editor"
  | "diagram-canvas"
  | "spec-table"
  | "mermaid-diagram"
  | "version-history"
  | "related-docs"
  | "doc-metadata"
  | "slides"
  | "team-roster"
  | "key-links"
  | "jira-tickets";

export interface Block {
  type: BlockType;
  content?: string;
  label?: string;
  placeholder?: string;
  options?: string[];
  items?: string[];
  sources?: string[];
  columns?: Column[];
  tabs?: TabConfig[];
  statuses?: StatusItem[];
  metrics?: MetricItem[];
  people?: Person[];
  documents?: DocumentItem[];
  width?: "full" | "half" | "third" | "two-thirds";
}

export interface Column {
  id: string;
  title: string;
  emoji?: string;
  color?: string;
  items: string[];
}

export interface TabConfig {
  id: string;
  label: string;
  blocks: Block[];
}

export interface StatusItem {
  id: string;
  label: string;
  status: "pending" | "in-progress" | "done" | "blocked";
  assignee?: string;
  timestamp?: string;
}

export interface MetricItem {
  label: string;
  value: string;
  trend?: "up" | "down" | "stable";
  status?: "success" | "warning" | "danger" | "info";
}

export interface Person {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  expertise?: string[];
  status?: "available" | "busy" | "away";
}

export interface DocumentItem {
  id: string;
  title: string;
  type: "page" | "diagram" | "spec" | "runbook" | "adr";
  status: "complete" | "in-progress" | "missing" | "needs-update";
  owner?: string;
  lastUpdated?: string;
}

export type AgentType =
  | "facilitator"
  | "scribe"
  | "guide"
  | "connector"
  | "synthesizer"
  | "assistant"
  | "incident-commander"
  | "launch-coordinator"
  | "knowledge-curator";

export type SystemType =
  | "jira"
  | "confluence"
  | "atlas"
  | "figma"
  | "slack"
  | "miro"
  | "opsgenie"
  | "statuspage"
  | "bitbucket"
  | "trello"
  | "loom";

export interface SurfaceConfig {
  type: SurfaceType;
  title: string;
  intent: string;
  layout: LayoutType;
  blocks: Block[];
  agents: AgentType[];
  connectedSystems: SystemType[];
}

export interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  color: string;
  cursor?: { x: number; y: number };
}
