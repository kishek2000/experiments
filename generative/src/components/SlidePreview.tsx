import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Maximize2 } from "lucide-react";
import styles from "./SlidePreview.module.css";

interface Slide {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  background?: string;
}

interface SlidePreviewProps {
  slides: Slide[];
  title?: string;
}

export function SlidePreview({
  slides,
  title = "Generated Slide Deck",
}: SlidePreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () =>
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <div className={styles.controls}>
          <button className={styles.controlBtn} title="Present">
            <Play size={14} />
          </button>
          <button className={styles.controlBtn} title="Fullscreen">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      <div className={styles.slideContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className={styles.slide}
            style={{
              background:
                slides[currentSlide]?.background ||
                "linear-gradient(135deg, #0052CC 0%, #0747A6 100%)",
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className={styles.slideTitle}>{slides[currentSlide]?.title}</h2>
            {slides[currentSlide]?.subtitle && (
              <p className={styles.slideSubtitle}>
                {slides[currentSlide].subtitle}
              </p>
            )}
            <div className={styles.slideContent}>
              {slides[currentSlide]?.content}
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          className={`${styles.navBtn} ${styles.prevBtn}`}
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className={`${styles.navBtn} ${styles.nextBtn}`}
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className={styles.thumbnails}>
        {slides.map((slide, idx) => (
          <button
            key={idx}
            className={`${styles.thumbnail} ${
              idx === currentSlide ? styles.active : ""
            }`}
            onClick={() => setCurrentSlide(idx)}
            style={{
              background:
                slide.background ||
                "linear-gradient(135deg, #0052CC 0%, #0747A6 100%)",
            }}
          >
            <span className={styles.thumbNumber}>{idx + 1}</span>
            <span className={styles.thumbTitle}>{slide.title}</span>
          </button>
        ))}
      </div>

      <div className={styles.footer}>
        <span className={styles.slideCount}>
          Slide {currentSlide + 1} of {slides.length}
        </span>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Pre-built onboarding slides
export const ONBOARDING_SLIDES: Slide[] = [
  {
    title: "Welcome to Project Phoenix",
    subtitle: "Your personalized onboarding journey",
    background: "linear-gradient(135deg, #0052CC 0%, #0747A6 100%)",
    content: (
      <ul className={styles.bulletList}>
        <li>Authentication platform modernization</li>
        <li>Team of 8 engineers across 3 time zones</li>
        <li>Currently in Sprint 14 of Q1 roadmap</li>
      </ul>
    ),
  },
  {
    title: "Team Structure",
    subtitle: "Key people to know",
    background: "linear-gradient(135deg, #6554C0 0%, #5243AA 100%)",
    content: (
      <div className={styles.teamGrid}>
        <div className={styles.teamMember}>
          <div className={styles.avatar}>SC</div>
          <span>Sarah Chen</span>
          <small>Tech Lead</small>
        </div>
        <div className={styles.teamMember}>
          <div className={styles.avatar}>MJ</div>
          <span>Mike Johnson</span>
          <small>Product Manager</small>
        </div>
        <div className={styles.teamMember}>
          <div className={styles.avatar}>AK</div>
          <span>Alex Kim</span>
          <small>Senior Engineer</small>
        </div>
        <div className={styles.teamMember}>
          <div className={styles.avatar}>You</div>
          <span>You</span>
          <small>Engineer</small>
        </div>
      </div>
    ),
  },
  {
    title: "Current Sprint Goals",
    subtitle: "Sprint 14 - OAuth Integration",
    background: "linear-gradient(135deg, #00875A 0%, #006644 100%)",
    content: (
      <ul className={styles.bulletList}>
        <li>✅ Google OAuth provider complete</li>
        <li>🔄 GitHub OAuth in progress (Alex)</li>
        <li>📋 Apple Sign-In planned for next sprint</li>
        <li>⚠️ Token refresh edge cases need attention</li>
      </ul>
    ),
  },
  {
    title: "Your First Week",
    subtitle: "Recommended tasks to get started",
    background: "linear-gradient(135deg, #FF5630 0%, #DE350B 100%)",
    content: (
      <ol className={styles.numberedList}>
        <li>Set up local development environment</li>
        <li>Review architecture decision records</li>
        <li>Shadow Sarah on code review</li>
        <li>Pick up PROJ-789 (good first issue)</li>
      </ol>
    ),
  },
  {
    title: "Key Resources",
    subtitle: "Bookmark these links",
    background: "linear-gradient(135deg, #FFAB00 0%, #FF8B00 100%)",
    content: (
      <ul className={styles.linkList}>
        <li>📚 Confluence: Project Phoenix Space</li>
        <li>📋 Jira: Phoenix Board</li>
        <li>💬 Slack: #team-phoenix</li>
        <li>🎨 Figma: Auth Designs</li>
        <li>📊 Atlas: Q1 Goals</li>
      </ul>
    ),
  },
];
