"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { Terminal, Shield, Zap, Lightbulb, User } from "lucide-react";

export interface AgentMessage {
    id: string;
    agent: "Planner" | "Optimizer" | "Guard";
    text: string;
    type: "info" | "warn" | "success";
}

interface AgentTerminalProps {
    messages: AgentMessage[];
}

export default function AgentTerminal({ messages }: AgentTerminalProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const getAgentIcon = (agent: string) => {
        switch (agent) {
            case "Planner": return <Lightbulb size={14} className="text-yellow-400" />;
            case "Optimizer": return <Zap size={14} className="text-blue-400" />;
            case "Guard": return <Shield size={14} className="text-green-400" />;
            default: return <User size={14} />;
        }
    };

    return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden flex flex-col h-full shadow-2xl">
            {/* Header */}
            <div className="h-8 bg-slate-950 border-b border-slate-800 flex items-center px-3 justify-between">
                <div className="flex items-center gap-2">
                    <Terminal size={12} className="text-slate-300" />
                    <span className="text-[11px] font-bold text-slate-200 uppercase tracking-widest">Multi-Agent Intelligence Hub</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                </div>
            </div>

            {/* Message Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 font-mono scrollbar-none">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-1"
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-1 rounded bg-slate-800 border border-slate-700">
                                    {getAgentIcon(msg.agent)}
                                </div>
                                <span className={`text-[11px] font-black uppercase ${msg.agent === "Planner" ? "text-yellow-500" :
                                    msg.agent === "Optimizer" ? "text-blue-500" : "text-green-500"
                                    }`}>
                                    {msg.agent}
                                </span>
                            </div>
                            <div className={`text-[13px] pl-7 leading-relaxed ${msg.type === "warn" ? "text-red-400" :
                                msg.type === "success" ? "text-cyan-400" : "text-slate-300"
                                }`}>
                                <span className="text-slate-600 mr-2 opacity-50">&gt;</span>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {messages.length === 0 && (
                    <div className="h-full flex items-center justify-center text-slate-600 text-[10px] italic">
                        Awaiting neural signal...
                    </div>
                )}
            </div>
        </div>
    );
}
