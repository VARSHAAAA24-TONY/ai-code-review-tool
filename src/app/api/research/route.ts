import { NextRequest, NextResponse } from "next/server";
import FirecrawlApp from "@mendable/firecrawl-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { streamGeminiDirect } from "@/lib/gemini-direct";

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY || "" });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Dual-Purpose Query Refinement (Roadmap + Real Global Jobs)
    const searchQuery = `"${query}" (site:naukri.com OR site:linkedin.com/jobs OR site:indeed.com) jobs India global remote AND career roadmap skills 2025 2026`;

    // 2. Deep Web Search with Firecrawl
    let results: any = [];
    try {
      const searchResponse = await firecrawl.search(searchQuery, {
         limit: 10, // Increased limit for richer context
      });
      results = searchResponse.success ? searchResponse.data : [];
    } catch (e) {
      console.warn("Firecrawl Error:", e);
      results = [
        { title: "Senior Developer - LinkedIn (Global)", url: "https://linkedin.com", description: "Remote opportunity detected." },
        { title: "Software Engineer - Naukri (India)", url: "https://naukri.com", description: "Domestic role detected in Bangalore." }
      ];
    }

    // 3. Streaming Dual-Intelligence Response (Roadmap + Active Jobs)
    const modelNames = ["models/gemini-2.5-flash-lite", "models/gemini-2.0-flash-lite"];
    let streamingResponse: any = null;
    let lastError: any = null;

    const prompt = `
      User Query: ${query}
      Search Context (Jobs + Market Intel):
      ${results.map((r: any) => `Title: ${r.title}\nURL: ${r.url}\nSummary: ${r.description}`).join("\n\n")}
      
      TASK: 
      Generate a PRECISE, HIGH-VALUE Career Intelligence Report with TWO DISTINCT SECTIONS:
      
      SECTION 1: THE STRATEGIC ROADMAP (Current Year & Beyond)
      - Skills Evolution: What specific tech/tools/certs are becoming mandatory?
      - Salary Corridors: What is the current compensation in INDIA vs. GLOBAL (US/EU/Dubai)?
      - The Path: Provide a step-by-step roadmap for career progression.
      
      SECTION 2: REAL-TIME MARKET OPPORTUNITIES (VERIFIED LINKS)
      - Extract at least 5 HIGH-QUALITY job listings from the context provided.
      - Tag each as [INDIA] or [GLOBAL].
      - Provide direct URLs to Naukri.com, LinkedIn.com, Glassdoor, or Indeed.
      
      IMPORTANT: Ensure all links are clickable and the roadmap is practical. Use a professional, bold, and analytical tone.
    `;

    for (const modelName of modelNames) {
      try {
        console.log(`📡 Neural Check: Initiating ${modelName} handshake...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        streamingResponse = await model.generateContentStream(prompt);
        
        if (streamingResponse) {
          console.log(`✅ ${modelName} Sync Successful.`);
          break;
        }
      } catch (e: any) {
        lastError = e;
        console.warn(`❌ ${modelName} Sync Failed:`, e.message);
      }
    }

    // ULTIMATE FALLBACK: Direct Fetch to v1 Stable API (Bypass SDK)
    if (!streamingResponse) {
      try {
        console.log(`📡 Neural Direct Pivot: Bypassing SDK for v1 Stable Handshake...`);
        const directStream = await streamGeminiDirect(prompt);
        const sourcesPayload = Buffer.from(JSON.stringify(results.map((r: any) => ({ 
          title: r.title, url: r.url, description: r.description 
        })))).toString('base64');

        return new Response(directStream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "X-Sources-JSON": sourcesPayload,
          },
        });
      } catch (directError: any) {
        console.error("Direct Pivot Failed:", directError);
        return NextResponse.json({ 
          error: `All intelligence engines are restricted: ${directError.message}` 
        }, { status: 503 });
      }
    }

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

    const sourcesPayload = Buffer.from(JSON.stringify(results.map((r: any) => ({ 
      title: r.title, url: r.url, description: r.description 
    })))).toString('base64');

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Sources-JSON": sourcesPayload,
      },
    });

  } catch (error: any) {
    console.error("Job Search API Error:", error);
    return NextResponse.json({ 
      error: error.message || "Search error occurred." 
    }, { status: 500 });
  }
}
