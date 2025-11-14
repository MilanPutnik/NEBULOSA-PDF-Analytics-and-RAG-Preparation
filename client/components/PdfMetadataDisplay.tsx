import React, { useState } from 'react';
import type { FinalMetadata } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { InfoIcon } from './icons/InfoIcon';

interface PdfMetadataDisplayProps {
  metadata: FinalMetadata;
}

const MetadataRow: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => {
    if (value === undefined || value === null || value === '') return null;

    return (
        <div className="flex justify-between items-start text-sm py-1">
            <span className="font-semibold text-brand-accent flex-shrink-0 mr-4">{label}:</span>
            <span className="text-right text-brand-text break-all">{String(value)}</span>
        </div>
    );
}

const PdfMetadataDisplay: React.FC<PdfMetadataDisplayProps> = ({ metadata }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="w-full max-w-3xl mx-auto border border-brand-light/50 rounded-lg bg-brand-dark/30 overflow-hidden mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center p-3 bg-brand-light/20 hover:bg-brand-light/30 transition-colors duration-200"
        aria-expanded={isExpanded}
        aria-controls="metadata-content"
      >
        <div className="flex items-center gap-3">
            <InfoIcon className="w-5 h-5 text-brand-gold"/>
            <h3 className="font-semibold text-brand-text">Document Metadata</h3>
        </div>
        <ChevronDownIcon
          className={`w-6 h-6 text-brand-accent transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
      {isExpanded && (
        <div id="metadata-content" className="p-4 bg-brand-dark/50 border-t border-brand-light/50">
            <MetadataRow label="Title" value={metadata.title} />
            <MetadataRow label="Document Type" value={metadata.document_type} />
            <MetadataRow label="Page Count" value={metadata.page_count} />
            <MetadataRow label="SHA256 Hash" value={metadata.sha256_hash} />
        </div>
      )}
    </div>
  );
};

export default PdfMetadataDisplay;