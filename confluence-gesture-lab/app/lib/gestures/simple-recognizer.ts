/**
 * Simple Geometric Gesture Recognizer
 *
 * Instead of ML or point-cloud matching, use simple geometric features:
 * - Bounding box aspect ratio
 * - Is it closed (start ≈ end)?
 * - Direction changes
 * - Enclosed area
 * - Overall direction
 *
 * This is more predictable and easier to debug.
 */

export interface Point {
  x: number;
  y: number;
  strokeId?: number;
}

export interface RecognitionResult {
  name: string;
  action: string;
  confidence: number;
  description: string;
}

export interface GestureBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

// Calculate distance between two points
function dist(p1: Point, p2: Point): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

// Get bounding box
export function getBounds(points: Point[]): GestureBounds {
  if (points.length === 0) {
    return {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
      width: 0,
      height: 0,
      centerX: 0,
      centerY: 0,
    };
  }

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
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
}

// Calculate total path length
function pathLength(points: Point[]): number {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    length += dist(points[i - 1], points[i]);
  }
  return length;
}

// Is the gesture closed (start near end)?
function isClosed(points: Point[], threshold = 0.15): boolean {
  if (points.length < 3) return false;
  const bounds = getBounds(points);
  const size = Math.max(bounds.width, bounds.height);
  if (size === 0) return false;

  const startEnd = dist(points[0], points[points.length - 1]);
  return startEnd / size < threshold;
}

// Count significant direction changes
function countDirectionChanges(
  points: Point[],
  angleThreshold = Math.PI / 4
): number {
  if (points.length < 3) return 0;

  let changes = 0;
  let prevAngle: number | null = null;

  for (let i = 2; i < points.length; i++) {
    const dx = points[i].x - points[i - 2].x;
    const dy = points[i].y - points[i - 2].y;
    const angle = Math.atan2(dy, dx);

    if (prevAngle !== null) {
      let diff = Math.abs(angle - prevAngle);
      if (diff > Math.PI) diff = 2 * Math.PI - diff;
      if (diff > angleThreshold) {
        changes++;
      }
    }
    prevAngle = angle;
  }

  return changes;
}

// Get overall direction (which way does the gesture go?)
function getOverallDirection(points: Point[]): {
  dx: number;
  dy: number;
  angle: number;
} {
  if (points.length < 2) return { dx: 0, dy: 0, angle: 0 };

  const start = points[0];
  const end = points[points.length - 1];
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  return { dx, dy, angle: Math.atan2(dy, dx) };
}

// Calculate approximate enclosed area (for closed shapes)
function approximateArea(points: Point[]): number {
  if (points.length < 3) return 0;

  // Shoelace formula
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

// Check if shape is roughly circular (area vs bounding box ratio)
function isRoughlyCircular(points: Point[]): boolean {
  const bounds = getBounds(points);
  const aspectRatio = bounds.width / (bounds.height || 1);
  const area = approximateArea(points);
  const boxArea = bounds.width * bounds.height;

  // Circle should fill ~78% of bounding box (π/4)
  const fillRatio = area / (boxArea || 1);

  return (
    aspectRatio > 0.6 &&
    aspectRatio < 1.6 &&
    fillRatio > 0.4 &&
    fillRatio < 1.2 &&
    isClosed(points, 0.25)
  );
}

// Check if it's a line (low curvature)
function isLine(points: Point[]): {
  isLine: boolean;
  direction: "horizontal" | "vertical" | "diagonal" | null;
} {
  if (points.length < 2) return { isLine: false, direction: null };

  const bounds = getBounds(points);
  const changes = countDirectionChanges(points, Math.PI / 6);
  const length = pathLength(points);
  const straightDist = dist(points[0], points[points.length - 1]);

  // A line should have path length close to straight distance
  const straightness = straightDist / (length || 1);

  if (straightness < 0.8 || changes > 3) {
    return { isLine: false, direction: null };
  }

  const aspectRatio = bounds.width / (bounds.height || 1);

  if (aspectRatio > 3) return { isLine: true, direction: "horizontal" };
  if (aspectRatio < 0.33) return { isLine: true, direction: "vertical" };
  return { isLine: true, direction: "diagonal" };
}

// Check if it's an arrow (line with a head)
function isArrow(points: Point[]): {
  isArrow: boolean;
  direction: "up" | "down" | "left" | "right" | null;
} {
  if (points.length < 5) return { isArrow: false, direction: null };

  const bounds = getBounds(points);
  const { dx, dy, angle } = getOverallDirection(points);
  const changes = countDirectionChanges(points, Math.PI / 4);

  // Arrows have 2-4 direction changes (for the head)
  if (changes < 1 || changes > 6) return { isArrow: false, direction: null };

  // Determine direction
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (absDy > absDx * 1.5) {
    return { isArrow: true, direction: dy > 0 ? "down" : "up" };
  } else if (absDx > absDy * 1.5) {
    return { isArrow: true, direction: dx > 0 ? "right" : "left" };
  }

  return { isArrow: false, direction: null };
}

// Check if it's a checkmark
function isCheckmark(points: Point[]): boolean {
  if (points.length < 3) return false;

  const bounds = getBounds(points);
  const changes = countDirectionChanges(points, Math.PI / 4);
  const { dy } = getOverallDirection(points);

  // Checkmark: 1 direction change, ends going up-right
  // and the lowest point is in the middle-ish
  if (changes !== 1) return false;

  // Find lowest point
  let lowestIdx = 0;
  let lowestY = -Infinity;
  for (let i = 0; i < points.length; i++) {
    if (points[i].y > lowestY) {
      lowestY = points[i].y;
      lowestIdx = i;
    }
  }

  // Lowest point should be in middle third
  const relativePos = lowestIdx / points.length;
  if (relativePos < 0.2 || relativePos > 0.7) return false;

  // Should end higher than lowest point
  return points[points.length - 1].y < lowestY - bounds.height * 0.2;
}

// Check if it's an X - two diagonal lines crossing
function isX(points: Point[]): boolean {
  if (points.length < 5) return false;

  const bounds = getBounds(points);
  const changes = countDirectionChanges(points, Math.PI / 4);

  // X has aspect ratio near 1 (roughly square)
  const aspectRatio = bounds.width / (bounds.height || 1);
  if (aspectRatio < 0.5 || aspectRatio > 2) return false;

  // X has multiple direction changes from the crossing
  if (changes < 1 || changes > 8) return false;

  // X should span most of its bounding box diagonally
  // Check that points cover all four quadrants of the bounding box
  const centerX = bounds.centerX;
  const centerY = bounds.centerY;
  let topLeft = false,
    topRight = false,
    bottomLeft = false,
    bottomRight = false;

  for (const p of points) {
    if (p.x < centerX && p.y < centerY) topLeft = true;
    if (p.x > centerX && p.y < centerY) topRight = true;
    if (p.x < centerX && p.y > centerY) bottomLeft = true;
    if (p.x > centerX && p.y > centerY) bottomRight = true;
  }

  // X should have points in all 4 quadrants
  return topLeft && topRight && bottomLeft && bottomRight;
}

// Check if it's a plus - horizontal and vertical lines crossing at center
function isPlus(points: Point[]): boolean {
  if (points.length < 5) return false;

  const bounds = getBounds(points);
  const changes = countDirectionChanges(points, Math.PI / 3);

  // Plus: aspect ratio near 1 (roughly square)
  const aspectRatio = bounds.width / (bounds.height || 1);
  if (aspectRatio < 0.5 || aspectRatio > 2) return false;

  // Plus has direction changes where lines meet
  if (changes < 1 || changes > 6) return false;

  // Plus should have points along horizontal center AND vertical center
  const centerX = bounds.centerX;
  const centerY = bounds.centerY;
  const tolerance = Math.max(bounds.width, bounds.height) * 0.25;

  let hasHorizontal = false; // points along horizontal axis
  let hasVertical = false; // points along vertical axis
  let pointsNearCenterX = 0; // points near vertical center line
  let pointsNearCenterY = 0; // points near horizontal center line

  for (const p of points) {
    // Check if point is on vertical center (horizontal line)
    if (Math.abs(p.y - centerY) < tolerance) {
      pointsNearCenterY++;
      if (p.x < centerX - tolerance || p.x > centerX + tolerance) {
        hasHorizontal = true;
      }
    }
    // Check if point is on horizontal center (vertical line)
    if (Math.abs(p.x - centerX) < tolerance) {
      pointsNearCenterX++;
      if (p.y < centerY - tolerance || p.y > centerY + tolerance) {
        hasVertical = true;
      }
    }
  }

  // Plus must have both horizontal and vertical strokes through center
  return (
    hasHorizontal &&
    hasVertical &&
    pointsNearCenterX > 3 &&
    pointsNearCenterY > 3
  );
}

// Check if it's a rectangle
function isRectangle(points: Point[]): boolean {
  if (!isClosed(points, 0.2)) return false;

  const bounds = getBounds(points);
  const changes = countDirectionChanges(points, Math.PI / 4);

  // Rectangle: 4 direction changes, roughly rectangular shape
  return changes >= 3 && changes <= 6;
}

// Check if it's a zigzag/wave
function isZigzag(points: Point[]): boolean {
  const changes = countDirectionChanges(points, Math.PI / 4);
  const bounds = getBounds(points);

  // Zigzag: many direction changes, wider than tall
  return changes >= 4 && bounds.width > bounds.height * 0.8;
}

// Check if it's an arc (for swap) - can be horizontal OR vertical
// STRICT: Must be elongated (not square) and have smooth curvature
function isArc(points: Point[]): {
  isArc: boolean;
  orientation: "horizontal" | "vertical" | null;
  direction: "up" | "down" | "left" | "right" | null;
} {
  if (points.length < 10)
    return { isArc: false, orientation: null, direction: null };

  const bounds = getBounds(points);
  const changes = countDirectionChanges(points, Math.PI / 6);

  // Arc: smooth curve, VERY few direction changes (max 2)
  // X and + have more direction changes from crossing
  if (changes > 2) return { isArc: false, orientation: null, direction: null };

  // Arc must be elongated - NOT square (X and + are roughly square)
  const aspectRatio = bounds.width / (bounds.height || 1);
  if (aspectRatio > 0.5 && aspectRatio < 2.0) {
    // Too square-ish - reject
    return { isArc: false, orientation: null, direction: null };
  }

  const midIdx = Math.floor(points.length / 2);
  const midPoint = points[midIdx];
  const startPoint = points[0];
  const endPoint = points[points.length - 1];

  // Check if it's a VERTICAL arc (connecting elements stacked vertically)
  // The arc would curve left or right, like ) or (
  // Must be significantly taller than wide
  if (bounds.height > bounds.width * 2) {
    const avgEndX = (startPoint.x + endPoint.x) / 2;
    const midX = midPoint.x;

    // Middle must curve significantly (at least 30% of width)
    const curvature = Math.abs(midX - avgEndX) / (bounds.width || 1);
    if (curvature > 0.3) {
      if (midX > avgEndX) {
        return { isArc: true, orientation: "vertical", direction: "right" };
      } else {
        return { isArc: true, orientation: "vertical", direction: "left" };
      }
    }
  }

  // Check if it's a HORIZONTAL arc (connecting elements side by side)
  // The arc would curve up or down, like ⌒ or ⌣
  // Must be significantly wider than tall
  if (bounds.width > bounds.height * 2) {
    const avgEndY = (startPoint.y + endPoint.y) / 2;
    const midY = midPoint.y;

    // Middle must curve significantly (at least 30% of height)
    const curvature = Math.abs(midY - avgEndY) / (bounds.height || 1);
    if (curvature > 0.3) {
      if (midY < avgEndY) {
        return { isArc: true, orientation: "horizontal", direction: "up" };
      } else {
        return { isArc: true, orientation: "horizontal", direction: "down" };
      }
    }
  }

  return { isArc: false, orientation: null, direction: null };
}

// Main recognition function
export function recognizeGesture(points: Point[]): RecognitionResult | null {
  if (points.length < 5) return null;

  const bounds = getBounds(points);
  if (bounds.width < 20 && bounds.height < 20) return null;

  // Try each gesture type in order - check square-ish gestures FIRST
  // (X, +, circle) before elongated ones (arc, lines)

  // 1. Check for X (priority - common delete gesture)
  if (isX(points) && !isPlus(points)) {
    return {
      name: "x",
      action: "delete",
      confidence: 0.8,
      description: "Delete this content",
    };
  }

  // 2. Check for plus (priority - common add gesture)
  if (isPlus(points)) {
    return {
      name: "plus",
      action: "add",
      confidence: 0.8,
      description: "Add new block",
    };
  }

  // 3. Check for checkmark
  if (isCheckmark(points)) {
    return {
      name: "check",
      action: "complete",
      confidence: 0.85,
      description: "Mark as complete",
    };
  }

  // 4. Check for circle (closed, roughly circular)
  if (isRoughlyCircular(points)) {
    return {
      name: "circle",
      action: "select",
      confidence: 0.85,
      description: "Select this content",
    };
  }

  // 5. Check for rectangle
  if (isRectangle(points) && !isRoughlyCircular(points)) {
    return {
      name: "rectangle",
      action: "create-block",
      confidence: 0.75,
      description: "Create a callout block",
    };
  }

  // 6. Check for arc (swap gesture) - AFTER X and + since it requires elongated shape
  // Works both vertically (like ) or ( between stacked paragraphs)
  // and horizontally (like ⌒ between side-by-side elements)
  const arc = isArc(points);
  if (arc.isArc) {
    return {
      name: `arc-${arc.orientation}-${arc.direction}`,
      action: "swap",
      confidence: 0.8,
      description: "Swap these blocks",
    };
  }

  // 7. Check for zigzag
  if (isZigzag(points)) {
    return {
      name: "zigzag",
      action: "rewrite",
      confidence: 0.7,
      description: "AI rewrite this content",
    };
  }

  // 8. Check for arrows
  const arrow = isArrow(points);
  if (arrow.isArrow && arrow.direction) {
    const actions: Record<string, { action: string; desc: string }> = {
      up: { action: "move-up", desc: "Move this block up" },
      down: { action: "move-down", desc: "Move this block down" },
      left: { action: "outdent", desc: "Outdent this content" },
      right: { action: "indent", desc: "Indent this content" },
    };
    return {
      name: `arrow-${arrow.direction}`,
      action: actions[arrow.direction].action,
      confidence: 0.75,
      description: actions[arrow.direction].desc,
    };
  }

  // 9. Check for lines
  const line = isLine(points);
  if (line.isLine && line.direction) {
    if (line.direction === "horizontal") {
      return {
        name: "line-horizontal",
        action: "strikethrough",
        confidence: 0.8,
        description: "Strikethrough this text",
      };
    } else if (line.direction === "vertical") {
      return {
        name: "line-vertical",
        action: "split",
        confidence: 0.7,
        description: "Split this block",
      };
    } else {
      // Diagonal line - treat as slash/delete
      return {
        name: "slash",
        action: "delete",
        confidence: 0.7,
        description: "Delete this content",
      };
    }
  }

  return null;
}

// Export a class wrapper for consistency with other recognizers
export class SimpleGestureRecognizer {
  recognize(points: Point[]): RecognitionResult | null {
    return recognizeGesture(points);
  }
}

export const simpleRecognizer = new SimpleGestureRecognizer();
