import { Link, useLocation } from "react-router";

interface SidebarProps {
  activePage?: string;
}

export function Sidebar({ activePage }: SidebarProps) {
  const location = useLocation();
  const isWhiteboard = location.pathname.startsWith("/whiteboard");
  const isPage = location.pathname.startsWith("/page");

  return (
    <aside className="confluence-sidebar">
      <div className="confluence-sidebar-header">
        <div className="confluence-logo">
          <svg viewBox="0 0 32 32" fill="currentColor">
            <path d="M4.654 26.581c-.364.592-.71 1.224-.966 1.643a.648.648 0 00.233.889l4.238 2.593a.648.648 0 00.889-.212c.213-.354.56-.889.966-1.506 2.508-3.858 5.037-3.412 9.57-1.498l4.41 1.862a.648.648 0 00.847-.34l2.032-4.81a.648.648 0 00-.318-.826c-1.202-.536-3.624-1.616-5.989-2.614-6.633-2.805-12.258-2.783-15.912 4.819z" />
            <path d="M27.346 5.419c.364-.592.71-1.224.966-1.643a.648.648 0 00-.233-.889L23.841.294a.648.648 0 00-.889.212c-.213.354-.56.889-.966 1.506-2.508 3.858-5.037 3.412-9.57 1.498L8.006 1.648a.648.648 0 00-.847.34L5.127 6.798a.648.648 0 00.318.826c1.202.536 3.624 1.616 5.989 2.614 6.633 2.805 12.258 2.783 15.912-4.819z" />
          </svg>
          <span>Confluence</span>
        </div>
      </div>

      <div className="confluence-search">
        <input type="text" placeholder="Q Search" />
      </div>

      <nav className="confluence-nav">
        <Link
          to="/"
          className={`confluence-nav-item ${location.pathname === "/" ? "active" : ""}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
          <span>For you</span>
        </Link>

        <Link
          to="/"
          className="confluence-nav-item"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
          <span>Recent</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto" }}>
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </Link>

        <Link
          to="/"
          className="confluence-nav-item"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
          <span>Starred</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto" }}>
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </Link>

        <Link
          to="/"
          className="confluence-nav-item"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>Spaces</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto" }}>
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </Link>

        <Link
          to="/"
          className="confluence-nav-item"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>Apps</span>
        </Link>

        <div className="confluence-nav-section">Shortcuts</div>

        <div className="confluence-nav-section">Content</div>

        <div className="confluence-search" style={{ padding: "8px 16px" }}>
          <input type="text" placeholder="Q Search by title" style={{ fontSize: "12px" }} />
        </div>

        <Link
          to="/page/getting-started"
          className={`confluence-nav-item ${activePage === "getting-started" ? "active" : ""}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
          </svg>
          <span>Getting started in Confluence</span>
        </Link>

        <Link
          to="/page/meeting-notes"
          className={`confluence-nav-item ${activePage === "meeting-notes" ? "active" : ""}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
          </svg>
          <span>2025-06-14 Meeting not... DRAFT</span>
        </Link>

        <Link
          to="/whiteboard/main"
          className={`confluence-nav-item ${isWhiteboard ? "active" : ""}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21,15 16,10 5,21" />
          </svg>
          <span>Untitled whiteboard 2025-09-23</span>
        </Link>

        <Link
          to="/whiteboard/brainstorm"
          className={`confluence-nav-item ${isWhiteboard && location.pathname.includes("brainstorm") ? "active" : ""}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21,15 16,10 5,21" />
          </svg>
          <span>Untitled whiteboard 2025-11-17</span>
        </Link>

        <button className="confluence-nav-item" style={{ marginTop: "8px" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>+ Create</span>
        </button>

        <div className="confluence-nav-section">Blogs</div>
        <div className="confluence-nav-item">
          <span>99</span>
        </div>

        <div className="confluence-nav-section">Calendars</div>

        <div className="confluence-nav-section">Company hub</div>
        <Link to="/" className="confluence-nav-item">
          <span>Company hub</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto", width: "12px", height: "12px" }}>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15,3 21,3 21,9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </Link>

        <Link to="/" className="confluence-nav-item">
          <span>Teams</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto", width: "12px", height: "12px" }}>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15,3 21,3 21,9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </Link>

        <div className="confluence-nav-item">
          <span>... More</span>
        </div>
      </nav>

      <div className="confluence-user-profile">
        <div className="confluence-avatar">AK</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ds-text-inverse)" }}>Adi Kishore</div>
        </div>
      </div>

      <div style={{ padding: "16px", borderTop: "1px solid var(--ds-border)" }}>
        <button className="confluence-header-button" style={{ width: "100%" }}>
          Invite people
        </button>
      </div>
    </aside>
  );
}
