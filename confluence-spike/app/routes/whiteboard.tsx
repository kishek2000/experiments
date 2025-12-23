import { useRef, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";

interface Shape {
  id: string;
  type: "rectangle" | "circle" | "sticky" | "text" | "line";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  color?: string;
  endX?: number;
  endY?: number;
}

export default function Whiteboard() {
  const { boardId } = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<"select" | "pen" | "sticky" | "text" | "shape">("select");
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penPath, setPenPath] = useState<{ x: number; y: number }[]>([]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear canvas with dark background
    ctx.fillStyle = "#22272b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw dot grid
    ctx.fillStyle = "#38414a";
    const dotSpacing = 20 * zoom;
    const startX = (offset.x % dotSpacing) - dotSpacing;
    const startY = (offset.y % dotSpacing) - dotSpacing;

    for (let x = startX; x < canvas.width + dotSpacing; x += dotSpacing) {
      for (let y = startY; y < canvas.height + dotSpacing; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw shapes
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    shapes.forEach((shape) => {
      const isSelected = selectedShapes.includes(shape.id);

      switch (shape.type) {
        case "sticky":
          // Shadow
          ctx.shadowColor = "rgba(0,0,0,0.3)";
          ctx.shadowBlur = 8;
          ctx.shadowOffsetY = 4;

          ctx.fillStyle = shape.color || "#FFEB3B";
          ctx.fillRect(shape.x, shape.y, shape.width || 200, shape.height || 150);

          ctx.shadowColor = "transparent";

          if (isSelected) {
            ctx.strokeStyle = "#0c66e4";
            ctx.lineWidth = 3;
            ctx.strokeRect(shape.x - 2, shape.y - 2, (shape.width || 200) + 4, (shape.height || 150) + 4);
          }

          // Text
          ctx.fillStyle = "#172b4d";
          ctx.font = "14px -apple-system, BlinkMacSystemFont, sans-serif";
          const lines = (shape.text || "").split("\n");
          lines.forEach((line, i) => {
            ctx.fillText(line, shape.x + 16, shape.y + 32 + i * 20);
          });
          break;

        case "rectangle":
          ctx.fillStyle = shape.color || "#0c66e4";
          ctx.globalAlpha = 0.3;
          ctx.fillRect(shape.x, shape.y, shape.width || 100, shape.height || 60);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = isSelected ? "#0c66e4" : shape.color || "#0c66e4";
          ctx.lineWidth = isSelected ? 3 : 2;
          ctx.strokeRect(shape.x, shape.y, shape.width || 100, shape.height || 60);
          break;

        case "circle":
          ctx.fillStyle = shape.color || "#8b5cf6";
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.arc(shape.x, shape.y, shape.radius || 50, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.strokeStyle = isSelected ? "#0c66e4" : shape.color || "#8b5cf6";
          ctx.lineWidth = isSelected ? 3 : 2;
          ctx.stroke();
          break;
      }
    });

    // Draw pen path
    if (penPath.length > 1) {
      ctx.strokeStyle = "#0c66e4";
      ctx.lineWidth = 3 / zoom;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(penPath[0].x, penPath[0].y);
      penPath.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }

    ctx.restore();
  }, [shapes, offset, zoom, penPath, selectedShapes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      draw();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === "pen") {
      setIsDrawing(true);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - offset.x) / zoom;
        const y = (e.clientY - rect.top - offset.y) / zoom;
        setPenPath([{ x, y }]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing && tool === "pen") {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - offset.x) / zoom;
        const y = (e.clientY - rect.top - offset.y) / zoom;
        setPenPath((prev) => [...prev, { x, y }]);
      }
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && tool === "pen") {
      setIsDrawing(false);
      // Keep the pen path visible
    }
  };

  const boardTitle = boardId === "main" ? "Untitled whiteboard 2025-09-23" : `Untitled whiteboard 2025-11-17`;

  return (
    <div className="confluence-content" style={{ display: "flex", flexDirection: "column" }}>
      {/* Whiteboard Header */}
      <div style={{
        padding: "16px 32px",
        borderBottom: "1px solid var(--ds-border)",
        background: "var(--ds-background-neutral)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div>
          <h1 style={{
            fontSize: "20px",
            fontWeight: 500,
            color: "var(--ds-text-inverse)",
            margin: 0
          }}>{boardTitle}</h1>
          <div style={{
            fontSize: "14px",
            color: "var(--ds-text-subtle)",
            marginTop: "4px"
          }}>
            Edited Sept 23
            <span style={{ margin: "0 8px" }}>•</span>
            <div className="confluence-avatar" style={{
              display: "inline-flex",
              width: "20px",
              height: "20px",
              fontSize: "9px",
              verticalAlign: "middle",
              marginLeft: "4px"
            }}>AK</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button style={{
            background: "none",
            border: "none",
            color: "var(--ds-text)",
            fontSize: "14px",
            cursor: "pointer",
            padding: "6px 12px"
          }}>Share</button>
          <button style={{
            background: "none",
            border: "none",
            color: "var(--ds-text)",
            fontSize: "14px",
            cursor: "pointer",
            padding: "6px 12px"
          }}>...</button>
        </div>
      </div>

      {/* Whiteboard Canvas */}
      <div ref={containerRef} className="confluence-whiteboard" style={{ flex: 1, position: "relative" }}>
        <canvas
          ref={canvasRef}
          className="confluence-whiteboard-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {/* Bottom Toolbar */}
        <div className="confluence-whiteboard-toolbar">
          <button
            className={`confluence-whiteboard-tool ${tool === "select" ? "active" : ""}`}
            onClick={() => setTool("select")}
            title="Select"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 2l12 11.5-5.5 1.2-3.4 5.3-2-4.5L2 14z" />
            </svg>
          </button>

          <button
            className={`confluence-whiteboard-tool ${tool === "pen" ? "active" : ""}`}
            onClick={() => setTool("pen")}
            title="Pen"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            </svg>
          </button>

          <button
            className={`confluence-whiteboard-tool ${tool === "sticky" ? "active" : ""}`}
            onClick={() => {
              setTool("sticky");
              const newSticky: Shape = {
                id: Date.now().toString(),
                type: "sticky",
                x: 200,
                y: 200,
                width: 200,
                height: 150,
                text: "New note",
                color: "#FFEB3B",
              };
              setShapes((prev) => [...prev, newSticky]);
            }}
            title="Sticky Note"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFEB3B" stroke="#FBC02D" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </button>

          <button
            className={`confluence-whiteboard-tool ${tool === "text" ? "active" : ""}`}
            onClick={() => setTool("text")}
            title="Text"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h12" />
            </svg>
          </button>

          <button
            className={`confluence-whiteboard-tool ${tool === "shape" ? "active" : ""}`}
            onClick={() => {
              setTool("shape");
              const newRect: Shape = {
                id: Date.now().toString(),
                type: "rectangle",
                x: 300,
                y: 300,
                width: 150,
                height: 80,
                color: "#0c66e4",
              };
              setShapes((prev) => [...prev, newRect]);
            }}
            title="Shape"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </button>

          <div style={{ width: "1px", height: "24px", background: "var(--ds-border)", margin: "0 4px" }} />

          <button className="confluence-whiteboard-tool" title="More">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>

        {/* Right Sidebar */}
        <div style={{
          position: "absolute",
          right: "16px",
          top: "16px",
          bottom: "16px",
          width: "48px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          alignItems: "center",
          padding: "8px 0"
        }}>
          <button className="confluence-whiteboard-tool" title="Select">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 2l12 11.5-5.5 1.2-3.4 5.3-2-4.5L2 14z" />
            </svg>
          </button>
          <button className="confluence-whiteboard-tool" title="Document">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
            </svg>
          </button>
          <button className="confluence-whiteboard-tool" title="Info">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </button>
          <button className="confluence-whiteboard-tool" title="Like">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
            </svg>
          </button>
          <button className="confluence-whiteboard-tool" title="People">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </button>
          <button className="confluence-whiteboard-tool" title="History">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
          </button>
          <button className="confluence-whiteboard-tool" title="Settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
            </svg>
          </button>
          <button className="confluence-whiteboard-tool" title="Zoom">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {/* Zoom Controls */}
        <div style={{
          position: "absolute",
          right: "16px",
          bottom: "80px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          alignItems: "center",
          background: "var(--ds-background-neutral)",
          border: "1px solid var(--ds-border)",
          borderRadius: "6px",
          padding: "4px"
        }}>
          <button
            onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
            style={{
              width: "32px",
              height: "24px",
              background: "none",
              border: "none",
              color: "var(--ds-text)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <div style={{
            fontSize: "12px",
            color: "var(--ds-text)",
            padding: "4px 8px"
          }}>
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
            style={{
              width: "32px",
              height: "24px",
              background: "none",
              border: "none",
              color: "var(--ds-text)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
