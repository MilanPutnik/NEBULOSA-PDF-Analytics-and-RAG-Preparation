import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import type { ChatMessage } from '../types';
import { SendIcon } from './icons/SendIcon';
import { UserIcon } from './icons/UserIcon';
import { BrainIcon } from './icons/BrainIcon';

interface QueryInterfaceProps {
  conversation: ChatMessage[];
  isQuerying: boolean;
  onSubmit: (query: string) => void;
}

const QueryInterface: React.FC<QueryInterfaceProps> = ({ conversation, isQuerying, onSubmit }) => {
  const [query, setQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [conversation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isQuerying) {
      onSubmit(query);
      setQuery('');
    }
  };

  const renderMessage = (msg: ChatMessage, index: number) => {
    const isUser = msg.sender === 'user';
    const MessageIcon = isUser ? UserIcon : BrainIcon;
    const containerClasses = isUser ? 'justify-end' : 'justify-start';
    const bubbleClasses = isUser 
      ? 'bg-brand-accent text-brand-text' 
      : 'bg-brand-dark/60 text-brand-text';

    return (
      <div key={index} className={`flex items-end gap-3 w-full ${containerClasses}`}>
        {!isUser && <MessageIcon className="w-8 h-8 p-1 rounded-full bg-brand-light text-brand-dark flex-shrink-0" />}
        <div className={`max-w-xl p-3 rounded-lg shadow-md ${bubbleClasses}`}>
          {isUser ? (
            <p>{msg.text}</p>
          ) : (
            <div
              className="prose prose-sm prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) as string }}
            />
          )}
        </div>
        {isUser && <MessageIcon className="w-8 h-8 p-1 rounded-full bg-brand-gold text-brand-dark flex-shrink-0" />}
      </div>
    );
  };


  return (
    <div className="w-full my-6 border border-brand-light/50 rounded-lg bg-brand-dark/30 flex flex-col">
      <div className="flex-grow p-4 h-96 overflow-y-auto space-y-4">
        {conversation.map(renderMessage)}
        {isQuerying && (
          <div className="flex items-end gap-3 justify-start">
            <BrainIcon className="w-8 h-8 p-1 rounded-full bg-brand-light text-brand-dark flex-shrink-0" />
            <div className="p-3 rounded-lg bg-brand-dark/60 text-brand-text">
                <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-brand-light/50 flex items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Postavi pitanje o dokumentu..."
          disabled={isQuerying}
          className="flex-grow bg-brand-dark/80 border border-brand-light rounded-md px-4 py-2 text-brand-text placeholder-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all"
          aria-label="Query Input"
        />
        <button
          type="submit"
          disabled={isQuerying || !query.trim()}
          className="bg-brand-gold text-brand-dark p-2 rounded-md font-bold shadow-lg transform hover:scale-105 transition-transform duration-200 disabled:bg-brand-light disabled:text-brand-accent disabled:cursor-not-allowed disabled:transform-none"
          aria-label="Send Query"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default QueryInterface;
