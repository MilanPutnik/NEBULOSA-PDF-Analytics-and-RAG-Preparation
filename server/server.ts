// HIPNODRECE ujebane v3.0 - Globalna magija sa tipovima je prizivala ovu gamad i ubijala server. Uništeno. Sada imamo eksplicitan, oklopljen AppRequest tip. Nema više vudu sranja.
import 'dotenv/config';
// FIX: Changed to a default import of express to disambiguate types like Request and Response from global types.
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import crypto from 'crypto';
import { uploadFileToGemini, generateJsonData, generateMarkdownData, answerQuery, AppError } from './geminiService.js';
import { sseManager } from './sseManager.js';
import type { ProgressCallback } from './types.js';
import type { AppRequest } from './customTypes.js'; // Uvozimo naš oklop!
import process from 'process';

if (!process.env.GEMINI_API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY environment variable is not set.");
    process.exit(1);
}

const app = express();
app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      const err = new Error('INVALID_FILE_TYPE');
      cb(err);
    }
  },
});

const PORT = 5001;

// FIX: Used express.Request and express.Response for correct typing.
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/stream', sseManager.addClient.bind(sseManager));

// FIX: Used express.Response for correct typing.
app.post('/api/process', upload.single('pdfFile'), (req: AppRequest, res: express.Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const progressCallback: ProgressCallback = (message) => {
    sseManager.sendEvent({ type: 'progress', message });
    console.log(`[PROGRESS] ${message}`);
  };

  res.status(202).json({ message: 'Processing started.' });

  (async () => {
    try {
      const { buffer: fileBuffer, mimetype: mimeType } = req.file!;
      const sha256_hash = crypto.createHash('sha256').update(fileBuffer).digest('hex').toUpperCase();

      const uploadedFile = await uploadFileToGemini(fileBuffer, mimeType, progressCallback);
      const { jsonData, extractedMetadata } = await generateJsonData(uploadedFile, progressCallback);
      const finalMetadata = { ...extractedMetadata, sha256_hash };
      const markdownData = await generateMarkdownData(uploadedFile, jsonData, progressCallback);

      sseManager.sendEvent({
        type: 'result',
        payload: { jsonData, markdownData, metadata: finalMetadata, geminiFileName: uploadedFile.name }
      });
    } catch (err) {
      console.error('SERVER PROCESSING FAILED:', err);
      if (err instanceof AppError) {
          sseManager.sendEvent({ type: 'error', payload: { code: err.code, message: err.message, details: err.details } });
      } else {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
          sseManager.sendEvent({ type: 'error', payload: { code: 'PROCESSING_FAILED', message: "Obrada na serveru nije uspela.", details: errorMessage } });
      }
    }
  })();
});

// FIX: Used express.Request and express.Response for correct typing.
app.post('/api/query', async (req: express.Request, res: express.Response) => {
  const { query, geminiFileName } = req.body;
  if (!query || !geminiFileName) {
    return res.status(400).json({ error: 'Missing query or geminiFileName.' });
  }

  try {
    const answer = await answerQuery(query, geminiFileName);
    res.json({ answer });
  } catch (err)
 {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error.';
    console.error('QUERY FAILED:', err);
    res.status(500).json({ error: 'Failed to get answer from Gemini.', details: errorMessage });
  }
});

// FIX: Used express.Request, express.Response, and express.NextFunction for correct typing.
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!err) return next();

  console.error(`[ERROR HANDLER] Caught error:`, err);

  if (err.message === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      code: 'INVALID_FILE_TYPE',
      error: 'Unsupported file type',
      details: 'Only PDF files are allowed.',
    });
  }
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      code: `UPLOAD_ERROR_${err.code}`,
      error: 'Upload Error',
      details: err.message,
    });
  }

  return res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    error: 'Internal Server Error',
    details: 'An unexpected error occurred on the server.',
  });
});

app.listen(PORT, () => {
  console.log(`Server pokrenut na http://localhost:${PORT}`);
});