import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { text, action } = await req.json();

    if (!text || !action) {
      return NextResponse.json({ error: "Text and Action are required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "";
    if (action === "refine") {
      prompt = `Refine the following text to make it more professional, fix grammar, and improve clarity. Maintain the original meaning. Only return the refined text:\n\n${text}`;
    } else if (action === "bulletize") {
      prompt = `Transform the following text into a clear, structured list of bullet points. Use standard Markdown bullet markers (-). Only return the bulleted list:\n\n${text}`;
    } else if (action === "expand") {
      prompt = `Continue writing based on the following text. Maintain the same tone and context. Add 2-3 meaningful sentences:\n\n${text}`;
    }

    const streamingResponse = await model.generateContentStream(prompt);

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of streamingResponse.stream) {
          const chunkText = chunk.text();
          controller.enqueue(new TextEncoder().encode(chunkText));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error: any) {
    console.error("Assistant API Error:", error);
    return new Response("AI Handshake Failed.", { status: 500 });
  }
}
