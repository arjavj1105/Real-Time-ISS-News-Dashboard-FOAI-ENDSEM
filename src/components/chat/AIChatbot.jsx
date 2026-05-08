import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Trash2, Sparkles, ChevronRight } from 'lucide-react';
import { askAI } from '../../services/aiService';

const SUGGESTED_PROMPTS = [
  "What is the current velocity of the ISS?",
  "Where is the ISS right now?",
  "Who are the astronauts onboard?",
  "Give me the latest news on science."
];

export default function AIChatbot({ contextData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('nexus_chat_history');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Nexus Intelligence AI initialized. How can I assist you with the ISS or news data today?", isUser: false, time: new Date().toLocaleTimeString() }
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('nexus_chat_history', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async (textOverride) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      time: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage].slice(-30));
    setInput('');
    setIsTyping(true);

    try {
      const dashboardDataStr = `
        Current ISS Position: Lat ${contextData.issData?.latitude}, Lng ${contextData.issData?.longitude}
        ISS Velocity: ${contextData.issData?.velocity} km/h
        ISS Altitude: ${contextData.issData?.altitude} km
        Overhead: ${contextData.locationDetails?.display_name || 'Ocean/Uncharted'}
        Astronauts on ISS: ${contextData.astronauts.length} people
        Astronaut Names: ${contextData.astronauts.map(a => a.name).join(', ')}
        Latest News Headlines (${contextData.newsCategory}): 
        ${contextData.news.slice(0, 5).map((n, i) => `${i+1}. ${n.title}`).join('\n')}
      `;

      const response = await askAI(dashboardDataStr, messageText);
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        time: new Date().toLocaleTimeString()
      }].slice(-30));
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "System communication error. The intelligence core is currently offline.",
        isUser: false,
        time: new Date().toLocaleTimeString()
      }].slice(-30));
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    const initialMsg = [{ id: 1, text: "Nexus Intelligence AI initialized. History cleared.", isUser: false, time: new Date().toLocaleTimeString() }];
    setMessages(initialMsg);
    localStorage.removeItem('nexus_chat_history');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-4 sm:right-8 w-[400px] h-[600px] max-w-[calc(100vw-2rem)] z-[60] glass-panel flex flex-col shadow-2xl border-primary/30 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-gradient-to-r from-primary/20 to-blue-500/10 backdrop-blur-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-sm flex items-center gap-1 uppercase tracking-tight">
                    Nexus AI Core <Sparkles className="h-3 w-3 text-yellow-500" />
                  </div>
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Status: Operational</div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={clearChat} className="p-2 hover:bg-white/10 rounded-full text-muted-foreground transition-all" title="Clear History">
                  <Trash2 className="h-4 w-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-muted-foreground transition-all">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-white/5 dark:bg-black/5">
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.isUser ? 'bg-primary text-white rounded-br-none' : 'bg-card border border-border rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-muted-foreground mt-1.5 px-1 font-bold uppercase">{msg.time}</span>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="bg-card border border-border p-3 rounded-2xl rounded-bl-none flex space-x-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions & Input */}
            <div className="p-4 border-t border-border bg-card/80 backdrop-blur-md">
              {messages.length < 5 && !isTyping && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="text-[10px] bg-background/50 border border-border hover:border-primary/50 px-3 py-1.5 rounded-full text-muted-foreground hover:text-primary transition-all flex items-center gap-1 active:scale-95"
                    >
                      {prompt} <ChevronRight className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              )}
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Query intelligence core..."
                  className="flex-1 bg-background/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 bg-primary text-white rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 z-50 flex items-center justify-center group"
      >
        <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
        {isOpen ? <X className="h-6 w-6 relative z-10" /> : <MessageSquare className="h-6 w-6 relative z-10" />}
      </motion.button>
    </>
  );
}
