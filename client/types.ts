export type AppStep = 'checking' | 'offline' | 'upload' | 'processing' | 'results' | 'error';

export type AppError = {
  code?: string;
  message: string;
  details: string;
} | null;

export interface GeminiOutput {
  jsonData: string;
  markdownData: string;
  geminiFileName: string;
}

// This represents the final, combined metadata that the client will receive and display.
export interface FinalMetadata {
  title: string;
  document_type: string;
  page_count: number;
  sha256_hash: string;
}

export type ChatMessage = {
  sender: 'user' | 'ai';
  text: string;
};
