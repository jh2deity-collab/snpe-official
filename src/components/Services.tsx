"use client";

import { motion } from "framer-motion";
import { Share2, Zap, LayoutGrid, Network, Cpu, ShieldCheck, BarChart3, Database, Wrench } from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";

const services = [
    {
        icon: <Cpu size={32} />,
        title: "Smart Factory",
        desc: "공정 데이터를 실시간으로 수집·분석하여 최적의 생산 효율을 도출하는 지능형 공장 솔루션을 구축합니다.",
        points: ["IoT 센서 데이터 통합", "실시간 공정 모니터링", "예지 보전 시스템"]
    },
    {
        icon: <BarChart3 size={32} />,
        title: "Process Optimization",
        desc: "병목 구간을 정밀 진단하고 시뮬레이션 기반의 최적 설계를 통해 생산성을 극대화합니다.",
        points: ["Digital Twin 시뮬레이션", "L/B (Line Balancing) 최적화", "물류 동선 효율화"]
    },
    {
        icon: <ShieldCheck size={32} />,
        title: "Industrial Safety",
        desc: "현장의 위험 요소를 사전에 감지하고 AI 기반 분석을 통해 안전 사고를 원천 차단합니다.",
        points: ["위험 구역 접근 제어", "작업자 안전 모니터링", "비상 대응 자동화"]
    },
    {
        icon: <Database size={32} />,
        title: "Data Intelligence",
        desc: "축적된 제조 데이터를 자산화하고 AI 알고리즘으로 분석하여 경영 의사결정을 지원합니다.",
        points: ["빅데이터 분석 플랫폼", "AI 품질 검사", "생산 계획 자동 수립"]
    },
    {
        icon: <Wrench size={32} />,
        title: "System Maintenance",
        desc: "24/365 실시간 모니터링 및 즉각적인 장애 대응 체계를 통해 시스템의 안정적인 운영을 보장합니다.",
        points: ["24/7 통합 관제 센터", "실시간 장애 탐지 및 복구", "정기점검 및 성능 최적화"]
    }
];

export default function Services() {
    return (
        <section id="services" className="relative py-32 bg-slate-950 overflow-hidden">
            {/* Deep Space Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/services-bg.png"
                    alt="Service Background"
                    className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
            </div>

            {/* Quantum Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

            <div className="container-custom relative z-10">
                <div className="grid md:grid-cols-12 gap-12 lg:gap-24">
                    {/* Left Zone: Sticky Headline (Col 1-5) */}
                    <div className="md:col-span-5 relative">
                        <div className="sticky top-32 space-y-12">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-8"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-[2px] bg-blue-500 shadow-[0_0_15px_#3b82f6]" />
                                    <span className="text-blue-400 text-xs font-black uppercase tracking-[0.4em] drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">Core Expertise</span>
                                </div>
                                <h2 className="text-4xl md:text-[3vw] font-black text-white tracking-tighter leading-[0.9]">
                                    QUANTUM <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 filter drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">LEAP</span> <br />
                                    SOLUTIONS
                                </h2>
                                <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-md border-l-2 border-slate-800 pl-6">
                                    데이터의 한계를 넘어선 <span className="text-blue-300 font-bold">초격차 기술력</span>. <br />
                                    SNPE는 불가능을 공학적으로 증명합니다.
                                </p>
                            </motion.div>

                            {/* Decorative Tech Elements */}
                            <div className="hidden md:block p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                                <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-4">
                                    <span>SYSTEM_STATUS</span>
                                    <span className="text-green-400">OPERATIONAL</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full w-[80%] bg-blue-500 animate-pulse" />
                                    </div>
                                    <div className="flex justify-between text-[9px] text-slate-600 font-mono">
                                        <span>CPU_LOAD: 80%</span>
                                        <span>NET_TRAFFIC: 12TB/s</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Zone: Holographic Grid (Col 6-12) */}
                    <div className="md:col-span-7 grid gap-6">
                        {services.map((service, idx) => (
                            <TiltCard key={idx} className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_0_50px_rgba(30,64,175,0.2)]">
                                {/* Holographic Edge Effect */}
                                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                                    {/* Icon and Text */}
                                    <div className="relative shrink-0 w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center text-blue-400 border border-white/5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-lg">
                                        {service.icon}
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-black text-slate-100 group-hover:text-cyan-400 transition-colors">{service.title}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-slate-700 pl-4 group-hover:border-blue-500 transition-colors">{service.desc}</p>
                                        <ul className="grid grid-cols-1 gap-2 pt-2">
                                            {service.points.map((point, pIdx) => (
                                                <li key={pIdx} className="flex items-center gap-2 text-xs font-mono text-slate-500 group-hover:text-blue-300 transition-colors">
                                                    <div className="w-1 h-1 bg-blue-500 rounded-full" />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                {/* Corner Accents */}
                                <div className="absolute top-0 right-0 p-4 opacity-50"><Share2 size={16} className="text-slate-700 group-hover:text-blue-500 transition-colors" /></div>
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
