"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X, Send, Bot, Loader2, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Message = {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
};

export default function AIConcierge() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome-1",
            text: "안녕하세요. SNPE 엔지니어링 솔루션에 대해 궁금한 점이 있으신가요?",
            sender: "ai",
            timestamp: new Date(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: "user",
            timestamp: new Date(),
        };

        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInputValue("");
        setIsTyping(true);

        try {
            // Prepare messages for API (exclude Welcome message if needed, or include all)
            // Map to {role, content} format
            const apiMessages = newMessages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: data.reply || "죄송합니다. 일시적인 오류가 발생했습니다.",
                sender: "ai",
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "죄송합니다. 네트워크 연결 상태를 확인해 주세요.",
                sender: "ai",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleQuickQuestion = async (question: string) => {
        const userMsg: Message = {
            id: Date.now().toString(),
            text: question,
            sender: "user",
            timestamp: new Date(),
        };

        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setIsTyping(true);

        try {
            const apiMessages = newMessages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages }),
            });

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: data.reply,
                sender: "ai",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "죄송합니다. 잠시 후 다시 시도해 주세요.",
                sender: "ai",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-20 right-0 w-[350px] sm:w-[380px] bg-slate-900/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-900/50 to-slate-900/50 p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
                                    <Bot size={18} className="text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-white text-sm font-bold">SNPE AI Assistant</div>
                                    <div className="text-green-400 text-[10px] flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                        Online
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors p-1"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="h-[400px] p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700 bg-slate-950/50">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center border mt-1 ${msg.sender === "ai"
                                        ? "bg-blue-500/20 border-blue-400/30"
                                        : "bg-slate-700/50 border-slate-600"
                                        }`}>
                                        {msg.sender === "ai" ? <Bot size={16} className="text-blue-400" /> : <User size={16} className="text-slate-300" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm max-w-[80%] leading-relaxed ${msg.sender === "ai"
                                        ? "bg-slate-800/80 border border-white/5 text-slate-200 rounded-tl-sm"
                                        : "bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-900/20"
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex shrink-0 items-center justify-center border border-blue-400/30 mt-1">
                                        <Bot size={16} className="text-blue-400" />
                                    </div>
                                    <div className="bg-slate-800/80 p-4 rounded-2xl rounded-tl-sm border border-white/5 flex gap-1 items-center">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                                    </div>
                                </motion.div>
                            )}

                            {/* Suggested Questions (Only show if last message was from AI and not typing) */}
                            {!isTyping && messages[messages.length - 1].sender === "ai" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="pl-11 space-y-2"
                                >
                                    {[
                                        "🤔 공정 시뮬레이션은 어떻게 하나요?",
                                        "💰 ROI(투자 대비 효과) 계산해보기",
                                        "📞 기술 리포트 요청하기",
                                        "📍 본사 위치가 어디인가요?"
                                    ].map((q, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleQuickQuestion(q)}
                                            className="block text-left text-xs text-blue-300 hover:text-white hover:bg-blue-600/20 px-3 py-2 rounded-lg border border-blue-500/20 transition-all active:scale-[0.98]"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-slate-900/80 shrink-0">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="무엇이든 물어보세요..."
                                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:bg-slate-800 transition-all placeholder:text-slate-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/30"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300 border border-white/10 ${isOpen ? "bg-slate-800 text-white rotate-90" : "bg-blue-600 text-white hover:bg-blue-500"}`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>

            {/* Ping Animation when closed */}
            {!isOpen && messages.length === 1 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3 pointer-events-none">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
            )}
        </div>
    );
}
