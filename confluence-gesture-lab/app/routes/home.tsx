import { Link } from "react-router";
import { Sidebar } from "~/components/Sidebar";

export default function Home() {
  return (
    <>
      <Sidebar />
      <div className="cf-content">
        <div className="cf-page">
          <div className="cf-page-breadcrumb">
            <span>Gesture AI Lab</span>
            <span>/</span>
            <span>Home</span>
          </div>

          <h1 className="cf-page-title">Gesture AI Lab</h1>

          <div className="cf-page-meta">
            <div className="cf-page-author">
              <div className="cf-page-avatar">AK</div>
              <span>Created by Adi Kishore</span>
            </div>
            <span>Last updated: Today</span>
          </div>

          <div className="cf-editor">
            <h2>🎨 Draw Gestures, Take Action</h2>
            <p>
              Press <strong>G</strong> to enter gesture mode, draw one or more
              strokes, then press <strong>Enter</strong> to execute. Your
              gestures directly manipulate the content.
            </p>

            <h3>Quick Start</h3>
            <ol>
              <li>
                Press{" "}
                <kbd
                  style={{
                    background: "#EBECF0",
                    padding: "2px 6px",
                    borderRadius: "3px",
                  }}
                >
                  G
                </kbd>{" "}
                to enter gesture mode
              </li>
              <li>Draw a gesture (you can use multiple strokes)</li>
              <li>
                Press{" "}
                <kbd
                  style={{
                    background: "#EBECF0",
                    padding: "2px 6px",
                    borderRadius: "3px",
                  }}
                >
                  Enter
                </kbd>{" "}
                to execute, or{" "}
                <kbd
                  style={{
                    background: "#EBECF0",
                    padding: "2px 6px",
                    borderRadius: "3px",
                  }}
                >
                  Esc
                </kbd>{" "}
                to cancel
              </li>
            </ol>

            <h3>Gesture Reference</h3>

            <h4>Block Manipulation</h4>
            <ul>
              <li>
                <strong>Curved Arc ⌒</strong> — Draw between two blocks to{" "}
                <em>swap</em> them
              </li>
              <li>
                <strong>Slash /</strong> — Draw through content to{" "}
                <em>delete</em> it
              </li>
              <li>
                <strong>Arrow Up ↑</strong> — <em>Move block up</em>
              </li>
              <li>
                <strong>Arrow Down ↓</strong> — <em>Move block down</em>
              </li>
              <li>
                <strong>Equals =</strong> (two lines) — <em>Duplicate</em> block
              </li>
              <li>
                <strong>Vertical Line |</strong> — <em>Split</em> block in half
              </li>
              <li>
                <strong>Arrows Inward →←</strong> — <em>Merge</em> blocks
              </li>
            </ul>

            <h4>Formatting</h4>
            <ul>
              <li>
                <strong>Circle ○</strong> — <em>Select</em> content area
              </li>
              <li>
                <strong>Checkmark ✓</strong> — Mark as <em>complete</em>
              </li>
              <li>
                <strong>Horizontal Line —</strong> — <em>Strikethrough</em>
              </li>
              <li>
                <strong>Wavy Line ~</strong> — <em>Highlight</em> text
              </li>
              <li>
                <strong>Star ☆</strong> — <em>Favorite</em>/star content
              </li>
              <li>
                <strong>Triangle △</strong> — Add <em>warning</em> callout
              </li>
              <li>
                <strong>Greater Than &gt;</strong> — <em>Indent</em>
              </li>
              <li>
                <strong>Less Than &lt;</strong> — <em>Outdent</em>
              </li>
            </ul>

            <h4>Creation</h4>
            <ul>
              <li>
                <strong>Plus +</strong> — <em>Add</em> new block
              </li>
              <li>
                <strong>Rectangle □</strong> — Create <em>callout</em> block
              </li>
              <li>
                <strong>Curly Braces {"{}"}</strong> — Create{" "}
                <em>code block</em>
              </li>
              <li>
                <strong>Short Dash -</strong> — Toggle <em>bullet point</em>
              </li>
            </ul>

            <h4>AI Actions</h4>
            <ul>
              <li>
                <strong>Zigzag ⟿</strong> — AI <em>rewrite</em> content
              </li>
              <li>
                <strong>Question Mark ?</strong> — <em>Ask AI</em> about content
              </li>
              <li>
                <strong>Arrow Right →</strong> — AI <em>continue</em> writing
              </li>
              <li>
                <strong>Pinch ⟨⟩</strong> — AI <em>summarize</em>
              </li>
              <li>
                <strong>Expand ⟩⟨</strong> — AI <em>elaborate</em>
              </li>
            </ul>

            <h4>Utility</h4>
            <ul>
              <li>
                <strong>Loop ↺</strong> (counter-clockwise) — <em>Undo</em>
              </li>
              <li>
                <strong>Loop ↻</strong> (clockwise) — <em>Redo</em>
              </li>
            </ul>

            <blockquote>
              <strong>💡 Try it now!</strong> Press G and draw a curved arc
              between any two paragraphs on this page to swap them. Or draw a
              slash through a paragraph to delete it.
            </blockquote>

            <h3>Try the Editor</h3>
            <div className="flex gap-4 mt-4">
              <Link
                to="/page/getting-started"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-cf-blue)] text-white rounded hover:bg-[var(--color-cf-blue-hover)] transition-colors no-underline"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10,9 9,9 8,9" />
                </svg>
                Open Page Editor
              </Link>

              <Link
                to="/whiteboard/main"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-cf-purple)] text-white rounded hover:opacity-90 transition-opacity no-underline"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21,15 16,10 5,21" />
                </svg>
                Open Whiteboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
