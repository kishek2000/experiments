import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Bot,
  Plug,
  Mic,
  MicOff,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Sparkles,
  Layout,
} from "lucide-react";
import type { SurfaceConfig, Collaborator, LayoutType } from "../types";
import { SurfaceBlock } from "./SurfaceBlock";
import { AgentPanel } from "./AgentPanel";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./GenerativeSurface.module.css";

interface GenerativeSurfaceProps {
  config: SurfaceConfig;
  onReset: () => void;
}

// Mock collaborators for demo
const mockCollaborators: Collaborator[] = [
  { id: "1", name: "You", avatar: "Y", color: "#579DFF" },
  { id: "2", name: "Alex", avatar: "A", color: "#4BCE97" },
  { id: "3", name: "Sam", avatar: "S", color: "#9F8FEF" },
];

export function GenerativeSurface({ config, onReset }: GenerativeSurfaceProps) {
  const [isMicOn, setIsMicOn] = useState(false);
  const [showAgentPanel, setShowAgentPanel] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const getLayoutClass = (layout: LayoutType) => {
    switch (layout) {
      case "columns":
        return styles.columnsLayout;
      case "dashboard":
        return styles.dashboardLayout;
      case "split":
        return styles.splitLayout;
      case "tabs":
        return styles.tabsLayout;
      case "timeline":
        return styles.timelineLayout;
      default:
        return styles.stackLayout;
    }
  };

  const getSurfaceTypeColor = (type: string) => {
    switch (type) {
      case "decision":
        return "var(--ds-background-discovery-bold)";
      case "onboarding":
        return "var(--ds-background-success-bold)";
      case "brainstorm":
        return "var(--ds-background-warning-bold)";
      case "retrospective":
        return "var(--ds-background-information-bold)";
      case "incident":
        return "var(--ds-background-danger-bold)";
      case "launch":
        return "var(--ds-background-brand-bold)";
      case "handoff":
        return "var(--ds-background-discovery-bold)";
      default:
        return "var(--ds-background-neutral)";
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={onReset}>
            <ArrowLeft size={16} />
          </button>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{config.title}</h1>
            <span
              className={styles.surfaceType}
              style={{ backgroundColor: getSurfaceTypeColor(config.type) }}
            >
              {config.type}
            </span>
            <span className={styles.layoutBadge}>
              <Layout size={12} />
              {config.layout}
            </span>
          </div>
        </div>

        <div className={styles.headerCenter}>
          <div className={styles.collaborators}>
            {mockCollaborators.map((collab, index) => (
              <motion.div
                key={collab.id}
                className={styles.avatar}
                style={{
                  backgroundColor: collab.color,
                  zIndex: mockCollaborators.length - index,
                }}
                initial={{ scale: 0, x: 20 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ delay: index * 0.1, type: "spring" }}
              >
                {collab.avatar}
              </motion.div>
            ))}
            <button className={styles.inviteButton}>
              <Users size={14} />
              <span>Invite</span>
            </button>
          </div>
        </div>

        <div className={styles.headerRight}>
          <button
            className={`${styles.iconButton} ${isMicOn ? styles.active : ""}`}
            onClick={() => setIsMicOn(!isMicOn)}
          >
            {isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
          </button>
          <button className={styles.iconButton}>
            <MessageSquare size={16} />
          </button>
          <button className={styles.iconButton}>
            <Share2 size={16} />
          </button>
          <ThemeToggle />
          <button className={styles.iconButton}>
            <MoreHorizontal size={16} />
          </button>
        </div>
      </header>

      {/* Main content area */}
      <div className={styles.main}>
        {/* Surface content */}
        <motion.div
          className={styles.surface}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Intent interpretation */}
          <motion.div
            className={styles.intentBanner}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={14} className={styles.intentIcon} />
            <span className={styles.intentText}>
              <strong>Your intent:</strong> {config.intent}
            </span>
            <button className={styles.refineButton}>Refine workspace</button>
          </motion.div>

          {/* Connected systems indicator */}
          <motion.div
            className={styles.connectedSystems}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Plug size={12} />
            <span>Connected:</span>
            {config.connectedSystems.map((system) => (
              <span key={system} className={styles.systemBadge}>
                {system}
              </span>
            ))}
          </motion.div>

          {/* Blocks with layout */}
          <div className={`${styles.blocks} ${getLayoutClass(config.layout)}`}>
            {config.blocks.map((block, index) => (
              <SurfaceBlock
                key={index}
                block={block}
                index={index}
                layout={config.layout}
              />
            ))}
          </div>
        </motion.div>

        {/* Agent panel */}
        {showAgentPanel && (
          <AgentPanel
            agents={config.agents}
            surfaceType={config.type}
            onClose={() => setShowAgentPanel(false)}
          />
        )}
      </div>

      {/* AI suggestion bar */}
      <motion.div
        className={styles.suggestionBar}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", damping: 20 }}
      >
        <Bot size={14} className={styles.suggestionIcon} />
        <span className={styles.suggestionText}>
          {getSuggestionForType(config.type)}
        </span>
        <div className={styles.suggestionActions}>
          <button className={styles.suggestionAction}>Yes, do it</button>
          <button className={styles.suggestionDismiss}>Dismiss</button>
        </div>
      </motion.div>

      {/* Toggle agent panel button */}
      {!showAgentPanel && (
        <button
          className={styles.showAgentsButton}
          onClick={() => setShowAgentPanel(true)}
        >
          <Bot size={16} />
          <span>AI Agents</span>
        </button>
      )}
    </motion.div>
  );
}

function getSuggestionForType(type: string): string {
  switch (type) {
    case "decision":
      return "I notice you're discussing options. Would you like me to create a comparison table?";
    case "onboarding":
      return "I found 12 related documents. Should I create a summary of the key information?";
    case "brainstorm":
      return "I see some themes emerging. Want me to cluster related ideas together?";
    case "retrospective":
      return "Based on the discussion, I've identified 3 recurring themes. Should I group them?";
    case "incident":
      return "I've pulled the recent deployment logs. Want me to highlight suspicious changes?";
    case "launch":
      return "2 checklist items are at risk. Should I notify the responsible team members?";
    case "handoff":
      return "I noticed gaps in the documentation. Should I generate a list of missing topics?";
    default:
      return "I'm here to help. What would you like me to do with this workspace?";
  }
}
