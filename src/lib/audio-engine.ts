import ytdl from "@distube/ytdl-core";
import { Buffer } from "buffer";

/**
 * Extracts a high-quality audio stream from a YouTube video 
 * and returns it as a Base64 string for Gemini ingestion.
 * Focuses on the first 3-5 minutes to ensure serverless compatibility.
 */
export async function extractYouTubeAudioBase64(url: string, limitMinutes: number = 3): Promise<{ data: string, mimeType: string }> {
  try {
    console.log(`[AudioEngine] Investigating temporal stream: ${url}`);
    
    const audioStream = ytdl(url, {
      filter: "audioonly",
      quality: "lowestaudio", // Lower quality is better for small Base64 payloads
    });

    const chunks: Buffer[] = [];
    const limitBytes = limitMinutes * 60 * 8000; // Rough estimate for low quality audio

    return new Promise((resolve, reject) => {
      let totalBytes = 0;

      audioStream.on("data", (chunk: Buffer) => {
        totalBytes += chunk.length;
        chunks.push(chunk);
        
        // Stop if we exceed the limit to keep the payload clean
        if (totalBytes > limitBytes) {
          audioStream.destroy();
          finish();
        }
      });

      audioStream.on("end", () => finish());
      audioStream.on("error", (err) => reject(err));

      function finish() {
        const fullBuffer = Buffer.concat(chunks);
        const base64Data = fullBuffer.toString("base64");
        console.log(`[AudioEngine] Neural Signal Purified: ${fullBuffer.length} bytes extracted.`);
        resolve({
          data: base64Data,
          mimeType: "audio/mp3", // ytdl audioonly usually provides mp4/m4a/mp3 compatible data
        });
      }
    });
  } catch (error: any) {
    console.error("[AudioEngine] Signal Corrupted:", error);
    throw new Error(`Failed to extract audio signal: ${error.message}`);
  }
}
