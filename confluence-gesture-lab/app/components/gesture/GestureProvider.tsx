import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import {
  simpleRecognizer,
  getBounds,
  type Point,
  type RecognitionResult,
  type GestureBounds,
} from "~/lib/gestures/simple-recognizer";

// Custom event for gesture actions - allows other components to respond
export interface GestureActionEvent {
  action: string;
  gestureName: string;
  bounds: GestureBounds;
  points: Point[];
  confidence: number;
}

declare global {
  interface WindowEventMap {
    "gesture-action": CustomEvent<GestureActionEvent>;
  }
}

// Result type (simplified)
interface GestureResult {
  name: string;
  action: string;
  confidence: number;
  description: string;
}

interface GestureContextValue {
  isGestureMode: boolean;
  strokes: Point[][];
  currentStroke: Point[];
  lastResult: GestureResult | null;
  gestureBounds: GestureBounds | null;
  toggleGestureMode: () => void;
  startStroke: (point: Point) => void;
  addPoint: (point: Point) => void;
  endStroke: () => void;
  executeGesture: () => void;
  cancelGesture: () => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const GestureContext = createContext<GestureContextValue | null>(null);

export function useGesture() {
  const context = useContext(GestureContext);
  if (!context) {
    throw new Error("useGesture must be used within a GestureProvider");
  }
  return context;
}

interface GestureProviderProps {
  children: ReactNode;
}

// History for undo/redo
interface HistoryEntry {
  type: string;
  element?: HTMLElement;
  previousHTML?: string;
  previousParent?: HTMLElement;
  previousNextSibling?: HTMLElement | null;
}

const history: HistoryEntry[] = [];
const redoStack: HistoryEntry[] = [];

export function GestureProvider({ children }: GestureProviderProps) {
  const [isGestureMode, setIsGestureMode] = useState(false);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastResult, setLastResult] = useState<GestureResult | null>(null);
  const [gestureBounds, setGestureBounds] = useState<GestureBounds | null>(
    null
  );
  const strokeIdRef = useRef(0);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      const toast = document.createElement("div");
      toast.className = `toast toast-${type}`;
      toast.innerHTML = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    },
    []
  );

  const toggleGestureMode = useCallback(() => {
    setIsGestureMode((prev) => {
      if (prev) {
        // Exiting gesture mode - clear everything
        setStrokes([]);
        setCurrentStroke([]);
        setLastResult(null);
        setGestureBounds(null);
        strokeIdRef.current = 0;
      }
      return !prev;
    });
  }, []);

  const startStroke = useCallback((point: Point) => {
    setIsDrawing(true);
    setCurrentStroke([{ ...point, strokeId: strokeIdRef.current }]);
  }, []);

  const addPoint = useCallback(
    (point: Point) => {
      if (!isDrawing) return;
      setCurrentStroke((prev) => [
        ...prev,
        { ...point, strokeId: strokeIdRef.current },
      ]);
    },
    [isDrawing]
  );

  const endStroke = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentStroke.length > 2) {
      setStrokes((prev) => [...prev, currentStroke]);
      strokeIdRef.current += 1;

      // Update bounds and try to recognize
      const allPoints = [...strokes.flat(), ...currentStroke];
      if (allPoints.length > 5) {
        const bounds = getBounds(allPoints);
        setGestureBounds(bounds);

        // Use simple geometric recognizer
        const result = simpleRecognizer.recognize(allPoints);
        setLastResult(result);
      }
    }
    setCurrentStroke([]);
  }, [isDrawing, currentStroke, strokes]);

  // Find element at position
  const findElementAtPosition = useCallback(
    (x: number, y: number): HTMLElement | null => {
      const elements = document.elementsFromPoint(x, y);
      for (const el of elements) {
        if (el.closest(".cf-editor") || el.closest(".cf-whiteboard")) {
          // Find the nearest meaningful block
          const block = (el as HTMLElement).closest(
            "p, h1, h2, h3, li, blockquote, pre, div[data-block]"
          );
          if (block) return block as HTMLElement;
        }
      }
      return null;
    },
    []
  );

  // Find elements within bounds
  const findElementsInBounds = useCallback(
    (bounds: GestureBounds): HTMLElement[] => {
      const elements: HTMLElement[] = [];
      const editor = document.querySelector(".cf-editor");
      if (!editor) return elements;

      const blocks = editor.querySelectorAll(
        "p, h1, h2, h3, li, blockquote, pre"
      );
      blocks.forEach((block) => {
        const rect = block.getBoundingClientRect();
        // Check if block overlaps with gesture bounds
        if (
          rect.left < bounds.maxX &&
          rect.right > bounds.minX &&
          rect.top < bounds.maxY &&
          rect.bottom > bounds.minY
        ) {
          elements.push(block as HTMLElement);
        }
      });
      return elements;
    },
    []
  );

  // Execute actions
  const executeAction = useCallback(
    (
      action: string,
      bounds: GestureBounds,
      gestureName: string = "",
      points: Point[] = [],
      confidence: number = 0
    ) => {
      // Dispatch custom event so other components (like Whiteboard) can respond
      const gestureEvent = new CustomEvent("gesture-action", {
        detail: { action, gestureName, bounds, points, confidence },
      });
      window.dispatchEvent(gestureEvent);

      // Check if we're on a whiteboard - if so, let the whiteboard handle it
      const whiteboard = document.querySelector(".cf-whiteboard");
      if (whiteboard) {
        // Don't do document-based actions on whiteboard
        return;
      }

      const editor = document.querySelector(".cf-editor") as HTMLElement;
      if (!editor) return;

      const elementsInBounds = findElementsInBounds(bounds);
      const startElement = findElementAtPosition(bounds.minX, bounds.centerY);
      const endElement = findElementAtPosition(bounds.maxX, bounds.centerY);

      switch (action) {
        case "swap": {
          // Find the two blocks at start and end of the arc
          const topElement = findElementAtPosition(bounds.centerX, bounds.minY);
          const bottomElement = findElementAtPosition(
            bounds.centerX,
            bounds.maxY
          );

          if (topElement && bottomElement && topElement !== bottomElement) {
            // Save for undo
            history.push({
              type: "swap",
              element: topElement,
              previousNextSibling: topElement.nextElementSibling as HTMLElement,
            });

            // Swap the elements
            const topParent = topElement.parentNode;
            const bottomParent = bottomElement.parentNode;
            const topNext = topElement.nextElementSibling;

            if (topParent && bottomParent) {
              bottomParent.insertBefore(
                topElement,
                bottomElement.nextElementSibling
              );
              topParent.insertBefore(bottomElement, topNext);
              showToast("✓ Swapped blocks", "success");
            }
          } else {
            showToast("Draw arc between two blocks to swap", "info");
          }
          break;
        }

        case "delete": {
          if (elementsInBounds.length > 0) {
            elementsInBounds.forEach((el) => {
              history.push({
                type: "delete",
                element: el,
                previousParent: el.parentElement as HTMLElement,
                previousNextSibling: el.nextElementSibling as HTMLElement,
                previousHTML: el.outerHTML,
              });
              el.style.transition = "all 0.2s ease";
              el.style.opacity = "0";
              el.style.transform = "translateX(-20px)";
              setTimeout(() => el.remove(), 200);
            });
            showToast(
              `✓ Deleted ${elementsInBounds.length} block(s)`,
              "success"
            );
          }
          break;
        }

        case "duplicate": {
          if (elementsInBounds.length > 0) {
            elementsInBounds.forEach((el) => {
              const clone = el.cloneNode(true) as HTMLElement;
              clone.style.animation = "fadeIn 0.3s ease";
              el.parentNode?.insertBefore(clone, el.nextSibling);
            });
            showToast(
              `✓ Duplicated ${elementsInBounds.length} block(s)`,
              "success"
            );
          }
          break;
        }

        case "move-up": {
          if (elementsInBounds.length > 0) {
            const el = elementsInBounds[0];
            const prev = el.previousElementSibling;
            if (prev) {
              history.push({
                type: "move",
                element: el,
                previousNextSibling: el.nextElementSibling as HTMLElement,
              });
              el.parentNode?.insertBefore(el, prev);
              showToast("✓ Moved up", "success");
            }
          }
          break;
        }

        case "move-down": {
          if (elementsInBounds.length > 0) {
            const el = elementsInBounds[0];
            const next = el.nextElementSibling;
            if (next) {
              history.push({
                type: "move",
                element: el,
                previousNextSibling: el.nextElementSibling as HTMLElement,
              });
              el.parentNode?.insertBefore(el, next.nextSibling);
              showToast("✓ Moved down", "success");
            }
          }
          break;
        }

        case "indent": {
          if (elementsInBounds.length > 0) {
            elementsInBounds.forEach((el) => {
              const currentMargin =
                parseInt(getComputedStyle(el).marginLeft) || 0;
              el.style.marginLeft = `${currentMargin + 24}px`;
            });
            showToast("✓ Indented", "success");
          }
          break;
        }

        case "outdent": {
          if (elementsInBounds.length > 0) {
            elementsInBounds.forEach((el) => {
              const currentMargin =
                parseInt(getComputedStyle(el).marginLeft) || 0;
              el.style.marginLeft = `${Math.max(0, currentMargin - 24)}px`;
            });
            showToast("✓ Outdented", "success");
          }
          break;
        }

        case "highlight": {
          if (elementsInBounds.length > 0) {
            elementsInBounds.forEach((el) => {
              if (el.style.backgroundColor === "rgb(255, 251, 204)") {
                el.style.backgroundColor = "";
              } else {
                el.style.backgroundColor = "#FFFBCC";
              }
            });
            showToast("✓ Toggled highlight", "success");
          }
          break;
        }

        case "strikethrough": {
          if (elementsInBounds.length > 0) {
            elementsInBounds.forEach((el) => {
              if (el.style.textDecoration === "line-through") {
                el.style.textDecoration = "";
                el.style.opacity = "1";
              } else {
                el.style.textDecoration = "line-through";
                el.style.opacity = "0.5";
              }
            });
            showToast("✓ Toggled strikethrough", "success");
          }
          break;
        }

        case "complete": {
          if (elementsInBounds.length > 0) {
            elementsInBounds.forEach((el) => {
              if (!el.innerHTML.startsWith("✓ ")) {
                el.innerHTML = "✓ " + el.innerHTML;
                el.style.color = "#36B37E";
              }
            });
            showToast("✓ Marked complete", "success");
          }
          break;
        }

        case "add": {
          const newBlock = document.createElement("p");
          newBlock.textContent = "New block - start typing...";
          newBlock.style.animation = "fadeIn 0.3s ease";
          newBlock.contentEditable = "true";

          if (elementsInBounds.length > 0) {
            elementsInBounds[0].parentNode?.insertBefore(
              newBlock,
              elementsInBounds[0].nextSibling
            );
          } else {
            editor.appendChild(newBlock);
          }
          newBlock.focus();
          showToast("✓ Added new block", "success");
          break;
        }

        case "create-block": {
          const callout = document.createElement("blockquote");
          callout.innerHTML = "<p>New callout block...</p>";
          callout.style.animation = "fadeIn 0.3s ease";

          if (elementsInBounds.length > 0) {
            // Wrap selected content in callout
            const wrapper = document.createElement("blockquote");
            elementsInBounds.forEach((el) => {
              wrapper.appendChild(el.cloneNode(true));
              el.remove();
            });
            editor.appendChild(wrapper);
          } else {
            editor.appendChild(callout);
          }
          showToast("✓ Created callout block", "success");
          break;
        }

        case "code-block": {
          const pre = document.createElement("pre");
          const code = document.createElement("code");

          if (elementsInBounds.length > 0) {
            code.textContent = elementsInBounds
              .map((el) => el.textContent)
              .join("\n");
            elementsInBounds.forEach((el) => el.remove());
          } else {
            code.textContent = "// Your code here";
          }
          pre.appendChild(code);
          pre.style.animation = "fadeIn 0.3s ease";
          editor.appendChild(pre);
          showToast("✓ Created code block", "success");
          break;
        }

        case "warning": {
          if (elementsInBounds.length > 0) {
            elementsInBounds.forEach((el) => {
              if (!el.innerHTML.startsWith("⚠️ ")) {
                el.innerHTML = "⚠️ " + el.innerHTML;
                el.style.backgroundColor = "#FFF8E6";
                el.style.padding = "8px 12px";
                el.style.borderLeft = "3px solid #FFAB00";
              }
            });
            showToast("✓ Added warning", "success");
          }
          break;
        }

        case "favorite": {
          if (elementsInBounds.length > 0) {
            elementsInBounds.forEach((el) => {
              if (!el.innerHTML.startsWith("⭐ ")) {
                el.innerHTML = "⭐ " + el.innerHTML;
              }
            });
            showToast("✓ Marked as favorite", "success");
          }
          break;
        }

        case "toggle-bullet": {
          if (elementsInBounds.length > 0) {
            const el = elementsInBounds[0];
            if (el.tagName === "LI") {
              // Convert to paragraph
              const p = document.createElement("p");
              p.innerHTML = el.innerHTML;
              el.replaceWith(p);
            } else {
              // Convert to list item
              const ul = document.createElement("ul");
              const li = document.createElement("li");
              li.innerHTML = el.innerHTML;
              ul.appendChild(li);
              el.replaceWith(ul);
            }
            showToast("✓ Toggled bullet", "success");
          }
          break;
        }

        case "merge": {
          if (elementsInBounds.length >= 2) {
            const first = elementsInBounds[0];
            const rest = elementsInBounds.slice(1);
            rest.forEach((el) => {
              first.innerHTML += " " + el.innerHTML;
              el.remove();
            });
            showToast(`✓ Merged ${elementsInBounds.length} blocks`, "success");
          }
          break;
        }

        case "split": {
          if (elementsInBounds.length > 0) {
            const el = elementsInBounds[0];
            const text = el.textContent || "";
            const midpoint = Math.floor(text.length / 2);
            const firstHalf = text.slice(0, midpoint);
            const secondHalf = text.slice(midpoint);

            el.textContent = firstHalf;
            const newEl = document.createElement(el.tagName);
            newEl.textContent = secondHalf;
            el.parentNode?.insertBefore(newEl, el.nextSibling);
            showToast("✓ Split block", "success");
          }
          break;
        }

        case "undo": {
          const entry = history.pop();
          if (entry) {
            if (
              entry.type === "delete" &&
              entry.previousParent &&
              entry.previousHTML
            ) {
              const temp = document.createElement("div");
              temp.innerHTML = entry.previousHTML;
              const restored = temp.firstChild as HTMLElement;
              entry.previousParent.insertBefore(
                restored,
                entry.previousNextSibling || null
              );
            }
            showToast("✓ Undone", "success");
          } else {
            showToast("Nothing to undo", "info");
          }
          break;
        }

        case "redo": {
          showToast("Redo not yet implemented", "info");
          break;
        }

        case "select": {
          if (elementsInBounds.length > 0) {
            elementsInBounds.forEach((el) => {
              el.style.outline = "2px solid #0052CC";
              el.style.outlineOffset = "2px";
            });
            showToast(
              `✓ Selected ${elementsInBounds.length} block(s)`,
              "success"
            );
          }
          break;
        }

        case "rewrite":
        case "continue":
        case "expand":
        case "summarize":
        case "ask-ai": {
          showToast(
            `🤖 AI "${action}" would process: "${elementsInBounds.map((e) => e.textContent?.slice(0, 30)).join(", ")}..."`,
            "info"
          );
          break;
        }

        case "link": {
          if (startElement && endElement && startElement !== endElement) {
            showToast(
              `🔗 Would link: "${startElement.textContent?.slice(0, 20)}..." → "${endElement.textContent?.slice(0, 20)}..."`,
              "info"
            );
          }
          break;
        }

        default:
          showToast(`Action "${action}" recognized`, "info");
      }
    },
    [findElementsInBounds, findElementAtPosition, showToast]
  );

  const executeGesture = useCallback(() => {
    const allPoints = [...strokes.flat(), ...currentStroke];

    if (allPoints.length > 5) {
      const bounds = getBounds(allPoints);

      // Use simple geometric recognizer
      const result = simpleRecognizer.recognize(allPoints);

      if (result) {
        executeAction(
          result.action,
          bounds,
          result.name,
          allPoints,
          result.confidence
        );
      } else {
        showToast("Gesture not recognized - try again", "error");
      }
    }

    // Reset
    setIsGestureMode(false);
    setStrokes([]);
    setCurrentStroke([]);
    setLastResult(null);
    setGestureBounds(null);
    strokeIdRef.current = 0;
  }, [strokes, currentStroke, executeAction, showToast]);

  const cancelGesture = useCallback(() => {
    setIsGestureMode(false);
    setStrokes([]);
    setCurrentStroke([]);
    setLastResult(null);
    setGestureBounds(null);
    strokeIdRef.current = 0;
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "g" || e.key === "G") {
        if (!e.repeat) {
          toggleGestureMode();
        }
      }
      if (e.key === "Escape" && isGestureMode) {
        cancelGesture();
      }
      if (e.key === "Enter" && isGestureMode && strokes.length > 0) {
        executeGesture();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isGestureMode,
    strokes,
    toggleGestureMode,
    cancelGesture,
    executeGesture,
  ]);

  const value: GestureContextValue = {
    isGestureMode,
    strokes,
    currentStroke,
    lastResult,
    gestureBounds,
    toggleGestureMode,
    startStroke,
    addPoint,
    endStroke,
    executeGesture,
    cancelGesture,
    showToast,
  };

  return (
    <GestureContext.Provider value={value}>{children}</GestureContext.Provider>
  );
}
