"use client";

import { useState } from "react";
import { Link } from "react-router";
import { useTheme } from "../context/theme-context";
import { ThemeToggle } from "./theme-toggle";

// ============================================================================
// STYLES FACTORY
// ============================================================================

function getStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return {
    page: {
      minHeight: "100vh",
      backgroundColor: colors.surfaceDefault,
      color: colors.textDefault,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      transition: "background-color 0.3s ease, color 0.3s ease",
    },
    nav: {
      position: "sticky" as const,
      top: 0,
      zIndex: 100,
      backgroundColor: colors.surfaceDefault,
      borderBottom: `1px solid ${colors.border}`,
      padding: "12px 24px",
      boxShadow: "0 1px 1px rgba(9, 30, 66, 0.06)",
      transition: "background-color 0.3s ease, border-color 0.3s ease",
    },
    navInner: {
      maxWidth: 1400,
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    navLeft: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    navRight: {
      display: "flex",
      alignItems: "center",
      gap: 16,
    },
    navTitle: {
      fontSize: 16,
      fontWeight: 600,
      color: colors.textDefault,
      margin: 0,
    },
    navLinks: {
      display: "flex",
      gap: 16,
    },
    navLink: {
      fontSize: 14,
      color: colors.textSubtle,
      textDecoration: "none",
    },
    layout: {
      display: "flex",
      maxWidth: 1400,
      margin: "0 auto",
    },
    sidebar: {
      position: "sticky" as const,
      top: 57,
      width: 260,
      height: "calc(100vh - 57px)",
      overflowY: "auto" as const,
      padding: "20px 16px",
      borderRight: `1px solid ${colors.border}`,
      backgroundColor: colors.surfaceDefault,
      transition: "background-color 0.3s ease, border-color 0.3s ease",
      flexShrink: 0,
    },
    main: {
      flex: 1,
      padding: "32px 48px",
      maxWidth: 900,
      minHeight: "calc(100vh - 57px)",
    },
    // Section cards
    sectionCard: {
      backgroundColor: colors.surfaceRaised,
      borderRadius: "8px",
      border: `1px solid ${colors.border}`,
      marginBottom: 24,
      overflow: "hidden",
      transition: "all 0.2s ease",
    },
    sectionCardHeader: (expanded: boolean) => ({
      padding: "20px 24px",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: expanded ? colors.surfaceSunken : "transparent",
      transition: "background-color 0.2s ease",
    }),
    sectionCardTitle: {
      fontSize: 20,
      fontWeight: 600,
      color: colors.textDefault,
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    sectionCardIcon: {
      width: 32,
      height: 32,
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
    },
    sectionCardChevron: (expanded: boolean) => ({
      fontSize: 20,
      color: colors.textSubtle,
      transition: "transform 0.2s ease",
      transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
    }),
    sectionCardBody: {
      padding: "0 24px 24px",
      borderTop: `1px solid ${colors.border}`,
    },
    sectionCardContent: {
      paddingTop: 20,
    },
    // Sub-sections within cards
    subSection: {
      marginTop: 24,
      padding: 20,
      backgroundColor: colors.surfaceSunken,
      borderRadius: 6,
      transition: "background-color 0.3s ease",
    },
    subSectionTitle: {
      fontSize: 16,
      fontWeight: 600,
      color: colors.textDefault,
      marginTop: 0,
      marginBottom: 12,
    },
    // Other styles
    paragraph: {
      fontSize: 14,
      lineHeight: 1.7,
      color: colors.textDefault,
      marginBottom: 12,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
      fontSize: 14,
      marginTop: 12,
      marginBottom: 16,
    },
    th: {
      textAlign: "left" as const,
      padding: "12px 16px",
      borderBottom: `2px solid ${colors.border}`,
      backgroundColor: colors.surfaceSunken,
      fontWeight: 600,
      color: colors.textDefault,
      fontSize: 12,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
      transition: "background-color 0.3s ease",
    },
    td: {
      padding: "12px 16px",
      borderBottom: `1px solid ${colors.border}`,
      verticalAlign: "top" as const,
      color: colors.textDefault,
    },
    navItem: (active: boolean) => ({
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      borderRadius: "4px",
      color: active ? colors.blue500 : colors.textSubtle,
      backgroundColor: active ? colors.backgroundSelected : "transparent",
      fontSize: 14,
      textDecoration: "none" as const,
      cursor: "pointer",
      marginBottom: 2,
      fontWeight: active ? 500 : 400,
      transition: "all 0.15s ease",
    }),
    navSection: {
      marginBottom: 20,
    },
    navSectionTitle: {
      fontSize: 11,
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "0.8px",
      color: colors.textSubtlest,
      marginBottom: 8,
      padding: "0 12px",
    },
    pre: {
      backgroundColor: colors.surfaceSunken,
      padding: "16px 20px",
      borderRadius: "4px",
      overflow: "auto" as const,
      fontSize: 13,
      lineHeight: 1.6,
      margin: "16px 0",
      fontFamily: "SFMono-Medium, SF Mono, Segoe UI Mono, Roboto Mono, Ubuntu Mono, Menlo, Consolas, Courier, monospace",
      color: colors.textDefault,
      border: `1px solid ${colors.border}`,
      transition: "background-color 0.3s ease",
    },
    inlineCode: {
      backgroundColor: colors.surfaceSunken,
      padding: "2px 6px",
      borderRadius: "3px",
      fontSize: "0.9em",
      fontFamily: "SFMono-Medium, SF Mono, Segoe UI Mono, Roboto Mono, Ubuntu Mono, Menlo, Consolas, Courier, monospace",
      color: colors.blue500,
    },
    callout: {
      backgroundColor: colors.backgroundBrandBold,
      padding: "20px 24px",
      borderRadius: "4px",
      color: "#FFFFFF",
      marginTop: 16,
      marginBottom: 16,
    },
    calloutText: {
      fontSize: 18,
      fontWeight: 600,
      margin: 0,
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 28,
      height: 28,
      borderRadius: "4px",
      backgroundColor: colors.blue500,
      color: "#FFFFFF",
      fontSize: 14,
    },
    versionBadge: {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "3px",
      backgroundColor: colors.purple500,
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: 600,
      textTransform: "uppercase" as const,
    },
    sectionMessage: (type: "info" | "success" | "warning" | "error") => {
      const bgColors = {
        info: colors.backgroundInformation,
        success: colors.backgroundSuccess,
        warning: colors.backgroundWarning,
        error: colors.backgroundDanger,
      };
      const borderColors = {
        info: colors.blue500,
        success: colors.green500,
        warning: colors.yellow500,
        error: colors.red500,
      };
      return {
        padding: "16px 20px",
        borderRadius: "4px",
        backgroundColor: bgColors[type],
        borderLeft: `4px solid ${borderColors[type]}`,
        marginTop: 16,
        marginBottom: 16,
        transition: "background-color 0.3s ease",
      };
    },
    sectionMessageTitle: {
      fontSize: 14,
      fontWeight: 600,
      color: colors.textDefault,
      marginBottom: 6,
    },
    sectionMessageText: {
      fontSize: 14,
      color: colors.textDefault,
      margin: 0,
      lineHeight: 1.6,
    },
    statusBadge: (status: "success" | "warning" | "info" | "default") => {
      const bgColors = {
        success: colors.green100,
        warning: colors.yellow100,
        info: colors.blue100,
        default: colors.surfaceSunken,
      };
      const textColors = {
        success: colors.green500,
        warning: colors.yellow500,
        info: colors.blue500,
        default: colors.textSubtle,
      };
      return {
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "3px",
        backgroundColor: bgColors[status],
        color: textColors[status],
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase" as const,
      };
    },
    // Quick stats bar
    quickStats: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 16,
      marginBottom: 32,
    },
    quickStat: {
      backgroundColor: colors.surfaceRaised,
      border: `1px solid ${colors.border}`,
      borderRadius: 8,
      padding: "20px 24px",
      textAlign: "center" as const,
      transition: "all 0.2s ease",
    },
    quickStatValue: {
      fontSize: 28,
      fontWeight: 700,
      color: colors.blue500,
      margin: 0,
    },
    quickStatLabel: {
      fontSize: 12,
      color: colors.textSubtle,
      marginTop: 4,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
    },
    // Progress indicator
    progressBar: {
      display: "flex",
      gap: 4,
      marginBottom: 24,
    },
    progressDot: (active: boolean, completed: boolean) => ({
      flex: 1,
      height: 4,
      borderRadius: 2,
      backgroundColor: completed ? colors.green500 : active ? colors.blue500 : colors.border,
      transition: "background-color 0.2s ease",
    }),
  };
}

// ============================================================================
// NAVIGATION DATA
// ============================================================================

const navigationSections = [
  {
    title: "Overview",
    icon: "📋",
    items: [
      { id: "overview", label: "Introduction", icon: "📖" },
    ],
  },
  {
    title: "Core Concepts",
    icon: "🧠",
    items: [
      { id: "matching", label: "Matching System", icon: "🔍" },
      { id: "pipeline", label: "Agent Pipeline", icon: "🤖" },
      { id: "library", label: "Component Library", icon: "📚" },
    ],
  },
  {
    title: "Deep Dives",
    icon: "🔬",
    items: [
      { id: "signatures", label: "5 Signatures", icon: "✍️" },
      { id: "paradigms", label: "9 Paradigms", icon: "🧩" },
      { id: "content", label: "Content Libraries", icon: "📝" },
    ],
  },
];

// ============================================================================
// COLLAPSIBLE SECTION COMPONENT
// ============================================================================

function CollapsibleSection({ 
  id,
  title, 
  icon, 
  iconBg, 
  summary,
  defaultExpanded = false,
  children,
  styles,
  colors,
}: { 
  id: string;
  title: string; 
  icon: string; 
  iconBg: string;
  summary: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  styles: ReturnType<typeof getStyles>;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  
  return (
    <div id={id} style={styles.sectionCard}>
      <div 
        style={styles.sectionCardHeader(expanded)}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={styles.sectionCardTitle}>
          <div style={{ ...styles.sectionCardIcon, backgroundColor: iconBg }}>
            {icon}
          </div>
          <div>
            <span>{title}</span>
            {!expanded && (
              <p style={{ margin: "4px 0 0 0", fontSize: 13, fontWeight: 400, color: colors.textSubtle }}>
                {summary}
              </p>
            )}
          </div>
        </div>
        <span style={styles.sectionCardChevron(expanded)}>▼</span>
      </div>
      {expanded && (
        <div style={styles.sectionCardBody}>
          <div style={styles.sectionCardContent}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ArchitectureContent() {
  const [activeSection, setActiveSection] = useState("overview");
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Helper components
  const Table = ({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) => (
    <table style={styles.table}>
      <thead>
        <tr>{headers.map((h, i) => <th key={i} style={styles.th}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>{row.map((cell, j) => <td key={j} style={styles.td}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );

  const Pre = ({ children }: { children: string }) => <pre style={styles.pre}>{children}</pre>;
  const Code = ({ children }: { children: string }) => <code style={styles.inlineCode}>{children}</code>;

  const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={styles.subSection}>
      <h4 style={styles.subSectionTitle}>{title}</h4>
      {children}
    </div>
  );

  const InfoMessage = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={styles.sectionMessage("info")}>
      <div style={styles.sectionMessageTitle}>ℹ️ {title}</div>
      <div style={styles.sectionMessageText}>{children}</div>
    </div>
  );

  const WarningMessage = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={styles.sectionMessage("warning")}>
      <div style={styles.sectionMessageTitle}>⚠️ {title}</div>
      <div style={styles.sectionMessageText}>{children}</div>
    </div>
  );

  const SuccessMessage = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={styles.sectionMessage("success")}>
      <div style={styles.sectionMessageTitle}>✅ {title}</div>
      <div style={styles.sectionMessageText}>{children}</div>
    </div>
  );

  const ErrorMessage = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={styles.sectionMessage("error")}>
      <div style={styles.sectionMessageTitle}>❌ {title}</div>
      <div style={styles.sectionMessageText}>{children}</div>
    </div>
  );

  const StatusBadge = ({ status, children }: { status: "success" | "warning" | "info" | "default"; children: string }) => (
    <span style={styles.statusBadge(status)}>{children}</span>
  );

  return (
    <div style={styles.page}>
      {/* Navigation Bar */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.navLeft}>
            <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={styles.badge}>⬡</div>
              <h1 style={styles.navTitle}>Generative UI Platform</h1>
            </Link>
            <span style={styles.versionBadge}>v2</span>
            <span style={{ 
              marginLeft: 8, 
              padding: "4px 12px", 
              backgroundColor: colors.blue100, 
              color: colors.blue500, 
              borderRadius: 4, 
              fontSize: 12, 
              fontWeight: 600 
            }}>
              Architecture Docs
            </span>
          </div>
          <div style={styles.navRight}>
            <div style={styles.navLinks}>
              <Link to="/" style={styles.navLink}>Home</Link>
              <Link to="/summary" style={styles.navLink}>Summary</Link>
              <Link to="/resources" style={styles.navLink}>Resources</Link>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div style={styles.layout}>
        {/* Sidebar Navigation */}
        <aside style={styles.sidebar}>
          {navigationSections.map(section => (
            <div key={section.title} style={styles.navSection}>
              <div style={styles.navSectionTitle}>{section.icon} {section.title}</div>
              {section.items.map(item => (
                <div
                  key={item.id}
                  style={styles.navItem(activeSection === item.id)}
                  onClick={() => scrollToSection(item.id)}
                  onMouseEnter={(e) => {
                    if (activeSection !== item.id) {
                      e.currentTarget.style.backgroundColor = colors.surfaceHovered;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== item.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main style={styles.main}>
          {/* Quick Stats */}
          <div style={styles.quickStats}>
            <div style={styles.quickStat}>
              <p style={styles.quickStatValue}>&lt;50ms</p>
              <p style={styles.quickStatLabel}>Retrieval</p>
            </div>
            <div style={styles.quickStat}>
              <p style={styles.quickStatValue}>80%+</p>
              <p style={styles.quickStatLabel}>Cache Hits</p>
            </div>
            <div style={styles.quickStat}>
              <p style={styles.quickStatValue}>5</p>
              <p style={styles.quickStatLabel}>Signatures</p>
            </div>
            <div style={styles.quickStat}>
              <p style={styles.quickStatValue}>9</p>
              <p style={styles.quickStatLabel}>Paradigms</p>
            </div>
          </div>

          {/* OVERVIEW SECTION */}
          <CollapsibleSection
            id="overview"
            title="Introduction"
            icon="📖"
            iconBg={colors.blue100}
            summary="What is the Generative UI Platform?"
            defaultExpanded={true}
            styles={styles}
            colors={colors}
          >
            <p style={styles.paragraph}>
              The <strong>Generative UI Platform</strong> is a system that generates, retrieves, and adapts UI components based on user intent and content structure. It's built on one core insight:
            </p>
            
            <div style={styles.callout}>
              <p style={styles.calloutText}>Generate once, retrieve forever.</p>
            </div>

            <InfoMessage title="Key Reframe">
              This is not "9 ways to generate UI." This is <strong>one unified system with 9 collaborating paradigms</strong> that together form a generative component foundry with institutional memory.
            </InfoMessage>

            <SubSection title="The Problem We're Solving">
              <p style={styles.paragraph}>Traditional approaches to UI generation are slow and don't learn:</p>
              <ErrorMessage title="The Old Model">
                Content → Classify → Pick from fixed components → Configure
                <br /><span style={{ fontSize: 12, color: colors.textSubtle }}>Limited, slow, doesn't learn</span>
              </ErrorMessage>
              
              <SuccessMessage title="The New Model">
                Content + Intent → Match → Adapt or Generate → Reusable Artifact
                <br /><span style={{ fontSize: 12, color: colors.textSubtle }}>Fast, learns, builds institutional memory</span>
              </SuccessMessage>
            </SubSection>

            <SubSection title="Performance Targets">
              <Table
                headers={["Scenario", "Latency", "Mechanism"]}
                rows={[
                  [<StatusBadge status="success">EXACT MATCH</StatusBadge>, "< 50ms", "Local cache lookup by spec signature"],
                  [<StatusBadge status="info">ADAPT EXISTING</StatusBadge>, "< 200ms", "Field remapping, no code change"],
                  [<StatusBadge status="warning">GENERATE NEW</StatusBadge>, "2-5s", "LLM generation (cached forever after)"],
                ]}
              />
              <p style={styles.paragraph}>
                <strong>Design principle:</strong> The system should retrieve 80%+ of requests. Generation is the fallback, not the default.
              </p>
            </SubSection>
          </CollapsibleSection>

          {/* MATCHING SYSTEM */}
          <CollapsibleSection
            id="matching"
            title="Matching System"
            icon="🔍"
            iconBg={colors.purple100}
            summary="How components are found and matched"
            styles={styles}
            colors={colors}
          >
            <p style={styles.paragraph}>
              The matching system is the <strong>heart of the architecture</strong>. Given a user's intent and content schema, it finds the best existing component—or determines that generation is necessary.
            </p>

            <WarningMessage title="Key Insight">
              We can't read 1000 lines of React to decide if a component fits. Every component has a <strong>Matching Spec</strong>—a structured description of what it does, separate from how it's implemented.
            </WarningMessage>

            <SubSection title="The ComponentMatchingSpec">
              <p style={styles.paragraph}>Every component has five signatures that enable fast matching:</p>
              <Table
                headers={["Signature", "What It Describes", "Example"]}
                rows={[
                  [<strong>Intent</strong>, "What the user wants to accomplish", "view, compare, track, edit"],
                  [<strong>Schema</strong>, "Shape of content it handles", "title, status, date fields"],
                  [<strong>Capability</strong>, "Operations it supports", "filter, sort, group, edit"],
                  [<strong>Affordance</strong>, "User interactions exposed", "click, drag, keyboard"],
                  [<strong>Visual</strong>, "Look and feel", "compact, comfortable, spacious"],
                ]}
              />
            </SubSection>

            <SubSection title="Matching Algorithm">
              <Pre>{`score = (intent × 0.4) + (schema × 0.4) + (capability × 0.15) + (visual × 0.05)`}</Pre>
              <Table
                headers={["Score Range", "Decision", "Action"]}
                rows={[
                  [<StatusBadge status="success">≥ 0.9</StatusBadge>, "Direct Retrieve", "Use component as-is"],
                  [<StatusBadge status="info">0.7 - 0.9</StatusBadge>, "Adapt", "Remap fields, adjust config"],
                  [<StatusBadge status="warning">0.5 - 0.7</StatusBadge>, "Consider Generate", "May adapt or generate"],
                  [<StatusBadge status="default">&lt; 0.5</StatusBadge>, "Generate", "Create new component"],
                ]}
              />
            </SubSection>

            <SubSection title="Field Mapping">
              <p style={styles.paragraph}>
                <strong>Challenge:</strong> User has <Code>Workflow Stage</Code>, component expects <Code>status</Code>.
              </p>
              <ol style={{ paddingLeft: 20, marginTop: 12 }}>
                <li style={styles.paragraph}><strong>Role-based matching:</strong> Both are <Code>role: status</Code> → automatic match</li>
                <li style={styles.paragraph}><strong>Name similarity:</strong> "Workflow Stage" ≈ "Status" via embedding similarity</li>
                <li style={styles.paragraph}><strong>Type compatibility:</strong> Both are <Code>type: select</Code> → compatible</li>
                <li style={styles.paragraph}><strong>User confirmation:</strong> Uncertain mappings flagged for confirmation</li>
              </ol>
            </SubSection>
          </CollapsibleSection>

          {/* AGENT PIPELINE */}
          <CollapsibleSection
            id="pipeline"
            title="Agent Pipeline"
            icon="🤖"
            iconBg={colors.green100}
            summary="5 agents that transform requests into UI"
            styles={styles}
            colors={colors}
          >
            <p style={styles.paragraph}>
              The agent pipeline transforms user input into rendered UI through five specialized agents.
            </p>

            <InfoMessage title="Key Principle">
              Minimize LLM usage. Only Agent 1 (parsing) and Agent 4 (generation) require LLM. Agents 2, 3, and 5 are deterministic.
            </InfoMessage>

            <Pre>{`User Input
     │
     ▼
┌─────────────────┐
│ AGENT 1: PARSER │  LLM for novel, rules for common
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ AGENT 2: MATCHER│  Pure retrieval, no LLM
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
SCORE ≥ 0.7  SCORE < 0.7
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│ ADAPTER│ │GENERATOR │  LLM generation
└────────┘ └──────────┘
    │         │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│ VALIDATOR       │  Deterministic checks
└────────┬────────┘
         │
         ▼
  Rendered Component`}</Pre>

            <SubSection title="Agent 1: Intent Parser">
              <Table
                headers={["Aspect", "Details"]}
                rows={[
                  ["Responsibility", "Transform natural language into structured signatures"],
                  ["LLM Usage", "Only for novel requests; rules for common patterns"],
                  ["Output", "IntentSignature + SchemaSignature"],
                ]}
              />
            </SubSection>

            <SubSection title="Agent 2: Matcher">
              <Table
                headers={["Aspect", "Details"]}
                rows={[
                  ["Responsibility", "Find best existing component for parsed intent"],
                  ["LLM Usage", "None—pure retrieval + scoring"],
                  ["Latency", "< 50ms"],
                ]}
              />
            </SubSection>

            <SubSection title="Agent 3: Adapter">
              <Table
                headers={["Aspect", "Details"]}
                rows={[
                  ["Responsibility", "Configure existing component for different content"],
                  ["LLM Usage", "None—deterministic field mapping"],
                  ["Adaptations", "Field remapping, config adjustment, capability limiting"],
                ]}
              />
            </SubSection>

            <SubSection title="Agent 4: Generator">
              <Table
                headers={["Aspect", "Details"]}
                rows={[
                  ["Responsibility", "Create new component when no match exists"],
                  ["LLM Usage", "Yes—but result cached forever"],
                  ["Output", "React/TSX code + MatchingSpec"],
                ]}
              />
            </SubSection>

            <SubSection title="Agent 5: Validator">
              <Table
                headers={["Aspect", "Details"]}
                rows={[
                  ["Responsibility", "Ensure output is safe and correct"],
                  ["LLM Usage", "None—deterministic checks"],
                  ["Checks", "Grammar (Atlaskit), Constraints (a11y), Security"],
                ]}
              />
            </SubSection>
          </CollapsibleSection>

          {/* COMPONENT LIBRARY */}
          <CollapsibleSection
            id="library"
            title="Component Library"
            icon="📚"
            iconBg={colors.teal100}
            summary="Institutional memory for generated components"
            styles={styles}
            colors={colors}
          >
            <p style={styles.paragraph}>
              The Component Library is the <strong>institutional memory</strong> of the system. Every generated component is stored here with its MatchingSpec.
            </p>

            <SubSection title="Component Entry Schema">
              <Pre>{`interface ComponentEntry {
  id: string;
  version: string;
  name: string;
  source: { code: string; language: 'tsx'; };
  matchingSpec: ComponentMatchingSpec;
  provenance: {
    createdAt: Date;
    createdBy: 'system' | 'user' | 'third-party';
    method: 'generated' | 'imported' | 'forked';
  };
  stats: { useCount: number; userRating?: number; };
  status: 'active' | 'deprecated' | 'draft';
}`}</Pre>
            </SubSection>

            <SubSection title="Versioning Philosophy">
              <ol style={{ paddingLeft: 20, marginTop: 12 }}>
                <li style={styles.paragraph}><strong>A component's purpose never changes.</strong> Purpose change = new component.</li>
                <li style={styles.paragraph}><strong>Versions have slight spec differences.</strong> Same code, minor spec variations.</li>
                <li style={styles.paragraph}><strong>Adaptation ≠ New version.</strong> Runtime config doesn't require version change.</li>
              </ol>
            </SubSection>

            <SubSection title="Component Lifecycle">
              <Pre>{`1. GENERATE → Code + MatchingSpec
2. VALIDATE → Passes all checks
3. DRAFT → Only visible to creator
4. ACTIVATE → Visible to all users
5. USAGE → Stats updated
6. DEPRECATE → Still retrievable, not suggested`}</Pre>
            </SubSection>
          </CollapsibleSection>

          {/* 5 SIGNATURES */}
          <CollapsibleSection
            id="signatures"
            title="The 5 Signatures"
            icon="✍️"
            iconBg={colors.yellow100}
            summary="Detailed breakdown of matching signatures"
            styles={styles}
            colors={colors}
          >
            <SubSection title="1. Intent Signature">
              <p style={styles.paragraph}>What the user wants to <strong>accomplish</strong>.</p>
              <Table
                headers={["Goal", "Description", "Example Request"]}
                rows={[
                  [<Code>view</Code>, "See information", "\"Show me the tasks\""],
                  [<Code>compare</Code>, "Side-by-side", "\"Compare these two versions\""],
                  [<Code>track</Code>, "Monitor progress", "\"Track status of my items\""],
                  [<Code>organize</Code>, "Arrange/categorize", "\"Group by status\""],
                  [<Code>find</Code>, "Search/filter", "\"Find overdue tasks\""],
                  [<Code>edit</Code>, "Modify content", "\"Let me update these\""],
                  [<Code>summarize</Code>, "Overview/aggregate", "\"Summary of project status\""],
                ]}
              />
              <p style={{ ...styles.paragraph, marginTop: 16 }}><strong>Layouts:</strong></p>
              <Table
                headers={["Layout", "Description", "Component"]}
                rows={[
                  [<Code>grouped</Code>, "Items in buckets", "Kanban board"],
                  [<Code>sequential</Code>, "Items in order", "List, table"],
                  [<Code>grid</Code>, "Items in 2D", "Gallery"],
                  [<Code>hierarchical</Code>, "Nested items", "Tree"],
                  [<Code>timeline</Code>, "On time axis", "Calendar"],
                  [<Code>freeform</Code>, "Free placement", "Whiteboard"],
                ]}
              />
            </SubSection>

            <SubSection title="2. Schema Signature">
              <p style={styles.paragraph}>What <strong>shape of content</strong> the component handles.</p>
              <Table
                headers={["Role", "Description", "Example"]}
                rows={[
                  [<Code>identifier</Code>, "Unique ID", "Task ID"],
                  [<Code>title</Code>, "Primary label", "Task name"],
                  [<Code>status</Code>, "Workflow state", "To Do / Done"],
                  [<Code>category</Code>, "Classification", "Type, tag"],
                  [<Code>date</Code>, "Single date", "Due date"],
                  [<Code>person</Code>, "User reference", "Assignee"],
                  [<Code>priority</Code>, "Importance", "P1, P2, P3"],
                  [<Code>numeric</Code>, "Number value", "Story points"],
                ]}
              />
            </SubSection>

            <SubSection title="3. Capability Signature">
              <p style={styles.paragraph}>What the component can <strong>do</strong>.</p>
              <Table
                headers={["Capability", "Type", "Description"]}
                rows={[
                  [<Code>canFilter</Code>, "boolean", "Filter items by criteria"],
                  [<Code>canSort</Code>, "boolean", "Reorder by field"],
                  [<Code>canGroup</Code>, "boolean", "Group by field"],
                  [<Code>canEditInline</Code>, "boolean", "Edit without modal"],
                  [<Code>canReorder</Code>, "boolean", "Drag to reorder"],
                  [<Code>canCreate</Code>, "boolean", "Add new items"],
                  [<Code>canDelete</Code>, "boolean", "Remove items"],
                  [<Code>canSelect</Code>, "boolean", "Multi-select"],
                ]}
              />
            </SubSection>

            <SubSection title="4. Affordance Signature">
              <p style={styles.paragraph}>What <strong>interactions</strong> are exposed.</p>
              <Table
                headers={["Field", "Type", "Values"]}
                rows={[
                  [<Code>trigger</Code>, "enum", "click, doubleClick, drag, hover, contextMenu, keyboard"],
                  [<Code>target</Code>, "enum", "item, field, group, container, header"],
                  [<Code>action</Code>, "string", "What happens on trigger"],
                  [<Code>contentEffect</Code>, "enum?", "update, create, delete, reorder"],
                ]}
              />
            </SubSection>

            <SubSection title="5. Visual Signature">
              <p style={styles.paragraph}>The <strong>look and feel</strong>.</p>
              <Table
                headers={["Field", "Type", "Options"]}
                rows={[
                  [<Code>density</Code>, "enum", "compact | comfortable | spacious"],
                  [<Code>chrome</Code>, "enum", "minimal | standard | rich"],
                  [<Code>emphasis</Code>, "array", "How fields are highlighted"],
                  [<Code>responsive</Code>, "object", "Mobile/tablet behavior"],
                ]}
              />
            </SubSection>
          </CollapsibleSection>

          {/* 9 PARADIGMS */}
          <CollapsibleSection
            id="paradigms"
            title="The 9 Paradigms"
            icon="🧩"
            iconBg={colors.purple100}
            summary="Collaborating layers in the unified system"
            styles={styles}
            colors={colors}
          >
            <p style={styles.paragraph}>
              The 9 paradigms are <strong>collaborating layers</strong> within a unified architecture. Each contributes at a specific pipeline stage.
            </p>

            <Table
              headers={["Paradigm", "Role", "Stage"]}
              rows={[
                [<strong>Lens</strong>, "User-facing specification language", "Input"],
                [<strong>Compilation</strong>, "Fast path templates for known patterns", "Generation"],
                [<strong>Grammar</strong>, "Ensures valid Atlaskit composition", "Validation"],
                [<strong>Constraint</strong>, "A11y and responsive requirements", "Validation"],
                [<strong>Dataflow</strong>, "Reactive binding via signals", "Rendering"],
                [<strong>Negotiation</strong>, "User feedback refinement loop", "Post-render"],
                [<strong>Simulation</strong>, "Validate with synthetic users", "Background"],
                [<strong>Evolutionary</strong>, "Track what works, improve library", "Background"],
                [<strong>Marketplace</strong>, "Third-party contributions", "Library"],
              ]}
            />

            <SubSection title="Lens Paradigm">
              <p style={styles.paragraph}>The user-facing language for expressing intent. The LensSpec is what users create, share, and refine.</p>
              <Pre>{`{
  "view": "grouped",
  "groupBy": "status",
  "show": ["title", "assignee", "dueDate"],
  "filter": { "project": "current" },
  "sort": { "field": "dueDate", "order": "asc" }
}`}</Pre>
            </SubSection>

            <SubSection title="Compilation Paradigm">
              <p style={styles.paragraph}>Template-based generation for known patterns. When recognizing common patterns, uses pre-defined templates instead of full LLM generation—faster and more predictable.</p>
            </SubSection>

            <SubSection title="Grammar & Constraint Paradigms">
              <p style={styles.paragraph}><strong>Grammar:</strong> Defines valid Atlaskit compositions—what components can contain what, valid prop combinations.</p>
              <p style={styles.paragraph}><strong>Constraint:</strong> Ensures accessibility and responsive requirements are met:</p>
              <ul style={{ paddingLeft: 20 }}>
                <li style={styles.paragraph}>Color contrast meets WCAG AA</li>
                <li style={styles.paragraph}>Interactive elements keyboard accessible</li>
                <li style={styles.paragraph}>Tables have proper headers</li>
                <li style={styles.paragraph}>Components work at mobile breakpoints</li>
              </ul>
            </SubSection>

            <SubSection title="Dataflow Paradigm">
              <p style={styles.paragraph}>Live updates when content changes via signals. Components subscribe to changes and update reactively without full re-renders.</p>
            </SubSection>

            <SubSection title="Negotiation Paradigm">
              <p style={styles.paragraph}>User corrects, system refines through feedback loop:</p>
              <Table
                headers={["Feedback", "Response"]}
                rows={[
                  ["\"Wrong field for title\"", "Update field mapping"],
                  ["\"Make it more compact\"", "Adjust density setting"],
                  ["\"Add filtering\"", "Enable filter capability"],
                ]}
              />
            </SubSection>

            <SubSection title="Background Paradigms">
              <p style={styles.paragraph}><strong>Simulation:</strong> Validate new components with simulated user journeys before promotion.</p>
              <p style={styles.paragraph}><strong>Evolutionary:</strong> Track metrics (usage, ratings, correction frequency) to improve library over time.</p>
              <p style={styles.paragraph}><strong>Marketplace:</strong> Third-party and user contributions—import, fork, share components.</p>
            </SubSection>
          </CollapsibleSection>

          {/* CONTENT LIBRARIES */}
          <CollapsibleSection
            id="content"
            title="Content Libraries"
            icon="📝"
            iconBg={colors.green100}
            summary="tldraw, Tiptap, TanStack Table integration"
            styles={styles}
            colors={colors}
          >
            <p style={styles.paragraph}>
              We use battle-tested libraries for core editing. AI generates the <strong>chrome around these libraries</strong>—not the core editing experience.
            </p>

            <SubSection title="tldraw (Whiteboard)">
              <p style={styles.paragraph}><strong>Core (provided):</strong> Canvas, shapes, zoom, pan, selection</p>
              <p style={styles.paragraph}><strong>AI generates:</strong></p>
              <ul style={{ paddingLeft: 20 }}>
                <li style={styles.paragraph}>Custom toolbars with context-specific tools</li>
                <li style={styles.paragraph}>Shape palettes for specific use cases</li>
                <li style={styles.paragraph}>Sidebars showing shape metadata</li>
                <li style={styles.paragraph}>Export/share panels</li>
                <li style={styles.paragraph}>AI features (auto-layout, smart shapes)</li>
              </ul>
            </SubSection>

            <SubSection title="Tiptap (Rich Text)">
              <p style={styles.paragraph}><strong>Core (provided):</strong> Text editing, formatting, cursor management</p>
              <p style={styles.paragraph}><strong>AI generates:</strong></p>
              <ul style={{ paddingLeft: 20 }}>
                <li style={styles.paragraph}>Custom toolbars for different contexts</li>
                <li style={styles.paragraph}>Slash command menus</li>
                <li style={styles.paragraph}>Block handles and drag-drop</li>
                <li style={styles.paragraph}>Reading mode layouts</li>
                <li style={styles.paragraph}>AI features (summarize, expand, rewrite)</li>
              </ul>
            </SubSection>

            <SubSection title="TanStack Table (Database)">
              <p style={styles.paragraph}><strong>Core (provided):</strong> Sorting, filtering, pagination logic (headless)</p>
              <p style={styles.paragraph}><strong>AI generates (full visual):</strong></p>
              <ul style={{ paddingLeft: 20 }}>
                <li style={styles.paragraph}>Table view (traditional spreadsheet)</li>
                <li style={styles.paragraph}>Kanban view (cards in columns)</li>
                <li style={styles.paragraph}>Calendar view (timeline layout)</li>
                <li style={styles.paragraph}>Gallery view (card grid)</li>
                <li style={styles.paragraph}>Custom cell renderers</li>
                <li style={styles.paragraph}>Filter/sort UI</li>
              </ul>
            </SubSection>
          </CollapsibleSection>

          {/* Footer */}
          <div style={{ 
            borderTop: `1px solid ${colors.border}`, 
            marginTop: 32, 
            paddingTop: 24,
            textAlign: "center" as const,
          }}>
            <p style={{ fontSize: 13, color: colors.textSubtlest, margin: 0 }}>
              Generative UI Platform Documentation • Built with Atlaskit Design System
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
