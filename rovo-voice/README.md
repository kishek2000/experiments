# Rovo Voice - Confluence Voice + Gesture Interface

A proof-of-concept for voice and gesture-based interaction with Confluence pages, using Claude Vision and OpenAI Whisper.

## Features

- **Confluence UI Spoof**: Faithful recreation of Confluence's design using Atlassian design tokens
- **Page Tree Navigation**: Dummy pages and whiteboard navigation
- **Rovo Chat Sidebar**: AI assistant panel with voice recording capability
- **Voice + Gesture Recording**:
  - Click the mic button to start recording
  - Hold **Space** to capture a screenshot and track cursor movements
  - Release Space when done with a gesture
  - Click Stop to end recording
  - The system collates screenshots with gesture overlays and processes them

## How the Recording Works

1. **Start Recording**: Click the mic button in Rovo chat
2. **Grant Permissions**: Allow microphone and screen sharing
3. **Capture Gestures**: While recording, hold Space to:
   - Take a screenshot of the current screen
   - Track your cursor movements (draw attention to elements)
   - Release Space to end that gesture capture
4. **Multiple Captures**: You can hold Space multiple times to capture different areas
5. **Stop Recording**: Click Stop to process everything
6. **AI Analysis**: 
   - Audio → OpenAI Whisper for transcription
   - Screenshots with gesture overlays → Claude Vision for interpretation
   - Combined interpretation generates a Rovo action prompt

## Technical Implementation

### Browser APIs Used
- `navigator.mediaDevices.getUserMedia()` - Microphone access
- `navigator.mediaDevices.getDisplayMedia()` - Screen capture
- `MediaRecorder` API - Audio recording
- Canvas API - Screenshot capture and gesture overlay rendering
- Mouse/Keyboard events - Gesture tracking

### External APIs
- **Claude Vision API** (Anthropic) - Analyzes screenshots with gesture overlays
- **OpenAI Whisper API** - Transcribes voice recordings

## Setup

```bash
# Install dependencies
yarn install

# Start dev server
yarn dev
```

## API Keys

Click the ⚙️ Settings icon in the Rovo chat header to configure API keys:
- **Claude API Key**: For vision analysis (get from console.anthropic.com)
- **OpenAI API Key**: For Whisper transcription (get from platform.openai.com)

Without API keys, the app uses simulated responses.

## Project Structure

```
src/
├── components/
│   ├── ConfluenceShell.tsx    # Main layout with header + sidebar
│   ├── PageTree.tsx           # Navigation tree
│   ├── PageContent.tsx        # Confluence page rendering
│   ├── Whiteboard.tsx         # Collaborative whiteboard
│   ├── RovoChat.tsx           # Rovo AI sidebar with voice recording
│   └── ApiKeyModal.tsx        # API key configuration
├── services/
│   └── api.ts                 # Claude Vision + Whisper API calls
├── App.tsx                    # Root component
└── index.css                  # Atlassian design tokens
```

## Demo Flow

1. Open the app (Rovo chat should be visible on the right)
2. Click the mic button to start recording
3. Share your screen when prompted
4. Speak about what you want to change on the page
5. Hold Space and move your cursor to highlight specific elements
6. Release Space, then click Stop
7. Watch Rovo analyze and suggest actions

## Notes

- This is a client-side-only prototype
- API keys are stored in localStorage (not production-safe)
- Screen sharing captures the entire display, not just the browser
- Works best in Chrome/Edge with full screen sharing permissions

