"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Settings, Zap, CheckCircle2, Activity, Terminal as TerminalIcon } from "lucide-react";

const UNOPTIMIZED_NODES = [
    { id: 1, x: 80, y: 300, label: "RAW DATA", icon: <Cpu size={18} /> },
    { id: 2, x: 400, y: 100, label: "LEGACY CTRL", icon: <Settings size={18} /> },
    { id: 3, x: 320, y: 450, label: "ENERGY LOSS", icon: <Zap size={18} /> },
    { id: 4, x: 650, y: 300, label: "FINAL PRODUCT", icon: <CheckCircle2 size={18} /> },
];

const OPTIMIZED_NODES = [
    { id: 1, x: 80, y: 300, label: "SMART INPUT", icon: <Cpu size={18} /> },
    { id: 2, x: 270, y: 300, label: "AI CONTROL", icon: <Settings size={18} /> },
    { id: 3, x: 460, y: 300, label: "ECO SYSTEM", icon: <Zap size={18} /> },
    { id: 4, x: 650, y: 300, label: "OPTIMIZED OUTPUT", icon: <CheckCircle2 size={18} /> },
];

export default function ProcessSimulator() {
    const [isOptimized, setIsOptimized] = useState(false);
    const [metrics, setMetrics] = useState({ efficiency: 42, throughput: 120, uptime: 88 });
    const [logs, setLogs] = useState<string[]>(["SYSTEM READY", "WAITING FOR OPTIMIZATION"]);
    const logContainerRef = useRef<HTMLDivElement>(null);

    // Simulate real-time data fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({
                efficiency: isOptimized ? 98 + Math.random() : 40 + Math.random() * 5,
                throughput: isOptimized ? 450 + Math.random() * 10 : 110 + Math.random() * 20,
                uptime: isOptimized ? 99.99 : 85 + Math.random() * 5,
            }));

            if (isOptimized && Math.random() > 0.7) {
                const newLog = `[${new Date().toLocaleTimeString()}] NODE_${Math.floor(Math.random() * 1000)}: SYNC OK`;
                setLogs(prev => [...prev.slice(-4), newLog]);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [isOptimized]);

    const handleToggle = () => {
        const nextState = !isOptimized;
        setIsOptimized(nextState);
        setLogs(prev => [...prev, nextState ? "EXECUTING OPTIMIZATION PROTOCOL..." : "RESETTING CONFIGURATION..."]);
        if (nextState) {
            setTimeout(() => setLogs(prev => [...prev, "AI ENGINE ONLINE", "PROCESS RECONFIGURED"]), 1000);
        }
    };

    const nodes = isOptimized ? OPTIMIZED_NODES : UNOPTIMIZED_NODES;

    return (
        <section id="simulation" className="py-32 bg-slate-950 relative overflow-hidden">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/simulation-bg.png" // Ensure this image exists
                    alt="Simulation Background"
                    className="w-full h-full object-cover opacity-20 mix-blend-color-dodge"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
            </div>

            <div className="container-custom relative z-10">
                <div className="mb-20 text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/20 border border-blue-500/30 backdrop-blur-sm"
                    >
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]" />
                        <span className="text-blue-400 font-bold tracking-[0.2em] text-[10px] uppercase">Interactive Digital Twin</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-[3vw] font-black text-white tracking-tighter leading-none">
                        PROCESS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 filter drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">OPTIMIZER</span>
                    </h2>
                    <p className="text-slate-400 font-medium text-lg">
                        가상의 공정 환경에서 <span className="text-cyan-400">AI 최적화</span> 성능을 직접 실험해보세요.
                    </p>
                </div>

                {/* Control Center Interface */}
                <div className="relative w-full max-w-7xl mx-auto bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] border border-slate-700 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
                    {/* Top Status Bar */}
                    <div className="h-12 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 tracking-widest">SNPE_OS_KERNEL_V4.2</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-[10px] font-mono text-cyan-500/70 tracking-widest">
                                MEM_USAGE: {Math.floor(metrics.uptime)}%
                            </div>
                            <Activity size={14} className="text-slate-600" />
                        </div>
                    </div>

                    <div className="p-8 flex flex-col lg:flex-row gap-8">
                        {/* Left: Interactive Canvas */}
                        <div className="flex-[2] relative flex flex-col gap-6">
                            {/* Canvas Header */}
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Mode</div>
                                    <div className={`text-2xl font-black tracking-tight flex items-center gap-3 transition-colors ${isOptimized ? "text-cyan-400" : "text-slate-400"}`}>
                                        {isOptimized ? (
                                            <>
                                                <Zap className="fill-cyan-400" /> AI OPTIMIZED
                                            </>
                                        ) : (
                                            <>
                                                <Settings className="animate-spin-slow" /> MANUAL
                                            </>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleToggle}
                                    className={`relative group px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all overflow-hidden ${isOptimized
                                        ? "bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)]"
                                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600"
                                        }`}
                                >
                                    <span className="relative z-10">{isOptimized ? "RESET SIMULATION" : "ACTIVATE AI"}</span>
                                    {isOptimized && <div className="absolute inset-0 bg-white/20 blur-xl group-hover:translate-x-full transition-transform duration-1000" />}
                                </button>
                            </div>

                            {/* Canvas Area */}
                            <div className="relative flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden min-h-[450px] shadow-inner">
                                {/* Grid & Effects */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                                {/* Scanning Line */}
                                <div className="absolute inset-x-0 h-[2px] bg-cyan-500/30 blur-sm animate-[scan-v_3s_linear_infinite]" />

                                <div className="absolute top-6 right-6 text-right">
                                    <div className="text-[9px] font-mono text-cyan-900">COORDS: {metrics.efficiency.toFixed(2)}, {metrics.throughput.toFixed(0)}</div>
                                    <div className="text-[9px] font-mono text-cyan-900">NODES_ACTIVE: {nodes.length}</div>
                                </div>

                                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 750 550">
                                    <AnimatePresence>
                                        {!isOptimized ? (
                                            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="messy">
                                                <path d="M 80 300 L 400 100 L 320 450 L 650 300" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" className="opacity-40" />
                                            </motion.g>
                                        ) : (
                                            <motion.g initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, ease: "circOut" }} key="clean">
                                                <path d="M 80 300 L 270 300 L 460 300 L 650 300" fill="none" stroke="#22d3ee" strokeWidth="3" className="drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
                                                {/* Data Packets */}
                                                <circle r="3" fill="white" className="animate-[follow-path_2s_linear_infinite]">
                                                    <animateMotion path="M 80 300 L 270 300 L 460 300 L 650 300" dur="2s" repeatCount="indefinite" />
                                                </circle>
                                            </motion.g>
                                        )}
                                    </AnimatePresence>
                                </svg>

                                {nodes.map((node) => (
                                    <motion.div
                                        key={node.id}
                                        layoutId={`node-${node.id}`}
                                        animate={{ x: node.x, y: node.y }}
                                        transition={{ type: "spring", stiffness: 120, damping: 15 }}
                                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 z-10 border-2 transition-all group cursor-pointer ${isOptimized
                                            ? "bg-slate-900/90 border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                                            : "bg-slate-900 border-slate-700 opacity-80 grayscale"
                                            }`}
                                        style={{ left: 0, top: 0 }}
                                    >
                                        <div className={`transition-colors duration-500 ${isOptimized ? "text-cyan-400" : "text-slate-500"}`}>
                                            {node.icon}
                                        </div>
                                        <div className={`text-[8px] font-black uppercase tracking-tighter ${isOptimized ? "text-cyan-100" : "text-slate-500"}`}>
                                            {node.label}
                                        </div>
                                        {/* Corner Markers */}
                                        <div className="absolute top-1 left-1 w-1 h-1 bg-current opacity-50" />
                                        <div className="absolute top-1 right-1 w-1 h-1 bg-current opacity-50" />
                                        <div className="absolute bottom-1 left-1 w-1 h-1 bg-current opacity-50" />
                                        <div className="absolute bottom-1 right-1 w-1 h-1 bg-current opacity-50" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Analytics Dashboard */}
                        <div className="w-full lg:w-80 flex flex-col gap-6">
                            {/* Metrics Panel */}
                            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden">
                                <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 relative z-10 flex items-center gap-2">
                                    <TerminalIcon size={12} /> Real-time Analytics
                                </h3>

                                <div className="space-y-6 relative z-10">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                            <span>Efficiency</span>
                                            <span className="text-cyan-400 font-mono text-sm">{metrics.efficiency.toFixed(1)}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                            <motion.div
                                                animate={{ width: `${metrics.efficiency}%` }}
                                                className={`h-full ${isOptimized ? "bg-cyan-500 shadow-[0_0_10px_#22d3ee]" : "bg-slate-600"}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                            <span>Throughput</span>
                                            <span className="text-white font-mono text-sm">{Math.floor(metrics.throughput)} UPH</span>
                                        </div>
                                        <div className="flex gap-0.5 h-4">
                                            {Array.from({ length: 20 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`flex-1 rounded-[1px] transition-colors duration-300 ${i < (metrics.throughput / 50)
                                                        ? (isOptimized ? "bg-cyan-400" : "bg-slate-600")
                                                        : "bg-slate-800/50"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center">
                                            <div className="text-[9px] text-slate-500 uppercase font-black">Latency</div>
                                            <div className={`font-mono text-lg font-bold ${isOptimized ? "text-green-400" : "text-red-400"}`}>
                                                {isOptimized ? "4ms" : "128ms"}
                                            </div>
                                        </div>
                                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center">
                                            <div className="text-[9px] text-slate-500 uppercase font-black">Errors</div>
                                            <div className={`font-mono text-lg font-bold ${isOptimized ? "text-green-400" : "text-yellow-500"}`}>
                                                {isOptimized ? "0.0%" : "2.4%"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* System Console */}
                            <div className="flex-1 bg-black rounded-2xl border border-slate-800 p-4 font-mono text-xs flex flex-col min-h-[250px] shadow-inner relative">
                                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,50,0,0.2),transparent)]" />
                                <div className="text-green-500 border-b border-green-900/30 pb-2 mb-2 uppercase tracking-widest font-bold flex justify-between">
                                    <span>System_Log.txt</span>
                                    <span>AUTO_SCROLL: ON</span>
                                </div>
                                <div className="flex-1 overflow-hidden space-y-2" ref={logContainerRef}>
                                    {logs.map((log, i) => (
                                        <div key={i} className="flex gap-3 text-green-400 font-medium">
                                            <span className="text-green-600/70 text-[10px]">{new Date().toLocaleTimeString().split(' ')[0]}</span>
                                            <span className="">{log}</span>
                                        </div>
                                    ))}
                                    <div className="w-2 h-4 bg-green-500 animate-pulse mt-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
