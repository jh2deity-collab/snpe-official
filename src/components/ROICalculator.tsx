"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, TrendingUp, Clock, ArrowRight, Info, Download, Loader2, FileText, AlertCircle, X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ROICalculator() {
    const [production, setProduction] = useState(100000);
    const [defectRate, setDefectRate] = useState(5);
    const [laborCost, setLaborCost] = useState(50000000); // 5000만원

    const [savings, setSavings] = useState(0);
    const [efficiencyBoost, setEfficiencyBoost] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);

    // Contact State
    const [company, setCompany] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [showValidation, setShowValidation] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    // Auto-hide alert
    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => setShowAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    useEffect(() => {
        // Simple logic for simulation
        // SNPE reduces defect rate by 70% and increases productivity by 25%
        const snpeDefectRate = defectRate * 0.3;
        const laborSaving = laborCost * 0.15; // 15% labor efficiency gain
        const defectSaving = (production * (defectRate - snpeDefectRate) / 100) * 1000; // Assume 1000 KRW per unit defect

        setSavings(Math.floor((laborSaving + defectSaving) / 10000) * 10000);
        setEfficiencyBoost(25 + Math.random() * 5);
    }, [production, defectRate, laborCost]);

    const handleDownloadReport = async () => {
        // Validation check
        if (!name || !phone) {
            setShowValidation(true);
            setShowAlert(true);
            return;
        }

        setIsGenerating(true);
        setShowValidation(false);

        // Simulate processing delay for effect
        await new Promise(resolve => setTimeout(resolve, 1500));

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // 1. Header
        doc.setFillColor(15, 23, 42); // Slate 950
        doc.rect(0, 0, pageWidth, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("SNPE PROCESS OPTIMIZATION", 20, 20);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(148, 163, 184); // Slate 400
        doc.text(`Reference ID: REF-${Math.floor(Math.random() * 100000)}`, 20, 27);
        doc.text(`Client: ${name} (${company || "N/A"})`, 20, 33);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 20, 33, { align: "right" });

        // 2. Executive Summary
        doc.setTextColor(51, 65, 85); // Slate 700
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("1. Executive Summary", 20, 55);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const summaryText = `Based on the simulation parameters provided, integrating SNPE's AI-driven process automation is projected to deliver significant operational improvements. The analysis indicates a potential annual saving of ${(savings / 10000).toLocaleString()}0,000 KRW, driven primarily by a ${efficiencyBoost.toFixed(1)}% increase in productivity and a drastic reduction in defect rates. We recommend an immediate technical feasibility study to realize these gains.`;
        doc.text(doc.splitTextToSize(summaryText, pageWidth - 40), 20, 65);

        // 3. Input Parameters (Table)
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("2. Simulation Parameters", 20, 95);

        autoTable(doc, {
            startY: 100,
            head: [['Parameter', 'Value', 'Unit']],
            body: [
                ['Client Name', name, 'Individual'],
                ['Company', company || 'N/A', 'Organization'],
                ['Annual Production', production.toLocaleString(), 'Units'],
                ['Current Defect Rate', `${defectRate}%`, 'Percentage'],
                ['Operational Cost', `${(laborCost / 10000).toLocaleString()}만원`, 'KRW/Year'],
            ],
            headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
            bodyStyles: { textColor: 50 },
            theme: 'grid',
        });

        // 4. ROI Projections (Table)
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        // @ts-ignore
        doc.text("3. ROI Projections", 20, doc.lastAutoTable.finalY + 20);

        autoTable(doc, {
            // @ts-ignore
            startY: doc.lastAutoTable.finalY + 25,
            head: [['Metric', 'Impact', 'Projected Value']],
            body: [
                ['Total Annual Savings', 'POSITIVE', `KRW ${(savings / 10000).toLocaleString()}0,000`],
                ['Productivity Boost', 'INCREASE', `+${efficiencyBoost.toFixed(1)}%`],
                ['Defect Reduction', 'DECREASE', '-70% (Estimated)'],
                ['Downtime Reduction', 'DECREASE', '-68% (Estimated)'],
            ],
            headStyles: { fillColor: [6, 182, 212], textColor: 255, fontStyle: 'bold' }, // Cyan 500
            alternateRowStyles: { fillColor: [240, 253, 250] },
            theme: 'striped',
        });

        // 5. Footer
        const footerY = 270;
        doc.setLineWidth(0.5);
        doc.setDrawColor(200);
        doc.line(20, footerY, pageWidth - 20, footerY);

        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text("SNPE Official | Intelligent Process Automation", 20, footerY + 10);
        doc.text("Contact: optimization@snpe.com", pageWidth - 20, footerY + 10, { align: "right" });

        // Send notification to ok@snpe.kr
        try {
            await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    company,
                    name,
                    phone,
                    content: `[ROI 리포트 다운로드 알림]\n연간 예상 절감액: ₩${(savings / 10000).toLocaleString()}만원\n생산성 향상: +${efficiencyBoost.toFixed(1)}%\n연간 생산량: ${production.toLocaleString()} Units\n\n해당 고객이 시뮬레이션 리포트를 다운로드했습니다.`
                }),
            });
        } catch (e) {
            console.error("Failed to send ROI download notification", e);
        }

        doc.save("SNPE_Optimization_Report.pdf");
        setIsGenerating(false);
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] p-12 border border-white/5 relative overflow-hidden shadow-2xl">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[120px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[120px] -ml-32 -mb-32" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-16">
                {/* Left: Inputs */}
                <div className="space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <Calculator size={20} className="animate-pulse" />
                            <h3 className="text-xl font-black uppercase tracking-widest text-white">ROI Simulator</h3>
                        </div>
                        <p className="text-slate-400 text-sm font-bold border-l-2 border-primary/30 pl-4">공정 데이터를 입력하여 SNPE 솔루션 도입 효과를 확인하세요.</p>
                    </div>

                    <div className="space-y-8">
                        {/* Production Volume */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">연간 생산량 (Units)</label>
                                <span className="text-lg font-black text-white">{production.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="10000"
                                max="1000000"
                                step="10000"
                                value={production}
                                onChange={(e) => setProduction(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        {/* Defect Rate */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">현재 불량률 (%)</label>
                                <span className="text-lg font-black text-white">{defectRate}%</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="20"
                                step="0.5"
                                value={defectRate}
                                onChange={(e) => setDefectRate(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        {/* Labor Cost */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">연간 운영 비용 (KRW)</label>
                                <span className="text-lg font-black text-white">{(laborCost / 10000).toLocaleString()}만원</span>
                            </div>
                            <input
                                type="range"
                                min="10000000"
                                max="500000000"
                                step="10000000"
                                value={laborCost}
                                onChange={(e) => setLaborCost(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        {/* Contact Form Section */}
                        <div className="pt-8 border-t border-white/5 space-y-6">
                            <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-4">리포트 수령 정보</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-widest ml-1">성함 *</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="홍길동"
                                        className={`w-full px-4 py-3 bg-slate-950 border ${showValidation && !name ? "border-red-400 ring-4 ring-red-400/5" : "border-slate-800"} rounded-xl text-sm font-bold text-white focus:border-primary focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-widest ml-1">연락처 *</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            let formatted = val;
                                            if (val.length > 3 && val.length <= 7) {
                                                formatted = `${val.slice(0, 3)}-${val.slice(3)}`;
                                            } else if (val.length > 7) {
                                                formatted = `${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7, 11)}`;
                                            }
                                            setPhone(formatted);
                                        }}
                                        placeholder="010-0000-0000"
                                        className={`w-full px-4 py-3 bg-slate-950 border ${showValidation && !phone ? "border-red-400 ring-4 ring-red-400/5" : "border-slate-800"} rounded-xl text-sm font-bold text-white focus:border-primary focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner`}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-widest ml-1">회사명</label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    placeholder="(주) SNPE"
                                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:border-primary focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-2 text-[11px] text-slate-200 italic">
                        <Info size={12} className="text-primary" />
                        <span>* 본 수치는 SNPE 솔루션 평균 데이터를 기반으로 한 추정치입니다.</span>
                    </div>
                </div>

                {/* Right: Results */}
                <div className="flex flex-col justify-center">
                    <div className="bg-slate-950/50 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden shadow-inner">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                        <div className="space-y-8">
                            <div className="text-center space-y-2">
                                <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">Expected Annual Savings</p>
                                <motion.h2
                                    key={savings}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                >
                                    ₩{(savings / 10000).toLocaleString()}<span className="text-xl text-slate-300 ml-1">만원</span>
                                </motion.h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl space-y-2 shadow-sm group hover:border-primary/30 transition-colors">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <TrendingUp size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Productivity</p>
                                        <p className="text-xl font-black text-primary">+{efficiencyBoost.toFixed(1)}%</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl space-y-2 shadow-sm group hover:border-primary/30 transition-colors">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Downtime</p>
                                        <p className="text-xl font-black text-primary">-68%</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleDownloadReport}
                                disabled={isGenerating}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black flex items-center justify-center gap-3 group hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        GENERATING REPORT...
                                    </>
                                ) : (
                                    <>
                                        <FileText size={18} />
                                        DOWNLOAD PDF REPORT
                                        <Download size={18} className="group-hover:translate-y-1 transition-transform opacity-50" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[11px] text-slate-300 font-medium tracking-wide">
                                * Detailed technical analysis included
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Validation Alert */}
            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-sm"
                    >
                        <div className="bg-slate-900/95 backdrop-blur-2xl border border-red-500/30 p-5 rounded-2xl shadow-[0_20px_50px_rgba(239,68,68,0.2)] flex items-center gap-4 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-400 shrink-0 border border-red-500/20">
                                <AlertCircle size={24} className="animate-pulse" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-black text-sm uppercase tracking-tight">INPUT REQUIRED</h4>
                                <p className="text-slate-400 text-xs font-bold leading-relaxed">
                                    리포트 생성을 위해 <span className="text-red-400">성함과 연락처</span>를 정확히 입력해 주세요.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowAlert(false)}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

