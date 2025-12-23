import { Link } from "react-router";

export default function Home() {
  return (
    <div className="confluence-dashboard">
      {/* Banner Section */}
      <div className="confluence-dashboard-section">
        <div className="confluence-info-panel" style={{ background: "var(--ds-background-neutral)", borderLeftColor: "var(--ds-blue)" }}>
          <div className="confluence-info-panel-title">Designed for Collaboration</div>
          <p style={{ margin: 0, color: "var(--ds-text)" }}>
            We've been adding capabilities to make Confluence the best tool for teams to brainstorm and bring ideas to life.
          </p>
          <button className="confluence-header-button" style={{ marginTop: "16px" }}>Play video</button>
        </div>
      </div>

      {/* Pick up where you left off */}
      <div className="confluence-dashboard-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 className="confluence-dashboard-title">Pick up where you left off</h2>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <select style={{ 
              background: "var(--ds-background-subtle)", 
              border: "1px solid var(--ds-border)", 
              borderRadius: "4px",
              padding: "6px 12px",
              color: "var(--ds-text)",
              fontSize: "14px"
            }}>
              <option>Sort by: Most relevant</option>
              <option>Sort by: Recently viewed</option>
            </select>
            <button style={{ 
              background: "none", 
              border: "none", 
              color: "var(--ds-text)", 
              fontSize: "14px",
              cursor: "pointer"
            }}>Edit feed</button>
          </div>
        </div>

        <div className="confluence-card-grid">
          <Link to="/page/meeting-notes" className="confluence-card">
            <div className="confluence-card-title">Meeting with SA Police</div>
            <div className="confluence-card-meta">Metre Matters</div>
            <div className="confluence-card-meta" style={{ marginTop: "8px" }}>Visited 22 November 2025</div>
          </Link>

          <Link to="/whiteboard/main" className="confluence-card">
            <div className="confluence-card-title">Untitled whiteboard 2025-11-17</div>
            <div className="confluence-card-meta">Adi Kishore</div>
            <div className="confluence-card-meta" style={{ marginTop: "8px" }}>Visited 17 November 2025</div>
          </Link>

          <Link to="/" className="confluence-card">
            <div className="confluence-card-title">Task Breakdown</div>
            <div className="confluence-card-meta">Metre Matters</div>
            <div className="confluence-card-meta" style={{ marginTop: "8px" }}>Visited 10 November 2025</div>
          </Link>

          <Link to="/whiteboard/main" className="confluence-card">
            <div className="confluence-card-title">Untitled whiteboard 2025-09-23</div>
            <div className="confluence-card-meta">Adi Kishore</div>
            <div className="confluence-card-meta" style={{ marginTop: "8px" }}>Visited 23 September 2025</div>
          </Link>

          <Link to="/" className="confluence-card">
            <div className="confluence-card-title">Version 1 Requirements</div>
            <div className="confluence-card-meta">Metre Matters</div>
            <div className="confluence-card-meta" style={{ marginTop: "8px" }}>Visited 21 September 2025</div>
          </Link>

          <Link to="/" className="confluence-card">
            <div className="confluence-card-title">MVP Architecture</div>
            <div className="confluence-card-meta">Metre Matters</div>
            <div className="confluence-card-meta" style={{ marginTop: "8px" }}>Visited 14 September 2025</div>
          </Link>
        </div>
      </div>

      {/* Discover what's happening */}
      <div className="confluence-dashboard-section">
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <button style={{
            background: "var(--ds-background-selected)",
            border: "none",
            color: "var(--ds-text-inverse)",
            padding: "8px 16px",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer"
          }}>Following</button>
          <button style={{
            background: "transparent",
            border: "none",
            color: "var(--ds-text-subtle)",
            padding: "8px 16px",
            borderRadius: "4px",
            fontSize: "14px",
            cursor: "pointer"
          }}>Popular</button>
          <button style={{
            background: "transparent",
            border: "none",
            color: "var(--ds-text-subtle)",
            padding: "8px 16px",
            borderRadius: "4px",
            fontSize: "14px",
            cursor: "pointer"
          }}>Announcements</button>
        </div>

        <div className="confluence-info-panel" style={{ background: "var(--ds-background-neutral)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div className="confluence-info-panel-title">We're keeping you in the loop</div>
              <p style={{ margin: "8px 0 0 0", color: "var(--ds-text)", fontSize: "14px" }}>
                Stay in-the-know by following people and spaces. Their activity will show up in your feed, but you won't receive email notifications about it. Add to, or edit, your feed anytime.
              </p>
              <button style={{
                background: "transparent",
                border: "1px solid var(--ds-border)",
                color: "var(--ds-text)",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "14px",
                marginTop: "16px",
                cursor: "pointer"
              }}>Edit feed</button>
            </div>
            <div style={{ width: "120px", height: "120px", opacity: 0.3 }}>
              <svg viewBox="0 0 100 100" fill="currentColor" style={{ width: "100%", height: "100%" }}>
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="30" cy="30" r="8" fill="currentColor" />
                <circle cx="70" cy="30" r="8" fill="currentColor" />
                <circle cx="50" cy="70" r="8" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        {/* Activity Feed Entry */}
        <div style={{ 
          marginTop: "24px", 
          padding: "16px", 
          background: "var(--ds-background-neutral)",
          border: "1px solid var(--ds-border)",
          borderRadius: "6px"
        }}>
          <div style={{ fontSize: "14px", color: "var(--ds-text-subtle)", marginBottom: "8px" }}>
            SK Steve Kraynov edited 19 November 2025
          </div>
          <div style={{ fontSize: "16px", fontWeight: 500, color: "var(--ds-text-inverse)", marginBottom: "4px" }}>
            Meeting with SA Police
          </div>
          <div style={{ fontSize: "12px", color: "var(--ds-text-subtle)", marginBottom: "12px" }}>
            Owned by Steve Kraynov • Metre Matters
          </div>
          <div style={{ fontSize: "14px", color: "var(--ds-text)", lineHeight: "1.6" }}>
            questions :check_mark: where are they at what are their pain points Can we dig into their process. Literally, are we able to see a video of them analyzing bicyclist-cam footage, or ask what tools are used to assess. what is the confidence in the assessment. how consistent are the assessments today? Out of 12k,...
          </div>
          <div style={{ marginTop: "12px" }}>
            <a href="#" style={{ 
              color: "var(--ds-blue)", 
              fontSize: "14px", 
              textDecoration: "none" 
            }}>Recent actions</a>
          </div>
        </div>
      </div>
    </div>
  );
}
