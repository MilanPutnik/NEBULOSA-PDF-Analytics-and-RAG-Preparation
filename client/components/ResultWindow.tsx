import React, { useState } from 'react';
import { marked } from 'marked';
import { DownloadIcon } from './icons/DownloadIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { CopyIcon } from './icons/CopyIcon';

interface ResultWindowProps {
  title: string;
  content: string;
  language: 'json' | 'markdown';
  fileName: string;
}

const ResultWindow: React.FC<ResultWindowProps> = ({ title, content, language, fileName }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copyStatus, setCopyStatus] = useState('Copy');
  const [isCopying, setIsCopying] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([content], { type: language === 'json' ? 'application/json' : 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (isCopying) return;
    setIsCopying(true);
    
    navigator.clipboard.writeText(content).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setCopyStatus('Failed!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    }).finally(() => {
      setIsCopying(false);
    });
  };

  return (
    <div className="border border-brand-light rounded-lg bg-brand-dark/50 overflow-hidden">
      <div
        className="flex justify-between items-center p-4 cursor-pointer bg-brand-light/20"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`result-content-${fileName}`}
      >
        <h3 className="font-mono text-lg font-semibold text-brand-text">{title}</h3>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            disabled={isCopying}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-brand-accent/80 text-brand-text font-semibold rounded-md hover:bg-brand-accent transition-colors disabled:opacity-50 disabled:cursor-wait"
            title={`Copy ${fileName}`}
          >
            <CopyIcon className="w-4 h-4" />
            {isCopying ? 'Copying...' : copyStatus}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-brand-gold text-brand-dark font-semibold rounded-md hover:opacity-80 transition-opacity"
            title={`Download ${fileName}`}
          >
            <DownloadIcon className="w-4 h-4" />
            Download
          </button>
          <ChevronDownIcon
            className={`w-6 h-6 text-brand-accent transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </div>
      {isExpanded && (
        <div id={`result-content-${fileName}`} className="max-h-96 overflow-auto bg-gray-900">
          {language === 'markdown' ? (
            <div
              className="prose prose-sm sm:prose-base prose-invert max-w-none p-4"
              dangerouslySetInnerHTML={{ __html: marked.parse(content) as string }}
            />
          ) : (
            <pre className="p-4 text-sm">
              <code className={`language-${language}`}>{content}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultWindow;
