import React from 'react';
import type { AppError } from '../types';
import { WarningIcon } from './icons/WarningIcon';

interface ErrorDisplayProps {
  error: AppError;
  onRetry: () => void;
  onReset: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry, onReset }) => {
    if (!error) return null;

    const getErrorInfo = () => {
        switch (error.code) {
            case 'GEMINI_SAFETY_BLOCK':
                return {
                    title: 'Analiza Blokirana',
                    description: 'Obrada dokumenta je zaustavljena zbog sigurnosnih filtera. Ovo se dešava ako dokument sadrži sadržaj koji je prepoznat kao osetljiv ili štetan.',
                    retryable: false,
                };
            case 'INVALID_FILE_TYPE':
                return {
                    title: 'Pogrešan Tip Fajla',
                    description: 'Molimo otpremite dokument u ispravnom PDF formatu.',
                    retryable: false,
                };
            case 'INVALID_API_KEY':
                 return {
                    title: 'Greška u Konfiguraciji Servera',
                    description: 'Došlo je do problema sa API ključem za Gemini. Molimo kontaktirajte administratora.',
                    retryable: false,
                 };
            case 'GEMINI_FILE_ERROR':
                return {
                    title: 'Greška pri Obradi Fajla',
                    description: 'Gemini serveri nisu uspeli da obrade otpremljeni fajl. Fajl je možda oštećen ili u nestandardnom formatu.',
                    retryable: true,
                };
            case 'NETWORK_ERROR':
            case 'SERVER_UNREACHABLE':
                 return {
                    title: 'Greška u Konekciji',
                    description: 'Nije moguće uspostaviti vezu sa serverom. Proverite vašu internet konekciju i da li je server pokrenut.',
                    retryable: true,
                 };
            default:
                return {
                    title: 'Došlo je do Greške',
                    description: 'Desila se neočekivana greška tokom obrade vašeg zahteva.',
                    retryable: true,
                };
        }
    };

    const { title, description, retryable } = getErrorInfo();

    return (
        <div className="w-full text-center p-8 animate-fade-in flex flex-col items-center">
            <WarningIcon className="w-16 h-16 text-red-400 mb-4" />
            <h2 className="text-2xl font-semibold text-red-400 mb-2">{title}</h2>
            <p className="text-brand-accent mb-6 max-w-md">{description}</p>
            
            <div className="w-full max-w-md mx-auto p-4 mb-4 text-red-300 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="font-semibold">{error.message}</p>
                <pre className="mt-2 pt-2 border-t border-red-400/50 text-xs text-left whitespace-pre-wrap font-mono">{error.details}</pre>
            </div>
            
            <div className="flex gap-4 mt-4">
                {retryable && (
                    <button 
                        onClick={onRetry} 
                        className="px-8 py-3 bg-brand-gold text-brand-dark font-bold text-lg rounded-md"
                    >
                        Pokušaj Ponovo
                    </button>
                )}
                <button 
                    onClick={onReset} 
                    className="px-6 py-2 bg-red-700/80 text-white font-semibold rounded-md hover:bg-red-600"
                >
                    RESET
                </button>
            </div>
        </div>
    );
};

export default ErrorDisplay;
