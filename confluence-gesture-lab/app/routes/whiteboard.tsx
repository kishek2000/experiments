import { useRef, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import { useGesture } from "~/components/gesture/GestureProvider";
import type { GestureActionEvent } from "~/components/gesture/GestureProvider";

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
  const [tool, setTool] = useState<
    "select" | "rectangle" | "circle" | "sticky" | "text" | "line" | "pen"
  >("select");
  const [shapes, setShapes] = useState<Shape[]>([
    {
      id: "1",
      type: "sticky",
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      text: "Welcome to the\nWhiteboard!",
      color: "#FFEB3B",
    },
    {
      id: "2",
      type: "sticky",
      x: 350,
      y: 150,
      width: 200,
      height: 150,
      text: "Draw gestures\nwith G key!",
      color: "#4CAF50",
    },
    {
      id: "3",
      type: "rectangle",
      x: 150,
      y: 350,
      width: 180,
      height: 100,
      color: "#2196F3",
    },
    { id: "4", type: "circle", x: 450, y: 400, radius: 50, color: "#9C27B0" },
    {
      id: "5",
      type: "line",
      x: 330,
      y: 250,
      endX: 380,
      endY: 350,
      color: "#607D8B",
    },
  ]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penPath, setPenPath] = useState<{ x: number; y: number }[]>([]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const { showToast } = useGesture();

  // Handle gesture actions for the whiteboard
  useEffect(() => {
    const handleGestureAction = (e: CustomEvent<GestureActionEvent>) => {
      const { action, bounds, points, gestureName } = e.detail;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      // Convert screen coordinates to canvas coordinates
      const canvasX = (bounds.centerX - rect.left - offset.x) / zoom;
      const canvasY = (bounds.centerY - rect.top - offset.y) / zoom;

      switch (action) {
        case "select": {
          // Circle gesture - select shapes within bounds
          const gestureMinX = (bounds.minX - rect.left - offset.x) / zoom;
          const gestureMaxX = (bounds.maxX - rect.left - offset.x) / zoom;
          const gestureMinY = (bounds.minY - rect.top - offset.y) / zoom;
          const gestureMaxY = (bounds.maxY - rect.top - offset.y) / zoom;

          const selected = shapes.filter((shape) => {
            const shapeX = shape.x;
            const shapeY = shape.y;
            const shapeRight = shapeX + (shape.width || shape.radius || 50);
            const shapeBottom = shapeY + (shape.height || shape.radius || 50);

            return (
              shapeX < gestureMaxX &&
              shapeRight > gestureMinX &&
              shapeY < gestureMaxY &&
              shapeBottom > gestureMinY
            );
          });

          if (selected.length > 0) {
            setSelectedShapes(selected.map((s) => s.id));
            showToast(`Selected ${selected.length} shape(s)`, "success");
          }
          break;
        }

        case "delete": {
          // X gesture - delete shapes at location or selected shapes
          if (selectedShapes.length > 0) {
            setShapes((prev) =>
              prev.filter((s) => !selectedShapes.includes(s.id))
            );
            showToast(`Deleted ${selectedShapes.length} shape(s)`, "success");
            setSelectedShapes([]);
          } else {
            // Find shape at gesture location
            const toDelete = shapes.find((shape) => {
              const dx = shape.x - canvasX;
              const dy = shape.y - canvasY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              return dist < (shape.radius || 100);
            });
            if (toDelete) {
              setShapes((prev) => prev.filter((s) => s.id !== toDelete.id));
              showToast("Deleted shape", "success");
            }
          }
          break;
        }

        case "add": {
          // Plus gesture - add sticky note at location
          const newSticky: Shape = {
            id: Date.now().toString(),
            type: "sticky",
            x: canvasX - 100,
            y: canvasY - 75,
            width: 200,
            height: 150,
            text: "New note",
            color: "#FFEB3B",
          };
          setShapes((prev) => [...prev, newSticky]);
          showToast("Added sticky note", "success");
          break;
        }

        case "create-block": {
          // Rectangle gesture - create rectangle shape from gesture bounds
          const newRect: Shape = {
            id: Date.now().toString(),
            type: "rectangle",
            x: (bounds.minX - rect.left - offset.x) / zoom,
            y: (bounds.minY - rect.top - offset.y) / zoom,
            width: bounds.width / zoom,
            height: bounds.height / zoom,
            color: "#2196F3",
          };
          setShapes((prev) => [...prev, newRect]);
          showToast("Created rectangle", "success");
          break;
        }

        case "swap": {
          // Arc gesture - swap two selected shapes or shapes at arc endpoints
          if (selectedShapes.length === 2) {
            setShapes((prev) => {
              const updated = [...prev];
              const idx1 = updated.findIndex((s) => s.id === selectedShapes[0]);
              const idx2 = updated.findIndex((s) => s.id === selectedShapes[1]);
              if (idx1 !== -1 && idx2 !== -1) {
                const pos1 = { x: updated[idx1].x, y: updated[idx1].y };
                updated[idx1] = {
                  ...updated[idx1],
                  x: updated[idx2].x,
                  y: updated[idx2].y,
                };
                updated[idx2] = { ...updated[idx2], ...pos1 };
              }
              return updated;
            });
            showToast("Swapped shapes", "success");
            setSelectedShapes([]);
          }
          break;
        }

        case "complete": {
          // Checkmark - mark sticky as done (change color to green)
          const sticky = shapes.find(
            (s) =>
              s.type === "sticky" &&
              Math.abs(s.x - canvasX) < 150 &&
              Math.abs(s.y - canvasY) < 150
          );
          if (sticky) {
            setShapes((prev) =>
              prev.map((s) =>
                s.id === sticky.id
                  ? { ...s, color: "#4CAF50", text: "✓ " + (s.text || "") }
                  : s
              )
            );
            showToast("Marked complete!", "success");
          }
          break;
        }

        case "rewrite": {
          // Zigzag - AI action placeholder
          showToast("🤖 AI feature coming soon!", "info");
          break;
        }

        default:
          showToast(`Gesture: ${gestureName}`, "info");
      }
    };

    window.addEventListener(
      "gesture-action",
      handleGestureAction as EventListener
    );
    return () =>
      window.removeEventListener(
        "gesture-action",
        handleGestureAction as EventListener
      );
  }, [shapes, selectedShapes, offset, zoom, showToast]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.fillStyle = "#FAFBFC";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw dot grid
    ctx.fillStyle = "#C1C7D0";
    const dotSpacing = 20 * zoom;
    const startX = offset.x % dotSpacing;
    const startY = offset.y % dotSpacing;

    for (let x = startX; x < canvas.width; x += dotSpacing) {
      for (let y = startY; y < canvas.height; y += dotSpacing) {
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
        case "rectangle":
          ctx.fillStyle = shape.color || "#2196F3";
          ctx.globalAlpha = 0.8;
          ctx.fillRect(
            shape.x,
            shape.y,
            shape.width || 100,
            shape.height || 60
          );
          ctx.globalAlpha = 1;
          ctx.strokeStyle = isSelected ? "#0052CC" : shape.color || "#2196F3";
          ctx.lineWidth = isSelected ? 3 : 2;
          ctx.strokeRect(
            shape.x,
            shape.y,
            shape.width || 100,
            shape.height || 60
          );
          // Selection handles
          if (isSelected) {
            ctx.fillStyle = "#0052CC";
            const corners = [
              [shape.x, shape.y],
              [shape.x + (shape.width || 100), shape.y],
              [shape.x, shape.y + (shape.height || 60)],
              [shape.x + (shape.width || 100), shape.y + (shape.height || 60)],
            ];
            corners.forEach(([cx, cy]) => {
              ctx.beginPath();
              ctx.arc(cx, cy, 5, 0, Math.PI * 2);
              ctx.fill();
            });
          }
          break;

        case "circle":
          ctx.fillStyle = shape.color || "#9C27B0";
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(shape.x, shape.y, shape.radius || 50, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.strokeStyle = isSelected ? "#0052CC" : shape.color || "#9C27B0";
          ctx.lineWidth = isSelected ? 3 : 2;
          ctx.stroke();
          // Selection indicator
          if (isSelected) {
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = "#0052CC";
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, (shape.radius || 50) + 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
          }
          break;

        case "sticky":
          // Shadow
          ctx.shadowColor = "rgba(0,0,0,0.15)";
          ctx.shadowBlur = 8;
          ctx.shadowOffsetY = 4;

          ctx.fillStyle = shape.color || "#FFEB3B";
          ctx.fillRect(
            shape.x,
            shape.y,
            shape.width || 200,
            shape.height || 150
          );

          ctx.shadowColor = "transparent";

          // Selection border
          if (isSelected) {
            ctx.strokeStyle = "#0052CC";
            ctx.lineWidth = 3;
            ctx.strokeRect(
              shape.x - 2,
              shape.y - 2,
              (shape.width || 200) + 4,
              (shape.height || 150) + 4
            );
          }

          // Text
          ctx.fillStyle = "#172B4D";
          ctx.font = "14px -apple-system, BlinkMacSystemFont, sans-serif";
          const lines = (shape.text || "").split("\n");
          lines.forEach((line, i) => {
            ctx.fillText(line, shape.x + 16, shape.y + 32 + i * 20);
          });
          break;

        case "line":
          ctx.strokeStyle = shape.color || "#607D8B";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(shape.x, shape.y);
          ctx.lineTo(shape.endX || shape.x + 100, shape.endY || shape.y);
          ctx.stroke();

          // Arrow head
          const angle = Math.atan2(
            (shape.endY || shape.y) - shape.y,
            (shape.endX || shape.x + 100) - shape.x
          );
          const headLength = 10;
          ctx.beginPath();
          ctx.moveTo(shape.endX || shape.x + 100, shape.endY || shape.y);
          ctx.lineTo(
            (shape.endX || shape.x + 100) -
              headLength * Math.cos(angle - Math.PI / 6),
            (shape.endY || shape.y) - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(shape.endX || shape.x + 100, shape.endY || shape.y);
          ctx.lineTo(
            (shape.endX || shape.x + 100) -
              headLength * Math.cos(angle + Math.PI / 6),
            (shape.endY || shape.y) - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
          break;
      }
    });

    // Draw pen path
    if (penPath.length > 1) {
      ctx.strokeStyle = "#0052CC";
      ctx.lineWidth = 2;
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
    if (isDrawing) {
      setIsDrawing(false);
      // Keep the pen path visible
    }
  };

  const addShape = (type: Shape["type"]) => {
    const id = Date.now().toString();
    const baseX =
      (canvasRef.current?.width || 800) / 2 / zoom - offset.x / zoom;
    const baseY =
      (canvasRef.current?.height || 600) / 2 / zoom - offset.y / zoom;

    const newShape: Shape = {
      id,
      type,
      x: baseX + Math.random() * 100 - 50,
      y: baseY + Math.random() * 100 - 50,
      ...(type === "rectangle" && { width: 150, height: 80, color: "#2196F3" }),
      ...(type === "circle" && { radius: 50, color: "#9C27B0" }),
      ...(type === "sticky" && {
        width: 200,
        height: 150,
        text: "New note",
        color: "#FFEB3B",
      }),
      ...(type === "line" && {
        endX: baseX + 150,
        endY: baseY + 50,
        color: "#607D8B",
      }),
    };

    setShapes((prev) => [...prev, newShape]);
  };

  return (
    <div className="cf-whiteboard-container w-full">
      {/* Whiteboard Toolbar */}
      <div className="cf-whiteboard-toolbar">
        <div className="flex items-center gap-2 mr-4">
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
          <span className="text-sm text-gray-500 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        <div className="flex items-center gap-1 ml-4">
          <button
            className={`p-2 rounded ${tool === "select" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
            onClick={() => setTool("select")}
            title="Select"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 2l12 11.5-5.5 1.2-3.4 5.3-2-4.5L2 14z" />
            </svg>
          </button>

          <button
            className={`p-2 rounded ${tool === "pen" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
            onClick={() => setTool("pen")}
            title="Pen"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            </svg>
          </button>
        </div>

        <div className="h-6 w-px bg-gray-200 mx-2" />

        <div className="flex items-center gap-1">
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => addShape("sticky")}
            title="Sticky Note"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#FFEB3B"
              stroke="#FBC02D"
              strokeWidth="1"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </button>

          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => addShape("rectangle")}
            title="Rectangle"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </button>

          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => addShape("circle")}
            title="Circle"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
            </svg>
          </button>

          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => addShape("line")}
            title="Arrow"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12,5 19,12 12,19" />
            </svg>
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Whiteboard: <strong>{boardId || "main"}</strong>
          </span>
          <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm font-medium">
            ● Live
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="cf-whiteboard">
        <canvas
          ref={canvasRef}
          className="cf-whiteboard-canvas cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {/* Gesture hint */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-4 py-3 rounded-xl shadow-lg text-sm text-gray-700">
          <div className="flex items-center gap-2 mb-2 font-medium">
            <kbd className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-mono">
              G
            </kbd>
            <span>Gesture Mode</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>○ Circle → Select</span>
            <span>✕ X → Delete</span>
            <span>+ Plus → Add sticky</span>
            <span>□ Rectangle → Create shape</span>
            <span>✓ Check → Complete</span>
            <span>⌢ Arc → Swap</span>
          </div>
        </div>

        {/* Selection info */}
        {selectedShapes.length > 0 && (
          <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
            {selectedShapes.length} selected — draw ✕ to delete or ⌢ arc to swap
          </div>
        )}
      </div>
    </div>
  );
}
