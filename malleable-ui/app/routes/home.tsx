import type { Route } from "./+types/home";
import { Link } from "react-router";
import { useTheme } from "../context/theme-context";
import { ThemeToggle } from "../components/theme-toggle";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Generative UI Platform" },
    { name: "description", content: "A generative and malleable UI platform for Confluence content" },
  ];
}

export default function Home() {
  const { colors, theme } = useTheme();
  
  const styles = {
    page: {
      minHeight: "100vh",
      background: theme === "light" 
        ? `linear-gradient(135deg, #0747A6 0%, #0052CC 50%, #0065FF 100%)`
        : `linear-gradient(135deg, #1D2125 0%, #22272B 50%, #2C333A 100%)`,
      display: "flex",
      flexDirection: "column" as const,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      transition: "background 0.3s ease",
    },
    header: {
      padding: "16px 32px",
      display: "flex",
      justifyContent: "flex-end",
    },
    content: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px",
    },
    inner: {
      maxWidth: "800px",
      width: "100%",
      textAlign: "center" as const,
    },
    logo: {
      width: "64px",
      height: "64px",
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 24px",
    },
    title: {
      fontSize: "42px",
      fontWeight: 600,
      color: "#FFFFFF",
      margin: "0 0 16px 0",
      letterSpacing: "-0.5px",
    },
    subtitle: {
      fontSize: "18px",
      color: "rgba(255,255,255,0.9)",
      margin: "0 0 32px 0",
      lineHeight: 1.6,
    },
    statsContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "32px",
      marginBottom: "32px",
    },
    stat: {
      textAlign: "center" as const,
      padding: "0 16px",
    },
    statValue: {
      fontSize: "28px",
      fontWeight: 700,
      color: "#FFFFFF",
      margin: 0,
    },
    statLabel: {
      fontSize: "13px",
      color: "rgba(255,255,255,0.7)",
      textTransform: "uppercase" as const,
      letterSpacing: "0.5px",
      marginTop: "4px",
    },
    statDivider: {
      width: "1px",
      backgroundColor: "rgba(255,255,255,0.2)",
      alignSelf: "stretch" as const,
    },
    buttons: {
      display: "flex",
      gap: "16px",
      justifyContent: "center",
    },
    buttonPrimary: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "14px 28px",
      fontSize: "16px",
      fontWeight: 600,
      color: colors.blue500,
      backgroundColor: "#FFFFFF",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      textDecoration: "none",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    buttonSecondary: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "14px 28px",
      fontSize: "16px",
      fontWeight: 600,
      color: "#FFFFFF",
      backgroundColor: "transparent",
      border: "2px solid rgba(255,255,255,0.5)",
      borderRadius: "4px",
      cursor: "pointer",
      textDecoration: "none",
      transition: "all 0.2s ease",
    },
    cards: {
      display: "flex",
      gap: "16px",
      marginTop: "40px",
    },
    card: {
      flex: 1,
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: "8px",
      padding: "20px",
      textAlign: "left" as const,
      backdropFilter: "blur(10px)",
    },
    cardDot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      marginBottom: "12px",
    },
    cardTitle: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#FFFFFF",
      margin: "0 0 8px 0",
    },
    cardText: {
      fontSize: "14px",
      color: "rgba(255,255,255,0.8)",
      margin: 0,
      lineHeight: 1.5,
    },
  };

  return (
    <div style={styles.page}>
      {/* Header with theme toggle */}
      <header style={styles.header}>
        <ThemeToggle />
      </header>
      
      <div style={styles.content}>
        <div style={styles.inner}>
          {/* Logo */}
          <div style={styles.logo}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          
          {/* Title */}
          <h1 style={styles.title}>Generative UI Platform</h1>
          
          {/* Subtitle */}
          <p style={styles.subtitle}>
            A component foundry with institutional memory.{" "}
            <strong>Generate once, retrieve forever.</strong>
          </p>
          
          {/* Stats */}
          <div style={styles.statsContainer}>
            <div style={styles.stat}>
              <p style={styles.statValue}>&lt;50ms</p>
              <p style={styles.statLabel}>Retrieve</p>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <p style={styles.statValue}>&lt;200ms</p>
              <p style={styles.statLabel}>Adapt</p>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <p style={styles.statValue}>2-5s</p>
              <p style={styles.statLabel}>Generate</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div style={styles.buttons}>
            <Link to="/summary" style={styles.buttonPrimary}>
              5-Minute Summary
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6.47 4.29a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L9.19 8 6.47 5.35a.75.75 0 010-1.06z" />
              </svg>
            </Link>
            <Link to="/architecture" style={styles.buttonSecondary}>
              Full Documentation
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6.47 4.29a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L9.19 8 6.47 5.35a.75.75 0 010-1.06z" />
              </svg>
            </Link>
            <Link to="/resources" style={styles.buttonSecondary}>
              📚 Resources
            </Link>
          </div>
          
          {/* Feature Cards */}
          <div style={styles.cards}>
            <div style={styles.card}>
              <div style={{ ...styles.cardDot, backgroundColor: colors.blue500 }} />
              <h3 style={styles.cardTitle}>Matching Specs</h3>
              <p style={styles.cardText}>
                Structured signatures enable instant retrieval without reading code
              </p>
            </div>
            
            <div style={styles.card}>
              <div style={{ ...styles.cardDot, backgroundColor: colors.green500 }} />
              <h3 style={styles.cardTitle}>Agent Pipeline</h3>
              <p style={styles.cardText}>
                Five specialized agents collaborate to parse, match, adapt, or generate
              </p>
            </div>
            
            <div style={styles.card}>
              <div style={{ ...styles.cardDot, backgroundColor: colors.purple500 }} />
              <h3 style={styles.cardTitle}>9 Paradigms</h3>
              <p style={styles.cardText}>
                Nine paradigms collaborate as layers within a unified system
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
