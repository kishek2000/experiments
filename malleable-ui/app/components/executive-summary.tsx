"use client";

import { useState } from "react";
import { Link } from "react-router";
import { useTheme } from "../context/theme-context";
import { ThemeToggle } from "./theme-toggle";

// ============================================================================
// SLIDES DATA
// ============================================================================

const slides = [
  {
    id: "problem",
    title: "The Problem",
    subtitle: "Why existing approaches fail",
    content: {
      headline: "AI can't quickly decide if a component fits without reading all its code",
      points: [
        "1000+ lines of React → slow analysis",
        "Fixed component libraries → limited flexibility",
        "No learning from past generations",
      ],
      visual: "problem",
    },
  },
  {
    id: "solution",
    title: "The Solution",
    subtitle: "A component foundry with memory",
    content: {
      headline: "Every component has a Matching Spec—metadata that describes what it does",
      points: [
        "Instant matching without reading code",
        "Generate once, retrieve forever",
        "System learns and improves over time",
      ],
      visual: "solution",
    },
  },
  {
    id: "flow",
    title: "How It Works",
    subtitle: "The request lifecycle",
    content: {
      headline: "User request → Match → Adapt or Generate → Rendered UI",
      points: [
        "80%+ of requests are instant retrieval",
        "Adaptation takes <200ms",
        "New generation cached forever",
      ],
      visual: "flow",
    },
  },
  {
    id: "paradigms",
    title: "9 Paradigms",
    subtitle: "Collaborating layers, not competing approaches",
    content: {
      headline: "Each paradigm contributes at a specific pipeline stage",
      points: [
        "Lens: User-facing query language",
        "Compilation: Fast path templates",
        "Validation: Grammar + Constraints",
      ],
      visual: "paradigms",
    },
  },
];

// ============================================================================
// STYLES FACTORY
// ============================================================================

function getStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return {
    page: {
      minHeight: "100vh",
      backgroundColor: colors.surfaceDefault,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      transition: "background-color 0.3s ease, color 0.3s ease",
    },
    nav: {
      position: "sticky" as const,
      top: 0,
      zIndex: 100,
      backgroundColor: colors.surfaceDefault,
      borderBottom: `1px solid ${colors.border}`,
      padding: "12px 32px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "background-color 0.3s ease, border-color 0.3s ease",
    },
    navLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    navTitle: {
      fontSize: "16px",
      fontWeight: 600,
      color: colors.textDefault,
      margin: 0,
    },
    navBadge: {
      padding: "2px 8px",
      borderRadius: "3px",
      backgroundColor: colors.green500,
      color: "#FFFFFF",
      fontSize: "11px",
      fontWeight: 600,
    },
    navRight: {
      display: "flex",
      alignItems: "center",
      gap: "24px",
    },
    navLinks: {
      display: "flex",
      gap: "24px",
    },
    navLink: {
      fontSize: "14px",
      color: colors.textSubtle,
      textDecoration: "none",
      transition: "color 0.15s",
    },
    
    // Hero Section
    hero: {
      padding: "80px 32px",
      textAlign: "center" as const,
      background: `linear-gradient(180deg, ${colors.blue100} 0%, ${colors.surfaceDefault} 100%)`,
      transition: "background 0.3s ease",
    },
    heroTitle: {
      fontSize: "48px",
      fontWeight: 700,
      color: colors.textDefault,
      margin: "0 0 16px 0",
      letterSpacing: "-1px",
    },
    heroSubtitle: {
      fontSize: "20px",
      color: colors.textSubtle,
      margin: "0 0 40px 0",
      maxWidth: "600px",
      marginLeft: "auto",
      marginRight: "auto",
    },
    
    // Stats Row
    statsRow: {
      display: "flex",
      justifyContent: "center",
      gap: "48px",
      marginBottom: "48px",
    },
    stat: {
      textAlign: "center" as const,
    },
    statValue: {
      fontSize: "36px",
      fontWeight: 700,
      color: colors.blue500,
      margin: 0,
    },
    statLabel: {
      fontSize: "14px",
      color: colors.textSubtle,
      margin: "4px 0 0 0",
    },
    
    // One Sentence
    oneSentence: {
      maxWidth: "700px",
      margin: "0 auto 48px",
      padding: "24px 32px",
      backgroundColor: colors.backgroundBrandBold,
      borderRadius: "8px",
      color: "#FFFFFF",
      fontSize: "20px",
      fontWeight: 500,
      textAlign: "center" as const,
      lineHeight: 1.5,
    },
    
    // Slide Navigation
    slideNav: {
      display: "flex",
      justifyContent: "center",
      gap: "8px",
      marginBottom: "32px",
    },
    slideNavButton: (active: boolean) => ({
      padding: "8px 16px",
      borderRadius: "20px",
      border: "none",
      backgroundColor: active ? colors.blue500 : colors.surfaceSunken,
      color: active ? "#FFFFFF" : colors.textSubtle,
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s",
    }),
    
    // Slides Section
    slidesSection: {
      padding: "40px 32px 80px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    slideContainer: {
      display: "flex",
      gap: "48px",
      alignItems: "center",
      minHeight: "400px",
    },
    slideContent: {
      flex: 1,
    },
    slideTitle: {
      fontSize: "14px",
      fontWeight: 600,
      color: colors.blue500,
      textTransform: "uppercase" as const,
      letterSpacing: "1px",
      margin: "0 0 8px 0",
    },
    slideHeadline: {
      fontSize: "32px",
      fontWeight: 600,
      color: colors.textDefault,
      margin: "0 0 24px 0",
      lineHeight: 1.3,
    },
    slidePoints: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    slidePoint: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      marginBottom: "16px",
      fontSize: "16px",
      color: colors.textDefault,
      lineHeight: 1.5,
    },
    slidePointIcon: {
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      backgroundColor: colors.green100,
      color: colors.green500,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      fontSize: "14px",
    },
    slideVisual: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    
    // Deep Dive Section
    deepDiveSection: {
      padding: "64px 32px",
      backgroundColor: colors.surfaceSunken,
      transition: "background-color 0.3s ease",
    },
    deepDiveTitle: {
      fontSize: "28px",
      fontWeight: 600,
      color: colors.textDefault,
      textAlign: "center" as const,
      margin: "0 0 40px 0",
    },
    deepDiveGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "24px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    
    // Expandable Card
    card: {
      backgroundColor: colors.surfaceDefault,
      borderRadius: "8px",
      border: `1px solid ${colors.border}`,
      overflow: "hidden",
      transition: "box-shadow 0.2s, background-color 0.3s ease, border-color 0.3s ease",
    },
    cardHeader: {
      padding: "20px 24px",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.surfaceDefault,
      transition: "background-color 0.15s",
    },
    cardTitle: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    cardIcon: {
      width: "32px",
      height: "32px",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "16px",
    },
    cardTitleText: {
      fontSize: "16px",
      fontWeight: 600,
      color: colors.textDefault,
      margin: 0,
    },
    cardSubtitle: {
      fontSize: "13px",
      color: colors.textSubtle,
      margin: "4px 0 0 0",
    },
    cardChevron: {
      fontSize: "20px",
      color: colors.textSubtle,
      transition: "transform 0.2s",
    },
    cardBody: {
      padding: "0 24px 20px",
      borderTop: `1px solid ${colors.border}`,
    },
    cardContent: {
      paddingTop: "16px",
      fontSize: "14px",
      color: colors.textDefault,
      lineHeight: 1.6,
    },
    
    // Flow Diagram
    flowDiagram: {
      backgroundColor: colors.surfaceDefault,
      borderRadius: "12px",
      padding: "32px",
      border: `1px solid ${colors.border}`,
      transition: "background-color 0.3s ease, border-color 0.3s ease",
    },
    flowNode: (color: string) => ({
      padding: "16px 24px",
      borderRadius: "8px",
      backgroundColor: color,
      color: "#FFFFFF",
      textAlign: "center" as const,
      fontWeight: 600,
      fontSize: "14px",
    }),
    flowArrow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px 0",
      color: colors.textSubtle,
      fontSize: "20px",
    },
    flowBranch: {
      display: "flex",
      gap: "24px",
      justifyContent: "center",
    },
    flowBranchItem: {
      flex: 1,
      maxWidth: "180px",
    },
    flowLabel: {
      fontSize: "12px",
      color: colors.textSubtle,
      textAlign: "center" as const,
      margin: "4px 0 0 0",
    },
    
    // CTA Section
    ctaSection: {
      padding: "64px 32px",
      textAlign: "center" as const,
      borderTop: `1px solid ${colors.border}`,
    },
    ctaTitle: {
      fontSize: "24px",
      fontWeight: 600,
      color: colors.textDefault,
      margin: "0 0 16px 0",
    },
    ctaText: {
      fontSize: "16px",
      color: colors.textSubtle,
      margin: "0 0 32px 0",
    },
    ctaButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "14px 28px",
      fontSize: "16px",
      fontWeight: 600,
      color: "#FFFFFF",
      backgroundColor: colors.blue500,
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      textDecoration: "none",
    },
    
    // Nav Button
    navButton: {
      padding: "8px 16px",
      borderRadius: "4px",
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.surfaceDefault,
      color: colors.textDefault,
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.15s",
    },
    navButtonDisabled: {
      color: colors.textSubtlest,
      cursor: "not-allowed",
    },
  };
}

// ============================================================================
// VISUAL COMPONENTS
// ============================================================================

function FlowDiagram() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  return (
    <div style={styles.flowDiagram}>
      <div style={styles.flowNode(colors.blue500)}>User Request</div>
      <div style={styles.flowArrow}>↓</div>
      <div style={styles.flowNode(colors.purple500)}>Intent Parser (Agent 1)</div>
      <div style={styles.flowArrow}>↓</div>
      <div style={styles.flowNode(colors.teal500)}>Matcher (Agent 2)</div>
      <div style={styles.flowArrow}>↓</div>
      <div style={styles.flowBranch}>
        <div style={styles.flowBranchItem}>
          <div style={styles.flowNode(colors.green500)}>Adapter</div>
          <p style={styles.flowLabel}>Score ≥ 0.7</p>
        </div>
        <div style={styles.flowBranchItem}>
          <div style={styles.flowNode(colors.yellow500)}>Generator</div>
          <p style={styles.flowLabel}>Score &lt; 0.7</p>
        </div>
      </div>
      <div style={styles.flowArrow}>↓</div>
      <div style={styles.flowNode(colors.blue600)}>Validator → UI</div>
    </div>
  );
}

function MatchingSpecVisual() {
  const { colors } = useTheme();
  
  return (
    <div style={{ 
      backgroundColor: colors.surfaceDefault, 
      borderRadius: "12px", 
      padding: "24px",
      border: `1px solid ${colors.border}`,
      transition: "background-color 0.3s ease, border-color 0.3s ease",
    }}>
      <div style={{ fontSize: "14px", fontWeight: 600, color: colors.textSubtle, marginBottom: "16px" }}>
        ComponentMatchingSpec
      </div>
      {[
        { name: "Intent", color: colors.blue500, desc: "What user wants" },
        { name: "Schema", color: colors.purple500, desc: "Data shape" },
        { name: "Capability", color: colors.green500, desc: "What it can do" },
        { name: "Affordance", color: colors.teal500, desc: "Interactions" },
        { name: "Visual", color: colors.yellow500, desc: "Look & feel" },
      ].map((sig, i) => (
        <div key={i} style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px",
          padding: "12px",
          borderRadius: "6px",
          backgroundColor: colors.surfaceSunken,
          marginBottom: "8px",
          transition: "background-color 0.3s ease",
        }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: sig.color,
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: colors.textDefault, fontSize: "14px" }}>{sig.name}</div>
            <div style={{ color: colors.textSubtle, fontSize: "12px" }}>{sig.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ParadigmsVisual() {
  const { colors } = useTheme();
  
  const paradigms = [
    { name: "Lens", stage: "Input", color: colors.blue500 },
    { name: "Compilation", stage: "Generation", color: colors.purple500 },
    { name: "Grammar", stage: "Validation", color: colors.green500 },
    { name: "Constraint", stage: "Validation", color: colors.green500 },
    { name: "Dataflow", stage: "Rendering", color: colors.teal500 },
    { name: "Negotiation", stage: "Post-render", color: colors.yellow500 },
    { name: "Simulation", stage: "Background", color: colors.textSubtle },
    { name: "Evolutionary", stage: "Background", color: colors.textSubtle },
    { name: "Marketplace", stage: "Library", color: colors.purple500 },
  ];
  
  return (
    <div style={{ 
      backgroundColor: colors.surfaceDefault, 
      borderRadius: "12px", 
      padding: "24px",
      border: `1px solid ${colors.border}`,
      transition: "background-color 0.3s ease, border-color 0.3s ease",
    }}>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "8px",
      }}>
        {paradigms.map((p, i) => (
          <div key={i} style={{
            padding: "12px",
            borderRadius: "6px",
            backgroundColor: colors.surfaceSunken,
            textAlign: "center" as const,
            transition: "background-color 0.3s ease",
          }}>
            <div style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: p.color,
              margin: "0 auto 8px",
            }} />
            <div style={{ fontWeight: 600, fontSize: "13px", color: colors.textDefault }}>{p.name}</div>
            <div style={{ fontSize: "11px", color: colors.textSubtle }}>{p.stage}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProblemVisual() {
  const { colors } = useTheme();
  
  return (
    <div style={{ 
      backgroundColor: colors.surfaceDefault, 
      borderRadius: "12px", 
      padding: "24px",
      border: `1px solid ${colors.border}`,
      transition: "background-color 0.3s ease, border-color 0.3s ease",
    }}>
      <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "24px" }}>
        <div style={{
          flex: 1,
          padding: "16px",
          backgroundColor: colors.red100,
          borderRadius: "8px",
          textAlign: "center" as const,
          transition: "background-color 0.3s ease",
        }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>📄</div>
          <div style={{ fontWeight: 600, color: colors.red500 }}>1000+ lines</div>
          <div style={{ fontSize: "12px", color: colors.textSubtle }}>of React code</div>
        </div>
        <div style={{ fontSize: "24px", color: colors.textSubtle }}>→</div>
        <div style={{
          flex: 1,
          padding: "16px",
          backgroundColor: colors.red100,
          borderRadius: "8px",
          textAlign: "center" as const,
          transition: "background-color 0.3s ease",
        }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🐌</div>
          <div style={{ fontWeight: 600, color: colors.red500 }}>Slow analysis</div>
          <div style={{ fontSize: "12px", color: colors.textSubtle }}>every request</div>
        </div>
      </div>
      <div style={{
        padding: "12px 16px",
        backgroundColor: colors.red100,
        borderRadius: "6px",
        borderLeft: `4px solid ${colors.red500}`,
        fontSize: "14px",
        color: colors.textDefault,
        transition: "background-color 0.3s ease",
      }}>
        Traditional approach: Read code → Classify → Configure → Render
      </div>
    </div>
  );
}

// ============================================================================
// EXPANDABLE CARD COMPONENT
// ============================================================================

function ExpandableCard({ 
  title, 
  subtitle, 
  icon, 
  iconBg, 
  children 
}: { 
  title: string; 
  subtitle: string; 
  icon: string; 
  iconBg: string;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  return (
    <div style={{
      ...styles.card,
      boxShadow: expanded ? "0 4px 12px rgba(9, 30, 66, 0.15)" : "none",
    }}>
      <div 
        style={{
          ...styles.cardHeader,
          backgroundColor: expanded ? colors.surfaceSunken : colors.surfaceDefault,
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={styles.cardTitle}>
          <div style={{ ...styles.cardIcon, backgroundColor: iconBg }}>
            {icon}
          </div>
          <div>
            <h3 style={styles.cardTitleText}>{title}</h3>
            <p style={styles.cardSubtitle}>{subtitle}</p>
          </div>
        </div>
        <span style={{
          ...styles.cardChevron,
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
        }}>
          ▼
        </span>
      </div>
      {expanded && (
        <div style={styles.cardBody}>
          <div style={styles.cardContent}>
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

export default function ExecutiveSummary() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  const renderVisual = (visual: string) => {
    switch (visual) {
      case "problem":
        return <ProblemVisual />;
      case "solution":
        return <MatchingSpecVisual />;
      case "flow":
        return <FlowDiagram />;
      case "paradigms":
        return <ParadigmsVisual />;
      default:
        return null;
    }
  };
  
  const slide = slides[currentSlide];
  
  return (
    <div style={styles.page}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "12px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.blue500} strokeWidth="2">
              <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <h1 style={styles.navTitle}>Generative UI Platform</h1>
          </Link>
          <span style={styles.navBadge}>Summary</span>
        </div>
        <div style={styles.navRight}>
          <div style={styles.navLinks}>
            <Link to="/" style={styles.navLink}>Home</Link>
            <Link to="/architecture" style={styles.navLink}>Full Documentation</Link>
            <Link to="/resources" style={styles.navLink}>Resources</Link>
          </div>
          <ThemeToggle />
        </div>
      </nav>
      
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Executive Summary</h1>
        <p style={styles.heroSubtitle}>
          Everything you need to know about the Generative UI Platform in 5 minutes
        </p>
        
        {/* Key Stats */}
        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <p style={styles.statValue}>&lt;50ms</p>
            <p style={styles.statLabel}>Component Retrieval</p>
          </div>
          <div style={styles.stat}>
            <p style={styles.statValue}>80%+</p>
            <p style={styles.statLabel}>Instant Matches</p>
          </div>
          <div style={styles.stat}>
            <p style={styles.statValue}>9</p>
            <p style={styles.statLabel}>Collaborating Paradigms</p>
          </div>
          <div style={styles.stat}>
            <p style={styles.statValue}>5</p>
            <p style={styles.statLabel}>Agent Pipeline Stages</p>
          </div>
        </div>
        
        {/* One Sentence Summary */}
        <div style={styles.oneSentence}>
          <strong>In one sentence:</strong> A system that generates UI components once and retrieves them instantly forever, using structured "matching specs" instead of reading code.
        </div>
      </section>
      
      {/* Interactive Slides Section */}
      <section style={styles.slidesSection}>
        {/* Slide Navigation */}
        <div style={styles.slideNav}>
          {slides.map((s, i) => (
            <button
              key={s.id}
              style={styles.slideNavButton(i === currentSlide)}
              onClick={() => setCurrentSlide(i)}
            >
              {s.title}
            </button>
          ))}
        </div>
        
        {/* Current Slide */}
        <div style={styles.slideContainer}>
          <div style={styles.slideContent}>
            <p style={styles.slideTitle}>{slide.subtitle}</p>
            <h2 style={styles.slideHeadline}>{slide.content.headline}</h2>
            <ul style={styles.slidePoints}>
              {slide.content.points.map((point, i) => (
                <li key={i} style={styles.slidePoint}>
                  <span style={styles.slidePointIcon}>✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={styles.slideVisual}>
            {renderVisual(slide.content.visual)}
          </div>
        </div>
        
        {/* Slide Navigation Arrows */}
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "32px" }}>
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            style={{
              ...styles.navButton,
              ...(currentSlide === 0 ? styles.navButtonDisabled : {}),
            }}
          >
            ← Previous
          </button>
          <span style={{ padding: "8px 0", color: colors.textSubtle }}>
            {currentSlide + 1} / {slides.length}
          </span>
          <button
            onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slides.length - 1}
            style={{
              ...styles.navButton,
              ...(currentSlide === slides.length - 1 ? styles.navButtonDisabled : {}),
            }}
          >
            Next →
          </button>
        </div>
      </section>
      
      {/* Deep Dive Section */}
      <section style={styles.deepDiveSection}>
        <h2 style={styles.deepDiveTitle}>Want More Details?</h2>
        <div style={styles.deepDiveGrid}>
          <ExpandableCard
            title="Matching System"
            subtitle="How components are found"
            icon="🔍"
            iconBg={colors.blue100}
          >
            <p style={{ margin: "0 0 12px 0" }}>
              Every component has 5 signatures that describe what it does without reading code:
            </p>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              <li><strong>Intent:</strong> What the user wants (view, compare, track, edit)</li>
              <li><strong>Schema:</strong> Data shape it handles (title, status, date fields)</li>
              <li><strong>Capability:</strong> What it can do (filter, sort, group, edit)</li>
              <li><strong>Affordance:</strong> User interactions (click, drag, keyboard)</li>
              <li><strong>Visual:</strong> Look and feel (compact, comfortable, spacious)</li>
            </ul>
            <p style={{ margin: "12px 0 0 0" }}>
              Matching score = (intent × 0.4) + (schema × 0.4) + (capability × 0.15) + (visual × 0.05)
            </p>
          </ExpandableCard>
          
          <ExpandableCard
            title="Agent Pipeline"
            subtitle="5 agents, minimal LLM usage"
            icon="🤖"
            iconBg={colors.purple100}
          >
            <p style={{ margin: "0 0 12px 0" }}>
              Only 2 of 5 agents use LLM. The rest are deterministic for speed:
            </p>
            <ol style={{ margin: 0, paddingLeft: "20px" }}>
              <li><strong>Parser</strong> (LLM for novel) - Converts text to structured intent</li>
              <li><strong>Matcher</strong> (No LLM) - Finds best component in &lt;50ms</li>
              <li><strong>Adapter</strong> (No LLM) - Remaps fields, adjusts config</li>
              <li><strong>Generator</strong> (LLM) - Creates new component if no match</li>
              <li><strong>Validator</strong> (No LLM) - Checks grammar, constraints, security</li>
            </ol>
          </ExpandableCard>
          
          <ExpandableCard
            title="Component Library"
            subtitle="Institutional memory"
            icon="📚"
            iconBg={colors.green100}
          >
            <p style={{ margin: "0 0 12px 0" }}>
              Every generated component is stored for future use:
            </p>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              <li>Components are versioned and never deleted</li>
              <li>Usage stats inform which components are promoted</li>
              <li>Users can fork, modify, and share components</li>
              <li>Third-party contributions via Marketplace paradigm</li>
            </ul>
            <p style={{ margin: "12px 0 0 0" }}>
              <strong>Result:</strong> Generation frequency decreases as library grows. Most requests become instant retrieval.
            </p>
          </ExpandableCard>
          
          <ExpandableCard
            title="9 Paradigms"
            subtitle="Collaborating, not competing"
            icon="🧩"
            iconBg={colors.teal100}
          >
            <p style={{ margin: "0 0 12px 0" }}>
              Each paradigm contributes at a specific stage:
            </p>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              <li><strong>Lens:</strong> User's query language (Input)</li>
              <li><strong>Compilation:</strong> Fast templates (Generation)</li>
              <li><strong>Grammar:</strong> Valid Atlaskit code (Validation)</li>
              <li><strong>Constraint:</strong> A11y, responsive (Validation)</li>
              <li><strong>Dataflow:</strong> Reactive updates (Rendering)</li>
              <li><strong>Negotiation:</strong> User feedback (Post-render)</li>
              <li><strong>Simulation:</strong> Test with synthetic users (Background)</li>
              <li><strong>Evolutionary:</strong> Learn what works (Background)</li>
              <li><strong>Marketplace:</strong> Third-party components (Library)</li>
            </ul>
          </ExpandableCard>
          
          <ExpandableCard
            title="Content Libraries"
            subtitle="tldraw, Tiptap, TanStack"
            icon="📝"
            iconBg={colors.yellow100}
          >
            <p style={{ margin: "0 0 12px 0" }}>
              We use battle-tested libraries for core editing:
            </p>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              <li><strong>tldraw:</strong> Whiteboard canvas, shapes, zoom, pan</li>
              <li><strong>Tiptap:</strong> Rich text editing, formatting</li>
              <li><strong>TanStack Table:</strong> Headless table logic (sorting, filtering)</li>
            </ul>
            <p style={{ margin: "12px 0 0 0" }}>
              <strong>AI generates the chrome around these:</strong> Custom toolbars, views, sidebars—not the core editing experience.
            </p>
          </ExpandableCard>
          
          <ExpandableCard
            title="Performance"
            subtitle="Speed is a feature"
            icon="⚡"
            iconBg={colors.red100}
          >
            <p style={{ margin: "0 0 12px 0" }}>
              Critical latency targets:
            </p>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              <li><strong>&lt;50ms:</strong> Exact match retrieval (cache lookup)</li>
              <li><strong>&lt;200ms:</strong> Adapt existing component (field remapping)</li>
              <li><strong>2-5s:</strong> Generate new component (LLM, but cached forever)</li>
            </ul>
            <p style={{ margin: "12px 0 0 0" }}>
              <strong>Goal:</strong> 80%+ of requests should be instant retrieval. Generation is the fallback, not the default.
            </p>
          </ExpandableCard>
        </div>
      </section>
      
      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready for the Full Details?</h2>
        <p style={styles.ctaText}>
          The complete architecture documentation covers every signature, agent, and paradigm in depth.
        </p>
        <Link to="/architecture" style={styles.ctaButton}>
          Read Full Documentation
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6.47 4.29a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L9.19 8 6.47 5.35a.75.75 0 010-1.06z" />
          </svg>
        </Link>
      </section>
    </div>
  );
}
