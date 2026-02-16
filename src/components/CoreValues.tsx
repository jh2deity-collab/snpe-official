"use client";

import { motion } from "framer-motion";
import { Database, Zap, Globe, Cpu, Server, Activity } from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";

export default function CoreValues() {
    return (
        <section id="why-snpe" className="section-padding bg-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-900/10 to-transparent" />
            </div>

            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    {/* Left: Text Content */}
                    <div className="space-y-16">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-4"
                            >
                                <div className="w-12 h-[2px] bg-cyan-500 shadow-[0_0_10px_#22d3ee]" />
                                <span className="text-cyan-400 text-xs font-black uppercase tracking-[0.4em]">Core Value</span>
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-[3vw] font-black text-white tracking-tighter leading-none"
                            >
                                WHY <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 filter drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">SNPE?</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg border-l-2 border-slate-800 pl-6"
                            >
                                단순한 자동화를 넘어섭니다.<br />
                                <span className="text-white font-bold">데이터 주도형 엔지니어링</span>으로<br />
                                생산 시스템의 지능을 깨웁니다.
                            </motion.p>
                        </div>

                        <div className="space-y-8">
                            {[
                                {
                                    title: "Total Integration",
                                    desc: "기획부터 유지보수까지, 파편화된 공정을 하나의 유기적인 시스템으로 통합합니다.",
                                    icon: <Globe size={24} />,
                                    color: "text-blue-400"
                                },
                                {
                                    title: "Hyper-Customization",
                                    desc: "획일화된 솔루션이 아닌, 귀사의 현장 특성에 100% 최적화된 맞춤 설계를 제공합니다.",
                                    icon: <Cpu size={24} />,
                                    color: "text-cyan-400"
                                },
                                {
                                    title: "Rapid Response",
                                    desc: "대전 본사를 거점으로 중부권 전체에 즉각적인 기술 지원과 트러블 슈팅을 보장합니다.",
                                    icon: <Zap size={24} />,
                                    color: "text-indigo-400"
                                },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + idx * 0.1 }}
                                    className="flex gap-6 group"
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-14 h-14 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-900/10 transition-all duration-300">
                                            <div className={`${item.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                                                {item.icon}
                                            </div>
                                        </div>
                                        {/* Connector Line */}
                                        {idx !== 2 && <div className="absolute left-7 top-14 w-[1px] h-12 bg-slate-800 group-hover:bg-blue-500/30 transition-colors" />}
                                    </div>
                                    <div className="pt-2">
                                        <h4 className="text-xl font-black text-slate-200 group-hover:text-white transition-colors mb-2">{item.title}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Visual Dashboard */}
                    <div className="relative hidden lg:block">
                        {/* Main Holographic Panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <TiltCard className="relative z-10 bg-slate-900/80 backdrop-blur-2xl border border-slate-700 p-8 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                                <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                                    <div className="flex items-center gap-3">
                                        <Activity className="text-green-500" size={20} />
                                        <span className="text-sm font-bold text-white tracking-widest">ENG_PARTNER_DASHBOARD</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-slate-800" />
                                        <div className="w-3 h-3 rounded-full bg-slate-800" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800">
                                        <div className="flex justify-between text-xs font-mono text-slate-500 mb-2">
                                            <span>OPTIMIZATION LEVEL</span>
                                            <span className="text-cyan-400">99.9%</span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full w-[99.9%] bg-cyan-500 shadow-[0_0_10px_#22d3ee]" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                                            <Server className="text-blue-500 mx-auto mb-3" size={24} />
                                            <div className="text-2xl font-black text-white">24/7</div>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Monitoring</div>
                                        </div>
                                        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                                            <Database className="text-indigo-500 mx-auto mb-3" size={24} />
                                            <div className="text-2xl font-black text-white">0%</div>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Data Loss</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        "SNPE는 단순한 공급자가 아닙니다.<br />
                                        귀사의 생산 라인이 가질 수 있는<br />
                                        <span className="text-white font-bold">최대의 가치</span>를 함께 발굴하는 파트너입니다."
                                    </p>
                                </div>
                            </TiltCard>
                        </motion.div>

                        {/* Background Decoration */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/20 blur-[100px] -z-10 rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}
