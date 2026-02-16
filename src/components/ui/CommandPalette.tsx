"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, ArrowRight, Sun, Moon, Monitor, Laptop, Server, Cpu } from "lucide-react";

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const commands = [
        { icon: <Monitor className="w-4 h-4" />, label: "Go to Hero", action: () => scrollTo("hero") },
        { icon: <Briefcase className="w-4 h-4" />, label: "View Services", action: () => scrollTo("services") },
        { icon: <Cpu className="w-4 h-4" />, label: "Open Simulator", action: () => scrollTo("simulation") },
        { icon: <Server className="w-4 h-4" />, label: "Success Records", action: () => scrollTo("expertise") },
        { icon: <Mail className="w-4 h-4" />, label: "Contact Support", action: () => scrollTo("contact") },
    ];

    const filteredCommands = commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
    );

    const scrollTo = (id: string) => {
        setIsOpen(false);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Input Area */}
                        <div className="flex items-center px-4 py-3 border-b border-white/10">
                            <Search className="w-5 h-5 text-slate-400 mr-3" />
                            <input
                                type="text"
                                placeholder="Type a command or search..."
                                className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm font-medium"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                            />
                            <div className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-white/5 font-mono">ESC</div>
                        </div>

                        {/* Command List */}
                        <div className="max-h-[300px] overflow-y-auto p-2">
                            {filteredCommands.length > 0 ? (
                                filteredCommands.map((cmd, idx) => (
                                    <button
                                        key={idx}
                                        onClick={cmd.action}
                                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-300 hover:bg-blue-600 hover:text-white rounded-lg group transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-500 group-hover:text-blue-200 transition-colors">{cmd.icon}</span>
                                            <span>{cmd.label}</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-8 text-center text-slate-500 text-xs">
                                    No commands found for "{query}"
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-950 border-t border-white/5 px-4 py-2 flex justify-between items-center text-[10px] text-slate-500">
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1"><Command className="w-3 h-3" /> Select</span>
                                <span className="flex items-center gap-1">↑↓ Navigate</span>
                            </div>
                            <div className="font-mono text-blue-500/50">SNPE OS v1.0</div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

import { Briefcase, Mail } from "lucide-react";
