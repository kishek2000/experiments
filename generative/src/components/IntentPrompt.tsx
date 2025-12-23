import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Users,
  Lightbulb,
  FileText,
  RefreshCcw,
  AlertTriangle,
  Rocket,
  ArrowLeftRight,
} from "lucide-react";
import styles from "./IntentPrompt.module.css";

interface IntentPromptProps {
  onSubmit: (intent: string) => void;
  isGenerating: boolean;
}

const suggestions = [
  {
    icon: Users,
    text: "I need to make a decision with my team about our Q1 roadmap",
    category: "Decision",
  },
  {
    icon: Lightbulb,
    text: "I'm new to this project and want to understand the context",
    category: "Onboarding",
  },
  {
    icon: Zap,
    text: "Let's brainstorm solutions for improving our checkout flow",
    category: "Brainstorm",
  },
  {
    icon: FileText,
    text: "Help me document and summarize our architecture decisions",
    category: "Documentation",
  },
  {
    icon: RefreshCcw,
    text: "Run a retrospective for our last sprint with the team",
    category: "Retrospective",
  },
  {
    icon: AlertTriangle,
    text: "We have a P1 incident - help coordinate the response",
    category: "Incident",
  },
  {
    icon: Rocket,
    text: "Coordinate the launch of our new payments feature",
    category: "Launch",
  },
  {
    icon: ArrowLeftRight,
    text: "I'm leaving the team and need to hand off my knowledge",
    category: "Handoff",
  },
];

export function IntentPrompt({ onSubmit, isGenerating }: IntentPromptProps) {
  const [intent, setIntent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (intent.trim() && !isGenerating) {
      onSubmit(intent.trim());
    }
  };

  const handleSuggestionClick = (text: string) => {
    setIntent(text);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      {/* Ambient background effect */}
      <div className={styles.ambientGlow} />
      <div className={styles.gridPattern} />

      <motion.div
        className={styles.content}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className={styles.header}>
          <motion.div
            className={styles.logo}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Sparkles size={28} />
          </motion.div>
          <h1 className={styles.title}>
            What do you want to{" "}
            <span className={styles.accent}>accomplish</span>?
          </h1>
          <p className={styles.subtitle}>
            Describe your goal and AI will generate the right workspace with
            tools, agents, and integrations
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <textarea
              ref={textareaRef}
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="I want to..."
              className={styles.textarea}
              rows={3}
              disabled={isGenerating}
            />
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!intent.trim() || isGenerating}
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={18} />
                </motion.div>
              ) : (
                <ArrowRight size={18} />
              )}
            </button>
          </div>

          {isGenerating && (
            <motion.div
              className={styles.generatingState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.generatingDots}>
                <span />
                <span />
                <span />
              </div>
              <p className={styles.generatingText}>
                Analyzing intent and assembling workspace...
              </p>
            </motion.div>
          )}
        </form>

        <div className={styles.suggestions}>
          <p className={styles.suggestionsLabel}>Try something like:</p>
          <div className={styles.suggestionGrid}>
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                className={styles.suggestionCard}
                onClick={() => handleSuggestionClick(suggestion.text)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={isGenerating}
              >
                <div className={styles.suggestionIcon}>
                  <suggestion.icon size={16} />
                </div>
                <div className={styles.suggestionContent}>
                  <span className={styles.suggestionCategory}>
                    {suggestion.category}
                  </span>
                  <span className={styles.suggestionText}>
                    {suggestion.text}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <path
              d="M27.545 24.378L16.96 3.208c-.208-.416-.624-.624-1.04-.624s-.832.208-1.04.624L4.296 24.378c-.208.416-.208.832 0 1.248.208.416.624.624 1.04.624h21.17c.416 0 .832-.208 1.04-.624.207-.416.207-.832-.001-1.248z"
              fill="currentColor"
            />
          </svg>
          <span>Confluence</span>
        </div>
        <span className={styles.footerDivider}>·</span>
        <span className={styles.footerText}>Generative Workspaces</span>
      </footer>
    </motion.div>
  );
}
