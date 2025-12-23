import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  Mic,
  MicOff,
  Square,
  Send,
  Plus,
  MoreHorizontal,
  ExternalLink,
  Camera,
  Settings,
} from "lucide-react";
import type { CurrentPage } from "../App";
import { RovoIcon } from "./RovoIcon";
import {
  getStoredApiKeys,
  transcribeAudio,
  analyzeImagesWithClaude,
  applyChangesWithClaude,
  type VisionAnalysisResult,
  type PageContentData,
  type StickyNoteData,
  type ContentChanges,
} from "../services/api";
import styles from "./RovoChat.module.css";

interface GesturePoint {
  x: number;
  y: number;
  timestamp: number;
}

interface GestureCapture {
  screenshot: string; // base64
  gesturePath: GesturePoint[];
  startTime: number;
  endTime: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  gestureCaptures?: GestureCapture[];
}

interface RovoChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: CurrentPage;
  onOpenSettings?: () => void;
  pageContent: PageContentData;
  whiteboardNotes: StickyNoteData[];
  onApplyChanges: (changes: ContentChanges) => void;
}

export function RovoChat({
  isOpen,
  onClose,
  currentPage,
  onOpenSettings,
  pageContent,
  whiteboardNotes,
  onApplyChanges,
}: RovoChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm Rovo, your AI assistant. I can help you understand and work with your Confluence content. You can also use voice + gestures to show me what you're working on!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isCapturingGesture, setIsCapturingGesture] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [gestureCaptures, setGestureCaptures] = useState<GestureCapture[]>([]);
  const [currentGesturePath, setCurrentGesturePath] = useState<GesturePoint[]>(
    []
  );
  const [processingState, setProcessingState] = useState<
    "idle" | "processing" | "done"
  >("idle");
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);
  const gestureStartTimeRef = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Prevent spacebar from scrolling the page (always active)
  useEffect(() => {
    const preventSpaceScroll = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        const target = e.target as HTMLElement;
        const tagName = target.tagName.toLowerCase();
        const isEditable = target.isContentEditable;
        const isInput =
          tagName === "input" || tagName === "textarea" || tagName === "select";

        // Allow spacebar in editable fields, prevent elsewhere (stops page scroll)
        if (!isInput && !isEditable) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", preventSpaceScroll);
    return () => window.removeEventListener("keydown", preventSpaceScroll);
  }, []);

  // Handle space key for gesture capture
  useEffect(() => {
    if (!isRecording) return;

    const handleKeyDown = async (e: KeyboardEvent) => {
      // Always prevent spacebar from scrolling during recording
      if (e.code === "Space") {
        e.preventDefault();
        // Only start capture on initial press (not repeat) and not already capturing
        if (!e.repeat && !isCapturingGesture) {
          await startGestureCapture();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (isCapturingGesture) {
          endGestureCapture();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isRecording, isCapturingGesture]);

  // Track mouse movement during gesture capture
  useEffect(() => {
    if (!isCapturingGesture) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCurrentGesturePath((prev) => [
        ...prev,
        { x: e.clientX, y: e.clientY, timestamp: Date.now() },
      ]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isCapturingGesture]);

  const startRecording = async () => {
    try {
      // Request microphone access with specific constraints for better quality
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      audioStreamRef.current = audioStream;
      console.log(
        "Audio stream obtained:",
        audioStream.getAudioTracks()[0].label
      );

      // Request screen capture
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      } as DisplayMediaStreamOptions);

      screenStreamRef.current = screenStream;

      // Create hidden video element for capturing frames
      const video = document.createElement("video");
      video.srcObject = screenStream;
      video.muted = true;
      await video.play();
      videoRef.current = video;

      // Set up audio recording - try to use a format Whisper handles well
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      console.log("Using audio MIME type:", mimeType);

      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(audioStream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        console.log(
          "Audio chunk received, size:",
          e.data.size,
          "type:",
          e.data.type
        );
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onerror = (e) => {
        console.error("MediaRecorder error:", e);
      };

      mediaRecorder.start(500); // Collect data every 500ms
      console.log("MediaRecorder started, state:", mediaRecorder.state);

      setIsRecording(true);
      setRecordingDuration(0);
      setGestureCaptures([]);

      // Update duration counter
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);

      // Handle screen share stop
      screenStream.getVideoTracks()[0].onended = () => {
        stopRecording();
      };
    } catch (err) {
      console.error("Failed to start recording:", err);
      alert(
        "Failed to start recording. Please ensure you grant microphone and screen sharing permissions."
      );
    }
  };

  const startGestureCapture = async () => {
    if (!videoRef.current || !screenStreamRef.current) return;

    setIsCapturingGesture(true);
    gestureStartTimeRef.current = Date.now();
    setCurrentGesturePath([]);

    // Capture screenshot from video stream
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const screenshot = canvas.toDataURL("image/jpeg", 0.8);

      // Store the screenshot, we'll add the gesture path when space is released
      setGestureCaptures((prev) => [
        ...prev,
        {
          screenshot,
          gesturePath: [], // Will be filled when gesture ends
          startTime: gestureStartTimeRef.current,
          endTime: 0,
        },
      ]);
    }
  };

  const endGestureCapture = () => {
    setIsCapturingGesture(false);
    const endTime = Date.now();

    // Update the last capture with the gesture path
    setGestureCaptures((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          gesturePath: currentGesturePath,
          endTime,
        };
      }
      return updated;
    });

    setCurrentGesturePath([]);
  };

  const stopRecording = async () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }

    setIsRecording(false);
    setIsCapturingGesture(false);
    setProcessingState("processing");

    // Wait for MediaRecorder to finish and collect final data
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      await new Promise<void>((resolve) => {
        const recorder = mediaRecorderRef.current!;

        recorder.onstop = () => {
          console.log(
            "MediaRecorder stopped, total chunks:",
            audioChunksRef.current.length
          );
          resolve();
        };

        // Request final data before stopping
        recorder.requestData();
        recorder.stop();
        console.log("Requested MediaRecorder stop");
      });
    }

    // Stop all audio tracks
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => {
        console.log("Stopping audio track:", track.label);
        track.stop();
      });
    }

    // Stop screen stream
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Process the recording
    await processRecording();
  };

  const processRecording = async () => {
    console.log("Audio chunks count:", audioChunksRef.current.length);
    console.log(
      "Audio chunks sizes:",
      audioChunksRef.current.map((c) => c.size)
    );

    // Use the same MIME type that was used for recording
    const mimeType = audioChunksRef.current[0]?.type || "audio/webm";
    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

    // Create playable audio URL for preview
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioPreviewUrl(audioUrl);
    console.log("Audio blob size:", audioBlob.size, "bytes");
    console.log("Audio blob type:", audioBlob.type);
    console.log("Audio preview URL created:", audioUrl);

    // Create composite images with gesture overlays
    const compositeImages = await Promise.all(
      gestureCaptures.map(async (capture) => {
        return await createGestureOverlay(capture);
      })
    );

    // Check if we have API keys configured
    const apiKeys = getStoredApiKeys();
    const hasOpenAIKey =
      apiKeys.openaiApiKey && apiKeys.openaiApiKey.length > 10;
    const hasClaudeKey =
      apiKeys.claudeApiKey && apiKeys.claudeApiKey.length > 10;

    if (hasOpenAIKey || hasClaudeKey) {
      // Use real APIs
      await processWithRealAPIs(audioBlob, compositeImages, apiKeys);
    } else {
      // Fall back to simulation
      console.log("No API keys configured - using simulated response");
      await simulateAIProcessing(audioBlob, compositeImages);
    }
  };

  // Helper to add a new message
  const addMessage = (content: string, role: "user" | "assistant" = "assistant"): string => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const message: ChatMessage = {
      id,
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    return id;
  };

  // Helper to update an existing message
  const updateMessage = (id: string, content: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, content } : msg))
    );
  };

  const processWithRealAPIs = async (
    audioBlob: Blob,
    images: string[],
    apiKeys: { openaiApiKey: string; claudeApiKey: string }
  ) => {
    const gestureCount = gestureCaptures.length;
    let transcriptionText = "";
    let visionAnalysis: VisionAnalysisResult | null = null;

    // Add user message showing what was captured
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: `[Voice recording: ${recordingDuration}s] + [${gestureCount} gesture capture${
        gestureCount !== 1 ? "s" : ""
      }]`,
      timestamp: new Date(),
      gestureCaptures: gestureCaptures,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Small delay for visual effect
    await new Promise(r => setTimeout(r, 300));

    try {
      // STEP 1: Transcribe audio
      let statusMsgId = "";
      if (apiKeys.openaiApiKey && apiKeys.openaiApiKey.length > 10) {
        statusMsgId = addMessage("🎤 **Transcribing your voice...**\n\n_Processing audio with Whisper..._");
        
        console.log("Calling Whisper API for transcription...");
        const transcription = await transcribeAudio(
          audioBlob,
          apiKeys.openaiApiKey
        );
        transcriptionText = transcription.text;
        console.log("Transcription:", transcriptionText);

        // Update with transcription result
        updateMessage(statusMsgId, `🎤 **What you said:**\n\n"${transcriptionText}"`);
        await new Promise(r => setTimeout(r, 500));
      }

      // STEP 2: Analyze gestures with Claude Vision
      if (
        apiKeys.claudeApiKey &&
        apiKeys.claudeApiKey.length > 10 &&
        images.length > 0
      ) {
        const visionMsgId = addMessage(`👁️ **Analyzing ${gestureCount} gesture${gestureCount !== 1 ? 's' : ''}...**\n\n_Understanding what you pointed at..._`);
        
        console.log("Calling Claude Vision API...");
        const analysis = await analyzeImagesWithClaude(
          images,
          transcriptionText,
          currentPage.title,
          apiKeys.claudeApiKey
        );
        visionAnalysis = analysis;
        console.log("Vision analysis:", analysis);

        // Update with understanding
        let visionContent = `👁️ **I understand what you want:**\n\n${analysis.interpretation}`;
        if (analysis.identifiedElements && analysis.identifiedElements.length > 0) {
          visionContent += `\n\n**Elements you highlighted:**\n${analysis.identifiedElements.map(e => `• ${e}`).join('\n')}`;
        }
        updateMessage(visionMsgId, visionContent);
        await new Promise(r => setTimeout(r, 500));
      }

      // STEP 3: Show what Rovo will do
      if (visionAnalysis) {
        const actionMsgId = addMessage(`🤖 **Here's what I'll do:**\n\n${visionAnalysis.suggestedActions?.map((a, i) => `${i + 1}. ${a}`).join('\n') || 'Apply the requested changes'}`);
        await new Promise(r => setTimeout(r, 800));

        // STEP 4: Apply changes
        if (apiKeys.claudeApiKey && apiKeys.claudeApiKey.length > 10) {
          updateMessage(actionMsgId, `🤖 **Applying changes...**\n\n_Updating the ${currentPage.type === 'page' ? 'page content' : 'whiteboard'}..._`);
          
          console.log("Applying changes with Claude...");
          try {
            const changes = await applyChangesWithClaude(
              visionAnalysis.interpretation,
              visionAnalysis.suggestedActions || [],
              pageContent,
              whiteboardNotes,
              currentPage.type,
              apiKeys.claudeApiKey
            );
            
            console.log("Content changes:", changes);
            
            // Apply the changes
            if (Object.keys(changes).length > 0) {
              onApplyChanges(changes);
              
              // Update message to show success
              const changesSummary = summarizeChanges(changes);
              updateMessage(actionMsgId, `✅ **Done! Changes applied:**\n\n${changesSummary}`);
            } else {
              updateMessage(actionMsgId, `✅ **Done!**\n\nNo changes needed - everything looks good.`);
            }
          } catch (applyError) {
            console.error("Error applying changes:", applyError);
            updateMessage(actionMsgId, `⚠️ **Understood your request, but couldn't apply changes automatically.**\n\nYou may need to make the changes manually.`);
          }
        }
      } else if (transcriptionText) {
        // No vision analysis, just transcription
        addMessage(`🤖 **I heard you, but I need you to point at something!**\n\nHold **spacebar** while recording to capture gestures so I know what to change.`);
      }
    } catch (error) {
      console.error("API Error:", error);
      addMessage(`❌ **Error processing your request:**\n\n${
        error instanceof Error ? error.message : "Unknown error"
      }\n\nPlease check your API keys in settings.`);
    }

    setProcessingState("done");
    setTimeout(() => setProcessingState("idle"), 500);
  };

  const formatAPIResponse = (
    transcription: string,
    analysis: VisionAnalysisResult | null,
    gestureCount: number
  ): string => {
    let response = "**I analyzed your recording:**\n\n";

    if (transcription) {
      response += `**What you said:**\n"${transcription}"\n\n`;
    }

    if (analysis) {
      response += `**My interpretation:**\n${analysis.interpretation}\n\n`;
      
      if (analysis.identifiedElements && analysis.identifiedElements.length > 0) {
        response += `**Elements you highlighted:**\n${analysis.identifiedElements.map(e => `• ${e}`).join('\n')}\n\n`;
      }
      
      if (analysis.suggestedActions && analysis.suggestedActions.length > 0) {
        response += `**Actions I'll take:**\n${analysis.suggestedActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\n`;
      }
    }

    response += "---\n\n**🤖 Rovo is executing...**\n\n";
    
    if (analysis?.rovoWillDo) {
      response += `${analysis.rovoWillDo}`;
    } else {
      response += "Applying your requested changes to the page...";
    }

    return response;
  };

  const summarizeChanges = (changes: ContentChanges): string => {
    const summaryItems: string[] = [];
    
    if (changes.pageContent) {
      if (changes.pageContent.status) {
        summaryItems.push(`• Status changed to **${changes.pageContent.status}**`);
      }
      if (changes.pageContent.sections) {
        summaryItems.push(`• Updated ${changes.pageContent.sections.length} section(s)`);
      }
      if (changes.pageContent.tableRows) {
        summaryItems.push(`• Updated table rows`);
      }
    }
    
    if (changes.addNotes && changes.addNotes.length > 0) {
      summaryItems.push(`• Added ${changes.addNotes.length} new sticky note(s)`);
    }
    
    if (changes.removeNoteIds && changes.removeNoteIds.length > 0) {
      summaryItems.push(`• Removed ${changes.removeNoteIds.length} sticky note(s)`);
    }
    
    if (changes.whiteboardNotes) {
      summaryItems.push(`• Updated whiteboard notes`);
    }
    
    return summaryItems.length > 0 
      ? summaryItems.join('\n') 
      : 'Changes applied to the page.';
  };

  const createGestureOverlay = async (
    capture: GestureCapture
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Draw the screenshot
          ctx.drawImage(img, 0, 0);

          // Draw the gesture path
          if (capture.gesturePath.length > 1) {
            ctx.strokeStyle = "#FF5630";
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.shadowColor = "rgba(255, 86, 48, 0.5)";
            ctx.shadowBlur = 8;

            ctx.beginPath();
            ctx.moveTo(capture.gesturePath[0].x, capture.gesturePath[0].y);

            for (let i = 1; i < capture.gesturePath.length; i++) {
              ctx.lineTo(capture.gesturePath[i].x, capture.gesturePath[i].y);
            }
            ctx.stroke();

            // Draw start and end points
            const start = capture.gesturePath[0];
            const end = capture.gesturePath[capture.gesturePath.length - 1];

            ctx.fillStyle = "#36B37E";
            ctx.beginPath();
            ctx.arc(start.x, start.y, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#FF5630";
            ctx.beginPath();
            ctx.arc(end.x, end.y, 8, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = capture.screenshot;
    });
  };

  const simulateAIProcessing = async (_audioBlob: Blob, _images: string[]) => {
    const gestureCount = gestureCaptures.length;

    // Add the "user message" showing what was captured
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: `[Voice recording: ${recordingDuration}s] + [${gestureCount} gesture capture${
        gestureCount !== 1 ? "s" : ""
      }]`,
      timestamp: new Date(),
      gestureCaptures: gestureCaptures,
    };
    setMessages((prev) => [...prev, userMessage]);
    
    await new Promise(r => setTimeout(r, 300));

    // STEP 1: Simulated transcription
    const transcribeMsgId = addMessage("🎤 **Transcribing your voice...**\n\n_Processing audio with Whisper..._");
    await new Promise(r => setTimeout(r, 1200));
    
    const mockTranscription = currentPage.type === 'page' 
      ? "Change the status to complete and update the due dates"
      : "Add a new sticky note about the action items from today's meeting";
    updateMessage(transcribeMsgId, `🎤 **What you said:**\n\n"${mockTranscription}"`);
    await new Promise(r => setTimeout(r, 500));

    // STEP 2: Simulated gesture analysis
    if (gestureCount > 0) {
      const visionMsgId = addMessage(`👁️ **Analyzing ${gestureCount} gesture${gestureCount !== 1 ? 's' : ''}...**\n\n_Understanding what you pointed at..._`);
      await new Promise(r => setTimeout(r, 1500));
      
      const mockInterpretation = currentPage.type === 'page'
        ? "You want to update the project status and timeline"
        : "You want to add new notes to the whiteboard";
      const mockElements = currentPage.type === 'page'
        ? ["Status badge showing 'IN PROGRESS'", "Due Date field in the table"]
        : ["The sticky notes area", "The pink notes section"];
      
      updateMessage(visionMsgId, `👁️ **I understand what you want:**\n\n${mockInterpretation}\n\n**Elements you highlighted:**\n${mockElements.map(e => `• ${e}`).join('\n')}`);
      await new Promise(r => setTimeout(r, 500));

      // STEP 3: Show what Rovo will do
      const mockActions = currentPage.type === 'page'
        ? ["Change status from 'IN PROGRESS' to 'COMPLETE'", "Update the due dates to reflect completion"]
        : ["Add a new sticky note with action items", "Position it in an empty area of the board"];
      
      const actionMsgId = addMessage(`🤖 **Here's what I'll do:**\n\n${mockActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}`);
      await new Promise(r => setTimeout(r, 800));

      // STEP 4: Apply simulated changes
      updateMessage(actionMsgId, `🤖 **Applying changes...**\n\n_Updating the ${currentPage.type === 'page' ? 'page content' : 'whiteboard'}..._`);
      await new Promise(r => setTimeout(r, 1000));

      // Actually apply mock changes
      if (currentPage.type === 'page') {
        onApplyChanges({
          pageContent: { status: 'COMPLETE' }
        });
        updateMessage(actionMsgId, `✅ **Done! Changes applied:**\n\n• Status changed to **COMPLETE**`);
      } else {
        const newNote = {
          id: Date.now().toString(),
          x: 100 + Math.random() * 300,
          y: 350,
          text: "Action items from today's meeting",
          color: '#4FC3F7',
          author: 'Rovo'
        };
        onApplyChanges({ addNotes: [newNote] });
        updateMessage(actionMsgId, `✅ **Done! Changes applied:**\n\n• Added 1 new sticky note`);
      }
    } else {
      addMessage(`🤖 **I heard you, but I need you to point at something!**\n\nHold **spacebar** while recording to capture gestures so I know what to change.`);
    }

    setProcessingState("done");
    setTimeout(() => setProcessingState("idle"), 500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Simulate response
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I understand you're asking about "${inputValue}". Let me help you with that in the context of **${currentPage.title}**.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.sidebar}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.rovoLogo}>
                <RovoIcon size={18} />
              </div>
              <span className={styles.headerTitle}>Chat</span>
              <ChevronDown size={16} />
            </div>
            <div className={styles.headerRight}>
              <button
                className={styles.headerBtn}
                onClick={onOpenSettings}
                title="API Settings"
              >
                <Settings size={16} />
              </button>
              <button className={styles.headerBtn}>
                <ExternalLink size={16} />
              </button>
              <button className={styles.headerBtn} onClick={onClose}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Context Badge */}
          <div className={styles.contextBar}>
            <span className={styles.contextLabel}>Context</span>
            <div className={styles.contextBadge}>
              <span className={styles.contextIcon}>📄</span>
              <span className={styles.contextTitle}>{currentPage.title}</span>
            </div>
          </div>

          {/* Messages */}
          <div className={styles.messages}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${styles[msg.role]}`}
              >
                {msg.role === "assistant" && (
                  <div className={styles.assistantAvatar}>
                    <RovoIcon size={16} />
                  </div>
                )}
                <div className={styles.messageContent}>
                  {msg.gestureCaptures && msg.gestureCaptures.length > 0 && (
                    <div className={styles.capturePreview}>
                      {msg.gestureCaptures.slice(0, 2).map((capture, i) => (
                        <div key={i} className={styles.captureThumbnail}>
                          <Camera size={16} />
                          <span>Capture {i + 1}</span>
                        </div>
                      ))}
                      {msg.gestureCaptures.length > 2 && (
                        <span className={styles.moreCaptures}>
                          +{msg.gestureCaptures.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                  <div
                    className={styles.messageText}
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/_(.*?)_/g, "<em>$1</em>")
                        .replace(/\n/g, "<br/>"),
                    }}
                  />
                </div>
              </div>
            ))}

            {processingState === "processing" && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.assistantAvatar}>
                  <RovoIcon size={16} />
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.processingIndicator}>
                    <div className={styles.processingDot} />
                    <div className={styles.processingDot} />
                    <div className={styles.processingDot} />
                    <span>Analyzing your voice & gestures...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Audio Preview */}
          {audioPreviewUrl && (
            <div className={styles.audioPreview}>
              <span className={styles.audioPreviewLabel}>
                🎧 Audio Preview:
              </span>
              <audio
                controls
                src={audioPreviewUrl}
                className={styles.audioPlayer}
              />
              <button
                className={styles.clearAudioBtn}
                onClick={() => {
                  URL.revokeObjectURL(audioPreviewUrl);
                  setAudioPreviewUrl(null);
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Recording UI */}
          {isRecording && (
            <div className={styles.recordingBar}>
              <div className={styles.recordingIndicator}>
                <div className={styles.recordingPulse} />
                <span className={styles.recordingTime}>
                  {formatDuration(recordingDuration)}
                </span>
              </div>
              <div className={styles.recordingHint}>
                {isCapturingGesture ? (
                  <span className={styles.capturingHint}>
                    <Camera size={14} />
                    Capturing gesture... release Space when done
                  </span>
                ) : (
                  <span>
                    Hold <kbd>Space</kbd> to capture screen + gesture
                  </span>
                )}
              </div>
              <button className={styles.stopBtn} onClick={stopRecording}>
                <Square size={14} />
                Stop
              </button>
            </div>
          )}

          {/* Gesture overlay when capturing */}
          {isCapturingGesture && (
            <div className={styles.gestureOverlay}>
              <svg className={styles.gestureSvg}>
                {currentGesturePath.length > 1 && (
                  <path
                    d={`M ${currentGesturePath
                      .map((p) => `${p.x} ${p.y}`)
                      .join(" L ")}`}
                    stroke="#FF5630"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </div>
          )}

          {/* Input Area */}
          <div className={styles.inputArea}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                placeholder="Write a prompt, @mention someone, or use / for actions"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isRecording}
              />
            </div>
            <div className={styles.inputActions}>
              <button className={styles.inputBtn}>
                <Plus size={18} />
              </button>
              <button
                className={`${styles.inputBtn} ${styles.micBtn} ${
                  isRecording ? styles.recording : ""
                }`}
                onClick={isRecording ? stopRecording : startRecording}
                title={
                  isRecording
                    ? "Stop recording"
                    : "Start voice + gesture recording"
                }
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button className={styles.inputBtn}>
                <MoreHorizontal size={18} />
              </button>
              <button
                className={styles.sendBtn}
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isRecording}
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <span className={styles.footerText}>Content quality may vary</span>
            <span className={styles.footerBrand}>
              Powered by Rovo
              <RovoIcon size={14} withBackground />
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
