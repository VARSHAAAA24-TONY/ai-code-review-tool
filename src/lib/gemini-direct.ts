/**
 * Pure Fetch implementation for Gemini to bypass SDK "Handshake" (404/503) issues. 
 * Connects directly to the stable v1 API.
 */
export async function streamGeminiDirect(prompt: string, model: string = "gemini-2.5-flash-lite") {
  const API_KEY = process.env.GEMINI_API_KEY;
  const ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/${model}:streamGenerateContent?alt=sse&key=${API_KEY}`;

  console.log(`[NeuralDirect] Initiating stable v1 Handshake with ${model}...`);

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || `Direct Handshake Failed: ${response.status}`);
  }

  return response.body; // Returns a ReadableStream of SSE events
}
