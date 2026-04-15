import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const analyzeCodeWithAI = async (code, language = 'javascript') => {
  const prompt = `
    PERSONA: You are 'THE_SWISS_CONSOLE_CORE', a precision-engineered architectural intelligence. 
    VIBE: Mid-century modern, logical, high-contrast, and technically exhaustive.
    TASK: Perform a deep forensic audit on the provided ${language.toUpperCase()} source logic.
    
    EXPECTED_OUTPUT: Return ONLY a valid JSON object. No markdown, no pre-amble.
    
    JSON_SCHEMA:
    {
      "score": number (0.0 to 10.0),
      "bugs": [{"severity": "low"|"medium"|"high", "message": "precise technical fault description", "line": number}],
      "improvements": [{"title": "Optimization Schematic Title", "before": "legacy code block", "after": "stabilized code block"}],
      "documentation": "A professional technical abstract focusing on architecture.",
      "language": "${language}"
    }

    SOURCE_LOGIC_TO_AUDIT:
    ${code}
  `;

  try {
    console.log(`[AI_CORE] DISPATCHING_${language.toUpperCase()}_AUDIT_REQUEST...`);
    
    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      response_format: { type: "json_object" } 
    }).finally(() => clearTimeout(timeoutId));

    const text = response.choices[0].message.content;
    
    if (!text) {
      throw new Error('EMPTY_AI_PAYLOAD');
    }

    // Robust parsing
    let data;
    try {
      data = JSON.parse(text.trim());
    } catch (parseError) {
      // Fallback: try to extract JSON with regex if parsing fails
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('PARSE_FAILURE: INVALID_PROTOCOL');
      }
    }
    
    // Safety defaults
    data.score = data.score || 0;
    data.bugs = data.bugs || [];
    data.improvements = data.improvements || [];
    data.documentation = data.documentation || "NO_ABSTRACT_GENERATED";
    data.language = language;
    
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('TIMEOUT: CORE_RESPONSE_DELAYED');
    }
    console.error('\x1b[31m%s\x1b[0m', '!!! AI_CORE_DESYNC_ERROR !!!');
    console.error('ERROR_MSG:', error.message);
    throw new Error(`AUDIT_FAULT: ${error.message || 'ENGINE_DESYNC'}`);
  }
};
