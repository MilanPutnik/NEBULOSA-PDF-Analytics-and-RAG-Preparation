import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { FileIcon } from './icons/FileIcon';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File) => void;
  onStart: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ file, onFileChange, onStart }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileChange(event.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-lg text-center p-8">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf"
        className="hidden"
      />
      <button
        onClick={handleButtonClick}
        className="w-full flex flex-col items-center justify-center px-6 py-12 border-2 border-dashed border-brand-light rounded-lg cursor-pointer hover:bg-brand-light/20 hover:border-brand-accent transition-colors duration-200"
      >
        <UploadIcon className="w-12 h-12 mb-4 text-brand-accent" />
        <span className="text-lg font-semibold text-brand-text">
          {file ? 'Change PDF Document' : 'Upload PDF Document'}
        </span>
        <span className="mt-1 text-sm text-brand-accent">
          Click here to select a file from your device
        </span>
      </button>

      {file && (
        <div className="mt-6 p-4 bg-brand-dark/50 border border-brand-light rounded-md flex items-center justify-center text-left animate-fade-in">
          <FileIcon className="w-6 h-6 mr-3 text-brand-gold flex-shrink-0" />
          <div className="overflow-hidden">
            <p className="font-semibold text-brand-text truncate" title={file.name}>
              {file.name}
            </p>
            <p className="text-sm text-brand-accent">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
      )}

      <button
        onClick={onStart}
        disabled={!file}
        className="mt-8 w-full px-8 py-3 bg-brand-gold text-brand-dark font-bold text-lg rounded-md shadow-lg transform hover:scale-105 transition-transform duration-200 disabled:bg-brand-light disabled:text-brand-accent disabled:cursor-not-allowed disabled:transform-none"
      >
        START ANALYSIS
      </button>
    </div>
  );
};

export default FileUpload;