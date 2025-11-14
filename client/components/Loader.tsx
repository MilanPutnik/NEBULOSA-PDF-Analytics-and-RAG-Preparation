import React from 'react';

interface LoaderProps {
  message: string;
  isRetrying?: boolean; // New prop to indicate if retries are active
  onCancel?: () => void; // New prop for retry cancellation handler
}

const JusticeVisualizer: React.FC = () => {
    const bars = [
        { delay: '0s' },
        { delay: '0.1s' },
        { delay: '0.2s' },
        { delay: '0.3s' },
        { delay: '0.4s' },
    ];
    return (
        <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-6 text-brand-gold"
        >
            {bars.map((bar, index) => (
                <rect
                    key={index}
                    className="pulse-bar"
                    x={index * 16}
                    y="0"
                    width="8"
                    height="80"
                    fill="currentColor"
                    style={{ animationDelay: bar.delay }}
                />
            ))}
        </svg>
    );
};

const Loader: React.FC<LoaderProps> = ({ message, isRetrying, onCancel }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <JusticeVisualizer />
      <p className="text-lg font-semibold text-brand-text">{message}</p>
      <p className="text-sm text-brand-accent mt-2">Molimo ne osvežavajte stranicu.</p>
      {isRetrying && onCancel && (
        <button
          onClick={onCancel}
          className="mt-6 px-6 py-2 bg-red-700/80 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-med focus:ring-red-500 transition-colors duration-200"
        >
          Otkaži ponovni pokušaj
        </button>
      )}
    </div>
  );
};

export default Loader;