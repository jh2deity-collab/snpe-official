"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, Database, Server, Code, Zap } from "lucide-react";

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: any; // Using any for flexibility with the icon component
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl bg-slate-900 border border-blue-500/30 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)] flex flex-col max-h-[90vh]"
                    >
                        {/* Header: Schematic Title Bar */}
                        <div className="flex items-center justify-between p-6 border-b border-blue-500/30 bg-blue-950/20 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                            <div className="flex items-center gap-4 z-10">
                                <div className="p-3 bg-blue-500/20 border border-blue-400/30 rounded-xl text-cyan-400">
                                    <Code size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-mono text-blue-400 tracking-[0.2em] mb-1">PROJECT SCHEMATIC</div>
                                    <h3 className="text-xl md:text-2xl font-black text-white">{project.title}</h3>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-10"
                            >
                                <X size={24} />
                            </button>

                            {/* Decorative Grid Background */}
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-[length:20px_20px]" />
                        </div>

                        {/* Content Body */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-blue-600/30 scrollbar-track-transparent">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Left Column: Technical Details */}
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-4">
                                            <Cpu size={16} /> SYSTEM ARCHITECTURE
                                        </h4>
                                        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 relative group">
                                            {/* Mock Schematic Diagram */}
                                            <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-600">FIG 1.0</div>
                                            <div className="flex justify-between items-center mb-8">
                                                <div className="w-16 h-16 border border-slate-700 rounded-lg flex items-center justify-center text-slate-500 text-xs">INPUT</div>
                                                <div className="flex-1 h-[2px] bg-slate-800 relative mx-2">
                                                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-500/50 animate-scan-h" />
                                                </div>
                                                <div className="w-20 h-20 border border-cyan-500/50 bg-cyan-900/10 rounded-lg flex items-center justify-center text-cyan-400 font-bold shadow-[0_0_20px_rgba(34,211,238,0.1)]">CORE</div>
                                                <div className="flex-1 h-[2px] bg-slate-800 relative mx-2">
                                                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-500/50 animate-scan-h delay-75" />
                                                </div>
                                                <div className="w-16 h-16 border border-slate-700 rounded-lg flex items-center justify-center text-slate-500 text-xs">OUTPUT</div>
                                            </div>
                                            <p className="text-slate-400 text-sm leading-relaxed font-mono">
                                                &gt; {project.solution} <br />
                                                &gt; Latency optimization: COMPLETE <br />
                                                &gt; Protocol: TCP/IP, Modbus, OPC-UA
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-blue-400 mb-4">
                                            <Zap size={16} /> PERFORMANCE METRICS
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5">
                                                <div className="text-xs text-slate-500 mb-1">EFFICIENCY</div>
                                                <div className="text-2xl font-black text-white">98.5%</div>
                                            </div>
                                            <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5">
                                                <div className="text-xs text-slate-500 mb-1">STABILITY</div>
                                                <div className="text-2xl font-black text-green-400">AA+</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Strategy Description */}
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-indigo-400 mb-4">
                                            <Database size={16} /> STRATEGIC OVERVIEW
                                        </h4>
                                        <p className="text-slate-300 leading-relaxed text-lg">
                                            {project.problem}
                                            <br /><br />
                                            본 프로젝트는 단순한 자동화를 넘어, 데이터 기반의 의사결정 체계를 구축하는 데 중점을 두었습니다.
                                            특히 <strong>{project.outcome.split(',')[0]}</strong> 성과를 달성하며 업계의 새로운 표준을 제시했습니다.
                                        </p>
                                    </div>

                                    <div className="p-6 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                                        <h5 className="text-blue-300 font-bold mb-2 text-sm">TECH STACK</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {["React", "TypeScript", "Python", "TensorFlow", "AWS", "Docker"].map((tech) => (
                                                <span key={tech} className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-xs text-slate-400 hover:text-white hover:border-blue-500 transition-colors cursor-default">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/5 bg-slate-950 flex justify-between items-center text-[10px] text-slate-600 font-mono">
                            <div>SECURE CONNECTION ESTABLISHED</div>
                            <div>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
