import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Bot,
  UserCircle,
  Compass,
  Link2,
  Sparkles,
  PenTool,
  ChevronDown,
  Play,
  Pause,
  AlertTriangle,
  Rocket,
  BookOpen,
  Zap,
  MessageCircle,
} from "lucide-react";
import type { AgentType, SurfaceType } from "../types";
import styles from "./AgentPanel.module.css";

interface AgentPanelProps {
  agents: AgentType[];
  surfaceType: SurfaceType;
  onClose: () => void;
}

const agentInfo: Record<
  AgentType,
  {
    name: string;
    description: string;
    icon: typeof Bot;
    color: string;
    gradient: string;
    capabilities: string[];
  }
> = {
  facilitator: {
    name: "Facilitator",
    description: "Guides discussions and ensures balanced participation",
    icon: UserCircle,
    color: "#0052CC",
    gradient: "linear-gradient(135deg, #0052CC 0%, #0747A6 100%)",
    capabilities: [
      "Time management",
      "Discussion guidance", 
      "Consensus building",
    ],
  },
  scribe: {
    name: "Scribe",
    description: "Captures decisions, actions, and key insights",
    icon: PenTool,
    color: "#00875A",
    gradient: "linear-gradient(135deg, #00875A 0%, #006644 100%)",
    capabilities: [
      "Decision logging",
      "Action item tracking",
      "Meeting summaries",
    ],
  },
  guide: {
    name: "Guide",
    description: "Helps you navigate and understand the project",
    icon: Compass,
    color: "#FF8B00",
    gradient: "linear-gradient(135deg, #FF8B00 0%, #FF5630 100%)",
    capabilities: [
      "Context provision",
      "Resource suggestions",
      "Q&A assistance",
    ],
  },
  connector: {
    name: "Connector",
    description: "Links you with relevant people and information",
    icon: Link2,
    color: "#6554C0",
    gradient: "linear-gradient(135deg, #6554C0 0%, #5243AA 100%)",
    capabilities: [
      "Expert finding",
      "Doc discovery",
      "Relationship mapping",
    ],
  },
  synthesizer: {
    name: "Synthesizer",
    description: "Identifies patterns and generates insights",
    icon: Sparkles,
    color: "#00B8D9",
    gradient: "linear-gradient(135deg, #00B8D9 0%, #0065FF 100%)",
    capabilities: [
      "Theme extraction",
      "Summary generation",
      "Pattern recognition",
    ],
  },
  assistant: {
    name: "Assistant",
    description: "General-purpose help for your workspace",
    icon: Bot,
    color: "#626F86",
    gradient: "linear-gradient(135deg, #626F86 0%, #44546F 100%)",
    capabilities: [
      "Task assistance",
      "Quick answers",
      "Suggestions",
    ],
  },
  "incident-commander": {
    name: "Commander",
    description: "Coordinates incident response and recovery",
    icon: AlertTriangle,
    color: "#FF5630",
    gradient: "linear-gradient(135deg, #FF5630 0%, #DE350B 100%)",
    capabilities: [
      "Response coordination",
      "Timeline tracking",
      "Escalation management",
    ],
  },
  "launch-coordinator": {
    name: "Coordinator",
    description: "Orchestrates launches and go-live activities",
    icon: Rocket,
    color: "#0052CC",
    gradient: "linear-gradient(135deg, #0052CC 0%, #6554C0 100%)",
    capabilities: [
      "Readiness tracking",
      "Stakeholder sync",
      "Risk monitoring",
    ],
  },
  "knowledge-curator": {
    name: "Curator",
    description: "Manages knowledge transfer and documentation",
    icon: BookOpen,
    color: "#6554C0",
    gradient: "linear-gradient(135deg, #6554C0 0%, #403294 100%)",
    capabilities: [
      "Gap identification",
      "Knowledge mapping",
      "Handoff tracking",
    ],
  },
};

export function AgentPanel({ agents, surfaceType, onClose }: AgentPanelProps) {
  const [expandedAgent, setExpandedAgent] = useState<AgentType | null>(
    agents[0] || null
  );
  const [activeAgents, setActiveAgents] = useState<Set<AgentType>>(
    new Set(agents)
  );

  const toggleAgent = (agent: AgentType) => {
    setActiveAgents((prev) => {
      const next = new Set(prev);
      if (next.has(agent)) {
        next.delete(agent);
      } else {
        next.add(agent);
      }
      return next;
    });
  };

  const activities = getActivitiesForSurface(surfaceType);

  return (
    <motion.div
      className={styles.panel}
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
    >
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <Zap size={16} />
          </div>
          <div>
            <h2 className={styles.headerTitle}>AI Agents</h2>
            <p className={styles.headerSubtitle}>
              {activeAgents.size} active for this workspace
            </p>
          </div>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className={styles.content}>
        {/* Agent Cards */}
        <div className={styles.agentList}>
          {agents.map((agentType) => {
            const agent = agentInfo[agentType];
            if (!agent) return null;
            const isExpanded = expandedAgent === agentType;
            const isActive = activeAgents.has(agentType);

            return (
              <motion.div
                key={agentType}
                className={styles.agentCard}
                layout
              >
                <button
                  className={styles.agentHeader}
                  onClick={() => setExpandedAgent(isExpanded ? null : agentType)}
                >
                  <div 
                    className={styles.agentIcon}
                    style={{ background: agent.gradient }}
                  >
                    <agent.icon size={18} color="white" />
                  </div>
                  <div className={styles.agentInfo}>
                    <div className={styles.agentNameRow}>
                      <span className={styles.agentName}>{agent.name}</span>
                      {isActive && (
                        <span className={styles.activeBadge}>
                          <span className={styles.activeDot} />
                          Active
                        </span>
                      )}
                    </div>
                    <span className={styles.agentDesc}>{agent.description}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`${styles.chevron} ${isExpanded ? styles.rotated : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      className={styles.agentDetails}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={styles.capabilities}>
                        {agent.capabilities.map((cap, idx) => (
                          <span key={idx} className={styles.capabilityTag}>
                            {cap}
                          </span>
                        ))}
                      </div>

                      <button
                        className={`${styles.toggleButton} ${isActive ? styles.activeToggle : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAgent(agentType);
                        }}
                      >
                        {isActive ? (
                          <>
                            <Pause size={14} />
                            Pause Agent
                          </>
                        ) : (
                          <>
                            <Play size={14} />
                            Activate
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Activity Feed */}
        <div className={styles.activitySection}>
          <div className={styles.activityHeader}>
            <MessageCircle size={14} />
            <span>Recent Activity</span>
          </div>
          <div className={styles.activityList}>
            {activities.map((activity, idx) => (
              <motion.div
                key={idx}
                className={styles.activityItem}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={styles.activityDot} />
                <div className={styles.activityContent}>
                  <p className={styles.activityText}>{activity.text}</p>
                  <span className={styles.activityTime}>{activity.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <button className={styles.quickAction}>
            <Sparkles size={14} />
            Summarize workspace
          </button>
          <button className={styles.quickAction}>
            <PenTool size={14} />
            Generate action items
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function getActivitiesForSurface(type: SurfaceType) {
  const activities: Record<SurfaceType, { text: string; time: string }[]> = {
    decision: [
      { text: "Noticed consensus forming on Option B", time: "Just now" },
      { text: "Captured 3 key discussion points", time: "2m ago" },
      { text: "Identified 2 action items from discussion", time: "5m ago" },
    ],
    onboarding: [
      { text: "Generated personalized slide deck", time: "Just now" },
      { text: "Found 8 relevant documents for you", time: "1m ago" },
      { text: "Identified 3 key people to connect with", time: "2m ago" },
    ],
    brainstorm: [
      { text: "Identified 4 emerging themes from ideas", time: "Just now" },
      { text: "Suggested grouping related sticky notes", time: "3m ago" },
      { text: "Connected 2 ideas to existing initiatives", time: "5m ago" },
    ],
    workspace: [
      { text: "Ready to help with your workspace", time: "Just now" },
    ],
    retrospective: [
      { text: "Grouped similar feedback items", time: "Just now" },
      { text: "Tracking time for each section", time: "1m ago" },
      { text: "Ready to generate action items", time: "2m ago" },
    ],
    incident: [
      { text: "Updated incident timeline", time: "Just now" },
      { text: "Drafted status page update", time: "30s ago" },
      { text: "Identified similar past incidents", time: "2m ago" },
    ],
    launch: [
      { text: "2 checklist items at risk - notified owners", time: "Just now" },
      { text: "Updated stakeholder summary", time: "5m ago" },
      { text: "Identified potential launch blockers", time: "10m ago" },
    ],
    handoff: [
      { text: "Identified 2 documentation gaps", time: "Just now" },
      { text: "Mapped expertise areas to team members", time: "1m ago" },
      { text: "Generated handoff checklist", time: "3m ago" },
    ],
    documentation: [
      { text: "Auto-formatted document structure", time: "Just now" },
      { text: "Found 3 related documents to link", time: "1m ago" },
      { text: "Suggested additional sections", time: "2m ago" },
    ],
  };

  return activities[type] || activities.workspace;
}
