import { Outlet } from "react-router";
import { Sidebar } from "~/components/Sidebar";

export default function Layout() {
  return (
    <div className="confluence-layout">
      <Sidebar />
      <div className="confluence-content">
        <header className="confluence-header">
          <div className="confluence-header-search">
            <input type="text" placeholder="Search" />
          </div>
          <div className="confluence-header-actions">
            <button className="confluence-header-button">+ Create</button>
            <div className="confluence-header-icon" title="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div className="confluence-header-icon" title="Settings">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
              </svg>
            </div>
            <div className="confluence-avatar" style={{ width: "28px", height: "28px", fontSize: "11px" }}>AK</div>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
