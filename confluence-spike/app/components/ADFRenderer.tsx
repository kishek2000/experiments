import React from "react";

// ADF Node Types
interface ADFNode {
  type: string;
  content?: ADFNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, any> }>;
  attrs?: Record<string, any>;
}

interface ADFDocument {
  version: number;
  type: "doc";
  content: ADFNode[];
}

interface ADFRendererProps {
  document: ADFDocument | ADFNode;
}

// Render a single ADF node
function renderNode(node: ADFNode, key?: number): React.ReactNode {
  const { type, content, text, marks, attrs } = node;

  // Apply marks (formatting)
  let formattedText = text || "";
  let className = "";
  let style: React.CSSProperties = {};

  if (marks) {
    marks.forEach((mark) => {
      switch (mark.type) {
        case "strong":
          formattedText = <strong key={key}>{formattedText}</strong>;
          break;
        case "em":
          formattedText = <em key={key}>{formattedText}</em>;
          break;
        case "code":
          formattedText = <code key={key}>{formattedText}</code>;
          break;
        case "link":
          return (
            <a
              key={key}
              href={mark.attrs?.href}
              target={mark.attrs?.target}
              rel="noopener noreferrer"
            >
              {formattedText}
            </a>
          );
        case "textColor":
          style.color = mark.attrs?.color;
          break;
      }
    });
  }

  // Render based on node type
  switch (type) {
    case "doc":
      return (
        <div key={key} className="confluence-adf-content">
          {content?.map((child, i) => renderNode(child, i))}
        </div>
      );

    case "paragraph":
      return (
        <p key={key} style={style}>
          {text ? formattedText : content?.map((child, i) => renderNode(child, i))}
        </p>
      );

    case "heading":
      const level = attrs?.level || 1;
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag key={key} style={style}>
          {text ? formattedText : content?.map((child, i) => renderNode(child, i))}
        </HeadingTag>
      );

    case "bulletList":
      return (
        <ul key={key}>
          {content?.map((child, i) => renderNode(child, i))}
        </ul>
      );

    case "orderedList":
      return (
        <ol key={key}>
          {content?.map((child, i) => renderNode(child, i))}
        </ol>
      );

    case "listItem":
      return (
        <li key={key}>
          {content?.map((child, i) => renderNode(child, i))}
        </li>
      );

    case "blockquote":
      return (
        <blockquote key={key}>
          {content?.map((child, i) => renderNode(child, i))}
        </blockquote>
      );

    case "codeBlock":
      return (
        <pre key={key}>
          <code>{text || content?.map((child, i) => renderNode(child, i))}</code>
        </pre>
      );

    case "hardBreak":
      return <br key={key} />;

    case "text":
      return <React.Fragment key={key}>{formattedText}</React.Fragment>;

    case "table":
      return (
        <table key={key}>
          <tbody>
            {content?.map((child, i) => renderNode(child, i))}
          </tbody>
        </table>
      );

    case "tableRow":
      return (
        <tr key={key}>
          {content?.map((child, i) => renderNode(child, i))}
        </tr>
      );

    case "tableCell":
      return (
        <td key={key}>
          {content?.map((child, i) => renderNode(child, i))}
        </td>
      );

    case "tableHeader":
      return (
        <th key={key}>
          {content?.map((child, i) => renderNode(child, i))}
        </th>
      );

    case "panel":
      const panelType = attrs?.panelType || "info";
      return (
        <div key={key} className={`confluence-info-panel`} style={{ borderLeftColor: `var(--ds-${panelType})` }}>
          {content?.map((child, i) => renderNode(child, i))}
        </div>
      );

    case "mention":
      return (
        <span key={key} style={{ color: "var(--ds-blue)" }}>
          @{attrs?.id || attrs?.text || "user"}
        </span>
      );

    case "emoji":
      return <span key={key}>{attrs?.shortName || "😀"}</span>;

    default:
      // Fallback for unknown node types
      return (
        <div key={key}>
          {text || content?.map((child, i) => renderNode(child, i))}
        </div>
      );
  }
}

export function ADFRenderer({ document }: ADFRendererProps) {
  if (!document) return null;

  // Handle both full document and single node
  const rootNode = document.type === "doc" ? document : { type: "doc", content: [document] };

  return <>{rootNode.content?.map((node, i) => renderNode(node, i))}</>;
}

// Helper function to create ADF documents
export function createADFDocument(content: ADFNode[]): ADFDocument {
  return {
    version: 1,
    type: "doc",
    content,
  };
}

// Helper to create common ADF nodes
export const ADFHelpers = {
  paragraph: (text: string, marks?: ADFNode["marks"]): ADFNode => ({
    type: "paragraph",
    content: [{ type: "text", text, marks }],
  }),

  heading: (level: number, text: string): ADFNode => ({
    type: "heading",
    attrs: { level },
    content: [{ type: "text", text }],
  }),

  bulletList: (items: string[]): ADFNode => ({
    type: "bulletList",
    content: items.map((item) => ({
      type: "listItem",
      content: [{ type: "paragraph", content: [{ type: "text", text: item }] }],
    })),
  }),

  mention: (userId: string, text?: string): ADFNode => ({
    type: "mention",
    attrs: { id: userId, text: text || userId },
  }),
};

