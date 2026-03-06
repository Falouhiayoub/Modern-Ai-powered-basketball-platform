import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { aiService } from '@/services/aiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hi! I'm Atlas Bot. Ask me anything about the team, our players, or upcoming matches!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessageText = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Convert current messages to AI history format
      const history = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'model' as const,
        parts: msg.text,
      }));

      const aiResponse = await aiService.generateChatResponse(userMessageText, history);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-accent rounded-full shadow-2xl shadow-accent/40 flex items-center justify-center text-zinc-50 hover:scale-110 active:scale-95 transition-all duration-300 group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-8 h-8" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-8 h-8 group-hover:animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 100, scale: 0.9, rotate: 2 }}
            className="fixed bottom-28 right-8 z-50 w-[400px] h-[600px] max-w-[calc(100vw-4rem)] max-h-[calc(100vh-12rem)] bg-zinc-900 border border-zinc-800 rounded-3xl shadow-3xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase italic tracking-widest text-zinc-50">Atlas AI Bot</h3>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Always Active</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMessages([messages[0]])}
                className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    'flex items-end space-x-3 max-w-[85%]',
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                    msg.sender === 'bot' ? "bg-accent/10 border border-accent/20" : "bg-zinc-800 border border-zinc-700"
                  )}>
                    {msg.sender === 'bot' ? <Bot className="w-4 h-4 text-accent" /> : <User className="w-4 h-4 text-zinc-400" />}
                  </div>
                  <div className={cn(
                    'p-4 rounded-2xl text-sm leading-relaxed font-medium shadow-sm',
                    msg.sender === 'user'
                      ? 'bg-accent text-zinc-50 rounded-br-none'
                      : 'bg-zinc-800/50 text-zinc-200 border border-zinc-800 rounded-bl-none'
                  )}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
                    <Bot className="w-4 h-4 text-accent animate-bounce" />
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-800 rounded-bl-none">
                    <Loader2 className="w-4 h-4 text-accent animate-spin" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-zinc-950 border-t border-zinc-800">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about team stats..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-6 pr-14 text-sm font-medium focus:border-accent focus:outline-none transition-colors placeholder:text-zinc-600 text-zinc-50"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={loading}
                  className="absolute right-2 h-10 w-10 bg-accent text-zinc-50 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/30"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
