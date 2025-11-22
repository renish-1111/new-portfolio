import React, { useState, useRef, useEffect } from 'react';
import { Chat, GenerateContentResponse } from "@google/genai";
import { createChatSession } from '../services/geminiService';
import { ChatMessage, CursorContextType } from '../types';

interface AIChatProps {
    setCursorVariant: CursorContextType['setCursorVariant'];
}

const AIChat: React.FC<AIChatProps> = ({ setCursorVariant }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm Renish's AI assistant. Ask me anything about his projects, ML models, or skills!", timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  // Initialize chat session on mount
  useEffect(() => {
    try {
        chatSessionRef.current = createChatSession();
    } catch (e) {
        console.error("Failed to initialize chat session:", e);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = createChatSession();
      }
      
      const response: GenerateContentResponse = await chatSessionRef.current.sendMessage({ 
        message: userMsg.text 
      });
      
      const responseText = response.text || "I'm having trouble connecting. Please try again.";
      
      const modelMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Network error or API limit reached.", timestamp: new Date(), isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
        {/* Toggle Button */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg z-50 transition-transform hover:scale-110 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
        >
            {isOpen ? (
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ) : (
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            )}
        </button>

        {/* Chat Window */}
        {isOpen && (
            <div className="fixed bottom-20 right-4 md:bottom-28 md:right-8 w-[calc(100vw-2rem)] md:w-96 h-[60vh] md:h-[500px] bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 animate-fade-in-up ring-1 ring-white/5">
                {/* Header */}
                <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_10px_#EAB308]"></div>
                    <span className="font-bold text-white font-mono tracking-wide">RENISH AI</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div 
                                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
                                    msg.role === 'user' 
                                    ? 'bg-gradient-to-br from-yellow-600 to-orange-700 text-white rounded-br-none' 
                                    : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5 backdrop-blur-md'
                                } ${msg.isError ? 'border-red-500/50 text-red-200 bg-red-900/20' : ''}`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white/5 p-3 rounded-2xl rounded-bl-none border border-white/5">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-black/20">
                    <div className="relative group">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask me anything..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-5 pr-12 text-white text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                            onMouseEnter={() => setCursorVariant('text')}
                            onMouseLeave={() => setCursorVariant('default')}
                        />
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-yellow-500 hover:text-yellow-300 disabled:opacity-30 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        )}
    </>
  );
};

export default AIChat;