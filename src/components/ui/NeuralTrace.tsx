"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity, Zap, Brain, Code } from "lucide-react";

interface NeuralTraceProps {
    isActive: boolean;
    nodeLabel: string;
}

export default function NeuralTrace({ isActive, nodeLabel }: NeuralTraceProps) {
    const [weights, setWeights] = useState<number[]>([]);
    const [logic, setLogic] = useState("");

    useEffect(() => {
        if (isActive) {
            const interval = setInterval(() => {
                setWeights(Array.from({ length: 4 }, () => Math.random()));
                const logics = [
                    "IF Load > 80% THEN Scaling",
                    "BIAS ADJUST: +0.024",
                    "SIGMOID ACTIVATION: 0.982",
                    "NEURAL PATH: OPTIMIZED",
                    "GRADIENT DESCENT: STABLE"
                ];
                setLogic(logics[Math.floor(Math.random() * logics.length)]);
            }, 1500);
            return () => clearInterval(interval);
        }
    }, [isActive]);

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                >
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/50 rounded-xl p-3 shadow-[0_0_20px_rgba(34,211,238,0.3)] flex flex-col gap-2 min-w-[140px]">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5">
                                <Brain size={12} className="text-cyan-400" />
                                <span className="text-[10px] font-black text-white uppercase tracking-tighter">AI LOGIC</span>
                            </div>
                            <span className="text-[9px] font-mono text-cyan-500/70">W_{nodeLabel.slice(0, 3)}</span>
                        </div>

                        {/* Neural Weight Visualizer */}
                        <div className="flex gap-1 h-3 items-end">
                            {weights.map((w, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${w * 100}%` }}
                                    className="flex-1 bg-cyan-500/50 rounded-t-[1px]"
                                />
                            ))}
                        </div>

                        <div className="text-[9px] font-mono text-slate-300 border-t border-white/5 pt-1.5 leading-tight animate-pulse">
                            &gt; {logic}
                        </div>

                        {/* Connection Line */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-gradient-to-b from-cyan-500/50 to-transparent" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
