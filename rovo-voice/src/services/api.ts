/**
 * API Services for Claude Vision and OpenAI Whisper
 *
 * These functions handle the actual API calls to process:
 * 1. Audio transcription via OpenAI Whisper
 * 2. Image analysis via Claude Vision
 */

export interface TranscriptionResult {
  text: string;
  duration: number;
}

export interface VisionAnalysisResult {
  interpretation: string;
  identifiedElements: string[];
  suggestedActions: string[];
  rovoWillDo?: string;
}

export interface ProcessingResult {
  transcription: TranscriptionResult;
  visionAnalysis: VisionAnalysisResult;
  combinedInterpretation: string;
  rovoPrompt: string;
}

/**
 * Transcribe audio using OpenAI Whisper API
 */
export async function transcribeAudio(
  audioBlob: Blob,
  apiKey: string
): Promise<TranscriptionResult> {
  // Determine file extension from blob type
  let extension = "webm";
  if (audioBlob.type.includes("mp4")) extension = "mp4";
  else if (audioBlob.type.includes("ogg")) extension = "ogg";
  else if (audioBlob.type.includes("wav")) extension = "wav";

  console.log(
    `Sending audio to Whisper: ${audioBlob.size} bytes, type: ${audioBlob.type}, extension: ${extension}`
  );

  const formData = new FormData();
  formData.append("file", audioBlob, `recording.${extension}`);
  formData.append("model", "whisper-1");
  formData.append("response_format", "verbose_json"); // Get more details

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Whisper API error response:", errorText);
    throw new Error(
      `Whisper API error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  console.log("Whisper API response:", data);

  return {
    text: data.text,
    duration: data.duration || 0,
  };
}

/**
 * Analyze images with gestures using Claude Vision API
 */
export async function analyzeImagesWithClaude(
  images: string[], // base64 encoded images with gesture overlays
  transcription: string,
  pageContext: string,
  apiKey: string
): Promise<VisionAnalysisResult> {
  const imageContents = images.map((img) => ({
    type: "image" as const,
    source: {
      type: "base64" as const,
      media_type: "image/jpeg" as const,
      data: img.replace(/^data:image\/\w+;base64,/, ""),
    },
  }));

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            ...imageContents,
            {
              type: "text",
              text: `You are Rovo, Atlassian's AI assistant. You're analyzing screenshots from a Confluence page with user gesture overlays (red lines/circles showing where the user pointed).

Page being edited: "${pageContext}"

User's spoken instructions: "${transcription}"

Analyze the gestures and speech to understand EXACTLY what the user wants changed. Then provide a concrete action plan that you (Rovo) will now execute.

Respond in JSON format:
{
  "interpretation": "One sentence summary of what the user wants",
  "identifiedElements": ["Specific UI elements/text the user highlighted"],
  "suggestedActions": ["Concrete action 1 - be specific", "Concrete action 2"],
  "rovoWillDo": "A confident first-person statement of what you're about to do, e.g. 'I'll update the project status from IN PROGRESS to COMPLETE and add the Q1 milestones you mentioned to the timeline.'"
}`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  const content = data.content[0].text;

  try {
    // Try to parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // If JSON parsing fails, create a structured response
  }

  return {
    interpretation: content,
    identifiedElements: [],
    suggestedActions: [],
  };
}

/**
 * Process complete recording with both APIs
 */
export async function processRecording(
  audioBlob: Blob,
  images: string[],
  pageContext: string,
  config: { claudeApiKey: string; openaiApiKey: string }
): Promise<ProcessingResult> {
  // Run transcription and vision analysis in parallel
  const [transcription, visionAnalysis] = await Promise.all([
    transcribeAudio(audioBlob, config.openaiApiKey),
    // If we have images, analyze them; otherwise use just the transcription
    images.length > 0
      ? analyzeImagesWithClaude(images, "", pageContext, config.claudeApiKey)
      : Promise.resolve({
          interpretation: "No visual gestures captured",
          identifiedElements: [],
          suggestedActions: [],
        }),
  ]);

  // If we have both transcription and images, do a combined analysis
  let combinedInterpretation = "";
  let rovoPrompt = "";

  if (images.length > 0 && transcription.text) {
    // Re-analyze with the transcription for better context
    const fullAnalysis = await analyzeImagesWithClaude(
      images,
      transcription.text,
      pageContext,
      config.claudeApiKey
    );

    combinedInterpretation = fullAnalysis.interpretation;
    rovoPrompt = generateRovoPrompt(transcription.text, fullAnalysis);
  } else {
    combinedInterpretation =
      transcription.text || visionAnalysis.interpretation;
    rovoPrompt = generateRovoPrompt(transcription.text, visionAnalysis);
  }

  return {
    transcription,
    visionAnalysis,
    combinedInterpretation,
    rovoPrompt,
  };
}

/**
 * Generate a prompt that Rovo can use to apply changes
 */
function generateRovoPrompt(
  transcription: string,
  analysis: VisionAnalysisResult
): string {
  const actions =
    analysis.suggestedActions.length > 0
      ? analysis.suggestedActions.map((a, i) => `${i + 1}. ${a}`).join("\n")
      : "No specific actions identified";

  return `## User Intent
${analysis.interpretation}

## What the user said
"${transcription}"

## Elements referenced
${analysis.identifiedElements.join(", ") || "None specifically identified"}

## Suggested Actions
${actions}

---
Please proceed with implementing these changes to the Confluence page.`;
}

/**
 * Store API keys in localStorage (for demo purposes)
 * In production, you'd want proper secret management
 */
export function getStoredApiKeys(): {
  claudeApiKey: string;
  openaiApiKey: string;
} {
  return {
    claudeApiKey: localStorage.getItem("CLAUDE_API_KEY") || "",
    openaiApiKey: localStorage.getItem("OPENAI_API_KEY") || "",
  };
}

export function setStoredApiKeys(keys: {
  claudeApiKey?: string;
  openaiApiKey?: string;
}) {
  if (keys.claudeApiKey) {
    localStorage.setItem("CLAUDE_API_KEY", keys.claudeApiKey);
  }
  if (keys.openaiApiKey) {
    localStorage.setItem("OPENAI_API_KEY", keys.openaiApiKey);
  }
}

// Page/Whiteboard content types for applying changes
export interface PageSection {
  id: string;
  title: string;
  content: string;
}

export interface PageTableRow {
  label: string;
  value: string;
}

export interface PageContentData {
  sections: PageSection[];
  tableRows: PageTableRow[];
  status: string;
}

export interface StickyNoteData {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  author: string;
}

export interface ContentChanges {
  pageContent?: Partial<PageContentData>;
  whiteboardNotes?: StickyNoteData[];
  addNotes?: StickyNoteData[];
  removeNoteIds?: string[];
}

/**
 * Use Claude to generate actual content changes based on user intent
 */
export async function applyChangesWithClaude(
  userIntent: string,
  suggestedActions: string[],
  currentPageContent: PageContentData,
  currentWhiteboardNotes: StickyNoteData[],
  pageType: 'page' | 'whiteboard',
  apiKey: string
): Promise<ContentChanges> {
  const prompt = pageType === 'page' 
    ? `You are Rovo, applying changes to a Confluence page based on user instructions.

User wants to: ${userIntent}

Suggested actions:
${suggestedActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Current page content (JSON):
${JSON.stringify(currentPageContent, null, 2)}

Generate the MODIFIED content as JSON. Only include fields you're changing.
For status changes, valid values are: "IN PROGRESS", "COMPLETE", "BLOCKED", "NOT STARTED"

Respond with ONLY valid JSON in this format:
{
  "pageContent": {
    "sections": [...], // only if changing sections
    "tableRows": [...], // only if changing table rows  
    "status": "..." // only if changing status
  }
}`
    : `You are Rovo, applying changes to a Confluence whiteboard based on user instructions.

User wants to: ${userIntent}

Suggested actions:
${suggestedActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Current whiteboard notes (JSON):
${JSON.stringify(currentWhiteboardNotes, null, 2)}

Generate changes as JSON. You can:
- Add new notes (addNotes array)
- Remove notes (removeNoteIds array)
- Replace all notes (whiteboardNotes array)

Colors available: #FFEB3B (yellow), #4FC3F7 (blue), #81C784 (green), #CE93D8 (purple), #F48FB1 (pink)

Respond with ONLY valid JSON in this format:
{
  "addNotes": [{ "id": "unique-id", "x": 100, "y": 100, "text": "...", "color": "#FFEB3B", "author": "Rovo" }],
  "removeNoteIds": ["id1", "id2"]
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  const content = data.content[0].text;

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Failed to parse content changes:", e);
  }

  return {};
}
