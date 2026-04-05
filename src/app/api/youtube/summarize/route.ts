import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractYouTubeAudioBase64 } from "@/lib/audio-engine";
import { streamGeminiDirect } from "@/lib/gemini-direct";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Improved Video ID extraction (Handles shorts, mobile, web, and embed)
    let videoId = "";
    try {
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      videoId = (match && match[7].length === 11) ? match[7] : "";
      
      if (!videoId && url.includes("/shorts/")) {
        videoId = url.split("/shorts/")[1].split(/[?&]/)[0];
      }
    } catch (e) {
      console.warn("Parsing Error:", e);
    }
    
    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL format." }, { status: 400 });
    }

    // 1. Fetch Transcript (Fastest Mode)
    let transcriptText = "";
    let useAudioFallback = false;

    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      transcriptText = transcript.map(t => t.text).join(" ");
    } catch (e: any) {
      console.warn("Transcript not found, attempting Neural Audio Extraction...");
      useAudioFallback = true;
    }

    // 2. Prepare Intelligence Response (Streaming)
    const modelNames = ["models/gemini-2.5-flash-lite", "models/gemini-2.0-flash-lite"];
    let streamingResponse: any = null;
    let lastError: any = null;

    const prompt = `Summarize the following YouTube video in a concise, structured way with key takeaways. ${useAudioFallback ? "(Analysis from Audio Signal)" : `Transcript: ${transcriptText}`}`;

    if (useAudioFallback) {
      try {
        console.log(`📡 Neural Check: Initiating Audio Handshake...`);
        const audioData = await extractYouTubeAudioBase64(url, 5); // Listen to first 5 minutes
        const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash-lite" });
        
        streamingResponse = await model.generateContentStream([
          "Summarize this YouTube video based on its audio content. Provide a structured report with key takeaways.",
          { inlineData: { data: audioData.data, mimeType: "audio/mp3" } }
        ]);
      } catch (audioError: any) {
        console.error("Audio Handshake Failed:", audioError);
        // If audio fallback fails, we can't do much more for this video
      }
    } else {
      // Standard Text Handshake with Fallback
      for (const modelName of modelNames) {
        try {
          const m = genAI.getGenerativeModel({ model: modelName });
          streamingResponse = await m.generateContentStream(prompt);
          if (streamingResponse) break;
        } catch (e: any) {
          lastError = e;
          console.warn(`Model ${modelName} failed, trying fallback...`);
        }
      }
    }

    // ULTIMATE FALLBACK: Direct Fetch to v1 Stable API (Bypass SDK Handshake)
    if (!streamingResponse) {
      try {
        console.log(`📡 Neural Direct Pivot: Bypassing SDK for v1 Stable Handshake...`);
        const directStream = await streamGeminiDirect(prompt);
        return new Response(directStream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "X-Sync-Mode": useAudioFallback ? "Audio" : "Transcript",
          },
        });
      } catch (directError: any) {
        console.error("Direct Pivot Failed:", directError);
        return NextResponse.json({ 
          error: `All intelligence engines are restricted: ${directError.message}` 
        }, { status: 503 });
      }
    }

    // Create a ReadableStream to pipe to the client
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamingResponse.stream) {
            const text = chunk.text();
            controller.enqueue(new TextEncoder().encode(text));
          }
        } catch (e) {
          console.error("Stream Error:", e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Sync-Mode": useAudioFallback ? "Audio" : "Transcript",
        "X-Transcript-Length": transcriptText.length.toString(),
      },
    });

  } catch (error: any) {
    console.error("YouTube Summarize API Error:", error);
    return NextResponse.json({ 
      error: error.message || "Summarization error occurred." 
    }, { status: 500 });
  }
}
