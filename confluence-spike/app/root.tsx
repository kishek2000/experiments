import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { GestureProvider } from "~/components/gesture/GestureProvider";
import { GestureOverlay } from "~/components/gesture/GestureOverlay";

export const links: Route.LinksFunction = () => [];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <GestureProvider>
      <Outlet />
      <GestureOverlay />
    </GestureProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="confluence-layout">
      <div className="confluence-content">
        <div className="confluence-page-container">
          <div className="confluence-page">
            <h1 className="confluence-page-title">{message}</h1>
            <p style={{ color: "var(--ds-text)", marginTop: "16px" }}>{details}</p>
            {stack && (
              <pre style={{
                background: "var(--ds-background-subtle)",
                padding: "16px",
                borderRadius: "6px",
                overflowX: "auto",
                marginTop: "16px",
                color: "var(--ds-text)"
              }}>
                <code>{stack}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
