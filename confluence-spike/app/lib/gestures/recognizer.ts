/**
 * $P Point-Cloud Recognizer with Semantic Gestures
 *
 * Gestures that visually represent their action:
 * - Curved arc between items = SWAP them
 * - Slash through content = DELETE it
 * - Plus sign = ADD new
 * - Bracket = INDENT/wrap
 * - Loop/pigtail = UNDO
 * - S-curve = CONNECT/link
 * - etc.
 */

export interface Point {
  x: number;
  y: number;
  strokeId?: number;
}

export interface GestureTemplate {
  name: string;
  points: Point[];
  action: string;
  description: string;
  icon?: string;
}

export interface RecognitionResult {
  name: string;
  score: number;
  action: string;
  description: string;
  icon?: string;
}

export interface GestureBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

// Constants
const NUM_POINTS = 32;
const ORIGIN = { x: 0, y: 0 };

function distance(p1: Point, p2: Point): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

function pathLength(points: Point[]): number {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    if (points[i].strokeId === points[i - 1].strokeId) {
      length += distance(points[i - 1], points[i]);
    }
  }
  return length;
}

function centroid(points: Point[]): Point {
  let x = 0,
    y = 0;
  for (const p of points) {
    x += p.x;
    y += p.y;
  }
  return { x: x / points.length, y: y / points.length };
}

export function getBounds(points: Point[]): GestureBounds {
  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;

  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function resample(points: Point[], n: number): Point[] {
  if (points.length === 0) return [];
  const interval = pathLength(points) / (n - 1);
  let accDist = 0;
  const resampled: Point[] = [{ ...points[0] }];

  let i = 1;
  while (i < points.length && resampled.length < n) {
    if (points[i].strokeId === points[i - 1].strokeId) {
      const d = distance(points[i - 1], points[i]);
      if (accDist + d >= interval) {
        const t = (interval - accDist) / d;
        const q: Point = {
          x: points[i - 1].x + t * (points[i].x - points[i - 1].x),
          y: points[i - 1].y + t * (points[i].y - points[i - 1].y),
          strokeId: points[i].strokeId,
        };
        resampled.push(q);
        points.splice(i, 0, q);
        accDist = 0;
      } else {
        accDist += d;
      }
    }
    i++;
  }

  while (resampled.length < n) {
    resampled.push({ ...points[points.length - 1] });
  }
  return resampled.slice(0, n);
}

function scale(points: Point[]): Point[] {
  const bounds = getBounds(points);
  const size = Math.max(bounds.width, bounds.height);
  if (size === 0) return points;
  return points.map((p) => ({
    x: (p.x - bounds.minX) / size,
    y: (p.y - bounds.minY) / size,
    strokeId: p.strokeId,
  }));
}

function translateTo(points: Point[], to: Point): Point[] {
  const c = centroid(points);
  return points.map((p) => ({
    x: p.x + to.x - c.x,
    y: p.y + to.y - c.y,
    strokeId: p.strokeId,
  }));
}

function cloudDistance(points1: Point[], points2: Point[]): number {
  const n = Math.min(points1.length, points2.length);
  const matched = new Array(n).fill(false);
  let sum = 0;

  for (let i = 0; i < n; i++) {
    let minDist = Infinity;
    let minIndex = -1;
    for (let j = 0; j < n; j++) {
      if (!matched[j]) {
        const d = distance(points1[i], points2[j]);
        if (d < minDist) {
          minDist = d;
          minIndex = j;
        }
      }
    }
    if (minIndex >= 0) matched[minIndex] = true;
    sum += minDist;
  }
  return sum;
}

function normalize(points: Point[]): Point[] {
  let processed = resample([...points], NUM_POINTS);
  processed = scale(processed);
  processed = translateTo(processed, ORIGIN);
  return processed;
}

// Helper to create arc points
function createArc(
  startAngle: number,
  endAngle: number,
  cx: number,
  cy: number,
  r: number,
  n: number = 20
): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i <= n; i++) {
    const angle = startAngle + (endAngle - startAngle) * (i / n);
    pts.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      strokeId: 0,
    });
  }
  return pts;
}

export class GestureRecognizer {
  private templates: GestureTemplate[] = [];

  constructor() {
    this.initializeDefaultTemplates();
  }

  private initializeDefaultTemplates(): void {
    // ═══════════════════════════════════════════════════════════════
    // SWAP - Curved arc like a flipped C or ⌒
    // Draw between two blocks to swap them
    // ═══════════════════════════════════════════════════════════════

    // Arc curving down (swap below)
    this.addTemplate({
      name: "swap-arc-down",
      points: createArc(-Math.PI, 0, 100, 100, 50),
      action: "swap",
      description: "Swap these two blocks",
      icon: "swap",
    });

    // Arc curving up (swap above)
    this.addTemplate({
      name: "swap-arc-up",
      points: createArc(0, Math.PI, 100, 100, 50),
      action: "swap",
      description: "Swap these two blocks",
      icon: "swap",
    });

    // Arc curving right
    this.addTemplate({
      name: "swap-arc-right",
      points: createArc(-Math.PI / 2, Math.PI / 2, 100, 100, 50),
      action: "swap",
      description: "Swap these two blocks",
      icon: "swap",
    });

    // Arc curving left
    this.addTemplate({
      name: "swap-arc-left",
      points: createArc(Math.PI / 2, (3 * Math.PI) / 2, 100, 100, 50),
      action: "swap",
      description: "Swap these two blocks",
      icon: "swap",
    });

    // ═══════════════════════════════════════════════════════════════
    // DELETE - Slash through content (/)
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "slash-delete",
      points: [
        { x: 50, y: 150, strokeId: 0 },
        { x: 150, y: 50, strokeId: 0 },
      ],
      action: "delete",
      description: "Delete this content",
      icon: "trash",
    });

    // Backslash also works
    this.addTemplate({
      name: "backslash-delete",
      points: [
        { x: 50, y: 50, strokeId: 0 },
        { x: 150, y: 150, strokeId: 0 },
      ],
      action: "delete",
      description: "Delete this content",
      icon: "trash",
    });

    // X mark (two strokes)
    this.addTemplate({
      name: "x-delete",
      points: [
        { x: 50, y: 50, strokeId: 0 },
        { x: 150, y: 150, strokeId: 0 },
        { x: 150, y: 50, strokeId: 1 },
        { x: 50, y: 150, strokeId: 1 },
      ],
      action: "delete",
      description: "Delete this content",
      icon: "trash",
    });

    // ═══════════════════════════════════════════════════════════════
    // ADD/INSERT - Plus sign (+)
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "plus",
      points: [
        { x: 100, y: 50, strokeId: 0 },
        { x: 100, y: 150, strokeId: 0 },
        { x: 50, y: 100, strokeId: 1 },
        { x: 150, y: 100, strokeId: 1 },
      ],
      action: "add",
      description: "Add new block here",
      icon: "plus",
    });

    // Single stroke plus
    this.addTemplate({
      name: "plus-single",
      points: [
        { x: 100, y: 50, strokeId: 0 },
        { x: 100, y: 150, strokeId: 0 },
        { x: 100, y: 100, strokeId: 0 },
        { x: 50, y: 100, strokeId: 0 },
        { x: 150, y: 100, strokeId: 0 },
      ],
      action: "add",
      description: "Add new block here",
      icon: "plus",
    });

    // ═══════════════════════════════════════════════════════════════
    // DUPLICATE - Equals sign (=) or two parallel lines
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "equals-duplicate",
      points: [
        { x: 50, y: 80, strokeId: 0 },
        { x: 150, y: 80, strokeId: 0 },
        { x: 50, y: 120, strokeId: 1 },
        { x: 150, y: 120, strokeId: 1 },
      ],
      action: "duplicate",
      description: "Duplicate this block",
      icon: "copy",
    });

    // ═══════════════════════════════════════════════════════════════
    // INDENT - Greater than (>) or bracket
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "indent-right",
      points: [
        { x: 50, y: 50, strokeId: 0 },
        { x: 100, y: 100, strokeId: 0 },
        { x: 50, y: 150, strokeId: 0 },
      ],
      action: "indent",
      description: "Indent this content",
      icon: "indent",
    });

    // Right bracket ]
    this.addTemplate({
      name: "bracket-right",
      points: [
        { x: 50, y: 50, strokeId: 0 },
        { x: 100, y: 50, strokeId: 0 },
        { x: 100, y: 150, strokeId: 0 },
        { x: 50, y: 150, strokeId: 0 },
      ],
      action: "indent",
      description: "Indent this content",
      icon: "indent",
    });

    // ═══════════════════════════════════════════════════════════════
    // OUTDENT - Less than (<)
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "outdent-left",
      points: [
        { x: 100, y: 50, strokeId: 0 },
        { x: 50, y: 100, strokeId: 0 },
        { x: 100, y: 150, strokeId: 0 },
      ],
      action: "outdent",
      description: "Outdent this content",
      icon: "outdent",
    });

    // ═══════════════════════════════════════════════════════════════
    // UNDO - Pigtail/loop (↺)
    // ═══════════════════════════════════════════════════════════════

    const undoLoop: Point[] = [];
    // Counter-clockwise loop
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const angle = Math.PI * 2 * t - Math.PI / 2;
      undoLoop.push({
        x: 100 + 40 * Math.cos(angle),
        y: 100 + 40 * Math.sin(angle),
        strokeId: 0,
      });
    }
    // Arrow tail
    undoLoop.push({ x: 60, y: 80, strokeId: 0 });
    this.addTemplate({
      name: "undo-loop",
      points: undoLoop,
      action: "undo",
      description: "Undo last action",
      icon: "undo",
    });

    // ═══════════════════════════════════════════════════════════════
    // REDO - Reverse pigtail (↻)
    // ═══════════════════════════════════════════════════════════════

    const redoLoop: Point[] = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const angle = -Math.PI * 2 * t + Math.PI / 2;
      redoLoop.push({
        x: 100 + 40 * Math.cos(angle),
        y: 100 + 40 * Math.sin(angle),
        strokeId: 0,
      });
    }
    redoLoop.push({ x: 140, y: 80, strokeId: 0 });
    this.addTemplate({
      name: "redo-loop",
      points: redoLoop,
      action: "redo",
      description: "Redo last action",
      icon: "redo",
    });

    // ═══════════════════════════════════════════════════════════════
    // MOVE UP - Arrow up (↑)
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "arrow-up",
      points: [
        { x: 100, y: 150, strokeId: 0 },
        { x: 100, y: 50, strokeId: 0 },
        { x: 70, y: 80, strokeId: 0 },
        { x: 100, y: 50, strokeId: 0 },
        { x: 130, y: 80, strokeId: 0 },
      ],
      action: "move-up",
      description: "Move this block up",
      icon: "arrow-up",
    });

    // ═══════════════════════════════════════════════════════════════
    // MOVE DOWN - Arrow down (↓)
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "arrow-down",
      points: [
        { x: 100, y: 50, strokeId: 0 },
        { x: 100, y: 150, strokeId: 0 },
        { x: 70, y: 120, strokeId: 0 },
        { x: 100, y: 150, strokeId: 0 },
        { x: 130, y: 120, strokeId: 0 },
      ],
      action: "move-down",
      description: "Move this block down",
      icon: "arrow-down",
    });

    // ═══════════════════════════════════════════════════════════════
    // SELECT/HIGHLIGHT - Circle (○)
    // ═══════════════════════════════════════════════════════════════

    const circlePoints: Point[] = [];
    for (let i = 0; i <= 32; i++) {
      const angle = (i / 32) * 2 * Math.PI;
      circlePoints.push({
        x: 100 + 50 * Math.cos(angle),
        y: 100 + 50 * Math.sin(angle),
        strokeId: 0,
      });
    }
    this.addTemplate({
      name: "circle-select",
      points: circlePoints,
      action: "select",
      description: "Select this content",
      icon: "circle",
    });

    // ═══════════════════════════════════════════════════════════════
    // CREATE BLOCK - Rectangle (□)
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "rectangle",
      points: [
        { x: 50, y: 50, strokeId: 0 },
        { x: 150, y: 50, strokeId: 0 },
        { x: 150, y: 130, strokeId: 0 },
        { x: 50, y: 130, strokeId: 0 },
        { x: 50, y: 50, strokeId: 0 },
      ],
      action: "create-block",
      description: "Create a callout block",
      icon: "square",
    });

    // ═══════════════════════════════════════════════════════════════
    // COMPLETE - Checkmark (✓)
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "check",
      points: [
        { x: 50, y: 100, strokeId: 0 },
        { x: 80, y: 140, strokeId: 0 },
        { x: 150, y: 50, strokeId: 0 },
      ],
      action: "complete",
      description: "Mark as complete",
      icon: "check",
    });

    // ═══════════════════════════════════════════════════════════════
    // AI REWRITE - Zigzag/squiggle (~)
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "zigzag",
      points: [
        { x: 40, y: 80, strokeId: 0 },
        { x: 70, y: 120, strokeId: 0 },
        { x: 100, y: 80, strokeId: 0 },
        { x: 130, y: 120, strokeId: 0 },
        { x: 160, y: 80, strokeId: 0 },
      ],
      action: "rewrite",
      description: "AI rewrite this content",
      icon: "wand",
    });

    // ═══════════════════════════════════════════════════════════════
    // SUMMARIZE - Horizontal pinch lines (⟨⟩)
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "pinch-summarize",
      points: [
        { x: 50, y: 50, strokeId: 0 },
        { x: 100, y: 100, strokeId: 0 },
        { x: 50, y: 150, strokeId: 0 },
        { x: 150, y: 50, strokeId: 1 },
        { x: 100, y: 100, strokeId: 1 },
        { x: 150, y: 150, strokeId: 1 },
      ],
      action: "summarize",
      description: "Summarize this content",
      icon: "compress",
    });

    // ═══════════════════════════════════════════════════════════════
    // EXPAND/ELABORATE - Outward arrows (↔ or ⟩⟨)
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "expand-outward",
      points: [
        { x: 100, y: 50, strokeId: 0 },
        { x: 50, y: 100, strokeId: 0 },
        { x: 100, y: 150, strokeId: 0 },
        { x: 100, y: 50, strokeId: 1 },
        { x: 150, y: 100, strokeId: 1 },
        { x: 100, y: 150, strokeId: 1 },
      ],
      action: "expand",
      description: "Expand/elaborate on this",
      icon: "expand",
    });

    // ═══════════════════════════════════════════════════════════════
    // LINK/CONNECT - S-curve between items
    // ═══════════════════════════════════════════════════════════════

    const sCurve: Point[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const x = 50 + 100 * t;
      const y = 50 + 100 * t + 30 * Math.sin(t * Math.PI * 2);
      sCurve.push({ x, y, strokeId: 0 });
    }
    this.addTemplate({
      name: "s-curve-link",
      points: sCurve,
      action: "link",
      description: "Link these items",
      icon: "link",
    });

    // ═══════════════════════════════════════════════════════════════
    // ASK AI - Question mark (?)
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "question",
      points: [
        { x: 70, y: 60, strokeId: 0 },
        { x: 100, y: 40, strokeId: 0 },
        { x: 130, y: 60, strokeId: 0 },
        { x: 130, y: 90, strokeId: 0 },
        { x: 100, y: 110, strokeId: 0 },
        { x: 100, y: 130, strokeId: 0 },
        { x: 100, y: 150, strokeId: 0 },
      ],
      action: "ask-ai",
      description: "Ask AI about this",
      icon: "help",
    });

    // ═══════════════════════════════════════════════════════════════
    // STAR/FAVORITE - Star shape (☆)
    // ═══════════════════════════════════════════════════════════════

    const starPoints: Point[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      const r = i % 2 === 0 ? 50 : 20;
      starPoints.push({
        x: 100 + r * Math.cos(angle),
        y: 100 + r * Math.sin(angle),
        strokeId: 0,
      });
    }
    starPoints.push({ ...starPoints[0] });
    this.addTemplate({
      name: "star",
      points: starPoints,
      action: "favorite",
      description: "Mark as favorite",
      icon: "star",
    });

    // ═══════════════════════════════════════════════════════════════
    // STRIKETHROUGH - Horizontal line through content
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "strikethrough",
      points: [
        { x: 50, y: 100, strokeId: 0 },
        { x: 150, y: 100, strokeId: 0 },
      ],
      action: "strikethrough",
      description: "Strike through this",
      icon: "strikethrough",
    });

    // ═══════════════════════════════════════════════════════════════
    // BULLET - Short horizontal dash
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "dash-bullet",
      points: [
        { x: 80, y: 100, strokeId: 0 },
        { x: 120, y: 100, strokeId: 0 },
      ],
      action: "toggle-bullet",
      description: "Toggle bullet point",
      icon: "list",
    });

    // ═══════════════════════════════════════════════════════════════
    // MERGE - Two arrows pointing inward (→←)
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "merge-arrows",
      points: [
        { x: 40, y: 100, strokeId: 0 },
        { x: 90, y: 100, strokeId: 0 },
        { x: 70, y: 80, strokeId: 0 },
        { x: 90, y: 100, strokeId: 0 },
        { x: 70, y: 120, strokeId: 0 },
        { x: 160, y: 100, strokeId: 1 },
        { x: 110, y: 100, strokeId: 1 },
        { x: 130, y: 80, strokeId: 1 },
        { x: 110, y: 100, strokeId: 1 },
        { x: 130, y: 120, strokeId: 1 },
      ],
      action: "merge",
      description: "Merge these blocks",
      icon: "merge",
    });

    // ═══════════════════════════════════════════════════════════════
    // SPLIT - Line down the middle (|)
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "vertical-split",
      points: [
        { x: 100, y: 40, strokeId: 0 },
        { x: 100, y: 160, strokeId: 0 },
      ],
      action: "split",
      description: "Split this block",
      icon: "split",
    });

    // ═══════════════════════════════════════════════════════════════
    // HIGHLIGHT/UNDERLINE - Wavy line under
    // ═══════════════════════════════════════════════════════════════

    const wavyLine: Point[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      wavyLine.push({
        x: 50 + 100 * t,
        y: 120 + 10 * Math.sin(t * Math.PI * 4),
        strokeId: 0,
      });
    }
    this.addTemplate({
      name: "wavy-highlight",
      points: wavyLine,
      action: "highlight",
      description: "Highlight this text",
      icon: "highlighter",
    });

    // ═══════════════════════════════════════════════════════════════
    // CODE BLOCK - Curly braces { }
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "curly-braces",
      points: [
        { x: 70, y: 40, strokeId: 0 },
        { x: 50, y: 60, strokeId: 0 },
        { x: 50, y: 90, strokeId: 0 },
        { x: 40, y: 100, strokeId: 0 },
        { x: 50, y: 110, strokeId: 0 },
        { x: 50, y: 140, strokeId: 0 },
        { x: 70, y: 160, strokeId: 0 },
        { x: 130, y: 40, strokeId: 1 },
        { x: 150, y: 60, strokeId: 1 },
        { x: 150, y: 90, strokeId: 1 },
        { x: 160, y: 100, strokeId: 1 },
        { x: 150, y: 110, strokeId: 1 },
        { x: 150, y: 140, strokeId: 1 },
        { x: 130, y: 160, strokeId: 1 },
      ],
      action: "code-block",
      description: "Create code block",
      icon: "code",
    });

    // ═══════════════════════════════════════════════════════════════
    // ARROW RIGHT - Continue/proceed
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "arrow-right",
      points: [
        { x: 50, y: 100, strokeId: 0 },
        { x: 150, y: 100, strokeId: 0 },
        { x: 120, y: 70, strokeId: 0 },
        { x: 150, y: 100, strokeId: 0 },
        { x: 120, y: 130, strokeId: 0 },
      ],
      action: "continue",
      description: "Continue writing with AI",
      icon: "arrow-right",
    });

    // ═══════════════════════════════════════════════════════════════
    // TRIANGLE/WARNING - Important marker
    // ═══════════════════════════════════════════════════════════════

    this.addTemplate({
      name: "triangle-warning",
      points: [
        { x: 100, y: 40, strokeId: 0 },
        { x: 50, y: 140, strokeId: 0 },
        { x: 150, y: 140, strokeId: 0 },
        { x: 100, y: 40, strokeId: 0 },
      ],
      action: "warning",
      description: "Add warning callout",
      icon: "alert-triangle",
    });
  }

  addTemplate(template: GestureTemplate): void {
    const normalized = normalize(template.points);
    this.templates.push({ ...template, points: normalized });
  }

  recognize(points: Point[]): RecognitionResult | null {
    if (points.length < 5) return null;

    const candidate = normalize([...points]);
    let bestScore = Infinity;
    let bestTemplate: GestureTemplate | null = null;

    for (const template of this.templates) {
      const d1 = cloudDistance(candidate, template.points);
      const d2 = cloudDistance(candidate, [...template.points].reverse());
      const d = Math.min(d1, d2);

      if (d < bestScore) {
        bestScore = d;
        bestTemplate = template;
      }
    }

    if (!bestTemplate) return null;

    // More lenient scoring - lower divisor = more sensitive
    const score = Math.max(0, 1 - bestScore / 3.0);
    if (score < 0.3) return null;

    return {
      name: bestTemplate.name,
      score,
      action: bestTemplate.action,
      description: bestTemplate.description,
      icon: bestTemplate.icon,
    };
  }

  getTemplates(): GestureTemplate[] {
    return this.templates;
  }
}

export const gestureRecognizer = new GestureRecognizer();
