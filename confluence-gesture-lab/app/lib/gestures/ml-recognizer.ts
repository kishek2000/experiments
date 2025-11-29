/**
 * ML-based Gesture Recognizer using TensorFlow.js
 *
 * This creates a small neural network that learns gesture patterns.
 * It runs entirely in the browser - no server calls needed.
 *
 * The network takes normalized gesture points and outputs gesture classifications.
 */

import * as tf from "@tensorflow/tfjs";

export interface Point {
  x: number;
  y: number;
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

export interface RecognitionResult {
  name: string;
  action: string;
  confidence: number;
  description: string;
  method: "ml" | "template" | "ai";
}

// Gesture definitions with their actions
export const GESTURE_CLASSES = [
  { name: "circle", action: "select", description: "Select content" },
  { name: "check", action: "complete", description: "Mark complete" },
  { name: "x", action: "delete", description: "Delete content" },
  {
    name: "line-horizontal",
    action: "strikethrough",
    description: "Strikethrough",
  },
  { name: "line-vertical", action: "split", description: "Split block" },
  { name: "arrow-up", action: "move-up", description: "Move up" },
  { name: "arrow-down", action: "move-down", description: "Move down" },
  { name: "arrow-right", action: "continue", description: "Continue with AI" },
  { name: "arrow-left", action: "collapse", description: "Go back" },
  { name: "arc-up", action: "swap", description: "Swap blocks" },
  { name: "arc-down", action: "swap", description: "Swap blocks" },
  { name: "plus", action: "add", description: "Add block" },
  { name: "rectangle", action: "create-block", description: "Create callout" },
  { name: "triangle", action: "warning", description: "Add warning" },
  { name: "star", action: "favorite", description: "Favorite" },
  { name: "zigzag", action: "rewrite", description: "AI rewrite" },
  { name: "question", action: "ask-ai", description: "Ask AI" },
  { name: "bracket-right", action: "indent", description: "Indent" },
  { name: "bracket-left", action: "outdent", description: "Outdent" },
  { name: "loop-ccw", action: "undo", description: "Undo" },
  { name: "loop-cw", action: "redo", description: "Redo" },
  { name: "equals", action: "duplicate", description: "Duplicate" },
  { name: "wave", action: "highlight", description: "Highlight" },
] as const;

const NUM_POINTS = 32; // Normalize all gestures to this many points
const INPUT_SIZE = NUM_POINTS * 2; // x,y for each point

// Utility functions
function distance(p1: Point, p2: Point): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

function pathLength(points: Point[]): number {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    length += distance(points[i - 1], points[i]);
  }
  return length;
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

// Resample points to fixed count
function resample(points: Point[], n: number): Point[] {
  if (points.length === 0) return [];
  if (points.length === 1) return Array(n).fill(points[0]);

  const totalLength = pathLength(points);
  if (totalLength === 0) return Array(n).fill(points[0]);

  const interval = totalLength / (n - 1);
  const resampled: Point[] = [{ ...points[0] }];
  let accDist = 0;

  for (let i = 1; i < points.length && resampled.length < n; i++) {
    const d = distance(points[i - 1], points[i]);
    while (accDist + d >= interval && resampled.length < n) {
      const t = (interval - accDist) / d;
      resampled.push({
        x: points[i - 1].x + t * (points[i].x - points[i - 1].x),
        y: points[i - 1].y + t * (points[i].y - points[i - 1].y),
      });
      accDist = 0;
    }
    accDist += d;
  }

  while (resampled.length < n) {
    resampled.push({ ...points[points.length - 1] });
  }

  return resampled.slice(0, n);
}

// Normalize points to 0-1 range
function normalizePoints(points: Point[]): number[] {
  const bounds = getBounds(points);
  const size = Math.max(bounds.width, bounds.height, 1);

  return points.flatMap((p) => [
    (p.x - bounds.minX) / size,
    (p.y - bounds.minY) / size,
  ]);
}

// Generate training data for a gesture class
function generateTrainingExamples(
  gestureType: string,
  count: number = 50
): number[][] {
  const examples: number[][] = [];

  for (let i = 0; i < count; i++) {
    const points = generateGesturePoints(gestureType, i);
    const resampled = resample(points, NUM_POINTS);
    const normalized = normalizePoints(resampled);
    examples.push(normalized);
  }

  return examples;
}

// Generate synthetic gesture points with variation
function generateGesturePoints(type: string, seed: number): Point[] {
  const variation = () => (Math.random() - 0.5) * 20;
  const scale = 80 + Math.random() * 40;
  const cx = 100,
    cy = 100;

  switch (type) {
    case "circle": {
      const points: Point[] = [];
      const startAngle = Math.random() * Math.PI * 2;
      const numPoints = 20 + Math.floor(Math.random() * 20);
      for (let i = 0; i <= numPoints; i++) {
        const angle =
          startAngle +
          (i / numPoints) * Math.PI * 2 * (Math.random() > 0.5 ? 1 : -1);
        points.push({
          x: cx + (scale / 2) * Math.cos(angle) + variation() * 0.5,
          y: cy + (scale / 2) * Math.sin(angle) + variation() * 0.5,
        });
      }
      return points;
    }

    case "check": {
      return [
        { x: cx - scale / 3 + variation(), y: cy + variation() },
        { x: cx - scale / 6 + variation(), y: cy + scale / 4 + variation() },
        { x: cx + scale / 2 + variation(), y: cy - scale / 3 + variation() },
      ];
    }

    case "x": {
      const points: Point[] = [];
      // First stroke
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        points.push({
          x: cx - scale / 2 + t * scale + variation() * 0.3,
          y: cy - scale / 2 + t * scale + variation() * 0.3,
        });
      }
      // Second stroke
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        points.push({
          x: cx + scale / 2 - t * scale + variation() * 0.3,
          y: cy - scale / 2 + t * scale + variation() * 0.3,
        });
      }
      return points;
    }

    case "line-horizontal": {
      const points: Point[] = [];
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        points.push({
          x: cx - scale / 2 + t * scale + variation() * 0.2,
          y: cy + variation() * 0.5,
        });
      }
      return points;
    }

    case "line-vertical": {
      const points: Point[] = [];
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        points.push({
          x: cx + variation() * 0.5,
          y: cy - scale / 2 + t * scale + variation() * 0.2,
        });
      }
      return points;
    }

    case "arrow-up": {
      const points: Point[] = [];
      // Shaft
      for (let i = 0; i <= 10; i++) {
        points.push({
          x: cx + variation() * 0.2,
          y: cy + scale / 2 - (i / 10) * scale + variation() * 0.2,
        });
      }
      // Left head
      points.push({
        x: cx - scale / 4 + variation() * 0.3,
        y: cy - scale / 4 + variation() * 0.3,
      });
      points.push({
        x: cx + variation() * 0.2,
        y: cy - scale / 2 + variation() * 0.2,
      });
      // Right head
      points.push({
        x: cx + scale / 4 + variation() * 0.3,
        y: cy - scale / 4 + variation() * 0.3,
      });
      return points;
    }

    case "arrow-down": {
      const points: Point[] = [];
      for (let i = 0; i <= 10; i++) {
        points.push({
          x: cx + variation() * 0.2,
          y: cy - scale / 2 + (i / 10) * scale + variation() * 0.2,
        });
      }
      points.push({
        x: cx - scale / 4 + variation() * 0.3,
        y: cy + scale / 4 + variation() * 0.3,
      });
      points.push({
        x: cx + variation() * 0.2,
        y: cy + scale / 2 + variation() * 0.2,
      });
      points.push({
        x: cx + scale / 4 + variation() * 0.3,
        y: cy + scale / 4 + variation() * 0.3,
      });
      return points;
    }

    case "arrow-right": {
      const points: Point[] = [];
      for (let i = 0; i <= 10; i++) {
        points.push({
          x: cx - scale / 2 + (i / 10) * scale + variation() * 0.2,
          y: cy + variation() * 0.2,
        });
      }
      points.push({ x: cx + scale / 4, y: cy - scale / 4 + variation() * 0.3 });
      points.push({ x: cx + scale / 2, y: cy + variation() * 0.2 });
      points.push({ x: cx + scale / 4, y: cy + scale / 4 + variation() * 0.3 });
      return points;
    }

    case "arrow-left": {
      const points: Point[] = [];
      for (let i = 0; i <= 10; i++) {
        points.push({
          x: cx + scale / 2 - (i / 10) * scale + variation() * 0.2,
          y: cy + variation() * 0.2,
        });
      }
      points.push({ x: cx - scale / 4, y: cy - scale / 4 + variation() * 0.3 });
      points.push({ x: cx - scale / 2, y: cy + variation() * 0.2 });
      points.push({ x: cx - scale / 4, y: cy + scale / 4 + variation() * 0.3 });
      return points;
    }

    case "arc-up":
    case "arc-down": {
      const points: Point[] = [];
      const startAngle = type === "arc-up" ? 0 : Math.PI;
      const endAngle = type === "arc-up" ? Math.PI : Math.PI * 2;
      for (let i = 0; i <= 20; i++) {
        const angle = startAngle + (i / 20) * (endAngle - startAngle);
        points.push({
          x: cx + (scale / 2) * Math.cos(angle) + variation() * 0.3,
          y: cy + (scale / 3) * Math.sin(angle) + variation() * 0.3,
        });
      }
      return points;
    }

    case "plus": {
      const points: Point[] = [];
      // Vertical
      for (let i = 0; i <= 8; i++) {
        points.push({
          x: cx + variation() * 0.2,
          y: cy - scale / 2 + (i / 8) * scale + variation() * 0.2,
        });
      }
      // Horizontal
      for (let i = 0; i <= 8; i++) {
        points.push({
          x: cx - scale / 2 + (i / 8) * scale + variation() * 0.2,
          y: cy + variation() * 0.2,
        });
      }
      return points;
    }

    case "rectangle": {
      const points: Point[] = [];
      const w = scale * 0.8,
        h = scale * 0.6;
      const corners = [
        { x: cx - w / 2, y: cy - h / 2 },
        { x: cx + w / 2, y: cy - h / 2 },
        { x: cx + w / 2, y: cy + h / 2 },
        { x: cx - w / 2, y: cy + h / 2 },
        { x: cx - w / 2, y: cy - h / 2 },
      ];
      for (let i = 0; i < corners.length - 1; i++) {
        for (let j = 0; j <= 5; j++) {
          const t = j / 5;
          points.push({
            x:
              corners[i].x +
              t * (corners[i + 1].x - corners[i].x) +
              variation() * 0.3,
            y:
              corners[i].y +
              t * (corners[i + 1].y - corners[i].y) +
              variation() * 0.3,
          });
        }
      }
      return points;
    }

    case "triangle": {
      const points: Point[] = [];
      const corners = [
        { x: cx, y: cy - scale / 2 },
        { x: cx - scale / 2, y: cy + scale / 3 },
        { x: cx + scale / 2, y: cy + scale / 3 },
        { x: cx, y: cy - scale / 2 },
      ];
      for (let i = 0; i < corners.length - 1; i++) {
        for (let j = 0; j <= 6; j++) {
          const t = j / 6;
          points.push({
            x:
              corners[i].x +
              t * (corners[i + 1].x - corners[i].x) +
              variation() * 0.3,
            y:
              corners[i].y +
              t * (corners[i + 1].y - corners[i].y) +
              variation() * 0.3,
          });
        }
      }
      return points;
    }

    case "star": {
      const points: Point[] = [];
      for (let i = 0; i <= 10; i++) {
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const r = i % 2 === 0 ? scale / 2 : scale / 4;
        points.push({
          x: cx + r * Math.cos(angle) + variation() * 0.3,
          y: cy + r * Math.sin(angle) + variation() * 0.3,
        });
      }
      return points;
    }

    case "zigzag": {
      const points: Point[] = [];
      const numZigs = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i <= numZigs * 2; i++) {
        points.push({
          x: cx - scale / 2 + (i / (numZigs * 2)) * scale + variation() * 0.3,
          y: cy + ((i % 2 === 0 ? -1 : 1) * scale) / 4 + variation() * 0.3,
        });
      }
      return points;
    }

    case "question": {
      const points: Point[] = [];
      // Top curve
      for (let i = 0; i <= 15; i++) {
        const angle = Math.PI + (i / 15) * Math.PI * 1.5;
        points.push({
          x: cx + (scale / 4) * Math.cos(angle) + variation() * 0.2,
          y: cy - scale / 4 + (scale / 4) * Math.sin(angle) + variation() * 0.2,
        });
      }
      // Stem
      points.push({ x: cx + variation() * 0.2, y: cy + variation() * 0.2 });
      // Dot
      points.push({
        x: cx + variation() * 0.2,
        y: cy + scale / 3 + variation() * 0.2,
      });
      return points;
    }

    case "bracket-right": {
      const points: Point[] = [];
      points.push({ x: cx - scale / 4, y: cy - scale / 2 + variation() * 0.2 });
      points.push({ x: cx + scale / 4, y: cy - scale / 2 + variation() * 0.2 });
      for (let i = 0; i <= 8; i++) {
        points.push({
          x: cx + scale / 4 + variation() * 0.2,
          y: cy - scale / 2 + (i / 8) * scale + variation() * 0.2,
        });
      }
      points.push({ x: cx - scale / 4, y: cy + scale / 2 + variation() * 0.2 });
      return points;
    }

    case "bracket-left": {
      const points: Point[] = [];
      points.push({ x: cx + scale / 4, y: cy - scale / 2 + variation() * 0.2 });
      points.push({ x: cx - scale / 4, y: cy - scale / 2 + variation() * 0.2 });
      for (let i = 0; i <= 8; i++) {
        points.push({
          x: cx - scale / 4 + variation() * 0.2,
          y: cy - scale / 2 + (i / 8) * scale + variation() * 0.2,
        });
      }
      points.push({ x: cx + scale / 4, y: cy + scale / 2 + variation() * 0.2 });
      return points;
    }

    case "loop-ccw": {
      const points: Point[] = [];
      for (let i = 0; i <= 30; i++) {
        const angle = Math.PI * 2 * (i / 30) + Math.PI / 2;
        points.push({
          x: cx + (scale / 3) * Math.cos(angle) + variation() * 0.3,
          y: cy + (scale / 3) * Math.sin(angle) + variation() * 0.3,
        });
      }
      // Arrow head
      points.push({ x: cx - scale / 4, y: cy - scale / 3 + variation() * 0.3 });
      return points;
    }

    case "loop-cw": {
      const points: Point[] = [];
      for (let i = 0; i <= 30; i++) {
        const angle = -Math.PI * 2 * (i / 30) + Math.PI / 2;
        points.push({
          x: cx + (scale / 3) * Math.cos(angle) + variation() * 0.3,
          y: cy + (scale / 3) * Math.sin(angle) + variation() * 0.3,
        });
      }
      points.push({ x: cx + scale / 4, y: cy - scale / 3 + variation() * 0.3 });
      return points;
    }

    case "equals": {
      const points: Point[] = [];
      // Top line
      for (let i = 0; i <= 8; i++) {
        points.push({
          x: cx - scale / 2 + (i / 8) * scale + variation() * 0.2,
          y: cy - scale / 6 + variation() * 0.2,
        });
      }
      // Bottom line
      for (let i = 0; i <= 8; i++) {
        points.push({
          x: cx - scale / 2 + (i / 8) * scale + variation() * 0.2,
          y: cy + scale / 6 + variation() * 0.2,
        });
      }
      return points;
    }

    case "wave": {
      const points: Point[] = [];
      for (let i = 0; i <= 25; i++) {
        const t = i / 25;
        points.push({
          x: cx - scale / 2 + t * scale + variation() * 0.2,
          y: cy + Math.sin(t * Math.PI * 3) * (scale / 6) + variation() * 0.2,
        });
      }
      return points;
    }

    default:
      return [{ x: cx, y: cy }];
  }
}

export class MLGestureRecognizer {
  private model: tf.Sequential | null = null;
  private isTraining = false;
  private isReady = false;

  constructor() {
    // Don't auto-initialize - call init() explicitly
  }

  async init(): Promise<void> {
    if (this.isReady || this.isTraining) return;

    console.log("Initializing ML gesture recognizer...");
    this.isTraining = true;

    try {
      // Create the model
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({
            inputShape: [INPUT_SIZE],
            units: 128,
            activation: "relu",
          }),
          tf.layers.dropout({ rate: 0.3 }),
          tf.layers.dense({ units: 64, activation: "relu" }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({
            units: GESTURE_CLASSES.length,
            activation: "softmax",
          }),
        ],
      });

      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
      });

      // Generate training data
      const allExamples: number[][] = [];
      const allLabels: number[][] = [];

      for (let classIdx = 0; classIdx < GESTURE_CLASSES.length; classIdx++) {
        const gestureType = GESTURE_CLASSES[classIdx].name;
        const examples = generateTrainingExamples(gestureType, 100);

        for (const example of examples) {
          allExamples.push(example);
          const label = new Array(GESTURE_CLASSES.length).fill(0);
          label[classIdx] = 1;
          allLabels.push(label);
        }
      }

      // Shuffle
      const indices = Array.from({ length: allExamples.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      const shuffledExamples = indices.map((i) => allExamples[i]);
      const shuffledLabels = indices.map((i) => allLabels[i]);

      // Create tensors
      const xs = tf.tensor2d(shuffledExamples);
      const ys = tf.tensor2d(shuffledLabels);

      // Train
      console.log("Training ML model...");
      await this.model.fit(xs, ys, {
        epochs: 30,
        batchSize: 32,
        validationSplit: 0.2,
        verbose: 0,
      });

      // Cleanup
      xs.dispose();
      ys.dispose();

      this.isReady = true;
      console.log("ML gesture recognizer ready!");
    } catch (error) {
      console.error("Failed to initialize ML recognizer:", error);
    } finally {
      this.isTraining = false;
    }
  }

  recognize(points: Point[]): RecognitionResult | null {
    if (!this.isReady || !this.model || points.length < 5) {
      return null;
    }

    try {
      // Preprocess
      const resampled = resample(points, NUM_POINTS);
      const normalized = normalizePoints(resampled);

      // Predict
      const input = tf.tensor2d([normalized]);
      const prediction = this.model.predict(input) as tf.Tensor;
      const probabilities = prediction.dataSync();

      // Find best match
      let maxProb = 0;
      let maxIdx = 0;
      for (let i = 0; i < probabilities.length; i++) {
        if (probabilities[i] > maxProb) {
          maxProb = probabilities[i];
          maxIdx = i;
        }
      }

      // Cleanup
      input.dispose();
      prediction.dispose();

      // Only return if confident enough
      if (maxProb < 0.4) return null;

      const gesture = GESTURE_CLASSES[maxIdx];
      return {
        name: gesture.name,
        action: gesture.action,
        confidence: maxProb,
        description: gesture.description,
        method: "ml",
      };
    } catch (error) {
      console.error("ML recognition error:", error);
      return null;
    }
  }

  isInitialized(): boolean {
    return this.isReady;
  }

  // Allow training on user examples
  async learnFromExample(points: Point[], gestureName: string): Promise<void> {
    if (!this.model || !this.isReady) return;

    const classIdx = GESTURE_CLASSES.findIndex((g) => g.name === gestureName);
    if (classIdx === -1) return;

    const resampled = resample(points, NUM_POINTS);
    const normalized = normalizePoints(resampled);

    const xs = tf.tensor2d([normalized]);
    const label = new Array(GESTURE_CLASSES.length).fill(0);
    label[classIdx] = 1;
    const ys = tf.tensor2d([label]);

    await this.model.fit(xs, ys, { epochs: 5, verbose: 0 });

    xs.dispose();
    ys.dispose();
  }
}

// Singleton
export const mlRecognizer = new MLGestureRecognizer();
