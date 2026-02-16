"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Activity, Globe, Zap, Server, Shield, Cpu, ChevronDown } from "lucide-react";

export default function Hero() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Mouse Parallax Logic
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 2; // -1 to 1
            const y = (clientY / window.innerHeight - 0.5) * 2; // -1 to 1
            setMousePosition({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Time state for the status bar
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section ref={targetRef} id="hero" className="relative w-full h-screen min-h-[100dvh] md:min-h-[900px] bg-slate-950 overflow-hidden perspective-1000">
            {/* Background Layer (Slow Movement) */}
            <motion.div
                className="absolute inset-0 z-0"
                animate={{
                    x: mousePosition.x * -20,
                    y: mousePosition.y * -20
                }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
            >
                <img
                    src="/images/hero-bg-main.png?v=2"
                    alt="Hero Background"
                    className="w-full h-full object-cover opacity-60 scale-105" // Scale up slightly to prevent edges
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-900/40" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-repeat bg-[length:50px_50px]" />
            </motion.div>

            {/* Vertical Status Bar (Left Edge) */}
            <div className="absolute left-0 top-0 bottom-0 w-[60px] border-r border-slate-800/50 flex flex-col justify-between items-center py-10 z-20 bg-slate-950/50 backdrop-blur-sm hidden md:flex">
                <div className="text-[11px] font-mono text-blue-400 [writing-mode:vertical-rl] tracking-widest uppercase opacity-70">
                    SNPE System Status: Online
                </div>
                <div className="h-32 w-[1px] bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-50" />
                <div className="text-[11px] font-mono text-slate-300 [writing-mode:vertical-rl] tracking-widest">
                    {time} UTC+9
                </div>
            </div>

            {/* Main Content Grid (12 Columns) */}
            <div className="container-custom h-full grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 pt-24 md:pt-32 pb-10 pl-0 md:pl-[80px]">

                {/* Left Zone: Typography (Columns 1-7) */}
                <motion.div
                    style={{ y, opacity }}
                    className="col-span-1 md:col-span-7 flex flex-col justify-center text-left"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{
                            opacity: 1,
                            x: 0 + mousePosition.x * 10,
                            y: mousePosition.y * 10
                        }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-3 mb-6"
                    >
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                        <span className="text-blue-400 font-mono text-[13px] md:text-sm tracking-[0.2em] uppercase border border-blue-500/30 px-3 py-1 rounded-full bg-blue-500/10 backdrop-blur-md">
                            Next-Gen Engineering
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: mousePosition.x * 20,
                            y: mousePosition.y * 20
                        }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-[42px] md:text-[3vw] font-black leading-[0.9] text-white tracking-tight mb-6 md:mb-8"
                    >
                        DEFINE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                            ABSOLUTE
                        </span> <br />
                        PRECISION
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0 + mousePosition.y * 15,
                            x: mousePosition.x * 15
                        }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-slate-200 text-base md:text-xl font-light max-w-xl leading-relaxed mb-10 md:mb-12 border-l-2 border-blue-500/30 pl-4 md:pl-6"
                    >
                        데이터가 설계하고 AI가 검증하는 초격차 엔지니어링.<br />
                        <span className="text-white font-medium">SNPE</span>가 귀사의 제조 경쟁력을 완벽하게 재정의합니다.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0 + mousePosition.y * 10,
                            x: mousePosition.x * 10
                        }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-wrap gap-4"
                    >
                        <button
                            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-sm transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center gap-2 group"
                        >
                            <Zap size={20} className="group-hover:text-yellow-300 transition-colors" />
                            프로젝트 시작
                        </button>
                        <button
                            onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                            className="px-8 py-4 bg-transparent border border-slate-600 text-slate-300 hover:text-white hover:border-white transition-all font-medium rounded-sm"
                        >
                            솔루션 알아보기
                        </button>
                    </motion.div>
                </motion.div>

                {/* Right Zone: Hologram Cluster (Columns 8-12) */}
                <div className="col-span-1 md:col-span-5 relative hidden md:block">
                    {/* Floating Cards Container */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

                        {/* Card 1: Server Status */}
                        <motion.div
                            initial={{ opacity: 0, x: 100, y: -50 }}
                            animate={{
                                opacity: 1,
                                x: 0 + mousePosition.x * -30,
                                y: 0 + mousePosition.y * -30
                            }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="absolute top-[20%] right-[10%] w-64 p-4 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 border-t-blue-500/50 rounded-lg shadow-2xl z-20"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Server size={16} className="text-blue-400" />
                                    <span className="text-[11px] font-bold text-slate-100">SERVER LOAD</span>
                                </div>
                                <span className="text-[11px] text-green-400">OPTIMAL</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full mb-1">
                                <div className="w-[34%] bg-blue-500 h-1.5 rounded-full animate-pulse" />
                            </div>
                            <div className="text-right text-[11px] text-slate-300 font-mono uppercase tracking-tighter">34% UTILIZED</div>
                        </motion.div>

                        {/* Card 2: Security Shield (Main Focus) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                x: mousePosition.x * -50, // Moves opposite to mouse, faster
                                y: mousePosition.y * -50
                            }}
                            transition={{ duration: 1, delay: 1 }}
                            className="absolute top-[40%] left-[0%] w-72 p-6 bg-slate-800/40 backdrop-blur-2xl border border-cyan-500/30 rounded-xl shadow-[0_0_50px_rgba(34,211,238,0.1)] z-10"
                        >
                            <Shield size={32} className="text-cyan-400 mb-4" />
                            <div className="text-[13px] text-cyan-200 font-medium mb-1">SECURITY PROTOCOL</div>
                            <div className="text-2xl font-black text-white tracking-widest mb-2">LVL. MAX</div>
                            <p className="text-[13px] text-slate-200 leading-snug">
                                실시간 위협 감지 및 자동 방어 시스템 가동 중. 모든 노드 정상 작동.
                            </p>
                        </motion.div>

                        {/* Card 3: Processing Unit */}
                        <motion.div
                            initial={{ opacity: 0, x: 50, y: 100 }}
                            animate={{
                                opacity: 1,
                                x: 0 + mousePosition.x * -40,
                                y: 0 + mousePosition.y * -40
                            }}
                            transition={{ duration: 1, delay: 1.2 }}
                            className="absolute bottom-[20%] right-[5%] w-60 p-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg z-20"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <Cpu size={20} className="text-indigo-400" />
                                <span className="text-[11px] font-bold text-slate-300">AI PROCESSING</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-3xl font-mono text-white">98<span className="text-lg text-slate-300">ms</span></span>
                                <div className="flex gap-1 h-4 items-end">
                                    <span className="w-1 h-2 bg-indigo-500/30" />
                                    <span className="w-1 h-3 bg-indigo-500/50" />
                                    <span className="w-1 h-4 bg-indigo-500 animate-pulse" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Decorative Lines */}
                        <motion.svg
                            className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
                            animate={{
                                x: mousePosition.x * -10,
                                y: mousePosition.y * -10
                            }}
                        >
                            <line x1="60%" y1="45%" x2="80%" y2="25%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" />
                            <line x1="50%" y1="55%" x2="70%" y2="75%" stroke="#22d3ee" strokeWidth="1" strokeDasharray="5,5" />
                        </motion.svg>
                    </div>
                </div>

                {/* Bottom Stats Grid (Absolute Bottom) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                    className="col-span-12 absolute bottom-0 left-0 right-0 border-t border-slate-800/60 bg-slate-950/80 backdrop-blur-md hidden md:grid grid-cols-4 divide-x divide-slate-800/60"
                >
                    {/* ... keep existing buttons ... */}
                    <div className="p-6 flex flex-col items-center justify-center hover:bg-white/5 transition-colors cursor-default group">
                        <span className="text-[11px] text-slate-200 font-mono mb-1 group-hover:text-blue-400 transition-colors">PROJECTS</span>
                        <span className="text-2xl font-black text-white">128+</span>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center hover:bg-white/5 transition-colors cursor-default group">
                        <span className="text-[11px] text-slate-200 font-mono mb-1 group-hover:text-cyan-400 transition-colors">PARTNERS</span>
                        <span className="text-2xl font-black text-white">45+</span>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center hover:bg-white/5 transition-colors cursor-default group">
                        <span className="text-[11px] text-slate-200 font-mono mb-1 group-hover:text-indigo-400 transition-colors">EFFICIENCY</span>
                        <span className="text-2xl font-black text-white">400%</span>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center bg-blue-600/10 hover:bg-blue-600/20 transition-colors cursor-pointer"
                        onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                    >
                        <ChevronDown className="text-blue-400 animate-bounce" />
                        <span className="text-[11px] text-blue-300 font-bold tracking-widest mt-1">SCROLL</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
