"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Loader2, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
}

export function AIChatBox({ tripContext }: { tripContext: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hi! I see your itinerary is ready. Do you have any follow-up questions about packing, local customs, or specific places?",
    },
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = query.trim();
    setQuery("");
    
    // Add user message to state immediately
    const newMessages: Message[] = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Format history exactly how the gemini SDK expects it for multi-turn chat 
      // Important: We slice(1, -1) to remove the initial "model" welcome message, 
      // because Gemini requires the first message in the conversation to be from the "user".
      const historyPayload = newMessages.slice(1, -1).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: historyPayload,
          context: tripContext
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed response");
      }
      
      setMessages((prev) => [...prev, { role: "model", text: data.text }]);
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "model", text: error.message || "Oops, something went wrong connecting to the AI. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl shadow-blue-900/40 hover:scale-110 active:scale-95 transition-all group"
          >
            <Bot className="w-7 h-7" />
            <Sparkles className="w-4 h-4 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-yellow-300" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-[400px] h-[600px] max-h-[80vh] flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Trip Assistant</h3>
                  <p className="text-blue-100 text-xs font-medium">Powered by Gemini AI</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-zinc-50 dark:bg-zinc-950/50">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`
                      max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm
                      ${msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-br-sm" 
                        : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-bl-sm"
                      }
                    `}
                  >
                    {/* Note: In a real app we'd use react-markdown here like we did for the old itinerary, 
                        but raw text is ok if the AI formats neatly right now. */}
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl rounded-bl-sm flex items-center gap-2 text-zinc-500 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-xs font-medium">Assistant is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] z-10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full pl-5 pr-14 py-4 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-white rounded-full outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-sm placeholder:text-zinc-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  className="absolute right-2 p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
