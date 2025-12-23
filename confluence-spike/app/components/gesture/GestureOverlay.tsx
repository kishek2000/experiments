import { useEffect, useRef, useCallback, type JSX } from "react";
import { useGesture } from "./GestureProvider";

export function GestureOverlay() {
  const {
    isGestureMode,
    strokes,
    currentStroke,
    lastResult,
    gestureBounds,
    startStroke,
    addPoint,
    endStroke,
    executeGesture,
    cancelGesture,
  } = useGesture();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse/touch handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isGestureMode) return;
      startStroke({ x: e.clientX, y: e.clientY });
    },
    [isGestureMode, startStroke]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isGestureMode) return;
      addPoint({ x: e.clientX, y: e.clientY });
    },
    [isGestureMode, addPoint]
  );

  const handleMouseUp = useCallback(() => {
    if (!isGestureMode) return;
    endStroke();
  }, [isGestureMode, endStroke]);

  // Draw everything on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isGestureMode) return;

    // Draw semi-transparent overlay
    ctx.fillStyle = "rgba(222, 235, 255, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw gesture bounds if we have them
    if (
      gestureBounds &&
      gestureBounds.width > 10 &&
      gestureBounds.height > 10
    ) {
      ctx.strokeStyle = "rgba(0, 82, 204, 0.3)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        gestureBounds.minX - 10,
        gestureBounds.minY - 10,
        gestureBounds.width + 20,
        gestureBounds.height + 20
      );
      ctx.setLineDash([]);
    }

    // Draw all completed strokes
    strokes.forEach((stroke, strokeIndex) => {
      if (stroke.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }

      // Gradient color based on stroke index
      const hue = (strokeIndex * 30) % 360;
      ctx.strokeStyle = `hsla(${hue}, 70%, 50%, 0.8)`;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Glow
      ctx.strokeStyle = `hsla(${hue}, 70%, 50%, 0.3)`;
      ctx.lineWidth = 12;
      ctx.stroke();
    });

    // Draw current stroke
    if (currentStroke.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      for (let i = 1; i < currentStroke.length; i++) {
        ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
      }

      ctx.strokeStyle = "rgba(0, 82, 204, 0.9)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Glow
      ctx.strokeStyle = "rgba(0, 82, 204, 0.3)";
      ctx.lineWidth = 12;
      ctx.stroke();
    }

    // Draw start/end points
    const allStrokes = [...strokes, currentStroke].filter((s) => s.length > 0);
    allStrokes.forEach((stroke) => {
      if (stroke.length > 0) {
        // Start point
        ctx.fillStyle = "rgba(0, 82, 204, 0.8)";
        ctx.beginPath();
        ctx.arc(stroke[0].x, stroke[0].y, 6, 0, Math.PI * 2);
        ctx.fill();

        // End point
        if (stroke.length > 1) {
          const end = stroke[stroke.length - 1];
          ctx.fillStyle = "rgba(101, 84, 192, 0.8)";
          ctx.beginPath();
          ctx.arc(end.x, end.y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
  }, [isGestureMode, strokes, currentStroke, gestureBounds]);

  // Icon mapping - maps action names to icons
  const getIcon = (action?: string) => {
    const icons: Record<string, JSX.Element> = {
      swap: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" />
        </svg>
      ),
      delete: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 6H21M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" />
        </svg>
      ),
      add: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5V19M5 12H19" />
        </svg>
      ),
      select: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
      complete: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 6L9 17L4 12" />
        </svg>
      ),
      strikethrough: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 12H20M7 5H17M8 19H16" />
        </svg>
      ),
      split: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 3V21M3 12L9 6M3 12L9 18M21 12L15 6M21 12L15 18" />
        </svg>
      ),
      "move-up": (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 19V5M5 12L12 5L19 12" />
        </svg>
      ),
      "move-down": (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5V19M5 12L12 19L19 12" />
        </svg>
      ),
      indent: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 6H21M3 12H21M3 18H21M9 12L3 17V7L9 12" />
        </svg>
      ),
      outdent: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 6H21M11 12H21M3 18H21M9 7L3 12L9 17" />
        </svg>
      ),
      "create-block": (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      ),
      rewrite: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 4V2M15 16V14M8 9H10M20 9H22M17.8 11.8L19 13M17.8 6.2L19 5M12.2 11.8L11 13M12.2 6.2L11 5M15 9L3 21" />
        </svg>
      ),
      star: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ),
      code: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M16 18L22 12L16 6M8 6L2 12L8 18" />
        </svg>
      ),
      help: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9C9.3 8.4 9.7 7.9 10.3 7.6C10.9 7.2 11.6 7.1 12.3 7.2C13 7.4 13.6 7.7 14 8.3C14.4 8.8 14.5 9.5 14.3 10.1C14.1 10.8 13.6 11.3 12.9 11.6C12.5 11.8 12.2 12.1 12.1 12.5C12 12.9 12 13.2 12 13.5M12 17H12.01" />
        </svg>
      ),
    };
    return icons[action || ""] || icons.select;
  };

  if (!isGestureMode) return null;

  return (
    <>
      {/* Full screen canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[9999] cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Status bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-4">
        {/* Recognition result */}
        {lastResult && (
          <div className="bg-white rounded-xl shadow-xl px-5 py-3 flex items-center gap-3 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
              {getIcon(lastResult.action)}
            </div>
            <div>
              <div className="font-semibold text-gray-800">
                {lastResult.description}
              </div>
              <div className="text-xs text-gray-500">
                {Math.round(lastResult.confidence * 100)}% confidence
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-900 text-white rounded-xl shadow-xl px-5 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium">Gesture Mode</span>
          </div>
          <div className="h-4 w-px bg-gray-700" />
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-300">
                Draw
              </kbd>{" "}
              gesture
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-300">
                Enter
              </kbd>{" "}
              execute
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-300">
                G
              </kbd>{" "}
              or{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-300">
                Esc
              </kbd>{" "}
              cancel
            </span>
          </div>
        </div>

        {/* Execute button */}
        {strokes.length > 0 && (
          <button
            onClick={executeGesture}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xl px-5 py-3 font-medium transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12H19M12 5L19 12L12 19" />
            </svg>
            Execute
          </button>
        )}

        {/* Cancel button */}
        <button
          onClick={cancelGesture}
          className="bg-gray-700 hover:bg-gray-600 text-white rounded-xl shadow-xl px-4 py-3 transition-colors"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6L18 18" />
          </svg>
        </button>
      </div>

      {/* Stroke counter */}
      {strokes.length > 0 && (
        <div className="fixed top-20 right-6 z-[10000] bg-white rounded-lg shadow-lg px-3 py-2 text-sm">
          <span className="text-gray-500">Strokes:</span>{" "}
          <span className="font-semibold text-blue-600">{strokes.length}</span>
        </div>
      )}
    </>
  );
}
