import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { AppStep, GeminiOutput, FinalMetadata, ChatMessage, AppError } from './types';

import FileUpload from './components/FileUpload';
import Loader from './components/Loader';
import ResultWindow from './components/ResultWindow';
import PdfMetadataDisplay from './components/PdfMetadataDisplay';
import QueryInterface from './components/QueryInterface';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
  const [error, setError] = useState<AppError>(null);
  
  const [step, setStep] = useState<AppStep>('upload');
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [file, setFile] = useState<File | null>(null);
  const [geminiResult, setGeminiResult] = useState<GeminiOutput | null>(null);
  const [pdfMetadata, setPdfMetadata] = useState<FinalMetadata | null>(null);
  const [loaderMessage, setLoaderMessage] = useState('');
  const eventSourceRef = useRef<EventSource | null>(null);

  const cancelRetryRef = useRef(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const [geminiFileName, setGeminiFileName] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);

  const checkServerHealth = useCallback(async () => {
    setServerStatus('checking');
    setError(null);
    try {
      const response = await fetch('http://localhost:5001/api/health');
      if (response.ok) {
        setServerStatus('online');
        setStep('upload');
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (err) {
      console.error('Server health check failed:', err);
      setServerStatus('offline');
      if (err instanceof TypeError) { // This is the most reliable way to catch network errors
        setError({
          code: 'SERVER_UNREACHABLE',
          message: 'Server Unreachable',
          details: 'Could not connect to the server. Please ensure the server is running and accessible at http://localhost:5001.',
        });
      } else {
        setError({
          code: 'SERVER_OFFLINE',
          message: 'Server Offline',
          details: (err as Error).message,
        });
      }
    }
  }, []);

  useEffect(() => {
    checkServerHealth();
  }, [checkServerHealth]);

  useEffect(() => {
    if (step !== 'processing' || serverStatus !== 'online' || eventSourceRef.current) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    const eventSource = new EventSource('http://localhost:5001/api/stream');
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'progress') {
        setLoaderMessage(data.message);
      } else if (data.type === 'result') {
        setGeminiResult(data.payload);
        setPdfMetadata(data.payload.metadata);
        setGeminiFileName(data.payload.geminiFileName);
        setStep('results');
        setConversation([{ sender: 'ai', text: "Analiza je završena. Sada možete postavljati pitanja o dokumentu." }]);
        eventSource.close();
      } else if (data.type === 'error') {
        setError(data.payload || { message: 'Unknown Server Error', details: 'The server sent an unstructed error.' });
        setStep('error');
        eventSource.close();
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      if (step === 'processing') {
         setError({ code: 'STREAM_CONNECTION_LOST', message: 'Konekcija izgubljena tokom obrade.', details: 'Proveri da li je server pokrenut ili je došlo do prekida mreže.' });
         setServerStatus('offline');
         setStep('upload'); // Go back to a neutral state
      }
      eventSource.close();
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [step, serverStatus]);

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleCancelRetry = useCallback(() => {
    cancelRetryRef.current = true;
  }, []);

  const handleStartProcessing = useCallback(async () => {
    if (!file) {
      setError({ message: 'Molimo odaberite PDF fajl.', details: 'Nije odabran nijedan fajl.' });
      return;
    }
    if (serverStatus !== 'online') {
      setError({ message: 'Server nije povezan.', details: 'Pokušajte ponovo da se povežete sa serverom.' });
      checkServerHealth();
      return;
    }

    setStep('processing');
    setError(null);
    cancelRetryRef.current = false;
    
    const formData = new FormData();
    formData.append('pdfFile', file);

    const MAX_RETRIES = 3;
    let lastError: AppError = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      if (cancelRetryRef.current) {
        setError({ message: 'Upload otkazan', details: 'Ponovni pokušaj je otkazan.' });
        setStep('upload');
        setIsRetrying(false);
        return;
      }

      try {
        if (attempt > 0) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          setIsRetrying(true);
          setLoaderMessage(`Konekcija neuspešna. Pokušavam ponovo za ${delay / 1000}s...`);
          await new Promise(res => setTimeout(res, delay));
        } else {
          setLoaderMessage('Povezivanje sa serverom i upload...');
        }
        setIsRetrying(attempt > 0);

        const response = await fetch('http://localhost:5001/api/process', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setLoaderMessage('Server je primio fajl...');
          setIsRetrying(false);
          return; // Success, SSE will handle the rest.
        }

        if (response.status >= 400 && response.status < 500) {
          const errData = await response.json();
          lastError = { code: errData.code || `HTTP_${response.status}`, message: errData.error || 'Greška u zahtevu', details: errData.details || 'Server je odbio fajl.' };
          break; 
        }

        lastError = { code: `HTTP_${response.status}`, message: `Greška servera: ${response.status}`, details: 'Server trenutno ne može da obradi zahtev.' };

      } catch (err) {
        if (err instanceof TypeError) { 
          lastError = { code: 'NETWORK_ERROR', message: 'Failed to fetch', details: 'Server is unreachable.' };
          setServerStatus('offline');
          setError(lastError);
          return; 
        }
        lastError = { message: 'Greška u slanju', details: (err as Error).message };
      }
    }
    
    if (lastError) {
      setError(lastError);
      setStep('error');
    }
    setIsRetrying(false);
  }, [file, serverStatus, checkServerHealth]);

  const handleQuerySubmit = useCallback(async (query: string) => {
    if (!query.trim() || !geminiFileName || serverStatus !== 'online') return;

    setIsQuerying(true);
    setConversation(prev => [...prev, { sender: 'user', text: query }]);

    try {
        const response = await fetch('http://localhost:5001/api/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, geminiFileName }),
        });
        
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.details || 'Upit na serveru nije uspeo.');
        }

        const result = await response.json();
        setConversation(prev => [...prev, { sender: 'ai', text: result.answer }]);

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Nepoznata greška upita.';
        setConversation(prev => [...prev, { sender: 'ai', text: `Došlo je do greške: ${errorMessage}` }]);
        if (err instanceof TypeError) {
           setServerStatus('offline');
           setError({ code: 'NETWORK_ERROR', message: 'Konekcija sa serverom je izgubljena.', details: errorMessage });
        }
    } finally {
        setIsQuerying(false);
    }
  }, [geminiFileName, serverStatus]);

  const handleReset = () => {
    setFile(null);
    setGeminiResult(null);
    setPdfMetadata(null);
    setError(null);
    setGeminiFileName(null);
    setConversation([]);
    setIsQuerying(false);
    checkServerHealth(); 
  };
  
  const handleRetry = () => {
      setError(null);
      handleStartProcessing();
  };

  const renderContent = () => {
    if (serverStatus === 'checking') {
      return <Loader message="Proveravam status servera..." />;
    }

    if (serverStatus === 'offline') {
      return (
        <div className="w-full text-center p-8">
          <h2 className="text-2xl font-semibold text-red-400 mb-4">Server Nedostupan</h2>
          {error && <p className="text-brand-accent mb-6">{error.message}: {error.details}</p>}
          <button onClick={checkServerHealth} className="px-8 py-3 bg-brand-gold text-brand-dark font-bold text-lg rounded-md">Pokušaj ponovo</button>
        </div>
      );
    }

    switch (step) {
      case 'upload':
        return <FileUpload file={file} onFileChange={handleFileChange} onStart={handleStartProcessing} />;
      
      case 'processing':
        return <Loader message={loaderMessage} isRetrying={isRetrying} onCancel={handleCancelRetry} />;

      case 'error':
        return <ErrorDisplay error={error!} onRetry={handleRetry} onReset={handleReset} />;

      case 'results':
        return geminiResult && (
          <div className="w-full animate-fade-in">
            {pdfMetadata && <PdfMetadataDisplay metadata={pdfMetadata} />}
            <QueryInterface conversation={conversation} isQuerying={isQuerying} onSubmit={handleQuerySubmit} />
            <div className="space-y-4 mt-6">
              <ResultWindow title="schema.json" content={geminiResult.jsonData} language="json" fileName="schema.json" />
              <ResultWindow title="data.md" content={geminiResult.markdownData} language="markdown" fileName="data.md" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark font-sans flex flex-col items-center p-4 sm:p-8">
      <header className="w-full max-w-5xl mb-8 text-center">
        <h1 className="font-bold text-brand-text tracking-wide">
          <span className="block text-4xl sm:text-5xl font-black tracking-widest text-brand-gold">∴NEBULOSA∵</span>
        </h1>
        <p className="mt-2 text-lg sm:text-xl text-brand-accent">PDF Analytics and RAG Preparation</p>
      </header>

      <main className="w-full max-w-5xl flex-grow flex flex-col items-center p-6 bg-brand-med rounded-lg shadow-2xl border border-brand-light">
        {renderContent()}
        
        {step === 'results' && serverStatus === 'online' && (
            <button onClick={handleReset} className="mt-8 px-6 py-2 bg-red-700/80 text-white font-semibold rounded-md hover:bg-red-600">RESET</button>
        )}
      </main>
      
      <footer className="w-full max-w-5xl mt-8 text-center text-sm text-brand-accent">
          <p>&copy; {new Date().getFullYear()} NEBULOSA PDF Analytics.</p>
      </footer>
    </div>
  );
};

export default App;
