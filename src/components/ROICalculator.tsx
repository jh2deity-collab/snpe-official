"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, TrendingUp, DollarSign, Clock, ArrowRight, Info } from "lucide-react";

export default function ROICalculator() {
    const [production, setProduction] = useState(100000);
    const [defectRate, setDefectRate] = useState(5);
    const [laborCost, setLaborCost] = useState(50000000); // 5000만원

    const [savings, setSavings] = useState(0);
    const [efficiencyBoost, setEfficiencyBoost] = useState(0);

    useEffect(() => {
        // Simple logic for simulation
        // SNPE reduces defect rate by 70% and increases productivity by 25%
        const snpeDefectRate = defectRate * 0.3;
        const laborSaving = laborCost * 0.15; // 15% labor efficiency gain
        const defectSaving = (production * (defectRate - snpeDefectRate) / 100) * 1000; // Assume 1000 KRW per unit defect

        setSavings(Math.floor((laborSaving + defectSaving) / 10000) * 10000);
        setEfficiencyBoost(25 + Math.random() * 5);
    }, [production, defectRate, laborCost]);

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-[3rem] p-12 border border-slate-200/60 relative overflow-hidden shadow-2xl shadow-slate-200/50">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[120px] -mr-32 -mt-32" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-16">
                {/* Left: Inputs */}
                <div className="space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <Calculator size={20} />
                            <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">ROI Simulator</h3>
                        </div>
                        <p className="text-slate-500 text-sm font-bold">공정 데이터를 입력하여 SNPE 솔루션 도입 효과를 확인하세요.</p>
                    </div>

                    <div className="space-y-8">
                        {/* Production Volume */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">연간 생산량 (Units)</label>
                                <span className="text-lg font-black text-slate-900">{production.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="10000"
                                max="1000000"
                                step="10000"
                                value={production}
                                onChange={(e) => setProduction(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        {/* Defect Rate */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">현재 불량률 (%)</label>
                                <span className="text-lg font-black text-slate-900">{defectRate}%</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="20"
                                step="0.5"
                                value={defectRate}
                                onChange={(e) => setDefectRate(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        {/* Labor Cost */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">연간 운영 비용 (KRW)</label>
                                <span className="text-lg font-black text-slate-900">{(laborCost / 10000).toLocaleString()}만원</span>
                            </div>
                            <input
                                type="range"
                                min="10000000"
                                max="500000000"
                                step="10000000"
                                value={laborCost}
                                onChange={(e) => setLaborCost(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-2 text-[10px] text-slate-400 italic">
                        <Info size={12} />
                        <span>* 본 수치는 SNPE 솔루션 평균 데이터를 기반으로 한 추정치입니다.</span>
                    </div>
                </div>

                {/* Right: Results */}
                <div className="flex flex-col justify-center">
                    <div className="bg-slate-50/50 rounded-[2.5rem] p-10 border border-slate-200/50 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                        <div className="space-y-12">
                            <div className="text-center space-y-2">
                                <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">Expected Annual Savings</p>
                                <motion.h2
                                    key={savings}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter"
                                >
                                    ₩{(savings / 10000).toLocaleString()}<span className="text-xl">만원</span>
                                </motion.h2>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-5 bg-white border border-slate-200/60 rounded-2xl space-y-3 shadow-sm">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                        <TrendingUp size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Productivity</p>
                                        <p className="text-xl font-black text-primary">+{efficiencyBoost.toFixed(1)}%</p>
                                    </div>
                                </div>
                                <div className="p-5 bg-white border border-slate-200/60 rounded-2xl space-y-3 shadow-sm">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Downtime</p>
                                        <p className="text-xl font-black text-primary">-68%</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" })}
                                className="w-full py-5 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 group hover:shadow-[0_20px_40px_rgba(30,64,175,0.2)] transition-all"
                            >
                                상세 기술 리포트 받기
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
