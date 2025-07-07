'use client';

import { useState, useRef, useEffect } from 'react';
import { z } from 'zod';
import { MCPClient } from '@/lib/mcpClient';
// DOMPurify will be loaded dynamically on client-side

// Input validation schema
const ChatInputSchema = z.object({
  message: z
    .string()
    .min(1, { message: 'Message cannot be empty' })
    .max(500, { message: 'Message cannot exceed 500 characters' })
    .trim()
    .refine(
      (val) => val.length > 0 && val.trim().length > 0,
      { message: 'Message cannot be only whitespace' }
    ),
});

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 10,
  windowMs: 60000, // 1 minute
};

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ValidationError {
  message?: string[];
}

export default function AIChatComponent() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'გამარჯობა! მე ვარ თქვენი AI ასისტენტი. როგორ შემიძლია დაგეხმაროთ იდეალური ქონების მოძებნაში? შეგიძლიათ მკითხოთ ქონების ძებნის, იპოთეკის გაანგარიშების ან ბაზრის ინფორმაციის შესახებ.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError>({});
  const [rateLimitCount, setRateLimitCount] = useState(0);
  const [rateLimitResetTime, setRateLimitResetTime] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mcpClient = useRef<MCPClient>(new MCPClient());

  // Rate limiting check
  const checkRateLimit = (): boolean => {
    const now = Date.now();
    
    // Reset rate limit if window has passed
    if (rateLimitResetTime && now > rateLimitResetTime) {
      setRateLimitCount(0);
      setRateLimitResetTime(null);
    }
    
    // Check if rate limit exceeded
    if (rateLimitCount >= RATE_LIMIT.maxRequests) {
      const timeLeft = rateLimitResetTime ? Math.ceil((rateLimitResetTime - now) / 1000) : 0;
      setError(`Rate limit exceeded. Please wait ${timeLeft} seconds before sending another message.`);
      return false;
    }
    
    return true;
  };

  // Input sanitization function (client-side only)
  const sanitizeInput = (input: string): string => {
    // Basic sanitization without DOMPurify for server-side compatibility
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/[&"']/g, '') // Remove potentially dangerous characters
      .trim();
  };

  // Validate input
  const validateInput = (input: string): { isValid: boolean; errors: ValidationError } => {
    const result = ChatInputSchema.safeParse({ message: input });
    
    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.flatten().fieldErrors,
      };
    }
    
    return { isValid: true, errors: {} };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    setValidationErrors({});
    
    // Check rate limiting
    if (!checkRateLimit()) {
      return;
    }
    
    // Sanitize input
    const sanitizedInput = sanitizeInput(input);
    
    // Validate input
    const validation = validateInput(sanitizedInput);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    
    // Update rate limiting
    if (rateLimitCount === 0) {
      setRateLimitResetTime(Date.now() + RATE_LIMIT.windowMs);
    }
    setRateLimitCount(prev => prev + 1);
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: sanitizedInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Process the query using MCP client
      const response = await mcpClient.current.processAIChatQuery(sanitizedInput);
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('შეცდომა მოხდა. გთხოვთ სცადოთ მოგვიანებით.');
      
      // Fallback response
      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'ვიღაცა შეცდომა მოხდა. გთხოვთ კონკრეტულად მითხრათ რა გინდათ: ქონების ძებნა, იპოთეკის გაანგარიშება, თუ ბაზრის ინფორმაცია?',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Immediate length check for user feedback
    if (value.length <= 500) {
      setInput(value);
      // Clear validation errors when user starts typing
      if (validationErrors.message) {
        setValidationErrors({});
      }
      if (error) {
        setError(null);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Open AI Chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-80 h-96 flex flex-col border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-2 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-orange-500 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-orange-500 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {isClient && (
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg rounded-bl-none">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">Typing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Error Messages */}
          {error && (
            <div className="mx-4 mb-2 p-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-300 text-xs">
              {error}
            </div>
          )}
          
          {/* Validation Errors */}
          {validationErrors.message && (
            <div className="mx-4 mb-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded text-yellow-700 dark:text-yellow-300 text-xs">
              {validationErrors.message.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
          
          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about properties..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm placeholder-gray-500 dark:placeholder-gray-400"
                  disabled={isLoading}
                  maxLength={500}
                  aria-label="Chat message input"
                />
                <div className="absolute bottom-1 right-2 text-xs text-gray-400 dark:text-gray-500">
                  {input.length}/500
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim() || rateLimitCount >= RATE_LIMIT.maxRequests}
                className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </form>
            
            {/* Rate Limit Info */}
            {rateLimitCount > 5 && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                {RATE_LIMIT.maxRequests - rateLimitCount} messages remaining
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 