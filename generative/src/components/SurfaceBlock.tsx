import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  GripVertical,
  Check,
  X,
  ExternalLink,
  Send,
  Plus,
  Clock,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Circle,
  Loader,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageSquare,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type {
  Block,
  LayoutType,
  Column,
  TabConfig,
  StatusItem,
  MetricItem,
  Person,
  DocumentItem,
} from "../types";
import { CollaborativeWhiteboard } from "./CollaborativeWhiteboard";
import { SlidePreview, ONBOARDING_SLIDES } from "./SlidePreview";
import styles from "./SurfaceBlock.module.css";

interface SurfaceBlockProps {
  block: Block;
  index: number;
  layout?: LayoutType;
}

const blockVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function SurfaceBlock({ block, index }: SurfaceBlockProps) {
  const widthClass = block.width ? styles[`width-${block.width}`] : "";

  return (
    <motion.div
      className={`${styles.block} ${widthClass}`}
      variants={blockVariants}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {renderBlock(block)}
    </motion.div>
  );
}

function renderBlock(block: Block) {
  switch (block.type) {
    case "header":
      return <HeaderBlock content={block.content || ""} />;
    case "editor":
      return <EditorBlock content={block.content || ""} />;
    case "divider":
      return <DividerBlock />;
    case "voting":
      return <VotingBlock options={block.options || []} label={block.label} />;
    case "canvas":
      return <CanvasBlock label={block.label || "Canvas"} />;
    case "progress":
      return <ProgressBlock items={block.items || []} />;
    case "context-cards":
      return <ContextCardsBlock sources={block.sources || []} />;
    case "chat":
      return (
        <ChatBlock placeholder={block.placeholder || "Ask a question..."} />
      );
    case "ai-summary":
      return <AISummaryBlock placeholder={block.placeholder || ""} />;
    case "ai-interpretation":
      return <AIInterpretationBlock content={block.content || ""} />;
    case "retro-columns":
      return <CollaborativeWhiteboard />;
    case "status-tracker":
      return <StatusTrackerBlock statuses={block.statuses || []} />;
    case "runbook":
      return (
        <RunbookBlock
          label={block.label || "Runbook"}
          items={block.items || []}
        />
      );
    case "timeline":
      return (
        <TimelineBlock
          label={block.label || "Timeline"}
          items={block.items || []}
        />
      );
    case "checklist":
      return (
        <ChecklistBlock
          label={block.label || "Checklist"}
          items={block.items || []}
        />
      );
    case "metrics-panel":
      return <MetricsPanelBlock metrics={block.metrics || []} />;
    case "communication-log":
      return (
        <CommunicationLogBlock label={block.label || "Communication Log"} />
      );
    case "stakeholder-map":
      return <StakeholderMapBlock people={block.people || []} />;
    case "expertise-map":
      return (
        <ExpertiseMapBlock
          label={block.label || "Expertise"}
          people={block.people || []}
        />
      );
    case "documentation-tree":
      return (
        <DocumentationTreeBlock
          label={block.label || "Documentation"}
          documents={block.documents || []}
        />
      );
    case "handoff-checklist":
      return (
        <HandoffChecklistBlock
          label={block.label || "Handoff Progress"}
          items={block.items || []}
        />
      );
    case "tabs-container":
      return <TabsContainerBlock tabs={block.tabs || []} />;
    case "kanban":
      return <KanbanBlock columns={block.columns || []} />;
    case "doc-outline":
      return <DocOutlineBlock label={block.label || "Outline"} items={block.items || []} />;
    case "rich-editor":
      return <RichEditorBlock content={block.content || ""} />;
    case "diagram-canvas":
      return <DiagramCanvasBlock label={block.label || "Diagram"} />;
    case "spec-table":
      return <SpecTableBlock label={block.label || "Specifications"} columns={block.columns || []} />;
    case "mermaid-diagram":
      return <MermaidDiagramBlock content={block.content || ""} />;
    case "version-history":
      return <VersionHistoryBlock label={block.label || "History"} />;
    case "related-docs":
      return <RelatedDocsBlock label={block.label || "Related"} sources={block.sources || []} />;
    case "doc-metadata":
      return <DocMetadataBlock content={block.content || ""} />;
    case "slides":
      return <SlidePreview slides={ONBOARDING_SLIDES} title={block.label || "Slide Deck"} />;
    case "team-roster":
      return <TeamRosterBlock label={block.label || "Team"} />;
    case "key-links":
      return <KeyLinksBlock label={block.label || "Resources"} />;
    case "jira-tickets":
      return <JiraTicketsBlock label={block.label || "Your Tickets"} />;
    default:
      return null;
  }
}

function HeaderBlock({ content }: { content: string }) {
  return (
    <div className={styles.headerBlock}>
      <GripVertical size={14} className={styles.dragHandle} />
      <h2 className={styles.headerText}>{content}</h2>
    </div>
  );
}

function EditorBlock({ content }: { content: string }) {
  const [text, setText] = useState(content);

  return (
    <div className={styles.editorBlock}>
      <GripVertical size={14} className={styles.dragHandle} />
      <textarea
        className={styles.editor}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={content}
        rows={4}
      />
    </div>
  );
}

function DividerBlock() {
  return <div className={styles.divider} />;
}

function VotingBlock({ options, label }: { options: string[]; label?: string }) {
  // Start with some fake votes to make it feel alive
  const [votes, setVotes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    options.forEach((opt, idx) => {
      // Give the second option a slight lead
      initial[opt] = idx === 1 ? 3 : idx === 0 ? 2 : 1;
    });
    return initial;
  });
  const [voted, setVoted] = useState<string | null>(null);
  const [voters] = useState([
    { name: "Sarah", color: "#0052CC", votedFor: 1 },
    { name: "Alex", color: "#00875A", votedFor: 1 },
    { name: "Mike", color: "#6554C0", votedFor: 0 },
    { name: "Jordan", color: "#FF8B00", votedFor: 1 },
    { name: "Riley", color: "#FF5630", votedFor: 0 },
    { name: "Chris", color: "#00B8D9", votedFor: 2 },
  ]);

  const handleVote = (option: string) => {
    if (voted) return;
    setVotes((prev) => ({ ...prev, [option]: (prev[option] || 0) + 1 }));
    setVoted(option);
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <div className={styles.votingBlock}>
      <div className={styles.blockHeader}>
        <span className={styles.blockTitle}>{label || "Vote on options"}</span>
        <div className={styles.voterAvatars}>
          {voters.slice(0, 4).map((v, i) => (
            <div
              key={i}
              className={styles.voterAvatar}
              style={{ backgroundColor: v.color, marginLeft: i > 0 ? "-8px" : 0 }}
              title={`${v.name} voted`}
            >
              {v.name[0]}
            </div>
          ))}
          {voters.length > 4 && (
            <span className={styles.moreVoters}>+{voters.length - 4}</span>
          )}
        </div>
        <span className={styles.blockMeta}>
          {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
        </span>
      </div>
      <div className={styles.votingOptions}>
        {options.map((option, idx) => {
          const count = votes[option] || 0;
          const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
          const isSelected = voted === option;
          const optionVoters = voters.filter(v => v.votedFor === idx);

          return (
            <motion.button
              key={idx}
              className={`${styles.votingOption} ${
                isSelected ? styles.selected : ""
              } ${voted && !isSelected ? styles.disabled : ""}`}
              onClick={() => handleVote(option)}
              whileHover={!voted ? { scale: 1.01 } : {}}
              whileTap={!voted ? { scale: 0.99 } : {}}
            >
              <div
                className={styles.votingBar}
                style={{ width: `${percentage}%` }}
              />
              <span className={styles.votingOptionText}>{option}</span>
              <div className={styles.optionVoters}>
                {optionVoters.slice(0, 3).map((v, i) => (
                  <span key={i} className={styles.miniAvatar} style={{ backgroundColor: v.color }}>{v.name[0]}</span>
                ))}
              </div>
              {isSelected && <Check size={16} className={styles.checkIcon} />}
              <span className={styles.votingPercentage}>
                {Math.round(percentage)}%
              </span>
            </motion.button>
          );
        })}
      </div>
      {!voted && (
        <p className={styles.votingHint}>Click to cast your vote — it's anonymous</p>
      )}
    </div>
  );
}

interface FakeCursor {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

function CanvasBlock({ label }: { label: string }) {
  const [cursors, setCursors] = useState<FakeCursor[]>([
    { id: "1", name: "Emma", color: "#0052CC", x: 120, y: 80 },
    { id: "2", name: "David", color: "#00875A", x: 280, y: 150 },
  ]);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Animate fake cursors
  useEffect(() => {
    const interval = setInterval(() => {
      setCursors((prev) =>
        prev.map((cursor) => ({
          ...cursor,
          x: cursor.x + (Math.random() - 0.5) * 20,
          y: cursor.y + (Math.random() - 0.5) * 20,
        }))
      );
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.canvasBlock}>
      <div className={styles.blockHeader}>
        <span className={styles.blockTitle}>{label}</span>
        <div className={styles.canvasCollaborators}>
          {cursors.map((c) => (
            <span
              key={c.id}
              className={styles.canvasCollabDot}
              style={{ backgroundColor: c.color }}
              title={c.name}
            />
          ))}
          <span className={styles.canvasCollabCount}>
            {cursors.length + 1} online
          </span>
        </div>
        <button className={styles.expandButton}>
          <ExternalLink size={12} />
          Expand
        </button>
      </div>
      <div ref={canvasRef} className={styles.canvasArea}>
        {/* Fake collaborative cursors */}
        {cursors.map((cursor) => (
          <div
            key={cursor.id}
            className={styles.fakeCursor}
            style={{
              transform: `translate(${cursor.x}px, ${cursor.y}px)`,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
                fill={cursor.color}
              />
              <path
                d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
            <span
              className={styles.fakeCursorLabel}
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name}
            </span>
          </div>
        ))}
        <div className={styles.canvasPlaceholder}>
          <span>Click to start drawing or drop elements here</span>
          <span className={styles.canvasHint}>
            WebGL-powered infinite canvas
          </span>
        </div>
      </div>
    </div>
  );
}

function ProgressBlock({ items }: { items: string[] }) {
  const [completed, setCompleted] = useState<number[]>([]);

  const toggleComplete = (idx: number) => {
    setCompleted((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const progress =
    items.length > 0 ? (completed.length / items.length) * 100 : 0;

  return (
    <div className={styles.progressBlock}>
      <div className={styles.progressHeader}>
        <span className={styles.progressPercent}>
          {Math.round(progress)}% complete
        </span>
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className={styles.progressItems}>
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            className={`${styles.progressItem} ${
              completed.includes(idx) ? styles.completed : ""
            }`}
            whileHover={{ x: 4 }}
          >
            <button
              className={styles.progressCheck}
              onClick={() => toggleComplete(idx)}
            >
              {completed.includes(idx) ? (
                <Check size={12} />
              ) : (
                <span className={styles.progressNumber}>{idx + 1}</span>
              )}
            </button>
            <span className={styles.progressText}>{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ContextCardsBlock({ sources }: { sources: string[] }) {
  const mockData: Record<string, { title: string; snippet: string }[]> = {
    jira: [
      {
        title: "PROJ-123: User Authentication Flow",
        snippet: "Implement OAuth2 integration with social providers...",
      },
      {
        title: "PROJ-124: Dashboard Redesign",
        snippet: "Update the main dashboard with new analytics widgets...",
      },
    ],
    confluence: [
      {
        title: "Architecture Decision Record - Auth",
        snippet: "We decided to use JWT tokens stored in httpOnly cookies...",
      },
      {
        title: "Q1 Planning Document",
        snippet: "Key objectives: improve load time by 40%, increase...",
      },
    ],
    atlas: [
      {
        title: "Project Alpha",
        snippet: "Status: On Track | Owner: Team Phoenix",
      },
    ],
  };

  return (
    <div className={styles.contextCards}>
      {sources.map((source) => (
        <div key={source} className={styles.contextSource}>
          <div className={styles.contextSourceHeader}>
            <span className={styles.sourceBadge}>{source}</span>
            <button className={styles.viewAllButton}>View all</button>
          </div>
          <div className={styles.contextItems}>
            {(mockData[source] || []).map((item, idx) => (
              <motion.div
                key={idx}
                className={styles.contextCard}
                whileHover={{ y: -2 }}
              >
                <h4 className={styles.contextTitle}>{item.title}</h4>
                <p className={styles.contextSnippet}>{item.snippet}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatBlock({ placeholder }: { placeholder: string }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setMessage("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "I can help you understand this. Based on the documentation, this focuses on improving the core experience. Would you like me to elaborate?",
        },
      ]);
    }, 1000);
  };

  return (
    <div className={styles.chatBlock}>
      <div className={styles.chatMessages}>
        {messages.length === 0 && (
          <div className={styles.chatEmpty}>
            <span>{placeholder}</span>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.chatMessage} ${styles[msg.role]}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className={styles.chatInput}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={!message.trim()}>
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

function AISummaryBlock({ placeholder }: { placeholder: string }) {
  return (
    <div className={styles.aiSummaryBlock}>
      <div className={styles.aiPulse} />
      <span className={styles.aiPlaceholder}>{placeholder}</span>
    </div>
  );
}

function AIInterpretationBlock({ content }: { content: string }) {
  return (
    <div className={styles.aiInterpretation}>
      <p>{content}</p>
      <div className={styles.aiActions}>
        <button className={styles.aiActionButton}>
          <Check size={14} /> This is right
        </button>
        <button className={styles.aiActionButton}>
          <X size={14} /> Refine
        </button>
      </div>
    </div>
  );
}

// NEW BLOCK TYPES

function StatusTrackerBlock({ statuses }: { statuses: StatusItem[] }) {
  const getStatusIcon = (status: StatusItem["status"]) => {
    switch (status) {
      case "done":
        return <CheckCircle size={16} className={styles.statusDone} />;
      case "in-progress":
        return <Loader size={16} className={styles.statusInProgress} />;
      case "blocked":
        return <AlertCircle size={16} className={styles.statusBlocked} />;
      default:
        return <Circle size={16} className={styles.statusPending} />;
    }
  };

  return (
    <div className={styles.statusTracker}>
      <div className={styles.blockHeader}>
        <span className={styles.blockTitle}>Status Tracker</span>
      </div>
      <div className={styles.statusList}>
        {statuses.map((item, idx) => (
          <div
            key={item.id}
            className={`${styles.statusItem} ${
              styles[`status-${item.status}`]
            }`}
          >
            <div className={styles.statusIcon}>
              {getStatusIcon(item.status)}
            </div>
            <div className={styles.statusContent}>
              <span className={styles.statusLabel}>{item.label}</span>
              {item.assignee && (
                <span className={styles.statusAssignee}>
                  <User size={12} /> {item.assignee}
                </span>
              )}
            </div>
            {item.timestamp && (
              <span className={styles.statusTime}>{item.timestamp}</span>
            )}
            {idx < statuses.length - 1 && (
              <div className={styles.statusConnector} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RunbookBlock({ label, items }: { label: string; items: string[] }) {
  const [checked, setChecked] = useState<number[]>([]);

  return (
    <div className={styles.runbookBlock}>
      <div className={styles.blockHeader}>
        <FileText size={14} />
        <span className={styles.blockTitle}>{label}</span>
      </div>
      <div className={styles.runbookItems}>
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`${styles.runbookItem} ${
              checked.includes(idx) ? styles.checked : ""
            }`}
            onClick={() =>
              setChecked((prev) =>
                prev.includes(idx)
                  ? prev.filter((i) => i !== idx)
                  : [...prev, idx]
              )
            }
          >
            <div className={styles.runbookCheck}>
              {checked.includes(idx) ? (
                <Check size={12} />
              ) : (
                <span>{idx + 1}</span>
              )}
            </div>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineBlock({ label, items }: { label: string; items: string[] }) {
  return (
    <div className={styles.timelineBlock}>
      <div className={styles.blockHeader}>
        <Clock size={14} />
        <span className={styles.blockTitle}>{label}</span>
      </div>
      <div className={styles.timeline}>
        {items.map((item, idx) => (
          <div key={idx} className={styles.timelineItem}>
            <div className={styles.timelineDot} />
            <span className={styles.timelineLabel}>{item}</span>
            {idx < items.length - 1 && <div className={styles.timelineLine} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChecklistBlock({ label, items }: { label: string; items: string[] }) {
  const [checked, setChecked] = useState<number[]>([]);
  const progress = items.length > 0 ? (checked.length / items.length) * 100 : 0;

  return (
    <div className={styles.checklistBlock}>
      <div className={styles.blockHeader}>
        <span className={styles.blockTitle}>{label}</span>
        <span className={styles.blockMeta}>
          {checked.length}/{items.length}
        </span>
      </div>
      <div className={styles.checklistProgress}>
        <div
          className={styles.checklistProgressFill}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className={styles.checklistItems}>
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`${styles.checklistItem} ${
              checked.includes(idx) ? styles.checked : ""
            }`}
            onClick={() =>
              setChecked((prev) =>
                prev.includes(idx)
                  ? prev.filter((i) => i !== idx)
                  : [...prev, idx]
              )
            }
          >
            <div className={styles.checklistCheck}>
              {checked.includes(idx) && <Check size={12} />}
            </div>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricsPanelBlock({ metrics }: { metrics: MetricItem[] }) {
  const getTrendIcon = (trend?: MetricItem["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp size={14} />;
      case "down":
        return <TrendingDown size={14} />;
      default:
        return <Minus size={14} />;
    }
  };

  return (
    <div className={styles.metricsPanel}>
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className={`${styles.metricCard} ${
            styles[`metric-${metric.status}`]
          }`}
        >
          <span className={styles.metricLabel}>{metric.label}</span>
          <span className={styles.metricValue}>{metric.value}</span>
          {metric.trend && (
            <span
              className={`${styles.metricTrend} ${
                styles[`trend-${metric.trend}`]
              }`}
            >
              {getTrendIcon(metric.trend)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function CommunicationLogBlock({ label }: { label: string }) {
  const mockMessages = [
    {
      time: "10:30 AM",
      user: "Alex",
      message: "Escalated to engineering on-call",
    },
    {
      time: "10:35 AM",
      user: "System",
      message: "Status page updated: Investigating",
    },
    {
      time: "10:42 AM",
      user: "Sarah",
      message: "Identified potential root cause in auth service",
    },
  ];

  return (
    <div className={styles.commLogBlock}>
      <div className={styles.blockHeader}>
        <MessageSquare size={14} />
        <span className={styles.blockTitle}>{label}</span>
      </div>
      <div className={styles.commLogItems}>
        {mockMessages.map((msg, idx) => (
          <div key={idx} className={styles.commLogItem}>
            <span className={styles.commLogTime}>{msg.time}</span>
            <span className={styles.commLogUser}>{msg.user}</span>
            <span className={styles.commLogMessage}>{msg.message}</span>
          </div>
        ))}
      </div>
      <div className={styles.commLogInput}>
        <input type="text" placeholder="Add update..." />
        <button>
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

function StakeholderMapBlock({ people }: { people: Person[] }) {
  const getStatusColor = (status?: Person["status"]) => {
    switch (status) {
      case "available":
        return "var(--ds-background-success-bold)";
      case "busy":
        return "var(--ds-background-danger-bold)";
      case "away":
        return "var(--ds-background-warning-bold)";
      default:
        return "var(--ds-background-neutral)";
    }
  };

  return (
    <div className={styles.stakeholderMap}>
      <div className={styles.blockHeader}>
        <span className={styles.blockTitle}>Stakeholders</span>
      </div>
      <div className={styles.stakeholderList}>
        {people.map((person) => (
          <div key={person.id} className={styles.stakeholderCard}>
            <div className={styles.stakeholderAvatar}>
              {person.name.charAt(0)}
              <span
                className={styles.stakeholderStatus}
                style={{ backgroundColor: getStatusColor(person.status) }}
              />
            </div>
            <div className={styles.stakeholderInfo}>
              <span className={styles.stakeholderName}>{person.name}</span>
              <span className={styles.stakeholderRole}>{person.role}</span>
              {person.expertise && (
                <div className={styles.stakeholderTags}>
                  {person.expertise.map((exp, idx) => (
                    <span key={idx} className={styles.expertiseTag}>
                      {exp}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExpertiseMapBlock({
  label,
  people,
}: {
  label: string;
  people: Person[];
}) {
  return (
    <div className={styles.expertiseMap}>
      <div className={styles.blockHeader}>
        <span className={styles.blockTitle}>{label}</span>
      </div>
      {people.map((person) => (
        <div key={person.id} className={styles.expertisePersonCard}>
          <div className={styles.expertisePersonHeader}>
            <div className={styles.expertiseAvatar}>
              {person.name.charAt(0)}
            </div>
            <div>
              <span className={styles.expertiseName}>{person.name}</span>
              <span className={styles.expertiseRole}>{person.role}</span>
            </div>
          </div>
          {person.expertise && (
            <div className={styles.expertiseAreas}>
              {person.expertise.map((exp, idx) => (
                <div key={idx} className={styles.expertiseArea}>
                  <ChevronRight size={12} />
                  {exp}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function DocumentationTreeBlock({
  label,
  documents,
}: {
  label: string;
  documents: DocumentItem[];
}) {
  const getStatusBadge = (status: DocumentItem["status"]) => {
    const config = {
      complete: {
        color: "var(--ds-background-success-bold)",
        label: "Complete",
      },
      "in-progress": {
        color: "var(--ds-background-warning-bold)",
        label: "In Progress",
      },
      missing: { color: "var(--ds-background-danger-bold)", label: "Missing" },
      "needs-update": {
        color: "var(--ds-background-information-bold)",
        label: "Needs Update",
      },
    };
    return config[status];
  };

  return (
    <div className={styles.documentationTree}>
      <div className={styles.blockHeader}>
        <FileText size={14} />
        <span className={styles.blockTitle}>{label}</span>
      </div>
      <div className={styles.docList}>
        {documents.map((doc) => {
          const badge = getStatusBadge(doc.status);
          return (
            <div key={doc.id} className={styles.docItem}>
              <div className={styles.docIcon}>
                <FileText size={14} />
              </div>
              <div className={styles.docInfo}>
                <span className={styles.docTitle}>{doc.title}</span>
                {doc.lastUpdated && (
                  <span className={styles.docMeta}>
                    Updated {doc.lastUpdated}
                  </span>
                )}
              </div>
              <span
                className={styles.docBadge}
                style={{ backgroundColor: badge.color }}
              >
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HandoffChecklistBlock({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  const [checked, setChecked] = useState<number[]>([]);
  const progress = items.length > 0 ? (checked.length / items.length) * 100 : 0;

  return (
    <div className={styles.handoffChecklist}>
      <div className={styles.blockHeader}>
        <span className={styles.blockTitle}>{label}</span>
        <span className={styles.blockMeta}>{Math.round(progress)}%</span>
      </div>
      <div className={styles.handoffProgress}>
        <div
          className={styles.handoffProgressFill}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className={styles.handoffItems}>
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`${styles.handoffItem} ${
              checked.includes(idx) ? styles.checked : ""
            }`}
            onClick={() =>
              setChecked((prev) =>
                prev.includes(idx)
                  ? prev.filter((i) => i !== idx)
                  : [...prev, idx]
              )
            }
          >
            <div className={styles.handoffCheck}>
              {checked.includes(idx) ? (
                <Check size={14} />
              ) : (
                <Circle size={14} />
              )}
            </div>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabsContainerBlock({ tabs }: { tabs: TabConfig[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsList}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${
              activeTab === tab.id ? styles.active : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {tabs
          .find((t) => t.id === activeTab)
          ?.blocks.map((block, idx) => (
            <SurfaceBlock key={idx} block={block} index={idx} />
          ))}
      </div>
    </div>
  );
}

function KanbanBlock({ columns }: { columns: Column[] }) {
  return (
    <div className={styles.kanban}>
      {columns.map((column) => (
        <div key={column.id} className={styles.kanbanColumn}>
          <div
            className={styles.kanbanHeader}
            style={{ borderTopColor: column.color }}
          >
            <span>{column.title}</span>
            <span className={styles.kanbanCount}>{column.items.length}</span>
          </div>
          <div className={styles.kanbanItems}>
            {column.items.map((item, idx) => (
              <div key={idx} className={styles.kanbanCard}>
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// DOCUMENTATION BLOCKS

function DocOutlineBlock({ label, items }: { label: string; items: string[] }) {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className={styles.docOutline}>
      <div className={styles.blockHeader}>
        <FileText size={14} />
        <span className={styles.blockTitle}>{label}</span>
      </div>
      <div className={styles.outlineItems}>
        {items.map((item, idx) => (
          <button
            key={idx}
            className={`${styles.outlineItem} ${activeSection === idx ? styles.active : ""}`}
            onClick={() => setActiveSection(idx)}
          >
            <span className={styles.outlineNumber}>{idx + 1}</span>
            <span className={styles.outlineText}>{item}</span>
          </button>
        ))}
      </div>
      <button className={styles.addSectionBtn}>
        <Plus size={14} />
        Add section
      </button>
    </div>
  );
}

function RichEditorBlock({ content }: { content: string }) {
  const [text, setText] = useState(content);
  const [wordCount, setWordCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [text]);

  // Simple markdown-like rendering
  const renderContent = () => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return <h4 key={idx} className={styles.editorH3}>{line.slice(4)}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className={styles.editorH2}>{line.slice(3)}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={idx} className={styles.editorH1}>{line.slice(2)}</h2>;
      }
      if (line.startsWith("- ")) {
        return <li key={idx} className={styles.editorLi}>{line.slice(2)}</li>;
      }
      if (line.trim() === "") {
        return <br key={idx} />;
      }
      return <p key={idx} className={styles.editorP}>{line}</p>;
    });
  };

  return (
    <div className={styles.richEditor}>
      <div className={styles.editorToolbar}>
        <button className={styles.toolbarBtn} title="Bold"><strong>B</strong></button>
        <button className={styles.toolbarBtn} title="Italic"><em>I</em></button>
        <button className={styles.toolbarBtn} title="Heading">H1</button>
        <button className={styles.toolbarBtn} title="Heading 2">H2</button>
        <div className={styles.toolbarDivider} />
        <button className={styles.toolbarBtn} title="Bullet List">•</button>
        <button className={styles.toolbarBtn} title="Numbered List">1.</button>
        <button className={styles.toolbarBtn} title="Code">&lt;/&gt;</button>
        <div className={styles.toolbarDivider} />
        <button className={styles.toolbarBtn} title="Link">🔗</button>
        <button className={styles.toolbarBtn} title="Image">🖼️</button>
        <button className={styles.toolbarBtn} title="Table">▦</button>
        <button 
          className={`${styles.toolbarBtn} ${styles.editToggle} ${isEditing ? styles.active : ""}`}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Preview" : "Edit"}
        </button>
        <span className={styles.wordCount}>{wordCount} words</span>
      </div>
      {isEditing ? (
        <textarea
          className={styles.richTextarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start writing..."
        />
      ) : (
        <div 
          className={styles.richContent}
          onClick={() => setIsEditing(true)}
        >
          {renderContent()}
        </div>
      )}
      <div className={styles.editorFooter}>
        <span className={styles.autoSave}>✓ Auto-saved</span>
        <button className={styles.aiAssistBtn}>
          <Sparkles size={14} />
          AI Assist
        </button>
      </div>
    </div>
  );
}

function DiagramCanvasBlock({ label }: { label: string }) {
  const [cursors] = useState([
    { id: "1", name: "Maya", color: "#0052CC", x: 150, y: 100 },
    { id: "2", name: "Chris", color: "#6554C0", x: 320, y: 180 },
  ]);

  const [shapes] = useState([
    { id: "1", type: "rect", x: 80, y: 60, width: 120, height: 60, label: "Service A", color: "#E9F2FF" },
    { id: "2", type: "rect", x: 280, y: 60, width: 120, height: 60, label: "Service B", color: "#DCFFF1" },
    { id: "3", type: "rect", x: 180, y: 180, width: 120, height: 60, label: "Database", color: "#FFF7D6" },
    { id: "4", type: "arrow", x1: 140, y1: 120, x2: 240, y2: 180 },
    { id: "5", type: "arrow", x1: 340, y1: 120, x2: 280, y2: 180 },
  ]);

  return (
    <div className={styles.diagramCanvas}>
      <div className={styles.diagramHeader}>
        <span className={styles.blockTitle}>{label}</span>
        <div className={styles.diagramTools}>
          <button className={styles.diagramTool} title="Select">↖</button>
          <button className={styles.diagramTool} title="Rectangle">▢</button>
          <button className={styles.diagramTool} title="Circle">○</button>
          <button className={styles.diagramTool} title="Arrow">→</button>
          <button className={styles.diagramTool} title="Text">T</button>
        </div>
        <div className={styles.diagramCollabs}>
          {cursors.map(c => (
            <span key={c.id} className={styles.collabDot} style={{ backgroundColor: c.color }} title={c.name} />
          ))}
        </div>
      </div>
      <div className={styles.diagramArea}>
        <svg width="100%" height="100%" className={styles.diagramSvg}>
          {/* Arrows */}
          {shapes.filter(s => s.type === "arrow").map(arrow => (
            <g key={arrow.id}>
              <line
                x1={arrow.x1}
                y1={arrow.y1}
                x2={arrow.x2}
                y2={arrow.y2}
                stroke="var(--ds-border-bold)"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            </g>
          ))}
          {/* Rectangles */}
          {shapes.filter(s => s.type === "rect").map(shape => (
            <g key={shape.id}>
              <rect
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                fill={shape.color}
                stroke="var(--ds-border)"
                strokeWidth="1"
                rx="4"
              />
              <text
                x={shape.x! + shape.width! / 2}
                y={shape.y! + shape.height! / 2 + 4}
                textAnchor="middle"
                fontSize="12"
                fill="var(--ds-text)"
              >
                {shape.label}
              </text>
            </g>
          ))}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--ds-border-bold)" />
            </marker>
          </defs>
        </svg>
        {/* Fake cursors */}
        {cursors.map(cursor => (
          <div
            key={cursor.id}
            className={styles.diagramCursor}
            style={{ left: cursor.x, top: cursor.y }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z" fill={cursor.color} stroke="white" strokeWidth="1.5" />
            </svg>
            <span className={styles.cursorName} style={{ backgroundColor: cursor.color }}>{cursor.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpecTableBlock({ label, columns }: { label: string; columns: Column[] }) {
  const rowCount = columns[0]?.items.length || 0;

  return (
    <div className={styles.specTable}>
      <div className={styles.blockHeader}>
        <span className={styles.blockTitle}>{label}</span>
        <button className={styles.addRowBtn}>
          <Plus size={12} />
          Add row
        </button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.id} style={{ borderBottomColor: col.color }}>
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col) => (
                  <td key={col.id}>{col.items[rowIdx] || ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MermaidDiagramBlock({ content }: { content: string }) {
  const [code, setCode] = useState(content);
  const [showCode, setShowCode] = useState(false);

  // Fake render of mermaid - in reality would use mermaid.js
  const renderFakeMermaid = () => {
    if (code.includes("graph TD")) {
      return (
        <div className={styles.fakeMermaid}>
          <div className={styles.mermaidNode} style={{ top: "20px", left: "50%", transform: "translateX(-50%)" }}>
            User Request
          </div>
          <div className={styles.mermaidArrow} style={{ top: "60px", left: "50%", height: "30px" }} />
          <div className={styles.mermaidDiamond} style={{ top: "90px", left: "50%", transform: "translateX(-50%)" }}>
            Auth Check
          </div>
          <div className={styles.mermaidArrow} style={{ top: "140px", left: "35%", height: "30px" }} />
          <div className={styles.mermaidArrow} style={{ top: "140px", left: "65%", height: "30px" }} />
          <div className={styles.mermaidNode} style={{ top: "170px", left: "25%" }}>
            Process Request
          </div>
          <div className={styles.mermaidNode} style={{ top: "170px", left: "65%" }}>
            Return 401
          </div>
          <div className={styles.mermaidArrow} style={{ top: "210px", left: "35%", height: "30px" }} />
          <div className={styles.mermaidNode} style={{ top: "240px", left: "25%" }}>
            Return Response
          </div>
        </div>
      );
    }
    return <div className={styles.mermaidPlaceholder}>Diagram preview</div>;
  };

  return (
    <div className={styles.mermaidBlock}>
      <div className={styles.mermaidHeader}>
        <span className={styles.blockTitle}>Flow Diagram</span>
        <button 
          className={styles.toggleCodeBtn}
          onClick={() => setShowCode(!showCode)}
        >
          {showCode ? "Preview" : "Edit Code"}
        </button>
      </div>
      {showCode ? (
        <textarea
          className={styles.mermaidCode}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
        />
      ) : (
        <div className={styles.mermaidPreview}>
          {renderFakeMermaid()}
        </div>
      )}
    </div>
  );
}

function VersionHistoryBlock({ label }: { label: string }) {
  const versions = [
    { id: "1", version: "v3", author: "You", time: "Just now", changes: "Updated technical specs" },
    { id: "2", version: "v2", author: "Sarah", time: "2 hours ago", changes: "Added API endpoints section" },
    { id: "3", version: "v1", author: "Alex", time: "Yesterday", changes: "Initial draft" },
  ];

  return (
    <div className={styles.versionHistory}>
      <div className={styles.blockHeader}>
        <Clock size={14} />
        <span className={styles.blockTitle}>{label}</span>
      </div>
      <div className={styles.versionList}>
        {versions.map((v, idx) => (
          <div key={v.id} className={`${styles.versionItem} ${idx === 0 ? styles.current : ""}`}>
            <div className={styles.versionDot} />
            <div className={styles.versionContent}>
              <div className={styles.versionHeader}>
                <span className={styles.versionTag}>{v.version}</span>
                <span className={styles.versionAuthor}>{v.author}</span>
                <span className={styles.versionTime}>{v.time}</span>
              </div>
              <p className={styles.versionChanges}>{v.changes}</p>
            </div>
            {idx === 0 && <span className={styles.currentBadge}>Current</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatedDocsBlock({ label }: { label: string; sources?: string[] }) {
  const relatedDocs = [
    { id: "1", title: "System Architecture Overview", source: "confluence", updated: "3 days ago" },
    { id: "2", title: "API Design Guidelines", source: "confluence", updated: "1 week ago" },
    { id: "3", title: "PROJ-456: Related Epic", source: "jira", updated: "2 days ago" },
  ];

  return (
    <div className={styles.relatedDocs}>
      <div className={styles.blockHeader}>
        <span className={styles.blockTitle}>{label}</span>
      </div>
      <div className={styles.relatedList}>
        {relatedDocs.map((doc) => (
          <div key={doc.id} className={styles.relatedItem}>
            <span className={styles.relatedSource}>{doc.source}</span>
            <span className={styles.relatedTitle}>{doc.title}</span>
            <span className={styles.relatedTime}>{doc.updated}</span>
          </div>
        ))}
      </div>
      <button className={styles.linkDocBtn}>
        <Plus size={12} />
        Link document
      </button>
    </div>
  );
}

function DocMetadataBlock({ content }: { content: string }) {
  return (
    <div className={styles.docMetadata}>
      <div className={styles.metadataItem}>
        <span className={styles.metadataLabel}>Status</span>
        <span className={`${styles.statusBadge} ${styles.draft}`}>{content || "Draft"}</span>
      </div>
      <div className={styles.metadataItem}>
        <span className={styles.metadataLabel}>Author</span>
        <span className={styles.metadataValue}>You</span>
      </div>
      <div className={styles.metadataItem}>
        <span className={styles.metadataLabel}>Last edited</span>
        <span className={styles.metadataValue}>Just now</span>
      </div>
      <div className={styles.metadataItem}>
        <span className={styles.metadataLabel}>Reviewers</span>
        <button className={styles.addReviewerBtn}>+ Add</button>
      </div>
    </div>
  );
}

// ONBOARDING BLOCKS

function TeamRosterBlock({ label }: { label: string }) {
  const team = [
    { initials: "SC", name: "Sarah Chen", role: "Tech Lead", status: "online", color: "#0052CC" },
    { initials: "MJ", name: "Mike Johnson", role: "Product Manager", status: "online", color: "#6554C0" },
    { initials: "AK", name: "Alex Kim", role: "Senior Engineer", status: "away", color: "#00875A" },
    { initials: "JD", name: "Jordan Davis", role: "Designer", status: "offline", color: "#FF8B00" },
    { initials: "RP", name: "Riley Park", role: "QA Engineer", status: "online", color: "#FF5630" },
  ];

  return (
    <div className={styles.teamRoster}>
      <div className={styles.blockHeader}>
        <User size={14} />
        <span className={styles.blockTitle}>{label}</span>
        <span className={styles.onlineCount}>3 online</span>
      </div>
      <div className={styles.teamGrid}>
        {team.map((member, idx) => (
          <motion.div
            key={idx}
            className={styles.teamMember}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className={styles.memberAvatar} style={{ background: member.color }}>
              {member.initials}
              <span className={`${styles.statusIndicator} ${styles[member.status]}`} />
            </div>
            <div className={styles.memberInfo}>
              <span className={styles.memberName}>{member.name}</span>
              <span className={styles.memberRole}>{member.role}</span>
            </div>
            <button className={styles.messageBtn}>
              <MessageSquare size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function KeyLinksBlock({ label }: { label: string }) {
  const links = [
    { icon: "📚", title: "Project Phoenix Wiki", source: "Confluence", url: "#", category: "docs" },
    { icon: "📋", title: "Sprint Board", source: "Jira", url: "#", category: "work" },
    { icon: "💬", title: "#team-phoenix", source: "Slack", url: "#", category: "comms" },
    { icon: "🎨", title: "Auth Flow Designs", source: "Figma", url: "#", category: "design" },
    { icon: "📊", title: "Q1 Roadmap", source: "Atlas", url: "#", category: "planning" },
    { icon: "🔧", title: "Phoenix Repo", source: "Bitbucket", url: "#", category: "code" },
  ];

  return (
    <div className={styles.keyLinks}>
      <div className={styles.blockHeader}>
        <ExternalLink size={14} />
        <span className={styles.blockTitle}>{label}</span>
      </div>
      <div className={styles.linksGrid}>
        {links.map((link, idx) => (
          <motion.a
            key={idx}
            href={link.url}
            className={styles.linkCard}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <span className={styles.linkIcon}>{link.icon}</span>
            <div className={styles.linkInfo}>
              <span className={styles.linkTitle}>{link.title}</span>
              <span className={styles.linkSource}>{link.source}</span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

function JiraTicketsBlock({ label }: { label: string }) {
  const tickets = [
    { key: "PROJ-789", title: "Add rate limiting to OAuth endpoint", type: "task", priority: "medium", status: "To Do", assignee: "You", points: 3 },
    { key: "PROJ-792", title: "Fix token refresh race condition", type: "bug", priority: "high", status: "To Do", assignee: "You", points: 5 },
    { key: "PROJ-795", title: "Add unit tests for auth middleware", type: "task", priority: "low", status: "To Do", assignee: "You", points: 2 },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bug": return "#FF5630";
      case "task": return "#0052CC";
      default: return "#626F86";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return "🔴";
      case "medium": return "🟡";
      case "low": return "🟢";
      default: return "⚪";
    }
  };

  return (
    <div className={styles.jiraTickets}>
      <div className={styles.blockHeader}>
        <span className={styles.blockTitle}>{label}</span>
        <span className={styles.ticketCount}>{tickets.length} assigned</span>
      </div>
      <div className={styles.ticketList}>
        {tickets.map((ticket, idx) => (
          <motion.div
            key={ticket.key}
            className={styles.ticketCard}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className={styles.ticketType} style={{ background: getTypeColor(ticket.type) }} />
            <div className={styles.ticketMain}>
              <div className={styles.ticketHeader}>
                <span className={styles.ticketKey}>{ticket.key}</span>
                <span className={styles.ticketPriority}>{getPriorityIcon(ticket.priority)}</span>
                <span className={styles.ticketPoints}>{ticket.points} pts</span>
              </div>
              <p className={styles.ticketTitle}>{ticket.title}</p>
            </div>
            <span className={styles.ticketStatus}>{ticket.status}</span>
          </motion.div>
        ))}
      </div>
      <button className={styles.viewBoardBtn}>
        View full board →
      </button>
    </div>
  );
}

