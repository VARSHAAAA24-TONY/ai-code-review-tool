const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function testModel(modelName) {
  console.log(`Testing model: ${modelName}...`);
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Say 'hello'");
    const text = result.response.text();
    console.log(`✅ ${modelName} SUCCESS: ${text}`);
    return true;
  } catch (error) {
    console.error(`❌ ${modelName} FAILED: ${error.message}`);
    return false;
  }
}

async function runDiagnostic() {
  const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro", "gemini-1.0-pro"];
  for (const m of models) {
    await testModel(m);
  }
}

runDiagnostic();
