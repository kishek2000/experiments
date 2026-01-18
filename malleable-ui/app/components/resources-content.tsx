"use client";

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { useTheme } from "../context/theme-context";
import { ThemeToggle } from "./theme-toggle";
import {
  getAllProgress,
  toggleCompleted,
  updateNotes,
  generateResourceId,
  type ResourceProgress,
} from "../utils/resources-db";

// Resource categories and items
const resourceCategories = [
  {
    id: "foundational",
    title: "Foundational Research",
    icon: "📚",
    description: "Essential reading to understand the core concepts of malleable software and generative UI",
    resources: [
      {
        title: "Malleable Software",
        source: "Ink & Switch",
        url: "https://www.inkandswitch.com/essay/malleable-software/",
        description: "The seminal essay on malleable software - exploring how software can be modified and customized by end-users. Discusses the spectrum from rigid applications to fully programmable systems.",
        tags: ["essay", "foundational", "end-user programming"],
        readTime: "45 min",
        difficulty: "intermediate",
      },
      {
        title: "Local-First Software",
        source: "Ink & Switch",
        url: "https://www.inkandswitch.com/local-first/",
        description: "Explores principles for building software that works offline-first while still enabling collaboration. Key concepts for malleable, user-owned data.",
        tags: ["essay", "collaboration", "CRDTs"],
        readTime: "60 min",
        difficulty: "intermediate",
      },
      {
        title: "End-User Programming",
        source: "MIT CSAIL",
        url: "https://www.cs.cmu.edu/~NatProg/papers/Myers2017EndUserProgramming.pdf",
        description: "Academic survey of end-user programming research - the field that studies how non-programmers can create and modify software.",
        tags: ["academic", "survey", "end-user programming"],
        readTime: "90 min",
        difficulty: "advanced",
      },
      {
        title: "Learnable Programming",
        source: "Bret Victor",
        url: "http://worrydream.com/LearnableProgramming/",
        description: "Bret Victor's influential essay on how programming environments should be designed to help people understand what they're creating.",
        tags: ["essay", "programming environments", "visualization"],
        readTime: "30 min",
        difficulty: "beginner",
      },
    ],
  },
  {
    id: "generative-ui",
    title: "Generative UI & AI Interfaces",
    icon: "🤖",
    description: "Research and tools for AI-generated user interfaces",
    resources: [
      {
        title: "A2UI: Agent-to-User Interface",
        source: "Google",
        url: "https://a2ui.org/",
        description: "Google's open protocol for agent-driven UIs. Agents send declarative JSON describing components; clients render using native widgets. Security-first, framework-agnostic, supports streaming.",
        tags: ["protocol", "specification", "agents"],
        readTime: "30 min",
        difficulty: "intermediate",
        highlight: true,
      },
      {
        title: "Introducing A2UI",
        source: "Google Developers Blog",
        url: "https://developers.googleblog.com/introducing-a2ui-an-open-project-for-agent-driven-interfaces/",
        description: "Official announcement of A2UI explaining the motivation, architecture, and use cases for agent-generated interfaces.",
        tags: ["blog", "announcement", "overview"],
        readTime: "15 min",
        difficulty: "beginner",
      },
      {
        title: "A2UI GitHub Repository",
        source: "Google",
        url: "https://github.com/google/A2UI",
        description: "Open source specification, renderers, and examples for building A2UI-compatible applications. Apache 2.0 licensed.",
        tags: ["code", "open source", "implementation"],
        readTime: "varies",
        difficulty: "intermediate",
      },
      {
        title: "Stitch: AI UI Generation",
        source: "Google Labs",
        url: "https://labs.google/stitch",
        description: "Google Labs tool that generates UI designs and frontend code from prompts or sketches. Supports variant generation, theme options, and Figma export.",
        tags: ["tool", "design", "code generation"],
        readTime: "hands-on",
        difficulty: "beginner",
      },
      {
        title: "Vercel AI SDK - Generative UI",
        source: "Vercel",
        url: "https://sdk.vercel.ai/docs/ai-sdk-rsc/generative-ui",
        description: "Documentation for building generative UI with React Server Components. Stream UI components from the server in response to user prompts.",
        tags: ["documentation", "React", "streaming"],
        readTime: "20 min",
        difficulty: "intermediate",
      },
      {
        title: "v0 by Vercel",
        source: "Vercel",
        url: "https://v0.dev/",
        description: "AI-powered UI generation tool that creates React components from natural language descriptions. Uses shadcn/ui components.",
        tags: ["tool", "React", "code generation"],
        readTime: "hands-on",
        difficulty: "beginner",
      },
    ],
  },
  {
    id: "research-labs",
    title: "Research Labs & Projects",
    icon: "🔬",
    description: "Leading research groups working on malleable software and end-user programming",
    resources: [
      {
        title: "Ink & Switch",
        source: "Research Lab",
        url: "https://www.inkandswitch.com/",
        description: "Industrial research lab exploring the future of computing. Known for local-first software, CRDTs (Automerge), and malleable software research.",
        tags: ["lab", "research", "local-first"],
        readTime: "varies",
        difficulty: "all levels",
        highlight: true,
      },
      {
        title: "Potluck",
        source: "Ink & Switch",
        url: "https://www.inkandswitch.com/potluck/",
        description: "Research project on dynamic software that learns from user examples. Shows how AI can help bridge the gap between user intent and system behavior.",
        tags: ["project", "AI", "examples"],
        readTime: "30 min",
        difficulty: "intermediate",
      },
      {
        title: "Crosscut",
        source: "Ink & Switch",
        url: "https://www.inkandswitch.com/crosscut/",
        description: "Exploration of drawing dynamic objects that connect to live data. Blurs the line between sketching and programming.",
        tags: ["project", "drawing", "live data"],
        readTime: "25 min",
        difficulty: "intermediate",
      },
      {
        title: "Automerge",
        source: "Ink & Switch",
        url: "https://automerge.org/",
        description: "CRDT library for building collaborative, local-first applications. Essential infrastructure for malleable software that syncs across devices.",
        tags: ["library", "CRDTs", "collaboration"],
        readTime: "45 min",
        difficulty: "advanced",
      },
      {
        title: "Geoffrey Litt's Research",
        source: "MIT / Ink & Switch",
        url: "https://www.geoffreylitt.com/",
        description: "Researcher working on malleable software and end-user programming. Key papers on Wildcard, spreadsheet-driven customization, and more.",
        tags: ["researcher", "academic", "malleable software"],
        readTime: "varies",
        difficulty: "intermediate",
      },
      {
        title: "Webstrates",
        source: "Aarhus University",
        url: "https://webstrates.net/",
        description: "Research platform for creating malleable, collaborative web applications. Documents that are also applications.",
        tags: ["platform", "collaboration", "web"],
        readTime: "30 min",
        difficulty: "intermediate",
      },
    ],
  },
  {
    id: "industry-tools",
    title: "Industry Tools & Platforms",
    icon: "🛠️",
    description: "Production tools that embody malleable software principles",
    resources: [
      {
        title: "Notion",
        source: "Notion Labs",
        url: "https://www.notion.so/",
        description: "All-in-one workspace that exemplifies malleable software - users can create databases, documents, and custom views without coding.",
        tags: ["product", "workspace", "no-code"],
        readTime: "hands-on",
        difficulty: "beginner",
      },
      {
        title: "Airtable",
        source: "Airtable",
        url: "https://airtable.com/",
        description: "Spreadsheet-database hybrid that allows end-users to build custom applications. Strong example of malleable data structures.",
        tags: ["product", "database", "no-code"],
        readTime: "hands-on",
        difficulty: "beginner",
      },
      {
        title: "Retool",
        source: "Retool",
        url: "https://retool.com/",
        description: "Platform for building internal tools quickly. Demonstrates how pre-built components can be composed into custom applications.",
        tags: ["product", "internal tools", "low-code"],
        readTime: "hands-on",
        difficulty: "intermediate",
      },
      {
        title: "Cursor",
        source: "Anysphere",
        url: "https://cursor.com/",
        description: "AI-first code editor that demonstrates how AI can assist in code generation and modification. Relevant for understanding AI-assisted development.",
        tags: ["product", "IDE", "AI"],
        readTime: "hands-on",
        difficulty: "intermediate",
      },
      {
        title: "Claude Artifacts",
        source: "Anthropic",
        url: "https://www.anthropic.com/claude",
        description: "Claude's ability to generate interactive artifacts (code, diagrams, apps) in response to prompts. Key example of AI-generated UI.",
        tags: ["product", "AI", "generation"],
        readTime: "hands-on",
        difficulty: "beginner",
      },
      {
        title: "tldraw",
        source: "tldraw",
        url: "https://tldraw.dev/",
        description: "Open-source infinite canvas library. Example of how collaborative drawing can be embedded in applications. Also has AI features.",
        tags: ["library", "canvas", "collaboration"],
        readTime: "30 min",
        difficulty: "intermediate",
      },
    ],
  },
  {
    id: "design-systems",
    title: "Design Systems & Component Libraries",
    icon: "🎨",
    description: "Building blocks for generative UI - the primitives AI systems compose",
    resources: [
      {
        title: "Atlaskit Design System",
        source: "Atlassian",
        url: "https://atlassian.design/",
        description: "Atlassian's design system and React component library. The primitives we use in this project for AI to compose into generated UIs.",
        tags: ["design system", "React", "components"],
        readTime: "varies",
        difficulty: "intermediate",
        highlight: true,
      },
      {
        title: "Radix UI",
        source: "WorkOS",
        url: "https://www.radix-ui.com/",
        description: "Unstyled, accessible UI primitives for building design systems. Foundation for shadcn/ui used by v0.",
        tags: ["library", "primitives", "accessibility"],
        readTime: "varies",
        difficulty: "intermediate",
      },
      {
        title: "shadcn/ui",
        source: "shadcn",
        url: "https://ui.shadcn.com/",
        description: "Copy-paste component library built on Radix. Popular choice for AI-generated UIs due to its simplicity and customizability.",
        tags: ["library", "components", "Tailwind"],
        readTime: "varies",
        difficulty: "beginner",
      },
      {
        title: "Design Tokens",
        source: "W3C",
        url: "https://www.w3.org/community/design-tokens/",
        description: "W3C community group working on design token standards. Important for how AI understands and applies design decisions.",
        tags: ["specification", "tokens", "standards"],
        readTime: "45 min",
        difficulty: "intermediate",
      },
    ],
  },
  {
    id: "academic",
    title: "Academic Research",
    icon: "🎓",
    description: "Academic papers and conferences on HCI, end-user programming, and AI interfaces",
    resources: [
      {
        title: "CHI Conference",
        source: "ACM SIGCHI",
        url: "https://chi.acm.org/",
        description: "Premier conference on Human-Computer Interaction. Many foundational papers on end-user programming and adaptive interfaces.",
        tags: ["conference", "HCI", "research"],
        readTime: "varies",
        difficulty: "advanced",
      },
      {
        title: "UIST Conference",
        source: "ACM",
        url: "https://uist.acm.org/",
        description: "Symposium on User Interface Software and Technology. Cutting-edge research on novel interaction techniques and UI systems.",
        tags: ["conference", "UI", "research"],
        readTime: "varies",
        difficulty: "advanced",
      },
      {
        title: "Programming Experience Workshop",
        source: "PX",
        url: "https://programming-experience.org/",
        description: "Workshop series on programming experience. Focus on making programming more accessible and enjoyable.",
        tags: ["workshop", "programming", "experience"],
        readTime: "varies",
        difficulty: "intermediate",
      },
      {
        title: "LIVE Workshop",
        source: "LIVE",
        url: "https://liveprog.org/",
        description: "Workshop on Live Programming. Research on systems where code changes take effect immediately, enabling tighter feedback loops.",
        tags: ["workshop", "live programming", "feedback"],
        readTime: "varies",
        difficulty: "intermediate",
      },
    ],
  },
];

// Curated reading paths
const readingPaths = [
  {
    id: "quickstart",
    title: "Quick Start (2 hours)",
    description: "Essential reads to understand the landscape",
    icon: "⚡",
    resources: [
      "Malleable Software",
      "Introducing A2UI",
      "Learnable Programming",
    ],
  },
  {
    id: "deep-dive",
    title: "Deep Dive (1 week)",
    description: "Comprehensive understanding of the field",
    icon: "🏊",
    resources: [
      "Malleable Software",
      "Local-First Software",
      "A2UI: Agent-to-User Interface",
      "Potluck",
      "End-User Programming",
      "Automerge",
    ],
  },
  {
    id: "builder",
    title: "Builder Path",
    description: "Focus on implementation and tools",
    icon: "🔨",
    resources: [
      "A2UI GitHub Repository",
      "Vercel AI SDK - Generative UI",
      "Atlaskit Design System",
      "tldraw",
      "Automerge",
    ],
  },
];

// Get all resource titles as a flat list
const allResourceTitles = resourceCategories.flatMap(cat => 
  cat.resources.map(r => r.title)
);

function getStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return {
    page: {
      minHeight: "100vh",
      backgroundColor: colors.backgroundDefault,
      color: colors.textDefault,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    nav: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      height: 64,
      backgroundColor: colors.backgroundDefault,
      borderBottom: `1px solid ${colors.border}`,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
    },
    navInner: {
      maxWidth: 1400,
      width: "100%",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    navLeft: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    navTitle: {
      fontSize: 18,
      fontWeight: 600,
      color: colors.textDefault,
      margin: 0,
    },
    badge: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.backgroundBrandBold,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: 16,
    },
    versionBadge: {
      fontSize: 11,
      fontWeight: 600,
      backgroundColor: colors.purple100,
      color: colors.purple700,
      padding: "2px 8px",
      borderRadius: 4,
    },
    resourcesBadge: {
      fontSize: 11,
      fontWeight: 600,
      backgroundColor: colors.teal100,
      color: colors.teal700,
      padding: "2px 8px",
      borderRadius: 4,
    },
    navRight: {
      display: "flex",
      alignItems: "center",
      gap: 16,
    },
    navLinks: {
      display: "flex",
      gap: 8,
    },
    navLink: {
      color: colors.textSubtle,
      textDecoration: "none",
      fontSize: 14,
      fontWeight: 500,
      padding: "6px 12px",
      borderRadius: 6,
      transition: "background-color 0.2s ease",
    },
    main: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "88px 24px 48px",
    },
    hero: {
      textAlign: "center" as const,
      marginBottom: 32,
      padding: "32px 0",
    },
    heroTitle: {
      fontSize: 42,
      fontWeight: 700,
      color: colors.textDefault,
      margin: "0 0 16px 0",
      lineHeight: 1.2,
    },
    heroSubtitle: {
      fontSize: 18,
      color: colors.textSubtle,
      maxWidth: 700,
      margin: "0 auto 24px",
      lineHeight: 1.6,
    },
    progressBar: {
      maxWidth: 500,
      margin: "0 auto",
      padding: "16px 24px",
      backgroundColor: colors.surfaceRaised,
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
    },
    progressHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    progressLabel: {
      fontSize: 14,
      fontWeight: 500,
      color: colors.textDefault,
    },
    progressPercent: {
      fontSize: 14,
      fontWeight: 600,
      color: colors.green500,
    },
    progressTrack: {
      height: 8,
      backgroundColor: colors.backgroundNeutral,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: (percent: number) => ({
      height: "100%",
      width: `${percent}%`,
      backgroundColor: colors.green500,
      borderRadius: 4,
      transition: "width 0.3s ease",
    }),
    pathsSection: {
      marginBottom: 48,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 600,
      color: colors.textDefault,
      marginBottom: 24,
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    pathsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: 16,
    },
    pathCard: (isSelected: boolean) => ({
      backgroundColor: isSelected ? colors.backgroundSelected : colors.surfaceDefault,
      border: `2px solid ${isSelected ? colors.blue500 : colors.border}`,
      borderRadius: 12,
      padding: 24,
      transition: "all 0.2s ease",
      cursor: "pointer",
    }),
    pathCardHeader: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
    },
    pathIcon: {
      fontSize: 24,
    },
    pathTitle: {
      fontSize: 18,
      fontWeight: 600,
      color: colors.textDefault,
      margin: 0,
    },
    pathDescription: {
      fontSize: 14,
      color: colors.textSubtle,
      margin: "0 0 16px 0",
      lineHeight: 1.5,
    },
    pathResources: {
      display: "flex",
      flexWrap: "wrap" as const,
      gap: 6,
    },
    pathResourceTag: (isHighlighted: boolean, isCompleted: boolean) => ({
      fontSize: 12,
      backgroundColor: isCompleted ? colors.green100 : isHighlighted ? colors.blue100 : colors.backgroundNeutral,
      color: isCompleted ? colors.green700 : isHighlighted ? colors.blue600 : colors.textSubtle,
      padding: "4px 8px",
      borderRadius: 4,
      textDecoration: isCompleted ? "line-through" : "none",
    }),
    pathProgress: {
      marginTop: 12,
      fontSize: 12,
      color: colors.textSubtle,
    },
    filterInfo: {
      padding: "12px 16px",
      backgroundColor: colors.blue50,
      border: `1px solid ${colors.blue200}`,
      borderRadius: 8,
      marginBottom: 24,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    filterText: {
      fontSize: 14,
      color: colors.blue600,
      margin: 0,
    },
    clearFilterBtn: {
      fontSize: 13,
      color: colors.blue600,
      background: "none",
      border: "none",
      cursor: "pointer",
      textDecoration: "underline",
    },
    categorySection: {
      marginBottom: 48,
    },
    categoryHeader: {
      marginBottom: 24,
    },
    categoryTitle: {
      fontSize: 20,
      fontWeight: 600,
      color: colors.textDefault,
      margin: "0 0 8px 0",
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    categoryDescription: {
      fontSize: 14,
      color: colors.textSubtle,
      margin: 0,
    },
    resourcesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      gap: 16,
    },
    resourceCard: (highlight: boolean, isInPath: boolean, isCompleted: boolean) => ({
      backgroundColor: isCompleted 
        ? colors.green100 
        : highlight 
          ? colors.blue50 
          : isInPath 
            ? colors.backgroundSelected 
            : colors.surfaceDefault,
      border: `1px solid ${isCompleted ? colors.green500 : highlight ? colors.blue200 : isInPath ? colors.blue200 : colors.border}`,
      borderRadius: 12,
      padding: 20,
      transition: "all 0.2s ease",
      position: "relative" as const,
      opacity: 1,
    }),
    resourceHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
      gap: 12,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      border: `2px solid ${colors.border}`,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "all 0.2s ease",
    },
    checkboxChecked: {
      backgroundColor: colors.green500,
      borderColor: colors.green500,
    },
    resourceTitle: {
      fontSize: 16,
      fontWeight: 600,
      color: colors.textDefault,
      margin: 0,
      flex: 1,
    },
    resourceSource: {
      fontSize: 12,
      color: colors.textSubtle,
      marginBottom: 8,
    },
    resourceDescription: {
      fontSize: 14,
      color: colors.textSubtle,
      margin: "0 0 12px 0",
      lineHeight: 1.5,
    },
    resourceMeta: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
    },
    metaItem: {
      fontSize: 12,
      color: colors.textSubtle,
      display: "flex",
      alignItems: "center",
      gap: 4,
    },
    resourceTags: {
      display: "flex",
      flexWrap: "wrap" as const,
      gap: 6,
    },
    tag: {
      fontSize: 11,
      backgroundColor: colors.backgroundNeutral,
      color: colors.textSubtle,
      padding: "3px 8px",
      borderRadius: 4,
    },
    resourceLink: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      color: colors.linkDefault,
      textDecoration: "none",
      fontSize: 13,
      fontWeight: 500,
      marginTop: 12,
    },
    highlightBadge: {
      position: "absolute" as const,
      top: -8,
      right: 12,
      backgroundColor: colors.yellow300,
      color: colors.yellow900,
      fontSize: 10,
      fontWeight: 600,
      padding: "2px 8px",
      borderRadius: 4,
    },
    completedBadge: {
      position: "absolute" as const,
      top: -8,
      left: 12,
      backgroundColor: colors.green500,
      color: "white",
      fontSize: 10,
      fontWeight: 600,
      padding: "2px 8px",
      borderRadius: 4,
    },
    difficultyBadge: (difficulty: string) => {
      const colorMap: Record<string, { bg: string; text: string }> = {
        beginner: { bg: colors.green100, text: colors.green700 },
        intermediate: { bg: colors.yellow100, text: colors.yellow700 },
        advanced: { bg: colors.red100, text: colors.red700 },
        "all levels": { bg: colors.purple100, text: colors.purple700 },
      };
      const colors2 = colorMap[difficulty] || colorMap["intermediate"];
      return {
        fontSize: 11,
        fontWeight: 500,
        backgroundColor: colors2.bg,
        color: colors2.text,
        padding: "2px 8px",
        borderRadius: 4,
      };
    },
    notesSection: {
      marginTop: 12,
      borderTop: `1px solid ${colors.border}`,
      paddingTop: 12,
    },
    notesToggle: {
      fontSize: 12,
      color: colors.textSubtle,
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      display: "flex",
      alignItems: "center",
      gap: 4,
    },
    notesTextarea: {
      width: "100%",
      minHeight: 80,
      marginTop: 8,
      padding: 12,
      fontSize: 13,
      fontFamily: "inherit",
      border: `1px solid ${colors.border}`,
      borderRadius: 8,
      backgroundColor: colors.backgroundDefault,
      color: colors.textDefault,
      resize: "vertical" as const,
      outline: "none",
    },
    notesSaved: {
      fontSize: 11,
      color: colors.green500,
      marginTop: 4,
    },
    footer: {
      textAlign: "center" as const,
      padding: "32px 0",
      borderTop: `1px solid ${colors.border}`,
      marginTop: 48,
    },
    footerText: {
      color: colors.textSubtle,
      fontSize: 14,
      margin: 0,
    },
  };
}

// Notes component for each resource
function ResourceNotes({ 
  resourceId, 
  initialNotes, 
  styles, 
  colors,
  onNotesChange,
}: { 
  resourceId: string;
  initialNotes: string;
  styles: ReturnType<typeof getStyles>;
  colors: ReturnType<typeof useTheme>["colors"];
  onNotesChange: (notes: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(!!initialNotes);
  const [notes, setNotes] = useState(initialNotes);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async (value: string) => {
    setNotes(value);
    await updateNotes(resourceId, value);
    onNotesChange(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [resourceId, onNotesChange]);

  return (
    <div style={styles.notesSection}>
      <button 
        style={styles.notesToggle}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "▼" : "▶"} {notes ? "View notes" : "Add notes"}
        {notes && !isOpen && <span style={{ marginLeft: 4, opacity: 0.7 }}>({notes.length} chars)</span>}
      </button>
      {isOpen && (
        <>
          <textarea
            style={styles.notesTextarea}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={(e) => handleSave(e.target.value)}
            placeholder="Add your notes here... (auto-saves on blur)"
          />
          {saved && <div style={styles.notesSaved}>✓ Notes saved</div>}
        </>
      )}
    </div>
  );
}

export default function ResourcesContent() {
  const { theme, colors } = useTheme();
  const styles = getStyles(colors);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, ResourceProgress>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from IndexedDB
  useEffect(() => {
    getAllProgress().then((data) => {
      setProgress(data);
      setIsLoaded(true);
    });
  }, []);

  // Get resources in selected path
  const pathResources = selectedPath 
    ? readingPaths.find(p => p.id === selectedPath)?.resources || []
    : [];

  // Handle checkbox toggle
  const handleToggle = async (resourceId: string) => {
    const updated = await toggleCompleted(resourceId);
    setProgress(prev => ({ ...prev, [resourceId]: updated }));
  };

  // Handle notes change
  const handleNotesChange = (resourceId: string, notes: string) => {
    setProgress(prev => ({
      ...prev,
      [resourceId]: { ...prev[resourceId], notes, resourceId, completed: prev[resourceId]?.completed || false, updatedAt: Date.now() },
    }));
  };

  // Calculate stats
  const totalResources = allResourceTitles.length;
  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const percentage = totalResources > 0 ? Math.round((completedCount / totalResources) * 100) : 0;

  // Calculate path progress
  const getPathProgress = (pathResourceNames: string[]) => {
    const completed = pathResourceNames.filter(name => {
      const id = generateResourceId(name);
      return progress[id]?.completed;
    }).length;
    return { completed, total: pathResourceNames.length };
  };

  return (
    <div style={styles.page}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.navLeft}>
            <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={styles.badge}>⬡</div>
              <h1 style={styles.navTitle}>Generative UI Platform</h1>
            </Link>
            <span style={styles.versionBadge}>v2</span>
            <span style={styles.resourcesBadge}>Resources</span>
          </div>
          <div style={styles.navRight}>
            <div style={styles.navLinks}>
              <Link to="/" style={styles.navLink}>Home</Link>
              <Link to="/summary" style={styles.navLink}>Summary</Link>
              <Link to="/architecture" style={styles.navLink}>Full Docs</Link>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        {/* Hero */}
        <section style={styles.hero}>
          <h1 style={styles.heroTitle}>📖 Pre-Reading Resources</h1>
          <p style={styles.heroSubtitle}>
            Essential research, tools, and references for understanding malleable software 
            and generative UI. Track your progress as you learn!
          </p>
          
          {/* Progress Bar */}
          {isLoaded && (
            <div style={styles.progressBar}>
              <div style={styles.progressHeader}>
                <span style={styles.progressLabel}>
                  📊 Your Progress: {completedCount} / {totalResources} resources
                </span>
                <span style={styles.progressPercent}>{percentage}%</span>
              </div>
              <div style={styles.progressTrack}>
                <div style={styles.progressFill(percentage)} />
              </div>
            </div>
          )}
        </section>

        {/* Reading Paths */}
        <section style={styles.pathsSection}>
          <h2 style={styles.sectionTitle}>
            <span>🛤️</span> Curated Reading Paths
            <span style={{ fontSize: 14, fontWeight: 400, color: colors.textSubtle, marginLeft: 8 }}>
              (click to filter)
            </span>
          </h2>
          <div style={styles.pathsGrid}>
            {readingPaths.map((path) => {
              const pathProgress = getPathProgress(path.resources);
              return (
                <div
                  key={path.id}
                  style={styles.pathCard(selectedPath === path.id)}
                  onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
                >
                  <div style={styles.pathCardHeader}>
                    <span style={styles.pathIcon}>{path.icon}</span>
                    <h3 style={styles.pathTitle}>{path.title}</h3>
                  </div>
                  <p style={styles.pathDescription}>{path.description}</p>
                  <div style={styles.pathResources}>
                    {path.resources.map((resource, idx) => {
                      const id = generateResourceId(resource);
                      const isCompleted = progress[id]?.completed;
                      return (
                        <span 
                          key={idx} 
                          style={styles.pathResourceTag(selectedPath === path.id, isCompleted || false)}
                        >
                          {isCompleted && "✓ "}{resource}
                        </span>
                      );
                    })}
                  </div>
                  <div style={styles.pathProgress}>
                    Progress: {pathProgress.completed}/{pathProgress.total} completed
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Filter info */}
        {selectedPath && (
          <div style={styles.filterInfo}>
            <p style={styles.filterText}>
              🎯 Showing resources from <strong>{readingPaths.find(p => p.id === selectedPath)?.title}</strong> path
            </p>
            <button 
              style={styles.clearFilterBtn}
              onClick={() => setSelectedPath(null)}
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Resource Categories */}
        {resourceCategories.map((category) => {
          // Filter resources if a path is selected
          const filteredResources = selectedPath 
            ? category.resources.filter(r => pathResources.includes(r.title))
            : category.resources;

          if (filteredResources.length === 0) return null;

          return (
            <section key={category.id} style={styles.categorySection}>
              <div style={styles.categoryHeader}>
                <h2 style={styles.categoryTitle}>
                  <span>{category.icon}</span>
                  {category.title}
                </h2>
                <p style={styles.categoryDescription}>{category.description}</p>
              </div>
              <div style={styles.resourcesGrid}>
                {filteredResources.map((resource, idx) => {
                  const resourceId = generateResourceId(resource.title);
                  const isCompleted = progress[resourceId]?.completed || false;
                  const resourceNotes = progress[resourceId]?.notes || "";
                  const isInPath = pathResources.includes(resource.title);

                  return (
                    <div
                      key={idx}
                      style={styles.resourceCard(resource.highlight || false, isInPath, isCompleted)}
                    >
                      {resource.highlight && !isCompleted && (
                        <span style={styles.highlightBadge}>⭐ Recommended</span>
                      )}
                      {isCompleted && (
                        <span style={styles.completedBadge}>✓ Completed</span>
                      )}
                      <div style={styles.resourceHeader}>
                        <div
                          style={{
                            ...styles.checkbox,
                            ...(isCompleted ? styles.checkboxChecked : {}),
                          }}
                          onClick={() => handleToggle(resourceId)}
                          title={isCompleted ? "Mark as unread" : "Mark as completed"}
                        >
                          {isCompleted && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <h3 style={styles.resourceTitle}>{resource.title}</h3>
                      </div>
                      <p style={styles.resourceSource}>{resource.source}</p>
                      <p style={styles.resourceDescription}>{resource.description}</p>
                      <div style={styles.resourceMeta}>
                        <span style={styles.metaItem}>⏱️ {resource.readTime}</span>
                        <span style={styles.difficultyBadge(resource.difficulty)}>
                          {resource.difficulty}
                        </span>
                      </div>
                      <div style={styles.resourceTags}>
                        {resource.tags.map((tag, tagIdx) => (
                          <span key={tagIdx} style={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.resourceLink}
                      >
                        Visit Resource →
                      </a>
                      
                      {/* Notes Section */}
                      <ResourceNotes
                        resourceId={resourceId}
                        initialNotes={resourceNotes}
                        styles={styles}
                        colors={colors}
                        onNotesChange={(notes) => handleNotesChange(resourceId, notes)}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Footer */}
        <footer style={styles.footer}>
          <p style={styles.footerText}>
            Generative UI Platform Resources • Progress saved locally in your browser
          </p>
        </footer>
      </main>
    </div>
  );
}
