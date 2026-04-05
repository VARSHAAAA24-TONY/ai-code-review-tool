const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy to get access
    // The SDK might not have a direct listModels, but we can try to find the list
    console.log("Attempting to list models...");
    
    // Using fetch directly as a fallback if SDK list is obscure
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("AVAILABLE MODELS:");
      data.models.forEach(m => {
        console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(", ")})`);
      });
    } else {
      console.log("No models found or error:", data);
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
