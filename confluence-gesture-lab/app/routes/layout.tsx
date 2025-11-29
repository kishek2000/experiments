import { Outlet, Link, useLocation } from "react-router";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col">
      {/* Confluence Header */}
      <header className="cf-header">
        <div className="cf-header-logo">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="currentColor">
            <path d="M4.654 26.581c-.364.592-.71 1.224-.966 1.643a.648.648 0 00.233.889l4.238 2.593a.648.648 0 00.889-.212c.213-.354.56-.889.966-1.506 2.508-3.858 5.037-3.412 9.57-1.498l4.41 1.862a.648.648 0 00.847-.34l2.032-4.81a.648.648 0 00-.318-.826c-1.202-.536-3.624-1.616-5.989-2.614-6.633-2.805-12.258-2.783-15.912 4.819z" />
            <path d="M27.346 5.419c.364-.592.71-1.224.966-1.643a.648.648 0 00-.233-.889L23.841.294a.648.648 0 00-.889.212c-.213.354-.56.889-.966 1.506-2.508 3.858-5.037 3.412-9.57 1.498L8.006 1.648a.648.648 0 00-.847.34L5.127 6.798a.648.648 0 00.318.826c1.202.536 3.624 1.616 5.989 2.614 6.633 2.805 12.258 2.783 15.912-4.819z" />
          </svg>
          <span>Confluence</span>
        </div>

        <nav className="cf-header-nav">
          <Link
            to="/"
            className={`cf-header-nav-item ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/page/getting-started"
            className={`cf-header-nav-item ${location.pathname.startsWith("/page") ? "active" : ""}`}
          >
            Pages
          </Link>
          <Link
            to="/whiteboard/main"
            className={`cf-header-nav-item ${location.pathname.startsWith("/whiteboard") ? "active" : ""}`}
          >
            Whiteboards
          </Link>
        </nav>

        <div className="cf-header-search">
          <input type="text" placeholder="Search Confluence..." />
        </div>

        <div className="flex items-center gap-2">
          <button
            className="cf-header-nav-item"
            title="Gesture Mode: Hold G to draw"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center text-white text-sm font-semibold">
            AK
          </div>
        </div>
      </header>

      <main className="cf-layout">
        <Outlet />
      </main>
    </div>
  );
}
