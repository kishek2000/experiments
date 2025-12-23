import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { IntentPrompt } from "./components/IntentPrompt";
import { GenerativeSurface } from "./components/GenerativeSurface";
import type { SurfaceConfig } from "./types";
import "./App.css";

function App() {
  const [surface, setSurface] = useState<SurfaceConfig | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleIntentSubmit = async (intent: string) => {
    setIsGenerating(true);

    // Simulate AI processing and surface generation
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // Generate surface based on intent
    const generatedSurface = generateSurfaceFromIntent(intent);
    setSurface(generatedSurface);
    setIsGenerating(false);
  };

  const handleReset = () => {
    setSurface(null);
  };

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {!surface ? (
          <IntentPrompt
            key="prompt"
            onSubmit={handleIntentSubmit}
            isGenerating={isGenerating}
          />
        ) : (
          <GenerativeSurface
            key="surface"
            config={surface}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Mock AI surface generation - in reality this would be an LLM call
function generateSurfaceFromIntent(intent: string): SurfaceConfig {
  const lowerIntent = intent.toLowerCase();

  // RETROSPECTIVE FLOW
  if (
    lowerIntent.includes("retro") ||
    lowerIntent.includes("retrospective") ||
    lowerIntent.includes("went well") ||
    lowerIntent.includes("improve")
  ) {
    return {
      type: "retrospective",
      title: "Team Retrospective",
      intent,
      layout: "columns",
      blocks: [
        {
          type: "retro-columns",
          columns: [
            {
              id: "good",
              title: "What went well",
              emoji: "🎉",
              color: "#4BCE97",
              items: [],
            },
            {
              id: "improve",
              title: "What to improve",
              emoji: "🔧",
              color: "#F5CD47",
              items: [],
            },
            {
              id: "actions",
              title: "Action items",
              emoji: "🎯",
              color: "#579DFF",
              items: [],
            },
          ],
        },
        { type: "divider" },
        {
          type: "timeline",
          label: "Sprint Timeline",
          items: [
            "Sprint Planning",
            "Mid-Sprint Check-in",
            "Sprint Review",
            "This Retro",
          ],
        },
        { type: "divider" },
        {
          type: "metrics-panel",
          metrics: [
            {
              label: "Sprint Velocity",
              value: "34 points",
              trend: "up",
              status: "success",
            },
            {
              label: "Bugs Found",
              value: "7",
              trend: "down",
              status: "success",
            },
            {
              label: "Team Happiness",
              value: "4.2/5",
              trend: "stable",
              status: "info",
            },
            {
              label: "Cycle Time",
              value: "3.2 days",
              trend: "down",
              status: "success",
            },
          ],
        },
        {
          type: "ai-summary",
          placeholder: "AI will synthesize themes from your discussion...",
        },
      ],
      agents: ["facilitator", "synthesizer", "scribe"],
      connectedSystems: ["jira", "confluence", "slack"],
    };
  }

  // INCIDENT RESPONSE FLOW
  if (
    lowerIntent.includes("incident") ||
    lowerIntent.includes("outage") ||
    lowerIntent.includes("p1") ||
    lowerIntent.includes("p2") ||
    lowerIntent.includes("sev1") ||
    lowerIntent.includes("production issue")
  ) {
    return {
      type: "incident",
      title: "Incident Response",
      intent,
      layout: "dashboard",
      blocks: [
        {
          type: "status-tracker",
          width: "two-thirds",
          statuses: [
            {
              id: "1",
              label: "Incident Detected",
              status: "done",
              timestamp: "10:23 AM",
            },
            {
              id: "2",
              label: "Team Assembled",
              status: "done",
              timestamp: "10:28 AM",
            },
            {
              id: "3",
              label: "Root Cause Identified",
              status: "in-progress",
              assignee: "Alex",
            },
            { id: "4", label: "Fix Deployed", status: "pending" },
            { id: "5", label: "Monitoring & Verification", status: "pending" },
            { id: "6", label: "Post-Mortem Scheduled", status: "pending" },
          ],
        },
        {
          type: "metrics-panel",
          width: "third",
          metrics: [
            { label: "Severity", value: "SEV-1", status: "danger" },
            { label: "Duration", value: "47 min", status: "warning" },
            { label: "Affected Users", value: "~12,000", status: "danger" },
            { label: "Services Down", value: "3", status: "warning" },
          ],
        },
        {
          type: "communication-log",
          width: "half",
          label: "Communication Log",
        },
        {
          type: "runbook",
          width: "half",
          label: "Incident Runbook",
          items: [
            "Check service health dashboards",
            "Review recent deployments",
            "Check database connections",
            "Review error logs",
            "Escalate to on-call if needed",
          ],
        },
        {
          type: "editor",
          width: "full",
          content: "## Live Notes\n\nDocument findings and actions here...",
        },
      ],
      agents: ["incident-commander", "scribe"],
      connectedSystems: [
        "opsgenie",
        "statuspage",
        "slack",
        "jira",
        "bitbucket",
      ],
    };
  }

  // PRODUCT LAUNCH FLOW
  if (
    lowerIntent.includes("launch") ||
    lowerIntent.includes("release") ||
    lowerIntent.includes("ship") ||
    lowerIntent.includes("go live") ||
    lowerIntent.includes("rollout")
  ) {
    return {
      type: "launch",
      title: "Product Launch",
      intent,
      layout: "tabs",
      blocks: [
        {
          type: "tabs-container",
          tabs: [
            {
              id: "overview",
              label: "Overview",
              blocks: [
                {
                  type: "metrics-panel",
                  metrics: [
                    { label: "Launch Date", value: "Dec 15", status: "info" },
                    { label: "Readiness", value: "78%", status: "warning" },
                    { label: "Open Blockers", value: "2", status: "danger" },
                    { label: "Team Members", value: "12", status: "info" },
                  ],
                },
                {
                  type: "checklist",
                  label: "Launch Checklist",
                  items: [
                    "Feature code complete",
                    "QA sign-off",
                    "Security review",
                    "Performance testing",
                    "Documentation ready",
                    "Marketing assets approved",
                    "Support team briefed",
                    "Rollback plan tested",
                  ],
                },
              ],
            },
            {
              id: "stakeholders",
              label: "Stakeholders",
              blocks: [
                {
                  type: "stakeholder-map",
                  people: [
                    {
                      id: "1",
                      name: "Sarah Chen",
                      role: "Product Owner",
                      expertise: ["product", "strategy"],
                      status: "available",
                    },
                    {
                      id: "2",
                      name: "Mike Johnson",
                      role: "Tech Lead",
                      expertise: ["backend", "architecture"],
                      status: "busy",
                    },
                    {
                      id: "3",
                      name: "Emma Williams",
                      role: "Design Lead",
                      expertise: ["UX", "research"],
                      status: "available",
                    },
                    {
                      id: "4",
                      name: "James Brown",
                      role: "QA Lead",
                      expertise: ["testing", "automation"],
                      status: "away",
                    },
                    {
                      id: "5",
                      name: "Lisa Park",
                      role: "Marketing",
                      expertise: ["comms", "content"],
                      status: "available",
                    },
                  ],
                },
                {
                  type: "communication-log",
                  label: "Stakeholder Updates",
                },
              ],
            },
            {
              id: "rollout",
              label: "Rollout Plan",
              blocks: [
                {
                  type: "timeline",
                  label: "Rollout Phases",
                  items: [
                    "Internal dogfood (5%)",
                    "Beta users (15%)",
                    "Early adopters (30%)",
                    "General availability (100%)",
                  ],
                },
                {
                  type: "kanban",
                  columns: [
                    {
                      id: "todo",
                      title: "To Do",
                      color: "#626F86",
                      items: ["Update changelog", "Prepare demo"],
                    },
                    {
                      id: "in-progress",
                      title: "In Progress",
                      color: "#579DFF",
                      items: ["Feature flags setup", "Load testing"],
                    },
                    {
                      id: "done",
                      title: "Done",
                      color: "#4BCE97",
                      items: ["API documentation", "Integration tests"],
                    },
                  ],
                },
              ],
            },
            {
              id: "risks",
              label: "Risks & Mitigations",
              blocks: [
                {
                  type: "editor",
                  content:
                    "## Known Risks\n\n1. Database migration timing\n2. Third-party API rate limits\n3. Mobile app store approval delay",
                },
                {
                  type: "ai-summary",
                  placeholder:
                    "AI is analyzing risks from similar past launches...",
                },
              ],
            },
          ],
        },
      ],
      agents: ["launch-coordinator", "scribe", "connector"],
      connectedSystems: [
        "jira",
        "confluence",
        "atlas",
        "slack",
        "trello",
        "loom",
      ],
    };
  }

  // KNOWLEDGE TRANSFER / HANDOFF FLOW
  if (
    lowerIntent.includes("handoff") ||
    lowerIntent.includes("hand off") ||
    lowerIntent.includes("transfer") ||
    lowerIntent.includes("leaving") ||
    lowerIntent.includes("transition") ||
    lowerIntent.includes("takeover")
  ) {
    return {
      type: "handoff",
      title: "Knowledge Transfer",
      intent,
      layout: "split",
      blocks: [
        {
          type: "header",
          content: "Knowledge Transfer Dashboard",
        },
        {
          type: "expertise-map",
          width: "half",
          label: "Expertise Areas",
          people: [
            {
              id: "1",
              name: "Departing: Alex",
              role: "Senior Engineer",
              expertise: [
                "Auth system",
                "Payment integration",
                "CI/CD pipeline",
                "Database optimization",
              ],
              status: "away",
            },
            {
              id: "2",
              name: "Receiving: Jordan",
              role: "Engineer",
              expertise: ["Frontend", "Testing"],
              status: "available",
            },
          ],
        },
        {
          type: "documentation-tree",
          width: "half",
          label: "Documentation Status",
          documents: [
            {
              id: "1",
              title: "System Architecture Overview",
              type: "diagram",
              status: "complete",
              lastUpdated: "2 days ago",
            },
            {
              id: "2",
              title: "Auth Service Runbook",
              type: "runbook",
              status: "complete",
              lastUpdated: "1 week ago",
            },
            {
              id: "3",
              title: "Payment Integration Guide",
              type: "spec",
              status: "in-progress",
              owner: "Alex",
            },
            {
              id: "4",
              title: "Database Schema Decisions",
              type: "adr",
              status: "needs-update",
              lastUpdated: "3 months ago",
            },
            {
              id: "5",
              title: "Deployment Procedures",
              type: "runbook",
              status: "missing",
            },
            {
              id: "6",
              title: "Incident Response Playbook",
              type: "runbook",
              status: "complete",
              lastUpdated: "1 month ago",
            },
          ],
        },
        { type: "divider" },
        {
          type: "handoff-checklist",
          label: "Handoff Progress",
          items: [
            "Architecture walkthrough session",
            "Code review pairing sessions (3x)",
            "Access permissions transferred",
            "On-call rotation updated",
            "Stakeholder introductions",
            "Shadow on-call shift",
            "Solo on-call shift with backup",
          ],
        },
        {
          type: "chat",
          placeholder: "Ask questions about any system or process...",
        },
      ],
      agents: ["knowledge-curator", "guide", "connector"],
      connectedSystems: ["confluence", "jira", "bitbucket", "slack", "loom"],
    };
  }

  // DOCUMENTATION FLOW
  if (
    lowerIntent.includes("document") ||
    lowerIntent.includes("write up") ||
    lowerIntent.includes("spec") ||
    lowerIntent.includes("architecture") ||
    lowerIntent.includes("summarize") ||
    lowerIntent.includes("summarise") ||
    lowerIntent.includes("adr") ||
    lowerIntent.includes("rfc")
  ) {
    return {
      type: "documentation",
      title: extractDocTitle(intent) || "Documentation",
      intent,
      layout: "stack",
      blocks: [
        {
          type: "doc-metadata",
          content: "Draft",
        },
        {
          type: "tabs-container",
          tabs: [
            {
              id: "write",
              label: "Write",
              blocks: [
                {
                  type: "rich-editor",
                  content: "## API Rate Limiting Architecture\n\n### Overview\nThis document outlines the design for implementing rate limiting across our public API endpoints.\n\n### Background & Context\nOur API currently handles 50K requests/minute. Recent traffic spikes have caused cascading failures. We need a robust rate limiting solution before the Q2 launch.\n\n### Problem Statement\nWithout rate limiting, a single misbehaving client can degrade service for all users. We've seen 3 incidents in the past month where API abuse caused P2 outages.\n\n### Proposed Solution\nImplement a token bucket algorithm at the API gateway level, with per-client quotas stored in Redis.",
                },
              ],
            },
            {
              id: "diagrams",
              label: "Diagrams",
              blocks: [
                {
                  type: "diagram-canvas",
                  label: "Visual Diagrams",
                },
              ],
            },
            {
              id: "specs",
              label: "Specs & Tables",
              blocks: [
                {
                  type: "spec-table",
                  label: "Technical Specifications",
                  columns: [
                    { id: "property", title: "Property", color: "#0052CC", items: ["Latency Target", "Throughput", "Availability", "Data Retention"] },
                    { id: "requirement", title: "Requirement", color: "#00875A", items: ["< 100ms p99", "10K req/sec", "99.9%", "90 days"] },
                    { id: "current", title: "Current", color: "#6554C0", items: ["250ms p99", "5K req/sec", "99.5%", "30 days"] },
                  ],
                },
              ],
            },
            {
              id: "history",
              label: "History",
              blocks: [
                {
                  type: "version-history",
                  label: "Document History",
                },
              ],
            },
          ],
        },
        { type: "divider" },
        {
          type: "related-docs",
          label: "Related Documents",
          sources: ["confluence", "jira"],
        },
        {
          type: "ai-summary",
          placeholder: "AI is ready to help structure your document, suggest sections, or summarize content...",
        },
      ],
      agents: ["scribe", "synthesizer", "connector"],
      connectedSystems: ["confluence", "jira", "figma", "bitbucket", "loom"],
    };
  }

  // DECISION FLOW
  if (
    lowerIntent.includes("decision") ||
    lowerIntent.includes("decide") ||
    lowerIntent.includes("choose")
  ) {
    return {
      type: "decision",
      title: extractTitle(intent) || "Team Decision",
      intent,
      layout: "stack",
      blocks: [
        {
          type: "ai-interpretation",
          content: "I've set up a decision-making space. Add context below, then vote as a team. I'll capture the discussion and document the decision in Atlas when you're done.",
        },
        {
          type: "rich-editor",
          content: "## What We're Deciding\n\nWhich authentication provider should we use for the new mobile app?\n\n## Context\n- Need to support both iOS and Android\n- Must integrate with existing user database\n- Timeline: Launch in Q2\n\n## Constraints\n- Budget: $50k/year max\n- Must support 2FA\n- GDPR compliant",
        },
        { type: "divider" },
        {
          type: "voting",
          label: "Options Under Consideration",
          options: [
            "Auth0 — Industry standard, higher cost",
            "Firebase Auth — Good mobile support, Google ecosystem",
            "Custom solution — Full control, more dev time",
          ],
        },
        { type: "divider" },
        {
          type: "canvas",
          label: "Whiteboard — sketch architecture, compare pros/cons",
        },
        { type: "divider" },
        {
          type: "ai-summary",
          placeholder: "Once voting is complete, I'll summarize the decision rationale and create an ADR...",
        },
      ],
      agents: ["facilitator", "scribe"],
      connectedSystems: ["jira", "figma", "atlas"],
    };
  }

  // ONBOARDING FLOW
  if (
    lowerIntent.includes("onboard") ||
    lowerIntent.includes("new to") ||
    lowerIntent.includes("understand") ||
    lowerIntent.includes("context")
  ) {
    return {
      type: "onboarding",
      title: "Welcome to Project Phoenix",
      intent,
      layout: "stack",
      blocks: [
        {
          type: "slides",
          label: "Your Personalized Onboarding Deck",
        },
        {
          type: "progress",
          label: "Onboarding Progress",
          items: [
            "✅ Environment setup",
            "✅ Access granted",
            "🔄 Meet the team",
            "📋 First tasks",
            "📚 Deep dives",
          ],
        },
        {
          type: "team-roster",
          label: "Your Team",
        },
        {
          type: "jira-tickets",
          label: "Recommended First Issues",
        },
        {
          type: "key-links",
          label: "Bookmarked Resources",
        },
        {
          type: "chat",
          placeholder: "Ask me anything about Project Phoenix - architecture, team norms, where to find things...",
        },
      ],
      agents: ["guide", "connector"],
      connectedSystems: ["jira", "confluence", "atlas", "slack", "figma", "bitbucket"],
    };
  }

  // BRAINSTORM FLOW
  if (
    lowerIntent.includes("brainstorm") ||
    lowerIntent.includes("ideate") ||
    lowerIntent.includes("explore")
  ) {
    return {
      type: "brainstorm",
      title: "Brainstorming: Performance Optimization",
      intent,
      layout: "stack",
      blocks: [
        {
          type: "ai-interpretation",
          content: "I've set up a collaborative space for your team to explore performance optimization ideas. The canvas below is real-time—invite teammates to add sticky notes and draw connections.",
        },
        {
          type: "canvas",
          label: "Idea Canvas — add sticky notes, sketch, connect thoughts",
        },
        { type: "divider" },
        {
          type: "ai-summary",
          placeholder: "AI will identify themes as you brainstorm...",
        },
      ],
      agents: ["facilitator", "synthesizer"],
      connectedSystems: ["miro", "figma"],
    };
  }

  // Default: flexible workspace
  return {
    type: "workspace",
    title: "Adaptive Workspace",
    intent,
    layout: "stack",
    blocks: [
      { type: "header", content: "Your Intent" },
      { type: "ai-interpretation", content: intent },
      { type: "divider" },
      { type: "header", content: "Workspace" },
      { type: "editor", content: "Start documenting..." },
      { type: "canvas", label: "Visual workspace" },
    ],
    agents: ["assistant"],
    connectedSystems: ["jira", "confluence"],
  };
}

function extractTitle(intent: string): string | null {
  // Simple extraction - in reality would use NLP
  const patterns = [
    /decide (?:on |about )?(.+)/i,
    /decision (?:on |about |for )?(.+)/i,
    /choose (?:between |from )?(.+)/i,
  ];

  for (const pattern of patterns) {
    const match = intent.match(pattern);
    if (match) {
      return match[1].slice(0, 50);
    }
  }

  return null;
}

function extractDocTitle(intent: string): string | null {
  const patterns = [
    /document(?:ing|ation)? (?:for |about |on )?(.+)/i,
    /write (?:up |about |a )?(.+)/i,
    /spec(?:ification)? (?:for |about )?(.+)/i,
    /summarize (?:the )?(.+)/i,
    /summarise (?:the )?(.+)/i,
    /adr (?:for |about )?(.+)/i,
    /rfc (?:for |about )?(.+)/i,
    /architecture (?:for |of |about )?(.+)/i,
  ];

  for (const pattern of patterns) {
    const match = intent.match(pattern);
    if (match) {
      return match[1].slice(0, 60);
    }
  }

  return null;
}

export default App;
