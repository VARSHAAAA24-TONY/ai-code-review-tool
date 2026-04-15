import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import serverless from 'serverless-http';
import { analyzeCodeWithAI } from './aiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Safety Check: API Key Validation
if (!process.env.GROQ_API_KEY) {
  console.error('[CRITICAL] Missing GROQ_API_KEY in environment variables.');
}

// Global Reliability Handlers
process.on('uncaughtException', (err) => {
  console.error('\x1b[31m%s\x1b[0m', '!!! CRITICAL UNCAUGHT EXCEPTION !!!');
  console.error(err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\x1b[31m%s\x1b[0m', '!!! UNHANDLED REJECTION !!!');
  console.error('Reason:', reason);
});

app.use(cors());
app.use(helmet());
app.use(express.json());

// Middleware for Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Root Route for Diagnostics
app.get('/', (req, res) => {
  res.send('AI_CODE_REVIEW_CORE_ACTIVE');
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    timestamp: new Date().toISOString(),
    version: '2.0.0-FORENSIC'
  });
});

// Main Analysis Route
app.post('/api/analyze', async (req, res) => {
  const { code, language } = req.body;

  if (!code || code.trim().length === 0) {
    return res.status(400).json({
      error: 'BUFFER_EMPTY',
      message: 'NO_SOURCE_DETECTED: A waiting code buffer is required for forensic audit.'
    });
  }

  if (!language) {
    return res.status(400).json({
      error: 'ARCH_UNDEFINED',
      message: 'LANGUAGE_NOT_SPECIFIED: Core must know the logic architecture to proceed.'
    });
  }

  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] AUDIT_REQUEST_RECEIVED: LANG=${language}, SIZE=${code.length}B`);

  try {
    const analysis = await analyzeCodeWithAI(code, language);
    analysis.code = code; // Attach the original code back to the result
    analysis.language = language;

    console.log(`[${timestamp}] AUDIT_COMPLETE: SCORE=${analysis.score}`);
    res.json(analysis);
  } catch (error) {
    console.error(`[${timestamp}] AUDIT_FAIL:`, error.message);
    res.status(500).json({ error: error.message || 'ENGINE_FAILURE: CORE_DESYNC' });
  }
});

// Admin Route - Analytics
app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalUsers: 142,
    totalReviews: 843,
    avgScore: 6.8,
    criticalBugs: 124
  });
});

// For local development
if (process.env.NODE_ENV !== 'production' && !process.env.NETLIFY) {
  app.listen(PORT, () => {
    console.clear();
    console.log('\x1b[31m%s\x1b[0m', '--------------------------------------------------');
    console.log('\x1b[31m%s\x1b[0m', '   MIDNIGHT_OIL_CORE - ARCHITECTURAL_AUDIT_V2     ');
    console.log('\x1b[31m%s\x1b[0m', '--------------------------------------------------');
    console.log(`SERVER_STATUS: ONLINE`);
    console.log(`UPLINK_PORT: ${PORT}`);
    console.log(`AI_CORE: GROQ_LLAMA_3_70B`);
    console.log('--------------------------------------------------');
  });
}

export const handler = serverless(app);
export default app;
