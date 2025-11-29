import { Link, useLocation } from "react-router";

interface SidebarProps {
  activePage?: string;
}

export function Sidebar({ activePage }: SidebarProps) {
  const location = useLocation();
  const isWhiteboard = location.pathname.startsWith("/whiteboard");

  return (
    <aside className="cf-sidebar">
      <div className="cf-sidebar-header">
        <div className="cf-sidebar-space">
          <div className="cf-sidebar-space-icon">GL</div>
          <div>
            <div className="cf-sidebar-space-name">Gesture AI Lab</div>
            <div className="text-xs text-gray-500">Experimental Space</div>
          </div>
        </div>
      </div>

      <nav className="cf-sidebar-nav">
        <div className="cf-sidebar-section">Navigation</div>

        <Link
          to="/"
          className={`cf-sidebar-item ${location.pathname === "/" ? "active" : ""}`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
          Overview
        </Link>

        <div className="cf-sidebar-section mt-4">Pages</div>

        <Link
          to="/page/getting-started"
          className={`cf-sidebar-item ${activePage === "getting-started" ? "active" : ""}`}
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
          </svg>
          Getting Started
        </Link>

        <Link
          to="/page/project-ideas"
          className={`cf-sidebar-item ${activePage === "project-ideas" ? "active" : ""}`}
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
          </svg>
          Project Ideas
        </Link>

        <Link
          to="/page/meeting-notes"
          className={`cf-sidebar-item ${activePage === "meeting-notes" ? "active" : ""}`}
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
          </svg>
          Meeting Notes
        </Link>

        <div className="cf-sidebar-section mt-4">Whiteboards</div>

        <Link
          to="/whiteboard/main"
          className={`cf-sidebar-item ${isWhiteboard && location.pathname.includes("main") ? "active" : ""}`}
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
          Main Board
        </Link>

        <Link
          to="/whiteboard/brainstorm"
          className={`cf-sidebar-item ${isWhiteboard && location.pathname.includes("brainstorm") ? "active" : ""}`}
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
          Brainstorm
        </Link>

        <div className="cf-sidebar-section mt-4">Shortcuts</div>

        <div className="cf-sidebar-item text-gray-400 cursor-default">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono text-gray-500">
            G
          </kbd>
          <span className="text-sm">Hold for gesture mode</span>
        </div>

        <div className="cf-sidebar-item text-gray-400 cursor-default">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono text-gray-500">
            Esc
          </kbd>
          <span className="text-sm">Cancel gesture</span>
        </div>
      </nav>

      <div className="mt-auto p-4 border-t border-gray-200">
        <div className="text-xs text-gray-400 text-center">
          Gesture AI Lab v0.1.0
          <br />
          Proof of Concept
        </div>
      </div>
    </aside>
  );
}
