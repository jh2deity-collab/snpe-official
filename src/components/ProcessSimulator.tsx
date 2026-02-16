"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Settings, Zap, CheckCircle2, Activity, Terminal as TerminalIcon, ArrowRight, Loader2, Mic, MicOff, Waves, Box as BoxIcon, Layers, Bot, LayoutDashboard, Plus, Globe } from "lucide-react";
import FactoryScene from "@/components/ui/FactoryScene";
import AgentTerminal, { AgentMessage } from "@/components/ui/AgentTerminal";
import IoTDashboard from "@/components/ui/IoTDashboard";
import NodePalette, { PaletteNode } from "@/components/ui/NodePalette";
import GlobalGlobe from "@/components/ui/GlobalGlobe";
import NeuralTrace from "@/components/ui/NeuralTrace";
import { BrainCircuit, AlertTriangle, ZapOff, Flame, History, Volume2, VolumeX } from "lucide-react";
import { useSoundEffect } from "@/hooks/useSoundEffect";

// Speech Recognition Type
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

// Default Nodes (Fallback)
const DEFAULT_NODES = [
    { id: 1, label: "RAW INPUT", icon: <Cpu size={18} /> },
    { id: 2, label: "PROCESS CTRL", icon: <Settings size={18} /> },
    { id: 3, label: "SYSTEM LOAD", icon: <Zap size={18} /> },
    { id: 4, label: "FINAL OUTPUT", icon: <CheckCircle2 size={18} /> },
];

export default function ProcessSimulator() {
    // State
    const [isOptimized, setIsOptimized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showInput, setShowInput] = useState(true);
    const [viewMode, setViewMode] = useState<"2D" | "3D">("3D"); // Default to 3D for impact

    // Voice State
    const [isListening, setIsListening] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState("");

    // Agent State
    const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);

    // IoT State
    const [iotData, setIotData] = useState<any[]>([]);
    const [healingStatus, setHealingStatus] = useState<"stable" | "anomaly" | "healing">("stable");
    const [activeTab, setActiveTab] = useState<"process" | "iot" | "global">("process");
    const [isBuildMode, setIsBuildMode] = useState(false);
    const [customNodes, setCustomNodes] = useState<any[]>([]);
    const [isDeepLogic, setIsDeepLogic] = useState(false);
    const [stressStatus, setStressStatus] = useState<"idle" | "failing" | "recovering">("idle");
    const [mttr, setMttr] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const { playSound } = useSoundEffect();

    const play = (type: any) => {
        if (!isMuted) playSound(type);
    };

    // User Inputs
    const [industry, setIndustry] = useState("");
    const [problem, setProblem] = useState("");

    // Log Type Definition
    type LogEntry = {
        id: number;
        time: string;
        message: string;
    };

    // Simulation Data
    const [nodes, setNodes] = useState(DEFAULT_NODES);
    const [metrics, setMetrics] = useState({ efficiency: 30, throughput: 80, uptime: 75 });
    const [targetMetrics, setTargetMetrics] = useState<{ efficiency: number, throughput: number, uptime: number } | null>(null);

    // Legacy (Before AI) Data
    const [legacyMetrics, setLegacyMetrics] = useState({ efficiency: 30, throughput: 80, uptime: 75 });

    const [logs, setLogs] = useState<LogEntry[]>([
        { id: 1, time: "00:00:00", message: "SYSTEM READY" },
        { id: 2, time: "00:00:01", message: "WAITING FOR INPUT..." }
    ]);
    const [aiAnalysis, setAiAnalysis] = useState("");
    const [displayedAnalysis, setDisplayedAnalysis] = useState("");

    const logContainerRef = useRef<HTMLDivElement>(null);

    // Helper to add log
    const addLog = (message: string) => {
        setLogs(prev => [
            ...prev,
            {
                id: Date.now() + Math.random(),
                time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                message
            }
        ]);
    };

    // Helper to add agent message
    const pushAgentMsg = (agent: "Planner" | "Optimizer" | "Guard", text: string, type: "info" | "warn" | "success" = "info") => {
        setAgentMessages(prev => [...prev, {
            id: Math.random().toString(),
            agent,
            text,
            type
        }]);
    };

    // IoT Simulation Effect
    useEffect(() => {
        let anomalyTimer: any;
        const interval = setInterval(() => {
            setIotData(prev => {
                const last = prev[prev.length - 1] || { vibration: 45, temp: 65, power: 120 };
                let deltaVib = (Math.random() - 0.5) * 5;
                let deltaTemp = (Math.random() - 0.5) * 2;
                let deltaPower = (Math.random() - 0.5) * 10;

                // Anomaly Logic
                if (healingStatus === "anomaly") {
                    deltaVib = 5 + Math.random() * 10;
                    deltaTemp = 2 + Math.random() * 5;
                } else if (healingStatus === "healing") {
                    deltaVib = -10;
                    deltaTemp = -5;
                }

                const newData = {
                    time: new Date().toLocaleTimeString(),
                    vibration: Math.max(10, Math.min(150, last.vibration + deltaVib + (stressStatus === "failing" ? 40 : 0))),
                    temp: Math.max(20, Math.min(120, last.temp + deltaTemp + (stressStatus === "failing" ? 20 : 0))),
                    power: Math.max(50, Math.min(300, last.power + deltaPower + (stressStatus === "failing" ? 100 : 0)))
                };

                const next = [...prev, newData].slice(-20);

                // Trigger Anomaly
                if (healingStatus === "stable" && isOptimized && newData.vibration > 100 && !anomalyTimer) {
                    setHealingStatus("anomaly");
                    pushAgentMsg("Guard", "CRITICAL ANOMALY: Excessive vibration detected in Node 2!", "warn");

                    anomalyTimer = setTimeout(() => {
                        setHealingStatus("healing");
                        pushAgentMsg("Optimizer", "Initiating AI self-healing protocols. Calibrating dampeners.", "info");

                        setTimeout(() => {
                            setHealingStatus("stable");
                            pushAgentMsg("Guard", "System stabilized. Vibration levels returning to nominal.", "success");
                            anomalyTimer = null;
                        }, 5000);
                    }, 4000);
                }

                return next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [healingStatus, isOptimized]);

    // Auto-scroll logs
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    // METRICS SIMULATION ENGINE
    // Interpolates current metrics towards target metrics with organic noise
    useEffect(() => {
        if (!isOptimized || !targetMetrics) return;

        const interval = setInterval(() => {
            setMetrics(prev => {
                // Calculate distance to target
                const diffEff = targetMetrics.efficiency - prev.efficiency;
                const diffThr = targetMetrics.throughput - prev.throughput;
                const diffUptime = targetMetrics.uptime - prev.uptime;

                // Smooth interpolation factor (0.1 means move 10% of the way per tick)
                const speed = 0.05;

                // Stress Test Impact
                let stressPenalty = 0;
                if (stressStatus === "failing") {
                    stressPenalty = 20 + Math.random() * 10;
                }

                // Organic noise
                const noiseEff = (Math.random() - 0.5) * 0.5;
                const noiseThr = (Math.random() - 0.5) * 2;

                return {
                    efficiency: Math.max(5, prev.efficiency + (diffEff * speed) + noiseEff - (stressStatus === "failing" ? 2 : 0)),
                    throughput: Math.max(10, prev.throughput + (diffThr * speed) + noiseThr - stressPenalty),
                    uptime: stressStatus === "failing" ? 45.2 : 99.9,
                };
            });

            // Simulate Legacy Metrics (Poor performance, high fluctuation)
            setLegacyMetrics(prev => {
                // Legacy stays low and erratic
                const targetEff = 45; // Low efficiency
                const targetThr = 60; // Low throughput

                // Drift towards poor targets but with high noise
                const diffEff = targetEff - prev.efficiency;
                const diffThr = targetThr - prev.throughput;

                const speed = 0.02; // Slow correction
                const noise = (Math.random() - 0.5) * 5; // High chaos

                return {
                    efficiency: Math.max(20, Math.min(60, prev.efficiency + (diffEff * speed) + noise)),
                    throughput: Math.max(40, Math.min(100, prev.throughput + (diffThr * speed) + noise)),
                    uptime: prev.uptime > 80 ? prev.uptime - 0.1 : prev.uptime + 0.1, // Fluctuating uptime
                };
            });

        }, 100); // Fast ticks for smooth animation

        return () => clearInterval(interval);
    }, [isOptimized, targetMetrics]);

    // TYPEWRITER EFFECT FOR ANALYSIS
    useEffect(() => {
        if (isOptimized && aiAnalysis) {
            let i = 0;
            setDisplayedAnalysis("");
            const interval = setInterval(() => {
                setDisplayedAnalysis(aiAnalysis.slice(0, i));
                i++;
                if (i > aiAnalysis.length) clearInterval(interval);
            }, 30); // Speed of typing
            return () => clearInterval(interval);
        }
    }, [isOptimized, aiAnalysis]);

    // VOICE COMMAND HANDLER
    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Speech recognition is not supported in this browser. Please use Chrome.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'ko-KR'; // Korean
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        setIsListening(true);
        setVoiceTranscript("Listening...");

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setVoiceTranscript(transcript);
        };

        recognition.onend = () => {
            // If we have a transcript, submit it
            // We need to access the LATEST voiceTranscript value. 
            // Ideally we pass it directly or capture it from the event.
            // However, `recognition.onresult` updates state, but `onend` might have closure issues if we access state directly.
            // So we should rely on the last result event or handle it carefully.
            // A better pattern for this simple use case:
            setIsListening(false);
            play("scan");
        };

        // Custom wrapper to handle the result submitting after a pause
        let finalTranscript = "";
        recognition.onresult = (event: any) => {
            finalTranscript = event.results[0][0].transcript;
            setVoiceTranscript(finalTranscript);
        }
        recognition.onend = () => {
            setIsListening(false);
            if (finalTranscript) {
                handleSimulate(finalTranscript);
            } else {
                setVoiceTranscript("");
            }
        }

        recognition.start();
    };


    const handleSimulate = async (voiceInput?: string) => {
        // Allow if manual input is filled OR if voice input is provided
        if ((!industry || !problem) && !voiceInput) return;

        setIsLoading(true);
        setShowInput(false);

        if (voiceInput) {
            addLog(`VOICE COMMAND RECEIVED: "${voiceInput}"`);
            addLog("AI PARSING INSTRUCTION...");
            play("scan");
        } else {
            addLog(`ANALYZING PARAMETERS: ${industry} / ${problem}...`);
            play("click");
        }

        try {
            setAgentMessages([]); // Clear previous messages

            // Agent 1: Planner kicks off
            pushAgentMsg("Planner", `Analyzing ${isBuildMode ? "custom workflow sequence" : industry} for latent bottlenecks...`, "info");

            const res = await fetch('/api/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    industry,
                    problem,
                    voiceInput,
                    customNodes: isBuildMode ? customNodes.map(n => n.label) : null
                }),
            });

            if (!res.ok) throw new Error('Simulation Failed');

            const data = await res.json();

            // Agent 2: Optimizer analyzes data
            setTimeout(() => pushAgentMsg("Optimizer", "Neural kernel processing. Optimization vector identified.", "info"), 1500);

            // If voice input, update the input fields with extracted info
            if (data.extracted_info) {
                setIndustry(data.extracted_info.industry);
                setProblem(data.extracted_info.problem);
                addLog(`CONTEXT IDENTIFIED: ${data.extracted_info.industry}`);
            }

            // Transform API nodes to fit UI structure
            // If we have custom nodes, we DON'T overwrite them, just optimize them
            let newNodes;
            if (isBuildMode && customNodes.length > 0) {
                newNodes = [...customNodes];
            } else {
                newNodes = data.nodes.slice(0, 4).map((n: any, idx: number) => ({
                    id: idx + 1,
                    label: n.label,
                    icon: idx === 0 ? <Cpu size={18} /> : idx === 1 ? <Settings size={18} /> : idx === 2 ? <Zap size={18} /> : <CheckCircle2 size={18} />
                }));
            }

            // Animation Sequence
            setTimeout(() => {
                // Agent 3: Guard validates
                pushAgentMsg("Guard", "Validating throughput integrity... Security protocols nominal.", "success");

                setNodes(newNodes);
                // Instead of setting metrics instantly, we set the TARGET
                setTargetMetrics(data.metrics);
                setLegacyMetrics({ efficiency: 35, throughput: 50, uptime: 88 }); // Set explicitly low starting point for contrast
                setAiAnalysis(data.analysis);
                setIsOptimized(true);
                setIsLoading(false);
                play("success");
                addLog("OPTIMIZATION COMPLETE");
                addLog("AI KERNEL ACTIVE");
                addLog("REAL-TIME MONITORING STARTED");

                // Final Success from Planner
                setTimeout(() => pushAgentMsg("Planner", "Simulation deployment finalized. Efficiency gain and CO2 reduction verified.", "success"), 1000);
            }, 3000); // Wait bit more for dramatic effect with agents

        } catch (error) {
            console.error(error);
            play("error");
            addLog("ERROR: SIMULATION FAILED");
            addLog("REVERTING TO SAFE MODE");
            setIsLoading(false);
        }
    };

    const resetSimulation = () => {
        play("click");
        setIsOptimized(false);
        setNodes(DEFAULT_NODES);
        setMetrics({ efficiency: 30, throughput: 80, uptime: 75 });
        setLegacyMetrics({ efficiency: 30, throughput: 80, uptime: 75 });
        setTargetMetrics(null);
        setAiAnalysis("");
        setDisplayedAnalysis("");
        setShowInput(true);
        setAgentMessages([]);
        addLog("SYSTEM RESET");
    };

    const triggerStressTest = (type: "hardware" | "power" | "bottleneck") => {
        if (!isOptimized) {
            alert("Please optimize the process first to witness AI recovery.");
            return;
        }
        setStressStatus("failing");
        play("glitch");
        const startTime = Date.now();

        const msgs = {
            hardware: "CRITICAL HARDWARE FAILURE: Actuator malfunction in Node 2!",
            power: "SYSTEM ALERT: Massive power surge detected. Grid instability!",
            bottleneck: "NETWORK CONGESTION: Infinite loop detected in process logic!"
        };

        addLog(`STRESS TEST INITIATED: ${type.toUpperCase()}`);
        pushAgentMsg("Guard", msgs[type], "warn");

        // Start recovery after 4 seconds
        setTimeout(() => {
            setStressStatus("recovering");
            play("scan");
            pushAgentMsg("Optimizer", "Analyzing failure vector... Deploying self-healing patch 0.4.2.", "info");

            setTimeout(() => {
                setStressStatus("idle");
                play("success");
                const recoveryTime = ((Date.now() - startTime) / 1000).toFixed(1);
                setMttr(parseFloat(recoveryTime));
                pushAgentMsg("Planner", `System fully restored. MTTR: ${recoveryTime}s. All nodes operational.`, "success");
                addLog(`SYSTEM RECOVERED. DURATION: ${recoveryTime}s`);
            }, 4000);
        }, 4000);
    };

    const handleAddNode = (item: PaletteNode) => {
        if (customNodes.length >= 8) {
            pushAgentMsg("Guard", "Maximum sequence length reached (8 nodes).", "warn");
            return;
        }
        const newNode = {
            id: Date.now(),
            label: item.label,
            icon: item.icon,
            type: item.type
        };
        setCustomNodes(prev => [...prev, newNode]);
        play("click");
        addLog(`NODE ADDED: ${item.label}`);
    };

    const handleRemoveNode = (index: number) => {
        play("warning");
        setCustomNodes(prev => {
            const next = [...prev];
            const removed = next.splice(index, 1);
            addLog(`NODE REMOVED: ${removed[0].label}`);
            return next;
        });
    };

    const toggleBuildMode = () => {
        setIsBuildMode(!isBuildMode);
        if (!isBuildMode) {
            // Entering build mode: start fresh or with current
            setCustomNodes(nodes);
            addLog("ENTERED BUILD MODE");
        } else {
            // Exiting build mode: apply changes
            setNodes(customNodes);
            addLog("EXITED BUILD MODE - FLOW UPDATED");
        }
    };

    // Node Positions (Fixed Layout)
    const nodePositions = [
        { x: 80, y: 300 },
        { x: 270, y: 300 }, // Position for Node 2 (Optimized/Unoptimized uses same layout for simplicity now or switch?)
        { x: 460, y: 300 }, // Let's use the 'clean' layout for optimized and 'messy' for unoptimized logic visually?
        { x: 650, y: 300 },
    ];
    // For unoptimized, we can use the original messy coordinates if we want, but let's stick to clean transition for now or keep logic.
    // Let's us the logic: isOptimized ? Straight Line : Messy Line.

    return (
        <section id="simulation" className="py-24 md:py-32 bg-slate-950 relative overflow-hidden">
            {/* Backgrounds */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img src="/images/simulation-bg.png" alt="BG" className="w-full h-full object-cover opacity-20 mix-blend-color-dodge" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
            </div>

            <div className="container-custom relative z-10">
                {/* Header */}
                <div className="mb-12 md:mb-20 text-center space-y-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/20 border border-blue-500/30 backdrop-blur-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]" />
                        <span className="text-blue-400 font-bold tracking-[0.2em] text-[11px] uppercase">Interactive Digital Twin</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-[3vw] font-black text-white tracking-tighter leading-none">
                        PROCESS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">OPTIMIZER</span>
                    </h2>
                    <p className="text-slate-400 font-medium text-lg">
                        산업 분야와 문제점을 입력하면 <span className="text-cyan-400">AI</span>가 최적의 공정 설계를 제안합니다.
                    </p>
                </div>

                {/* Main Interface */}
                <div className="relative w-full max-w-7xl mx-auto bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] border border-slate-700 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">

                    {/* Status Bar */}
                    <div className="h-12 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                            </div>
                            <span className="text-[11px] font-mono text-slate-300 tracking-widest hidden md:block">SNPE_TWIN_KERNEL_V5.0</span>
                        </div>
                        <div className="flex items-center gap-6">
                            {isLoading && <span className="text-cyan-400 text-[13px] font-mono animate-pulse">PROCESSING DATA...</span>}
                            <Activity size={14} className="text-slate-600" />
                        </div>
                    </div>

                    <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-8 relative">

                        {/* Input Overlay (AnimatePresence) */}
                        <AnimatePresence>
                            {showInput && (
                                <motion.div
                                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                    animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
                                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                    className="absolute inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4"
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, y: 20 }}
                                        animate={{ scale: 1, y: 0 }}
                                        className="bg-slate-900 border border-slate-700/50 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
                                    >
                                        <div className="text-center">
                                            <h3 className="text-2xl font-black text-white mb-2">시뮬레이션 설정</h3>
                                            <p className="text-slate-200 text-sm">최적화할 공정 환경을 설정해주세요.</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[13px] font-bold text-slate-300 uppercase block mb-2">산업 분야</label>
                                                <input
                                                    type="text"
                                                    value={industry}
                                                    onChange={(e) => setIndustry(e.target.value)}
                                                    placeholder="예: 자동차 부품 제조, 식품 가공"
                                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-cyan-500 outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[13px] font-bold text-slate-300 uppercase block mb-2">현재 문제점 (Bottleneck)</label>
                                                <input
                                                    type="text"
                                                    value={problem}
                                                    onChange={(e) => setProblem(e.target.value)}
                                                    placeholder="예: 높은 불량률, 과도한 에너지 비용"
                                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-cyan-500 outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            {isOptimized && (
                                                <button onClick={() => setShowInput(false)} className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-colors">
                                                    취소
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleSimulate()}
                                                disabled={!industry || !problem}
                                                className="flex-1 py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                <Zap size={18} className="fill-white" />
                                                시뮬레이션 시작
                                            </button>

                                            {/* Mic Button */}
                                            <button
                                                onClick={startListening}
                                                className="w-14 h-12 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-cyan-500/50 transition-all group"
                                            >
                                                <Mic className="text-slate-200 group-hover:text-cyan-400" size={20} />
                                            </button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Listening Overlay */}
                        <AnimatePresence>
                            {isListening && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-[60] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 rounded-[2rem]"
                                >
                                    <div className="relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="w-24 h-24 rounded-full bg-cyan-500/20 blur-xl absolute inset-0"
                                        />
                                        <div className="w-24 h-24 rounded-full border-2 border-cyan-500 flex items-center justify-center relative z-10 bg-slate-900">
                                            <Mic size={40} className="text-cyan-400" />
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-white mt-8 mb-2">LISTENING...</h3>
                                    <p className="text-cyan-400 font-mono text-lg h-8">{voiceTranscript}</p>

                                    <div className="mt-8 flex gap-1 h-8 items-end">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: [10, 30, 10] }}
                                                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                                className="w-2 bg-cyan-500 rounded-full"
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setIsListening(false)}
                                        className="mt-12 px-6 py-2 rounded-full border border-slate-700 text-slate-200 text-sm hover:bg-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Middle: Visualization (Canvas) */}
                        <div className="flex-[2] flex flex-col gap-6">
                            {/* Toolbar */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-1">Status</div>
                                    <div className={`text-xl md:text-2xl font-black tracking-tight flex items-center gap-3 ${isOptimized ? "text-cyan-400" : "text-slate-300"}`}>
                                        {isOptimized ? <><Zap className="fill-cyan-400" /> AI OPTIMIZED</> : <><Settings /> STANDBY</>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {/* Tab Toggle */}
                                    <div className="bg-slate-950 border border-white/10 p-1 rounded-xl flex items-center mr-2 shadow-inner">
                                        <button
                                            onClick={() => { setActiveTab("process"); setIsBuildMode(false); }}
                                            className={`px-4 py-1.5 rounded-lg text-[12px] font-black tracking-widest transition-all flex items-center gap-2 ${activeTab === "process" && !isBuildMode ? "bg-slate-800 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]" : "text-slate-500 hover:text-slate-300"}`}
                                        >
                                            <Layers size={14} />
                                            PROCESS
                                        </button>
                                        <button
                                            onClick={() => { setActiveTab("iot"); setIsBuildMode(false); }}
                                            className={`px-4 py-1.5 rounded-lg text-[12px] font-black tracking-widest transition-all flex items-center gap-2 ${activeTab === "iot" ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "text-slate-500 hover:text-slate-300"}`}
                                        >
                                            <LayoutDashboard size={14} />
                                            IoT
                                        </button>
                                    </div>

                                    <div className="w-px h-6 bg-slate-800 mx-2" />

                                    {/* NEW: XAI Toggle */}
                                    <button
                                        onClick={() => setIsDeepLogic(!isDeepLogic)}
                                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border transition-all font-black text-[11px] uppercase tracking-widest ${isDeepLogic ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]" : "bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300"}`}
                                    >
                                        <BrainCircuit size={14} className={isDeepLogic ? "animate-pulse" : ""} />
                                        DEEP LOGIC
                                    </button>

                                    <div className="w-px h-6 bg-slate-800 mx-2" />

                                    {/* NEW: Stress Test Controls */}
                                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 p-1 rounded-lg">
                                        <button
                                            onClick={() => triggerStressTest("hardware")}
                                            className="p-1.5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-md transition-colors title='Hardware Failure'"
                                        >
                                            <ZapOff size={14} />
                                        </button>
                                        <button
                                            onClick={() => triggerStressTest("power")}
                                            className="p-1.5 hover:bg-yellow-500/20 text-slate-500 hover:text-yellow-400 rounded-md transition-colors title='Power Surge'"
                                        >
                                            <Flame size={14} />
                                        </button>
                                        <button
                                            onClick={() => triggerStressTest("bottleneck")}
                                            className="p-1.5 hover:bg-orange-500/20 text-slate-500 hover:text-orange-400 rounded-md transition-colors title='Bottleneck'"
                                        >
                                            <AlertTriangle size={14} />
                                        </button>
                                    </div>

                                    {/* NEW: Mute Toggle */}
                                    <button
                                        onClick={() => setIsMuted(!isMuted)}
                                        className="p-1.5 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded-md transition-colors"
                                    >
                                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                    </button>

                                    <div className="w-px h-6 bg-slate-800 mx-2" />

                                    {/* View Mode Toggle */}
                                    <div className={`bg-slate-900 border border-slate-700 p-1 rounded-lg flex items-center mr-2 transition-opacity ${activeTab !== "process" ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
                                        <button
                                            onClick={() => setViewMode("2D")}
                                            className={`px-3 py-1 rounded-md text-[13px] font-bold transition-all ${viewMode === "2D" ? "bg-slate-700 text-white" : "text-slate-300 hover:text-slate-300"}`}
                                        >
                                            2D
                                        </button>
                                        <button
                                            onClick={() => setViewMode("3D")}
                                            className={`px-3 py-1 rounded-md text-[13px] font-bold transition-all ${viewMode === "3D" ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "text-slate-300 hover:text-slate-300"}`}
                                        >
                                            3D TWIN
                                        </button>
                                    </div>

                                    {isOptimized && (
                                        <button
                                            onClick={() => setShowInput(true)}
                                            className="px-4 py-2 bg-slate-800 text-slate-300 text-[13px] font-bold rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"
                                        >
                                            파라미터 변경
                                        </button>
                                    )}
                                    {isOptimized && (
                                        <button onClick={resetSimulation} className="px-4 py-2 bg-slate-800 text-slate-300 text-[13px] font-bold rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
                                            초기화
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Canvas Area - Split for A/B Testing OR 3D View */}
                            <div className="relative flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden min-h-[400px] shadow-inner flex">

                                {activeTab === "iot" ? (
                                    <IoTDashboard data={iotData} healingStatus={healingStatus} />
                                ) : activeTab === "global" ? (
                                    <GlobalGlobe />
                                ) : viewMode === "3D" ? (
                                    <FactoryScene nodes={isBuildMode ? customNodes : nodes} isOptimized={isOptimized} metrics={metrics} legacyMetrics={legacyMetrics} />
                                ) : (
                                    <>
                                        {/* LEFT: Legacy (Before) - Only visible when optimized and on large screens, or stacked */}
                                        {isOptimized && (
                                            <div className="w-1/2 border-r border-slate-800 relative hidden md:block bg-red-950/10 grayscale opacity-70">
                                                <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                    <span className="text-red-200/80 text-[13px] font-bold uppercase tracking-widest">Legacy Process</span>
                                                </div>
                                                {/* Legacy Graph Visualization (Simplified) */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="relative w-full h-full p-8">
                                                        <svg className="w-full h-full" viewBox="0 0 300 400">
                                                            <path d="M 50 50 L 250 100 L 80 250 L 220 350" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 5" className="opacity-40" />
                                                            {(isBuildMode ? customNodes : DEFAULT_NODES).map((node, i) => (
                                                                <g key={`legacy-${i}`} transform={`translate(${i === 0 ? 50 : i === 1 ? 250 : i === 2 ? 80 : 220}, ${i === 0 ? 50 : i === 1 ? 100 : i === 2 ? 250 : 350})`}>
                                                                    <rect x="-15" y="-15" width="30" height="30" fill="#1e293b" stroke="#7f1d1d" rx="4" />
                                                                    <text y="30" textAnchor="middle" fill="#991b1b" fontSize="10">{node.label.slice(0, 4)}</text>
                                                                </g>
                                                            ))}
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* RIGHT: AI Optimized (After) */}
                                        <div className={`relative ${isOptimized ? "w-full md:w-1/2" : "w-full"}`}>
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

                                            {isOptimized && (
                                                <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
                                                    <span className="text-cyan-200 text-[13px] font-bold uppercase tracking-widest">AI Optimized</span>
                                                </div>
                                            )}

                                            {isLoading && (
                                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                                                    <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                                                    <p className="text-cyan-200 font-mono text-sm animate-pulse">AI PROCESSING...</p>
                                                </div>
                                            )}

                                            {/* Optimization Result Logic */}
                                            {isOptimized && (
                                                <div className="absolute bottom-4 right-4 bg-cyan-500 text-slate-900 px-4 py-2 rounded-lg font-black text-sm shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-bounce z-40">
                                                    +{(metrics.efficiency - legacyMetrics.efficiency).toFixed(0)}% GAIN
                                                </div>
                                            )}

                                            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 350 550" preserveAspectRatio="xMidYMid meet">
                                                <AnimatePresence mode="wait">
                                                    {!isOptimized ? (
                                                        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="standard">
                                                            <path d="M 40 100 L 310 50 L 100 400 L 300 450" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" className="opacity-40" />
                                                        </motion.g>
                                                    ) : (
                                                        <motion.g initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5 }} key="optimized">
                                                            <path d="M 175 50 L 175 150 L 175 250 L 175 450" fill="none" stroke="#22d3ee" strokeWidth="3" className="drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
                                                            <circle r="3" fill="white" className="animate-[follow-path-vertical_2s_linear_infinite]">
                                                                <animateMotion path="M 175 50 L 175 150 L 175 250 L 175 450" dur="1s" repeatCount="indefinite" />
                                                            </circle>
                                                        </motion.g>
                                                    )}
                                                </AnimatePresence>
                                            </svg>

                                            {(isBuildMode ? customNodes : nodes).map((node, i) => {
                                                // Simplified Vertical Layout for Split View
                                                const pos = isOptimized
                                                    ? { x: 175, y: 80 + (i * 110) }
                                                    : (i === 0 ? { x: 40, y: 100 } : i === 1 ? { x: 310, y: 50 } : i === 2 ? { x: 100, y: 400 } : { x: 300, y: 450 });

                                                return (
                                                    <motion.div
                                                        key={`${node.id}-${i}`}
                                                        initial={false}
                                                        animate={{ x: pos.x, y: pos.y }}
                                                        transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-xl flex flex-col items-center justify-center gap-1 z-10 border-2 transition-all ${isOptimized
                                                            ? "bg-slate-900/90 border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                                                            : "bg-slate-900 border-slate-700 opacity-80 grayscale"
                                                            }`}
                                                        style={{ left: 0, top: 0 }} // Positioning controlled by motion.div animate
                                                    >
                                                        {/* Node Identity */}
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-lg relative ${isOptimized ? "bg-cyan-600 text-white border-cyan-400 scale-110" : "bg-slate-800 text-slate-400 border-white/10"}`}>
                                                                {node.icon}
                                                                {isOptimized && (
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center"
                                                                    >
                                                                        <CheckCircle2 size={12} className="text-white" />
                                                                    </motion.div>
                                                                )}
                                                                {/* Explainable AI Overlay */}
                                                                <NeuralTrace isActive={isDeepLogic && isOptimized} nodeLabel={node.label} />

                                                                {/* Stress Effect Overlay */}
                                                                {stressStatus === "failing" && (
                                                                    <motion.div
                                                                        animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 1.2, 1] }}
                                                                        transition={{ repeat: Infinity, duration: 0.2 }}
                                                                        className="absolute inset-0 bg-red-500/30 rounded-2xl border-2 border-red-500"
                                                                    />
                                                                )}
                                                            </div>
                                                            <span className={`text-[13px] font-black uppercase tracking-tighter ${isOptimized ? "text-white" : "text-slate-500"}`}>{node.label}</span>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* AI Analysis Text */}
                            {isOptimized && displayedAnalysis && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-cyan-900/10 border border-cyan-500/30 p-4 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TerminalIcon size={14} className="text-cyan-200" />
                                        <span className="text-[13px] font-bold text-cyan-200 uppercase">AI Diagnosis</span>
                                    </div>
                                    <p className="text-sm text-cyan-100 leading-relaxed font-light font-mono selection:bg-cyan-500/30">
                                        {displayedAnalysis}
                                        <span className="inline-block w-2 h-4 bg-cyan-200 ml-1 animate-pulse align-middle" />
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* Right: Metrics & Agents */}
                        <div className="w-full lg:w-80 flex flex-col gap-4">

                            {/* Agents Dialogue Terminal */}
                            <div className="h-[280px] relative">
                                <div className={`absolute inset-0 transition-opacity duration-300 ${isBuildMode ? "opacity-100 z-10" : "opacity-0 pointer-events-none"}`}>
                                    <NodePalette
                                        onAddNode={handleAddNode}
                                        currentNodes={customNodes}
                                        onRemoveNode={handleRemoveNode}
                                    />
                                    {customNodes.length > 0 && (
                                        <div className="absolute bottom-4 left-4 right-4 z-20">
                                            <button
                                                onClick={() => handleSimulate()}
                                                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-3 rounded-xl shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2 transition-all active:scale-95 group"
                                            >
                                                <Bot size={18} className="group-hover:rotate-12 transition-transform" />
                                                CUSTOM OPTIMIZE
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className={`absolute inset-0 transition-opacity duration-300 ${!isBuildMode ? "opacity-100 z-10" : "opacity-0 pointer-events-none"}`}>
                                    <AgentTerminal messages={agentMessages} />
                                </div>
                            </div>

                            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden">
                                <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
                                <h3 className="text-[13px] font-black text-slate-300 uppercase tracking-widest mb-6 relative z-10">Real-time Analytics</h3>

                                <div className="space-y-6 relative z-10">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[11px] font-bold text-slate-200 uppercase">
                                            <span>Efficiency</span>
                                            <span className="text-cyan-200 font-mono text-sm">{metrics.efficiency.toFixed(1)}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${metrics.efficiency}%` }}
                                                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[11px] font-bold text-slate-200 uppercase">
                                            <span>ESG Index (Green)</span>
                                            <span className="text-emerald-400 font-mono text-sm">{isOptimized ? "92.4" : "64.8"}</span>
                                        </div>
                                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: isOptimized ? "92.4%" : "64.8%" }}
                                                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">CO2 Saving</p>
                                            <p className="text-lg font-black text-white">{isOptimized && stressStatus === "idle" ? "12.4" : "0.0"} <span className="text-[10px] text-slate-500">kg/h</span></p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">MTTR (Recov.)</p>
                                            <p className="text-lg font-black text-white">{mttr > 0 ? mttr : "--"} <span className="text-[10px] text-slate-500">s</span></p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                            <span>Throughput</span>
                                            <span className="text-white font-mono text-sm">{Math.floor(metrics.throughput)} UPH</span>
                                        </div>
                                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                            <motion.div
                                                animate={{ width: `${Math.min(100, metrics.throughput / 10)}%` }} // Scale roughly
                                                className={`h-full ${isOptimized ? "bg-blue-500" : "bg-slate-600"}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Log */}
                            <div className="h-[240px] bg-black rounded-2xl border border-slate-800 p-4 font-mono text-xs flex flex-col shadow-inner relative">
                                {stressStatus === "failing" && (
                                    <motion.div
                                        animate={{ opacity: [0, 0.2, 0, 0.1, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.5 }}
                                        className="absolute inset-0 bg-red-900/20 pointer-events-none z-50 backdrop-invert-[0.1]"
                                    />
                                )}
                                <div className="text-green-500 border-b border-green-900/30 pb-2 mb-2 uppercase tracking-widest font-bold flex justify-between">
                                    <span>System_Log.txt</span>
                                    {stressStatus !== "idle" && (
                                        <span className={stressStatus === "failing" ? "text-red-500 animate-pulse" : "text-yellow-500 animate-spin"}>
                                            {stressStatus === "failing" ? "[CRITICAL_FAILURE]" : "[HEALING...]"}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-800" ref={logContainerRef}>
                                    {logs.map((log) => (
                                        <div key={log.id} className="flex gap-2">
                                            <span className="text-slate-600">[{log.time}]</span>
                                            <span className="text-green-400">{log.message}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
