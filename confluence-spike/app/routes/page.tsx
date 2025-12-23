import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { ADFRenderer, createADFDocument, ADFHelpers } from "~/components/ADFRenderer";
import type { ADFNode } from "~/components/ADFRenderer";

const SAMPLE_PAGES: Record<string, { title: string; adf: any }> = {
  "getting-started": {
    title: "Getting started in Confluence",
    adf: createADFDocument([
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "👋",
            marks: [],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Welcome to Confluence!" }],
      },
      {
        type: "panel",
        attrs: { panelType: "info" },
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "You can use Confluence to create a rich knowledge base or to collaborate with others using words, videos, images, graphics, charts, and graphs. This page walks you through some Confluence basics like spaces, pages, and elements that allow you to create and manage impactful content for your teams.",
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Confluence 101" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Confluence is a collaboration wiki tool used to help teams collaborate and share knowledge effectively. With Confluence, you can create, organize, and discuss work with your team.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "Making purposeful content" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Create pages that help your team work together. Use formatting, images, and other elements to make your content engaging and easy to read.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "Collaborating with teammates" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Use mentions, comments, and @-notifications to collaborate with your team members in real-time.",
          },
        ],
      },
    ]),
  },
  "meeting-notes": {
    title: "2025-06-14 Meeting notes",
    adf: createADFDocument([
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Date" }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "14 Jun 2025" }],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Participants" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "List meeting participants using their @ mention names",
          },
        ],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "mention",
                    attrs: { id: "adi-kishore", text: "Adi Kishore" },
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "@mention a person to add them as an attendee and they will be notified.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Goals" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "List goals for this meeting (e.g., Set design priorities for FY19)",
          },
        ],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [],
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Whiteboard" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Type /whiteboard to create an interactive canvas for icebreakers, brainstorms, diagramming, retros, and more",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Discussion topics" }],
      },
      {
        type: "table",
        content: [
          {
            type: "tableRow",
            content: [
              {
                type: "tableHeader",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Time" }],
                  },
                ],
              },
              {
                type: "tableHeader",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Item" }],
                  },
                ],
              },
              {
                type: "tableHeader",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Presenter" }],
                  },
                ],
              },
              {
                type: "tableHeader",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Notes" }],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Add notes for each discussion topic",
          },
        ],
      },
    ]),
  },
};

export default function Page() {
  const { pageId } = useParams();
  const [title, setTitle] = useState("");
  const [adfDocument, setAdfDocument] = useState<any>(null);

  useEffect(() => {
    const page = SAMPLE_PAGES[pageId || "getting-started"];
    if (page) {
      setTitle(page.title);
      setAdfDocument(page.adf);
    }
  }, [pageId]);

  if (!adfDocument) {
    return <div className="confluence-page-container">Loading...</div>;
  }

  return (
    <div className="confluence-page-container">
      <div className="confluence-page">
        <div className="confluence-page-header">
          <h1 className="confluence-page-title">{title}</h1>
          <div className="confluence-page-meta">
            <div className="confluence-page-author">
              <div className="confluence-avatar" style={{ width: "24px", height: "24px", fontSize: "10px" }}>
                AK
              </div>
              <span>By Adi Kishore</span>
            </div>
            <span>•</span>
            <span>5 min</span>
            <span>•</span>
            <span>See views</span>
            <span>•</span>
            <button
              style={{
                background: "none",
                border: "none",
                color: "var(--ds-text-subtle)",
                fontSize: "14px",
                cursor: "pointer",
                marginLeft: "auto",
              }}
            >
              Add a reaction
            </button>
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            <span style={{ fontSize: "14px", color: "var(--ds-text-subtle)" }}>Published Jun 14</span>
            <button
              style={{
                background: "none",
                border: "none",
                color: "var(--ds-text)",
                fontSize: "14px",
                cursor: "pointer",
                marginLeft: "auto",
              }}
            >
              Edit
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                color: "var(--ds-text)",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Share
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                color: "var(--ds-text)",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              ...
            </button>
          </div>
        </div>
        <ADFRenderer document={adfDocument} />
      </div>
    </div>
  );
}
