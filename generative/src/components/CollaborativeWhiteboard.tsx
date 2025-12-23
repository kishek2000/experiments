import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MousePointer2,
  Pencil,
  StickyNote,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import styles from "./CollaborativeWhiteboard.module.css";

interface StickyNoteData {
  id: string;
  x: number;
  y: number;
  text: string;
  color: "yellow" | "blue" | "green" | "purple" | "pink";
  author: string;
}

interface CollaboratorCursor {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

const COLORS = ["yellow", "blue", "green", "purple", "pink"] as const;

const INITIAL_NOTES: StickyNoteData[] = [
  { id: "1", x: 60, y: 40, text: "Great team collaboration this sprint! 🎉", color: "green", author: "Sarah" },
  { id: "2", x: 220, y: 80, text: "Need better code review process", color: "yellow", author: "Alex" },
  { id: "3", x: 380, y: 50, text: "Ship faster with feature flags", color: "blue", author: "Jordan" },
  { id: "4", x: 140, y: 180, text: "More async standups?", color: "purple", author: "Sam" },
  { id: "5", x: 300, y: 200, text: "Documentation improvements needed", color: "pink", author: "You" },
];

const FAKE_COLLABORATORS: Omit<CollaboratorCursor, "x" | "y" | "targetX" | "targetY">[] = [
  { id: "sarah", name: "Sarah", color: "#0052CC" },
  { id: "alex", name: "Alex", color: "#00875A" },
  { id: "jordan", name: "Jordan", color: "#6554C0" },
];

export function CollaborativeWhiteboard() {
  const [tool, setTool] = useState<"select" | "note" | "draw">("select");
  const [notes, setNotes] = useState<StickyNoteData[]>(INITIAL_NOTES);
  const [cursors, setCursors] = useState<CollaboratorCursor[]>([]);
  const [draggingNote, setDraggingNote] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize and animate fake collaborator cursors
  useEffect(() => {
    // Initialize cursors with random positions
    const initialCursors: CollaboratorCursor[] = FAKE_COLLABORATORS.map((c) => ({
      ...c,
      x: Math.random() * 400 + 50,
      y: Math.random() * 300 + 50,
      targetX: Math.random() * 400 + 50,
      targetY: Math.random() * 300 + 50,
    }));
    setCursors(initialCursors);

    // Animate cursors to simulate real-time collaboration
    const interval = setInterval(() => {
      setCursors((prev) =>
        prev.map((cursor) => {
          // Move towards target
          const dx = cursor.targetX - cursor.x;
          const dy = cursor.targetY - cursor.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 5) {
            // Pick new target
            return {
              ...cursor,
              x: cursor.targetX,
              y: cursor.targetY,
              targetX: Math.random() * 450 + 30,
              targetY: Math.random() * 320 + 30,
            };
          }

          // Smooth movement
          return {
            ...cursor,
            x: cursor.x + dx * 0.08,
            y: cursor.y + dy * 0.08,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleNoteMouseDown = (noteId: string, e: React.MouseEvent) => {
    if (tool !== "select") return;
    e.preventDefault();
    setDraggingNote(noteId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNote || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 70; // Center offset
    const y = e.clientY - rect.top - 50;

    setNotes((prev) =>
      prev.map((note) =>
        note.id === draggingNote
          ? { ...note, x: Math.max(0, Math.min(x, 450)), y: Math.max(0, Math.min(y, 300)) }
          : note
      )
    );
  };

  const handleMouseUp = () => {
    setDraggingNote(null);
  };

  const addNote = () => {
    const newNote: StickyNoteData = {
      id: Date.now().toString(),
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50,
      text: "New idea...",
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      author: "You",
    };
    setNotes((prev) => [...prev, newNote]);
    setTool("select");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Collaborative Whiteboard</span>
        <div className={styles.collaborators}>
          {FAKE_COLLABORATORS.map((c) => (
            <div
              key={c.id}
              className={styles.collaboratorDot}
              style={{ backgroundColor: c.color }}
              title={c.name}
            />
          ))}
          <span className={styles.collaboratorCount}>
            {FAKE_COLLABORATORS.length + 1} collaborating
          </span>
        </div>
      </div>

      <div className={styles.toolbar}>
        <button
          className={`${styles.tool} ${tool === "select" ? styles.active : ""}`}
          onClick={() => setTool("select")}
          title="Select"
        >
          <MousePointer2 size={16} />
        </button>
        <button
          className={`${styles.tool} ${tool === "note" ? styles.active : ""}`}
          onClick={() => {
            setTool("note");
            addNote();
          }}
          title="Add Sticky Note"
        >
          <StickyNote size={16} />
        </button>
        <button
          className={`${styles.tool} ${tool === "draw" ? styles.active : ""}`}
          onClick={() => setTool("draw")}
          title="Draw"
        >
          <Pencil size={16} />
        </button>
        <div className={styles.toolDivider} />
        <button className={styles.tool} title="Zoom In">
          <ZoomIn size={16} />
        </button>
        <button className={styles.tool} title="Zoom Out">
          <ZoomOut size={16} />
        </button>
      </div>

      <div
        ref={canvasRef}
        className={styles.canvas}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Sticky Notes */}
        <AnimatePresence>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              className={`${styles.stickyNote} ${styles[`note-${note.color}`]}`}
              style={{ left: note.x, top: note.y }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              onMouseDown={(e) => handleNoteMouseDown(note.id, e)}
            >
              <div className={styles.noteContent}>{note.text}</div>
              <div className={styles.noteAuthor}>{note.author}</div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Collaborative Cursors */}
        {cursors.map((cursor) => (
          <div
            key={cursor.id}
            className={styles.cursor}
            style={{
              transform: `translate(${cursor.x}px, ${cursor.y}px)`,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: cursor.color }}
            >
              <path
                d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
                fill="currentColor"
              />
              <path
                d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
            <span
              className={styles.cursorLabel}
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name}
            </span>
          </div>
        ))}

        {/* Your cursor indicator */}
        <div className={styles.youIndicator}>
          You can drag sticky notes
        </div>
      </div>
    </div>
  );
}

