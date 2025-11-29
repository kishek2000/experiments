import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router";
import { Sidebar } from "~/components/Sidebar";

const SAMPLE_PAGES: Record<string, { title: string; content: string }> = {
  "getting-started": {
    title: "Getting Started with Gesture AI",
    content: `<h2>Introduction</h2>
<p>Welcome to the Gesture AI Lab! This experimental playground explores how gesture-based interactions can transform the way we work with software.</p>

<p>Try drawing gestures on this page - press G to enter gesture mode, then draw!</p>

<h3>The Vision</h3>
<p>Imagine being able to draw a quick circle around text to get an AI summary, or sketching an arrow to connect ideas. That's what we're building here.</p>

<h3>Key Concepts</h3>
<p><strong>Universal Gestures</strong> — Work the same way everywhere in the app</p>

<p><strong>Context-Aware Actions</strong> — The same gesture can do different things based on where you are</p>

<p><strong>AI-Powered Responses</strong> — Gestures trigger intelligent, contextual actions</p>

<h3>Try These Gestures</h3>
<p>Draw a curved arc between two paragraphs to swap them.</p>

<p>Draw a slash through this paragraph to delete it.</p>

<p>Draw an arrow pointing up to move this block up.</p>

<p>Draw a plus sign to add a new block below.</p>

<blockquote>
  <p>This is a callout block. Try drawing a checkmark on it to mark it complete!</p>
</blockquote>

<h3>More Ideas to Try</h3>
<p>Draw a star to favorite this paragraph.</p>

<p>Draw a triangle to add a warning indicator.</p>

<p>Draw a zigzag to trigger an AI rewrite.</p>

<p>Draw equals (two horizontal lines) to duplicate a block.</p>`,
  },
  "project-ideas": {
    title: "Project Ideas",
    content: `<h2>Gesture AI Use Cases</h2>

<h3>Document Editing</h3>
<p>Draw a circle to summarize selected content</p>
<p>Draw an X to delete a section</p>
<p>Draw an arrow to move content</p>
<p>Draw a star to bookmark important sections</p>

<h3>Whiteboard Collaboration</h3>
<p>Draw shapes to create smart objects</p>
<p>Connect objects with arrows for automatic relationships</p>
<p>Circle items to group them</p>
<p>Gesture commands for AI-generated diagrams</p>

<h3>Code Review</h3>
<p>Circle code to request AI explanation</p>
<p>Check mark to approve changes</p>
<p>X to request changes</p>
<p>Arrow to suggest moving code</p>`,
  },
  "meeting-notes": {
    title: "Meeting Notes Template",
    content: `<h2>Weekly Sync - Gesture AI Project</h2>

<p><strong>Date:</strong> November 26, 2024</p>
<p><strong>Attendees:</strong> Team</p>

<h3>Agenda</h3>
<p>Demo gesture recognition progress</p>
<p>Discuss AI integration approaches</p>
<p>Plan next sprint</p>

<h3>Discussion Notes</h3>
<p>Add your notes here...</p>

<h3>Action Items</h3>
<p>Implement additional gesture templates</p>
<p>Research multimodal AI models</p>
<p>Design gesture feedback animations</p>

<h3>Next Meeting</h3>
<p>TBD</p>`,
  },
};

export default function Page() {
  const { pageId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = SAMPLE_PAGES[pageId || "getting-started"];
    if (page) {
      setTitle(page.title);
      setContent(page.content);
    }
  }, [pageId]);

  return (
    <>
      <Sidebar activePage={pageId} />
      <div className="cf-content">
        <div className="cf-page">
          {/* Toolbar */}
          <div className="cf-toolbar">
            <button className="cf-toolbar-btn" title="Bold">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
              </svg>
            </button>
            <button className="cf-toolbar-btn" title="Italic">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
              </svg>
            </button>
            <button className="cf-toolbar-btn" title="Underline">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
              </svg>
            </button>
            <div className="cf-toolbar-divider" />
            <button className="cf-toolbar-btn" title="Heading 1">
              H1
            </button>
            <button className="cf-toolbar-btn" title="Heading 2">
              H2
            </button>
            <button className="cf-toolbar-btn" title="Heading 3">
              H3
            </button>
            <div className="cf-toolbar-divider" />
            <button className="cf-toolbar-btn" title="Bullet List">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
              </svg>
            </button>
            <button className="cf-toolbar-btn" title="Numbered List">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />
              </svg>
            </button>
            <div className="cf-toolbar-divider" />
            <button className="cf-toolbar-btn" title="Link">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
              </svg>
            </button>
            <button className="cf-toolbar-btn" title="Code">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
              </svg>
            </button>
            <div className="cf-toolbar-divider" />
            <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
              <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs">G</kbd>
              <span>Gesture mode</span>
            </div>
          </div>

          <div className="cf-page-breadcrumb">
            <span>Gesture AI Lab</span>
            <span>/</span>
            <span>{title}</span>
          </div>

          <h1
            className="cf-page-title"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setTitle(e.currentTarget.textContent || "")}
            data-placeholder="Untitled"
          >
            {title}
          </h1>

          <div className="cf-page-meta">
            <div className="cf-page-author">
              <div className="cf-page-avatar">AK</div>
              <span>Adi Kishore</span>
            </div>
            <span>Last edited: Just now</span>
            <span>•</span>
            <span className="text-[var(--color-cf-green)] flex items-center gap-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="12" r="8" />
              </svg>
              Saved
            </span>
          </div>

          <div
            ref={editorRef}
            className="cf-editor"
            contentEditable
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: content }}
            data-placeholder="Start typing or press G to draw a gesture..."
          />
        </div>
      </div>
    </>
  );
}
