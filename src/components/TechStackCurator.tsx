"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Cpu,
    Settings,
    Database,
    Zap,
    Shield,
    BarChart3,
    Layers,
    ChevronRight,
    CheckCircle2,
    Workflow,
    Activity,
    Server,
    ArrowRight
} from "lucide-react";

type Step = "industry" | "goal" | "priority" | "result";

interface TechItem {
    name: string;
    desc: string;
    icon: React.ReactNode;
    tier: string;
}

export default function TechStackCurator() {
    const [step, setStep] = useState<Step>("industry");
    const [selections, setSelections] = useState({
        industry: "",
        goal: "",
        priority: "",
    });

    const INDUSTRIES = [
        { id: "semi", name: "반도체/디스플레이", icon: <Cpu />, bg: "from-blue-500/10 to-transparent" },
        { id: "auto", name: "자동차/모빌리티", icon: <Settings />, bg: "from-cyan-500/10 to-transparent" },
        { id: "bio", name: "바이오/식음료", icon: <Activity />, bg: "from-emerald-500/10 to-transparent" },
        { id: "gen", name: "일반 제조/기타", icon: <Layers />, bg: "from-indigo-500/10 to-transparent" },
    ];

    const GOALS = [
        { id: "speed", name: "생산 속도 극대화", desc: "고속 사이클 및 리드타임 단축", icon: <Zap /> },
        { id: "quality", name: "품질 무결성 확보", desc: "전수 검사 및 유출 제로화", icon: <Shield /> },
        { id: "data", name: "데이터 통합 관리", desc: "실시간 모니터링 및 추적성", icon: <Database /> },
        { id: "cost", name: "운영 비용 최적화", desc: "인건비 절감 및 에너지 효율", icon: <BarChart3 /> },
    ];

    const getRecommendedStack = (): TechItem[] => {
        const stack: TechItem[] = [];

        // Control Layer
        if (selections.industry === "반도체/디스플레이") {
            stack.push({ name: "High-Speed PLC", desc: "0.1ms 스캔 타임의 초정밀 제어 시스템", icon: <Workflow size={20} />, tier: "Control Layer" });
        } else {
            stack.push({ name: "IPC & Real-time OS", desc: "범용성과 안정성을 겸비한 산업용 PC 제어", icon: <Workflow size={20} />, tier: "Control Layer" });
        }

        // Data Layer
        if (selections.goal === "데이터 통합 관리") {
            stack.push({ name: "Cloud-Based MES", desc: "글로벌 공장 통합 모니터링 및 분석 플랫폼", icon: <Server size={20} />, tier: "Data Layer" });
        } else {
            stack.push({ name: "Edge Computing SCADA", desc: "현장 밀착형 실시간 데이터 수집 및 제어", icon: <Server size={20} />, tier: "Data Layer" });
        }

        // Intelligence Layer
        if (selections.goal === "품질 무결성 확보") {
            stack.push({ name: "Deep Learning Vision", desc: "AI 기반 비정형 크랙 및 불량 검출 모듈", icon: <Cpu size={20} />, tier: "Intelligence Layer" });
        } else {
            stack.push({ name: "Digital Twin & Physcis", desc: "가상 시뮬레이션 기반 공정 최적화 엔진", icon: <Cpu size={20} />, tier: "Intelligence Layer" });
        }

        return stack;
    };

    return (
        <section id="curator" className="py-24 bg-slate-950 relative overflow-hidden">
            <div className="container-custom">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            <span className="w-8 h-[2px] bg-blue-500" />
                            <span className="text-blue-400 text-xs font-black uppercase tracking-[0.3em]">AI Curator</span>
                        </motion.div>
                        <h2 className="text-3xl md:text-[2.4vw] font-black text-white tracking-tighter leading-none">
                            TECH-STACK <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">CURATOR</span>
                        </h2>
                    </div>
                    <p className="text-slate-400 font-medium max-w-sm text-right hidden md:block">
                        산업군과 비즈니스 목표에 가장 적합한 <br />
                        하드웨어 및 소프트웨어 조합을 지능적으로 제안합니다.
                    </p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl min-h-[500px] flex flex-col">
                    {/* Progress Bar */}
                    <div className="flex border-b border-white/5 bg-slate-900/30">
                        {["INDUSTRY", "GOAL", "PRIORITY", "RESULT"].map((label, idx) => (
                            <div
                                key={label}
                                className={`flex-1 py-4 text-center text-[10px] font-black tracking-[0.2em] transition-colors ${(step === "industry" && idx === 0) ||
                                        (step === "goal" && idx === 1) ||
                                        (step === "priority" && idx === 2) ||
                                        (step === "result" && idx === 3)
                                        ? "text-blue-400" : "text-slate-600"
                                    }`}
                            >
                                {label}
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            {step === "industry" && (
                                <motion.div
                                    key="industry"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-8"
                                >
                                    <h3 className="text-2xl font-black text-white text-center mb-12">대상 산업군을 선택해 주세요</h3>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                        {INDUSTRIES.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    setSelections({ ...selections, industry: item.name });
                                                    setStep("goal");
                                                }}
                                                className={`group relative p-8 bg-slate-900/50 border-2 border-slate-800 rounded-3xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 text-center overflow-hidden`}
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-b ${item.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
                                                <div className="relative z-10 flex flex-col items-center gap-6">
                                                    <div className="p-5 bg-slate-950 rounded-2xl text-slate-500 group-hover:text-blue-400 group-hover:bg-slate-900 transition-all">
                                                        {item.icon}
                                                    </div>
                                                    <span className="text-sm font-black text-slate-300 group-hover:text-white transition-colors">{item.name}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === "goal" && (
                                <motion.div
                                    key="goal"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="space-y-8"
                                >
                                    <h3 className="text-2xl font-black text-white text-center mb-12">가장 중요한 핵심 가치는 무엇입니까?</h3>
                                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                        {GOALS.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    setSelections({ ...selections, goal: item.name });
                                                    setStep("result");
                                                }}
                                                className="group flex items-center gap-6 p-8 bg-slate-900/50 border border-white/5 rounded-3xl hover:border-blue-500/30 hover:bg-blue-500/5 transition-all"
                                            >
                                                <div className="w-14 h-14 bg-slate-950 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                                                    {item.icon}
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-lg font-black text-white leading-tight mb-1">{item.name}</p>
                                                    <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                                                </div>
                                                <ChevronRight className="ml-auto text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === "result" && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-12"
                                >
                                    <div className="text-center space-y-4">
                                        <div className="inline-block px-4 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                                            Recommended Strategy
                                        </div>
                                        <h3 className="text-3xl font-black text-white tracking-tight">지능형 제조 테크 스택 제안</h3>
                                        <p className="text-slate-400 text-sm font-medium">
                                            {selections.industry} 분야의 {selections.goal}을(를) 위한 최적의 엔지니어링 조합입니다.
                                        </p>
                                    </div>

                                    <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                                        {getRecommendedStack().map((item, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="p-8 bg-slate-950 border border-white/5 rounded-[2rem] space-y-6 relative overflow-hidden group"
                                            >
                                                <div className="text-[10px] font-black text-blue-500/60 uppercase tracking-widest">{item.tier}</div>
                                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                                    {item.icon}
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="text-xl font-black text-white underline underline-offset-8 decoration-blue-500/30">{item.name}</h4>
                                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                    <CheckCircle2 size={40} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
                                        <button
                                            onClick={() => setStep("industry")}
                                            className="px-8 py-4 bg-slate-900 border border-white/10 text-slate-300 font-bold rounded-2xl hover:bg-slate-800 transition-all text-sm"
                                        >
                                            다시 설계하기
                                        </button>
                                        <button
                                            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                                            className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 shadow-xl shadow-blue-500/20 transition-all flex items-center gap-3 text-sm group"
                                        >
                                            상세 견적 문의하기
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
